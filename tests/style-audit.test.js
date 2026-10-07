'use strict';
/* Computed-style audit. Everything else in this suite asserts on source text,
   which cannot see what the cascade actually resolves to. These tests render the
   real page in a phone viewport and read getComputedStyle, so a rule that is
   overridden, shadowed or unprintable fails here instead of on a device.

   Dependency-free by design: this project has no package.json, no build step and
   no node_modules, so the browser is driven over Chrome's --remote-debugging-pipe
   (file descriptors 3/4) rather than through a WebSocket library. If no Chrome
   build is available every test here skips, so the suite still passes elsewhere. */
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.join(__dirname, '..');

const CHROME_CANDIDATES = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const chromePath = CHROME_CANDIDATES.find(p => { try { fs.accessSync(p, fs.constants.X_OK); return true; } catch (e) { return false; } });
const VIEWPORT = { width: 393, height: 852 };

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/manifest+json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8'
};

const wait = ms => new Promise(r => setTimeout(r, ms));
let server = null;
let chrome = null;
let cdp = null;
let baseUrl = null;
let startup = null;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'em-style-audit-'));

function withTimeout(promise, ms, label) {
    let timer;
    return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label + ' timed out after ' + ms + 'ms')), ms); })
    ]);
}

function startServer() {
    return new Promise((resolve, reject) => {
        server = http.createServer((req, res) => {
            const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
            const file = path.join(root, rel);
            if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
            fs.readFile(file, (err, buf) => {
                if (err) { res.writeHead(404).end('not found'); return; }
                /* A style audit must never read a cached stylesheet: a stale
                   asset silently invalidates every measurement below. */
                res.writeHead(200, {
                    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
                    'Cache-Control': 'no-store, no-cache, must-revalidate'
                });
                res.end(buf);
            });
        });
        server.on('error', reject);
        server.listen(0, '127.0.0.1', () => resolve(server.address().port));
    });
}

/* Chrome over the debugging pipe: no WebSocket library needed. CDP attaches to
   the browser endpoint, so page domains require a flattened target session. */
function openPipe() {
    return new Promise((resolve, reject) => {
        const proc = spawn(chromePath, [
            '--headless=new', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check',
            '--disable-background-networking', '--disable-sync', '--disable-extensions',
            '--user-data-dir=' + userDataDir, 'about:blank'
        ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
        const toBrowser = proc.stdio[3];
        const fromBrowser = proc.stdio[4];
        let buf = Buffer.alloc(0);
        const pend = new Map();
        let seq = 0;
        let sessionId = null;
        const rejectAll = err => { pend.forEach(p => p({ error: { message: err } })); pend.clear(); };

        fromBrowser.on('data', chunk => {
            buf = Buffer.concat([buf, chunk]);
            for (;;) {
                const end = buf.indexOf(0);
                if (end === -1) break;
                const line = buf.slice(0, end).toString();
                buf = buf.slice(end + 1);
                try {
                    const msg = JSON.parse(line);
                    if (msg.id && pend.has(msg.id)) { pend.get(msg.id)(msg); pend.delete(msg.id); }
                } catch (e) { /* not a CDP frame */ }
            }
        });
        proc.on('error', err => rejectAll(err.message));
        proc.on('exit', code => rejectAll('Chrome exited with code ' + code));
        chrome = proc;

        const send = (method, params = {}, useSession) => new Promise((res, rej) => {
            const id = ++seq;
            const timer = setTimeout(() => { pend.delete(id); rej(new Error(method + ' timed out')); }, 20000);
            pend.set(id, msg => { clearTimeout(timer); res(msg); });
            const frame = { id, method, params };
            if (useSession && sessionId) frame.sessionId = sessionId;
            try { toBrowser.write(JSON.stringify(frame) + '\0'); } catch (e) { clearTimeout(timer); rej(e); }
        });
        send.setSession = value => { sessionId = value; };
        resolve(send);
    });
}

async function ensureBrowser() {
    if (startup) return startup;
    startup = (async () => {
        if (!chromePath) return { skip: 'no Chrome build found on this machine' };
        const port = await startServer();
        baseUrl = 'http://127.0.0.1:' + port + '/index.html';
        cdp = await openPipe();
        const targets = await cdp('Target.getTargets');
        const page = targets.result.targetInfos.find(t => t.type === 'page');
        const attached = await cdp('Target.attachToTarget', { targetId: page.targetId, flatten: true });
        const session = attached.result.sessionId;
        /* Page domains only exist on the attached target, so route every later
           call through the flattened session. */
        cdp.setSession(session);
        const pipe = cdp;
        cdp = (method, params = {}) => pipe(method, params, true);
        await cdp('Page.enable');
        await cdp('Runtime.enable');
        await cdp('Network.setCacheDisabled', { cacheDisabled: true });
        /* The app precaches its own shell, so without this the worker keeps
           serving a previous release and every measurement below is fiction. */
        await cdp('Network.setBypassServiceWorker', { bypass: true });
        await cdp('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 2, mobile: true });
        return { skip: null };
    })();
    return startup;
}

async function evaluate(expression) {
    const r = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.error) return { __error: r.error.message };
    if (r.result && r.result.exceptionDetails) return { __error: String(r.result.exceptionDetails.text || 'exception') };
    return r.result && r.result.result ? r.result.result.value : undefined;
}

/* Loads the app with a clean storage state: a worker left over from a previous
   release would serve stale assets and invalidate every measurement. */
async function load(hash, settle = 2400) {
    await cdp('Page.navigate', { url: baseUrl + (hash || '') });
    await wait(settle);
    await evaluate(`(function () {
        if (!navigator.serviceWorker) return 'no sw';
        return Promise.all([
            navigator.serviceWorker.getRegistrations().then(function (rs) {
                return Promise.all(rs.map(function (r) { return r.unregister(); }));
            }),
            window.caches ? caches.keys().then(function (ks) {
                return Promise.all(ks.map(function (k) { return caches.delete(k); }));
            }) : Promise.resolve()
        ]).then(function () { return 'cleared'; });
    })()`);
    await evaluate(`localStorage.clear(); sessionStorage.clear();`);
    await cdp('Page.navigate', { url: baseUrl + (hash || '') });
    await wait(settle);
    return evaluate(`(function () {
        var d = document.getElementById('disclaimerOverlay');
        if (d && !d.hidden) {
            var c = document.getElementById('disclaimerCheck');
            c.checked = true;
            c.dispatchEvent(new Event('change', { bubbles: true }));
            document.getElementById('disclaimerAcceptBtn').click();
        }
        return d ? (d.hidden ? 'accepted' : 'open') : 'absent';
    })()`);
}

function alphaOf(rgb) {
    const m = String(rgb).match(/rgba?\([^)]*?,\s*([\d.]+)\s*\)/);
    return m ? Number(m[1]) : 1;
}
function asNumber(v, what) {
    assert.equal(typeof v, 'number', what + ' should be a number, got ' + JSON.stringify(v));
    return v;
}

/* Every test shares one browser; each opts in via this so a missing Chrome
   skips instead of failing or hanging. */
async function ready(t) {
    const state = await withTimeout(ensureBrowser(), 40000, 'browser setup');
    if (state.skip) { t.skip(state.skip); return false; }
    return true;
}

test.after(() => {
    try { if (chrome) chrome.kill(); } catch (e) { /* already gone */ }
    try { if (server) server.close(); } catch (e) { /* already closed */ }
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) { /* best effort */ }
});

test('the phone header is not shaved and its controls are exactly 44px', async t => {
    if (!await ready(t)) return;
    assert.equal(await load('#', 3000), 'accepted');
    const res = await evaluate(`(function () {
        var bar = document.querySelector('.topbar');
        return {
            clipped: bar.scrollHeight > bar.clientHeight + 2,
            scrollHeight: bar.scrollHeight, clientHeight: bar.clientHeight,
            burger: document.getElementById('burgerBtn').getBoundingClientRect().height,
            search: document.querySelector('.searchwrap').getBoundingClientRect().height,
            tools: document.getElementById('toolsToggle').getBoundingClientRect().height
        };
    })()`);
    assert.ok(!res.clipped, 'top bar is clipped: ' + res.scrollHeight + ' > ' + res.clientHeight);
    assert.equal(asNumber(res.burger, 'burger height'), 44, 'burger must be a 44px target');
    assert.equal(asNumber(res.search, 'search height'), 44, 'search field must be a 44px target');
    assert.equal(asNumber(res.tools, 'tools height'), 44, 'reading settings must be a 44px target');
});

test('the tab bar cannot show ECG tracings through it', async t => {
    if (!await ready(t)) return;
    await load('#ecg');
    const light = await evaluate(`(function () {
        var cs = getComputedStyle(document.querySelector('.ios-tabbar-inner'));
        return { bg: cs.backgroundColor, blur: cs.backdropFilter };
    })()`);
    assert.ok(alphaOf(light.bg) >= 0.94, 'light tab bar alpha ' + alphaOf(light.bg) + ' shows content behind it');
    assert.doesNotMatch(String(light.blur), /blur\(2\d+px\)|blur\(3\d+px\)/,
        'heavy blur smears a QRS complex behind a nav control: ' + light.blur);
    await evaluate(`document.documentElement.setAttribute('data-theme', 'dark')`);
    await wait(300);
    const dark = await evaluate(`getComputedStyle(document.querySelector('.ios-tabbar-inner')).backgroundColor`);
    assert.ok(alphaOf(dark) >= 0.94, 'dark tab bar alpha ' + alphaOf(dark) + ' shows content behind it');
    await evaluate(`document.documentElement.setAttribute('data-theme', 'light')`);
});

test('the seven-step rail is scrollable and says so', async t => {
    if (!await ready(t)) return;
    await load('#ecg');
    const rail = await evaluate(`(function () {
        var n = document.querySelector('.ecg-step-nav');
        var cs = getComputedStyle(n);
        var meter = document.getElementById('stepRailProgress');
        return {
            scrollWidth: n.scrollWidth, clientWidth: n.clientWidth,
            chips: n.querySelectorAll('.ecg-step-chip').length,
            mask: cs.maskImage || cs.webkitMaskImage || 'none',
            meterVisible: !!meter && getComputedStyle(meter).display !== 'none'
        };
    })()`);
    assert.equal(rail.chips, 8, 'the rail must offer seven steps plus the pattern library');
    assert.ok(rail.scrollWidth > rail.clientWidth, 'the rail does not overflow, so this proves nothing');
    assert.notEqual(rail.mask, 'none', 'a trailing fade is what signals there is more to scroll');
    assert.ok(rail.meterVisible, 'the progress meter must be present and visible');
    const reached = await evaluate(`(function () {
        var n = document.querySelector('.ecg-step-nav');
        n.scrollLeft = n.scrollWidth;
        n.dispatchEvent(new Event('scroll'));
        return new Promise(function (r) {
            setTimeout(function () {
                var cs = getComputedStyle(n);
                r({ atEnd: n.classList.contains('at-end'), mask: cs.maskImage || cs.webkitMaskImage || 'none' });
            }, 350);
        });
    })()`);
    assert.ok(reached.atEnd, 'reaching the end of the rail must be detected');
    assert.equal(reached.mask, 'none', 'the fade must lift once the rail is fully scrolled');
    const jumped = await evaluate(`(function () {
        location.hash = '#ecg~toxic-metabolic-mimics';
        return new Promise(function (r) {
            setTimeout(function () {
                var n = document.querySelector('.ecg-step-nav');
                var chip = n.querySelector('.ecg-step-chip.active');
                if (!chip) return r({ found: false });
                var nr = n.getBoundingClientRect(), cr = chip.getBoundingClientRect();
                r({ found: true, inView: cr.left >= nr.left - 2 && cr.right <= nr.right + 2 });
            }, 1900);
        });
    })()`);
    assert.ok(jumped.found, 'the last step must be marked current when navigated to');
    assert.ok(jumped.inView, 'the active step chip must scroll into view but stayed off-screen');
});

test('the severity filter reads as a button and its popup fits', async t => {
    if (!await ready(t)) return;
    await load('#');
    const res = await evaluate(`(function () {
        var d = document.querySelector('.context-filters');
        var s = d.querySelector('summary');
        var r = s.getBoundingClientRect();
        d.open = true;
        var pop = d.querySelector('.chips').getBoundingClientRect();
        return {
            height: r.height, width: r.width,
            icon: !!s.querySelector('.cf-ico'), caret: !!s.querySelector('.cf-caret'),
            display: getComputedStyle(s).display,
            popRight: pop.right, popWidth: pop.width, viewport: window.innerWidth
        };
    })()`);
    /* student-learning.js relocates this element out of the topbar, so the probe
       must select it directly rather than by ancestor. */
    assert.ok(asNumber(res.height, 'filter trigger height') >= 44, 'filter trigger is only ' + res.height + 'px tall');
    assert.ok(res.icon && res.caret, 'the filter needs an icon and a chevron to read as a control');
    assert.equal(res.display, 'inline-flex', 'icon, label and caret must lay out inline');
    assert.ok(res.popRight <= res.viewport + 1, 'the severity popup overflows the viewport');
    assert.ok(asNumber(res.popWidth, 'popup width') > asNumber(res.width, 'trigger width'),
        'the popup should be wider than its trigger');
});

test('closed sidebar groups advertise that they expand', async t => {
    if (!await ready(t)) return;
    await load('#');
    await evaluate(`document.getElementById('burgerBtn').click()`);
    await wait(700);
    const res = await evaluate(`(function () {
        var sums = Array.prototype.slice.call(document.querySelectorAll('.side-group > summary'));
        function caret(s) { return parseFloat(getComputedStyle(s, '::before').width) || 0; }
        var closed = sums.filter(function (s) { return !s.parentElement.open; });
        var open = sums.filter(function (s) { return s.parentElement.open; });
        return {
            total: sums.length, closed: closed.length,
            closedWithCaret: closed.filter(function (s) { return caret(s) > 0; }).length,
            openCaret: open.length ? caret(open[0]) : 0
        };
    })()`);
    assert.ok(res.total > 1, 'the drawer should have several groups');
    assert.ok(res.closed > 0, 'no closed group found, so this assertion proves nothing');
    assert.equal(res.closedWithCaret, res.closed, 'closed groups render no disclosure caret and look like dead text');
    assert.ok(res.openCaret > 0, 'the open group needs a caret too');
    await evaluate(`document.getElementById('sideBackdrop').click()`);
    await wait(400);
});

test('the tab bar never floats over a blocking dialog', async t => {
    if (!await ready(t)) return;
    await load('#');
    const z = await evaluate(`(function () {
        function z(sel) { var e = document.querySelector(sel); return e ? parseInt(getComputedStyle(e).zIndex, 10) : null; }
        return { tabbar: z('.ios-tabbar'), sidebar: z('.sidebar'), backdrop: z('.side-backdrop'), disclaimer: z('.disclaimer-overlay') };
    })()`);
    assert.ok(z.tabbar < z.disclaimer, 'tab bar ' + z.tabbar + ' must sit below the disclaimer ' + z.disclaimer);
    assert.ok(z.tabbar < z.sidebar, 'tab bar must sit below the drawer ' + z.sidebar);
    assert.ok(z.tabbar < z.backdrop, 'tab bar must sit below the drawer backdrop');
    const hit = await evaluate(`(function () {
        var ov = document.getElementById('disclaimerOverlay');
        if (!ov) return { noOverlay: true };
        ov.hidden = false;
        var r = document.querySelector('.ios-tabbar').getBoundingClientRect();
        var top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { covered: !!(top && top.closest('#disclaimerOverlay')), tag: top ? top.tagName : null };
    })()`);
    assert.ok(hit.covered, 'the tab bar sits on top of the disclaimer (tap landed on ' + hit.tag + ')');
    await evaluate(`(function () { var ov = document.getElementById('disclaimerOverlay'); if (ov) ov.hidden = true; }()`);
});

test('no horizontal page overflow at common phone widths', async t => {
    if (!await ready(t)) return;
    await load('#');
    for (const width of [320, 360, 393, 430]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 2, mobile: true });
        await wait(600);
        const res = await evaluate(`(function () {
            var bar = document.querySelector('.ios-tabbar-inner');
            return {
                page: document.documentElement.scrollWidth, viewport: window.innerWidth,
                tabbar: bar.scrollWidth, tabbarBox: Math.ceil(bar.getBoundingClientRect().width)
            };
        })()`);
        assert.ok(res.page <= res.viewport + 1, width + 'px: page scrolls horizontally (' + res.page + ' > ' + res.viewport + ')');
        assert.ok(res.tabbar <= res.tabbarBox + 1, width + 'px: the tab bar overflows its own bar');
    }
    await cdp('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 2, mobile: true });
});

test('print output carries none of the phone chrome', async t => {
    if (!await ready(t)) return;
    await load('#ecg');
    await cdp('Emulation.setEmulatedMedia', { media: 'print' });
    await wait(600);
    const res = await evaluate(`(function () {
        function show(sel) { var e = document.querySelector(sel); return e ? getComputedStyle(e).display : 'absent'; }
        return {
            tabbar: show('.ios-tabbar'), rail: show('.ecg-step-nav'), meter: show('.step-rail-meter'),
            stagePadding: getComputedStyle(document.querySelector('.main .stage')).paddingBottom
        };
    })()`);
    await cdp('Emulation.setEmulatedMedia', { media: '' });
    assert.equal(res.tabbar, 'none', 'the tab bar must not print');
    assert.equal(res.rail, 'none', 'the horizontal step rail must not print, including on narrow paper');
    assert.equal(res.meter, 'none', 'the step rail progress meter must not print');
    assert.equal(res.stagePadding, '0px', 'the mobile tab-bar clearance must not add blank space when printing');
});

test('sticky offsets follow the real header height', async t => {
    if (!await ready(t)) return;
    /* --topbar-h drives the reading progress bar and the desktop section rail.
       It used to be written onto .read-progress only, so the rail kept reading
       a hard-coded 73px while the real bar was 75px. */
    for (const [label, width] of [['phone', 393], ['desktop', 1280]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height: 852, deviceScaleFactor: 2, mobile: width < 900 });
        await load('#chest-pain');
        const res = await evaluate(`(function () {
            var bar = document.querySelector('.topbar');
            var rp = document.querySelector('.read-progress');
            return {
                real: Math.round(bar.getBoundingClientRect().height),
                rootVar: getComputedStyle(document.documentElement).getPropertyValue('--topbar-h').trim(),
                inlineVar: rp ? rp.style.getPropertyValue('--topbar-h') : '',
                progressTop: rp ? getComputedStyle(rp).top : null
            };
        })()`);
        assert.equal(res.inlineVar, '',
            label + ': --topbar-h must live on :root only, not on a single element');
        assert.equal(res.rootVar, res.real + 'px',
            label + ': --topbar-h is ' + res.rootVar + ' but the header is ' + res.real + 'px');
        assert.equal(res.progressTop, res.real + 'px',
            label + ': the reading progress bar is pinned at ' + res.progressTop + ' under a ' + res.real + 'px header');
    }
    await cdp('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 2, mobile: true });
});

test('modal dialogs never print', async t => {
    if (!await ready(t)) return;
    /* The first-run notice is a modal dialog, not document content. It only
       shows before it is accepted, so the snapshot never catches it. */
    await load('#ecg');
    const res = await evaluate(`(function () {
        var ov = document.getElementById('disclaimerOverlay');
        if (!ov) return { missing: true };
        ov.hidden = false;
        var onScreen = getComputedStyle(ov).display;
        return { onScreen: onScreen };
    })()`);
    assert.notEqual(res.onScreen, 'none', 'the notice should be visible when open, otherwise this proves nothing');
    await cdp('Emulation.setEmulatedMedia', { media: 'print' });
    await wait(400);
    const printed = await evaluate(`(function () {
        var ov = document.getElementById('disclaimerOverlay');
        var dl = document.querySelector('.explorer-dialog');
        return {
            disclaimer: getComputedStyle(ov).display,
            explorerDialog: dl ? getComputedStyle(dl).display : 'absent'
        };
    })()`);
    await cdp('Emulation.setEmulatedMedia', { media: '' });
    await evaluate(`(function () { var ov = document.getElementById('disclaimerOverlay'); if (ov) ov.hidden = true; }()`);
    assert.equal(printed.disclaimer, 'none', 'the first-run notice must not appear on paper');
});

test('the heading outline descends without skipping a level', async t => {
    if (!await ready(t)) return;
    /* A presentation used to run h1 -> h4: section titles were spans inside the
       accordion button, so a screen reader saw the topic and then a level four.
       The heading now wraps the button and section items are h3. */
    await load('#chest-pain');
    const res = await evaluate(`(function () {
        var hs = [].slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
        var jumps = [];
        for (var i = 1; i < hs.length; i++) {
            var a = +hs[i - 1].tagName[1], b = +hs[i].tagName[1];
            if (b - a > 1) jumps.push(hs[i - 1].tagName + ' -> ' + hs[i].tagName);
        }
        return {
            jumps: jumps,
            first: hs.length ? hs[0].tagName : null,
            hasSectionHeading: !!document.querySelector('.section-card > h2.sec-heading > .sec-head'),
            headingInsideButton: !!document.querySelector('.sec-head h2, .sec-head h3')
        };
    })()`);
    assert.deepEqual(res.jumps, [], 'heading levels skip a level: ' + res.jumps.join(', '));
    assert.equal(res.first, 'H1', 'a topic view should start at h1');
    assert.ok(res.hasSectionHeading,
        'each section should expose a level-2 heading wrapping the accordion button');
    assert.ok(!res.headingInsideButton,
        'a heading inside the button is invalid ARIA and is not reliably exposed');
});

test('practice case stems are never truncated', async t => {
    if (!await ready(t)) return;
    /* These were clamped to two lines, which cut all six stems mid-sentence and
       hid the decisive part: "BP is 84/48 and pulse is 124/min". */
    await load('#learn~practice');
    const res = await evaluate(`(function () {
        var stems = [].slice.call(document.querySelectorAll('.practice-stem'));
        var cut = stems.filter(function (s) { return s.scrollHeight > s.getBoundingClientRect().height + 1; });
        return {
            total: stems.length,
            cut: cut.length,
            clamp: stems.length ? getComputedStyle(stems[0]).webkitLineClamp : null,
            first: stems.length ? stems[0].textContent.trim() : null
        };
    })()`);
    assert.ok(res.total >= 5, 'expected the practice board to render its cases, saw ' + res.total);
    assert.equal(res.cut, 0, res.cut + ' of ' + res.total + ' case stems are clipped mid-sentence');
    assert.notEqual(res.clamp, '2', 'the stem must not be line-clamped');
});

test('practice filters show how many cases each one yields', async t => {
    if (!await ready(t)) return;
    await load('#learn~practice');
    const res = await evaluate(`(function () {
        var chips = [].slice.call(document.querySelectorAll('[data-case-filter]'));
        var row = document.querySelector('.practice-filter-chips');
        return {
            chips: chips.length,
            withCount: chips.filter(function (c) { return c.querySelector('.chip-count'); }).length,
            counts: chips.map(function (c) { return (c.querySelector('.chip-count') || {}).textContent; }),
            rowFits: row ? row.scrollWidth <= row.clientWidth + 1 : null,
            activeBg: (function () {
                var a = document.querySelector('.practice-chip.active');
                return a ? getComputedStyle(a).backgroundColor : null;
            })(),
            announced: chips.every(function (c) { return /cases?$/.test(c.textContent.trim()); })
        };
    })()`);
    assert.ok(res.chips >= 4, 'expected four filters, saw ' + res.chips);
    assert.equal(res.withCount, res.chips, 'every filter chip must carry a count');
    assert.ok(res.rowFits, 'the filter row must fit without horizontal scrolling');
    assert.notEqual(res.activeBg, 'rgb(12, 31, 25)',
        'the active filter must use the accent, not the near-black it had before');
    assert.ok(res.announced, 'each chip must expose its count to a screen reader');
});

test('an empty filter explains itself and offers a way out', async t => {
    if (!await ready(t)) return;
    await load('#learn~practice');
    const res = await evaluate(`(function () {
        var chip = document.querySelector('[data-case-filter="review"]');
        if (!chip) return { missing: true };
        chip.click();
        return new Promise(function (r) {
            setTimeout(function () {
                var box = document.querySelector('.practice-empty');
                r({
                    empty: !!box,
                    hasHeading: box ? !!box.querySelector('strong') : false,
                    hasReason: box ? !!box.querySelector('p') : false,
                    hasReset: box ? !!box.querySelector('[data-case-filter-reset]') : false
                });
            }, 700);
        });
    })()`);
    if (res.missing) { t.skip('no review filter on this build'); return; }
    assert.ok(res.empty, 'the review filter is empty for a new learner, so an empty state is expected');
    assert.ok(res.hasHeading && res.hasReason, 'the empty state must say what is empty and why');
    assert.ok(res.hasReset, 'the empty state must offer a way back to all cases');
    const after = await evaluate(`(function () {
        var b = document.querySelector('[data-case-filter-reset]');
        if (b) b.click();
        return new Promise(function (r) {
            setTimeout(function () {
                r({ cards: document.querySelectorAll('.practice-case-card').length });
            }, 700);
        });
    })()`);
    assert.ok(after.cards > 0, 'the reset button must return the learner to the full board');
});

test('the practice case badge meets contrast for small text', async t => {
    if (!await ready(t)) return;
    await load('#learn~practice');
    const res = await evaluate(`(function () {
        function lum(rgb) {
            var m = String(rgb).match(/[\\d.]+/g).map(Number).slice(0, 3);
            return m.map(function (c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); })
                .reduce(function (a, c, i) { return a + c * [0.2126, 0.7152, 0.0722][i]; }, 0);
        }
        function alpha(rgb) { var m = String(rgb).match(/[\\d.]+/g); return m && m.length > 3 ? Number(m[3]) : 1; }
        function over(fg, bg) { // composite fg (with alpha) onto an opaque bg
            var f = String(fg).match(/[\\d.]+/g).map(Number), b = String(bg).match(/[\\d.]+/g).map(Number);
            var a = f.length > 3 ? f[3] : 1;
            return [0, 1, 2].map(function (i) { return f[i] * a + b[i] * (1 - a); });
        }
        var badge = document.querySelector('.case-badge');
        if (!badge) return { missing: true };
        var card = badge.closest('.practice-case-card');
        var page = getComputedStyle(card).backgroundColor;
        var eff = over(getComputedStyle(badge).color, page);
        var l1 = lum('rgb(' + eff.map(Math.round).join(',') + ')'), l2 = lum(page);
        return {
            ratio: +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)),
            fontSize: getComputedStyle(badge).fontSize
        };
    })()`);
    if (res.missing) { t.skip('no case badge rendered'); return; }
    assert.ok(res.ratio >= 4.5,
        'the case badge measures ' + res.ratio + ':1 at ' + res.fontSize + ', under the 4.5:1 that small text needs');
});

test('all four learning tabs share one frame', async t => {
    if (!await ready(t)) return;
    /* Switching tabs used to change the page itself: the board path dropped the
       kicker and lead, and the tab bar went from a single nowrap row to a 2x2
       grid because the phone breakpoint forces wrap and a 50% basis. A control
       that reshapes when you tap a sibling tab reads as a bug. */
    const views = ['practice', 'visuals', 'skills', 'progress'];
    const seen = [];
    for (const v of views) {
        await load('#learn~' + v);
        const res = await evaluate(`(function () {
            var tabs = document.querySelector('.learning-workspace .workspace-tabs');
            var kids = [].slice.call(document.querySelectorAll('.learning-workspace .workspace-tabs a'));
            var rows = {};
            kids.forEach(function (k) { var y = Math.round(k.getBoundingClientRect().top); rows[y] = 1; });
            var kicker = document.querySelector('.learning-workspace .practice-hero > .study-kicker');
            var h1 = document.querySelector('.learning-workspace .practice-hero h1');
            var lead = document.querySelector('.learning-workspace .workspace-lead');
            return {
                rows: Object.keys(rows).length,
                height: tabs ? Math.round(tabs.getBoundingClientRect().height) : 0,
                width: tabs ? Math.round(tabs.getBoundingClientRect().width) : 0,
                overflows: tabs ? tabs.scrollWidth > tabs.clientWidth + 1 : false,
                kicker: kicker ? getComputedStyle(kicker).display !== 'none' : false,
                h1Size: h1 ? getComputedStyle(h1).fontSize : null,
                lead: !!lead
            };
        })()`);
        seen.push({ v, ...res });
    }
    const first = seen[0];
    for (const s of seen) {
        assert.equal(s.rows, 1, s.v + ': the tab bar wrapped to ' + s.rows + ' rows instead of one');
        assert.equal(s.height, first.height, s.v + ': tab bar is ' + s.height + 'px but ' + first.v + ' is ' + first.height + 'px');
        assert.equal(s.width, first.width, s.v + ': tab bar width differs from ' + first.v);
        assert.ok(!s.overflows, s.v + ': the tab bar overflows and hides a tab');
        assert.ok(s.kicker, s.v + ': the workspace kicker is missing');
        assert.equal(s.h1Size, first.h1Size, s.v + ': heading size differs from ' + first.v);
        assert.ok(s.lead, s.v + ': the workspace lead line is missing');
    }
});

test('every primary control meets the 44px tap target', async t => {
    if (!await ready(t)) return;
    await load('#ecg');
    const res = await evaluate(`(function () {
        var sels = ['.ios-tabbar .tabbar-item', '.topbar > .burger', '.topbar > .searchwrap', '.topbar > .tools-toggle', '.ecg-step-chip'];
        var out = {};
        sels.forEach(function (s) {
            var els = Array.prototype.slice.call(document.querySelectorAll(s));
            if (!els.length) { out[s] = 'none'; return; }
            out[s] = Math.min.apply(null, els.map(function (e) { return e.getBoundingClientRect().height; }));
        });
        return out;
    })()`);
    for (const [sel, height] of Object.entries(res)) {
        assert.notEqual(height, 'none', sel + ' was not found');
        assert.ok(asNumber(height, sel) >= 44, sel + ' is only ' + Math.round(height) + 'px tall');
    }
});

test('practice cards keep category labels readable and use vector affordances', async t => {
    if (!await ready(t)) return;
    /* The domain label was one raw Apple system hue printed straight onto the
       card: Trauma measured 2.06:1, Toxicology 2.02:1, Pediatric 2.57:1,
       Resuscitation 3.41:1 and Obstetric 3.52:1 against an 11.8px label — colour
       was carrying both the category and the text and could do neither legibly.
       Hue is now a token mixed against the theme ink, and the card affordance is
       the shared chevron rather than a typed arrow glyph. */
    await load('#learn~practice', 3000);
    /* color-mix resolves to color(srgb r g b) with 0-1 components while plain
       colours come back as rgb(); treating the first as 0-255 reads every value
       as near-black, so the format has to pick the scale. */
    const script = `(function () {
        function parse(v) {
            var str = String(v).trim();
            var nums = str.match(/-?[0-9.]+/g) || [];
            var srgb = str.indexOf('srgb') >= 0;
            var a = nums.length > 3 ? Number(nums[3]) : 1;
            return srgb
                ? { c: [Number(nums[0]) * 255, Number(nums[1]) * 255, Number(nums[2]) * 255], a: a }
                : { c: [Number(nums[0]), Number(nums[1]), Number(nums[2])], a: a };
        }
        function lum(v) {
            return [0, 1, 2].reduce(function (acc, i) {
                var x = v[i] / 255;
                x = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
                return acc + x * [0.2126, 0.7152, 0.0722][i];
            }, 0);
        }
        /* Composite translucent surfaces up the chain: the dark card is a
           75%-alpha panel, so measuring against its own rgba is meaningless. */
        function bgOf(el) {
            var stack = [], n = el;
            while (n && n.nodeType === 1) {
                var b = parse(getComputedStyle(n).backgroundColor);
                if (b.a > 0) stack.push(b);
                if (b.a >= 1) break;
                n = n.parentElement;
            }
            var acc = [255, 255, 255];
            for (var i = stack.length - 1; i >= 0; i--) {
                var s = stack[i];
                acc = [0, 1, 2].map(function (k) { return s.c[k] * s.a + acc[k] * (1 - s.a); });
                if (s.a >= 1) break;
            }
            return { c: acc, a: 1 };
        }
        function ratio(el, bg) {
            var F = parse(getComputedStyle(el).color), B = bgOf(bg);
            var comp = [0, 1, 2].map(function (i) { return F.c[i] * F.a + B.c[i] * (1 - F.a); });
            var l1 = lum(comp), l2 = lum(B.c);
            return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
        }
        function scan() {
            var out = [];
            document.querySelectorAll('.practice-case-card').forEach(function (card) {
                var domain = card.querySelector('.workspace-card-kind');
                var arrow = card.querySelector('.cta-arrow');
                out.push({
                    domain: card.dataset.domain,
                    ratio: domain ? ratio(domain, card) : null,
                    size: domain ? getComputedStyle(domain).fontSize : null,
                    arrowIsVector: !!arrow && !!arrow.querySelector('svg'),
                    arrowGlyph: arrow ? arrow.textContent.trim() : ''
                });
            });
            return out;
        }
        return { rows: scan() };
    })()`;
    const collect = async () => (await evaluate(script)).rows;

    const light = await collect();
    assert.ok(light.length >= 5, 'expected the practice board to render its cases, saw ' + light.length);
    for (const row of light) {
        assert.ok(asNumber(row.ratio, 'domain ratio') >= 4.5,
            'light: the ' + row.domain + ' category label measures ' + row.ratio + ':1 at ' + row.size +
            ', under the 4.5:1 that small text needs');
        assert.ok(row.arrowIsVector,
            'the ' + row.domain + ' card affordance is a "' + row.arrowGlyph + '" text glyph, not a vector icon');
    }

    await evaluate(`document.documentElement.setAttribute('data-theme', 'dark'); 'ok'`);
    await wait(400);
    const dark = await collect();
    assert.equal(dark.length, light.length, 'the same cards should be present in dark mode');
    for (const row of dark) {
        assert.ok(asNumber(row.ratio, 'domain ratio') >= 4.5,
            'dark: the ' + row.domain + ' category label measures ' + row.ratio + ':1 at ' + row.size);
        assert.ok(row.arrowIsVector, 'the ' + row.domain + ' card affordance must stay a vector in dark mode');
    }
    await evaluate(`document.documentElement.setAttribute('data-theme', 'light'); 'ok'`);
});

test('the practice board states each clinical domain with its own hue', async t => {
    if (!await ready(t)) return;
    /* One meaning -> one mark, but only if the domains stay distinguishable: the
       whole reason the label is coloured is that it names the case type. Mixing
       every hue toward the same ink value could quietly flatten them all. */
    await load('#learn~practice', 3000);
    const res = await evaluate(`(function () {
        var hues = {};
        document.querySelectorAll('.practice-case-card').forEach(function (card) {
            /* The token sits on the category label, not the card: the label is the
               only element the hue paints. */
            var label = card.querySelector('.workspace-card-kind');
            hues[card.dataset.domain] = label
                ? getComputedStyle(label).getPropertyValue('--domain-hue').trim()
                : '';
        });
        return { count: Object.keys(hues).length, unique: new Set(Object.values(hues)).size };
    })()`);
    assert.ok(res.count >= 4, 'expected several practice domains, saw ' + res.count);
    assert.equal(res.unique, res.count,
        'every clinical domain must keep its own hue token; ' + res.unique + ' distinct of ' + res.count);
});

test('all four learning tabs render one card component', async t => {
    if (!await ready(t)) return;
    /* The four tabs each grew their own card — Practice had an icon, a meta row
       and a labelled affordance at 15px body copy; Visuals and Procedures had a
       bare 16px span as their action and no icon at all; Progress had neither.
       Measured, the heading size, body size, padding and radius all moved when
       you tapped a sibling tab. One component now builds every grid, so these
       measurements must not move either. */
    /* practice-case is the card's own hook and is emitted through the shared
       builder's `extra` argument, so it is selected by name here rather than
       inferred from .workspace-card. */
    const tabs = [
        ['practice', '#learn~practice', '.practice-case'],
        ['visuals', '#learn~visuals', '.workspace-card'],
        ['skills', '#learn~skills', '.workspace-card'],
        ['progress', '#learn~progress', '.workspace-card']
    ];
    const scan = `(function (extra) {
        var out = [];
        document.querySelectorAll(extra || '.workspace-card').forEach(function (card) {
            var affordance = card.querySelector('.cta-arrow');
            var link = card.tagName === 'A';
            var box = card.getBoundingClientRect();
            var body = card.querySelector('.workspace-card-body, .practice-stem');
            out.push({
                hasIcon: !!card.querySelector('.workspace-card-ico svg'),
                hasKind: !!card.querySelector('.workspace-card-kind'),
                heading: ((card.querySelector('h2,h3') || {}).tagName || '').toLowerCase(),
                underPageHeading: !!card.closest('.workspace-body') &&
                    !!Array.prototype.some.call(
                        card.closest('.workspace-body').children,
                        function (el) { return el !== card && el.tagName === 'H2'; }),
                titleSize: card.querySelector('h2,h3') ? getComputedStyle(card.querySelector('h2,h3')).fontSize : null,
                bodySize: body ? getComputedStyle(body).fontSize : null,
                padding: getComputedStyle(card).padding,
                radius: getComputedStyle(card).borderRadius,
                isLink: link,
                hasChevron: !!affordance && !!affordance.querySelector('svg'),
                arrowGlyph: affordance ? affordance.textContent.trim() : '',
                height: Math.round(box.height)
            });
        });
        return out;
    })()`;

    const baseline = {};
    for (const [name, hash, sel] of tabs) {
        await load(hash, 2600);
        const rows = await evaluate(scan.replace("'.workspace-card'", JSON.stringify(sel)));
        assert.ok(rows.length >= 3, name + ': expected cards, saw ' + rows.length);
        for (const row of rows) {
            assert.ok(row.hasIcon, name + ': a card has no semantic icon (' + JSON.stringify(row) + ')');
            assert.ok(row.hasKind, name + ': a card has no category label');
            /* A card heading its own grid is an h2. The progress tab opens with a
               page-level h2, so its cards step down to h3 — still a valid outline,
               so the check is that the level is h2 unless something above it owns
               an h2, never a silent skip. */
            assert.ok(row.heading === 'h2' || row.heading === 'h3', name + ': card title should be a heading, saw ' + row.heading);
            if (row.heading === 'h3') {
                assert.ok(row.underPageHeading,
                    name + ': a card uses h3 with no h2 above it, which skips a level');
            }
            if (row.isLink) {
                assert.ok(row.hasChevron, name + ': a tappable card needs a vector affordance, not text');
                assert.equal(row.arrowGlyph, '', name + ': the affordance still contains a typed arrow glyph');
            }
            if (!baseline[name]) {
                baseline[name] = { padding: row.padding, radius: row.radius, body: row.bodySize, title: row.titleSize };
            } else {
                assert.equal(row.padding, baseline[name].padding, name + ': card padding drifts between cards');
                assert.equal(row.radius, baseline[name].radius, name + ': card radius drifts between cards');
                assert.equal(row.bodySize, baseline[name].body, name + ': body copy drifts between cards');
                assert.equal(row.titleSize, baseline[name].title, name + ': title size drifts between cards');
            }
        }
    }

    /* The measure has to be identical across tabs, not merely inside each one. */
    const shared = {};
    for (const [name] of tabs) shared[name] = baseline[name];
    const first = shared.practice;
    for (const [name, v] of Object.entries(shared)) {
        assert.equal(v.padding, first.padding, name + ' cards use different padding than Practice: ' + v.padding + ' vs ' + first.padding);
        assert.equal(v.radius, first.radius, name + ' cards use a different radius than Practice: ' + v.radius + ' vs ' + first.radius);
        assert.equal(v.body, first.body, name + ' cards use different body copy than Practice: ' + v.body + ' vs ' + first.body);
        assert.equal(v.title, first.title, name + ' cards use a different title size than Practice: ' + v.title + ' vs ' + first.title);
    }
});

test('the learning workspace runs on one spacing rhythm and one frame', async t => {
    if (!await ready(t)) return;
    /* Spacing was retyped per tab and drifted: measured inside a card the gaps
       ran 22/22/22 on Practice, 14/16/10 on Visuals and 20/20 on Progress,
       because Practice spaced its children with flex gap while the others used
       margins and the two stacked. Between blocks, the progress tab rendered
       10/0/0/10/0 against 24 everywhere else. The frame also carried both a
       hairline and a shadow, and the gap between cards (18px) was wider than
       the padding inside one (20px), so a grid read as one block with seams.

       This asserts the values the workspace now commits to, so neither the
       rhythm nor the frame can move under a later layer. */
    const TABS = [
        ['practice', '#learn~practice', '.practice-case'],
        ['visuals', '#learn~visuals', '.workspace-card'],
        ['skills', '#learn~skills', '.workspace-card'],
        ['progress', '#learn~progress', '.workspace-card']
    ];
    const scan = `(function () {
        var sel = /*__SEL__*/;
        function gap(a, b) {
            if (!a || !b) return null;
            return Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom);
        }
        var card = document.querySelector(sel);
        if (!card) return { missing: true };
        var cs = getComputedStyle(card);
        var grid = document.querySelector('.workspace-grid');
        var body = document.querySelector('.workspace-body');
        var blocks = Array.prototype.filter.call(body.children, function (el) {
            return el.getBoundingClientRect().height > 0;
        });
        var gaps = [];
        for (var i = 1; i < blocks.length; i++) gaps.push(gap(blocks[i - 1], blocks[i]));
        return {
            radius: cs.borderTopLeftRadius,
            padding: cs.paddingTop,
            borderWidth: cs.borderTopWidth,
            shadow: cs.boxShadow,
            gridGap: getComputedStyle(grid).gap,
            /* The first two gaps are fixed by the card's flex gap. The third is
               the flexible zone: cards in a grid row stretch to the tallest one
               and the action is pinned to the bottom with an auto margin, so the
               space above the hairline absorbs the difference. That is what lines
               the actions up across a row, and it is the only variable step. */
            inside: {
                lead: gap(card.querySelector('.workspace-card-top'), card.querySelector('h2,h3')),
                title: gap(card.querySelector('h2,h3'), card.querySelector('.workspace-card-body,.practice-stem')),
                action: gap(card.querySelector('.workspace-card-body,.practice-stem'), card.querySelector('.case-cta'))
            },
            flow: gaps,
            firstIsHeading: blocks[0] && blocks[0].tagName === 'H2'
        };
    })()`;

    /* flow is checked per gap in the loop below (10 for the heading pair, 20
       elsewhere), so it is deliberately not part of the single-value check. */
    const seen = { radius: new Set(), padding: new Set(), gridGap: new Set(), inside: new Set() };
    for (const [name, hash, sel] of TABS) {
        await load(hash, 2600);
        const r = await evaluate(scan.replace(/\/\*__SEL__\*\//g, JSON.stringify(sel)));
        assert.ok(!r.missing, name + ': no card rendered');
        assert.equal(r.borderWidth, '1px', name + ': the card frame should be a single hairline, got ' + r.borderWidth);
        assert.equal(r.shadow, 'none', name + ': a resting card must not also carry a shadow, two frames read as a chip');
        seen.radius.add(r.radius);
        seen.padding.add(r.padding);
        seen.gridGap.add(r.gridGap);
        seen.inside.add(r.inside.lead + '/' + r.inside.title);
        if (r.inside.action !== null) {
            assert.ok(r.inside.action >= 14,
                name + ': the action sits ' + r.inside.action + 'px below the body, which is tighter than the ' +
                r.inside.lead + 'px rhythm it should hold');
        }
        /* The heading and its lede are one unit; everything else is one step. */
        r.flow.forEach((v, i) => {
            const expected = r.firstIsHeading && i === 0 ? 10 : 20;
            assert.equal(v, expected, name + ': block ' + i + ' sits ' + v + 'px below the previous block, expected ' + expected);
        });
    }

    for (const [label, set] of Object.entries(seen)) {
        assert.equal(set.size, 1, 'the workspace must use one ' + label + ', found ' + [...set].join(' / '));
    }
    /* The gap between cards has to be clearly tighter than the padding inside
       one, which is what separates a grid into objects instead of a wall. */
    /* Number('14px') is NaN: only parseFloat reads the unit off a length. */
    const gap = parseFloat([...seen.gridGap][0]);
    const pad = parseFloat([...seen.padding][0]);
    assert.ok(gap < pad, 'the grid gap (' + gap + 'px) must be tighter than the card padding (' + pad + 'px)');
});

test('the workspace shell reads as a control, not a toolbar', async t => {
    if (!await ready(t)) return;
    /* Four problems measured on the desktop view of #learn~practice:

       1. The destination control stretched to the full 980px measure, so each of
          the four segments was 242px and the control was the heaviest element on
          the page — a toolbar wearing a segmented control's clothes.
       2. The active segment painted #3a3a3c, the dark theme's hover tone, so the
          current destination looked like a stuck hover instead of a selection.
       3. The back link rendered underlined: .back-btn is an <a> and the rule
          never cancelled the decoration, so a navigation control looked like
          body copy.
       4. The lead paragraph and the section paragraph below it restated each
          other, spending a whole band of the page twice on the same sentence. */
    await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await load('#learn~practice', 3000);
    const res = await evaluate(`(function () {
        var tabs = document.querySelector('.workspace-tabs');
        var active = tabs.querySelector('a[aria-current="page"]');
        var back = document.querySelector('.workspace-hero-nav .back-btn');
        var leads = [].map.call(document.querySelectorAll('.practice-hero .workspace-lead, .workspace-body .workspace-section-intro'),
            function (el) { return el.textContent.trim(); });
        function lumOf(v) {
            var n = String(v).match(/-?[0-9.]+/g).map(Number);
            var srgb = String(v).indexOf('srgb') >= 0;
            var c = srgb ? [n[0] * 255, n[1] * 255, n[2] * 255] : [n[0], n[1], n[2]];
            var a = n.length > 3 ? n[3] : 1;
            return { c: c, a: a };
        }
        function lum(v) {
            return [0, 1, 2].reduce(function (acc, i) {
                var x = v[i] / 255;
                x = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
                return acc + x * [0.2126, 0.7152, 0.0722][i];
            }, 0);
        }
        /* The selected segment has to be distinguishable from its own track, or
           the control does not say where you are. */
        var seg = lumOf(getComputedStyle(active).backgroundColor);
        var track = lumOf(getComputedStyle(tabs).backgroundColor);
        var l1 = lum(seg.c), l2 = lum(track.c);
        return {
            tabsWidth: Math.round(tabs.getBoundingClientRect().width),
            measure: Math.round(document.querySelector('.learning-workspace').getBoundingClientRect().width),
            segmentCount: tabs.querySelectorAll('a').length,
            tabRows: new Set([].map.call(tabs.querySelectorAll('a'), function (a) {
                return Math.round(a.getBoundingClientRect().top);
            })).size,
            activeHeight: Math.round(active.getBoundingClientRect().height),
            activeContrast: +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)),
            activeShadow: getComputedStyle(active).boxShadow,
            backDecoration: getComputedStyle(back).textDecorationLine,
            backHeight: Math.round(back.getBoundingClientRect().height),
            leadCount: leads.length,
            gridColumns: getComputedStyle(document.querySelector('.workspace-grid')).gridTemplateColumns.split(' ').length,
            cardWidth: Math.round(document.querySelector('.practice-case').getBoundingClientRect().width),
            cardHeight: Math.round(document.querySelector('.practice-case').getBoundingClientRect().height)
        };
    })()`);

    assert.equal(res.segmentCount, 4, 'the workspace has four destinations');
    assert.equal(res.tabRows, 1, 'the destination control must stay on one row');
    assert.ok(res.tabsWidth < res.measure * 0.75,
        'the control spans ' + res.tabsWidth + 'px of a ' + res.measure + 'px measure; it should hug its labels, not stretch');
    assert.ok(res.activeHeight >= 32, 'segments are ' + res.activeHeight + 'px tall');
    /* 12% against a 5% track measured 1.11:1 — the current destination read as a
       smudge rather than a choice. It has to separate by fill *and* be lifted,
       because a low-contrast fill on its own is what made this look unmade. */
    assert.ok(res.activeContrast >= 1.3,
        'the selected segment reads ' + res.activeContrast + ':1 against its own track, too close to see');
    assert.ok(res.activeShadow && res.activeShadow !== 'none',
        'the selected segment carries no lift, so the control has no raised state');
    assert.doesNotMatch(res.backDecoration, /underline/,
        'the back control renders underlined, so a navigation control reads as body copy');
    assert.ok(res.backHeight >= 44, 'the back control is ' + res.backHeight + 'px, under the 44px touch floor');
    assert.equal(res.leadCount, 1, 'the page states its purpose twice: once in the header and once below it');
    /* Three columns once a card would otherwise be a wide, short box. */
    assert.ok(res.gridColumns >= 3, 'at 1280px the board is ' + res.gridColumns + ' columns; cards were 477x266 boxes');
    assert.ok(res.cardWidth / res.cardHeight > 0.8 && res.cardWidth / res.cardHeight < 2.2,
        'card proportion is ' + (res.cardWidth / res.cardHeight).toFixed(2) + ', which reads as a layout accident');

    /* A phone is where the full-width segmented control belongs. */
    await cdp('Emulation.setDeviceMetricsOverride', { width: 393, height: 852, deviceScaleFactor: 2, mobile: true });
    await load('#learn~practice', 3000);
    const phone = await evaluate(`(function () {
        var tabs = document.querySelector('.workspace-tabs');
        var host = tabs.parentElement;
        var hs = getComputedStyle(host);
        /* The frame the control has to span is the host's content box. Its border
           box is wider by its own padding, which is the card's inset, not space
           the control is failing to use. */
        var content = host.clientWidth - parseFloat(hs.paddingLeft) - parseFloat(hs.paddingRight);
        return {
            tabsWidth: Math.round(tabs.getBoundingClientRect().width),
            contentWidth: Math.round(content),
            hostBorderBox: Math.round(host.getBoundingClientRect().width),
            minSegment: Math.min.apply(null, [].map.call(tabs.querySelectorAll('a'), function (a) {
                return Math.round(a.getBoundingClientRect().height);
            }))
        };
    })()`);
    assert.ok(phone.tabsWidth > phone.contentWidth * 0.95,
        'on a phone the control should span the frame, got ' + phone.tabsWidth + ' of a ' + phone.contentWidth + 'px content box');
    /* Four segments plus their labels have to fit without scrolling. */
    assert.ok(phone.tabsWidth >= phone.contentWidth - 2,
        'the control does not fill its frame: ' + phone.tabsWidth + 'px in ' + phone.contentWidth + 'px');
    assert.ok(phone.minSegment >= 44, 'phone segments are ' + phone.minSegment + 'px, under the 44px touch floor');
});

test('the workspace frame keeps content off the edges of the section', async t => {
    if (!await ready(t)) return;
    /* The workspace carried padding: 0 at every width and simply inherited the
       stage gutter, so on a phone the copy sat 12px from the edge of the screen.
       The frame had no thickness of its own, which is what made the content look
       glued to the section rather than placed inside it. The gutter now belongs
       to the workspace and scales with the viewport.

       This measures the distance from the content to the visible edge of the
       main column — not to the window, which on a desktop includes the sidebar
       and would hide the problem. */
    const gutter = `(function () {
        var hero = document.querySelector('.practice-hero');
        var stage = document.getElementById('stage');
        var hr = hero.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        var cs = getComputedStyle(stage);
        var inner = sr.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return {
            stagePadLeft: parseFloat(cs.paddingLeft),
            ownPadLeft: parseFloat(getComputedStyle(document.querySelector('.learning-workspace')).paddingLeft),
            fromColumnLeft: Math.round(hr.left - (sr.left + parseFloat(cs.paddingLeft))),
            fromColumnRight: Math.round((sr.right - parseFloat(cs.paddingRight)) - hr.right),
            columnInner: Math.round(inner)
        };
    })()`;

    /* Two things are being checked: the workspace carries a gutter of its own at
       every width (it used to carry none), and the result reads as a margin from
       whatever the reader sees as the edge — the window on a phone, the column
       on a desktop. */
    for (const [label, width, height, mobile, minOwn, minFromWindow] of [
        ['phone', 393, 852, true, 16, 24],
        ['small phone', 320, 568, true, 16, 24],
        ['tablet', 834, 1112, false, 20, 32],
        ['desktop', 1280, 900, false, 24, 48]
    ]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile });
        await load('#learn~practice', 2600);
        const g = await evaluate(gutter);
        assert.ok(g.ownPadLeft >= minOwn,
            label + ': the workspace gutter is ' + g.ownPadLeft + 'px, under the ' + minOwn + 'px this section carries');
        assert.ok(g.fromColumnLeft >= minOwn,
            label + ': content sits ' + g.fromColumnLeft + 'px inside the column, under ' + minOwn + 'px');
        const fromWindow = g.stagePadLeft + g.fromColumnLeft;
        assert.ok(fromWindow >= minFromWindow,
            label + ': content sits only ' + fromWindow + 'px from the edge of the window, under the ' + minFromWindow + 'px that reads as framed');
        /* The gutters have to match, or the block is off-centre in its own frame. */
        assert.ok(Math.abs(g.fromColumnLeft - g.fromColumnRight) <= 1,
            label + ': the frame is uneven — ' + g.fromColumnLeft + 'px left against ' + g.fromColumnRight + 'px right');
    }
});

test('the learning workspace speaks the same visual language as the other sections', async t => {
    if (!await ready(t)) return;
    /* Measured across the app, the workspace was the only section drawn as bare
       text on the page: no hero panel, a 24.8px title at weight 600, and a
       10.72px kicker at weight 600. Home used a 46.4px/750 title with a card
       hero, the presentation page a 37.6px/750 title with a card hero, and the
       shift view an 11.52px/800 kicker. Whatever else it got right, the section
       read as unfinished next to everything around it.

       This compares the workspace against the app's own section heroes rather
       than against constants, so if the app's language changes the workspace has
       to follow it rather than quietly keeping its own. */
    const readHero = sel => `(function () {
        var el = document.querySelector(${JSON.stringify(sel)});
        if (!el) return null;
        var s = getComputedStyle(el);
        var h = el.querySelector('h1, h2');
        var hs = h ? getComputedStyle(h) : null;
        var kick = el.querySelector('.study-kicker, .resus-kicker, .shift-kicker');
        var ks = kick ? getComputedStyle(kick) : null;
        return {
            framed: s.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(s.borderTopWidth) > 0,
            radius: parseFloat(s.borderTopLeftRadius),
            shadowed: s.boxShadow !== 'none',
            titleWeight: hs ? hs.fontWeight : null,
            titleSize: hs ? parseFloat(hs.fontSize) : null,
            kickWeight: ks ? ks.fontWeight : null,
            kickSize: ks ? parseFloat(ks.fontSize) : null
        };
    })()`;
    const readKicker = sel => `(function () {
        var k = document.querySelector(${JSON.stringify(sel)});
        if (!k) return null;
        var s = getComputedStyle(k);
        return { weight: s.fontWeight, size: parseFloat(s.fontSize) };
    })()`;

    await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    await load('#chest-pain', 3000);
    const app = await evaluate(readHero('.cp-hero'));
    assert.ok(app && app.framed,
        'the presentation hero is expected to be a framed card; saw ' + JSON.stringify(app));

    await load('#learn~practice', 3000);
    const ws = await evaluate(readHero('.practice-hero'));
    assert.ok(ws && ws.framed,
        'the workspace header is bare text on the page while every other section is a card');
    assert.ok(ws.shadowed, 'the workspace header has no lift, so it reads as unfinished beside the other sections');
    assert.ok(Math.abs(ws.radius - app.radius) <= 4,
        "header radius is " + ws.radius + "px against the app's " + app.radius + "px");
    /* Same weight as the rest of the app, scaled for a page rather than a
       landing hero rather than shrunk into a different design language. */
    assert.equal(ws.titleWeight, app.titleWeight,
        'header title is weight ' + ws.titleWeight + ' while the app uses ' + app.titleWeight);
    assert.ok(ws.titleSize >= 24, 'header title is ' + ws.titleSize + 'px, too small to match the app');
    assert.ok(ws.titleSize <= app.titleSize,
        'header title is ' + ws.titleSize + 'px, larger than the app hero at ' + app.titleSize + 'px');

    await load('#shift~chest-pain', 3000);
    const shift = await evaluate(readKicker('.shift-kicker'));
    if (shift) {
        assert.equal(ws.kickWeight, shift.weight,
            'header kicker is weight ' + ws.kickWeight + ' while the app uses ' + shift.weight);
        assert.ok(Math.abs(ws.kickSize - shift.size) < 0.5,
            "header kicker is " + ws.kickSize + "px against the app's " + shift.size + "px");
    }
});

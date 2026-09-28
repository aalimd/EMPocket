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

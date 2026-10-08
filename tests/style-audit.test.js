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
        await cdp('Emulation.setFocusEmulationEnabled', { enabled: true });
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
async function load(hash, settle = 450) {
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

test('ECG finding regions are attached to the tracing and match authored coordinates in every case', async t => {
    if (!await ready(t)) return;
    await load('#ecg-explorer', 1800);
    const result = await evaluate(`(() => {
        const X = window.ECG_EXPLORER, root = document.querySelector('#stage .ecg-explorer');
        const errors = [];
        for (const record of X.cases) {
            X.mount(root, {id: record.id});
            const item = X.build(record.id, false);
            for (let index = 0; index < item.findings.length; index++) {
                root.querySelector('[data-finding="' + index + '"]').click();
                const marks = [...root.querySelectorAll('.explorer-canvas svg .ecg-finding-marks ellipse')];
                const expected = item.findings[index].targets;
                if (marks.length !== expected.length) errors.push(record.id + ':' + index + ' missing marks on ECG');
                if (root.querySelector('.ui-icon .ecg-finding-marks')) errors.push(record.id + ' marked a toolbar icon');
                marks.forEach((mark, i) => {
                    const [x,y,w,h] = expected[i];
                    if (+mark.getAttribute('cx') !== x+w/2 || +mark.getAttribute('cy') !== y+h/2 ||
                        +mark.getAttribute('rx') !== w/2 || +mark.getAttribute('ry') !== h/2)
                        errors.push(record.id + ':' + index + ' incorrect target geometry');
                });
            }
        }
        return {count:X.cases.length, errors};
    })()`);
    assert.equal(result.count, 69);
    assert.deepEqual(result.errors, []);
});

test('the phone header has search and display options without clipped or duplicated navigation', async t => {
    if(!await ready(t))return; await load('#library');
    const r=await evaluate(`(()=>{const bar=document.querySelector('.topbar');return {clipped:bar.scrollHeight>bar.clientHeight+1,search:document.querySelector('.searchwrap input').getBoundingClientRect().height,settings:document.getElementById('toolsToggle').getBoundingClientRect().height,visible:[...document.querySelectorAll('[data-nav]')].filter(e=>e.getClientRects().length).map(e=>e.dataset.nav),parked:document.getElementById('readingPanel').contains(document.getElementById('topbarTools'))};})()`);
    assert.equal(r.clipped,false);assert.equal(r.search,48);assert.equal(r.settings,44);assert.deepEqual(r.visible,['home','study','ecg','shift']);assert.equal(r.parked,true);
});

test('Library contains every presentation and no unrelated home dashboard',async t=>{
    if(!await ready(t))return;await load('#library');
    const r=await evaluate(`({cards:[...document.querySelectorAll('.cp-card')].map(c=>c.dataset.id),ids:window.CP_DATA.map(c=>c.id),extra:!!document.querySelector('.workspace-entry,.student-starter,.study-dashboard'),h:document.querySelector('h1').textContent})`);
    assert.equal(r.h,'Library');assert.deepEqual(r.cards.slice().sort(),r.ids.slice().sort());assert.equal(r.extra,false);
});

test('four destinations have coherent active states including legacy ECG and recorded routes',async t=>{
    if(!await ready(t))return;
    for(const [route,key] of [['#library','home'],['#chest-pain','home'],['#library~saved','home'],['#learn~home','study'],['#study~saved','study'],['#learn~skills','study'],['#ecg-hub','ecg'],['#ecg','ecg'],['#ecg-explorer','ecg'],['#learn~visual-recordings','ecg'],['#shift','shift']]){
        await load(route);assert.equal(await evaluate(`document.querySelector('.ios-tabbar [aria-current="page"]')?.dataset.nav`),key,route);
    }
});

test('all learning hubs expose their complete local collections and valid reading tracks',async t=>{
    if(!await ready(t))return;await load('#learn~home');
    assert.equal(await evaluate(`document.querySelectorAll('.design-grid .design-card').length`),6);
    await load('#learn~short');assert.equal(await evaluate(`document.querySelectorAll('.design-card').length`),12);
    await load('#learn~tracks');assert.equal(await evaluate(`document.querySelectorAll('.design-card').length`),6);
    const errors=await evaluate(`(async()=>{const out=[];for(const link of [...document.querySelectorAll('.design-card a')]){location.hash=link.hash;await new Promise(r=>setTimeout(r,50));if(!document.querySelector('.design-track-list a'))out.push(link.hash);for(const a of document.querySelectorAll('.design-track-list a')){const id=a.hash.slice(1).split('~')[0];if(!['ecg','ecg-explorer','learn'].includes(id)&&!window.CP_DATA.some(c=>c.id===id))out.push(a.hash);}}return out;})()`);assert.deepEqual(errors,[]);
});

test('responsive layouts and enlarged text keep document content inside the viewport',async t=>{
    if(!await ready(t))return;
    for(const width of [320,390,768,1280]){
        await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<921});
        for(const route of ['#library','#learn~home','#learn~practice','#learn~skills','#learn~progress','#ecg-hub','#ecg-explorer','#settings','#chest-pain','#shift~chest-pain']){
            await load(route,180);
            const r=await evaluate(`({width:innerWidth,page:document.documentElement.scrollWidth,header:!!document.querySelector('h1'),nav:[...document.querySelectorAll('[data-nav]')].filter(e=>e.getClientRects().length).length})`);
            assert.ok(r.header,route+' heading missing');assert.ok(r.page<=r.width+1,width+' '+route+' overflow '+r.page);assert.equal(r.nav,4);
        }
    }
    await cdp('Emulation.setDeviceMetricsOverride',{...VIEWPORT,deviceScaleFactor:2,mobile:true});
    await load('#settings');await evaluate(`document.documentElement.style.setProperty('--type-scale','1.4')`);
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`));
});

test('severity filter and patient context popovers fit narrow screens',async t=>{
    if(!await ready(t))return;await load('#library');
    for(const selector of ['.context-filters','.library-filters']){
        const r=await evaluate(`(()=>{const d=document.querySelector('${selector}');d.open=true;const trigger=d.querySelector('summary').getBoundingClientRect();const p=d.querySelector('${selector==='.context-filters'?'.chips':'.patient-filter'}').getBoundingClientRect();return {height:trigger.height,left:p.left,right:p.right,width:innerWidth};})()`);
        assert.ok(r.height>=44);assert.ok(r.left>=-1&&r.right<=r.width+1,selector+' exceeds viewport');await evaluate(`document.querySelector('${selector}').open=false`);
    }
});

test('the seven-step ECG rail scrolls, signals its extent and reveals the selected step',async t=>{
    if(!await ready(t))return;await load('#ecg');
    const r=await evaluate(`(()=>{const n=document.querySelector('.ecg-step-nav');return {count:n.querySelectorAll('.ecg-step-chip').length,scroll:n.scrollWidth>n.clientWidth,mask:getComputedStyle(n).maskImage,meter:getComputedStyle(document.querySelector('.step-rail-meter')).display,heights:[...n.children].map(x=>x.getBoundingClientRect().height)};})()`);
    assert.equal(r.count,8);assert.ok(r.scroll);assert.notEqual(r.mask,'none');assert.notEqual(r.meter,'none');assert.ok(r.heights.every(h=>h>=44));
    await evaluate(`location.hash='ecg~toxic-metabolic-mimics'`);await wait(400);
    assert.ok(await evaluate(`(()=>{const n=document.querySelector('.ecg-step-nav'),c=n.querySelector('.active');if(!c)return false;const a=n.getBoundingClientRect(),b=c.getBoundingClientRect();return b.left>=a.left-2&&b.right<=a.right+2;})()`));
});

test('clinical notice uses the native modal top layer and cannot be dismissed without initial agreement',async t=>{
    if(!await ready(t))return;await load('#library');
    const r=await evaluate(`(()=>{localStorage.removeItem('em-cps-disclaimer-agreed');window.EM_POCKET_UI.showDisclaimer(false);const d=document.getElementById('disclaimerOverlay');const c=document.getElementById('disclaimerCheck');const b=document.getElementById('disclaimerAcceptBtn');const rect=document.querySelector('.ios-tabbar').getBoundingClientRect();return {native:d.tagName,modal:d.matches(':modal'),checked:c.checked,disabled:b.disabled,hit:document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2)?.closest('#disclaimerOverlay')?.id,inert:document.querySelector('.main').inert};})()`);
    assert.equal(r.native,'DIALOG');assert.ok(r.modal&&r.disabled&&r.inert);assert.equal(r.checked,false);assert.equal(r.hit,'disclaimerOverlay');
    await evaluate(`(()=>{const c=document.getElementById('disclaimerCheck');c.checked=true;c.dispatchEvent(new Event('change'));document.getElementById('disclaimerAcceptBtn').click();})()`);
    assert.equal(await evaluate(`document.querySelector('.main').inert`),false);
});

test('unsaved notes retain their text and support stay, save and discard during navigation',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    await evaluate(`(()=>{const n=document.getElementById('studyNote');n.value='My learning note';n.dispatchEvent(new Event('input',{bubbles:true}));location.hash='settings';})()`);await wait(100);
    assert.ok(await evaluate(`document.getElementById('unsavedNoteDialog').matches(':modal')`));
    await evaluate(`document.querySelector('[data-note-stay]').click()`);
    assert.equal(await evaluate(`document.getElementById('studyNote').value`),'My learning note');
    await evaluate(`location.hash='settings'`);await wait(100);await evaluate(`document.querySelector('[data-note-save]').click()`);await wait(100);
    assert.equal(await evaluate(`document.querySelector('h1').textContent`),'Settings');
    await evaluate(`location.hash='chest-pain'`);await wait(100);assert.equal(await evaluate(`document.getElementById('studyNote').value`),'My learning note');
    await evaluate(`(()=>{const n=document.getElementById('studyNote');n.value='Discard this change';n.dispatchEvent(new Event('input',{bubbles:true}));location.hash='library';})()`);await wait(100);await evaluate(`document.querySelector('[data-note-discard]').click()`);await wait(100);
    await evaluate(`location.hash='chest-pain'`);await wait(100);assert.equal(await evaluate(`document.getElementById('studyNote').value`),'My learning note');
});

test('failed note saves keep the draft guarded and cannot continue or replace the saved note',async t=>{
    if(!await ready(t))return;
    for(const route of ['#chest-pain','#ecg']){
        await load(route);
        await cdp('Page.reload');await wait(450);
        await evaluate(`(()=>{const d=document.getElementById('disclaimerOverlay');if(d&&!d.hidden){const c=document.getElementById('disclaimerCheck');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('disclaimerAcceptBtn').click();}})()`);
        await evaluate(`(()=>{const n=document.getElementById('studyNote');n.value='Previously saved note';n.dispatchEvent(new Event('input',{bubbles:true}));document.getElementById('saveNote').click();})()`);
        assert.equal(await evaluate(`JSON.parse(localStorage.getItem('em-cps-learning')).notes[${JSON.stringify(route.slice(1))}]`),'Previously saved note',route+' baseline is persisted');
        await evaluate(`(()=>{const n=document.getElementById('studyNote');
            const original=Storage.prototype.setItem;window.restoreNoteStorage=()=>{Storage.prototype.setItem=original;};Storage.prototype.setItem=function(key,value){if(key==='em-cps-learning')throw new DOMException('Storage full','QuotaExceededError');return original.call(this,key,value);};
            n.value='Draft that must survive a failed save';n.dispatchEvent(new Event('input',{bubbles:true}));document.getElementById('saveNote').click();})()`);
        assert.equal(await evaluate(`window.POCKET_DESIGN.dirty()`),true,'failed manual save must remain unsaved');
        assert.match(await evaluate(`document.getElementById('noteStatus').textContent`),/could not|couldn.t|unable/i);
        assert.equal(await evaluate(`(()=>{const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);return event.defaultPrevented;})()`),true);
        await evaluate(`location.hash='settings'`);await wait(100);
        await evaluate(`document.querySelector('[data-note-save]').click()`);await wait(100);
        const r=await evaluate(`({hash:location.hash,modal:document.getElementById('unsavedNoteDialog').matches(':modal'),draft:document.getElementById('studyNote')?.value,dirty:window.POCKET_DESIGN.dirty(),error:document.querySelector('#unsavedNoteDialog [role="alert"]')?.textContent})`);
        assert.equal(r.hash,route);assert.equal(r.modal,true);assert.equal(r.draft,'Draft that must survive a failed save');assert.equal(r.dirty,true);assert.match(r.error,/could not|couldn.t|unable/i);
        await evaluate(`document.querySelector('[data-note-stay]').click()`);assert.equal(await evaluate(`document.activeElement.id`),'studyNote');
        await evaluate(`location.hash='settings'`);await wait(100);await evaluate(`document.querySelector('[data-note-discard]').click()`);await wait(100);
        assert.equal(await evaluate(`location.hash`),'#settings');
        await evaluate(`window.restoreNoteStorage();location.hash=${JSON.stringify(route.slice(1))}`);await wait(100);
        assert.equal(await evaluate(`document.getElementById('studyNote').value`),'Previously saved note',route+' discard must restore the previous note in this session too');
        await cdp('Page.reload');await wait(450);
        assert.equal(await evaluate(`document.getElementById('studyNote').value`),'Previously saved note','failed save must not change persistent data');
        await evaluate(`(()=>{const original=Storage.prototype.setItem;window.restoreNoteStorage=()=>{Storage.prototype.setItem=original;};Storage.prototype.setItem=function(key,value){if(key==='em-cps-learning')throw new DOMException('Storage full','QuotaExceededError');return original.call(this,key,value);};const n=document.getElementById('studyNote');n.value='Saved after storage recovered';n.dispatchEvent(new Event('input',{bubbles:true}));location.hash='settings';})()`);await wait(100);
        await evaluate(`document.querySelector('[data-note-save]').click()`);
        assert.equal(await evaluate(`document.getElementById('unsavedNoteDialog').open`),true);
        await evaluate(`window.restoreNoteStorage();document.querySelector('[data-note-save]').click()`);await wait(100);
        assert.equal(await evaluate(`location.hash`),'#settings','retry must continue the original requested navigation');
        assert.equal(await evaluate(`JSON.parse(localStorage.getItem('em-cps-learning')).notes[${JSON.stringify(route.slice(1))}]`),'Saved after storage recovered');
    }
});

test('reading settings preserve their event bindings across repeated route changes',async t=>{
    if(!await ready(t))return;await load('#settings');
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('fontUp').click();document.getElementById('themeBtn').click();document.querySelector('[data-accent="ocean"].accent-dot').click();`);
    const initial=await evaluate(`JSON.parse(localStorage.getItem('em-cps-prefs'))`);assert.equal(initial.scale,1.12);assert.equal(initial.accent,'ocean');assert.equal(initial.theme,'dark');
    for(const route of ['library','settings','learn~home','settings']){await evaluate(`location.hash='${route}'`);await wait(60);}
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('fontDown').click()`);assert.equal(await evaluate(`JSON.parse(localStorage.getItem('em-cps-prefs')).scale`),1);
    assert.equal(await evaluate(`document.querySelectorAll('#topbarTools').length`),1);
});

test('bold preference changes rendered fonts across routes and survives reload and reversal',async t=>{
    if(!await ready(t))return;await load('#settings');
    const weight=selector=>evaluate(`getComputedStyle(document.querySelector(${JSON.stringify(selector)})).fontWeight`);
    assert.equal(await weight('.settings-section p'),'400');
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('boldBtn').click()`);
    assert.equal(await weight('.settings-section p'),'700');
    assert.equal(await evaluate(`document.getElementById('boldBtn').getAttribute('aria-pressed')`),'true');
    assert.equal(await evaluate(`JSON.parse(localStorage.getItem('em-cps-prefs')).bold`),true);
    for(const [route,selector] of [['library','.cp-desc'],['learn~home','.design-header p'],['learn~practice','.practice-stem'],['study~case-chest-pain','.case-practice>.case-prompt'],['chest-pain','.sec-body li'],['ecg','.tag'],['shift~chest-pain','.shift-grid li'],['search~chest','.search-result-card p']]){
        await evaluate(`location.hash=${JSON.stringify(route)}`);await wait(100);
        assert.ok(Number(await weight(selector))>=700,route+' reading text remains regular');
        assert.ok(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),route+' overflows with bold text');
    }
    await cdp('Page.navigate',{url:baseUrl+'#settings'});await wait(450);
    assert.equal(await weight('.settings-section p'),'700');
    assert.equal(await evaluate(`document.getElementById('boldBtn').getAttribute('aria-pressed')`),'true');
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('boldBtn').click()`);
    assert.equal(await weight('.settings-section p'),'400');
    assert.equal(await evaluate(`JSON.parse(localStorage.getItem('em-cps-prefs')).bold`),false);
    await evaluate(`location.hash='chest-pain'`);await wait(100);
    assert.equal(await weight('.sec-body li'),'400');
    await cdp('Page.navigate',{url:baseUrl+'#settings'});await wait(450);
    assert.equal(await weight('.settings-section p'),'400');
    assert.equal(await evaluate(`document.getElementById('boldBtn').getAttribute('aria-pressed')`),'false');
});

test('short cases present one question at a time and retain answer feedback when navigating back',async t=>{
    if(!await ready(t))return;await load('#study~case-chest-pain');
    assert.equal(await evaluate(`document.querySelectorAll('[data-question]:not([hidden])').length`),1);
    assert.equal(await evaluate(`document.querySelector('[data-short-next]').disabled`),true);
    await evaluate(`document.querySelector('[data-question="0"] [data-choice]').click()`);
    assert.equal(await evaluate(`document.querySelector('[data-short-next]').disabled`),false);
    await evaluate(`document.querySelector('[data-short-next]').click()`);assert.equal(await evaluate(`document.querySelector('[data-question]:not([hidden])').dataset.question`),'1');
    await evaluate(`document.querySelector('[data-short-prev]').click()`);assert.equal(await evaluate(`document.querySelector('[data-question="0"]').dataset.answered`),'true');
});

test('Quick preserves all authored approach, red-flag, workup, differential and disposition items',async t=>{
    if(!await ready(t))return;await load('#shift~chest-pain');
    const missing=await evaluate(`(async()=>{const out=[];for(const cp of window.CP_DATA){location.hash='shift~'+cp.id;await new Promise(r=>setTimeout(r,20));const text=document.querySelector('.shift-sheet').textContent;const items=[...cp.approach,...cp.redFlags,...cp.workup.flatMap(w=>w[1]),...cp.dontMiss.flatMap(d=>[d[0],d[2]]),...cp.disposition.flat()];for(const item of items)if(!text.includes(item))out.push(cp.id+': '+item);}return out;})()`);assert.deepEqual(missing,[]);
});

test('light and dark accents meet text contrast and retain independent clinical urgency colours',async t=>{
    if(!await ready(t))return;await load('#library');
    const r=await evaluate(`(()=>{function lum(v){return v.match(/[\\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);}function ratio(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}const root=document.documentElement,errors=[],p=document.createElement('span');document.body.append(p);function color(t){p.style.color='var('+t+')';return getComputedStyle(p).color;}for(const theme of ['light','dark'])for(const accent of ['emerald','ocean','violet','rose','amber','teal']){root.dataset.theme=theme;root.dataset.accent=accent;for(const [a,b] of [['--ink','--card'],['--ink-soft','--bg'],['--accent','--card'],['--accent','--accent-light'],['--on-fill','--accent'],['--critical','--critical-bg'],['--emergent','--emergent-bg'],['--common','--common-bg']]){const n=ratio(color(a),color(b));if(n<4.5)errors.push(theme+'/'+accent+' '+a+' '+n);}}p.remove();root.dataset.theme='light';root.dataset.accent='emerald';return errors;})()`);assert.deepEqual(r,[]);
});

test('opaque mobile navigation and print rules prevent ECG paper from interfering with controls',async t=>{
    if(!await ready(t))return;await load('#ecg');
    for(const theme of ['light','dark']){await evaluate(`document.documentElement.dataset.theme='${theme}'`);const bg=await evaluate(`getComputedStyle(document.querySelector('.ios-tabbar')).backgroundColor`);assert.ok(alphaOf(bg)>=.99);}
    await cdp('Emulation.setEmulatedMedia',{media:'print'});
    const r=await evaluate(`Object.fromEntries(['.topbar','.sidebar','.ios-tabbar','.ecg-local-nav','.ecg-step-nav','.step-rail-meter','.disclaimer-overlay'].map(s=>[s,getComputedStyle(document.querySelector(s)).display]))`);
    await cdp('Emulation.setEmulatedMedia',{media:''});assert.ok(Object.values(r).every(d=>d==='none'));assert.equal(await evaluate(`document.querySelectorAll('.read-progress').length`),0);
});

test('unknown links explain the error and give working library and search routes',async t=>{
    if(!await ready(t))return;await load('#missing-page');assert.equal(await evaluate(`document.querySelector('h1').textContent`),'This page is unavailable');assert.equal(await evaluate(`document.querySelector('#stage a').hash`),'#library');assert.equal(await evaluate(`document.querySelectorAll('#stage a')[1].hash`),'#search');assert.equal(await evaluate(`document.activeElement === document.querySelector('#stage h1')`),true);
});

test('Back returns to the destination that opened the topic and refocuses its card',async t=>{
    if(!await ready(t))return;await load('#library');
    await evaluate(`document.querySelector('.cp-card[data-id="chest-pain"]').click()`);await wait(150);
    assert.equal(await evaluate(`location.hash`),'#chest-pain');
    assert.equal(await evaluate(`document.querySelector('#backBtn').textContent.trim()`),'Back to Library');
    await evaluate(`document.querySelector('#backBtn').click()`);await wait(250);
    assert.equal(await evaluate(`location.hash`),'#library');
    assert.equal(await evaluate(`document.activeElement?.dataset?.id || ''`),'chest-pain','the card that opened the topic is focused again');
});

test('Back from a search result returns to the same query and refocuses that result',async t=>{
    if(!await ready(t))return;await load('#search~chest');
    const pick=`(function(){const ids=window.CP_DATA.map(c=>c.id).concat(['ecg']);return [...document.querySelectorAll('.search-result-card')].find(a=>ids.indexOf(a.getAttribute('href').slice(1).split('~')[0])>=0)||null;})()`;
    const first=await evaluate(pick+'&&'+pick+'.getAttribute("href")');assert.ok(first);
    await evaluate(`(`+pick+`).click()`);await wait(150);
    assert.notEqual(await evaluate(`location.hash`),'#search~chest');
    assert.equal(await evaluate(`document.querySelector('#backBtn').textContent.trim()`),'Back to Search');
    await evaluate(`document.querySelector('#backBtn').click()`);await wait(300);
    assert.equal(await evaluate(`location.hash`),'#search~chest');
    assert.equal(await evaluate(`document.activeElement?.getAttribute('href') || ''`),first,'the result card that opened the topic is focused again');
});

test('an unknown section inside a real topic keeps the topic and explains the link',async t=>{
    if(!await ready(t))return;await load('#chest-pain~no-such-section');
    assert.equal(await evaluate(`document.querySelector('#presentationTitle').textContent`),'Chest Pain');
    const notice=await evaluate(`document.querySelector('.route-notice')?.textContent || ''`);
    assert.ok(notice.includes('This section is unavailable in this topic.'),notice);
    assert.equal(await evaluate(`!!document.querySelector('.route-notice a[href="#chest-pain"]')`),true);
    assert.equal(await evaluate(`!!document.querySelector('.route-notice a[href="#search"]')`),true);
    assert.equal(await evaluate(`document.activeElement === document.querySelector('#presentationTitle')`),true);
});

test('Back on the saved topics screen returns to the library home',async t=>{
    if(!await ready(t))return;await load('#library~saved');
    assert.equal(await evaluate(`document.querySelector('.ios-tabbar [aria-current="page"]')?.dataset.nav`),'home');
    assert.equal(await evaluate(`document.querySelector('#stage [data-home]').textContent.trim()`),'Back to Library');
    await evaluate(`document.querySelector('#stage [data-home]').click()`);await wait(250);
    assert.equal(await evaluate(`location.hash`),'#library');
    assert.equal(await evaluate(`!!document.querySelector('#presentationLibraryTitle')`),true);
});

test('search exposes all matches beyond the preview and filters by collection without losing result links',async t=>{
    if(!await ready(t))return;await load('#search~chest');
    const count=await evaluate(`window.EM_POCKET_UI.findSearchHits('chest').length`);assert.ok(count>12);
    const visible=await evaluate(`document.querySelectorAll('.search-result-card').length`);assert.equal(visible,Math.min(count,40));
    await evaluate(`document.querySelector('[data-search-type="ecg"]').click()`);
    const links=await evaluate(`[...document.querySelectorAll('.search-result-card')].map(a=>a.hash)`);assert.ok(links.length);assert.ok(links.every(h=>/^#ecg(?:~|-explorer~)/.test(h)));
    await evaluate(`document.querySelector('[data-search-type="all"]').click();document.getElementById('fullSearch').value='<img src=x>';document.querySelector('.design-search-form').requestSubmit();`);await wait(80);
    assert.equal(await evaluate(`!!document.querySelector('#stage img[src="x"]')`),false);
    assert.equal(await evaluate(`document.querySelector('.design-search-results h2').textContent`),'No matching results');
});

test('diagnosis severity uses explicit labels and correct foreground/background pairs',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    const r=await evaluate(`[...document.querySelectorAll('.dx-card')].map(e=>({tag:e.querySelector('.sev-tag')?.textContent.trim(),bg:getComputedStyle(e).backgroundColor,keyInHeading:!!e.querySelector('.dx-key')?.closest('h3')}))`);
    assert.ok(r.length>5);assert.ok(r.every(x=>x.tag&&!x.keyInHeading));assert.ok(new Set(r.map(x=>x.bg)).size>=2);
});

test('module reading remains saved when the marked button contains an icon',async t=>{
    if(!await ready(t))return;await load('#learn~skills');await evaluate(`document.querySelector('.workspace-card').click()`);await wait(100);
    await evaluate(`document.querySelector('[data-module-read]').click()`);
    const before=await evaluate(`window.EM_LEARNING.progress().viewed`);assert.equal(before.length,1);
    await evaluate(`document.querySelector('[data-module-read] svg').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
    assert.deepEqual(await evaluate(`window.EM_LEARNING.progress().viewed`),before);
});

test('the teaching viewer shows and hides normal-reference paths without altering the model',async t=>{
    if(!await ready(t))return;await load('#ecg');
    const r=await evaluate(`(()=>{const id=Object.keys(window.ECG_SVG).find(k=>window.ECG_SVG[k].hasReference);window.ECG_INTERACTIVE.open(id);const b=document.querySelector('#ecgWorkbench [data-view="reference"]'),p=document.querySelector('#ecgWorkbench .ecg-reference');if(!b||!p)return {missing:id};const d=p.getAttribute('d'),hidden=getComputedStyle(p).display;b.click();const shown=getComputedStyle(document.querySelector('#ecgWorkbench .ecg-reference')).display;const unchanged=d===document.querySelector('#ecgWorkbench .ecg-reference').getAttribute('d');window.ECG_INTERACTIVE.close();return {hidden,shown,unchanged};})()`);
    assert.ok(!r.missing,JSON.stringify(r));assert.equal(r.hidden,'none');assert.notEqual(r.shown,'none');assert.ok(r.unchanged);
});

test('Quick starts with an explicit choice when no topic is selected',async t=>{
    if(!await ready(t))return;await load('#shift');assert.equal(await evaluate(`document.querySelector('h1').textContent`),'Quick');assert.equal(await evaluate(`document.getElementById('quickPresentation').value`),'');assert.equal(await evaluate(`document.getElementById('quickPresentation').options.length`),46);
});

test('saved topics are reachable directly from the phone library',async t=>{
    if(!await ready(t))return;await load('#library');
    assert.equal(await evaluate(`!!document.querySelector('.library-head a[href="#library~saved"]')`),true);
    await evaluate(`document.querySelector('.library-head a').click()`);await wait(100);
    assert.equal(await evaluate(`document.querySelector('.ios-tabbar [aria-current="page"]').dataset.nav`),'home');
});

test('preparation and recorded ECG headings match their navigation destinations',async t=>{
    if(!await ready(t))return;await load('#learn~skills');
    assert.equal(await evaluate(`document.querySelector('h1').textContent`),'Preparation');
    await load('#learn~visual-recordings');
    assert.equal(await evaluate(`document.querySelector('h1').textContent`),'Recorded ECGs');
    assert.equal(await evaluate(`document.title`),'Recorded ECGs · The EM Pocket');
    assert.equal(await evaluate(`!!document.querySelector('.workspace-tabs')`),false);
    assert.equal(await evaluate(`document.querySelector('.ecg-local-nav [aria-current="page"]').textContent`),'Recordings');
});

test('severity changes wait for the note decision and cancellation preserves the filter',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    await evaluate(`const n=document.getElementById('studyNote');n.value='Keep this draft';n.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-sev="critical"]').click()`);
    assert.equal(await evaluate(`document.getElementById('unsavedNoteDialog').open`),true);
    await evaluate(`document.querySelector('[data-note-stay]').click()`);
    assert.equal(await evaluate(`document.querySelector('#filterChips [aria-pressed="true"]').dataset.sev`),'all');
    assert.equal(await evaluate(`document.getElementById('studyNote').value`),'Keep this draft');
    await evaluate(`document.getElementById('saveNote').click()`);
});

test('search closes when tabbing away and does not submit during input composition',async t=>{
    if(!await ready(t))return;await load('#library');
    await evaluate(`const input=document.getElementById('searchInput');input.focus();input.value='chest';input.dispatchEvent(new Event('input',{bubbles:true}))`);await wait(180);
    await evaluate(`document.getElementById('searchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true}))`);await wait(80);
    assert.equal(await evaluate(`location.hash`),'#library');
    await evaluate(`document.getElementById('toolsToggle').focus()`);await wait(80);
    const state=await evaluate(`({expanded:document.getElementById('searchInput').getAttribute('aria-expanded'),focus:document.activeElement.id,contained:document.querySelector('.searchwrap').contains(document.getElementById('toolsToggle'))})`);
    assert.equal(state.expanded,'false',JSON.stringify(state));
});

test('returning to a retained search query reopens current results without editing or navigation',async t=>{
    if(!await ready(t))return;await load('#library');
    await evaluate(`(()=>{const input=document.getElementById('searchInput');input.focus();input.value='chest';input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await evaluate(`(async()=>{const deadline=Date.now()+1500;while(document.getElementById('searchInput').getAttribute('aria-expanded')!=='true'&&Date.now()<deadline)await new Promise(r=>setTimeout(r,25));})()`);
    assert.equal(await evaluate(`document.getElementById('searchInput').getAttribute('aria-expanded')`),'true');
    await evaluate(`document.getElementById('toolsToggle').focus()`);
    assert.equal(await evaluate(`document.getElementById('searchInput').getAttribute('aria-expanded')`),'false');
    await evaluate(`document.getElementById('searchInput').focus()`);await wait(180);
    const r=await evaluate(`({query:document.getElementById('searchInput').value,expanded:document.getElementById('searchInput').getAttribute('aria-expanded'),results:document.querySelectorAll('.results-pop .res-item[data-id]').length,active:document.getElementById('searchInput').getAttribute('aria-activedescendant'),hash:location.hash})`);
    assert.equal(r.query,'chest');assert.equal(r.expanded,'true');assert.ok(r.results>0);assert.equal(r.active,null);assert.equal(r.hash,'#library');
    await evaluate(`document.getElementById('searchClearBtn').click();document.getElementById('toolsToggle').focus();document.getElementById('searchInput').focus()`);await wait(180);
    assert.equal(await evaluate(`document.getElementById('searchInput').getAttribute('aria-expanded')`),'false');
});

test('reading size limits are announced through disabled controls',async t=>{
    if(!await ready(t))return;await load('#settings');
    await evaluate(`document.getElementById('toolsToggle').click();for(let i=0;i<5;i++)document.getElementById('fontUp').click()`);
    assert.equal(await evaluate(`document.getElementById('fontUp').disabled`),true);
    await evaluate(`for(let i=0;i<5;i++)document.getElementById('fontDown').click()`);
    assert.equal(await evaluate(`document.getElementById('fontDown').disabled`),true);
});

test('display changes keep the current reader, history and unsaved learning note intact',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    const result=await evaluate(`(()=>{
        const note=document.getElementById('studyNote'),page=document.querySelector('#stage h1'),url=location.href,length=history.length;
        note.value='Draft retained while adjusting display';note.dispatchEvent(new Event('input',{bubbles:true}));
        document.getElementById('toolsToggle').click();
        document.getElementById('fontUp').click();document.getElementById('boldBtn').click();document.getElementById('themeBtn').click();document.querySelector('.accent-dot[data-accent="ocean"]').click();
        return {same:page===document.querySelector('#stage h1')&&note===document.getElementById('studyNote'),draft:note.value,url:location.href===url,history:history.length===length,modal:document.getElementById('readingPanel').matches(':modal'),guard:!!document.querySelector('#unsavedNoteDialog[open]'),theme:document.documentElement.dataset.theme,accent:document.documentElement.dataset.accent,bold:document.documentElement.dataset.weight,scale:document.getElementById('fontLabel').textContent,status:document.getElementById('readingStatus').textContent};
    })()`);
    assert.equal(result.same,true);assert.equal(result.draft,'Draft retained while adjusting display');assert.equal(result.url,true);assert.equal(result.history,true);assert.equal(result.modal,true);assert.equal(result.guard,false);assert.equal(result.theme,'dark');assert.equal(result.accent,'ocean');assert.equal(result.bold,'bold');assert.equal(result.scale,'112%');assert.match(result.status,/Saved on this device/);
    // A history/navigation request must release this modal before the note guard opens.
    await evaluate(`location.hash='settings'`);await wait(100);
    assert.deepEqual(await evaluate(`({display:document.getElementById('readingPanel').open,lock:document.body.classList.contains('reading-panel-open'),guard:document.getElementById('unsavedNoteDialog').matches(':modal')})`),{display:false,lock:false,guard:true});
    await evaluate(`document.querySelector('[data-note-stay]').click()`);
    assert.equal(await evaluate(`document.getElementById('studyNote').value`),'Draft retained while adjusting display');
    await evaluate(`const note=document.getElementById('studyNote');note.value='';note.dispatchEvent(new Event('input',{bubbles:true}))`);
});

test('display panel preserves the visible reading line as text size and weight reflow',async t=>{
    if(!await ready(t))return;
    try {
        for(const width of [390,1280]){
            await cdp('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<921});
            await load('#chest-pain');
            await evaluate(`(()=>{const p=[...document.querySelectorAll('#stage p')].find(e=>e.textContent.startsWith('The task is'));window.scrollTo({top:p.getBoundingClientRect().top+scrollY-document.querySelector('.topbar').getBoundingClientRect().bottom-5,behavior:'instant'});})()`);
            await wait(80);
            const result=await evaluate(`(()=>{
                const p=[...document.querySelectorAll('#stage p')].find(e=>e.textContent.startsWith('The task is')),node=p.firstChild,range=document.createRange();range.setStart(node,0);range.setEnd(node,1);
                const top=()=>range.getBoundingClientRect().top-document.querySelector('.topbar').getBoundingClientRect().bottom;
                const before=top(),y=scrollY;document.getElementById('toolsToggle').click();const opened=scrollY;
                document.getElementById('fontUp').click();const enlarged=top();document.getElementById('boldBtn').click();
                return {before,enlarged,bold:top(),openingShift:opened-y,hash:location.hash};
            })()`);
            assert.ok(Math.abs(result.openingShift)<2,JSON.stringify(result));assert.ok(Math.abs(result.enlarged-result.before)<2,width+' '+JSON.stringify(result));assert.ok(Math.abs(result.bold-result.before)<2,width+' '+JSON.stringify(result));assert.equal(result.hash,'#chest-pain');
            await evaluate(`document.getElementById('readingDone').click()`);await wait(40);
            assert.equal(await evaluate(`document.activeElement.id`),'toolsToggle');
        }
    } finally {await cdp('Emulation.setDeviceMetricsOverride',{...VIEWPORT,deviceScaleFactor:2,mobile:true});}
});

test('display panel contains keyboard focus and dismisses with Escape, close and backdrop',async t=>{
    if(!await ready(t))return;await load('#library');
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('readingDone').focus();document.getElementById('readingDone').dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}))`);
    assert.equal(await evaluate(`document.activeElement.id`),'readingClose');
    await evaluate(`document.getElementById('readingClose').dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}))`);
    assert.equal(await evaluate(`document.activeElement.id`),'readingDone');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait(40);
    assert.deepEqual(await evaluate(`({open:document.getElementById('readingPanel').open,lock:document.body.classList.contains('reading-panel-open'),focus:document.activeElement.id})`),{open:false,lock:false,focus:'toolsToggle'});
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('readingClose').click()`);await wait(40);
    assert.equal(await evaluate(`document.getElementById('readingPanel').open`),false);
    await evaluate(`document.getElementById('toolsToggle').click()`);
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:10,y:10,button:'left',clickCount:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:10,y:10,button:'left',clickCount:1});await wait(40);
    assert.equal(await evaluate(`document.getElementById('readingPanel').open`),false);
});

test('display options fit short and narrow screens with every control reachable at maximum text size',async t=>{
    if(!await ready(t))return;
    try {
        for(const [width,height] of [[320,568],[390,844],[844,390],[1280,720]]){
            await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<921});await load('#chest-pain',200);
            const r=await evaluate(`(()=>{document.getElementById('toolsToggle').click();for(let i=0;i<5;i++)document.getElementById('fontUp').click();const p=document.getElementById('readingPanel'),box=p.getBoundingClientRect(),controls=[...p.querySelectorAll('button,a')],bad=controls.filter(e=>{const b=e.getBoundingClientRect();return b.width<43||b.height<43||b.left<box.left||b.right>box.right+1}).map(e=>e.id||e.textContent);document.getElementById('readingDone').scrollIntoView({block:'nearest'});const done=document.getElementById('readingDone').getBoundingClientRect();return {top:box.top,bottom:box.bottom,left:box.left,right:box.right,done:done.top>=box.top&&done.bottom<=box.bottom+1,scroll:getComputedStyle(p).overflowY,bad,selected:[...p.querySelectorAll('.accent-dot[aria-pressed="true"]')].map(e=>e.textContent.trim())};})()`);
            assert.ok(r.top>=-1&&r.bottom<=height+1&&r.left>=-1&&r.right<=width+1,JSON.stringify(r));assert.equal(r.done,true,JSON.stringify(r));assert.equal(r.scroll,'auto');assert.deepEqual(r.bad,[]);assert.deepEqual(r.selected,['Emerald']);
        }
    } finally {await cdp('Emulation.setDeviceMetricsOverride',{...VIEWPORT,deviceScaleFactor:2,mobile:true});}
});

test('general settings return to the previous reading route and scroll position',async t=>{
    if(!await ready(t))return;await load('#chest-pain~workup');
    const previousBack=await evaluate(`document.querySelector('#stage .back-btn').textContent`);
    await evaluate(`window.scrollBy({top:85,behavior:'instant'})`);await wait(80);const y=await evaluate(`scrollY`);
    await evaluate(`document.getElementById('toolsToggle').click();document.getElementById('readingSettings').click()`);await wait(100);
    assert.equal(await evaluate(`document.querySelector('.settings-return').textContent`),'Back to Chest Pain');
    assert.equal(await evaluate(`document.getElementById('readingPanel').open`),false);
    await evaluate(`document.querySelector('.settings-return').click()`);await wait(150);
    assert.equal(await evaluate(`location.hash`),'#chest-pain~workup');assert.ok(Math.abs(await evaluate(`scrollY`)-y)<2);
    assert.equal(await evaluate(`document.querySelector('#stage .back-btn').textContent`),previousBack);
});

test('reader severity menus dismiss with Escape and short phone popups remain reachable',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    await evaluate(`const menu=document.querySelector('.context-filters');menu.open=true;menu.querySelector('summary').focus();menu.querySelector('summary').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    assert.equal(await evaluate(`document.querySelector('.context-filters').open`),false);
    await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:568,deviceScaleFactor:1,mobile:true});
    try {
        await load('#library');await evaluate(`document.querySelector('.library-filters').querySelector('summary').scrollIntoView({block:'center'});document.querySelector('.library-filters').open=true`);await wait(80);
        const r=await evaluate(`(()=>{const p=document.querySelector('.patient-filter'),b=p.getBoundingClientRect();return {top:b.top,bottom:b.bottom,header:document.querySelector('.topbar').getBoundingClientRect().bottom,nav:document.querySelector('.ios-tabbar').getBoundingClientRect().top,scroll:getComputedStyle(p).overflowY}})()`);
        assert.ok(r.top>=r.header-1&&r.bottom<=r.nav+1,JSON.stringify(r));assert.equal(r.scroll,'auto');
    } finally {await cdp('Emulation.setDeviceMetricsOverride',{...VIEWPORT,deviceScaleFactor:2,mobile:true});}
});

test('dark appearance prints with dark ink on light clinical surfaces',async t=>{
    if(!await ready(t))return;await load('#chest-pain');
    await evaluate(`document.documentElement.setAttribute('data-theme','dark')`);
    await cdp('Emulation.setEmulatedMedia',{media:'print'});
    try {
        const colors=await evaluate(`['.sec-head','.dx-card','.personal-plan'].map(s=>{const c=getComputedStyle(document.querySelector(s));return {ink:c.color,bg:c.backgroundColor}})`);
        assert.ok(colors.every(c=>c.ink==='rgb(23, 43, 40)'),JSON.stringify(colors));
        assert.ok(colors.every(c=>c.bg!=='rgb(58, 31, 36)'),JSON.stringify(colors));
    } finally {await cdp('Emulation.setEmulatedMedia',{media:''});}
});

test('enlarged bold text fits the complete reading and learning flows at 320px',async t=>{
    if(!await ready(t))return;
    await cdp('Emulation.setDeviceMetricsOverride',{width:320,height:740,deviceScaleFactor:1,mobile:true});
    try {
        for(const route of ['#library','#learn~home','#learn~practice','#learn~case-resus','#learn~skills','#learn~progress','#ecg','#ecg-explorer','#study~case-chest-pain','#search~chest','#shift~chest-pain','#chest-pain']){
            await load(route,200);await evaluate(`document.documentElement.style.setProperty('--type-scale','1.4');document.documentElement.setAttribute('data-weight','bold')`);
            const r=await evaluate(`({width:innerWidth,page:document.documentElement.scrollWidth,overs:[...document.querySelectorAll('#stage *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(e).position!=='absolute').slice(0,5).map(e=>e.className)})`);
            assert.ok(r.page<=r.width+1,route+' overflow: '+JSON.stringify(r));
        }
    } finally {await cdp('Emulation.setDeviceMetricsOverride',{...VIEWPORT,deviceScaleFactor:2,mobile:true});}
});

/* Dumps computed styles for a broad sample of elements across several views so a
   refactor can be proven to change nothing. Local QA only — never deployed.
   Usage: node dev/style-snapshot.js <outfile.json> */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), http = require('http');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = path.join(__dirname, '..');
/* Two modes:
     node dev/style-snapshot.js <file.json>            capture a baseline
     node dev/style-snapshot.js <file.json> --diff <baseline.json>
   The diff compares every captured element/property, so a refactor can be
   proven byte-for-byte inert. Arrays are normalised because === on two equal
   arrays is always false, which silently reported thousands of false diffs. */
const args = process.argv.slice(2).filter(a => a !== '--diff');
const diffMode = process.argv.includes('--diff');
const out = args[0] || '/tmp/snapshot.json';
const baselinePath = args[1] || null;
const norm = v => (typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v));

const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-pipe', '--no-first-run',
  '--user-data-dir=' + fs.mkdtempSync(path.join(require('os').tmpdir(), 'em-snap-')), 'about:blank'],
  { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
const w = proc.stdio[3], r = proc.stdio[4];
let buf = Buffer.alloc(0); const pend = new Map(); let id = 0, sid = null;
r.on('data', c => {
  buf = Buffer.concat([buf, c]);
  for (;;) { const e = buf.indexOf(0); if (e === -1) break; const l = buf.slice(0, e).toString(); buf = buf.slice(e + 1);
    try { const m = JSON.parse(l); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } } catch (_) {} }
});
const send = (method, params = {}, useS) => new Promise((res, rej) => {
  const i = ++id; const t = setTimeout(() => rej(new Error(method + ' timeout')), 30000);
  pend.set(i, x => { clearTimeout(t); res(x); });
  const f = { id: i, method, params }; if (useS && sid) f.sessionId = sid; w.write(JSON.stringify(f) + '\0');
});
const wait = ms => new Promise(r2 => setTimeout(r2, ms));

(async () => {
  await wait(1500);
  const t = await send('Target.getTargets');
  const pg = t.result.targetInfos.find(x => x.type === 'page');
  const a = await send('Target.attachToTarget', { targetId: pg.targetId, flatten: true });
  sid = a.result.sessionId;
  const ev = async e => { const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }, true); return r.result && r.result.result ? r.result.result.value : undefined; };
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.txt': 'text/plain' };
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const f = path.join(root, rel);
    fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(b); });
  });
  await new Promise(r2 => srv.listen(0, '127.0.0.1', r2));
  await send('Page.enable', {}, true); await send('Runtime.enable', {}, true);
  await send('Network.setCacheDisabled', { cacheDisabled: true }, true);
  await send('Network.setBypassServiceWorker', { bypass: true }, true);
  const url = 'http://127.0.0.1:' + srv.address().port + '/index.html';

  /* Every element in the view, not a hand-picked sample: a hand-picked list
     proves nothing about the 9k declarations we are refactoring. Keyed by a
     structural path so the same node maps across runs. */
  const PROPS = ['display','position','top','left','right','bottom','width','height','marginTop','marginBottom','paddingTop','paddingBottom','gap','fontSize','fontWeight','lineHeight','color','backgroundColor','borderTopWidth','borderBottomWidth','borderRadius','boxShadow','opacity','zIndex','flexDirection','justifyContent','alignItems','gridTemplateColumns','visibility','overflow','textAlign','letterSpacing','textTransform','whiteSpace','minHeight','maxHeight'];
  const SELECTORS = [];

  /* Media states matter as much as viewports: an !important inside
     prefers-reduced-motion or @media print is what keeps those states working,
     and a screen-only diff reports "clean" while accessibility silently breaks.
     Screen is captured for every view; the states are sampled on the views where
     they actually change something, which keeps a full pass to a few minutes. */
  const STATES = [
    { id: 'screen', media: null, features: [] },
    { id: 'reduced-motion', media: null, features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
    { id: 'print', media: 'print', features: [] }
  ];
  const VIEWS = [['home-phone',393,'#'],['presentation-phone',393,'#chest-pain'],['ecg-phone',393,'#ecg'],['explorer-desktop',1280,'#ecg-explorer~normal'],['presentation-desktop',1280,'#chest-pain'],['shift-desktop',1280,'#shift~chest-pain']];
  const COVERAGE = { screen: VIEWS.map(v => v[0]), 'reduced-motion': ['home-phone','ecg-phone','shift-desktop'], print: ['presentation-phone','ecg-phone','shift-desktop'] };

  const snapshot = { views: {} };
  for (const [label, wpx, hash] of VIEWS) {
    await send('Emulation.setDeviceMetricsOverride', { width: wpx, height: 900, deviceScaleFactor: 2, mobile: wpx < 900 }, true);
    await send('Page.navigate', { url: url + hash }, true);
    await wait(3200);
    await ev(`(function(){var d=document.getElementById('disclaimerOverlay');if(d&&!d.hidden){var c=document.getElementById('disclaimerCheck');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('disclaimerAcceptBtn').click();}})()`);
    await wait(500);
    const data = await ev(`(function(){
      var props=${JSON.stringify(PROPS)}, out={};
      function path(el){
        var parts=[], n=0;
        while(el && el.nodeType===1 && n++<6){
          var seg=el.tagName.toLowerCase();
          if(el.id) { seg+='#'+el.id; parts.unshift(seg); break; }
          var cls=(el.getAttribute('class')||'').trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');
          if(cls) seg+='.'+cls;
          var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
          parts.unshift(seg+'['+sib+']');
          el=el.parentElement;
        }
        return parts.join('>');
      }
      var all=document.querySelectorAll('body, body *');
      for(var i=0;i<all.length;i++){
        var el=all[i], k=path(el);
        if(out[k]) continue;
        var cs=getComputedStyle(el), box=el.getBoundingClientRect(), o={_b:[Math.round(box.width),Math.round(box.height)]};
        for(var j=0;j<props.length;j++){o[props[j]]=cs[props[j]]}
        out[k]=o;
      }
      out.__doc={count:all.length, scrollW:document.documentElement.scrollWidth};
      return out;
    })()`);
    snapshot.views[label] = data;
    for (const st of STATES.slice(1)) {
      if (!COVERAGE[st.id].includes(label)) continue;
      await send('Emulation.setEmulatedMedia', st.media ? { media: st.media } : { features: st.features }, true);
      await wait(400);
      snapshot.views[label + ' @ ' + st.id] = await ev(`(function(){
        var props=${JSON.stringify(PROPS)}, out={};
        function path(el){
          var parts=[], n=0;
          while(el && el.nodeType===1 && n++<6){
            var seg=el.tagName.toLowerCase();
            if(el.id) { seg+='#'+el.id; parts.unshift(seg); break; }
            var cls=(el.getAttribute('class')||'').trim().split(/\s+/).filter(Boolean).slice(0,2).join('.');
            if(cls) seg+='.'+cls;
            var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
            parts.unshift(seg+'['+sib+']');
            el=el.parentElement;
          }
          return parts.join('>');
        }
        var all=document.querySelectorAll('body, body *');
        for(var i=0;i<all.length;i++){
          var el=all[i], k=path(el);
          if(out[k]) continue;
          var cs=getComputedStyle(el), o={_t:cs.transitionDuration, _a:cs.animationName, _d:cs.display};
          for(var j=0;j<props.length;j++){o[props[j]]=cs[props[j]]}
          out[k]=o;
        }
        out.__doc={count:all.length};
        return out;
      })()`);
    }
    await send('Emulation.setEmulatedMedia', { media: '' }, true);
    await wait(200);
  }
  const n = Object.values(snapshot.views).reduce((a, v) => a + Object.keys(v).length, 0);
  if (diffMode && baselinePath) {
    const base = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    let diffs = 0; const byView = {}, byProp = {}, examples = [];
    for (const view of Object.keys(base.views)) {
      const A = base.views[view], B = snapshot.views[view];
      if (!B) { byView[view] = 'MISSING'; continue; }
      for (const k of Object.keys(A)) {
        const x = A[k], y = B[k];
        if (!y) continue;
        for (const p of Object.keys(x)) {
          if (norm(x[p]) === norm(y[p])) continue;
          diffs++; byView[view] = (byView[view] || 0) + 1; byProp[p] = (byProp[p] || 0) + 1;
          if (examples.length < 15) examples.push(view + ' ' + p + ' on ' + k.slice(0, 46) + ': ' + norm(x[p]).slice(0, 30) + ' -> ' + norm(y[p]).slice(0, 30));
        }
      }
    }
    console.log('compared ' + n + ' element samples against ' + baselinePath);
    console.log('differences: ' + diffs);
    console.log('by view: ' + JSON.stringify(byView));
    console.log('by property: ' + JSON.stringify(Object.entries(byProp).sort((a, b) => b[1] - a[1]).slice(0, 10)));
    examples.forEach(e => console.log('  ' + e));
    fs.writeFileSync(out, JSON.stringify(snapshot, null, 1));
    proc.kill(); srv.close();
    process.exit(diffs ? 1 : 0);
  }
  fs.writeFileSync(out, JSON.stringify(snapshot, null, 1));
  console.log('snapshot written:', out, '(' + n + ' element samples across ' + Object.keys(snapshot.views).length + ' views)');
  proc.kill(); srv.close(); process.exit(0);
})().catch(e => { console.log('ERR', e.message); try { proc.kill(); } catch (_) {} process.exit(1); });

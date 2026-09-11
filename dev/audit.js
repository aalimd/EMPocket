/* Local-only browser regression fixture. Never deploy dev/. */
(async function () {
  'use strict';
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) { document.body.textContent = 'Local audit only.'; return; }
  const output = document.querySelector('#result'), gallery = document.querySelector('#gallery');
  const source = await (await fetch('../assets/app.js?v=20260911-streamline-r1')).text();
  function extract(name) {
    const start = source.indexOf('\n    function ' + name + '(');
    const end = source.indexOf('\n    function ', start + 1);
    if (start < 0 || end < 0) throw new Error('Missing function ' + name);
    return source.slice(start, end);
  }
  const functions = new Function('window', 'document', ['esc', 'rich', 'ecgSvgWithRef', 'ecgFigure'].map(extract).join('\n') + '\nreturn {esc, rich, ecgFigure};')(window, document);
  const select = document.querySelector('#figure');
  Object.keys(window.ECG_SVG).forEach(id => select.add(new Option(id, id)));
  function show() { gallery.innerHTML = '<h2>' + functions.esc(window.ECG_SVG[select.value].title) + '</h2>' + functions.ecgFigure(select.value); }
  select.addEventListener('change', show); show();
  document.querySelector('#enlarge').onclick = function () { window.ECG_INTERACTIVE.open(select.value, this); };
  gallery.addEventListener('click', event => { const b = event.target.closest('[data-ecg-tool]'); if (!b) return; if (['expand', 'explain'].includes(b.dataset.ecgTool)) window.ECG_INTERACTIVE.open(select.value, b); else gallery.querySelector('figure').classList.toggle(b.dataset.ecgTool === 'compare' ? 'show-reference' : 'hide-labels'); });
  gallery.addEventListener('change', event => { if (event.target.matches('[data-ecg-panel]')) gallery.querySelector('svg').setAttribute('viewBox', event.target.value); });
  const frame = document.querySelector('#app'), route = document.querySelector('#route');
  ['home', 'ecg', 'ecg-explorer', 'study', 'shift', ...window.CP_DATA.map(cp => cp.id)].forEach(id => route.add(new Option(id, id)));
  const parsed = new DOMParser().parseFromString(await (await fetch('../index.html?audit=20260911-streamline-r1')).text(), 'text/html');
  parsed.querySelector('#disclaimerOverlay').remove();
  const base = parsed.createElement('base'); base.href = new URL('../', location.href).href; parsed.head.prepend(base);
  frame.srcdoc = '<!doctype html>' + parsed.documentElement.outerHTML;
  const ready = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
  route.onchange = () => { frame.contentWindow.location.hash = route.value === 'home' ? '' : route.value; };
  function assert(value, label) { if (!value) throw new Error(label); }
  async function run() {
    const results = [], failures = [];
    const check = (label, fn) => { try { fn(); results.push(label); } catch (e) { failures.push(label + ': ' + e.message); } };
    check('Sanitizer rejects nested executable elements and attributes', () => {
      for (const html of ['<div><img src=x onerror=alert(1)><strong onclick=alert(1)>keep</strong></div>', '<section><p><em onmouseover=alert(1)>keep</em></p></section>', '<svg><script>alert(1)</script></svg><strong>keep</strong>']) {
        const t = document.createElement('template'); t.innerHTML = functions.rich(html);
        assert(!t.content.querySelector('img,script,svg,iframe,[onclick],[onerror],[onmouseover]'), t.innerHTML);
        assert(t.content.textContent.includes('keep'), 'Lost allowed text');
      }
      assert(functions.rich('K < 3.5; <strong>do not delay</strong> &amp; reassess').includes('do not delay'), 'Clinical text lost');
    });
    check('Escaping closes quoted-attribute injection', () => { const t = document.createElement('template'); t.innerHTML = '<div title="' + functions.esc('\" autofocus onfocus=alert(1)') + '"></div>'; assert(t.content.firstChild.attributes.length === 1, 'Injected attribute'); });
    check('All 27 SVGs parse and fit their own label bounds', () => {
      for (const [id, entry] of Object.entries(window.ECG_SVG)) { check('Figure ' + id, () => {
        const xml = new DOMParser().parseFromString(entry.svg, 'image/svg+xml'); assert(!xml.querySelector('parsererror'), id);
        assert(!/NaN|Infinity/.test(entry.svg), id);
        gallery.innerHTML = functions.ecgFigure(id);
        const svg = gallery.querySelector('svg'), vb = svg.viewBox.baseVal;
        for (const text of svg.querySelectorAll('text')) { const b = text.getBBox(); assert(b.x >= -1 && b.x + b.width <= vb.width + 2 && b.y >= -1 && b.y + b.height <= vb.height + 2, id + ' label outside: ' + text.textContent); }
      }); }
    });
    await ready;
    for (const width of [320, 390, 768, 1280]) {
      frame.style.width = width + 'px';
      for(let n=0;frame.contentWindow.innerWidth!==width&&n<120;n++)await new Promise(r=>requestAnimationFrame(r));
      for (const id of ['home', 'ecg', 'ecg-explorer', 'study', 'shift', ...window.CP_DATA.map(cp => cp.id)]) {
        const next=id==='home'?'':id;
        if(frame.contentWindow.location.hash.replace(/^#/,'')!==next)await new Promise(resolve=>{frame.contentWindow.addEventListener('hashchange',resolve,{once:true});frame.contentWindow.location.hash=next;});
        await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>frame.contentWindow.requestAnimationFrame(resolve)));
        check('Route ' + id + ' at ' + width + 'px', () => {
          const doc = frame.contentDocument;
          assert(frame.contentWindow.innerWidth === width, 'Wrong fixture viewport');
          assert(doc.querySelector('#stage').textContent.trim().length > 100, 'Blank stage');
          assert(!/undefined|NaN|Could not load/.test(doc.querySelector('#stage').textContent), 'Invalid rendered content');
          assert(doc.documentElement.scrollWidth <= doc.documentElement.clientWidth + 2, 'Page overflow');
          if(id==='ecg-explorer') {assert(!!doc.querySelector('.explorer-findings h2')&&!!doc.querySelector('[data-control="case"]').value,'Explorer route failed');assert(doc.querySelector('#explorerBtn').getAttribute('aria-current')==='page','Explorer navigation not active');}
        });
      }
    }
    route.value = 'ecg'; route.onchange(); show();
    output.textContent = results.length + ' checks passed; ' + failures.length + ' failed.\n' + failures.join('\n');
  }
  document.querySelector('#run').onclick = () => run().catch(e => output.textContent = e.stack);
  output.textContent = 'Ready. Choose a figure or run checks.';
}());

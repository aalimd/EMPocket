'use strict';
// Run: node tests/ecg.test.js. Tests numerical/rendering contracts, not diagnostic validity.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const root = require('node:path').join(__dirname, '..');
const ctx = { window: { addEventListener() {} } };
vm.createContext(ctx);
for (const name of ['ecg-svg', 'ecg-engine', 'ecg-case-tracings', 'ecg-interactive', 'data']) {
  vm.runInContext(fs.readFileSync(`${root}/assets/${name}.js`, 'utf8'), ctx);
}
const E = ctx.window.ECG_ENGINE, I = ctx.window.ECG_INTERACTIVE, lib = ctx.window.ECG_SVG;
test('all 25 guide figures resolve; ten modeled patterns plus a full normal reference', () => {
  const ids = [...ctx.window.ECG_DATA.steps, ...ctx.window.ECG_DATA.patterns].map(e => e.id);
  assert.equal(ids.length, 25);
  for (const id of ids) { assert.ok(lib[id]?.svg, id); assert.ok(lib[id].caption, id); }
  assert.equal(Object.values(lib).filter(e => e.traceSpec).length, 10);
  assert.match(lib['normal-12lead'].svg, /II rhythm/);
});
test('61 existing geometry, morphology, interval and pattern probes pass', () => {
  const c = E.createNormalSinusCase();
  const checks = [...E.validateGeometry(), ...E.validateNormalMorphology(c).checks, ...E.validateIntervals(c), ...E.validatePatterns()];
  for (const check of checks) assert.ok(check.ok, `${check.name}: ${check.got}`);
  assert.equal(checks.length, 61);
});
test('noise disabled is honored for every modeled lane, including sine and VT', () => {
  for (const entry of Object.values(lib).filter(e => e.traceSpec)) {
    for (const lane of entry.traceSpec.lanes) {
      const { data } = I.signal(entry.traceSpec, lane, false);
      for (const key of ['baselineWander', 'muscle', 'beatVariation', 'rsaMs']) assert.equal(data.noise[key], 0, `${entry.title}/${lane}/${key}`);
    }
  }
});
test('QT timing scales around nominal J; widening QRS preserves requested QT endpoint', () => {
  // Probe the T peak (normal shape's nominal peak is 275, nominal J is 88).
  for (const qrs of [88, 130, 150]) {
    const c = E.createNormalSinusCase({ qrsMs: qrs, qtMs: 460, noise: { disabled: true } });
    const q = c.beatTimes[2], expected = qrs + (275 - 88) * (460 - qrs) / (380 - 88);
    let peak = -Infinity, peakTime;
    for (let t = 200; t < 450; t++) { const v = E.leadVoltageAt('V5', q + t, c); if (v > peak) { peak = v; peakTime = t; } }
    assert.ok(Math.abs(peakTime - expected) < 2, `${qrs}: ${peakTime} vs ${expected}`);
  }
});
test('calipers return physical intervals independent of gain, speed, placement or zoom', () => {
  for (const speed of [25, 50]) for (const gain of [5, 10, 20]) {
    const ux = 8 * speed / 1000, uy = 8 * gain;
    const a = { x: 80 + 400 * ux, y: 250 }, b = { x: 80 + 1200 * ux, y: 250 - .2 * uy };
    const m = I.measure(a, b, ux, uy);
    assert.equal(m.ms, 800); assert.equal(m.mv, .2); assert.equal(m.rrRate, 75);
    const reverse = I.measure(b, a, ux, uy); assert.equal(reverse.ms, 800); assert.equal(reverse.mv, -.2);
  }
  assert.equal(I.measure({x:0,y:0}, {x:0,y:8}, .2, 80).rrRate, null);
});
test('all modeled traces stay within their lane at every supported gain and speed', () => {
  for (const entry of Object.values(lib).filter(e => e.traceSpec)) for (const gain of [5, 10, 20]) for (const speed of [25, 50]) {
    const out = I.render(entry.traceSpec, {gain, speed, duration:10000, artifact:true});
    assert.ok(!/NaN|Infinity/.test(out.svg), entry.title);
    assert.equal(out.width, 112 + 10000 * speed * 8 / 1000);
    let bottom = 0;
    for (const row of out.rows) {
      assert.ok(row.top > bottom, entry.title);
      for (let t = 0; t <= 10000; t += 2) {
        const y = row.baseline - E.leadVoltageAt(row.lead, t, row.data, t / 2) * out.uy;
        assert.ok(y >= row.top + 40 && y < row.bottom, `${entry.title}: y=${y}`);
      }
      bottom = row.bottom;
    }
    assert.ok(out.height - 16 - 8 * gain > bottom, 'calibration pulse clears final lane');
  }
});
test('rendered signals repeat deterministically; SVG pattern IDs are unique', () => {
  const spec = lib.wellens.traceSpec;
  const a = I.render(spec), b = I.render(spec);
  const paths = svg => [...svg.matchAll(/class="ecg-trace ecg-signal" d="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(paths(a.svg), paths(b.svg));
  const ids = svg => [...svg.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
  assert.ok(ids(a.svg).every(id => !ids(b.svg).includes(id)));
});
test('service worker precaches every HTML runtime asset with matching release tokens', () => {
  const html = fs.readFileSync(`${root}/index.html`, 'utf8'), sw = fs.readFileSync(`${root}/sw.js`, 'utf8');
  for (const [, url] of html.matchAll(/(?:src|href)="(assets\/[^"?]+\.(?:js|css)\?v=[^"]+)"/g)) assert.ok(sw.includes('./' + url), url);
  for (const [, url] of sw.matchAll(/'\.\/(assets\/[^'?]+)\?v=/g)) assert.ok(fs.existsSync(`${root}/${url}`), url);
});
test('unsupported diagnoses cannot silently render a normal ECG', () => {
  assert.throws(() => E.createPatternCase('not-a-supported-diagnosis'), /Unsupported ECG pattern/);
  assert.equal(E.createPatternCase('normal-sinus').kind, 'normal-sinus');
});

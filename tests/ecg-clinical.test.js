'use strict';
// Regression checks for measured signal features, not clinical validation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ctx = { window: {} };
vm.createContext(ctx);
for (const name of ['ecg-svg', 'ecg-engine', 'ecg-case-tracings']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/', name + '.js'), 'utf8'), ctx);
const E = ctx.window.ECG_ENGINE;
const clean = (id, options) => E.createPatternCase(id, Object.assign({ noise: { disabled: true } }, options));
const voltage = (c, lead, dt) => E.leadVoltageAt(lead, c.beatTimes[2] + dt, c);

test('normal and inferior limb signals preserve Einthoven and Goldberger identities', () => {
  for (const c of [clean('normal-sinus'), clean('stemi-criteria')]) {
    for (let t = 0; t < 3000; t += 7) {
      const v = name => E.leadVoltageAt(name, t, c);
      for (const [name, actual, expected] of [['III', v('III'), v('II') - v('I')], ['aVR', v('aVR'), -(v('I') + v('II')) / 2], ['aVL', v('aVL'), v('I') - v('II') / 2], ['aVF', v('aVF'), v('II') - v('I') / 2]]) {
        assert.ok(Math.abs(actual - expected) < 1e-9, `${c.kind}/${name}/${t}: ${actual} vs ${expected}`);
      }
    }
  }
});

test('de Winter depression rises continuously from J in V2–V6, with distinct lead morphology', () => {
  const c = clean('dewinter'), peaks = [];
  for (const lead of ['V2', 'V3', 'V4', 'V5', 'V6']) {
    assert.ok(voltage(c, lead, c.qrsMs) <= -.09, lead + ' J depression');
    let previous = voltage(c, lead, c.qrsMs);
    for (let dt = c.qrsMs + 2; dt < 230; dt += 2) {
      const current = voltage(c, lead, dt);
      assert.ok(current >= previous - .0001, lead + ' ST must not initially fall');
      previous = current;
    }
    let peak = 0;
    for (let dt = 160; dt < 400; dt++) peak = Math.max(peak, voltage(c, lead, dt));
    assert.ok(peak >= .7, lead + ' tall T'); peaks.push(peak.toFixed(3));
  }
  assert.equal(new Set(peaks).size, 5);
});

test('posterior anterior leads have a horizontal depressed ST followed by upright T', () => {
  const c = clean('posterior-omi');
  for (const lead of ['V1', 'V2', 'V3']) {
    const values = [10, 20, 40, 60].map(dt => voltage(c, lead, c.qrsMs + dt));
    assert.ok(values.every(v => v < -.08), lead);
    assert.ok(Math.max(...values) - Math.min(...values) < .01, lead + ' horizontal ST');
    assert.ok(voltage(c, lead, 280) > .25, lead + ' upright T');
    assert.ok(voltage(c, lead, 24) > .20, lead + ' broad dominant R');
  }
});

test('Wellens A/B exist in anatomical V2 and V3 and preserve R progression', () => {
  for (const variant of ['A', 'B']) {
    const c = clean('wellens', { variant });
    for (const lead of ['V2', 'V3']) {
      const t = [];
      for (let dt = 170; dt <= 430; dt++) t.push(voltage(c, lead, dt));
      assert.ok(Math.min(...t) < -.25, `${variant}/${lead} negative T`);
      if (variant === 'A') assert.ok(Math.max(...t) > .15, lead + ' initial positive T');
    }
    assert.ok(voltage(c, 'V3', 38) > voltage(c, 'V2', 38));
  }
});

test('AF has true irregular RR with no organized P even with artifact disabled', () => {
  const c = clean('atrial-fibrillation');
  assert.equal(c.prMs, null); assert.ok(c.fibrillatory);
  const rr = c.beatTimes.slice(1).map((q, i) => q - c.beatTimes[i]);
  assert.ok(Math.max(...rr) - Math.min(...rr) > 200);
  assert.ok(new Set(rr.map(n => n.toFixed(0))).size > 12);
  // Before the first QRS, remove only the explicit f-wave to check for a P component.
  for (let t = 230; t < 330; t++) {
    const f = .030 * (.65 * Math.sin(t * 2 * Math.PI / 151 + .7 * Math.sin(t / 419)) + .35 * Math.sin(t * 2 * Math.PI / 197 + .5));
    assert.ok(Math.abs(E.leadVoltageAt('II', t, c) - f) < .001, 'organized P component leaked into AF');
  }
  const noisy = E.createPatternCase('atrial-fibrillation');
  assert.deepEqual(Array.from(c.beatTimes), Array.from(noisy.beatTimes));
});

test('VT capture/fusion belong to the independent atrial train; CHB has no fixed PR', () => {
  const vt = clean('vt-vs-svt'), d = vt.dissociated;
  assert.equal(d.skipAtrialNear.length, 0);
  for (let i = 1; i < d.atrialTimes.length; i++) assert.equal(d.atrialTimes[i] - d.atrialTimes[i - 1], 800);
  for (const idx of [d.captureIdx, d.fusionIdx]) {
    const b = d.ventricularBeats[idx];
    assert.ok(d.atrialTimes.includes(b.atrialPeak), 'never insert unrelated P waves');
    assert.ok(Math.abs(b.qOn - b.atrialPeak - 120) <= 25, 'timed conducting P');
  }
  assert.ok(d.ventricularBeats[d.captureIdx].qrsMs < 100);
  assert.ok(d.ventricularBeats.every(b => b.qtMs < vt.baseRR));
  const chb = clean('complete-heart-block');
  assert.equal(chb.prMs, null);
  assert.ok(chb.dissociated.atrialTimes.length > chb.dissociated.ventricularBeats.length * 1.8);
});

test('every schematic tracing is connected and its SVG time coordinate never reverses', () => {
  for (const [id, entry] of Object.entries(ctx.window.ECG_SVG)) {
    if (entry.traceSpec || !entry.svg.includes('ecg-case-12lead')) continue;
    assert.match(entry.svg, /SCHEMATIC · NOT TO SCALE/);
    for (const [, d] of entry.svg.matchAll(/<path class="ecg-trace[^\"]*" d="([^\"]+)"/g)) {
      assert.equal((d.match(/M/g) || []).length, 1, id + ' connected path');
      let x = -Infinity;
      for (const [, cmd, params] of d.matchAll(/([MHLC])([^MHLC]+)/g)) {
        const v = params.trim().split(/[ ,]+/).map(Number);
        const xs = cmd === 'H' ? [v[0]] : (cmd === 'C' ? [v[0], v[2], v[4]] : [v[0]]);
        for (const nx of xs) { assert.ok(nx >= x, `${id} reversed from ${x} to ${nx}`); x = nx; }
      }
      assert.ok(x <= 674, id + ' stays inside tracing area');
    }
  }
});

test('unknown anatomical leads cannot silently become a V3 clone', () => {
  assert.throws(() => E.leadVoltageAt('V9-unsupported', 600, clean('normal-sinus')), /Unsupported ECG lead/);
});

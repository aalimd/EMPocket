'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({ window: { addEventListener() {} } });
for (const name of ['ecg-svg', 'ecg-engine', 'ecg-case-tracings', 'ecg-interactive', 'data', 'evidence']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets', name + '.js'), 'utf8'), context);
const W = context.window, cp = id => W.CP_DATA.find(x => x.id === id), ecg = id => W.ECG_DATA.patterns.find(x => x.id === id);
const text = value => JSON.stringify(value);

test('clinical safety corrections remain consistent across teaching summaries', () => {
  assert.match(ecg('wpw').action, /IV amiodarone/);
  assert.match(ecg('wpw').action, /ibutilide/);
  assert.match(text(cp('palpitations')), /IV amiodarone/);
  assert.doesNotMatch(text(ecg('pericarditis-ber')), /no anticoagulation if effusion/);
  assert.match(text(cp('hyperglycemia')), /β-hydroxybutyrate <0.6/);
  assert.doesNotMatch(text(cp('hyperglycemia')), /before the anion gap has closed|Close the gap|cortisol after steroids/);
  assert.match(text(cp('vaginal-bleeding')), /before 12 weeks/);
  assert.match(text(cp('diarrhea')), /vancomycin plus IV metronidazole/);
});

test('bounded viewer input fails explicitly instead of returning misleading or unbounded ECGs', () => {
  const spec = W.ECG_SVG.wellens.traceSpec;
  for (const options of [{duration: Infinity}, {duration: -1}, {duration: 10001}, {speed: 0}, {speed: 100}, {gain: NaN}, {lane: 'V9-unsupported'}]) {
    assert.throws(() => W.ECG_INTERACTIVE.render(spec, options), /Unsupported ECG/);
  }
});

test('schematics cannot be mistaken for box-calibrated paper', () => {
  const ids = ['avr-lmca', 'hypokalemia', 'hypothermia', 'brugada', 'pe-strain', 'pericarditis-ber', 'tca-toxicity', 'wpw', 'electrical-alternans'];
  for (const id of ids) {
    const figure = W.ECG_SVG[id];
    assert.match(figure.caption, /no box-counting/);
    assert.doesNotMatch(figure.svg, /<pattern/);
    assert.match(figure.svg, /ecg-label-b/);
    assert.ok(!figure.traceSpec && !figure.hasReference, id);
  }
});

test('comparison cards explain all conditions named in their headings', () => {
  for (const id of ['wpw', 'vt-vs-svt', 'complete-heart-block', 'pericarditis-ber']) assert.ok(ecg(id).comparison.length >= 2, id);
  assert.match(text(ecg('complete-heart-block').comparison), /2:1/);
  assert.match(text(ecg('pericarditis-ber').comparison), /Early repolarization/);
});

test('source IDs are resolvable and use explicit HTTPS links', () => {
  const ids = new Set([...W.CP_DATA.map(x => x.id), 'ecg']);
  for (const [id, keys] of Object.entries(W.CLINICAL_EVIDENCE.topics)) {
    assert.ok(ids.has(id), id);
    for (const key of keys) {
      const entry = W.CLINICAL_EVIDENCE.sources[key];
      assert.ok(entry && entry[0], key);
      const url = new URL(entry[1]);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.username, '');
    }
  }
});

test('WPW schematic contains a shorter PR than the ordinary schematic template', () => {
  // First beat: P begins at 77, delta begins at 84; ordinary P begins at 69,
  // Q begins at 83. The schematic deliberately claims no ms calibration.
  const svg = W.ECG_SVG.wpw.svg;
  assert.match(svg, /H77 C79,78 80,75 81,75 C82,75 83,78 84,78 C85,78/);
});

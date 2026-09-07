'use strict';
// Geometric regression tests for measured step diagrams; not clinical validation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ctx = { window: { addEventListener() {} } };
vm.createContext(ctx);
for (const file of ['ecg-svg', 'ecg-engine', 'ecg-case-tracings']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets', file + '.js'), 'utf8'), ctx);
}
const lib = ctx.window.ECG_SVG;
test('calibration retains 200 ms by 1 mV geometry and the 75/min RR', () => {
  assert.ok(lib['rate-calibration'].svg.includes('M64,110 H86 V30 H126 V110 H146'));
  assert.equal((126 - 86) / .2, 200);
  assert.equal((110 - 30) / 80, 1);
  assert.equal(60000 / ((379 - 219) / .2), 75);
});
test('QT annotation ends at the drawn T endpoint, with matching corrected interval', () => {
  const svg = lib.intervals.svg;
  assert.match(svg, /C223,99 226,100 228,100/);
  assert.match(svg, /data-wave="qt" x1="228" y1="100" x2="228" y2="128"/);
  const qt = (228 - 152) / .2;
  assert.equal(qt, 380);
  assert.equal(Math.round(qt / Math.sqrt(.8)), 425);
  assert.match(svg, /QT 380 ms · QTc ≈425/);
});
test('ischemia examples use the same eight-unit millimetre as the ECG paper', () => {
  const svg = lib['ischemia-map'].svg;
  const amplitudes = [[146,136,1], [320,295,2.5], [320,300,2], [320,305,1.5], [480,475,.5]];
  for (const [baseline, j, mm] of amplitudes) {
    assert.ok(svg.includes(`cy="${baseline + (j - baseline) * .8}"`));
    assert.equal(Math.abs((baseline - j) * .8) / 8, mm);
  }
  assert.doesNotMatch(svg, /confirms inferior occlusion|rules out pericarditis|completed MI|never trigger the cath lab/i);
});
test('all focus crops remain within their original SVG coordinate systems', () => {
  for (const [id, entry] of Object.entries(lib).filter(([, e]) => e.previewPanels)) {
    const [, vw, vh] = entry.svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
    for (const panel of entry.previewPanels) {
      const [x, y, w, h] = panel.viewBox.split(' ').map(Number);
      assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= vw && y + h <= vh, id + ': ' + panel.title);
    }
  }
});

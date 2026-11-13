'use strict';
/* Bedside calculators (shift-tools.js). These tests pin the arithmetic and the
   banding of each score, and the paediatric weight-based dose maths. They
   verify the implementation, not clinical validity. */
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const ctx = { window: {}, document: { readyState: 'complete', querySelector: () => null, addEventListener() {} }, setInterval: () => 1, clearInterval() {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/shift-tools.js'), 'utf8'), ctx);
const ST = ctx.window.SHIFT_TOOLS;
const ev = (id, state) => ST.evaluate(ST.scoreById(id), state);

test('every score declares inputs, a compute function and a caveat', () => {
    assert.ok(ST.scores.length >= 11, 'expected the audit-requested calculators');
    const ids = ST.scores.map(s => s.id);
    for (const want of ['heart', 'perc', 'wells-pe', 'qsofa', 'curb65', 'gcs', 'wells-dvt', 'canadian-ct-head', 'anion-gap', 'corrected-sodium', 'qtc']) {
        assert.ok(ids.includes(want), 'missing calculator: ' + want);
    }
    for (const s of ST.scores) {
        assert.ok(Array.isArray(s.inputs) && s.inputs.length, s.id + ' has no inputs');
        assert.equal(typeof s.compute, 'function', s.id + ' has no compute');
        assert.equal(typeof s.caveat, 'string', s.id + ' has no caveat');
    }
});

test('GCS sums components and reports severe at 8', () => {
    assert.match(ev('gcs', { eye: 4, verbal: 5, motor: 6 }).band, /GCS 15/);
    assert.match(ev('gcs', { eye: 2, verbal: 2, motor: 4 }).band, /GCS 8 .*severe/);
    assert.equal(ev('gcs', { eye: 3, verbal: 4, motor: 5 }).points, 12);
});

test('Wells DVT applies the −2 alternative-diagnosis weight', () => {
    const high = ev('wells-dvt', { ca: 1, swell: 1, calf: 1, tender: 1 });
    assert.match(high.band, /DVT likely/);
    assert.match(ev('wells-dvt', { ca: 1 }).band, /unlikely/);
    assert.match(ev('wells-dvt', { ca: 1, swell: 1 }).advice, /ultrasound first/);
    const cancelled = ev('wells-dvt', { swell: 1, alt: 1 });
    assert.ok(cancelled.points < 0, 'alternative diagnosis must reduce the score');
});

test('Canadian CT Head Rule requires eligibility and includes all seven findings', () => {
    assert.match(ev('canadian-ct-head', {}).band, /Confirm rule eligibility/);
    assert.match(ev('canadian-ct-head', { eligible: true }).band, /CT not indicated/);
    for (const key of ['gcs', 'open', 'basal', 'vomit', 'age65', 'amnesia', 'mechanism']) {
        assert.match(ev('canadian-ct-head', { eligible: true, [key]: true }).band, /CT indicated/, key);
    }
});

test('anion gap and delta ratio match the worked examples', () => {
    const r = ev('anion-gap', { na: 138, cl: 100, hco3: 12, k: 4 });
    assert.match(r.band, /AG 30/);
    assert.match(r.band, /delta 1\.33/);
    /* Without K⁺ the reference gap is lower, so a gap of 12 is normal. */
    assert.match(ev('anion-gap', { na: 140, cl: 104, hco3: 24 }).band, /normal gap/);
    assert.match(ev('anion-gap', { na: 140, cl: 104, hco3: 24 }).band, /without K⁺/);
});

test('corrected sodium uses 2.4 mmol/L per 100 mg/dL glucose', () => {
    const r = ev('corrected-sodium', { na: 128, glu: 400, bun: 14 });
    assert.match(r.band, /Corrected Na⁺ 135\.2/);
    assert.match(r.band, /effective 278\.2.*total 283\.2/);
    assert.doesNotMatch(ev('corrected-sodium', { na: 128, glu: 400 }).band, /total/);
    assert.equal(ev('corrected-sodium', { na: 140, glu: 60 }).points, 140);
});

test('QTc computes Bazett and Fridericia', () => {
    const r = ev('qtc', { qt: 420, rr: 800 });
    assert.match(r.band, /Bazett 470/);
    assert.match(r.band, /Fridericia 452/);
    assert.match(ev('qtc', { qt: 520, rr: 1000 }).band, /Bazett 520/);
});

test('PERC requires all eight criteria to be absent', () => {
    assert.match(ev('perc', {}).band, /Assess pretest probability/);
    assert.match(ev('perc', { lowPretest: true }).band, /PERC negative/);
    assert.match(ev('perc', { lowPretest: true, age: true }).band, /PERC positive/);
});

test('paediatric weight-based doses scale with weight and respect maxima', () => {
    const d = ST.pedsDoses(12);
    const byKey = Object.fromEntries(d.map(x => [x.key, x]));
    assert.ok(Math.abs(byKey['epi-arrest'].value - 0.12) < 1e-9);
    assert.ok(Math.abs(byKey['defib'].value - 24) < 1e-9);
    assert.ok(Math.abs(byKey['amio'].value - 60) < 1e-9);
    assert.ok(Math.abs(byKey['fluid'].value - 120) < 1e-9);
    /* Maxima must cap in a large child. */
    const big = Object.fromEntries(ST.pedsDoses(60).map(x => [x.key, x]));
    assert.equal(big['epi-arrest'].value, 0.6);          /* 60 kg × 0.01, under the 1 mg cap */
    assert.equal(big['epi-anaph'].value, 0.3);
    assert.equal(big['epi-anaph'].capped, true);
    assert.equal(byKey['d10'].value, 24);
    assert.equal(byKey['ceftriaxone'].value, 1200);
    const infantAtropine = ST.pedsDoses(3).find(row => row.key === 'atropine');
    assert.equal(infantAtropine.value, 0.1);
    assert.equal(infantAtropine.floored, true);
    const huge = Object.fromEntries(ST.pedsDoses(200).map(x => [x.key, x]));
    assert.equal(huge['epi-arrest'].value, 1);
    assert.equal(huge['epi-arrest'].capped, true);
    assert.equal(huge['atropine'].value, 0.5);
    /* Invalid weights return nothing rather than a misleading number. */
    assert.equal(ST.pedsDoses(0).length, 0);
    assert.equal(ST.pedsDoses(NaN).length, 0);
    assert.equal(ST.pedsDoses('').length, 0);
});

test('paediatric airway sizes follow the age formulas', () => {
    const air = Object.fromEntries(ST.pedsAirway(3).map(x => [x.label, x.value]));
    assert.ok(Math.abs(air['ETT (cuffed)'] - 3.75) < 1e-9);
    assert.ok(Math.abs(air['ETT (uncuffed)'] - 4.75) < 1e-9);
    assert.ok(Math.abs(air['ETT depth (children > 1 y)'] - 14.5) < 1e-9);
    assert.equal(ST.pedsAirway(-1).length, 0);
});

test('route badge classes follow the route text and never guess a vascular route', () => {
    assert.equal(ST.routeClass('IV/IO'), 'push');
    assert.equal(ST.routeClass('IV/IO rapid'), 'push');
    assert.equal(ST.routeClass('IM'), 'im');
    assert.equal(ST.routeClass('IV/IM'), 'push');
    assert.equal(ST.routeClass('unsynchronised'), 'infusion');
    assert.equal(ST.routeClass('synchronised'), 'infusion');
    assert.equal(ST.routeClass('PO/IV/IM'), 'push');
    assert.equal(ST.routeClass('PO'), 'pathway');
    assert.equal(ST.routeClass(''), 'pathway');
    assert.equal(ST.routeClass(null), 'pathway');
    /* Every pediatric row must resolve to a class the stylesheet ships, or the
       badge silently renders unstyled. */
    const shipped = ['push', 'im', 'infusion', 'pathway'];
    for (const d of ST.pedsDoses(12)) assert.ok(shipped.includes(ST.routeClass(d.route)), d.route);
});

test('a weight written in the filter is read as a weight, never as part of a score name', () => {
    /* Copy into a plain object: the values come from a separate VM context, so
       strict deep-equality would fail on the other realm's prototype. */
    const p = s => { const r = ST.parseWeightFilter(s); return r ? { weight: r.weight, text: r.text } : null; };
    /* Unit attached, unit separate, Arabic unit, comma decimal. */
    assert.deepEqual(p('12kg'), { weight: 12, text: '' });
    assert.deepEqual(p('12 kg'), { weight: 12, text: '' });
    assert.deepEqual(p('12 كجم'), { weight: 12, text: '' });
    assert.deepEqual(p('0,9kg'), { weight: 0.9, text: '' });
    assert.deepEqual(p('12kgs'), { weight: 12, text: '' });
    /* Surrounding words stay as the text filter; the weight is taken out. */
    assert.deepEqual(p('peds 12 kg'), { weight: 12, text: 'peds' });
    assert.deepEqual(p('12 kg airway'), { weight: 12, text: 'airway' });
    /* A bare number counts only when it is the whole filter. */
    assert.deepEqual(p('12'), { weight: 12, text: '' });
    assert.deepEqual(p(' 12 '), { weight: 12, text: '' });
    /* Digits inside a score name are text, not a patient weight. */
    assert.equal(p('curb 65'), null);
    assert.equal(p('gcs 15'), null);
    assert.equal(p('wells 2'), null);
    /* Implausible or malformed values are left as text rather than dosing it. */
    assert.equal(p('0kg'), null);
    assert.equal(p('0'), null);
    assert.equal(p('-3 kg'), null);
    assert.equal(p('500 kg'), null);
    assert.equal(p('12k'), null);
    assert.equal(p(''), null);
    assert.equal(p(null), null);
});

test('calculator facets name explicit score ids so a rename cannot empty a chip', () => {
    const ids = new Set(ST.scores.map(s => s.id));
    assert.ok(ST.calcFacets.length >= 5, 'expected the bedside quick facets');
    assert.equal(ST.calcFacets[0].key, 'all');
    for (const f of ST.calcFacets) {
        assert.ok(typeof f.label === 'string' && f.label.length, f.key + ' has no label');
        for (const id of f.ids) assert.ok(ids.has(id), f.key + ' names an unknown score: ' + id);
    }
    /* Every score stays reachable from a facet, so no chip combination can hide
       a calculator with no other way to find it. */
    const covered = new Set(ST.calcFacets.flatMap(f => f.ids));
    for (const id of ids) assert.ok(covered.has(id), id + ' is in no facet');
});

test('arrest timer formats a clock and rolls at each 2-minute cycle', () => {
    const clock = ST.timer.formatClock, phase = ST.timer.phase;
    assert.equal(ST.timer.cycleMs, 120000);
    assert.equal(clock(0), '0:00');
    assert.equal(clock(9000), '0:09');
    assert.equal(clock(59000), '0:59');
    assert.equal(clock(60000), '1:00');
    assert.equal(clock(120000), '2:00');
    /* A negative or unparseable value reads 0:00 rather than NaN. */
    assert.equal(clock(-5000), '0:00');
    assert.equal(clock(NaN), '0:00');
    /* Cycle 1 covers [0, 2 min); cycle 2 starts exactly on the boundary. */
    assert.equal(phase(0).cycle, 1);
    assert.equal(phase(119999).cycle, 1);
    assert.equal(phase(119999).remainingMs, 1);
    assert.equal(phase(120000).cycle, 2);
    assert.equal(phase(120000).inCycleMs, 0);
    assert.equal(phase(120000).remainingMs, 120000);
    assert.equal(phase(120000).completed, 1);
    assert.equal(phase(125000).cycle, 2);
    assert.equal(phase(125000).remainingMs, 115000);
    /* Consecutive cycles keep counting rather than wrapping. */
    const later = phase(5 * 120000 + 30000);
    assert.equal(later.cycle, 6);
    assert.equal(later.inCycleMs, 30000);
    assert.equal(later.percent, 25);
    assert.equal(phase(600000).percent, 0);
});

test('arrest timer accrues real time, pauses without drift and resets to cycle 1', () => {
    /* Freeze Date.now() inside the sandbox so the controller is exercised with
       deterministic time; the module reads the clock, it never accumulates. */
    const clock = vm.runInContext('(function(){var t=0,real=Date.now;Date.now=function(){return t;};return {at:function(v){t=v;},restore:function(){Date.now=real;}};})()', ctx);
    try {
        assert.equal(ST.timer.snapshot().running, false);
        assert.equal(ST.timer.snapshot().elapsed, '0:00');
        assert.equal(ST.timer.snapshot().cycle, 1);
        ST.timer.start();
        assert.equal(ST.timer.snapshot().running, true);
        clock.at(125000);
        assert.equal(ST.timer.snapshot().elapsed, '2:05');
        assert.equal(ST.timer.snapshot().cycle, 2);
        assert.equal(ST.timer.snapshot().remaining, '1:55');
        ST.timer.pause();
        clock.at(200000);
        assert.equal(ST.timer.snapshot().running, false);
        assert.equal(ST.timer.snapshot().elapsed, '2:05', 'paused time must not accrue');
        /* Resume continues from where it stopped instead of restarting. */
        ST.timer.start();
        clock.at(205000);
        assert.equal(ST.timer.snapshot().elapsed, '2:10');
        ST.timer.reset();
        assert.equal(ST.timer.snapshot().elapsed, '0:00');
        assert.equal(ST.timer.snapshot().running, false);
        assert.equal(ST.timer.snapshot().cycle, 1);
        /* Toggling is a start then a pause, never a third state. */
        ST.timer.toggle();
        assert.equal(ST.timer.snapshot().running, true);
        ST.timer.toggle();
        assert.equal(ST.timer.snapshot().running, false);
    } finally {
        clock.restore();
        ST.timer.reset();
    }
});

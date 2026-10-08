const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const {css,loader}=require('./helpers/styles');
const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const explorerJs = fs.readFileSync(path.join(root, 'assets/ecg-explorer.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8');


test('navigating from a tab closes the drawer and the ECG overlay', () => {
    assert.match(appJs, /const navKey = btn\.getAttribute\('data-nav'\);[\s\S]{0,600}?closeSidebar\(\);/,
        'every tab tap must close the sidebar drawer');
    assert.match(appJs, /const navKey = btn\.getAttribute\('data-nav'\);[\s\S]{0,600}?closeEcgLightbox\(\);/,
        'every tab tap must close the ECG lightbox/workbench');
});

test('the ECG tab reports missing data instead of silently doing nothing', () => {
    assert.match(appJs, /navKey === 'ecg' && !getEcg\(\)\) \{[^}]*toast\(/,
        'tapping ECG without data must surface a message rather than a no-op');
});

test('every ECG step id resolves to a distinct vector icon', () => {
    const stepsBlock = dataJs.match(/steps: \[([\s\S]*?)\n {4}\],/);
    assert.ok(stepsBlock, 'data.js must declare the ECG steps array');
    const stepIds = [...stepsBlock[1].matchAll(/^\s*id: '([a-z-]+)',$/gm)].map(m => m[1]);
    const sevenSteps = ['rate-calibration', 'rhythm-axis', 'intervals', 'hypertrophy', 'ischemia-map', 'omi-equivalents', 'toxic-metabolic-mimics'];
    for (const id of sevenSteps) assert.ok(stepIds.includes(id), `data.js must still define step ${id}`);

    const iconBlock = appJs.match(/const SEMANTIC_ICONS = \{([\s\S]*?)\n {4}\};/);
    assert.ok(iconBlock, 'SEMANTIC_ICONS must exist');
    const icons = new Map([...iconBlock[1].matchAll(/'([a-z-]+)':\s*'([^']*)'/g)].map(m => [m[1], m[2]]));
    for (const id of sevenSteps) {
        assert.ok(icons.has(id), `ECG step "${id}" must have an icon entry, otherwise it renders the generic fallback`);
    }
    const distinct = new Set(sevenSteps.map(id => icons.get(id)));
    assert.equal(distinct.size, sevenSteps.length, 'each ECG step should have its own icon');
});

test('the unreachable SVG icon maps are gone', () => {
    assert.doesNotMatch(appJs, /SECTION_ICONS\b/, 'SECTION_ICONS was dead code and must be removed');
    assert.doesNotMatch(appJs, /ECG_STEP_ICONS\b/, 'ECG_STEP_ICONS was dead code and must be removed');
});

test('the rail observer re-attaches after a filtered re-render', () => {
    const body = appJs.slice(appJs.indexOf('function renderPresentation('), appJs.indexOf('function jumpToSection('));
    assert.ok(body.length, 'renderPresentation must exist');
    assert.doesNotMatch(body, /if \(!preservePosition\)\s*\{\s*observeRail\(\)/,
        'the rail is rebuilt on every render, so observeRail must not be skipped for preservePosition');
    assert.match(body, /observeRail\(\);/, 'renderPresentation must re-attach the rail observer');
});

test('a failed clipboard write never claims the handover was copied', () => {
    assert.doesNotMatch(appJs, /toast\('Handover ready\.'\)/,
        '"Handover ready." implies success even when the copy failed');
    assert.match(appJs, /function copyHandoverSummary\(/, 'copy must go through one shared helper');
    assert.match(appJs, /legacyCopyText\(text\)/, 'an insecure origin needs the legacy copy fallback');
    assert.match(appJs, /manualCopyField\(text\)/, 'total clipboard failure must offer a selectable field');
    assert.match(appJs, /id="handoverFallback"/, 'the manual copy field needs a host element in the shift view');
});

test('the breadcrumb trail ends in a real page name', () => {
    assert.match(appJs, /crumb-sep" aria-hidden="true">›<\/span><span class="crumb-current" aria-current="page">/,
        'a trailing separator with no current page is a dangling breadcrumb');
});

/* The category set is defined only in assets/ecg-curriculum.js: the third argument
   of add() and the third field of each panels[] row. Both are parsed textually. */
function curriculumCategories() {
    const src = fs.readFileSync(path.join(root, 'assets/ecg-curriculum.js'), 'utf8');
    const found = new Set();
    for (const m of src.matchAll(/add\('[a-z0-9-]+','(?:[^'\\]|\\.)*','((?:[^'\\]|\\.)*)'/g)) found.add(m[1]);
    const panels = src.match(/const panels=\[([\s\S]*?)\n \];/);
    assert.ok(panels, 'ecg-curriculum.js must declare a panels array');
    for (const m of panels[1].matchAll(/\['[a-z0-9-]+','(?:[^'\\]|\\.)*','([^']*)'/g)) found.add(m[1]);
    return found;
}

test('ECG Explorer groups its cases by curriculum category, labelled in prose', () => {
    /* The explorer used to prefix each optgroup with an emoji. An optgroup label
       is a text string by spec, so that glyph was decoration rather than an icon
       system: it had no stroke weight, no optical size and no selected state.
       The category name now has to identify the group on its own. */
    const curriculumCategories = () => {
        const found = new Set();
        const src = fs.readFileSync(path.join(root, 'assets/ecg-curriculum.js'), 'utf8');
        for (const m of src.matchAll(/add\('[a-z0-9-]+','(?:[^'\\]|\\.)*','((?:[^'\\]|\\.)*)'/g)) found.add(m[1]);
        const panels = src.match(/const panels=\[([\s\S]*?)\n \];/);
        assert.ok(panels, 'ecg-curriculum.js must declare a panels array');
        for (const m of panels[1].matchAll(/\['[a-z0-9-]+','(?:[^'\\]|\\.)*','([^']*)'/g)) found.add(m[1]);
        return found;
    };
    const used = curriculumCategories();
    assert.ok(used.size >= 5, `expected the curriculum category set to be discovered, got ${[...used]}`);
    assert.doesNotMatch(explorerJs, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
        'the explorer must not reintroduce pictographs into its labels');
    assert.match(explorerJs, /catLabel\(category\)/,
        'the explorer still groups its case select by category');
    assert.match(explorerJs, /<optgroup label=/,
        'the explorer case select still renders category groups');
});

test('step rail chips use short labels so steps are actually reachable', () => {
    const map = appJs.match(/const ECG_STEP_SHORT = \{([\s\S]*?)\n {4}\};/);
    assert.ok(map, 'ECG_STEP_SHORT must exist');
    const entries = [...map[1].matchAll(/'([a-z-]+)':\s*'([^']+)'/g)].map(m => [m[1], m[2]]);
    const stepBlock = dataJs.match(/steps: \[([\s\S]*?)\n {4}\],/);
    const ids = [...stepBlock[1].matchAll(/^\s*id: '([a-z-]+)',$/gm)].map(m => m[1]).slice(0, 7);
    assert.equal(ids.length, 7, 'the ECG guide must still define seven steps');
    for (const id of ids) {
        const hit = entries.find(([k]) => k === id);
        assert.ok(hit, `step "${id}" needs a short rail label`);
        assert.ok(hit[1].length <= 16, `short label for "${id}" should stay compact, got "${hit[1]}"`);
    }
    /* The full names were ~1938px wide, hiding 5 of 7 steps. */
    const total = entries.reduce((n, [, label]) => n + label.length, 0);
    assert.ok(total < 120, `short labels total ${total} chars; the full names were far wider`);
});

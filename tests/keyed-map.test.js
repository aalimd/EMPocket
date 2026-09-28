'use strict';
/* Keys that must stay in step with the data they decorate.
   A lookup map keyed on a hand-written string can drift from the ids in
   data.js and fail silently: the five-of-seven ECG steps rendering the generic
   clipboard emoji shipped exactly that way, because SECTION_EMOJIS used
   `rhythm`, `axis`, `ischemia-territories` and `tox-lytes` while the real step
   ids were `rhythm-axis`, `intervals`, `ischemia-map` and
   `toxic-metabolic-mimics`. A missing key looks like a working fallback, so
   only a test comparing the two sets catches it. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8');
const curriculum = fs.readFileSync(path.join(root, 'assets/ecg-curriculum.js'), 'utf8');
const explorer = fs.readFileSync(path.join(root, 'assets/ecg-explorer.js'), 'utf8');

/* Keys are not always kebab-case: group titles and explorer categories are prose
   ('Intervals and ectopy'), so the key pattern has to allow spaces and &. */
const mapEntries = (source, name) => {
    const block = source.match(new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\{([\\s\\S]*?)\\n\\s*\\};'));
    assert.ok(block, name + ' must be an object literal so this test can read it');
    return [...block[1].matchAll(/'([^']+)'\s*:\s*'([^']*)'/g)].map(m => [m[1], m[2]]);
};

const ecgStepIds = () => {
    const block = data.match(/steps: \[([\s\S]*?)\n {4}\],/);
    assert.ok(block, 'data.js must declare the ECG steps array');
    return [...block[1].matchAll(/^\s*id: '([a-z-]+)',$/gm)].map(m => m[1]).slice(0, 7);
};

const curriculumCategories = () => {
    const found = new Set();
    for (const m of curriculum.matchAll(/add\('[a-z0-9-]+','(?:[^'\\]|\\.)*','((?:[^'\\]|\\.)*)'/g)) found.add(m[1]);
    const panels = curriculum.match(/const panels=\[([\s\S]*?)\n \];/);
    assert.ok(panels, 'ecg-curriculum.js must declare a panels array');
    for (const m of panels[1].matchAll(/\['[a-z0-9-]+','(?:[^'\\]|\\.)*','([^']*)'/g)) found.add(m[1]);
    return found;
};

test('every ECG step id has an entry in the emoji map', () => {
    const ids = ecgStepIds();
    assert.equal(ids.length, 7, 'the ECG guide must still define seven steps');
    const mapped = new Map(mapEntries(app, 'ECG_STEP_EMOJIS'));
    for (const id of ids) {
        assert.ok(mapped.has(id),
            'step "' + id + '" has no emoji entry, so it would fall back to the generic clipboard emoji');
    }
    const values = new Set(ids.map(id => mapped.get(id)));
    assert.equal(values.size, ids.length, 'each step should have its own emoji');
});

test('the step rail labels and emoji maps cover the same ids', () => {
    const ids = ecgStepIds();
    for (const name of ['ECG_STEP_SHORT']) {
        const keys = new Set(mapEntries(app, name).map(([k]) => k));
        for (const id of ids) assert.ok(keys.has(id), name + ' is missing step "' + id + '"');
    }
});

test('the prefixed section emoji keys exist for every step', () => {
    const ids = ecgStepIds();
    const sections = new Set(mapEntries(app, 'SECTION_EMOJIS').map(([k]) => k));
    for (const id of ids) {
        assert.ok(sections.has('ecg-step-' + id),
            'the section badge key ecg-step-' + id + ' is missing from SECTION_EMOJIS');
    }
});

test('no emoji map key refers to a step id that no longer exists', () => {
    const ids = new Set(ecgStepIds());
    for (const [name, source] of [['ECG_STEP_EMOJIS', app], ['ECG_STEP_SHORT', app]]) {
        for (const [key] of mapEntries(source, name)) {
            assert.ok(ids.has(key),
                name + ' still has the key "' + key + '", which matches no step id in data.js');
        }
    }
});

test('every curriculum category has an explorer emoji', () => {
    const mapped = new Set(mapEntries(explorer, 'EXPLORER_CAT_EMOJIS').map(([k]) => k));
    for (const cat of curriculumCategories()) {
        assert.ok(mapped.has(cat), 'explorer category "' + cat + '" has no emoji');
    }
});

test('every presentation group title has an emoji', () => {
    const groupTitles = [...app.matchAll(/\{ title: '([^']+)', ids:/g)].map(m => m[1]);
    assert.ok(groupTitles.length >= 5, 'expected to find the GROUPS titles');
    const mapped = new Set(mapEntries(app, 'GROUP_EMOJIS').map(([k]) => k));
    for (const title of groupTitles) {
        assert.ok(mapped.has(title), 'group "' + title + '" has no emoji');
    }
});

test('RELATED only points at topics that exist', () => {
    const ids = new Set([...data.matchAll(/id: '([a-z0-9-]+)'/g)].map(m => m[1]));
    const related = app.match(/const RELATED = \{([\s\S]*?)\n {4}\};/);
    assert.ok(related, 'RELATED map must exist');
    const dangling = [];
    for (const m of related[1].matchAll(/'([a-z0-9-]+)':\s*\[([^\]]*)\]/g)) {
        for (const t of m[2].matchAll(/'([a-z0-9-]+)'/g)) {
            if (!ids.has(t[1])) dangling.push(m[1] + ' -> ' + t[1]);
        }
    }
    assert.deepEqual(dangling, [], 'RELATED points at topics that do not exist');
});

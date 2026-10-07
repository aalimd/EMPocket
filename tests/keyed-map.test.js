'use strict';
/* Keys that must stay in step with the data they decorate.
   A lookup map keyed on a hand-written string can drift from the ids in
   data.js and fail silently: the five-of-seven ECG steps rendering the generic
   clipboard emoji shipped exactly that way, because the badge map used
   `rhythm`, `axis`, `ischemia-territories` and `tox-lytes` while the real step
   ids were `rhythm-axis`, `intervals`, `ischemia-map` and
   `toxic-metabolic-mimics`. A missing key looks like a working fallback, so
   only a test comparing the two sets catches it.

   The badges are drawn from SEMANTIC_ICONS (one vector per meaning), so that
   registry is what these tests hold in step with the data. Emoji maps were
   removed: they were dead weight behind the SVG badges, and the one place they
   still reached the screen — an <optgroup> label in the ECG Explorer — is
   text-only by spec, so the emoji was decoration with no semantic payload. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8');
const curriculum = fs.readFileSync(path.join(root, 'assets/ecg-curriculum.js'), 'utf8');

/* Keys are not always kebab-case: group titles and explorer categories are prose
   ('Intervals and ectopy'), so the key pattern has to allow spaces and &. */
const mapEntries = (source, name) => {
    const block = source.match(new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\{([\\s\\S]*?)\\n\\s*\\};'));
    assert.ok(block, name + ' must be an object literal so this test can read it');
    return [...block[1].matchAll(/'([^']+)'\s*:\s*'([^']*)'/g)].map(m => [m[1], m[2]]);
};

const iconKeys = () => new Set(mapEntries(app, 'SEMANTIC_ICONS').map(([k]) => k));

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

test('every ECG step id resolves to its own vector icon, not a shared fallback', () => {
    /* getSectionSvg() strips the `ecg-step-` prefix and looks the bare step id
       up in SEMANTIC_ICONS. A missing key silently renders the `history`
       fallback, so seven steps would share one badge. */
    const ids = ecgStepIds();
    assert.equal(ids.length, 7, 'the ECG guide must still define seven steps');
    const icons = mapEntries(app, 'SEMANTIC_ICONS');
    const lookup = new Map(icons);
    const historyIcon = lookup.get('history');
    assert.ok(historyIcon, 'SEMANTIC_ICONS must keep the history fallback');
    for (const id of ids) {
        assert.ok(lookup.has(id), 'step "' + id + '" has no icon entry, so it renders the generic section badge');
        assert.notEqual(lookup.get(id), historyIcon, 'step "' + id + '" reuses the history fallback');
    }
    assert.equal(new Set(ids.map(id => lookup.get(id))).size, ids.length, 'each step needs a distinct icon');
});

test('the step rail labels cover exactly the same ids as the icons', () => {
    const ids = ecgStepIds();
    const keys = new Set(mapEntries(app, 'ECG_STEP_SHORT').map(([k]) => k));
    for (const id of ids) assert.ok(keys.has(id), 'ECG_STEP_SHORT is missing step "' + id + '"');
    for (const key of keys) assert.ok(ids.includes(key), 'ECG_STEP_SHORT has "' + key + '", which matches no step id in data.js');
});

/* sectionCard(icon, title, bodyHtml, closed, key) — the key is the last
   top-level string literal of the call. Scraping it with one regex across
   nested arguments picked up SVG classes, so read the argument list instead. */
const sectionKeys = () => {
    const keys = new Set();
    for (const call of app.matchAll(/sectionCard\(/g)) {
        let depth = 1;
        let i = call.index + call[0].length;
        const start = i;
        for (; i < app.length && depth; i++) {
            if (app[i] === '(') depth++;
            else if (app[i] === ')') depth--;
        }
        const args = app.slice(start, i - 1);
        const literals = args.match(/'([a-z][a-z-]*)'\s*$/);
        if (literals) keys.add(literals[1]);
    }
    return keys;
};

test('every presentation section key resolves to its own vector icon', () => {
    /* The section cards are keyed on clinical framework names and getSectionSvg
       reads those same keys out of SEMANTIC_ICONS. A missing key silently renders
       the `history` fallback, so two sections end up badged with a clipboard —
       one icon meaning two things. The ECG guide reuses the framework names and
       its `ecg-` prefixed keys shipped without entries until this test caught it. */
    const keys = sectionKeys();
    assert.ok(keys.size >= 12, 'expected to find the presentation section keys, saw ' + keys.size);
    const icons = iconKeys();
    for (const key of keys) {
        assert.ok(icons.has(key), 'section "' + key + '" has no icon entry in SEMANTIC_ICONS');
    }
});

test('every clinical category used by a topic has its own icon', () => {
    const cats = new Set([...app.matchAll(/':\s*'([a-z-]+)'/g)].map(m => m[1]));
    const icons = iconKeys();
    /* The category names TOPIC_CATS maps onto must all be drawable, otherwise a
       topic falls back to the generic document glyph. */
    for (const cat of ['cardio', 'pulm', 'critical', 'vascular', 'neuro', 'gi', 'gu', 'msk', 'airway',
        'ent', 'derm', 'peds', 'toxic', 'psych', 'endocrine', 'environ', 'trauma', 'obgyn', 'infect', 'ecg']) {
        assert.ok(icons.has(cat), 'clinical category "' + cat + '" has no icon entry');
    }
});

test('ECG explorer categories are plain prose labels, not decorated', () => {
    /* The explorer grouped its case select with an emoji prefix. An <optgroup>
       label is a text string by spec, so an icon could never render there and the
       glyph was decoration carrying no meaning. The category name alone must be
       enough to identify the group. */
    const explorer = fs.readFileSync(path.join(root, 'assets/ecg-explorer.js'), 'utf8');
    assert.doesNotMatch(explorer, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
        'the explorer must not reintroduce pictographs into its labels');
    const options = explorer.match(/<optgroup label="([^"]*)"/g) || [];
    assert.ok(options.length, 'the explorer still groups its case select by category');
    for (const opt of options) {
        const label = opt.replace(/<optgroup label="|"$/g, '');
        assert.match(label, /[A-Za-z]{3}/, 'category label should read as prose: ' + label);
    }
    assert.ok(curriculumCategories().size >= 5, 'expected a curriculum category set');
});

test('no emoji is used as a UI icon anywhere in the runtime', () => {
    /* One meaning -> one vector. Emoji cannot carry stroke weight, optical size
       or a selected state, so any that reach the interface break the icon
       language. Emoji still allowed inside educational prose. */
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
    const runtime = ['app.js', 'ecg-explorer.js', 'em-learning.js', 'student-learning.js', 'ecg-interactive.js', 'evidence.js'];
    for (const name of runtime) {
        const src = fs.readFileSync(path.join(root, 'assets', name), 'utf8');
        for (const [i, line] of src.split('\n').entries()) {
            assert.doesNotMatch(line, emoji,
                'assets/' + name + ':' + (i + 1) + ' uses an emoji where a vector icon belongs: ' + line.trim().slice(0, 60));
        }
    }
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.doesNotMatch(html, emoji, 'index.html must not ship emoji as UI icons');
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
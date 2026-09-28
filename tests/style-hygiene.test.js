'use strict';
/* Housekeeping guard. The stylesheet is append-only, so unused rules used to
   accumulate silently: a redesign replaced the markup and left the old
   selectors behind with no way to notice. This asserts the set stays small and
   that the layers this project depends on are still present. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'assets/app.css'), 'utf8');

function walk(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!/node_modules|\.git|\.wrangler|\.backup/.test(entry.name)) walk(p, out);
        } else if (/\.(js|html|css)$/.test(entry.name)) out.push(p);
    }
    return out;
}

/* Classes that app.css itself defines must not count as "used", otherwise the
   dead set is always empty. */
function usedClasses() {
    const used = new Set();
    for (const file of walk(root, [])) {
        const text = fs.readFileSync(file, 'utf8');
        const isTarget = path.relative(root, file).split(path.sep).join('/') === 'assets/app.css';
        for (const m of text.matchAll(/class=\\?["']([^"'`]+)/g)) m[1].split(/\s+/).forEach(c => c && used.add(c));
        for (const m of text.matchAll(/class(?:Name)?\s*[:=]\s*`?["']([^"'`]+)/g)) m[1].split(/\s+/).forEach(c => c && used.add(c));
        for (const m of text.matchAll(/classList\.[a-z]+\((['"])([^'"]+)\1/g)) used.add(m[2]);
        for (const m of text.matchAll(/querySelector(?:All)?\([`'.](?:\.)?([a-zA-Z][\w-]*)/g)) used.add(m[1]);
        if (!isTarget) for (const m of text.matchAll(/\.([a-zA-Z][\w-]*)/g)) used.add(m[1]);
    }
    return used;
}

/* url(...) targets and XML namespaces produce phantom "classes". */
function urlFragments() {
    const set = new Set();
    for (const m of css.matchAll(/url\([^)]*\)/g)) for (const t of m[0].matchAll(/\.([a-zA-Z][\w-]*)/g)) set.add(t[1]);
    for (const m of css.matchAll(/xmlns[^=]*=["']([^"']+)/g)) for (const t of m[1].matchAll(/\.([a-zA-Z][\w-]*)/g)) set.add(t[1]);
    return set;
}

test('unused classes do not accumulate in the stylesheet', () => {
    const used = usedClasses();
    const fragments = urlFragments();
    const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
    const unused = [...defined].filter(c => !used.has(c) && !fragments.has(c));
    /* Baseline, not a target. 35 single-class rules were deleted as part of the
       cleanup, but these classes survive because they only appear inside compound
       selectors (`.ecg-pearls-pitfalls h4` and friends) or are built by string
       concatenation, which a text scan cannot follow. Removing those needs a
       per-selector review, so the number is held here to stop it growing again
       while that backlog is worked through. */
    const BASELINE = 55;
    assert.ok(unused.length <= BASELINE,
        'unused classes grew to ' + unused.length + ', above the ' + BASELINE +
        ' baseline: ' + unused.join(' '));
});

test('the stylesheet documents its own layer order and z-index scale', () => {
    assert.match(css, /EM-CPs stylesheet — read this first/,
        'the append-only cascade needs a header index, otherwise no one can tell which rule wins');
    assert.match(css, /z-index scale/,
        'the z-index scale is documented so new layers stop inventing values');
    for (const layer of ['v5', 'v5.1', 'v6', 'iOS27']) {
        assert.ok(css.includes(layer), 'the layer index should mention ' + layer);
    }
    assert.match(css, /z-index:\s*100 !important/,
        'the tab bar must stay documented at 100, between the topbar (90) and the drawer (110)');
});

test('the selector the runtime actually uses is the one that is styled', () => {
    /* student-learning.js moves .context-filters out of the topbar into the
       library heading, so any `.topbar .context-filters` rule is dead on arrival. */
    assert.doesNotMatch(css, /\.topbar \.context-filters/,
        'the filter is relocated at runtime, so a .topbar-scoped rule can never match it');
    assert.match(css, /\.context-filters \.chips \{[^}]*max-width:/,
        'the severity panel needs its own ceiling; the phone guard clamps every .chips to 100%');
});

test('the stylesheet parses as balanced CSS', () => {
    let depth = 0;
    for (const ch of css) {
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        assert.ok(depth >= 0, 'a closing brace appeared before its opening brace');
    }
    assert.equal(depth, 0, 'unbalanced braces: ' + depth + ' block(s) still open');
});

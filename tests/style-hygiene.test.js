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
const {css,loader,modules}=require('./helpers/styles');

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
        const isTarget = path.extname(file) === '.css';
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

test('the stylesheet has explicit modules, one drawing layer and a bounded size', () => {
    assert.match(loader,/z-index scale/);
    assert.equal(modules.length,8);
    assert.equal(new Set(modules).size,8);
    assert.match(css,/@layer scientific/);
    assert.ok(css.length<100000,'Modular CSS must not grow back into the 433 KB patch cascade');
    assert.doesNotMatch(css,/!important[^{}]*\{/);
});

test('relocated severity controls have a viewport-bounded popup', () => {
    assert.match(css,/\.context-filters \.chips\{[^}]*max-width:/);
    assert.match(css,/\.context-filters>summary\{[^}]*min-height:/);
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

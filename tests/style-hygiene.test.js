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

/* The component contract fixes dimensions per component. These assert the
   shipped values rather than a property existing, because a redesign that
   silently re-tightens a search field or an answer option is the failure mode. */
test('contract component dimensions ship as explicit values', () => {
    assert.match(css,/\.searchwrap input\{[^}]*height:48px/);
    assert.match(css,/\.context-filters>summary\{[^}]*min-height:52px/);
    assert.match(css,/\.library-filters>summary\{[^}]*min-height:52px/);
    assert.match(css,/\.quiz-option\{[^}]*min-height:56px/);
    assert.match(css,/\.quiz-option\{[^}]*gap:1[0-9]px/);
    assert.match(css,/\.stepper-track\{[^}]*height:6px/);
    assert.match(css,/\.cp-name\{[^}]*font-size:1\.0625em/);
    assert.match(css,/\.cp-desc\{[^}]*font-size:\.875em/);
    assert.match(css,/\.toast\{[^}]*max-width:min\(90vw,\d{3}px\)/);
    assert.match(css,/\.design-card,\.settings-section,[^{]*\{padding:1[0-9]px/);
    /* Phone rhythm: the 320-359 tier keeps a 12px margin while wider phones use 16px.
       Media queries nest braces, so each query body is sliced out before matching.
       One query string may appear in several modules, so every occurrence counts. */
    const mediaBodies = (query) => {
        const bodies = [];
        let from = 0;
        for (;;) {
            const start = css.indexOf(query, from);
            if (start < 0) break;
            let depth = 1, i = start + query.length;
            for (; i < css.length; i++) {
                if (css[i] === '{') depth++;
                else if (css[i] === '}') { depth--; if (!depth) break; }
            }
            bodies.push(css.slice(start + query.length, i));
            from = i + 1;
        }
        assert.ok(bodies.length, 'missing media query ' + query);
        return bodies;
    };
    const anyMedia = (query, pattern) => assert.ok(mediaBodies(query).some(body => pattern.test(body)), 'no ' + query + ' body matches ' + pattern);
    anyMedia('@media(max-width:359px){', /\.stage\{[^}]*padding-inline:12px/);
    anyMedia('@media(max-width:920px){', /\.stage\{[^}]*padding:24px 16px/);
    anyMedia('@media(max-width:600px){', /\.design-card,\.settings-section,[^{]*\{padding:1[0-9]px/);
});

test('primary buttons read their hover and active fills from tested tokens', () => {
    assert.match(css,/\.design-action\.primary:hover[^}]*var\(--primary-hover\)/);
    assert.match(css,/\.design-action\.primary:active[^}]*var\(--primary-active\)/);
    /* No hover is expressed by dimming the whole button: opacity would hide the
       label too, which the accessibility contract forbids. */
    assert.doesNotMatch(css,/\.design-action\.primary:hover\{[^}]*opacity/);
});

/* Contrast of the primary button is derived from tokens, so it cannot be seen
   by a style-audit screenshot: a wrong hex in accent dark mode reads fine in the
   cascade and fails on a device. Computed here from the shipped tokens. */
function channel(value) {
    const hex = value.trim().replace('#', '');
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(channels) {
    const [r, g, b] = channels.map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
    const l1 = luminance(channel(a)), l2 = luminance(channel(b));
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test('primary accent, hover and active fills keep 4.5:1 in every theme and accent', () => {
    const tokens = fs.readFileSync(path.join(root, 'assets/css/tokens.css'), 'utf8');
    const rules = [...tokens.matchAll(/(^|\n)(html(?:\[[a-z-]+=[a-z]+\])*|\:root)\{([^}]*)\}/g)];
    assert.ok(rules.length > 5, 'token rules were not parsed');
    /* Light accent blocks inherit --on-fill (white) from :root; dark ones define it. */
    const read = (block, isDark) => {
        const get = name => { const m = block.match(new RegExp('--' + name + ':\\s*([^;]+)')); return m ? m[1].trim() : null; };
        return { accent: get('accent'), hover: get('primary-hover'), active: get('primary-active'), onFill: get('on-fill') || (isDark ? null : '#fff') };
    };
    let checked = 0;
    for (const [, , selector, block] of rules) {
        const isDark = /data-theme=dark/.test(selector);
        const t = read(block, isDark);
        if (!t.accent || !t.onFill || !t.hover || !t.active) continue;
        for (const [state, value] of [['accent', t.accent], ['hover', t.hover], ['active', t.active]]) {
            const ratio = contrast(value, t.onFill);
            assert.ok(ratio >= 4.5, state + ' fill ' + value + ' on ' + t.onFill + ' in [' + selector + '] is ' + ratio.toFixed(2) + ':1');
            checked++;
        }
    }
    /* light root, five light accents, dark root, five dark accents. */
    assert.equal(checked, 36, 'expected 12 accent/theme combinations to be checked');
});


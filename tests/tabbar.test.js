const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/app.css'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const explorerJs = fs.readFileSync(path.join(root, 'assets/ecg-explorer.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8');

/* All z-index values declared for a class, across every rule that targets it.
   The trailing (?![\w-]) matters: \b alone would also match .ecg-lightbox-head. */
function zIndexAnywhere(selector) {
    const cls = selector.replace(/^\./, '');
    const values = [];
    const re = new RegExp('(^|[}\\n])\\s*([^\\n{}]*\\.' + cls + '(?![\\w-])[^\\n{]*)\\{([^}]*)\\}', 'g');
    let m;
    while ((m = re.exec(css))) {
        const z = m[3].match(/z-index:\s*(\d+)/);
        if (z) values.push(Number(z[1]));
    }
    assert.ok(values.length, `no z-index found for ${selector}`);
    return values;
}

/* The tab bar's own declared z-index, read from the rule that positions it fixed. */
function tabbarZIndex() {
    const idx = css.indexOf('position: fixed !important');
    assert.ok(idx !== -1, 'the mobile tab bar must be position: fixed');
    const start = css.lastIndexOf('.ios-tabbar', idx);
    const rule = css.slice(start, css.indexOf('}', idx));
    const z = rule.match(/z-index:\s*(\d+)/);
    assert.ok(z, 'the mobile tab bar must declare a z-index');
    return Number(z[1]);
}

test('all 5 core routes have matching buttons in the iOS tabbar', () => {
    const requiredNavs = ['home', 'study', 'ecg', 'explorer', 'shift'];
    const tabbarMatch = html.match(/<nav class="ios-tabbar"[\s\S]*?<\/nav>/);
    assert.ok(tabbarMatch, 'index.html must contain .ios-tabbar element');
    const tabbarHtml = tabbarMatch[0];
    for (const nav of requiredNavs) {
        assert.ok(tabbarHtml.includes(`data-nav="${nav}"`), `Tab bar must contain data-nav="${nav}"`);
    }
});

test('iOS tabbar accounts for safe-area-inset-bottom and handles print media', () => {
    assert.ok(css.includes('env(safe-area-inset-bottom'), 'app.css must use env(safe-area-inset-bottom)');
    assert.match(css, /@media print[\s\S]*?\.ios-tabbar[\s\S]*?display:\s*none/i, 'Print media must hide .ios-tabbar');
});

test('toast is positioned above the mobile tabbar to prevent collisions', () => {
    assert.match(css, /(\.toast|#toast)[\s\S]*?bottom:\s*calc\([^)]*env\(safe-area-inset-bottom/i, 'Toast must be positioned above tabbar');
});

/* Regression: the tab bar was z-index 9999, which floated it over the mandatory
   first-run disclaimer, the navigation drawer and the ECG lightbox, leaving every
   one of those overlays navigable and clickable through. */
test('tabbar stacks below every modal overlay layer', () => {
    const tabbar = tabbarZIndex();
    for (const [name, selector] of [
        ['disclaimer overlay', '.disclaimer-overlay'],
        ['ECG lightbox', '.ecg-lightbox'],
        ['navigation drawer', '.sidebar'],
        ['drawer backdrop', '.side-backdrop']
    ]) {
        const layers = zIndexAnywhere(selector);
        assert.ok(Math.min(...layers) > tabbar,
            `.ios-tabbar (${tabbar}) must stay below ${name} (${layers.join('/')}) so it cannot float over a blocking overlay`);
    }
});

test('tabbar stays above the sticky topbar it replaces', () => {
    const tabbar = tabbarZIndex();
    const topbar = zIndexAnywhere('.topbar');
    assert.ok(tabbar > Math.min(...topbar), 'tabbar must remain above the topbar layer');
});

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

test('presentation reading keeps the Presentations tab selected', () => {
    assert.match(appJs, /const activeNavKey = view === 'presentation' \? 'home' : view;/,
        'syncNav must map the presentation view onto the home tab so a tab stays lit while reading');
});

test('every learn sub-view selects the Practice tab', () => {
    const learn = appJs.match(/if \(id === 'learn' && window\.EM_LEARNING\)[^\n]*/);
    assert.ok(learn, 'learn route must exist');
    assert.match(learn[0], /syncNav\('study'\)/,
        'progress, skills and visuals all live in the Practice workspace and must not light the Presentations tab');
});

/* Regression: SECTION_EMOJIS carried short keys (rhythm, axis, ischemia-territories,
   tox-lytes) that never matched the real step ids, so 5 of 7 ECG steps rendered the
   generic clipboard emoji. */
test('every ECG step id resolves to a distinct emoji', () => {
    const stepsBlock = dataJs.match(/steps: \[([\s\S]*?)\n {4}\],/);
    assert.ok(stepsBlock, 'data.js must declare the ECG steps array');
    const stepIds = [...stepsBlock[1].matchAll(/^\s*id: '([a-z-]+)',$/gm)].map(m => m[1]);
    const sevenSteps = ['rate-calibration', 'rhythm-axis', 'intervals', 'hypertrophy', 'ischemia-map', 'omi-equivalents', 'toxic-metabolic-mimics'];
    for (const id of sevenSteps) assert.ok(stepIds.includes(id), `data.js must still define step ${id}`);

    const stepMap = appJs.match(/const ECG_STEP_EMOJIS = \{([\s\S]*?)\n {4}\};/);
    assert.ok(stepMap, 'ECG_STEP_EMOJIS map must exist');
    const mapped = new Map([...stepMap[1].matchAll(/'([a-z-]+)':\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
    for (const id of sevenSteps) {
        assert.ok(mapped.has(id), `ECG step "${id}" must have an emoji entry, otherwise it renders the generic fallback`);
    }
    const emojis = new Set(sevenSteps.map(id => mapped.get(id)));
    assert.equal(emojis.size, sevenSteps.length, 'each ECG step should have its own emoji');
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

test('classes added by app markup have supporting CSS rules', () => {
    const hooks = ['findings-header', 'cta-label', 'handover-fallback', 'crumb-current'];
    for (const cls of hooks) {
        assert.ok(new RegExp('\\.' + cls + '\\b').test(css), `.${cls} is used in markup and must have CSS`);
    }
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

test('all ECG Explorer categories carry an emoji', () => {
    const mapBlock = explorerJs.match(/EXPLORER_CAT_EMOJIS = \{([\s\S]*?)\n {2}\};/);
    assert.ok(mapBlock, 'EXPLORER_CAT_EMOJIS must exist');
    const mapped = [...mapBlock[1].matchAll(/'([^']+)':\s*'([^']+)'/g)].map(m => m[1]);
    const used = curriculumCategories();
    assert.ok(used.size >= 5, `expected the curriculum category set to be discovered, got ${[...used]}`);
    for (const cat of used) {
        assert.ok(mapped.includes(cat), `explorer category "${cat}" must have an emoji entry`);
    }
});

test('print cancels the tab-bar clearance padding', () => {
    /* Several print blocks exist, so search all of them rather than the last. */
    const blocks = (css.match(/@media print \{[\s\S]*?\n\}/g) || []).join('\n');
    assert.match(blocks, /\.main \.stage,[\s\S]*?\.foot\s*\{[^}]*padding-bottom:\s*0 !important/,
        'a printed page box is narrower than 920px, so the mobile padding must be cancelled in print');
});

/* ── Mobile reachability regressions ───────────────────────────────────
   Each of these was found from a real iPhone screenshot, not from the source. */

test('the ECG step rail signals that it scrolls and offers a progress meter', () => {
    const rail = css.match(/@media \(max-width: 920px\)[\s\S]*?\.ecg-step-nav \{([\s\S]*?)\n {4}\}/);
    assert.ok(rail, 'mobile .ecg-step-nav rule must exist');
    const body = rail[1];
    assert.match(body, /overflow-x:\s*auto/, 'the rail must remain a horizontal scroller');
    assert.match(body, /scroll-snap-type/, 'snapping makes a horizontal rail feel deliberate');
    /* Without a fade, a chip sliced at the hard right edge reads as a layout bug. */
    assert.match(body, /mask-image:\s*linear-gradient/, 'the rail needs a trailing fade to signal more content');
    assert.ok(/\.ecg-step-nav\.at-end/.test(css), 'the fade must be removable once the end is reached');
    assert.ok(/\.step-rail-meter/.test(css), 'a progress meter is required to show how much is off-screen');
    assert.ok(/\.ecg-step-nav\.at-end[\s\S]{0,200}?mask-image:\s*none/.test(css),
        'at the end of the rail the fade must be removed');
    assert.match(appJs, /function setupStepRail\(\)/, 'scroll state must be wired up');
    assert.match(appJs, /function scrollStepChipIntoView\(/, 'the active step must be scrolled into view');
    assert.match(appJs, /scrollStepChipIntoView\(chip\)/, 'jumping to a step must reveal its chip');
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

test('the tab bar is effectively opaque over ECG paper', () => {
    /* 0.78 alpha with blur(28px) smeared tracings and their numeric labels
       behind a nav control, which is a clinical misread risk. */
    const light = css.match(/:root \{([\s\S]*?)\n\}/)[1];
    const dark = css.match(/html\[data-theme="dark"\] \{([\s\S]*?)\n\}/)[1];
    const alpha = s => {
        const m = s.match(/--glass-bg-bar:\s*rgba\([^)]*?,\s*([\d.]+)\)/);
        assert.ok(m, '--glass-bg-bar must be defined for the tab bar');
        return Number(m[1]);
    };
    assert.ok(alpha(light) >= 0.94, `light tab bar alpha ${alpha(light)} leaves content visible behind it`);
    assert.ok(alpha(dark) >= 0.94, `dark tab bar alpha ${alpha(dark)} leaves content visible behind it`);
    const inner = css.match(/\.ios-tabbar-inner \{([\s\S]*?)\n {4}\}/);
    assert.ok(inner, '.ios-tabbar-inner must exist');
    assert.match(inner[1], /background:\s*var\(--glass-bg-bar\)/, 'the bar must use the opaque token');
    assert.doesNotMatch(inner[1], /blur\(28px\)/, 'heavy blur is what turned tracings into a smear');
});

test('sidebar group disclosure has a visible affordance', () => {
    /* The global details marker reset left closed groups looking like dead text,
       hiding 37 of 46 topics behind headers that appeared inert. */
    assert.match(css, /\.side-group > summary::before \{/, 'a caret must be drawn for sidebar groups');
    assert.match(css, /\.side-group\[open\] > summary::before \{ transform: rotate\(90deg\); \}/,
        'the caret must rotate to show the open state');
    assert.match(css, /--side-caret-mask: url\("data:image\/svg\+xml/, 'the caret needs an inline mask glyph');
    assert.match(css, /\.side-group > summary \{[\s\S]{0,400}?display:\s*flex;/,
        'the summary must lay out the caret inline');
    assert.ok(appJs.includes('<details class="side-group"'), 'sidebar groups stay collapsible');
});

test('the severity Filter control reads as a button', () => {
    const sum = css.match(/\.context-filters > summary \{([\s\S]*?)\n\}/);
    assert.ok(sum, '.context-filters > summary must be styled');
    assert.match(sum[1], /min-height:\s*44px/, 'the filter trigger needs a 44px tap target');
    assert.match(sum[1], /display:\s*inline-flex/, 'icon, label and caret must lay out inline');
    assert.match(html, /class="cf-ico"/, 'the filter needs an icon');
    assert.match(html, /class="cf-caret"/, 'the filter needs a disclosure chevron');
    assert.match(css, /\.context-filters\[open\] > summary \.cf-caret \{ transform: rotate\(180deg\); \}/,
        'the chevron must rotate when open');
});

test('mobile header row children are exactly 44px and do not clip', () => {
    /* The tools button rendered 46px in a 44px grid row, shaving the header. */
    assert.match(css, /\.topbar > \.tools-toggle \{ grid-column: 3; grid-row: 1; border: 0; box-sizing: border-box; height: 44px; min-height: 44px; max-height: 44px; \}/,
        'the mobile tools button must be pinned to the 44px header row and never exceed it');
    /* --touch-target is shared with every control; at 46px it overflowed the
       44px header row and clipped the top bar. */
    const target = css.match(/@media \(max-width: 600px\) \{[\s\S]{0,400}?:root \{ (--touch-target:[^}]*)\}/);
    assert.ok(target, 'the phone touch target must be defined');
    assert.equal(target[1].replace(/[\s;]/g, ''), '--touch-target:44px',
        'the phone touch target must not exceed the 44px header grid row');
    const search = css.match(/\.topbar > \.searchwrap \{([^}]*)\}/);
    assert.ok(search, 'mobile .searchwrap must be styled');
    assert.match(search[1], /min-height:\s*44px/, 'the search field must keep a 44px tap target');
});

test('the step rail progress meter is hidden in print', () => {
    /* The rail itself is already in the print hide list; the meter added beside
       it would otherwise print as a stray grey bar. */
    const printRules = css.match(/@media print \{([\s\S]*?)\n\}/g) || [];
    const all = printRules.join('\n');
    assert.match(all, /\.step-rail-meter[^{]*\{[^}]*display:\s*none\s*!important/, 'the meter must not print');
});

test('a final print block keeps narrow-paper layouts from printing UI', () => {
    /* The glass layout layers use !important on display, and narrow paper (A5 or
       a phone's own print-to-PDF near 390px) also matches the max-width 920/700px
       blocks, so the last print block has to win on order. */
    const last = css.slice(css.lastIndexOf('@media print'));
    assert.match(last, /\.ecg-step-nav,[\s\S]*?\.step-rail-meter,[\s\S]*?\.ios-tabbar\s*\{[^}]*display:\s*none !important/,
        'the trailing print block must hide the step rail, its meter and the tab bar');
    assert.ok(last.indexOf('.ios-tabbar') > -1 && last.includes('@media print'),
        'the override must live in a print block at the end of the file');
});

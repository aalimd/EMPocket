const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const applyRoute = appJs.slice(appJs.indexOf('function applyRoute('), appJs.indexOf('function renderUnavailablePage('));
const renderStudy = appJs.slice(appJs.indexOf('function renderStudy('), appJs.indexOf('function showStudy('));

function slice(start, end) {
    const from = appJs.indexOf(start);
    const to = appJs.indexOf(end, from);
    assert.ok(from !== -1 && to > -1, 'source region exists: ' + start + ' .. ' + end);
    return appJs.slice(from, to);
}

test('every back button returns to the destination that opened the screen', () => {
    assert.doesNotMatch(appJs, /addEventListener\('click', showHome\)/,
        'back buttons must no longer be hard-wired to the library');
    assert.ok((appJs.match(/addEventListener\('click', goBack\)/g) || []).length >= 6,
        'each back-button binding routes through goBack');
    assert.match(appJs, /function goBack\(\)/);
    assert.match(appJs, /const dest = backDestination\(\)\.hash;/,
        'goBack resolves the destination and its label from one place');
    assert.match(appJs, /applyRoute\(false, true\);/,
        'goBack renders through the router instead of only the library');
    assert.doesNotMatch(appJs, /history\.back\(/,
        'navigation stays deterministic: reaching the app from an external link must not strand the user');
});

test('destinations record their context and topics only record what opened them', () => {
    for (const branch of [
        "recordBackContext('search', location.hash)",
        "recordBackContext('learn', location.hash)",
        "recordBackContext('ecg')"
    ]) assert.ok(applyRoute.includes(branch), branch + ' must record its destination');
    assert.doesNotMatch(applyRoute, /recordBackContext\('settings'\)/,
        'a utility settings visit must preserve the original reading destination');
    assert.match(appJs, /function renderHome\(preservePosition\) \{\n\s*const position = window\.scrollY;\n\s*recordBackContext\('library'\);/);
    assert.match(renderStudy, /recordBackContext\('study', location\.hash/);
    assert.match(appJs, /function renderShift\(id\) \{\n\s*recordBackContext\('shift'\);/);
    assert.match(appJs, /function renderExplorer\(id\) \{\n\s*recordBackContext\('explorer'\);/);

    const topics = slice('else if (id === ECG_TOPIC_ID)', 'else if (!id || id ===');
    assert.match(topics, /captureBackSource\(\); renderEcg\(target\);/);
    assert.match(topics, /captureBackSource\(\); renderPresentation\(id, target, preservePosition\);/);
    assert.doesNotMatch(topics, /recordBackContext\(/,
        'opening a topic must never overwrite the destination Back returns to');
    assert.match(appJs, /if \(!lastClick \|\| lastClick\.hash !== backContext\.originHash\) return;/,
        'only a card clicked inside the recorded destination becomes the Back target');
});

test('back labels follow the destination and fall back to the library', () => {
    assert.match(appJs, /label \|\| \('Back to ' \+ backDestination\(\)\.label\)/);
    assert.match(appJs, /if \(\(location\.hash \|\| '#library'\) === backContext\.hash\) return \{ hash: '#library', label: 'Library' \};/,
        'returning to the view already on screen falls back to the library');
    assert.match(appJs, /const BACK_DESTINATIONS = \{[\s\S]*?library: \{ hash: '#library', label: 'Library' \}[\s\S]*?shift: \{ hash: '#shift', label: 'Quick' \}/);
});

test('back refocuses the card that opened the screen when it survives the render', () => {
    assert.match(appJs, /backSource = \{ selector: '\[data-id="' \+ card\.dataset\.id \+ '"\]', y: lastClick\.scrollY \}/);
    assert.match(appJs, /backSource = \{ selector: 'a\[href="#' \+ raw \+ '"\]', y: lastClick\.scrollY \}/);
    assert.match(appJs, /document\.getElementById\('presentationLibraryTitle'\) \|\| stage\.querySelector\('h1'\) \|\| stage/,
        'a destination that lost the card still lands on a heading, never on the body');
    assert.match(appJs, /if \(source && source\.y\) window\.scrollTo\(\{ top: source\.y \}\);/,
        'the destination keeps the scroll position it had when the topic was opened');
});

test('an unavailable link explains itself and offers the library and search', () => {
    const page = slice('function renderUnavailablePage(', 'function showSectionUnavailable(');
    assert.match(page, /<h1 tabindex="-1">This page is unavailable<\/h1>/);
    assert.match(page, /href="#library">Open the library</);
    assert.match(page, /href="#search">Search The EM Pocket</);
    assert.match(page, /setTitle\('This page is unavailable'\)/);
    assert.match(page, /announce\('This page is unavailable'\)/);
    assert.match(applyRoute, /else renderUnavailablePage\(\);/);
});

test('an unknown section keeps the topic and explains the link', () => {
    assert.match(appJs, /function jumpToSection\(target, fromSearch\) \{\n\s*const card = document\.getElementById\('section-' \+ target\);\n\s*if \(!card\) return false;/);
    assert.match(appJs, /if \(target\) \{\n\s*if \(jumpToSection\(target, true\) === false\) showSectionUnavailable\('#' \+ id\);/,
        'presentation routes report the missing section');
    assert.match(appJs, /if \(jumpToSection\(resolveEcgJump\(ecg, target\), true\) === false\) showSectionUnavailable\('#ecg'\)/,
        'the ECG guide reports the missing section too');
    const notice = slice('function showSectionUnavailable(', 'function refreshActiveRoute(');
    assert.match(notice, /This section is unavailable in this topic\./);
    assert.match(notice, /href="#search">Search The EM Pocket</);
    assert.match(notice, /setAttribute\('role', 'status'\)/);
    assert.match(notice, /getElementById\('presentationTitle'\) \|\| document\.getElementById\('ecgTitle'\)/);
});

test('saved topics opened from the library light the library and keep the legacy study route', () => {
    assert.match(applyRoute, /else if \(id === 'library'\) \{ if \(target === 'saved'\) \{ recordBackContext\('library', '#library~saved'\); renderStudy\('saved', \{ nav: 'home', title: 'Saved topics'/);
    assert.match(applyRoute, /else if \(id === 'study'\) renderStudy\(target \|\| 'due'\);/,
        'the legacy #study route keeps its own renderer call');
    assert.match(renderStudy, /const nav = \(opts && opts\.nav\) \|\| 'study';/,
        'without an explicit owner the study screens stay on the study nav');
    assert.match(renderStudy, /syncNav\(nav\); setTitle\(title\);/);
    assert.match(renderStudy, /if \(nav === 'home'\) \{ recordBackContext\('library', '#library~saved'\); markActive\(null\); \}/);
});

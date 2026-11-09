'use strict';
/* Phase 1 coordination contracts: the published window.* globals and the
   hash routes are the coordination surface between the classic-script
   modules. This test pins the registry in assets/app.js so a new module
   or route cannot be added without updating the contract, and so the
   validator actually distinguishes critical from optional data. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const appJs = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');

function loadRegistry() {
    const start = appJs.indexOf('/* ══════════ Phase 1');
    const end = appJs.indexOf('function announce(', start);
    assert.ok(start !== -1 && end > start, 'phase-1 registry block exists in app.js');
    const ctx = { window: {}, console };
    vm.createContext(ctx);
    vm.runInContext(appJs.slice(start, end) +
        '\nthis.api = { validateModuleContracts, reportBootContracts, MODULE_CONTRACTS, ROUTE_REGISTRY };', ctx);
    return { ctx, api: ctx.api };
}

test('the contract registry names the critical globals and their consumers', () => {
    const { api } = loadRegistry();
    const byGlobal = Object.fromEntries(api.MODULE_CONTRACTS.map(c => [c.global, c]));
    assert.equal(byGlobal.CP_DATA.required, true, 'CP_DATA is critical: the library cannot render without it');
    assert.equal(byGlobal.SEARCH_CORE.required, true, 'SEARCH_CORE is critical: search cannot run without it');
    for (const optional of ['ECG_SVG', 'ECG_ENGINE', 'SHIFT_TOOLS', 'STUDENT_LEARNING', 'EM_LEARNING']) {
        assert.equal(byGlobal[optional].required, false, optional + ' must stay optional so its absence degrades, not breaks');
    }
    for (const contract of api.MODULE_CONTRACTS) {
        assert.ok(Array.isArray(contract.consumers) && contract.consumers.length, contract.global + ' names its consumers');
    }
    /* Every published global pinned by tests/module-loading.test.js except
       the post-app consumer (POCKET_DESIGN) and the recordings library
       (loaded on demand) appears in the contract. */
    for (const g of ['CP_DATA', 'ECG_DATA', 'ECG_SVG', 'ECG_ENGINE', 'ECG_CURRICULUM', 'ECG_EXPLORER',
        'ECG_INTERACTIVE', 'CLINICAL_EVIDENCE', 'STUDENT_LEARNING', 'EM_LEARNING_DATA', 'EM_LEARNING',
        'SHIFT_TOOLS', 'SEARCH_CORE', 'EM_LEARNING_STORE', 'EM_PREFS', 'EM_SEARCH_INDEX', 'EM_AGREEMENT',
        'EM_NAVIGATION']) {
        assert.ok(byGlobal[g], g + ' is covered by the boot contract');
    }
});

test('the validator separates critical from optional absence', () => {
    const { api } = loadRegistry();
    /* Arrays created inside the vm realm fail deepStrictEqual's prototype
       check, so compare their contents explicitly. */
    const full = {};
    api.MODULE_CONTRACTS.forEach(c => { full[c.global] = {}; });
    const complete = api.validateModuleContracts(full);
    assert.equal(complete.ok, true);
    assert.equal(complete.missingCritical.length, 0);

    const noData = { ...full };
    delete noData.CP_DATA;
    const critical = api.validateModuleContracts(noData);
    assert.equal(critical.ok, false);
    assert.equal(critical.missingCritical.length, 1);
    assert.equal(critical.missingCritical[0], 'CP_DATA');

    const noEcg = { ...full };
    delete noEcg.ECG_SVG;
    const degraded = api.validateModuleContracts(noEcg);
    assert.equal(degraded.ok, true, 'a missing optional module must not fail the boot check');
    assert.equal(degraded.missingOptional.length, 1);
    assert.equal(degraded.missingOptional[0], 'ECG_SVG');
});

test('reportBootContracts publishes a frozen EM_BOOT snapshot on the window', () => {
    const { ctx, api } = loadRegistry();
    api.MODULE_CONTRACTS.forEach(c => { ctx.window[c.global] = {}; });
    const report = api.reportBootContracts();
    assert.equal(report.ok, true);
    assert.ok(ctx.window.EM_BOOT, 'EM_BOOT is published for diagnostics');
    assert.equal(Object.isFrozen(ctx.window.EM_BOOT), true, 'the boot snapshot is immutable');
    assert.equal(ctx.window.EM_BOOT.ok, true);
});

test('the route registry covers every branch the router handles', () => {
    const { api } = loadRegistry();
    const applyRoute = appJs.slice(appJs.indexOf('function applyRoute('), appJs.indexOf('function renderUnavailablePage('));
    const registered = new Set(api.ROUTE_REGISTRY.map(r => r.id));
    for (const id of ['search', 'settings', 'learn', 'library', 'ecg-hub', 'study', 'shift', 'calc', 'ecg-explorer']) {
        assert.ok(applyRoute.includes("id === '" + id + "'"), 'router handles #' + id);
        assert.ok(registered.has(id), 'registry lists #' + id);
    }
    assert.ok(applyRoute.includes('id === ECG_TOPIC_ID'), 'router handles the ECG topic via ECG_TOPIC_ID');
    assert.ok(registered.has('ecg'), 'registry lists #ecg (ECG_TOPIC_ID)');
    assert.ok(registered.has('presentation'), 'registry lists the presentation fallback resolved via BY_ID');
    for (const entry of api.ROUTE_REGISTRY) {
        assert.ok(entry.handler, '#' + entry.id + ' names its handler');
    }
});

test('the extracted learning store publishes the full API app.js delegates to', () => {
    const store = fs.readFileSync(path.join(root, 'assets/learning-store.js'), 'utf8');
    const memory = new Map();
    const ctx = { window: {}, localStorage: {
        getItem: k => (memory.has(k) ? memory.get(k) : null),
        setItem: (k, v) => memory.set(k, String(v))
    } };
    vm.createContext(ctx);
    vm.runInContext(store, ctx);
    const api = ctx.window.EM_LEARNING_STORE;
    assert.ok(api, 'learning-store.js publishes window.EM_LEARNING_STORE');
    for (const name of ['reviewFor', 'reviewedIds', 'isReviewed', 'isReviewDue', 'setReviewed', 'savedIds',
        'isSaved', 'setSaved', 'noteFor', 'setNote', 'dueIds', 'reviewLabel', 'setTopicExists']) {
        assert.equal(typeof api[name], 'function', 'store exposes ' + name);
    }
    assert.equal(api.REVIEW_INTERVALS.join(','), '1,3,7,14', 'review intervals are unchanged');
    assert.ok(api.reviewState && typeof api.reviewState === 'object', 'store owns the review state');
    /* dueIds honors the injected topic predicate instead of app.js internals. */
    api.setTopicExists(id => id === 'shock');
    api.saveLearning({
        reviewed: {},
        reviewPlan: { shock: { stage: 1, dueAt: Date.now() - 1000 }, 'unknown-topic': { stage: 1, dueAt: Date.now() - 1000 } },
        saved: {}, notes: {}
    });
    const due = api.dueIds();
    assert.ok(due.includes('shock'), 'dueIds includes an injected real topic once due');
    assert.ok(!due.includes('unknown-topic'), 'dueIds excludes ids the predicate rejects');
    /* app.js delegates instead of owning the logic, and injects topicRecord. */
    assert.match(appJs, /window\.EM_LEARNING_STORE\) \|\| null/);
    assert.match(appJs, /learningStore\.setTopicExists\(topicRecord\)/);
    assert.doesNotMatch(appJs, /function loadLearning\(\)/,
        'the storage logic moved out of app.js');
    assert.match(appJs, /function dueIds\(\) \{ return learningStore \? learningStore\.dueIds\(\) : \[\]; \}/);
});

test('the extracted prefs store is the single source for accents and scales', () => {
    const store = fs.readFileSync(path.join(root, 'assets/prefs-store.js'), 'utf8');
    const memory = new Map();
    const ctx = { window: {}, localStorage: {
        getItem: k => (memory.has(k) ? memory.get(k) : null),
        setItem: (k, v) => memory.set(k, String(v))
    } };
    vm.createContext(ctx);
    vm.runInContext(store, ctx);
    const prefs = ctx.window.EM_PREFS;
    assert.ok(prefs, 'prefs-store.js publishes window.EM_PREFS');
    assert.equal(prefs.STORAGE_KEY, 'em-cps-prefs', 'storage key is unchanged');
    assert.equal(prefs.ACCENTS.join(','), 'emerald,ocean,violet,rose,amber,teal');
    assert.equal(prefs.SCALE_STEPS.join(','), '0.85,1,1.12,1.25,1.4');
    assert.equal(prefs.normalizeAccent('ocean'), 'ocean');
    assert.equal(prefs.normalizeAccent('nope'), 'emerald', 'unknown accents fall back to emerald');
    assert.equal(prefs.nearestScale(1.2), 1.25);
    assert.deepEqual({ ...prefs.normalizePrefs({ theme: 'dark', accent: 'rose', scale: 2, bold: true, sidebar: true }) },
        { theme: 'dark', accent: 'rose', scale: 1.4, bold: true, sidebar: true },
        'normalization clamps scale and keeps valid fields');
    assert.deepEqual({ ...prefs.normalizePrefs('junk') },
        { theme: 'light', accent: 'emerald', scale: 1, bold: false, sidebar: false },
        'non-object input becomes defaults');
    assert.equal(prefs.savePrefs({ theme: 'dark', accent: 'ocean', scale: 1.12, bold: false, sidebar: false }), true);
    assert.equal(JSON.parse(memory.get('em-cps-prefs')).accent, 'ocean');
    assert.equal(prefs.loadPrefs().theme, 'dark');
    assert.equal(prefs.storageAvailable(), true);
    /* app.js delegates, and backup validation reads the same lists. */
    assert.match(appJs, /window\.EM_PREFS\) \|\| null/);
    assert.doesNotMatch(appJs, /function loadPrefs\(\) \{\n\s*if \(!prefsStorageAvailable\) return prefsMemory;/,
        'the storage logic moved out of app.js');
    const learning = fs.readFileSync(path.join(root, 'assets/em-learning.js'), 'utf8');
    assert.match(learning, /window\.EM_PREFS/, 'backup validation reads prefs-store lists at runtime');
});

test('the extracted search index builder is pure over its inputs', () => {
    const source = fs.readFileSync(path.join(root, 'assets/search-index.js'), 'utf8');
    const ctx = { window: {} };
    vm.createContext(ctx);
    vm.runInContext(source, ctx);
    const index = ctx.window.EM_SEARCH_INDEX;
    assert.ok(index, 'search-index.js publishes window.EM_SEARCH_INDEX');
    assert.equal(typeof index.buildSearchIndex, 'function');
    assert.ok(Array.isArray(index.QUICK_SEARCH_CARDS) && index.QUICK_SEARCH_CARDS.length === 9,
        'the Quick drug/decision-rule mirror is intact');
    const titles = index.QUICK_SEARCH_CARDS.map(c => c.term).join(' | ');
    for (const term of ['Rapid Sequence Intubation', 'Shock Vasopressors', 'Antidotes', 'HEART Pathway', 'PERC Rule']) {
        assert.ok(titles.includes(term), 'Quick card present: ' + term);
    }

    const data = [{
        id: 'chest-pain', name: 'Chest Pain', tag: 'Rule out killers',
        approach: ['ECG within 10 minutes'], dontMiss: [['ACS', 'critical', 'Serial troponin']],
        redFlags: ['Hypotension'], history: ['OPQRST'], exam: ['Vitals'],
        workup: [['Bedside', ['12-lead ECG']]], disposition: [['Admit', 'Telemetry']],
        pitfalls: ['Anchoring'], pearls: ['Six killers']
    }];
    const ecg = {
        tag: 'ECG tag', title: 'ECG Guide', subtitle: 'sub', firstPass: ['Rate first'],
        steps: [{ id: 'rate', num: 1, name: 'Rate', summary: 'Count', pearl: 'Slow is fine', pitfall: null }],
        patterns: [{ id: 'stemi', name: 'STEMI', criteria: '<b>ST elevation</b>', tag: 'OMI' }],
        redFlags: ['Wide QRS'], pearls: ['Check II'], pitfalls: ['Do not anchor']
    };
    const extras = {
        byId: { 'chest-pain': data[0] }, ecgTopicId: 'ecg',
        stripTags: s => String(s).replace(/<[^>]+>/g, ' ').trim(),
        ecgExplorer: { cases: [{ id: 'af', name: 'AF', category: 'Rhythms', summary: 'irregular' }] },
        studentLearning: { cases: [{ id: 'cp', title: 'Case', stem: 'stem' }] },
        emLearning: { searchItems: () => [{ cpId: 'learn', target: 'case-x', title: 'Learned', sub: 's', kind: 'Learn' }] },
        shiftTools: { symptomTerms: [{ cpId: 'chest-pain', terms: ['crushing pain'] }, { cpId: 'missing', terms: ['ignored'] }] }
    };
    const entries = index.buildSearchIndex(data, ecg, extras);
    const byTitle = t => entries.find(e => e.title === t);
    assert.ok(byTitle('Chest Pain'), 'presentation overview indexed');
    assert.ok(byTitle('ECG within 10 minutes'), 'approach indexed');
    assert.ok(byTitle('ACS'), 'dont-miss indexed with its severity kind');
    assert.ok(byTitle('12-lead ECG'), 'workup items indexed');
    assert.ok(byTitle('Step 1: Rate'), 'ECG steps indexed');
    assert.ok(byTitle('STEMI'), 'ECG patterns indexed with markup stripped');
    assert.equal(byTitle('STEMI').sub, 'ST elevation', 'criteria HTML is stripped by the injected stripper');
    assert.ok(byTitle('AF') && byTitle('AF').cpId === 'ecg-explorer', 'explorer cases indexed');
    assert.ok(byTitle('Case') && byTitle('Case').cpId === 'study', 'short cases indexed');
    assert.ok(byTitle('Learned'), 'learning items indexed');
    assert.ok(byTitle('crushing pain') && byTitle('crushing pain').symptom, 'symptom terms indexed and flagged');
    assert.ok(!byTitle('ignored'), 'symptom terms for unknown topics are skipped');
    const quick = entries.find(e => e.quick);
    assert.ok(quick && quick.cpId === 'shift', 'Quick cards are indexed first with the quick flag');
    /* No extras and no ECG: still builds the presentation index alone. */
    const bare = index.buildSearchIndex(data, null, {});
    assert.ok(bare.some(e => e.title === 'Chest Pain'), 'works without ECG or extras');
    assert.ok(!bare.some(e => e.cpId === 'ecg'), 'no ECG entries without an ECG record');
    /* app.js delegates with the live singletons. */
    assert.match(appJs, /window\.EM_SEARCH_INDEX\) \|\| null/);
    assert.match(appJs, /searchIndexModule\.buildSearchIndex\(DATA, getEcg\(\),/);
});

test('the extracted agreement store keeps the notice semantics', () => {
    const source = fs.readFileSync(path.join(root, 'assets/agreement-store.js'), 'utf8');
    const memory = new Map();
    let blocked = false;
    const ctx = { window: {}, localStorage: {
        getItem: k => { if (blocked) throw Error('blocked'); return memory.has(k) ? memory.get(k) : null; },
        setItem: (k, v) => { if (blocked) throw Error('blocked'); memory.set(k, String(v)); }
    } };
    vm.createContext(ctx);
    vm.runInContext(source, ctx);
    const agreement = ctx.window.EM_AGREEMENT;
    assert.ok(agreement, 'agreement-store.js publishes window.EM_AGREEMENT');
    assert.equal(agreement.STORAGE_KEY, 'em-cps-disclaimer-agreed', 'storage key is unchanged');
    assert.equal(agreement.isAgreed(), false, 'not agreed initially');
    agreement.setAgreed();
    assert.equal(agreement.isAgreed(), true, 'agreed after setAgreed');
    assert.ok(memory.has('em-cps-disclaimer-agreed'), 'agreement persisted under the same key');
    /* The in-memory cache never clears within the session: even with
       storage blocked afterwards, the learner stays agreed. */
    blocked = true;
    assert.equal(agreement.isAgreed(), true, 'session cache survives storage failure');
    /* And it is never part of learning backups. */
    const learning = fs.readFileSync(path.join(root, 'assets/em-learning.js'), 'utf8');
    assert.doesNotMatch(learning, /backupKeys = \[[^\]]*em-cps-disclaimer-agreed/,
        'agreements stay out of backups');
    assert.match(appJs, /window\.EM_AGREEMENT\) \|\| null/);
    assert.match(appJs, /function isDisclaimerAgreed\(\) \{ return agreementStore \? agreementStore\.isAgreed\(\) : false; \}/);
});

test('the extracted navigation store keeps back-context behavior', () => {
    const source = fs.readFileSync(path.join(root, 'assets/navigation-store.js'), 'utf8');
    const location = { hash: '#library' };
    const ctx = { window: {}, location, document: { getElementById: () => null }, history: {} };
    vm.createContext(ctx);
    vm.runInContext(source, ctx);
    const nav = ctx.window.EM_NAVIGATION;
    assert.ok(nav, 'navigation-store.js publishes window.EM_NAVIGATION');
    assert.equal(nav.BACK_DESTINATIONS.shift.label, 'Quick');
    assert.equal(nav.backDestination().hash, '#library', 'initial destination is the library');
    nav.recordBackContext('search', '#search');
    assert.equal(nav.context().hash, '#search');
    assert.equal(nav.context().label, 'Search');
    location.hash = '#search';
    assert.equal(nav.backDestination().hash, '#library',
        'already on the destination: Back falls back to the library');
    location.hash = '#chest-pain';
    assert.equal(nav.backDestination().hash, '#search', 'Back returns to the recorded destination');
    nav.recordBackContext('unknown-key');
    assert.equal(nav.context().hash, '#library', 'unknown keys fall back to the library');
    /* App still owns goBack and delegation, and the click capture feeds the store. */
    assert.match(appJs, /function goBack\(\) \{/);
    assert.match(appJs, /window\.EM_NAVIGATION\) \|\| null/);
    assert.match(appJs, /rememberLastClick\(el, location\.hash/);
    assert.doesNotMatch(appJs, /let backContext = \{ hash: '#library'/,
        'the state machine moved out of app.js');
});

test('the router runs behind an error boundary and boot is checked at init', () => {
    assert.match(appJs, /function safeApplyRoute\(preservePosition, approved\) \{/);
    assert.match(appJs, /catch \(error\) \{\n\s*console\.error\('EM Pocket route failed', error\);/,
        'a throwing renderer is logged, not swallowed silently');
    assert.match(appJs, /window\.addEventListener\('hashchange', \(\) => safeApplyRoute\(\)\);/);
    assert.match(appJs, /function init\(\) \{\n\s*reportBootContracts\(\);/,
        'init validates the module contracts before wiring the UI');
    assert.match(appJs, /validateModuleContracts, reportBootContracts, MODULE_CONTRACTS, ROUTE_REGISTRY, safeApplyRoute/,
        'the coordination surface is exported on EM_POCKET_UI for consumers and tests');
});

'use strict';
/* The 14 runtime scripts are ES modules so they fetch in parallel and no longer
   block first paint. Module scope is strict and file-local, which is the whole
   reason this test exists: a bare global would still look fine to `node --check`
   and would only throw a ReferenceError in the browser. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptTags = [...html.matchAll(/<script([^>]*)>/g)].map(m => m[1]);

test('every runtime script is a deferred ES module', () => {
    const srcTags = scriptTags.filter(a => /\ssrc=/.test(a));
    /* 13 startup modules: the 232KB recorded-ECG library is loaded on demand
       instead (see the deferral test below). */
    assert.equal(srcTags.length, 13, 'expected 13 startup modules');
    for (const attrs of srcTags) {
        assert.match(attrs, /type="module"/,
            'script is still render-blocking: ' + attrs.trim().slice(0, 70));
    }
    const classic = srcTags.filter(a => !/type="module"/.test(a));
    assert.equal(classic.length, 0, 'no classic render-blocking script may remain');
});

test('the recorded-ECG library is deferred but still precached', () => {
    /* It is 232KB gzipped and only one visual lesson needs it. It must not be a
       startup dependency, and it must stay in the worker precache or the lesson
       breaks offline. */
    const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
    assert.doesNotMatch(html, /<script[^>]*src="assets\/ecg-recordings\.js/,
        'the recordings must not be a startup script; it blocks first paint');
    assert.match(sw, /'\.\/assets\/ecg-recordings\.js\?v=[^']+'/,
        'the recordings must stay precached so the lesson works offline');
    const learning = fs.readFileSync(path.join(root, 'assets/em-learning.js'), 'utf8');
    const imported = learning.match(/import\('\.\/ecg-recordings\.js\?v=([^']+)'\)/);
    assert.ok(imported, 'the lesson must load the recordings with a dynamic import');
    /* Otherwise the same file is fetched and cached twice, under two URLs. */
    assert.ok(sw.includes("'./assets/ecg-recordings.js?v=" + imported[1] + "'"),
        'the dynamic import must use the same release token as the precache entry');
});

test('no inline classic script depends on load order', () => {
    /* The only inline script left is the theme bootstrap, which must run before
       paint to avoid a flash of the wrong theme. */
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1].trim());
    assert.equal(inline.length, 1, 'expected exactly one inline bootstrap script');
    assert.match(inline[0], /data-theme|localStorage/,
        'the inline script should only be the pre-paint theme bootstrap');
});

test('each module still publishes the global its consumers read', () => {
    const expected = {
        'assets/data.js': ['CP_DATA', 'ECG_DATA'],
        'assets/ecg-svg.js': ['ECG_SVG', 'ECG_PNG_DIR'],
        'assets/ecg-engine.js': ['ECG_ENGINE'],
        'assets/ecg-curriculum.js': ['ECG_CURRICULUM'],
        'assets/ecg-explorer.js': ['ECG_EXPLORER'],
        'assets/ecg-interactive.js': ['ECG_INTERACTIVE'],
        'assets/ecg-recordings.js': ['EM_ECG_RECORDINGS'],
        'assets/evidence.js': ['CLINICAL_EVIDENCE'],
        'assets/student-learning.js': ['STUDENT_LEARNING'],
        'assets/em-learning-data.js': ['EM_LEARNING_DATA'],
        'assets/em-learning.js': ['EM_LEARNING']
    };
    for (const [file, globals] of Object.entries(expected)) {
        const src = fs.readFileSync(path.join(root, file), 'utf8');
        for (const g of globals) {
            assert.ok(src.includes('window.' + g), file + ' must publish window.' + g);
        }
    }
});

test('no module reads another module through a bare global', () => {
    const published = ['CP_DATA', 'ECG_DATA', 'ECG_CURRICULUM', 'ECG_ENGINE', 'ECG_EXPLORER',
        'ECG_INTERACTIVE', 'ECG_SVG', 'ECG_PNG_DIR', 'EM_LEARNING_DATA', 'EM_LEARNING',
        'CLINICAL_EVIDENCE', 'STUDENT_LEARNING', 'EM_ECG_RECORDINGS'];
    for (const file of fs.readdirSync(path.join(root, 'assets')).filter(f => f.endsWith('.js'))) {
        const src = fs.readFileSync(path.join(root, 'assets', file), 'utf8');
        for (const g of published) {
            const own = new RegExp('window\\.' + g + '\\s*=');
            if (own.test(src)) continue; // the publisher may use its own local name
            /* Strip comments and strings so prose mentions do not trip the check. */
            const code = src
                .replace(/\/\*[\s\S]*?\*\//g, ' ')
                .replace(/^\s*\/\/.*$/gm, ' ')
                .replace(/'(?:[^'\\]|\\.)*'/g, "''")
                .replace(/"(?:[^"\\]|\\.)*"/g, '""')
                .replace(/`(?:[^`\\]|\\.)*`/g, '``');
            const bare = new RegExp('(^|[^.\\w$])' + g + '\\b');
            assert.doesNotMatch(code, bare,
                file + ' reads ' + g + ' unqualified; module scope would throw at runtime');
        }
    }
});

test('modules are self-contained enough to load in strict mode', () => {
    /* Modules are always strict. Undeclared assignment is the usual casualty, so
       assert each file is already written for it. */
    for (const file of fs.readdirSync(path.join(root, 'assets')).filter(f => f.endsWith('.js'))) {
        /* Clinical prose says "with thiamine" and "with glucose", so comments and
           string literals have to go before looking for real syntax. */
        const src = fs.readFileSync(path.join(root, 'assets', file), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/^\s*\/\/.*$/gm, ' ')
            .replace(/'(?:[^'\\]|\\.)*'/g, "''")
            .replace(/"(?:[^"\\]|\\.)*"/g, '""')
            .replace(/`(?:[^`\\]|\\.)*`/g, '``');
        assert.doesNotMatch(src, /(^|[^.)\w])with\s*\(/,
            file + ' uses a with statement, which is illegal in a module');
        assert.doesNotMatch(src, /arguments\.callee/,
            file + ' uses arguments.callee, which is illegal in a module');
    }
});

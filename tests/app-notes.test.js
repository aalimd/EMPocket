'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/app.js'), 'utf8');
const noteCode = source.slice(source.indexOf('    function isRecord('), source.indexOf('    function dueIds('));

function fixture() {
    const original = { reviewed: { shock: 5 }, reviewPlan: { shock: { stage: 1, dueAt: 12345 } }, saved: { ecg: 9 }, notes: { 'chest-pain': 'Earlier note', ecg: 'Other note' } };
    let raw = JSON.stringify(original), failWrite = false, failRead = false, writes = 0;
    const context = vm.createContext({ localStorage: {
        getItem(key) { assert.equal(key, 'em-cps-learning'); if (failRead) throw Error('blocked'); return raw; },
        setItem(key, value) { assert.equal(key, 'em-cps-learning'); writes++; if (failWrite) throw Error('full'); raw = value; }
    } });
    vm.runInContext(noteCode + '\nthis.notesApi = {setNote, noteFor};', context);
    return { api: context.notesApi, original, read: () => JSON.parse(raw), writes: () => writes, blockWrites: value => { failWrite = value; }, blockReads: () => { failRead = true; } };
}

test('a failed note write preserves both the stored and session copies of the previous note', () => {
    const f = fixture(); f.blockWrites(true);
    assert.equal(f.api.setNote('chest-pain', 'New draft'), false);
    assert.equal(f.api.noteFor('chest-pain'), 'Earlier note');
    assert.deepEqual(f.read(), f.original);
});

test('a failed note deletion preserves the saved note', () => {
    const f = fixture(); f.blockWrites(true);
    assert.equal(f.api.setNote('chest-pain', ''), false);
    assert.equal(f.api.noteFor('chest-pain'), 'Earlier note');
    assert.deepEqual(f.read(), f.original);
});

test('retrying after a temporary write failure saves the note and preserves other learning records', () => {
    const f = fixture(); f.blockWrites(true);
    assert.equal(f.api.setNote('chest-pain', 'New draft'), false);
    f.blockWrites(false);
    assert.equal(f.api.setNote('chest-pain', 'New draft'), true);
    assert.equal(f.api.noteFor('chest-pain'), 'New draft');
    assert.deepEqual(f.read(), { ...f.original, notes: { ...f.original.notes, 'chest-pain': 'New draft' } });
});

test('unreadable learning storage is never overwritten with an incomplete note record', () => {
    const f = fixture(); f.blockReads();
    assert.equal(f.api.setNote('chest-pain', 'New draft'), false);
    assert.equal(f.writes(), 0);
    assert.deepEqual(f.read(), f.original);
});

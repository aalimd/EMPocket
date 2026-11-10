'use strict';
/* The content audit found the search did plain substring matching: no fuzzy
   tolerance, no synonyms, and short queries hit the middle of words
   ("tpa" → "outpatient"). search-core.js fixes those; these tests pin the
   behaviour so a regression cannot creep back in. */
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/search-core.js'), 'utf8'), ctx);
const core = ctx.window.SEARCH_CORE;

test('word-boundary matching stops "tpa" hitting "outpatient"', () => {
    assert.equal(core.containsWord('arrange outpatient follow-up', 'tpa'), false);
    assert.equal(core.containsWord('give tpa for stroke', 'tpa'), true);
    assert.equal(core.matches('outpatient endoscopy pathway', 'tpa'), false);
});

test('single-character and short fragments do not match mid-word', () => {
    assert.equal(core.matches('the patient is stable', 'ia'), false);
    assert.equal(core.matches('postpartum haemorrhage', 'tp'), false);
});

test('synonyms and British/American spellings resolve to the same concept', () => {
    const pairs = [
        ['adrenaline', 'epinephrine'],
        ['salbutamol', 'albuterol'],
        ['paracetamol', 'acetaminophen'],
        ['hyperkalemia', 'hyperkalaemia'],
        ['myocardial infarction', 'mi']
    ];
    for (const [a, b] of pairs) {
        const forms = core.expandSynonyms(a);
        assert.ok(forms.includes(b), a + ' should expand to include ' + b);
    }
    /* "adrenaline" must find text written as "epinephrine". */
    assert.equal(core.matches('give epinephrine IM now', 'adrenaline'), true);
    assert.equal(core.matches('give adrenaline IM now', 'epinephrine'), true);
});

test('fuzzy matching tolerates a misspelling', () => {
    assert.equal(core.matches('anaphylaxis with airway swelling', 'anaphylxis'), true);
    assert.equal(core.matches('rocuronium 1.2 mg/kg', 'rocuronium'), true);
    assert.equal(core.matches('calcium gluconate 10%', 'calcium gluconte'), true);
});

test('multi-token queries require every token (AND semantics)', () => {
    assert.equal(core.matches('rocuronium 1.2 mg/kg IV', 'rocuronium dose'), false);
    assert.equal(core.matches('rocuronium dose 1.2 mg/kg IV', 'rocuronium dose'), true);
});

test('treatment-content kinds outrank plain teaching for the same query', () => {
    const asText = core.score('Sodium bicarbonate 1-2 mEq/kg', 'Quick antidote dose', 'bicarbonate', 'Quick · antidote dose');
    const asTeaching = core.score('Sodium bicarbonate 1-2 mEq/kg', 'ECG teaching', 'bicarbonate', 'ECG teaching');
    assert.ok(asText > asTeaching, 'dose cards must rank above teaching items');
});

test('normalize strips diacritics, punctuation and case without touching Arabic', () => {
    assert.equal(core.normalize('  Epinephrine  '), 'epinephrine');
    assert.equal(core.normalize('SpO₂ <94%'), 'spo 94');
    assert.equal(core.normalize('أدرينالين'), 'أدرينالين');
});

test('editDistance is bounded and correct for the failing cases', () => {
    assert.equal(core.editDistance('rocuronium', 'rocuronium', 2), 0);
    assert.equal(core.editDistance('anaphylxis', 'anaphylaxis', 2), 1);
    assert.ok(core.editDistance('xxxx', 'yyyyyyyy', 2) > 2);
});

test('bounded fuzzy caches retain matching semantics across eviction and repeated words',()=>{
 for(let i=0;i<4300;i++){
  const needle='term'+i,word='term'+(i+1),max=needle.length>=6?2:1;
  assert.equal(core.fuzzyContainsWord(word,needle),core.editDistance(needle,word,max)<=max);
 }
 assert.equal(core.fuzzyContainsWord('dysnpnea dyspnea','dyspnea'),true);
 assert.equal(core.fuzzyContainsWord('outpatient','tpa'),false);
});

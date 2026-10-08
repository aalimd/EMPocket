'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
function load() {
    const context = vm.createContext({window:{},severityFilter:'all',patientFilter:'all',librarySystem:'all'});
    vm.runInContext(fs.readFileSync(path.join(root,'assets/data.js'),'utf8'),context);
    vm.runInContext('const DATA = window.CP_DATA;\n' + src.slice(src.indexOf('    const GROUPS = ['),src.indexOf('    const RELATED = {')),context);
    vm.runInContext(src.slice(src.indexOf('    const PATIENT_CONTEXTS = {'),src.indexOf('    function esc(')),context);
    for (const name of ['cpMatchesFilter','patientMatches','libraryItems']) {
        const start=src.indexOf('\n    function '+name+'(');
        const end=src.indexOf('\n    function ',start+1);
        vm.runInContext(src.slice(start,end),context);
    }
    return context;
}
test('the unfiltered library exposes every shipped presentation once',()=>{
    const c=load();
    assert.deepEqual(Array.from(c.libraryItems(),cp=>cp.id),Array.from(c.window.CP_DATA,cp=>cp.id));
    assert.equal(new Set(c.libraryItems().map(cp=>cp.id)).size,45);
});
test('clinical system filters cover the library without losing or duplicating topics',()=>{
    const c=load(),groups=vm.runInContext('GROUPS',c),seen=[];
    for(const g of groups){
        c.librarySystem=g.title;
        const ids=Array.from(c.libraryItems(),cp=>cp.id);
        assert.deepEqual(ids.slice().sort(),Array.from(g.ids).sort(),g.title);
        seen.push(...ids);
    }
    assert.equal(seen.length,45);
    assert.equal(new Set(seen).size,45);
});
test('system and patient context narrow results together, including an empty intersection',()=>{
    const c=load(); c.librarySystem='Neurologic'; c.patientFilter='pregnancy';
    assert.deepEqual(Array.from(c.libraryItems(),cp=>cp.id),['headache']);
    c.librarySystem='Trauma, pregnancy & older adults';c.patientFilter='pediatric';
    assert.equal(c.libraryItems().length,0);
    c.librarySystem=c.patientFilter=c.severityFilter='all';
    assert.equal(c.libraryItems().length,45);
});
test('severity filtering preserves relevant diagnoses and does not mutate the clinical records',()=>{
    const c=load(),before=JSON.stringify(c.window.CP_DATA);
    c.librarySystem='Cardiorespiratory & vascular';c.patientFilter='pregnancy';
    for(const severity of ['critical','emergent','common']){
        c.severityFilter=severity;
        const results=c.libraryItems();
        assert.ok(results.length>0,severity);
        for(const cp of results){assert.ok(['chest-pain','dyspnea'].includes(cp.id));assert.ok(cp.dontMiss.some(d=>d[1]===severity));}
    }
    assert.equal(JSON.stringify(c.window.CP_DATA),before);
});

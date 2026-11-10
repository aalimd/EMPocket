'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{}};vm.createContext(ctx);
for(const file of ['data','search-core','search-index'])vm.runInContext(fs.readFileSync('assets/'+file+'.js','utf8'),ctx);
const data=ctx.window.CP_DATA,ecg=ctx.window.ECG_DATA;
const entries=ctx.window.EM_SEARCH_INDEX.buildSearchIndex(data,ecg,{byId:Object.fromEntries(data.map(c=>[c.id,c]))});
test('every published dose line is searchable with its condition and scope intact',()=>{
 for(const cp of data)for(const group of cp.doses||[])for(const line of group[1]){
  const hit=entries.find(h=>h.cpId===cp.id&&h.target==='doses'&&h.title===line);
  assert.ok(hit,cp.id+': '+line);
  assert.ok(hit.sub.includes(cp.name));
  if(cp.doseScope)assert.ok(hit.sub.includes(cp.doseScope));
 }
});
test('the detailed ECG teaching and pattern actions are indexed at their real targets',()=>{
 for(const step of ecg.steps)assert.equal(entries.filter(h=>h.target==='step-'+step.id&&h.kind==='ECG detail').length,step.details.length,step.id);
 for(const p of ecg.patterns)if(p.action)assert.ok(entries.some(h=>h.cpId==='ecg'&&h.target===p.id&&h.kind==='ECG action'),p.id);
});
test('stripping presentation markup must preserve clinical less-than and greater-than comparisons',()=>{
 const source=fs.readFileSync('assets/app.js','utf8'),start=source.indexOf('    function stripTags('),end=source.indexOf('\n    function ',start+1);
 const c={};vm.runInNewContext(source.slice(start,end)+'this.strip=stripTags;',c);
 assert.equal(c.strip('<strong>Risk:</strong> QRS <100 ms or >160 ms'),'Risk: QRS <100 ms or >160 ms');
});
test('ASCII searches find subscript-formatted clinical notation',()=>{
 const core=ctx.window.SEARCH_CORE,engine=core.createIndex([{title:'SpO₂ and PaCO₂',sub:'HCO₃ bicarbonate'}]);
 assert.equal(engine.search('spo2').length,1);assert.equal(engine.search('paco2').length,1);assert.equal(engine.search('hco3').length,1);
});

test('search highlighting preserves subscript notation and escapes the displayed text',()=>{
 const source=fs.readFileSync('assets/app.js','utf8'),context={};vm.createContext(context);
 for(const name of ['esc','highlightMatch']){
  const start=source.indexOf('    function '+name+'('),end=source.indexOf('\n    function ',start+1);
  vm.runInContext(source.slice(start,end),context);
 }
 assert.equal(context.highlightMatch('SpO₂','spo2'),'<mark>SpO₂</mark>');
 assert.equal(context.highlightMatch('SpO2','spo₂'),'<mark>SpO2</mark>');
 assert.ok(!context.highlightMatch('<img src=x> SpO₂','spo2').includes('<img'));
});

'use strict';
// Guard selected clinical distinctions, provenance and searchable destinations.
// Automated checks do not establish clinical validity.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{}};vm.createContext(c);
for(const name of ['data','evidence','search-core','search-index'])vm.runInContext(fs.readFileSync('assets/'+name+'.js','utf8'),c);
const topics=c.window.CP_DATA,evidence=c.window.CLINICAL_EVIDENCE;
const text=id=>JSON.stringify(topics.find(t=>t.id===id));
test('selected review records distinguish the new scope from the historical audit',()=>{
 assert.equal(evidence.checked,'2026-10-08');
 const ids=['chest-pain','dyspnea','abdominal-pain','headache','ams','syncope','fever','dizziness'];
 assert.deepEqual(Object.keys(evidence.topicReviews).sort(),ids.sort());
 for(const id of ids){
  const r=evidence.topicReviews[id];assert.equal(r.checked,'2026-11-10');assert.ok(r.scope.length>15);
  assert.ok(r.sources.length);for(const key of r.sources){assert.ok(evidence.topics[id].includes(key),id+': '+key);assert.ok(evidence.sources[key]);}
 }
});
test('headache distinguishes the AHA LP recommendation from the ACEP alternative pathway',()=>{
 const t=topics.find(t=>t.id==='headache');
 assert.match(t.approach.join(' '),/AHA\/ASA 2023 recommends CT then LP if negative/);
 assert.match(t.approach.join(' '),/ACEP permits LP or CTA/);
 assert.match(t.pearls.join(' '),/does not directly test for subarachnoid blood/);
 assert.doesNotMatch(text('headache'),/still perform LP after a late negative CT|>6 h requires LP or CTA/);
 assert.ok(evidence.topicReviews.headache.sources.includes('sah'));
});
test('testing guidance specifies mesenteric CTA and preserves limits on neurological tests',()=>{
 assert.match(text('abdominal-pain'),/urgent CTA with an arterial-phase protocol/);
 assert.doesNotMatch(text('abdominal-pain'),/Medical mimics last/);
 assert.match(text('syncope'),/without relevant focal neurological findings, head injury or seizure features/);
 assert.match(text('dizziness'),/Central or equivocal HINTS findings require MRI\/MRA/);
 assert.match(text('ams'),/in critical care use CAM-ICU or ICDSC/);
});
test('new teaching is indexed at its authored topic and section',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA,{byId:Object.fromEntries(topics.map(t=>[t.id,t]))});
 for(const [id,target,phrase] of [['chest-pain','history','previous testing informs risk'],['dyspnea','pearls-pitfalls','NIV requires a suitable patient'],['abdominal-pain','workup','arterial-phase protocol'],['headache','pearls-pitfalls','does not directly test'],['ams','exam','hypoactive delirium'],['syncope','workup','Do not routinely request'],['fever','how-to-think','source control'],['dizziness','history','asymptomatic baseline']]){
  assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id+' '+target);
 }
});
test('references display a scoped addition date without relabelling unreviewed topics',()=>{
 const source=fs.readFileSync('assets/app.js','utf8');
 for(const name of ['esc','evidenceHtml']){const start=source.indexOf('    function '+name+'('),end=source.indexOf('\n    function ',start+1);vm.runInContext(source.slice(start,end),c);}
 assert.match(c.evidenceHtml('headache'),/Selected additions checked 2026-11-10/);
 assert.match(c.evidenceHtml('headache'),/This date applies only to these additions/);
 assert.doesNotMatch(c.evidenceHtml('weakness'),/Selected additions checked/);
});

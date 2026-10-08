'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function load(){const saved=new Map(),calls=[];let failAt=Infinity,writes=0,blocked=false;const storage={getItem(k){calls.push(k);if(blocked)throw Error('blocked');return saved.get(k)??null;},setItem(k,v){calls.push(k);if(blocked||++writes===failAt)throw Error('quota');saved.set(k,v);},removeItem(k){saved.delete(k);}};const ctx={window:{},localStorage:storage};vm.createContext(ctx);for(const file of ['em-learning-data.js','em-learning.js'])vm.runInContext(fs.readFileSync('assets/'+file,'utf8'),ctx);return {api:ctx.window.EM_LEARNING,data:ctx.window.EM_LEARNING_DATA,saved,calls,block(){blocked=true;},fail(n){failAt=n;writes=0;}};}
const backup=values=>({app:'EM Pocket free',version:1,values});
test('six evolving cases have sequential updates, unique choices and explained outcomes',()=>{const {data}=load();assert.equal(data.cases.length,6);assert.equal(new Set(data.cases.map(c=>c.domain)).size,6);for(const c of data.cases){assert.ok(data.sources[c.source]);assert.equal(c.steps.length,3);assert.equal(c.debrief.length,3);for(const q of c.steps){assert.equal(q.options.filter(o=>o.correct).length,1);assert.equal(new Set(q.options.map(o=>o.id)).size,3);assert.ok(q.options.every(o=>o.why.length>25));assert.ok(q.update.length>10);}}});
test('progress separates latest scored attempts from reading and survives storage failure',()=>{const {api,block}=load();const p=api.progress();p.cases.resus={correct:2,total:3,runs:1,last:123};p.viewed=['abg'];block();assert.equal(api.saveProgress(p),false);assert.equal(api.progress().cases.resus.correct,2);assert.equal(api.progress().viewed[0],'abg');assert.equal(Object.keys(api.normalizeProgress({cases:{fake:{correct:99}},viewed:['fake']} ).cases).length,0);});
test('backup reads only explicit free learning keys and excludes agreements',()=>{const {api,saved,calls}=load();saved.set('unrelated-data','private');saved.set('em-cps-disclaimer-agreed','123');saved.set('em-cps-learning',JSON.stringify({notes:{'chest-pain':'My learning note'},saved:{},reviewed:{},reviewPlan:{}}));const data=api.exportBackup();assert.equal(data.values['em-cps-learning'].notes['chest-pain'],'My learning note');assert.ok(calls.every(k=>api.backupKeys.includes(k)));assert.equal(Object.keys(data.values).length,1);});
test('import merges missing records without replacing existing notes or clearing arrays',()=>{const {api,saved}=load();saved.set('em-cps-learning',JSON.stringify({notes:{'chest-pain':'Current'},saved:{},reviewed:{},reviewPlan:{}}));saved.set('em-ecg-practice-v1','["normal"]');api.importBackup(backup({'em-cps-learning':{notes:{'chest-pain':'Older','shock':'New'},saved:{},reviewed:{},reviewPlan:{}},'em-ecg-practice-v1':['af']}));assert.equal(JSON.parse(saved.get('em-cps-learning')).notes['chest-pain'],'Current');assert.equal(JSON.parse(saved.get('em-cps-learning')).notes.shock,'New');assert.deepEqual(JSON.parse(saved.get('em-ecg-practice-v1')),['normal','af']);});
test('failed multi-key imports restore the original stored data',()=>{const {api,saved,fail}=load();saved.set('em-cps-learning',JSON.stringify({notes:{},saved:{},reviewed:{},reviewPlan:{}}));const before=new Map(saved);fail(2);assert.throws(()=>api.importBackup(backup({'em-cps-learning':{notes:{shock:'New'},saved:{},reviewed:{},reviewPlan:{}},'em-ecg-practice-v1':['af']})),/restored/);assert.deepEqual(saved,before);});
test('untrusted backups reject unsupported keys, dangerous properties and invalid state before writes',()=>{const {api,saved}=load();for(const values of [{'unrelated-data':{}},{'em-cps-disclaimer-agreed':'yes'},{'em-cps-learning':{notes:{shock:{html:'bad'}}}},{'em-cps-prefs':{scale:50}},{'em-student-progress':{ratings:{x:null}}},{'em-workspace-progress-v1':{cases:{resus:{correct:5,total:3,runs:1,last:10}},viewed:[]}}])assert.throws(()=>api.importBackup(backup(values)));assert.throws(()=>api.validateBackup('{"app":"EM Pocket free","version":1,"values":{"__proto__":{}}}'));assert.throws(()=>api.validateBackup('x'.repeat(2000001)));assert.equal(saved.size,0);});
test('all visual/module entries and search routes have supporting metadata',()=>{const {api,data}=load();assert.equal(api.visuals.length,5);assert.equal(data.modules.length,6);for(const m of data.modules){assert.ok(data.sources[m.source]);assert.equal(m.sections.length,3);}for(const item of api.searchItems()){assert.equal(item.cpId,'learn');assert.match(item.target,/^(case-|module-|visual-|progress)/);}});
test('recorded ECGs preserve the source binary signal and calibrated units',()=>{const crypto=require('node:crypto'),ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('assets/ecg-recordings.js','utf8'),ctx);const records=ctx.window.EM_ECG_RECORDINGS;assert.equal(records.length,12);assert.equal(new Set(records.map(r=>r.id)).size,12);for(const r of records){assert.equal(r.sampleRate,500);assert.equal(r.leads.length,12);assert.equal(new Set(r.leads.map(l=>l.name)).size,12);const raw=Buffer.alloc(120000);for(let lead=0;lead<12;lead++){assert.equal(r.leads[lead].uv.length,5000);for(let i=0;i<5000;i++)raw.writeInt16LE(r.leads[lead].uv[i],(i*12+lead)*2);}assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),r.sha256);assert.ok(!('patient_id' in r)&&!('age' in r));}});
test('recording reading progress is included in safe backups and negative dates are rejected',()=>{const {api}=load();const p={cases:{},viewed:['recordings']};assert.equal(api.validateBackup(JSON.stringify(backup({'em-workspace-progress-v1':p}))).values['em-workspace-progress-v1'].viewed[0],'recordings');assert.throws(()=>api.validateBackup(JSON.stringify(backup({'em-workspace-progress-v1':{cases:{resus:{correct:1,total:3,runs:1,last:-1}},viewed:[]}}))));});
test('clinical full pages retain sample times, voltages, calibration and sequential columns',()=>{
 const context={window:{}};vm.createContext(context);
 for(const file of ['ecg-recordings','em-learning-data','em-learning'])vm.runInContext(fs.readFileSync('assets/'+file+'.js','utf8'),context);
 const api=context.window.EM_LEARNING;
 for(const record of context.window.EM_ECG_RECORDINGS){
  const figure=api.recordingFigure(record),paths=[...figure.svg.matchAll(/class="recorded-signal"[^>]*d="([^"]+)"/g)];
  assert.equal(paths.length,13);assert.equal(figure.cells.length,13);assert.equal(figure.uy,40);
  paths.forEach((path,j)=>{
   const cell=figure.cells[j],lead=record.leads.find(l=>l.name===cell.lead);
   const points=[...path[1].matchAll(/[ML]([\d.]+) (-?[\d.]+)/g)];
   const first=Math.round(cell.start*500);
   for(const i of [0,Math.floor(points.length/2),points.length-1]){
    assert.ok(Math.abs(+points[i][1]-(cell.x+i/5))<.011);
    assert.ok(Math.abs(+points[i][2]-(cell.baseline-lead.uv[first+i]/1000*40))<.011);
   }
   for(const point of points)assert.ok(+point[1]>=0&&+point[1]<=figure.width&&+point[2]>=0&&+point[2]<=figure.height);
  });
  const half=api.recordingFigure(record,{gain:5});assert.equal(half.uy,20);assert.match(half.svg,/5 mm\/mV/);
  const single=api.recordingFigure(record,{view:'lead',lead:6,start:6});assert.equal(single.cells.length,1);assert.equal(single.cells[0].lead,'V1');assert.equal(single.cells[0].start,6);assert.equal(single.cells[0].seconds,4);
  assert.notEqual(figure.svg.match(/id="([^"]+)"/)[1],half.svg.match(/id="([^"]+)"/)[1]);
 }
});
test('added recordings preserve coexisting source statements and unspecified likelihood',()=>{
 const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync('assets/ecg-recordings.js','utf8'),context);
 const records=context.window.EM_ECG_RECORDINGS;
 const rbbb=records.find(r=>r.id===172);assert.ok(rbbb.sourceStatements.some(s=>s.code==='LAFB'));assert.ok(rbbb.sourceStatements.some(s=>s.code==='SR'&&s.likelihood===null));
 const inferior=records.find(r=>r.id===257);assert.ok(inferior.sourceStatements.some(s=>s.code==='ASMI'&&s.likelihood===50));
});

test('all twelve recordings retain the independently checked source hashes and every clinical statement',()=>{
 const proof=JSON.parse(fs.readFileSync('docs/ECG-SOURCE-VERIFICATION-2026-10-08.json','utf8'));
 const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync('assets/ecg-recordings.js','utf8'),context);
 assert.equal(proof.records.length,12);
 for(const r of context.window.EM_ECG_RECORDINGS){
  const original=proof.records.find(item=>item.id===r.id);assert.ok(original,r.id);
  assert.equal(r.sha256,original.sha256,r.id+' source fingerprint');
  const codes=Object.fromEntries(r.sourceStatements.map(s=>[s.code,s.likelihood??0]));
  assert.deepEqual(codes,original.sourceCodes,r.id+' all source codes and likelihoods');
 }
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const storage=new Map(),ctx={window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};vm.createContext(ctx);
for(const file of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum','ecg-explorer'])vm.runInContext(fs.readFileSync(__dirname+'/../assets/'+file+'.js','utf8'),ctx);
const X=ctx.window.ECG_EXPLORER;
test('normal comparisons match dimensions and stay finite across all supported cases',()=>{
 let supported=0;
 for(const c of X.cases){const item=X.build(c.id,false),ref=X.comparison(c.id);assert.ok(ref,c.id);supported++;
 assert.equal(ref.width,item.width,c.id);assert.equal(ref.height,item.height,c.id);assert.match(ref.note,/72\/min/);assert.doesNotMatch(ref.svg,/NaN|Infinity/);
 for(const p of ref.svg.matchAll(/[ML]([\d.]+),(-?[\d.]+)/g)){assert.ok(+p[1]>=0&&+p[1]<=ref.width,c.id+' x');assert.ok(+p[2]>=0&&+p[2]<=ref.height,c.id+' y');}
 }
 assert.equal(supported,47);
});
test('location practice accepts ellipse interiors and rejects bounding-box corners',()=>{
 const r=[100,200,80,40];assert.equal(X.containsPoint(r,140,220),true);assert.equal(X.containsPoint(r,100,200),false);assert.equal(X.containsPoint(r,90,220),false);
 for(const c of X.cases)for(const f of X.build(c.id,false).findings)for(const [x,y,w,h] of f.targets)assert.equal(X.containsPoint([x,y,w,h],x+w/2,y+h/2),true);
});
test('saved ECG progress rejects unknown IDs, duplicates and invalid selection indices',()=>{
 storage.set('em-ecg-learning-v1',JSON.stringify({last:'bad',finding:-1,completed:['normal','normal','bad'],review:['af:0','af:999','bad:0']}));const p=X.readProgress();assert.equal(p.last,'normal');assert.equal(p.finding,0);assert.equal(p.completed.join(','),'normal');assert.equal(p.review.join(','),'af:0');
 storage.set('em-ecg-learning-v1','broken');assert.equal(X.readProgress().completed.length,0);
});

test('loading every saved finding never renders ECGs or reads paid storage',()=>{
 const review=X.cases.flatMap(c=>X.build(c.id,false).findings.map((_,i)=>c.id+':'+i));
 storage.set('em-ecg-learning-v1',JSON.stringify({review:review.concat(review,'af:0:extra')}));
 storage.set('em-p-ecg-learning-v1',JSON.stringify({last:'af'}));
 const engine=ctx.window.ECG_ENGINE,curriculum=ctx.window.ECG_CURRICULUM;
 const render=engine.render12Lead,build=curriculum.build;
 engine.render12Lead=curriculum.build=()=>{throw Error('Must not render while restoring progress');};
 try{const progress=X.readProgress();assert.equal(progress.review.length,review.length);assert.equal(progress.last,'normal');}
 finally{engine.render12Lead=render;curriculum.build=build;}
});

test('optional learning stages cover every case exactly once and start with normal',()=>{
 const ids=X.pathways.flatMap(p=>p.ids);
 assert.equal(ids[0],'normal');assert.equal(new Set(ids).size,X.cases.length);assert.equal(ids.length,X.cases.length);
 for(const p of X.pathways){assert.ok(p.ids.length);assert.ok(p.objective.length>30);assert.ok(p.prior);for(const id of p.ids)assert.ok(X.cases.some(c=>c.id===id));}
});
test('mixed practice prioritizes cases without an attempt and never repeats the current case immediately',()=>{
 const all=X.cases.map(c=>c.id),pending=all[all.length-1];
 for(const seed of [0,.3,.999]){
  assert.equal(X.nextPractice(all.filter(id=>id!==pending),'normal',()=>seed),pending);
  assert.notEqual(X.nextPractice(all,'normal',()=>seed),'normal');
  assert.notEqual(X.nextPractice([],'normal',()=>seed),'normal');
 }
});
test('practice attempt history validates input independently of existing completion progress',()=>{
 const prior=storage.get('em-ecg-learning-v1');
 for(const [raw,expected]of [['broken',''],['null',''],['{}',''],[JSON.stringify(['normal','normal','bad',null,{},'af']),'normal,af']]){
  storage.set('em-ecg-practice-v1',raw);assert.equal(X.readPractice().join(','),expected);
 }
 assert.equal(storage.get('em-ecg-learning-v1'),prior);
});

test('unavailable practice storage retains validated session attempts across fresh reads and recovers',()=>{
 const setItem=ctx.localStorage.setItem,prior=storage.get('em-ecg-practice-v1');
 try{
  storage.set('em-ecg-practice-v1','[]');
  ctx.localStorage.setItem=()=>{throw Error('storage unavailable');};
  assert.equal(X.savePractice(['normal','normal','af','unknown']),false);
  assert.equal(X.readPractice().join(','),'normal,af');
  X.readPractice().push('vf');assert.equal(X.readPractice().join(','),'normal,af');
  ctx.localStorage.setItem=setItem;assert.equal(X.savePractice(X.readPractice()),true);
  assert.equal(JSON.parse(storage.get('em-ecg-practice-v1')).join(','),'normal,af');
 }finally{ctx.localStorage.setItem=setItem;X.savePractice([]);if(prior===undefined)storage.delete('em-ecg-practice-v1');else storage.set('em-ecg-practice-v1',prior);}
});

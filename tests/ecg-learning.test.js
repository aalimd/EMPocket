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

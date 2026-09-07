'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{addEventListener(){}}};vm.createContext(context);
for(const file of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets',file+'.js'),'utf8'),context);
const lib=context.window.ECG_SVG;
test('every ECG has its own guided findings and explanatory text',()=>{
 assert.equal(Object.keys(lib).length,27);
 for(const [id,entry] of Object.entries(lib)) {
  assert.ok(entry.findings.length>=2,id);
  assert.equal(new Set(entry.findings.map(f=>f.title)).size,entry.findings.length,id);
  for(const f of entry.findings){assert.ok(f.title && f.explanation.length>40,id);assert.ok(f.targets || (f.leads.length && f.segment),id);}
 }
});
test('all static red-circle targets lie inside their own source SVG',()=>{
 for(const [id,entry] of Object.entries(lib)){
  const [, ,width,height]=entry.svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  for(const f of entry.findings)for(const [x,y,w,h] of f.targets||[]){
   assert.ok([x,y,w,h].every(Number.isFinite) && w>0 && h>0,id+' '+f.title);
   assert.ok(x>=0 && y>=0 && x+w<=width && y+h<=height,id+' '+f.title);
  }
 }
});
test('each dynamic lead can be explained, including the step-seven alias',()=>{
 for(const [id,entry] of Object.entries(lib)){
  const model=lib[entry.viewerAlias]||entry;if(!model.traceSpec)continue;
  const lanes=id==='wellens'?['V2','V3']:model.traceSpec.lanes;
  for(const lane of lanes)assert.ok(entry.findings.some(f=>f.leads.includes(lane)),id+' '+lane);
 }
 assert.equal(lib['toxic-metabolic-mimics'].viewerAlias,'hyperkalemia');
});

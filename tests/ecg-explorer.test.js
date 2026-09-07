'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const context={window:{addEventListener(){}}};vm.createContext(context);
for(const name of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum','ecg-explorer'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets',name+'.js'),'utf8'),context);
const {ECG_ENGINE:E,ECG_EXPLORER:X,ECG_SVG:lib}=context.window;
const signals=svg=>[...svg.matchAll(/<path d="([^"]+)" fill="none" stroke="#111111" stroke-width="4"/g)].map(m=>m[1]).filter(d=>d.includes(' L'));
test('all existing ECGs use pink SVG paper, with decorative grids labeled honestly',()=>{
 for(const [id,entry] of Object.entries(lib)){
  assert.match(entry.svg,/<pattern/,id);assert.match(entry.svg,/#fff1f2/,id);
  if(entry.svg.includes('ecg-decorative-paper'))assert.match(entry.caption,/grid is decorative/,id);
 }
});
test('Explorer preserves the normal 12-lead signal and all four original findings',()=>{
 const item=X.build('normal',false);
 assert.deepEqual(signals(item.svg),signals(E.renderNormal12Lead({noise:{disabled:true}}).svg));
 assert.equal(item.findings.length,11);
 assert.deepEqual(JSON.parse(JSON.stringify(item.findings.slice(0,4))),JSON.parse(JSON.stringify(lib['normal-12lead'].findings)));
 assert.equal(Object.keys(lib).length,27,'Explorer must not mutate the existing figure inventory');
});
test('each Explorer diagnosis has thirteen matching signal paths and bounded findings',()=>{
 const seen=new Set();
 for(const record of X.cases.filter(c=>!c.library&&!c.kind)){
  const item=X.build(record.id,false),paths=signals(item.svg);assert.equal(paths.length,13,record.id);
  const metrics=E.layoutMetrics();
  paths.forEach((d,i)=>{const row=i<12?Math.floor(i/4):3;const top=row<3?metrics.marT+row*(metrics.rowH+metrics.gapY):metrics.marT+3*metrics.rowH+2*metrics.gapY+metrics.rhyGap;const height=row<3?metrics.rowH:metrics.rhyH;for(const point of d.matchAll(/[ML]([\d.]+),(-?[\d.]+)/g)){const y=Number(point[2]);assert.ok(y>=top+34 && y<=top+height,record.id+' signal exceeds its lead lane');}});
  const fingerprint=paths.join('');assert.ok(!seen.has(fingerprint),record.id+' reused another ECG');seen.add(fingerprint);
  assert.ok(!/NaN|Infinity|null ms/.test(item.svg),record.id);
  for(const finding of item.findings)for(const [x,y,w,h]of finding.targets)assert.ok([x,y,w,h].every(Number.isFinite)&&x>=0&&y>=0&&w>0&&h>0&&x+w<=item.width&&y+h<=item.height,record.id+' '+finding.title);
 }
});
test('practice SVGs do not reveal diagnosis names or interpretation labels',()=>{
 for(const record of X.cases){const item=X.build(record.id,true);assert.doesNotMatch(item.svg,/Normal sinus|atrial fibrillation|STEMI|Wellens|Winter|per minute with normal|\/min regular/i);assert.match(item.svg,/Practice ECG/);}
});
test('full-paper renderer rejects focused-only models',()=>{
 for(const id of ['vt-vs-svt','complete-heart-block'])assert.throws(()=>E.render12Lead({caseData:E.createPatternCase(id,{})}),/focused leads only/);
});
test('expanded curriculum has unique cases, nonempty bounded targets and honest formats',()=>{
 const ids=new Set();assert.ok(X.cases.length>=40);
 for(const record of X.cases){
  assert.ok(!ids.has(record.id),record.id);ids.add(record.id);
  const item=X.build(record.id,false);assert.ok(item.findings.length>=2,record.id);assert.ok(item.format&&item.caption&&item.scale,record.id);
  for(const f of item.findings){assert.ok(f.explanation.length>30,record.id);assert.ok(f.targets.length,record.id+' '+f.title);for(const [x,y,w,h]of f.targets)assert.ok([x,y,w,h].every(Number.isFinite)&&x>=0&&y>=0&&w>0&&h>0&&x+w<=item.width&&y+h<=item.height,record.id+' '+f.title);}
  const hidden=X.build(record.id,true);assert.ok(!hidden.svg.includes(record.name),record.id+' practice leak');assert.ok(!/NaN|Infinity/.test(item.svg),record.id);
 }
});
test('new strip rhythms have the authored conduction relationships and readable signal bounds',()=>{
 const C=context.window.ECG_CURRICULUM;
 for(const record of C.cases.filter(c=>c.kind)){
  const d=C.stripData(record.kind);for(let lane=0;lane<d.lanes.length;lane++)for(let t=0;t<=6000;t+=2)assert.ok(Math.abs(C.voltage(t,d,lane))<=1.6,record.id+' waveform clipping');
 }
 const one=C.stripData('mobitz1'),two=C.stripData('mobitz2'),pair=C.stripData('twoone');
 assert.deepEqual(Array.from(one.beats.slice(0,4),b=>b.pr),[160,220,280,160]);
 assert.ok(two.beats.every(b=>b.pr===180));assert.equal(pair.p.length,2*pair.beats.length);
 assert.equal(C.stripData('first').beats[0].on-C.stripData('first').p[0].on,280);
 assert.equal(C.stripData('longqt').beats[0].qt,540);
 const pvc=C.stripData('pvc');assert.equal(pvc.beats[3].on-pvc.beats[1].on,1600);assert.ok(pvc.beats[2].ectopic);
 assert.ok(X.cases.find(c=>c.id==='pea').stem.includes('no palpable pulse'));
});
test('new infarction examples preserve limb voltage identities and territorial ST direction',()=>{
 const anterior=X.build('anterior-stemi',false).data,lateral=X.build('lateral-stemi',false).data;
 assert.ok(anterior.leadOverrides.V2.stMv>=.25&&anterior.leadOverrides.V3.stMv>=.25);
 for(let t=0;t<1000;t+=2){const v=l=>E.leadVoltageAt(l,t,lateral,t/2);assert.ok(Math.abs(v('II')-v('I')-v('III'))<1e-9);assert.ok(Math.abs(v('aVL')-(v('I')-v('II')/2))<1e-9);}
 assert.ok(lateral.leadOverrides.I.stMv>0&&lateral.leadOverrides.III.stMv<0);
});
test('practice keeps anatomical lead labels while removing teaching answers',()=>{
 for(const id of ['rbbb','lbbb','brugada']){
  const svg=X.build(id,true).svg;assert.match(svg,/>V1<\/text>/,id);
 }
 assert.match(X.build('pea',true).svg,/>II<\/text>/);
 assert.doesNotMatch(X.build('hyperkalemia',true).svg,/peaked T|wide QRS|sine wave/);
});

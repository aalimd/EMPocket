'use strict';
// Tests measure emitted signals and cross-view integration; they do not certify clinical validity.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{addEventListener(){}}};vm.createContext(ctx);
for(const file of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum','ecg-explorer'])vm.runInContext(fs.readFileSync(__dirname+'/../assets/'+file+'.js','utf8'),ctx);
const {ECG_CURRICULUM:C,ECG_EXPLORER:X,ECG_SVG:lib}=ctx.window;
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-7,`${actual} != ${expected}`);
const sample=(kind,lead,dt,n=0)=>{const d=C.stripData(kind);return C.voltage(d.beats[n].on+dt,d,d.lanes.indexOf(lead));};
test('all nine former schematic diagnoses share calibrated drawings and findings across guide and Explorer',()=>{
 const records=C.cases.filter(c=>c.sharedLibrary);assert.equal(records.length,9);
 for(const c of records){const v=X.build(c.id,false),g=lib[c.id];assert.match(g.figureLabel,/Calibrated/);assert.match(g.caption,/synthetic|Synthetic/);assert.doesNotMatch(g.svg,/decorative|NOT TO SCALE/);assert.deepEqual(JSON.parse(JSON.stringify(g.findings)),JSON.parse(JSON.stringify(v.findings)));assert.match(g.svg,/1 mV \/ 200 ms/);}
});
test('Brugada coved ST meets its stated J amplitudes and descends into inverted T',()=>{
 near(sample('brugada1','V1',110),.3);near(sample('brugada1','V2',110),.25);
 for(const lead of ['V1','V2']){let last=sample('brugada1',lead,110);for(let t=112;t<=344;t+=2){const v=sample('brugada1',lead,t);assert.ok(v<=last+.00001);last=v;}assert.ok(last<-.2);}
});
test('hypokalemia separates QT from QU; calcium examples change ST duration',()=>{
 near(sample('lowk','V3',380),0);near(sample('lowk','V3',400),0);near(sample('lowk','V3',500),.22);near(sample('lowk','V3',620),0);
 assert.ok(sample('lowk','V3',120)<0);
 const low=C.stripData('lowca'),high=C.stripData('highca');assert.equal(low.beats[0].qt,540);assert.equal(high.beats[0].qt,280);
 near(sample('lowca','II',300),0);assert.ok(sample('highca','II',190)>.25);
 near(sample('lowca','II',540),0);near(sample('highca','II',280),0);
});
test('PR depression uses TP baseline and has reciprocal aVR direction',()=>{
 near(sample('pericarditis','II',-20),-.04);near(sample('pericarditis','aVR',-20),.04);
 near(sample('pericarditis','II',-250),0);near(sample('pericarditis','II',90),.15);near(sample('pericarditis','aVR',90),-.15);
});
test('simultaneous frontal leads obey voltage identities throughout the new modeled cycles',()=>{
 for(const kind of ['diffuse','rvstrain','pericarditis']){
  const d=C.stripData(kind),v=(lead,t)=>C.voltage(t,d,d.lanes.indexOf(lead));
  for(let t=0;t<6000;t+=7){if(kind!=='pericarditis')near(v('II',t),v('I',t)+v('III',t));if(kind!=='rvstrain')near(v('aVR',t),-(v('I',t)+v('II',t))/2);if(kind==='diffuse'){near(v('aVL',t),v('I',t)-v('II',t)/2);near(v('aVF',t),v('II',t)-v('I',t)/2);}}
 }
});
test('pre-excitation, toxic terminal R, hypothermia and alternans have the displayed measurements',()=>{
 const wpw=C.stripData('preexcitation');assert.equal(wpw.beats[0].on-wpw.p[0].on,100);assert.equal(wpw.beats[0].qrs,140);near(sample('preexcitation','II',40),.22);
 const tox=C.stripData('sodiumblock');assert.equal(tox.beats[0].qrs,160);near(sample('sodiumblock','aVR',65),-.5);near(sample('sodiumblock','aVR',130),.4);
 const cold=C.stripData('cold');assert.equal(cold.beats[1].on-cold.beats[0].on,1500);assert.equal(cold.beats[0].pr,240);assert.equal(cold.beats[0].qt,560);near(sample('cold','V5',145),.22);
 near(sample('alternans','II',36,0)/sample('alternans','II',36,1),.32/.18);
});
test('pre-excited AF has fast irregular intervals, variable QRS and no organized atrial train',()=>{
 const d=C.stripData('preaf'),rr=Array.from(d.beats.slice(1),(b,i)=>b.on-d.beats[i].on);
 assert.equal(d.p.length,0);assert.equal(d.rate,null);assert.equal(Math.min(...rr),220);assert.equal(Math.max(...rr),390);assert.ok(new Set(d.beats.map(b=>b.qrs)).size>=4);
 for(const b of d.beats)assert.ok(b.qt>b.qrs,'T end follows QRS end');
 assert.match(X.build('preexcited-af',false).findings[2].explanation,/IV amiodarone/);
});
test('highlights bound the sampled waveform tightly without crossing adjacent lanes',()=>{
 for(const c of C.cases.filter(c=>c.kind)){
  const item=X.build(c.id,false),d=item.data;
  for(const f of item.findings)for(const [x,y,w,h] of f.targets){assert.ok(h<260,c.id+' overly tall finding');const lane=Math.round((y+h/2-210)/270);assert.ok(lane>=0&&lane<d.lanes.length);assert.ok(y>=70+lane*270&&y+h<=335+lane*270,c.id+' lane bounds');
   const a=Math.max(0,(x+4-80)/.2),b=Math.min(6000,(x+w-4-80)/.2);
   for(let t=a;t<=b;t+=2){const py=210+lane*270-C.voltage(t,d,lane)*80;assert.ok(py>=y&&py<=y+h,c.id+' waveform outside finding');}
  }
 }
});
test('posterior panels display the complete contiguous V7–V9 set at their stated J heights',()=>{
 const E=ctx.window.ECG_ENGINE,c=E.createPatternCase('posterior-omi',{noise:{disabled:true}}),q=c.beatTimes[2];
 for(const [lead,mv]of [['V7',.10],['V8',.08],['V9',.06]]){assert.ok(lib['posterior-omi'].traceSpec.lanes.includes(lead));assert.ok(Math.abs(E.leadVoltageAt(lead,q+c.qrsMs,c)-mv)<.002);assert.ok(lib['posterior-omi'].findings.some(f=>f.leads.includes(lead)));}
});
test('Sgarbossa uses broad notched lateral LBBB morphology and preserves criterion polarity',()=>{
 const E=ctx.window.ECG_ENGINE,c=E.createPatternCase('sgarbossa',{noise:{disabled:true}}),q=c.beatTimes[2],v=(lead,t)=>E.leadVoltageAt(lead,q+t,c);
 assert.ok(v('V5',45)>v('V5',75)+.15);assert.ok(v('V5',110)>v('V5',75)+.1);
 assert.ok(v('V1',87)<-.8);assert.ok(v('V5',150)>=.1);assert.ok(v('V3',150)<=-.1);assert.ok(v('V1',150)/v('V1',87)<=-.25);
});
test('every Explorer case has a source and new clinical distinctions remain explicit',()=>{
 for(const c of X.cases)assert.ok(C.sources[c.source],c.id+' missing evidence link');
 vm.runInContext(fs.readFileSync(__dirname+'/../assets/data.js','utf8'),ctx);
 const cards=ctx.window.ECG_DATA.patterns;
 assert.doesNotMatch(JSON.stringify(cards.find(c=>c.id==='electrical-alternans')),/is tamponade until echo|specific but insensitive/);
 assert.match(JSON.stringify(cards.find(c=>c.id==='pericarditis-ber')),/neither feature alone excludes ACS/);
});
test('focused ischemia panel ST highlights exclude the unrelated QRS peak',()=>{
 for(const id of ['sgarbossa','posterior-omi']){
  const item=X.build(id,false);for(const f of item.findings.filter(f=>/elevation|depression/i.test(f.title)))for(const r of f.targets)assert.ok(r[3]<80,id+' ST highlight includes the full lead lane');
 }
});

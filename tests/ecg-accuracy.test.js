'use strict';
// Signal invariants and measurement regressions, not clinical certification.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{addEventListener(){}}};vm.createContext(ctx);
for(const name of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum','ecg-explorer'])vm.runInContext(fs.readFileSync(__dirname+'/../assets/'+name+'.js','utf8'),ctx);
const {ECG_ENGINE:E,ECG_CURRICULUM:C,ECG_EXPLORER:X}=ctx.window;
const clean=id=>C.stripData(id);
function identities(v,label){
 for(const [lead,expected]of [['III',v('II')-v('I')],['aVR',-(v('I')+v('II'))/2],['aVL',v('I')-v('II')/2],['aVF',v('II')-v('I')/2]])assert.ok(Math.abs(v(lead)-expected)<1e-9,label+' '+lead);
}
test('de Winter preserves every limb identity throughout QRS, ST and T',()=>{
 const d=E.createPatternCase('dewinter',{noise:{disabled:true}});
 for(let t=0;t<10000;t+=7)identities(l=>E.leadVoltageAt(l,t,d),'de Winter '+t);
 const q=d.beatTimes[2];assert.ok(E.leadVoltageAt('aVR',q+d.qrsMs,d)>.09);
});
test('formerly copied chest leads have independent P, QRS and repolarization',()=>{
 for(const kind of ['lowk','cold','preexcitation','alternans','earlyrep']){
  const d=C.stripData(kind);
  for(let lane=1;lane<d.lanes.length;lane++){
   let qrsDifference=0,repDifference=0;
   for(let t=500;t<=1120;t+=2){const difference=Math.abs(C.voltage(t,d,lane)-C.voltage(t,d,0));if(t<500+d.beats[0].qrs)qrsDifference=Math.max(qrsDifference,difference);else repDifference=Math.max(repDifference,difference);}
   assert.ok(qrsDifference>.03,kind+' independent QRS');
   assert.ok(repDifference>.01,kind+' independent repolarization');
  }
 }
});
test('new full cases preserve limb identities, including electrode reversal',()=>{
 for(const c of C.cases.filter(c=>c.full)){const d=clean(c.kind);for(let t=0;t<1800;t+=11)identities(l=>d.voltageAt(l,t),c.id);}
});
test('axis quadrants and fascicular patterns have the authored QRS polarities',()=>{
 for(const [id,polarity]of [['axis-left',[1,-1,-1]],['axis-right',[-1,1,1]],['axis-extreme',[-1,-1,-1]],['lafb',[1,-1,-1]],['lpfb',[-1,1,1]]]){
  const d=clean(id);for(const [i,l]of ['I','II','aVF'].entries()){let area=0;for(let t=500;t<500+d.qrsMs;t++)area+=d.voltageAt(l,t);assert.equal(Math.sign(area),polarity[i],id+' '+l);}
 }
 const a=clean('lafb'),b=clean('lpfb');
 assert.ok(a.voltageAt('aVL',518)<0&&a.voltageAt('aVL',556)>0);
 assert.ok(b.voltageAt('III',518)<0&&b.voltageAt('III',556)>0);
});
test('pauses, MAT and variable flutter retain their atrial timing distinctions',()=>{
 const pause=clean('sinus-pause');assert.equal(pause.beats[3].on-pause.beats[2].on,2500);assert.ok(pause.p.every(p=>p.on<2300||p.on>4300));
 const mat=clean('mat');assert.equal(new Set(mat.p.map(p=>p.variant)).size,3);assert.equal(new Set(mat.beats.map(b=>b.pr)).size,3);
 const flutter=clean('flutter-variable');assert.equal(flutter.p.length,0);assert.ok(new Set(flutter.beats.slice(1).map((b,i)=>b.on-flutter.beats[i].on)).size>=3);
 for(let t=100;t<300;t+=5)assert.ok(Math.abs(flutter.voltageAt('II',t)-flutter.voltageAt('II',t+200))<1e-9);
});
test('pacing failures show visible stimuli and genuine missing depolarizations',()=>{
 const d=clean('pacing-capture-failure');assert.ok(d.voltageAt('II',2488)>1);assert.equal(d.voltageAt('II',2560),0);assert.equal(d.beats.length,4);
 const u=clean('pacing-undersensing');assert.ok(u.beats.some(b=>b.on===2100&&!b.paced));assert.ok(u.spikes.includes(2486));assert.ok(u.voltageAt('II',2488)>1);
});
test('arm reversal obeys electrode transformation and artifact leaves a clean simultaneous lead',()=>{
 const r=clean('limb-reversal'),normal=C.normalReference(C.cases.find(c=>c.id==='limb-reversal')).data;
 for(let t=0;t<1800;t+=7){assert.ok(Math.abs(r.voltageAt('I',t)+normal.voltageAt('I',t))<1e-9);assert.ok(Math.abs(r.voltageAt('II',t)-normal.voltageAt('III',t))<1e-9);assert.equal(r.voltageAt('V3',t),normal.voltageAt('V3',t));}
 const noisy=clean('artifact-vt');
 assert.ok(Math.abs(noisy.voltageAt('II',3000))>.1);assert.equal(noisy.voltageAt('I',3000),0);
});
test('right-sided J amplitudes and voltage examples use their printed physical gain',()=>{
 const d=clean('rv-infarction');assert.equal(d.voltageAt('V3R',590),.12);assert.ok(Math.abs(d.voltageAt('V4R',590)-.15)<1e-9);
 const lvh=clean('lvh-full');assert.equal(lvh.gain,5);assert.ok(Math.abs(lvh.voltageAt('V1',500+.72*90))+lvh.voltageAt('V5',536)>3.5);
 const figure=X.build('lvh-full',false),ref=X.comparison('lvh-full');assert.match(figure.svg,/5 mm\/mV/);assert.match(ref.svg,/5 mm\/mV/);assert.match(ref.svg,/Normal sinus model at 75/);assert.doesNotMatch(ref.svg,/High precordial voltage/);
 const low=clean('low-voltage-full');for(const l of low.lanes){let min=0,max=0;for(let t=500;t<590;t++){const v=low.voltageAt(l,t);min=Math.min(min,v);max=Math.max(max,v);}assert.ok(max-min<(l.startsWith('V')?1:.5),l);}
});
test('tangent QT measurement tracks the visible terminal limb and does not substitute the nominal parameter',()=>{
 const d=E.createNormalSinusCase({noise:{disabled:true}}),m=E.measureTangentQt(d,'II');
 assert.ok(m.qtMs>340&&m.qtMs<350);assert.notEqual(Math.round(m.qtMs),d.qtMs);assert.ok(Math.abs(m.qtcBazettMs-m.qtMs/Math.sqrt(m.rrMs/1000))<1e-9);
 const flat={...d,voltageAt:()=>0};assert.equal(E.measureTangentQt(flat,'II'),null);assert.equal(E.measureTangentQt(E.createPatternCase('atrial-fibrillation',{noise:{disabled:true}}),'II'),null);
});

test('full-case highlights contain the actual signal in the named lead and gain',()=>{
 for(const record of C.cases.filter(c=>c.full)){
  const item=X.build(record.id,false),d=item.data;
  item.findings.forEach((finding,index)=>finding.targets.forEach((target,j)=>{
   const cell=item.cells.find(c=>c.lead===record.lessons[index].leads[j]),[x,y,w,h]=target;
   assert.ok(y>=cell.y&&y+h<=cell.y+(cell.lead.endsWith('R')?320:E.layoutMetrics().rowH),record.id+' named lead bounds');
   const a=cell.start+(x+4-cell.x)/.2,b=a+(w-8)/.2;
   for(let t=a;t<=b;t+=2){const py=cell.base-d.voltageAt(cell.lead,t)*8*d.gain;assert.ok(py>=y-.01&&py<=y+h+.01,record.id+' measured target');}
  }));
 }
});

test('new case guide links resolve to actual seven-step sections',()=>{
 vm.runInContext(fs.readFileSync(__dirname+'/../assets/data.js','utf8'),ctx);
 const steps=new Set(ctx.window.ECG_DATA.steps.map(s=>s.id));
 for(const record of C.cases.filter(c=>c.core))assert.ok(steps.has(record.guide.replace(/^step-/,'')),record.id+' guide link');
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{addEventListener(){}}};vm.createContext(ctx);
for(const f of ['ecg-svg','ecg-engine','ecg-case-tracings','ecg-interactive','ecg-curriculum','ecg-explorer'])vm.runInContext(fs.readFileSync(__dirname+'/../assets/'+f+'.js','utf8'),ctx);
const {ECG_SVG:lib,ECG_INTERACTIVE:I,ECG_CURRICULUM:C,ECG_EXPLORER:X}=ctx.window;
const plain=x=>JSON.parse(JSON.stringify(x));
function bounds(target,width,height,label){const [x,y,w,h]=target;assert.ok(target.every(Number.isFinite)&&w>0&&h>0,label);assert.ok(x>=0&&y>=0&&x+w<=width+.001&&y+h<=height+.001,label);}
test('every Explorer finding has unique, nonempty, in-bounds marker regions',()=>{
 let findings=0;
 for(const record of X.cases){const item=X.build(record.id,false);for(const f of item.findings){findings++;assert.ok(f.targets.length,record.id+' '+f.title);assert.equal(new Set(f.targets.map(JSON.stringify)).size,f.targets.length,record.id);for(const r of f.targets)bounds(r,item.width,item.height,record.id+' '+f.title);}}
 assert.equal(X.cases.length,47);assert.equal(findings,143);
});
test('every dynamic guide marker stays in its named lane across speed, gain and duration',()=>{
 for(const [id,entry] of Object.entries(lib)){
  if(!entry.traceSpec)continue;
  for(const duration of [1000,3000,10000])for(const speed of [25,50])for(const gain of [5,10,20]){
   const spec=id==='wellens'?{...entry.traceSpec,lanes:['V2','V3']}:entry.traceSpec;
   const d=I.render(spec,{duration,speed,gain,viewer:true});
   for(const f of entry.findings){const targets=I.findingTargets(d,f);if(duration===10000)assert.ok(targets.length,id+' '+f.title);
    for(const r of targets){bounds(r,d.width,d.height,id+' '+f.title);assert.ok(d.rows.some(row=>f.leads.includes(row.lane)&&r[1]>=row.top&&r[1]+r[3]<=row.bottom+.001),id+' wrong lead: '+f.title);}
    for(const row of d.rows){const single={...d,rows:[row]};if(!f.leads.includes(row.lane))assert.equal(I.findingTargets(single,f).length,0,id);}
   }
  }
 }
});
test('Explorer and enlarged viewer use identical dynamic targets for every shared finding',()=>{
 for(const r of C.cases){if(!r.library||!lib[r.library].traceSpec)continue;const entry=lib[r.library],d=I.render(entry.traceSpec,{duration:['vt-vs-svt','complete-heart-block'].includes(r.id)?10000:3000,viewer:true}),item=C.build(r);entry.findings.forEach((f,i)=>assert.deepEqual(plain(item.findings[i].targets),plain(I.findingTargets(d,f)),r.id+' '+f.title));}
});
test('normal R progression covers all six precordial cells',()=>{
 const targets=lib['normal-12lead'].findings[1].targets;
 assert.equal(targets.length,6);
 for(const x of [1176,1708])for(const y of [136,504,872])assert.ok(targets.some(r=>r[0]===x&&r[1]===y&&r[2]===500&&r[3]===320));
});
test('PR marker includes P onset; QT marker includes QRS peak through T end',()=>{
 assert.match(lib['rate-calibration'].svg,/data-wave="pr" data-marker-bounds="334 80 40 50"/);
 const r=lib.intervals.findings.find(f=>f.wave==='qt').targets[0];
 for(const [x,y] of [[152,100],[160,32],[228,100]])assert.ok(x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3]);
 assert.match(lib.intervals.svg,/x="148" y="24" width="84" height="110"/);
});
test('calibration QT circles the actual QRS–T waveform and exposes both interval boundaries',()=>{
 const entry=lib['rate-calibration'],f=entry.findings.find(f=>f.wave==='qt');
 assert.equal(f.targets.length,1);
 const [x,y,w,h]=f.targets[0];
 assert.match(entry.svg,/data-wave="qt" data-marker-bounds="356 20 96 126"/);
 // Assert actual ellipse containment, not merely bounding-box overlap.
 for(const [px,py] of [[370,110],[379,42],[383,124],[425,76],[439,110]])assert.ok(((px-x-w/2)/(w/2))**2+((py-y-h/2)/(h/2))**2<=1,'QT waveform point outside the circle');
 assert.ok(y+h<168,'QT circle must not surround the text label');
 for(const px of [370,439])assert.ok(entry.svg.includes('class="ecg-marker" data-wave="qt" x1="'+px+'" y1="110" x2="'+px+'" y2="170"'),'Missing selected QT boundary');
});

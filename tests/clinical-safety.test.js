'use strict';
// Guard high-risk teaching distinctions across summaries and detailed cards.
// These tests prevent regression; they do not establish clinical validity.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['data','evidence','ecg-svg'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/'+name+'.js'),'utf8'),ctx);
const topics=ctx.window.CP_DATA,ecg=ctx.window.ECG_DATA,ev=ctx.window.CLINICAL_EVIDENCE;
const prose=id=>JSON.stringify(topics.find(c=>c.id===id));
test('all presentations and the ECG course expose explicit supporting sources',()=>{
 assert.equal(topics.length,45);
 for(const id of [...topics.map(c=>c.id),'ecg']){
  assert.ok(ev.topics[id]?.length,id);
  for(const key of ev.topics[id]){assert.equal(ev.sources[key]?.length,2,key);assert.equal(new URL(ev.sources[key][1]).protocol,'https:');}
 }
 assert.equal(ev.checked,'2026-10-08');
});
test('posterior leads and Wellens never claim to establish artery patency',()=>{
 assert.match(prose('chest-pain'),/Negative posterior leads do not exclude occlusion/);
 const text=JSON.stringify(ecg);
 assert.doesNotMatch(text,/until V7–V9 (?:say otherwise|are placed)/);
 assert.match(text,/Wellens often reflects reperfusion/);
 assert.match(text,/negative supplemental leads do not exclude/i);
});
test('sodium-channel-blockade summary and detail both include dosing limits',()=>{
 const summary=ecg.steps.flatMap(s=>s.details).find(s=>s.includes('TCA /'));
 // Locate by content to survive section renaming.
 const all=JSON.stringify(ecg);
 assert.match(all,/do not keep dosing solely to force QRS/i);
 const entries=all.match(/Sodium bicarbonate 1–2 mEq\/kg[^']*/g);
 assert.ok(entries?.length);
 assert.match(summary,/7\.55/);assert.match(summary,/155/);assert.match(summary,/do not keep dosing solely/i);
});
test('a normal CT or synovial test cannot override the separate safety assessment',()=>{
 assert.match(prose('ams'),/normal CT does not make LP safe/);
 assert.match(prose('joint-pain'),/crystals (?:cannot|do not) exclude infection/);
 assert.doesNotMatch(prose('joint-pain'),/until the tap says otherwise|aspiration proves otherwise/);
 assert.match(prose('red-eye'),/after excluding open-globe injury/);
});
test('pregnancy advice uses birth as the PPH TXA clock and does not grade hyperemesis by ketonuria',()=>{
 const bleeding=prose('vaginal-bleeding');
 assert.doesNotMatch(bleeding,/3 h of PPH/);assert.match(bleeding,/3 h of birth/);
 assert.match(prose('nausea-vomiting'),/Ketonuria does not grade severity/);
 assert.match(prose('pelvic-pain'),/single hCG cannot locate a pregnancy/);
});
test('age and timing boundaries are explicit for infant fever, stroke and acetaminophen',()=>{
 assert.match(prose('pediatric-fever'),/61–90 days/);assert.match(prose('pediatric-fever'),/reassessment within 24 h/);
 assert.match(prose('weakness'),/4\.5–9 h/);
 assert.match(prose('overdose'),/spanning <24 h, including multiple doses/);
 assert.doesNotMatch(prose('overdose'),/Staggered, repeated, and unknown-time ingestions are treated empirically/);
});
test('pupil sparing and a suicide screening score cannot determine discharge',()=>{
 assert.match(prose('diplopia'),/Every new acquired CN III palsy needs urgent vascular imaging/);
 assert.match(prose('suicidal'),/do not use scores or low\/medium\/high risk categories/);
 assert.match(prose('limb-ischemia'),/irreversible ALI needs amputation\/source-control planning rather than revascularization/);
});
test('ECG accessibility text uses the same ischemic T-wave threshold as the course',()=>{
 assert.match(JSON.stringify(ecg),/T-wave inversion ≥1 mm/);
 assert.match(JSON.stringify(ctx.window.ECG_SVG),/dynamic TWI ≥1 mm/);
 assert.doesNotMatch(JSON.stringify(ecg),/repeat toward QRS &lt; 100 ms/);
});

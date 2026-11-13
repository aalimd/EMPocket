'use strict';
// Guard high-risk teaching distinctions across summaries and detailed cards.
// These tests prevent regression; they do not establish clinical validity.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['data','evidence','ecg-svg'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/'+name+'.js'),'utf8'),ctx);
const topics=ctx.window.CP_DATA,ecg=ctx.window.ECG_DATA,ev=ctx.window.CLINICAL_EVIDENCE;
const prose=id=>JSON.stringify(topics.find(c=>c.id===id));
test('all presentations and the ECG course expose explicit supporting sources',()=>{
 assert.equal(topics.length,83);
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
test('anaphylaxis IM epinephrine never states a 0.5 mg paediatric maximum and names both standards',()=>{
 /* Audit finding: the topic text said "0.5 mg pediatric max" while Quick said
    otherwise. Both now state the US and UK standards explicitly. */
 const anaph=prose('anaphylaxis');
 assert.doesNotMatch(anaph,/pediatric, max 0\.5 mg/);
 assert.match(anaph,/US practice parameter \(JTFPP\)/);
 assert.match(anaph,/max 0\.3 mg/);
 assert.match(anaph,/RCUK/);
 const app=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
 assert.match(app,/max 0\.3 mg/);
 assert.match(app,/RCUK/);
});
test('meningitis dexamethasone is offered for suspected bacterial meningitis, not only confirmed pneumococcus',()=>{
 for(const id of ['headache','fever']){
  const text=prose(id);
  assert.doesNotMatch(text,/dexamethasone if pneumococcal likely/);
  assert.match(text,/dexamethasone with or before/i);
 }
 assert.match(prose('headache'),/NICE NG240/);
});
test('newly added resuscitation and emergency topics carry verified doses and sources',()=>{
 /* Seven high-yield presentations added for on-shift use. Each must ship a
    structured dose block and name at least one primary source, so a future
    refactor cannot quietly drop the numbers or the citations. */
 const added=['cardiac-arrest','electrolytes','head-injury','hypertensive-emergency','burns','alcohol-withdrawal','thyroid-storm'];
 for(const id of added){
  const cp=topics.find(c=>c.id===id);
  assert.ok(cp,'missing topic '+id);
  assert.ok(Array.isArray(cp.doses)&&cp.doses.length>=2,id+' needs dose groups');
  for(const g of cp.doses){assert.equal(g.length,2,id+' dose group shape');}
  assert.ok(cp.refs.length>=1,id+' needs references');
 }
 assert.match(prose('cardiac-arrest'),/Epinephrine 1 mg IV\/IO every 3–5 min/);
 assert.match(prose('electrolytes'),/insulin 10 units with 25 g glucose/i);
 assert.match(prose('hypertensive-emergency'),/heart rate 60–80 bpm and SBP <120 mmHg/);
 assert.match(prose('burns'),/2 mL\/kg per %TBSA/);
 assert.match(prose('burns'),/Adult burns ≥20% TBSA/);
 assert.match(prose('alcohol-withdrawal'),/Lorazepam 1–2 mg IV/);
 assert.match(prose('thyroid-storm'),/never before/);
});

test('aortic dose guidance in Chest Pain is explicitly scoped and uses perfusion-limited targets',()=>{
 const cp=topics.find(c=>c.id==='chest-pain');
 assert.match(cp.doseScope,/aortic dissection only/);
 assert.match(JSON.stringify(cp.doses),/60–80 bpm/);
 assert.match(JSON.stringify(cp.doses),/adequate end-organ perfusion/);
 assert.ok(ev.topics['chest-pain'].includes('aorta'));
 assert.doesNotMatch(JSON.stringify(cp.doses),/heart rate ≤60|when beta-blockade contraindicated/);
});

test('acetylcysteine protocols and stopping criteria remain distinct', () => {
 const overdose = topics.find(topic => topic.id === 'overdose');
 const [, rows] = overdose.doses.find(([title]) => title.includes('acetylcysteine'));
 const snap = rows.find(line => line.includes('SNAP'));
 assert.match(snap, /100 mg\/kg over 2 h, then 200 mg\/kg over 10 h/);
 assert.doesNotMatch(snap, /100 mg\/kg over 16 h/);
 assert.match(rows.join(' '), /acetaminophen <10 µg\/mL.*INR <2/);
 assert.doesNotMatch(prose('overdose'), /target QRS <100 ms/);
});

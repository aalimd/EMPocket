'use strict';
// Guard selected clinical distinctions, provenance and searchable destinations.
// Automated checks do not establish clinical validity.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{}};vm.createContext(c);
for(const name of ['data','evidence','search-core','search-index'])vm.runInContext(fs.readFileSync('assets/'+name+'.js','utf8'),c);
const topics=c.window.CP_DATA,evidence=c.window.CLINICAL_EVIDENCE;
const text=id=>JSON.stringify(topics.find(t=>t.id===id));
test('selected review records distinguish the new scope from the historical audit',()=>{
 assert.equal(evidence.checked,'2026-10-08');
 const ids=['chest-pain','dyspnea','abdominal-pain','headache','ams','syncope','fever','dizziness','gib','back-pain','joint-pain','pelvic-pain','seizures','overdose','hyperglycemia','flank-pain','red-eye','sore-throat','scrotal-pain','diarrhea','rash','limb-ischemia','urinary-retention','head-injury','pediatric-fever','pediatric-respiratory-distress','anaphylaxis','burns','heat-cold','alcohol-withdrawal','suicidal','constipation'];
 assert.deepEqual(Object.keys(evidence.topicReviews).sort(),ids.sort());
 for(const id of ids){
  const r=evidence.topicReviews[id];assert.equal(r.checked,'2026-11-10');assert.ok(r.scope.length>15);
  assert.ok(r.sources.length);for(const key of r.sources){assert.ok(evidence.topics[id].includes(key),id+': '+key);assert.ok(evidence.sources[key]);}
 }
});
test('headache distinguishes the AHA LP recommendation from the ACEP alternative pathway',()=>{
 const t=topics.find(t=>t.id==='headache');
 assert.match(t.approach.join(' '),/AHA\/ASA 2023 recommends CT then LP if negative/);
 assert.match(t.approach.join(' '),/ACEP permits LP or CTA/);
 assert.match(t.pearls.join(' '),/does not directly test for subarachnoid blood/);
 assert.doesNotMatch(text('headache'),/still perform LP after a late negative CT|>6 h requires LP or CTA/);
 assert.ok(evidence.topicReviews.headache.sources.includes('sah'));
});
test('testing guidance specifies mesenteric CTA and preserves limits on neurological tests',()=>{
 assert.match(text('abdominal-pain'),/urgent CTA with an arterial-phase protocol/);
 assert.doesNotMatch(text('abdominal-pain'),/Medical mimics last/);
 assert.match(text('syncope'),/without relevant focal neurological findings, head injury or seizure features/);
 assert.match(text('dizziness'),/Central or equivocal HINTS findings require MRI\/MRA/);
 assert.match(text('ams'),/in critical care use CAM-ICU or ICDSC/);
});
test('new teaching is indexed at its authored topic and section',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA,{byId:Object.fromEntries(topics.map(t=>[t.id,t]))});
 for(const [id,target,phrase] of [['chest-pain','history','previous testing informs risk'],['dyspnea','pearls-pitfalls','NIV requires a suitable patient'],['abdominal-pain','workup','arterial-phase protocol'],['headache','pearls-pitfalls','does not directly test'],['ams','exam','hypoactive delirium'],['syncope','workup','Do not routinely request'],['fever','how-to-think','source control'],['dizziness','history','asymptomatic baseline']]){
  assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id+' '+target);
 }
});
test('references display a scoped addition date without relabelling unreviewed topics',()=>{
 const source=fs.readFileSync('assets/app.js','utf8');
 for(const name of ['esc','evidenceHtml']){const start=source.indexOf('    function '+name+'('),end=source.indexOf('\n    function ',start+1);vm.runInContext(source.slice(start,end),c);}
 assert.match(c.evidenceHtml('headache'),/Selected additions checked 2026-11-10/);
 assert.match(c.evidenceHtml('headache'),/This date applies only to these additions/);
 assert.doesNotMatch(c.evidenceHtml('weakness'),/Selected additions checked/);
});

test('pregnancy follow-up cannot substitute an hCG trend for clinical reassessment',()=>{
 assert.match(text('pelvic-pain'),/pregnancy of unknown location, not proof of a completed miscarriage/);
 assert.match(text('pelvic-pain'),/48 hours apart, not earlier/);
 assert.match(text('pelvic-pain'),/symptoms outweigh a previously reassuring hCG trend/);
 assert.doesNotMatch(text('pelvic-pain'),/transvaginal US — the definitive study/);
 assert.ok(evidence.topicReviews['pelvic-pain'].sources.includes('ectopicDiagnosis'));
});
test('joint, bleeding and back-pain additions preserve selective testing and clinical judgment',()=>{
 assert.match(text('joint-pain'),/normal CRP cannot exclude septic arthritis/);
 assert.match(text('joint-pain'),/do not inject saline/);
 assert.match(text('gib'),/nonurgent examination after bowel preparation/);
 assert.match(text('gib'),/low score does not override ongoing bleeding/);
 assert.doesNotMatch(text('gib'),/tachycardia is the earliest reliable sign|0–1 can leave/);
 assert.match(text('back-pain'),/duration alone does not determine imaging/);
});
test('seizure, poisoning and renal-colic advice retains uncertainty and aftercare',()=>{
 assert.match(text('seizures'),/normal routine EEG does not exclude epilepsy/);
 assert.match(text('seizures'),/no additional concern is present/);
 assert.match(text('overdose'),/brief improvement is not discharge clearance/);
 assert.match(text('overdose'),/psychosocial assessment/);
 assert.match(text('flank-pain'),/confirmation of stone passage/);
 assert.match(text('flank-pain'),/negative scan cannot settle a concerning presentation/);
});
test('adult crisis monitoring and transition remain explicit and searchable',()=>{
 const t=text('hyperglycemia');
 assert.match(t,/adult DKA\/HHS treatment/);
 assert.match(t,/glucose every 1–2 hours/);
 assert.match(t,/potassium 2 hours after starting insulin and every 4 hours thereafter/);
 assert.match(t,/overlap by 1–2 hours/);
 assert.match(t,/All pediatric DKA needs a pediatric protocol/);
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA);
 for(const [id,target,phrase] of [['gib','workup','nonurgent examination'],['back-pain','workup','six weeks'],['joint-pain','workup','dry tap'],['pelvic-pain','workup','48 hours'],['seizures','workup','normal routine EEG'],['overdose','pearls-pitfalls','take-home naloxone'],['hyperglycemia','workup','potassium 2 hours'],['flank-pain','pearls-pitfalls','stone passage']]){
  assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id);
 }
});

test('head injury distinguishes adult minor-injury discharge from indications for admission',()=>{
 const t=topics.find(t=>t.id==='head-injury'),d=JSON.stringify(t.disposition);
 assert.match(d,/baseline neurology/);assert.match(d,/no other admission reason/);
 assert.match(d,/Do not routinely admit or repeat CT solely/);
 assert.doesNotMatch(d,/no anticoagulation|Anticoagulated, intoxicated, isolated/);
 assert.match(text('head-injury'),/aspirin monotherapy is not an automatic CT indication/);
 assert.match(text('head-injury'),/Basilar fracture\/CSF leak alone does not justify prophylactic antibiotics/);
 assert.match(text('head-injury'),/open or penetrating injury has separate antibiotic indications/);
 assert.ok(evidence.topicReviews['head-injury'].sources.includes('mtbi'));
 assert.ok(evidence.topicReviews['head-injury'].sources.includes('csfLeak'));
});
test('eye and scrotal teaching preserves the limits of negative tests',()=>{
 assert.doesNotMatch(text('red-eye'),/until fluorescein proves otherwise/);
 assert.match(text('red-eye'),/negative fluorescein alone cannot exclude early infection/);
 assert.match(text('red-eye'),/pause for at least five minutes/);
 assert.match(text('red-eye'),/suspected open-globe injury/);
 assert.match(text('scrotal-pain'),/Ultrasound may not distinguish partial torsion/);
 assert.match(text('scrotal-pain'),/not improving within 72 hours/);
});
test('infection testing advice remains age- and presentation-specific',()=>{
 assert.match(text('sore-throat'),/adult does not routinely need a backup culture/);
 assert.match(text('sore-throat'),/children aged three years or older do need backup culture/);
 assert.match(text('diarrhea'),/multiplex detections in context/);
 assert.match(text('rash'),/Routine blood or skin cultures are unnecessary in typical uncomplicated cellulitis/);
 assert.doesNotMatch(text('rash'),/benign rashes itch/);
});
test('third-batch additions remain searchable in their authored sections',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA);
 for(const [id,target,phrase] of [['red-eye','workup','pause for at least five'],['sore-throat','workup','backup culture'],['scrotal-pain','workup','urine NAAT'],['diarrhea','pearls-pitfalls','oral rehydration'],['rash','workup','Routine blood or skin cultures'],['limb-ischemia','exam','arterial and venous Doppler'],['urinary-retention','workup','retrograde urethrography'],['head-injury','workup','validated population']]){
  assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id);
 }
 assert.match(text('urinary-retention'),/avoid blind instrumentation/);
 assert.match(text('limb-ischemia'),/compartment syndrome even after blood flow has returned/);
});

test('withdrawal does not delay emergency glucose and separates thiamine prevention from treatment',()=>{
 const t=text('alcohol-withdrawal');
 assert.doesNotMatch(t,/after thiamine|only after the first dose|never glucose alone|before or alongside glucose|Give thiamine before or with glucose/);
 assert.match(t,/never delay emergency glucose/);assert.match(t,/CIWA-Ar is unsuitable in delirium/);
 assert.match(t,/100 mg IV\/IM daily for 3–5 days/);
 assert.match(t,/300–500 mg IV three times daily for 3–5 days/);
 assert.ok(evidence.topicReviews['alcohol-withdrawal'].sources.includes('wernickeUK'));
});
test('burn starting calculation is adult-scoped and does not mandate intubation for singed hair',()=>{
 const t=text('burns');assert.doesNotMatch(t,/4 mL\/kg per %TBSA/);
 assert.match(t,/Adult burns ≥20% TBSA/);assert.match(t,/2 mL\/kg per %TBSA/);
 assert.match(t,/Pediatric fluid calculations require a separate protocol/);
 assert.match(t,/Soot or singed hair alone does not mandate intubation/);
 assert.ok(evidence.topicReviews.burns.sources.includes('burnResuscitation'));
});
test('pediatric criteria remain condition-specific and LP cannot delay resuscitation',()=>{
 const r=text('pediatric-respiratory-distress');
 assert.match(r,/4 hours including sleep/);assert.match(r,/over 90% at ≥6 weeks/);
 assert.match(r,/over 92% under 6 weeks\/with underlying conditions/);
 assert.match(r,/avoid routine suction/);
 assert.doesNotMatch(r,/Alert child with mild or resolved work of breathing, SpO₂ ≥92%/);
 assert.match(text('pediatric-fever'),/do not delay stabilization or antibiotics for LP/);
 assert.match(text('pediatric-fever'),/do not prevent febrile seizures/);
});
test('fourth-batch teaching is searchable and preserves individualized assessment',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA);
 for(const [id,target,phrase] of [['pediatric-fever','history','fever at home'],['pediatric-respiratory-distress','pearls-pitfalls','4 hours including sleep'],['anaphylaxis','pearls-pitfalls','autoinjector technique'],['burns','pearls-pitfalls','20 minutes'],['heat-cold','workup','overcooling'],['alcohol-withdrawal','pearls-pitfalls','CIWA-Ar is unsuitable'],['suicidal','pearls-pitfalls','48 hours'],['constipation','workup','Constipation alone']])assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id);
 assert.match(text('anaphylaxis'),/only without cardiovascular instability/);
 assert.doesNotMatch(JSON.stringify(topics.find(t=>t.id==='suicidal').disposition),/Low acute risk:/);
 assert.match(text('constipation'),/biofeedback/);
});

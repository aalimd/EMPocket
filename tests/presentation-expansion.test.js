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
 const ids=['chest-pain','dyspnea','abdominal-pain','headache','ams','syncope','fever','dizziness','gib','back-pain','joint-pain','pelvic-pain','seizures','overdose','hyperglycemia','flank-pain','red-eye','sore-throat','scrotal-pain','diarrhea','rash','limb-ischemia','urinary-retention','head-injury','pediatric-fever','pediatric-respiratory-distress','anaphylaxis','burns','heat-cold','alcohol-withdrawal','suicidal','constipation','weakness','coma','hemoptysis','shock','palpitations','focal-neurologic-deficit','electrolytes','hypertensive-emergency','vaginal-bleeding','nausea-vomiting','jaundice','cyanosis','diplopia','airway-stridor','edema','falls-geriatric-trauma'];
 const november13 = [
  'multiple-trauma', 'pregnancy-emergency', 'cardiac-arrest', 'thyroid-storm',
  'neutropenic-sepsis', 'tumor-lysis-syndrome', 'metastatic-spinal-cord-compression',
  'hypercalcemia-of-malignancy', 'superior-vena-cava-syndrome', 'cancer-immunotherapy-toxicity',
  'acute-coronary-syndrome', 'acute-aortic-syndrome', 'pulmonary-embolism', 'tension-pneumothorax',
  'esophageal-perforation', 'cardiac-tamponade', 'acute-mesenteric-ischemia',
  'ruptured-abdominal-aortic-aneurysm', 'acute-appendicitis', 'small-bowel-obstruction'
 ];
 const november14 = ['ectopic-pregnancy', 'ovarian-torsion', 'testicular-torsion', 'perforated-peptic-ulcer', 'acute-cholecystitis', 'acute-cholangitis', 'acute-pancreatitis', 'acute-diverticulitis', 'acute-heart-failure', 'acute-asthma-exacerbation', 'copd-exacerbation', 'community-acquired-pneumonia', 'sepsis-and-septic-shock', 'cardiogenic-shock', 'adrenal-crisis', 'acute-ischemic-stroke', 'transient-ischemic-attack', 'aneurysmal-subarachnoid-hemorrhage', 'spontaneous-intracerebral-hemorrhage', 'acute-bacterial-meningitis', 'convulsive-status-epilepticus', 'cerebral-venous-thrombosis', 'cauda-equina-syndrome', 'spinal-epidural-abscess', 'guillain-barre-syndrome', 'myasthenic-crisis', 'infected-obstructed-kidney', 'acute-pyelonephritis'];
 assert.deepEqual(Object.keys(evidence.topicReviews).sort(), [...ids, ...november13, ...november14].sort());
 assert.deepEqual(Object.keys(evidence.topicReviews).sort(), Array.from(topics, topic => topic.id).sort());
 for(const id of [...ids, ...november13, ...november14]){
  const r=evidence.topicReviews[id];
  assert.equal(r.checked, november14.includes(id) ? '2026-11-14' : november13.includes(id) ? '2026-11-13' : '2026-11-10');assert.ok(r.scope.length>15);
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
test('references display a scoped addition date separately from the historical audit',()=>{
 const source=fs.readFileSync('assets/app.js','utf8');
 for(const name of ['esc','evidenceHtml']){const start=source.indexOf('    function '+name+'('),end=source.indexOf('\n    function ',start+1);vm.runInContext(source.slice(start,end),c);}
 assert.match(c.evidenceHtml('headache'),/Selected additions checked 2026-11-10/);
 assert.match(c.evidenceHtml('headache'),/This date applies only to these additions/);
 assert.match(c.evidenceHtml('multiple-trauma'),/Selected additions checked 2026-11-13/);
 assert.match(c.evidenceHtml('multiple-trauma'),/source check 2026-10-08/);
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

test('selected potassium treatment includes named calcium regimens and early hypoglycemia precautions',()=>{
 const t=text('electrolytes');
 assert.match(t,/calcium gluconate 10% 30 mL IV over 10 min/);
 assert.match(t,/calcium chloride 10% 10 mL over 5 min/);
 assert.match(t,/every 30 min through 2 h, then hourly through 6 h/);
 assert.match(t,/pretreatment glucose <7 mmol\/L/);
 assert.match(t,/50 mL\/h for 5 h/);
 assert.match(t,/IV bicarbonate is not routine hyperkalemia therapy/);
 assert.match(t,/normal ECG cannot exclude severe hyperkalemia/);
 assert.doesNotMatch(t,/then check glucose hourly|repeat sample before acting/);
 assert.ok(evidence.sources.hyperkalemia[1].startsWith('https://guidelines.ukkidney.org/'));
});
test('sodium and cerebral/aortic targets keep their population and indication attached',()=>{
 const t=text('electrolytes');assert.match(t,/up to 3 boluses total/);assert.match(t,/high ODS risk: do not exceed 8 mmol\/L in any 24 h/);
 assert.ok(evidence.topicReviews.electrolytes.sources.includes('sodiumUS'));
 for(const id of ['chest-pain','hypertensive-emergency']){
  assert.match(text(id),/heart rate 60–80 bpm/);assert.match(text(id),/SBP <120 mmHg/);assert.ok(evidence.topics[id].includes('aorta'));
 }
 for(const id of ['hypertensive-emergency','focal-neurologic-deficit'])assert.match(text(id),/Selected mild-to-moderate ICH/);
 assert.match(text('focal-neurologic-deficit'),/routine intensive SBP lowering below 140 mmHg is harmful/);
});
test('neurological, rhythm and shock additions preserve diagnostic uncertainty',()=>{
 assert.match(text('weakness'),/Normal nerve-conduction studies in the first week do not exclude GBS/);
 assert.match(text('coma'),/Preserved pupillary responses do not exclude a structural cause/);
 assert.doesNotMatch(text('coma'),/without glucose, a CT, and a level/);
 assert.match(text('shock'),/Do not give fluids solely to normalize lactate/);
 assert.match(text('palpitations'),/Adenosine is reserved for appropriate regular rhythms/);
 assert.match(text('hemoptysis'),/CTPA targets pulmonary arteries/);
});
test('fifth-batch additions are indexed at their real clinical destinations',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA);
 for(const [id,target,phrase] of [['weakness','exam','bulbar function'],['coma','workup','Sudden unexplained coma'],['hemoptysis','workup','hemoptysis-specific'],['shock','pearls-pitfalls','monitored peripheral IV'],['palpitations','workup','symptom frequency'],['focal-neurologic-deficit','pearls-pitfalls','do not delay EVT'],['electrolytes','doses','every 30 min'],['hypertensive-emergency','pearls-pitfalls','medication access']])assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id);
});

test('negative initial tests retain their indication-specific follow-up',()=>{
 const edema=topics.find(t=>t.id==='edema');
 assert.match(edema.approach.join(' '),/two-level Wells score: DVT likely → proximal ultrasound first; DVT unlikely → D-dimer first/);
 assert.match(text('edema'),/DVT-likely pathway: a negative proximal scan with a positive D-dimer needs a repeat proximal scan in 6–8 days/);
 assert.doesNotMatch(text('edema'),/low\/moderate probability gets D-dimer/);
 const falls=text('falls-geriatric-trauma');
 assert.match(falls,/MRI; if unavailable within 24 h or contraindicated, consider CT/);
 assert.match(falls,/do not force weight-bearing when fracture remains suspected/);
 assert.doesNotMatch(falls,/until you have watched the patient walk/);
 assert.match(text('vaginal-bleeding'),/postmenopausal bleeding needs a documented gynecology\/endometrial assessment/);
 assert.doesNotMatch(text('vaginal-bleeding'),/TSH for non-pregnant chronic patterns/);
 assert.match(text('vaginal-bleeding'),/A careful speculum examination by an experienced clinician/);
 assert.doesNotMatch(text('vaginal-bleeding'),/Speculum exam is for obstetrics once previa is excluded/);
});
test('symptom improvement and isolated measurements do not substitute for reassessment',()=>{
 assert.match(text('jaundice'),/Falling aminotransferases do not prove recovery/);
 assert.match(text('cyanosis'),/overestimate oxygenation with darker skin pigmentation/);
 assert.match(text('airway-stridor'),/quieter stridor plus fatigue/);
 assert.match(text('airway-stridor'),/symptoms do not recur during 2–4 hours/);
 assert.match(text('nausea-vomiting'),/avoid it with prolonged QTc, Parkinson disease or Lewy body dementia/);
 assert.match(text('diplopia'),/an initially isolated palsy may change over time/);
});
test('sixth-batch teaching is searchable at the authored clinical section',()=>{
 const idx=c.window.EM_SEARCH_INDEX.buildSearchIndex(topics,c.window.ECG_DATA);
 for(const [id,target,phrase] of [['vaginal-bleeding','pearls-pitfalls','postmenopausal bleeding'],['nausea-vomiting','history','regular cannabis use'],['jaundice','pearls-pitfalls','Falling aminotransferases'],['cyanosis','history','generators'],['diplopia','exam','facial sensation'],['airway-stridor','pearls-pitfalls','2–4 hours'],['edema','workup','repeat proximal scan'],['falls-geriatric-trauma','pearls-pitfalls','comprehensive falls assessment']])assert.ok(idx.some(h=>h.cpId===id&&h.target===target&&h.title.includes(phrase)),id);
});

test('final batch replaces outdated emergency action rows with sourced distinctions', () => {
 const arrest = text('cardiac-arrest');
 assert.match(arrest, /AF or atrial flutter 200 J/);
 assert.match(arrest, /polymorphic VT needs an unsynchronized/);
 assert.doesNotMatch(arrest, /narrow regular 50–100 J|target QRS <100 ms/);

 const pregnancy = text('pregnancy-emergency');
 assert.match(pregnancy, /Prepare for resuscitative delivery at recognition/);
 assert.match(pregnancy, /complete it by 5 minutes if ROSC is absent/);
 assert.match(pregnancy, /where the arrest occurs/);
 assert.doesNotMatch(pregnancy, /hysterotomy at 4 min/);

 const thyroid = topics.find(topic => topic.id === 'thyroid-storm');
 const [, myxoedema] = thyroid.doses.find(([name]) => name === 'Myxoedema coma');
 assert.match(myxoedema[0], /Hydrocortisone 100 mg IV before levothyroxine/);
 assert.match(myxoedema[1], /1\.6 mcg\/kg\/day enterally, reduced to 75% while given IV/);
 assert.doesNotMatch(text('thyroid-storm'), /50–100 mcg IV daily/);

 assert.match(text('multiple-trauma'), /negative eFAST leaves intraperitoneal and retroperitoneal bleeding possible/);
});

test('differential cards link only to existing topics and cover the first diagnosis guides', () => {
 const ids = new Set(topics.map(topic => topic.id));
 const linked = id => topics.find(topic => topic.id === id).dontMiss.flatMap(row => row[3] || []);
 for (const topic of topics) {
  for (const row of topic.dontMiss.filter(row => row[3])) {
   assert.ok(Array.isArray(row[3]) && row[3].length, topic.id + ' ' + row[0]);
   assert.equal(new Set(row[3]).size, row[3].length);
   for (const target of row[3]) assert.ok(ids.has(target) && target !== topic.id, topic.id + ' → ' + target);
  }
 }
 assert.deepEqual(Array.from(linked('chest-pain')), [
  'acute-coronary-syndrome', 'acute-aortic-syndrome', 'pulmonary-embolism',
  'tension-pneumothorax', 'esophageal-perforation', 'cardiac-tamponade'
 ]);
 for (const id of ['acute-mesenteric-ischemia', 'ruptured-abdominal-aortic-aneurysm', 'acute-appendicitis', 'small-bowel-obstruction']) {
  assert.ok(linked('abdominal-pain').includes(id));
 }
});

test('abdominal, pelvic, biliary and scrotal differentials open their diagnosis guides', () => {
 const linked = id => topics.find(topic => topic.id === id).dontMiss.flatMap(row => row[3] || []);
 for (const [presentation, guides] of [
  ['abdominal-pain', ['perforated-peptic-ulcer', 'acute-cholecystitis', 'acute-diverticulitis', 'acute-cholangitis', 'acute-pancreatitis']],
  ['pelvic-pain', ['ectopic-pregnancy', 'ovarian-torsion']],
  ['scrotal-pain', ['testicular-torsion']],
  ['jaundice', ['acute-cholangitis']]
 ]) {
  for (const guide of guides) assert.ok(linked(presentation).includes(guide), presentation + ' → ' + guide);
 }
});

test('dyspnea and shock guides link from their presentations and keep treatment distinctions', () => {
 const linked = id => topics.find(topic => topic.id === id).dontMiss.flatMap(row => row[3] || []);
 for (const [presentation, guides] of [
  ['dyspnea', ['acute-heart-failure', 'acute-asthma-exacerbation', 'copd-exacerbation', 'community-acquired-pneumonia']],
  ['shock', ['sepsis-and-septic-shock', 'cardiogenic-shock', 'adrenal-crisis']],
  ['fever', ['sepsis-and-septic-shock', 'neutropenic-sepsis']]
 ]) {
  for (const guide of guides) assert.ok(linked(presentation).includes(guide), presentation + ' → ' + guide);
 }
 assert.match(text('acute-asthma-exacerbation'), /92–95%/);
 assert.match(text('copd-exacerbation'), /88–92%/);
 assert.match(text('sepsis-and-septic-shock'), /possible sepsis without shock, investigate rapidly/);
});

test('neurologic differentials link to diagnosis guides and preserve time-sensitive distinctions', () => {
 const linked = id => topics.find(topic => topic.id === id).dontMiss.flatMap(row => row[3] || []);
 for (const [presentation, guides] of [
  ['headache', ['aneurysmal-subarachnoid-hemorrhage', 'spontaneous-intracerebral-hemorrhage', 'acute-bacterial-meningitis', 'cerebral-venous-thrombosis']],
  ['focal-neurologic-deficit', ['acute-ischemic-stroke', 'transient-ischemic-attack']],
  ['seizures', ['convulsive-status-epilepticus']]
 ]) {
  for (const guide of guides) assert.ok(linked(presentation).includes(guide), presentation + ' → ' + guide);
 }
 assert.match(text('aneurysmal-subarachnoid-hemorrhage'), /6 hours or more, or with a new neurologic deficit/);
 assert.match(text('acute-bacterial-meningitis'), /only when safe and without a significant delay/);
 assert.match(text('transient-ischemic-attack'), /Using ABCD2 alone to decide discharge/);
});

test('spinal, neuromuscular and urinary differentials point to guides with escalation criteria', () => {
 const linked = id => topics.find(topic => topic.id === id).dontMiss.flatMap(row => row[3] || []);
 for (const [presentation, guides] of [
  ['back-pain', ['cauda-equina-syndrome', 'spinal-epidural-abscess']],
  ['weakness', ['guillain-barre-syndrome', 'myasthenic-crisis']],
  ['urinary-retention', ['cauda-equina-syndrome', 'infected-obstructed-kidney']],
  ['flank-pain', ['infected-obstructed-kidney', 'acute-pyelonephritis']]
 ]) {
  for (const guide of guides) assert.ok(linked(presentation).includes(guide), presentation + ' → ' + guide);
 }
 assert.match(text('cauda-equina-syndrome'), /low residual.*do not independently exclude/);
 assert.match(text('spinal-epidural-abscess'), /without waiting for biopsy/);
 assert.match(text('infected-obstructed-kidney'), /ureteral stent or percutaneous nephrostomy/);
});

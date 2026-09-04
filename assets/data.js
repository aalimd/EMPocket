/* ══════════ EM-CPs clinical data ══════════
   Framework: Rosen's Emergency Medicine 10th ed. (2023) — approach to cardinal presentations.
   Corroborated against the cited society guidance; editorial source review completed Sep 2026.
   Severity: critical = life/limb/sight threat now · emergent = time-sensitive morbidity · common = high-frequency.
   Educational reference only — never replaces clinical judgment or local protocols.
*/
const CP_DATA = [

{
id: 'chest-pain', name: 'Chest Pain', icon: '🫀',
tag: 'Rule out the six killers first — then risk-stratify the rest.',
overview: 'Chest pain is ~5–10% of ED visits. The task is not to name every cause but to exclude the life-threats, then risk-stratify the rest. A single normal ECG and troponin never exclude ACS. With high-sensitivity assays, an assay-specific 0/1-hour or 0/2-hour algorithm (ESC) is the spine of the pathway; HEART/EDACS remain useful adjuncts, especially with contemporary (non-hs) troponin.',
approach: [
    'ECG within 10 minutes; repeat if symptoms evolve or the first tracing is nondiagnostic.',
    'Exclude the six killers: ACS/OMI, dissection, PE, tension pneumothorax, Boerhaave, tamponade.',
    'Run an assay-specific hs-cTn 0/1h or 0/2h pathway (HEART/EDACS if using contemporary troponin).',
    'A single normal ECG and troponin never close the case.'
],
dontMiss: [
['Acute Coronary Syndrome (STEMI / NSTEMI / UA / OMI)', 'critical', 'Serial ECG + hs-troponin algorithm — not a single snapshot. Occlusion MI can exist without classic STE.'],
['Aortic dissection', 'critical', 'Tearing pain to the back, pulse/BP differential, wide mediastinum. Anticoagulating this as ACS can be lethal.'],
['Pulmonary embolism', 'critical', 'Very-low gestalt → PERC; otherwise Wells or YEARS + age-adjusted/probability-adapted D-dimer. Normal sats do not exclude it.'],
['Tension pneumothorax', 'critical', 'A clinical diagnosis — hypotension + unilateral absent breath sounds = decompress, don\u2019t image first.'],
['Esophageal rupture (Boerhaave)', 'critical', 'Post-emesis chest pain, subcutaneous emphysema, mediastinal air on CT.'],
['Cardiac tamponade', 'critical', 'Beck triad is late; pulsus paradoxus and electrical alternans — bedside echo is the test.'],
['Myocarditis / Takotsubo / cocaine ischemia', 'emergent', 'Young patients with atypical pain, HF features, or sympathomimetic use.'],
['GERD / musculoskeletal / anxiety', 'common', 'Real diagnoses — only after life-threats and validated ACS/PE pathways are negative.']
],
history: ['OPQRST + radiation to jaw, arm, or back', 'High-risk ACS features: exertional, rest pain, diaphoresis, syncope', 'Tearing/inter-scapular migration → dissection; pleuritic → PE/pleural; post-emesis → Boerhaave', 'Risk enhancers: age, diabetes, smoking, family history, cocaine, CKD', 'VTE risks: immobility, malignancy, surgery, estrogen, pregnancy'],
exam: ['Vitals with bilateral BP; pulse oximetry', 'Cardiac: new murmur (AS/dissection), rub (pericarditis/tamponade)', 'Lungs: symmetry, crackles (HF), unilateral absent sounds (PTX)', 'Vascular: pulse deficits; pulsatile abdominal mass (AAA)', 'Chest-wall reproducibility lowers — but does not exclude — ACS'],
workup: [
['Immediate (minutes)', ['12-lead ECG within 10 minutes; repeat at 15–30 min if symptoms evolve or the first tracing is nondiagnostic', 'Posterior (V7–V9) and right-sided leads when inferior or isolated anterior ST depression', 'POCUS: pericardial effusion, lung sliding, RV strain']],
['Labs', ['hs-Troponin 0/1h (preferred) or 0/2h assay-specific ESC/ACC-AHA algorithm — not a legacy 6-hour wait when an hs-cTn CDP is in use; 0/3h only if hs-Tn is unavailable', 'HEART or EDACS as adjuncts — essential if using contemporary (non-hs) troponin', 'D-dimer only when PE pretest is not high (PERC if very-low gestalt; Wells/YEARS + age-adjusted cutoff)', 'CBC, BMP, coagulation if antiplatelet/anticoagulation planned']],
['Imaging', ['CXR: mediastinum, PTX, edema, free air', 'CTA chest for dissection or PE; echo for RWMA/tamponade']]
],
redFlags: ['Hypotension, syncope or pre-syncope', 'ST elevation, hyperacute T waves, De Winter, Wellens, or posterior STE (isolated ST depression V1–V3)', 'Sgarbossa / Smith-modified criteria in LBBB or paced rhythm', 'Pain radiating to the back with pulse/BP asymmetry', 'New murmur or pulsus paradoxus', 'Unilateral absent breath sounds or tracheal deviation', 'Subcutaneous emphysema after vomiting', 'Ongoing pain despite antianginals'],
disposition: [
['Discharge', 'hs-cTn rule-out (0/1h or 0/2h) + non-ischemic ECG + no high-risk features; or HEART 0–3 with serial negative troponin on a score-based pathway. Arrange follow-up ± outpatient CTA/stress per local CDP.'],
['Admit (observation / telemetry)', 'Observe-zone troponin kinetics, HEART 4–6, new AF, ongoing atypical symptoms, or incomplete rule-out.'],
['ICU / cath lab activation', 'STEMI or occlusion-MI pattern, hemodynamic instability, suspected dissection/tamponade, refractory ischemic symptoms, arrhythmia.']
],
pitfalls: ['Isolated ST depression V1–V3 = posterior OMI until proven otherwise (V7–V9).', 'Wellens / De Winter = critical LAD disease even when pain-free.', 'New or presumed-new LBBB alone is not a STEMI equivalent (2025 ACC/AHA ACS) — use Sgarbossa/Smith criteria and clinical context.', 'Dissection mislabelled as NSTEMI and anticoagulated — check pulses/BP in both arms.', 'Do not default to a 6-hour troponin wait when an hs-cTn 0/1h or 0/2h protocol is available.', 'PE in the young and pregnant — non-tachycardic PE is common.', '\u201CMusculoskeletal\u201D + risk factors = the classic anchoring error.', 'A cold, pulseless limb with chest or back pain is dissection until the aorta is seen.'],
pearls: ['The six killers first — ACS, dissection, PE, tension PTX, Boerhaave, tamponade — then the hs-cTn 0/1h or 0/2h algorithm.', 'Isolated ST depression V1–V3 is posterior OMI until V7–V9 say otherwise.', 'New LBBB alone is not a STEMI equivalent (2025 ACC/AHA); use Sgarbossa/Smith and the patient.', 'A single normal ECG and troponin never close the chest-pain encounter.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — cardiac & chest pain chapters', '2021 AHA/ACC Chest Pain Guideline; 2022 ACC Expert Consensus Pathway (ED chest pain)', '2025 ACC/AHA/ACEP ACS Guideline', '2023 ESC ACS Guidelines (0/1h and 0/2h hs-cTn algorithms)', '2026 AHA/ACC Acute PE Guideline']
},
{
id: 'dyspnea', name: 'Shortness of Breath', icon: '🫁',
tag: 'Lungs, heart, blood, blood-gases, or plumbing?',
overview: 'Dyspnea is a symptom, not a diagnosis. Rapidly separate hypoxemic vs hypercapnic vs non-pulmonary drivers. Bedside ultrasound (B-lines, lung sliding, RV dilatation) plus a focused history resolves most cases faster than any single test.',
approach: [
    'Separate hypoxemic vs hypercapnic vs non-pulmonary drivers.',
    'POCUS: B-lines, lung sliding, RV size — plus a focused history.',
    'Gate PE (PERC if very-low gestalt; otherwise Wells/YEARS + age-adjusted D-dimer).',
    'Work of breathing decides urgency: silent chest or a “normalising” CO₂ is pre-arrest.'
],
dontMiss: [
['Pulmonary embolism', 'critical', 'Sudden dyspnea with clear lungs; PERC if very-low gestalt, otherwise Wells/YEARS + age-adjusted D-dimer. Echo may show RV strain.'],
['Tension pneumothorax', 'critical', 'Trauma, COPD or PPV + hemodynamic collapse → decompress before imaging.'],
['Acute pulmonary edema / LV failure', 'critical', 'Orthopnea, crackles, diffuse B-lines — early NIV + nitrates if hypertensive.'],
['Near-fatal asthma / COPD exacerbation', 'critical', 'Silent chest, normalizing CO₂, exhaustion = pre-arrest physiology.'],
['Anaphylaxis', 'critical', 'IM epinephrine into the anterolateral thigh immediately — do not wait for urticaria (it may be absent).'],
['Carbon monoxide poisoning', 'critical', 'Headache, whole household ill; standard SpO₂ is falsely normal — CO-oximetry.'],
['Metabolic acidosis (Kussmaul breathing)', 'emergent', 'DKA, sepsis, salicylates, uremia — lungs compensating for the blood.'],
['Neuromuscular weakness (GBS, myasthenia)', 'emergent', 'Orthopnea, weak cough, falling NIF/VC — monitor before the crash.'],
['Pneumonia / COPD exacerbation / anemia', 'common', 'High-frequency drivers; treat and reassess objectively.']
],
history: ['Tempo: seconds (PE/PTX), minutes (asthma/edema), hours–days (pneumonia/HF), weeks (anemia/effusion)', 'Positional: orthopnea & PND → LV failure; platypnea → shunt', 'Exposures: smoke, allergens, occupational, CO source, diving', 'Background: asthma/COPD, HF, VTE risks, immunosuppression', 'Associated chest pain, fever, leg swelling, hemoptysis'],
exam: ['Work of breathing: accessory muscles, tripod posture, speech in words vs sentences', 'Stridor (upper airway), wheeze (airway), crackles (alveolar), absent sounds (PTX/effusion)', 'JVP, edema, S3 → congestion', 'Cyanosis, agitation, drowsiness = objective severity', 'POCUS: anterior B-lines, sliding, effusions, RV/LV ratio'],
workup: [
['Bedside', ['SpO₂ + observation; peak flow in asthma if the patient can perform it', 'POCUS + ECG (RV strain, ischemia)', 'VBG/ABG when hypercapnia or deterioration is suspected']],
['Labs', ['BNP/NT-proBNP, troponin, gated D-dimer (age-adjusted or YEARS), CBC, BMP, lactate', 'CO-oximetry if exposure suspected']],
['Imaging', ['CXR first-line; CTPA when the PE pathway is positive', 'Echo for systolic dysfunction or suspected high-risk PE']]
],
redFlags: ['Silent chest, exhaustion, or falling respiratory rate in asthma/COPD', 'Rising CO₂ or falling pH on VBG', 'SpO₂ <90% despite high-flow oxygen', 'Hemodynamic instability or stridor at rest', 'Absent lung sliding with shock', 'New confusion or drowsiness (CO₂ narcosis)'],
disposition: [
['Discharge', 'Asthma/COPD back to baseline, room-air saturations acceptable, reliable follow-up. Asthma: prescribe an ICS-containing regimen — GINA 2026 does not recommend SABA-only therapy at any step.'],
['Admit (ward / HDU)', 'Persistent hypoxia on therapy, moderate exacerbation, selected low-risk PE (PESI I–II / sPESI 0 with no RV strain), CURB-65 0–1 pneumonia (± outpatient per PSI/local pathway).'],
['ICU / NIV-ventilation', 'NIV failure or exhaustion; COPD with pH <7.25 or falling despite NIV; tension physiology; high-risk PE (shock/hypotension) — PERT/reperfusion, not RV strain alone.']
],
pitfalls: ['Normal SpO₂ excludes neither PE nor early CO poisoning (cherry-red skin is uncommon and unreliable).', 'Wheeze in the elderly is not always asthma — think HF (\u201Ccardiac asthma\u201D).', 'A fatiguing asthmatic with a \u201Cnormal\u201D CO₂ is deteriorating, not improving.', 'Diffuse B-lines are not always edema — integrate context (ARDS, pneumonia, fibrosis).', 'Discharging asthma on albuterol alone is outdated and associated with excess exacerbations and death (GINA 2026).'],
pearls: ['POCUS (B-lines, sliding, RV) plus a focused history resolves most dyspnea faster than any single lab.', 'Normal SpO₂ excludes neither PE nor early CO — use the pathway and co-oximetry.', 'A fatiguing asthmatic with a \u201Cnormal\u201D CO₂ is deteriorating, not improving.', 'GINA 2026: no SABA-only discharge — every asthmatic leaves with ICS-containing therapy.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dyspnea & respiratory distress', 'GINA 2026 (ICS-formoterol Track 1; no SABA-only therapy)', 'GOLD 2026', '2019 ESC/ERS PE Guidelines; 2026 AHA/ACC Acute PE Guideline']
},
{
id: 'abdominal-pain', name: 'Abdominal Pain', icon: '🎯',
tag: 'Age, location, pregnancy status, and the vascular exam.',
overview: 'The ED goal is triage: exsanguinating and necrotizing causes first, then time-sensitive surgical causes, then medical mimics. Localization follows embryology (epigastric=foregut, periumbilical=midgut, suprapubic=hindgut) — migration of pain is diagnostic gold.',
approach: [
    'hCG in every patient of childbearing potential.',
    'Killers first: AAA, mesenteric ischemia, ectopic, perforation, torsion.',
    'Localise by embryology and migration; then image (US for biliary/GYN, CT as the workhorse).',
    'Medical mimics last: DKA, inferior MI, basal pneumonia.'
],
dontMiss: [
['Ruptured AAA', 'critical', 'Age >60 + pain/hypotension/pulsatile mass — bedside US, straight to OR/vascular; do not wait for a perfect CT.'],
['Mesenteric ischemia', 'critical', 'Pain out of proportion, AFib or vasculopathy; lactate and WBC may be normal early — CTA is the test.'],
['Ruptured ectopic pregnancy', 'critical', 'Every patient of childbearing potential with abdominal pain gets a pregnancy test.'],
['Perforated viscus', 'critical', 'Sudden severe pain, rigid abdomen, free air (upright CXR or CT).'],
['Ovarian / testicular torsion', 'critical', 'Acute one-sided pain — Doppler US. Testicular salvage is highest if detorsion is within ~6 h, but operate on suspicion — do not wait out a clock.'],
['Abdominal aortic / mesenteric dissection', 'critical', 'Consider in the same breath as chest-dissection presentations.'],
['DKA, inferior MI, basal pneumonia', 'emergent', 'Medical mimics — check glucose, ECG, and lungs in every atypical story.'],
['Appendicitis / cholecystitis / diverticulitis / obstruction', 'common', 'Time-sensitive; score and image. Selected uncomplicated appendicitis may be antibiotics-first per protocol (CODA).']
],
history: ['Onset & migration: periumbilical → RLQ (appendicitis); sudden maximal (perforation, torsion, AAA)', 'Relationship to meals (biliary), defecation (colonic), vomiting first vs pain first (surgical vs medical)', 'Blood: hematemesis, melena, hematochezia; last menstrual period & pregnancy possibility', 'Vascular history: AFib, known AAA, atherosclerosis → ischemia', 'Immunosuppression and steroids blunt peritoneal signs'],
exam: ['Peritoneal signs: rigidity, rebound, guarding', 'Murphy sign (cholecystitis), McBurney (appendicitis), Rovsing/psoas/obturator', 'Pulsatile mass + bruits; Cullen/Grey-Turner are late and uncommon (retroperitoneal blood)', 'Hernial orifices and genital exam in every male with scrotal/inguinal pain', 'Volume status: tachycardia, dry mucosa, capillary refill'],
workup: [
['Bedside', ['Urine hCG in all patients of childbearing potential', 'POCUS: AAA size, free fluid, gallbladder wall/stone, intrauterine pregnancy']],
['Labs', ['CBC, CRP, electrolytes, glucose, lactate, lipase, LFTs, urinalysis', 'Type & screen when surgery is likely; quantitative β-hCG']],
['Imaging', ['CT abdomen/pelvis with IV contrast = workhorse (appendicitis, diverticulitis, ischemia, AAA)', 'US first for biliary and gynecologic; MRI in pregnancy when US is inconclusive']]
],
redFlags: ['Hypotension or syncope with abdominal pain', 'Pain out of proportion to exam findings', 'Rigid abdomen or positive peritoneal signs', 'GI bleeding with known AAA repair (aortoenteric fistula)', 'Acute scrotal pain — treat as torsion until proven otherwise', 'Immunosuppressed with mild findings (can decompensate fast)'],
disposition: [
['Discharge', 'Benign exam, normal labs/imaging when indicated, reliable return precautions — reassess within 24–48 h if pain persists.'],
['Admit / surgical consult', 'Appendicitis (early laparoscopic appy, or antibiotics-first per local protocol), cholecystitis, diverticulitis, obstruction without strangulation.'],
['Emergency surgery / IR / ICU', 'Ruptured AAA, perforation, mesenteric ischemia, strangulated obstruction, torsion.']
],
pitfalls: ['Analgesia does not mask the diagnosis — treat the pain and re-examine (ACEP).', 'Normal lactate & WBC do not exclude early mesenteric ischemia.', 'Ectopic pregnancy happens with \u201Cno risk factors\u201D and a negative exam — and with a history of tubal ligation.', 'Elderly with soft findings can have catastrophes — lower the threshold for CT.', 'Diaphragmatic irritation (basal pneumonia, inferior MI) presents as upper abdominal pain.'],
pearls: ['hCG in every patient of childbearing potential — no exceptions for \u201Cno risk factors.\u201D', 'Pain out of proportion with a quiet belly is mesenteric ischemia until CTA says otherwise.', 'Analgesia does not mask the surgical abdomen — treat pain and re-examine.', 'The elderly with a soft abdomen still perforate, infarct, and rupture AAAs — lower the CT threshold.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — abdominal pain & surgical abdomen', 'Tintinalli\u2019s Emergency Medicine, 9th ed.', 'WSES 2020 guidelines (appendicitis, diverticulitis); CODA trial (NEJM 2020) for antibiotics-first appendicitis']
},
{
id: 'headache', name: 'Headache', icon: '🧠',
tag: 'Thunderclap, worst-ever, or any red flag = imaging.',
overview: 'Primary headaches (migraine, tension, cluster) dominate ED volumes, but the task is to filter the ~1–5% with secondary catastrophes. Thunderclap onset, fever with meningismus, papilledema, and new neuro deficits change everything.',
approach: [
    'Thunderclap, worst-ever, or any red flag → image.',
    'CT within 6 h + normal neuro exam rules out SAH; after 6 h use LP or CTA.',
    'Do not delay antibiotics (and dexamethasone if pneumococcal likely) for CT when meningitis is possible.',
    'Age ≥50 with visual symptoms: treat GCA on suspicion — do not wait for ESR.'
],
dontMiss: [
['Subarachnoid hemorrhage', 'critical', 'Sudden worst-ever headache. Third-generation CT within 6 h of onset + normal neuro exam rules out SAH (ACEP 2019). After 6 h: LP for xanthochromia or CTA. Ottawa SAH Rule: if all criteria are negative, imaging is not required.'],
['Intracranial hemorrhage', 'critical', 'Focal deficits, anticoagulation, hypertension — non-contrast CT first.'],
['Meningitis / encephalitis', 'critical', 'Fever + meningismus ± altered mentation — antibiotics (and dexamethasone if pneumococcal likely) must not wait on CT; LP when safe.'],
['Cerebral venous sinus thrombosis', 'critical', 'Progressive headache, papilledema, hypercoagulable state, postpartum — CTV/MRV.'],
['Arterial dissection (carotid/vertebral)', 'critical', 'Head/neck pain + Horner syndrome or posterior-circulation symptoms after trauma or neck manipulation.'],
['Acute angle-closure glaucoma', 'critical', 'Painful red eye, halos, mid-dilated pupil, vision loss — ophthalmology now.'],
['Giant cell arteritis (temporal arteritis)', 'emergent', 'Age ≥50, jaw claudication, new headache, visual symptoms — start glucocorticoids immediately if cranial GCA/visual threat is suspected; do not wait for biopsy. ESR/CRP can be normal.'],
['Migraine / tension / cluster', 'common', 'Recurrent pattern without red flags; treat (prefer non-opioids) and arrange follow-up.']
],
history: ['Onset speed: thunderclap (<1 min to peak) = SAH until excluded', 'Worst-ever, first-ever, or atypical-for-this-patient headache', 'Fever, immunosuppression, malignancy, anticoagulation, pregnancy/postpartum', 'Positional (post-LP, intracranial hypotension), transient (RCVS), exertional or wake-up pattern', 'Associated: neck pain, photophobia, visual change, jaw claudication'],
exam: ['Full neuro: focal deficits, gait, fundoscopy for papilledema', 'Meningismus: nuchal rigidity, Kernig/Brudzinski (insensitive — do not rely on them alone)', 'Temporal artery tenderness; scalp allodynia', 'Eye: acuity, pupils, red eye, corneal clouding', 'Skin: zoster, neurocutaneous stigmata'],
workup: [
['Bedside', ['Glucose, vitals including temperature, fundoscopy']],
['Labs', ['ESR and CRP if GCA is possible (normal values do not exclude it)', 'Coagulation before LP', 'LP: opening pressure, cell count, xanthochromia (most reliable ≥12 h after onset; still perform LP after a late negative CT — RBCs in tube 4 also matter), microbiology as indicated']],
['Imaging', ['Non-contrast CT for thunderclap/red flags (sufficient to rule out SAH if <6 h, neurologically intact, expert read)', 'CTV/MRV for CVT; CTA/MRA for dissection and aneurysm', 'MRI for posterior fossa or progressive headaches']]
],
redFlags: ['Thunderclap or \u201Cworst headache of my life\u201D', 'Fever with meningismus or altered mentation', 'New focal deficit, seizure, or papilledema', 'First headache ≥50 y, in pregnancy/postpartum, cancer, or immunocompromise', 'Progressive or sleep-waking pattern over days', 'Painful red eye with visual loss', 'Trauma or anticoagulation with new headache'],
disposition: [
['Discharge', 'Clinically diagnosed migraine/tension with benign exam, effective non-opioid treatment, no red flags — return precautions and follow-up. Ottawa SAH all-negative and no other red flags: no imaging required.'],
['Admit', 'Meningitis on therapy, CVT anticoagulation, GCA on glucocorticoids, refractory migraine/cluster infusions.'],
['Neurosurgery / stroke unit / ICU', 'SAH (aneurysm securing), ICH per protocol, deteriorating meningitis, elevated ICP.']
],
pitfalls: ['A normal third-generation CT within 6 h of onset, read by an experienced radiologist, rules out SAH in neurologically intact patients (ACEP Level B). After 6 h, CT is not sufficient — LP or CTA.', 'Sentinel \u201Cwarning\u201D headaches precede 10–40% of aneurysm ruptures.', 'Ottawa SAH Rule is highly sensitive but poorly specific — any single positive criterion means you cannot rule out SAH without testing.', 'GCA can present without a tender temporal artery and with a normal ESR.', 'Do not relabel a first \u201Cmigraine\u201D after age 50 without considering imaging.', 'Opioids are not first-line for primary headache in the ED (ACEP).'],
pearls: ['Third-generation CT within 6 h + a normal neuro exam rules out SAH (ACEP 2019). After 6 h: LP or CTA.', 'Ottawa SAH all-negative: you can skip imaging. Any single positive criterion means you cannot.', 'Start glucocorticoids immediately if cranial GCA with visual threat is suspected — do not wait for ESR or biopsy.', 'A first \u201Cmigraine\u201D after age 50 is a red flag, not a diagnosis.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — headache', 'ACEP 2019 Clinical Policy: Acute Headache (Ottawa SAH Rule; 6-hour CT rule; LP or CTA after negative CT)', 'AHA/ASA 2023 Guideline for Aneurysmal SAH', 'ACR/EULAR 2018 GCA classification; EULAR GCA management recommendations']
},
{
id: 'ams', name: 'Altered Mental Status', icon: '🌀',
tag: 'Glucose first — then work the list that kills.',
overview: 'AMS is a final common pathway: check glucose and oxygen immediately, then run a broad differential (AEIOU-TIPS) while treating reversible causes. In the elderly, any acute change from baseline is delirium until proven otherwise — and delirium always has a driver.',
approach: [
    'Glucose and oxygen before the mnemonic.',
    'Treat reversible causes while you work AEIOU-TIPS.',
    'Give thiamine with dextrose — never delay glucose.',
    'In the elderly, an acute change from baseline is delirium with a driver, not “UTI until proven otherwise.”'
],
dontMiss: [
['Hypoglycemia / hyperglycemic crises', 'critical', 'Bedside glucose in every AMS patient — before anything else. Never delay dextrose for thiamine.'],
['Hypoxia / hypercapnia', 'critical', 'SpO₂, VBG; think CO₂ narcosis in COPD.'],
['Stroke / intracranial hemorrhage', 'critical', 'Sudden onset, focal signs, anticoagulation — non-contrast CT now. IV tenecteplase or alteplase if eligible within 4.5 h; mechanical thrombectomy up to 24 h when perfusion imaging shows salvageable tissue (AHA/ASA) — not a rigid 6-hour wall.'],
['SAH', 'critical', 'Sudden headache + collapse; CT then LP or CTA as indicated.'],
['Meningitis / encephalitis', 'critical', 'Fever, meningismus — empiric therapy must not wait on imaging.'],
['Wernicke encephalopathy', 'critical', 'Alcohol use/malnutrition — give thiamine with (or immediately after) glucose; do not withhold glucose.'],
['Toxic ingestion (CO, TCA, salicylates, opioids)', 'critical', 'Pupils, skin, ECG (QRS widening), anion gap, temperature. Cherry-red skin is an unreliable CO sign — use CO-oximetry.'],
['Severe hyponatremia / hyperammonemia / uremia', 'emergent', 'Metabolic catastrophes — labs before labels.'],
['Delirium from infection / retention / medications', 'common', 'Find the driver; \u201CUTI\u201D alone is an overused explanation in the elderly (asymptomatic bacteriuria is not a diagnosis).']
],
history: ['Baseline cognition and tempo of change (family, care home, EMS)', 'Medications: sedatives, anticholinergics, insulin, anticoagulants', 'Substance use, alcohol, psychiatric history, toxin access', 'Trauma/falls — subdural in the elderly, especially if anticoagulated', 'Fever, headache, seizure activity, end-organ disease'],
exam: ['GCS + focused neuro: pupils, focal signs, meningismus', 'Glucose and SpO₂ at the bedside — mandatory first steps', 'Skin: needle tracks, rash, pallor; do not rely on cherry-red colour for CO', 'Breath odor: hepatic, ketotic, alcohol, uremic', 'Trauma stigmata: hemotympanum, raccoon eyes, scalp hematoma'],
workup: [
['Bedside', ['Glucose, SpO₂, temperature, VBG', 'ECG (TCA patterns, ischemia, dysrhythmia)', 'POCUS for free fluid / obvious cranial findings as trained']],
['Labs', ['Electrolytes (Na, Ca), renal and hepatic panels; ammonia if liver disease', 'Lactate, CBC, coagulation, targeted toxicology, TSH', 'CO-oximetry if CO is possible']],
['Imaging', ['Non-contrast head CT before LP when indicated (focal signs, anticoagulation, depressed GCS, papilledema)', 'CXR; LP and EEG per clinical picture']]
],
redFlags: ['Falling GCS or new focal neurology', 'Hypoglycemia or hypothermia', 'Meningismus, fever, or new seizure', 'Suspected overdose with QRS widening or absent gag reflex', 'Anticoagulation + head injury', 'Hypercapnia or acidosis on VBG'],
disposition: [
['Discharge', 'Baseline mental status restored, reversible cause treated, safe environment with reliable observers (e.g., resolved simple hypoglycemia with a plan).'],
['Admit', 'Delirium of unclear cause, treated infection under observation, uncorrected metabolic derangement.'],
['ICU / stroke pathway', 'Coma, airway compromise, status epilepticus, severe intoxication, massive ICH, fulminant sepsis, large-vessel occlusion within the EVT window.']
],
pitfalls: ['\u201CUTI causing AMS\u201D is overcalled — keep looking for the true driver (IDSA: do not treat asymptomatic bacteriuria).', 'Never delay dextrose for thiamine. Give thiamine concurrently; a single glucose bolus has not been shown to precipitate Wernicke. Prolonged carbohydrate loads without thiamine can.', 'Subdurals in the elderly can be progressive confusion \u201Cwithout trauma\u201D.', 'Hypothermia masks toxidromes and infection signs.', 'Post-ictal states normalize — image when they don\u2019t.'],
pearls: ['Glucose and oxygen before the mnemonic.', 'Never delay dextrose for thiamine — give them together.', '\u201CUTI causing AMS\u201D is overcalled; asymptomatic bacteriuria is not a diagnosis (IDSA).', 'A changing elderly patient without a clear fall still has a subdural until you look.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — altered mental status & delirium', 'Han JH, Wilber ST. Altered mental status in older patients in the emergency department. Clin Geriatr Med.', 'AHA/ASA 2024–2025 stroke guidance; IDSA asymptomatic bacteriuria', 'Donnino et al., Ann Emerg Med 2007; Schabelman & Kuo, J Emerg Med 2012 — thiamine/glucose sequence']
},
{
id: 'syncope', name: 'Syncope', icon: '💫',
tag: 'It\u2019s not the faint — it\u2019s what caused it.',
overview: 'Syncope is transient global cerebral hypoperfusion. Most cases are reflex (vasovagal) and benign; the ED job is to find the ~5–10% with cardiac or other lethal causes. ECG for everyone, a targeted history for the cause, and the Canadian Syncope Risk Score (CSRS) for disposition once an obvious serious cause has been excluded.',
approach: [
    'ECG for everyone.',
    'History for the cause: prodrome, posture, exertion, no warning.',
    'Exclude bleed, PE, and ectopic when the story fits.',
    'CSRS for disposition once an obvious serious cause is off the table (−3 to 0 home; ≥4 high-risk).'
],
dontMiss: [
['Lethal arrhythmia (long QT, WPW, Brugada, advanced block, VT)', 'critical', 'Abnormal ECG, exertional or supine syncope, no prodrome, family history of sudden death.'],
['Severe aortic stenosis / HCM', 'critical', 'Exertional syncope with a pathologic murmur — echo.'],
['High-risk PE', 'critical', 'Syncope can be the only symptom; check VTE risks and RV strain.'],
['Internal hemorrhage (AAA, GI bleed, ectopic)', 'critical', 'Syncope with anemia, abdominal/back pain, or positive hCG.'],
['SAH and other intracranial causes', 'critical', 'Headache + collapse; \u201Csyncope with head injury\u201D may be the other way around.'],
['Carotid / subclavian steal', 'emergent', 'Arm-exercise syncope with pulse/BP asymmetry.'],
['Vasovagal / orthostatic / situational', 'common', 'Prodrome (warmth, pallor, nausea) + trigger + upright posture — the reassuring triad.']
],
history: ['Circumstances: posture, triggers (blood, standing, micturition), exertion?', 'Prodrome vs no warning — cardiac causes often strike without prodrome', 'Palpitations, chest pain, dyspnea before the event', 'Family history of sudden death <40 y; known cardiomyopathy/channelopathy', 'QT-prolonging or hypotensive medications; alcohol'],
exam: ['Orthostatic vitals; BP in both arms', 'Cardiac: murmurs (AS, HCM), rhythm, gallops', 'Volume status; rectal exam / visible melena if bleeding is suspected', 'Post-event neuro: seizure vs syncope (tongue biting, confusion, orientation)', 'Injury pattern consistent with abrupt collapse'],
workup: [
['Bedside', ['12-lead ECG for everyone — QTc, blocks, delta waves, Brugada, ischemia, QRS axis/duration', 'Glucose; POCUS: RV strain, effusion, AAA, IVC']],
['Labs', ['hCG in childbearing potential; heme screen if bleeding is suspected', 'Troponin when cardiac suspicion (a CSRS component if measured)', 'Electrolytes, CBC as indicated']],
['Imaging / monitoring', ['CT head if injury or seizure is suspected; CTPA per PE pathway', 'ED rhythm monitoring; outpatient cardiac monitoring for selected intermediate-risk patients']]
],
redFlags: ['Exertional syncope or syncope while supine', 'No prodrome / sudden collapse with facial injury', 'Abnormal ECG (QTc >480 ms per CSRS; blocks, pre-excitation, Brugada, ischemia)', 'Structural heart disease or family history of sudden death', 'Chest pain, dyspnea, or palpitations preceding the event', 'Ongoing blood loss or positive hCG', 'CSRS ≥4 (high / very high)'],
disposition: [
['Discharge', 'Reflex/vasovagal pattern, normal ECG, CSRS −3 to 0 (very low / low; 30-day serious outcome <1%) — hydration, counselling, GP follow-up.'],
['Admit (telemetry) or shared decision', 'CSRS +1 to +3 (medium, ~8% 30-day serious outcomes): shared decision / brief observation. Abnormal ECG not clearly chronic; frail elderly living alone.'],
['ICU / expedited cardiac workup', 'CSRS ≥4, documented arrhythmia, exertional syncope with murmur, PE with shock or strain plus biomarkers, positive troponin with ischemic features.']
],
pitfalls: ['\u201CSyncope + facial injury\u201D is cardiac until proven otherwise (no time to protect the face).', 'Convulsive syncope mimics seizure — weigh the whole story.', 'A normal ED ECG does not exclude intermittent arrhythmia — history drives follow-up.', 'GI bleeding may be occult — look for melena in unexplained syncope.', 'Exertional syncope is cardiac until proven otherwise (rarely a post-exertional reflex faint — do not label it vasovagal in the ED).', 'CSRS ≥1 is medium, not high — do not automatically admit every +1.'],
pearls: ['ECG for every syncope, no exceptions.', 'CSRS −3 to 0 (very low/low) can go home; +1 to +3 is shared decision; ≥4 is high-risk.', 'Syncope + facial injury means there was no warning — treat as cardiac until proven otherwise.', 'Exertional or supine syncope is cardiac until the opposite is proven.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — syncope', 'Canadian Syncope Risk Score: Thiruganasambandamoorthy et al., CMAJ 2016; multicenter validation JAMA Intern Med 2020', '2017 ACC/AHA/HRS and 2018 ESC Syncope Guidelines']
},
{
id: 'weakness', name: 'Weakness & Fatigue', icon: '💪',
tag: 'Focal or diffuse? UMN or LMN? Hours or months?',
overview: 'First decide: true motor weakness, generalized fatigue, or functional limitation. True acute weakness is a neurologic emergency — map the pattern (brain, cord, root, nerve, NMJ, muscle), watch respiratory reserve, and move fast on cord compression and GBS.',
approach: [
    'Decide true motor weakness vs fatigue vs functional limit.',
    'Map the pattern: brain, cord, root, nerve, NMJ, muscle — reflexes are the discriminator.',
    'Watch NIF/VC in GBS and myasthenia.',
    'Cord/cauda: MRI now. Dexamethasone is for MSCC, not routine discogenic CES.'
],
dontMiss: [
['Acute stroke / TIA', 'critical', 'Sudden focal weakness — last-known-well, glucose, non-contrast CT. IV TNK/alteplase ≤4.5 h if eligible; EVT ≤24 h with target-mismatch perfusion imaging (AHA/ASA). Do not exclude EVT solely because 6 hours have passed.'],
['Guillain-Barré syndrome', 'critical', 'Ascending (or variant) weakness, areflexia; monitor NIF/VC — intubate before the crash. CSF may be normal in the first week.'],
['Cauda equina / cord compression', 'critical', 'Back pain + leg weakness ± saddle anesthesia, urinary retention — emergency MRI + spine surgery. Dexamethasone is for metastatic cord compression (NICE NG234), not routine for discogenic CES.'],
['Myasthenic crisis', 'critical', 'Fatigable weakness (ptosis, diplopia worse late in the day); NIF monitoring; avoid macrolides, fluoroquinolones, aminoglycosides.'],
['Transverse myelitis', 'critical', 'Sensory level, bladder dysfunction — MRI + steroids after infection is addressed.'],
['Botulism / tick paralysis', 'emergent', 'Descending weakness with poorly reactive pupils (botulism); find and remove the tick.'],
['Rhabdomyolysis / dyskalemic paralysis', 'emergent', 'Pigmented urine or extreme K⁺ shifts — ECG and treat the potassium.'],
['Anemia, hypothyroid, depression, OSA, deconditioning', 'common', 'The chronic-fatigue cohort — screen systematically.']
],
history: ['Tempo and pattern: sudden focal (vascular), ascending over days (GBS), fatigability through the day (MG)', 'Sensory level, back pain, bowel/bladder function, cancer history (MSCC)', 'Tick exposure, recent infections (Campylobacter), medications', 'Family history (periodic paralysis, dystrophy)', 'Fatigue screen: sleep, mood, weight change, bleeding, fevers'],
exam: ['Map the pattern: proximal vs distal, symmetric vs focal, UMN (brisk reflexes, spasticity) vs LMN (flaccid, areflexia)', 'Reflexes — the single best discriminator (absent in GBS, brisk in cord/brain)', 'Perianal sensation and rectal tone when cauda equina is possible', 'Fatigability: sustained upgaze for ptosis (MG)', 'Respiratory: single-breath count, cough strength'],
workup: [
['Bedside', ['Glucose; NIHSS if focal', 'NIF / vital capacity in suspected GBS or MG', 'Urine color for myoglobin; tick search', 'Post-void residual if CES is possible']],
['Labs', ['K⁺, phosphate, magnesium, CK, TFTs, CBC, B12, glucose/HbA1c', 'CSF (albuminocytologic dissociation) for GBS — may be normal early; AChR/MuSK antibodies for MG']],
['Imaging', ['Urgent MRI spine for cord/cauda/MSCC suspicion — do not delay for plain films', 'CT/MRI brain for focal weakness']]
],
redFlags: ['Progressive ascending weakness or falling NIF/VC', 'Back pain with weakness or urinary retention (cauda equina / MSCC)', 'Sudden focal deficit (stroke pathway)', 'Respiratory symptoms in neuromuscular disease', 'Dark urine with muscle pain (rhabdo)', 'Bilateral leg weakness with a sensory level', 'Known cancer + new spinal pain or neurology (MSCC)'],
disposition: [
['Discharge', 'Chronic fatigue with a clear treated cause and safe follow-up; benign post-viral fatigue with red-flag education.'],
['Admit', 'GBS/MG under monitoring (even if ambulating), electrolyte derangements, moderate rhabdo on IV fluids, progressive unclear cases.'],
['ICU / emergency intervention', 'Impending respiratory failure (NIF weaker than −30 cmH₂O, e.g. −20; VC <15–20 mL/kg; or 20/30/40 rule), cord compression, severe hyperkalemia, stroke needing intervention.']
],
pitfalls: ['GBS presenting as back pain or with preserved reflexes early — serial exams and NIFs. CSF protein often rises only after the first week.', 'Myasthenia worsens with macrolides, fluoroquinolones, and aminoglycosides.', 'Do not wait for a \u201Ccomplete\u201D CES picture (full saddle anesthesia) before MRI.', 'Dexamethasone is indicated for suspected MSCC, not as routine therapy for discogenic cauda equina.', 'Periodic paralysis after a heavy carbohydrate meal or exercise — check K⁺ and family history.', 'Elderly \u201Cweakness\u201D may hide a hip fracture, pneumonia, or sepsis.'],
pearls: ['First decide true weakness vs fatigue, then map the pattern with reflexes.', 'Watch NIF/VC in GBS and myasthenia — intubate before the crash.', 'Dexamethasone is for metastatic cord compression, not routine discogenic cauda equina.', 'Do not wait for a \u201Ccomplete\u201D CES picture before MRI.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — weakness & neuromuscular disease', 'EAN/PNS 2023 Guillain-Barré syndrome guideline', 'NICE NG234 (2023) metastatic spinal cord compression — dexamethasone 16 mg for MSCC with neurology', 'AAN guidance on myasthenic crisis']
},
{
id: 'gib', name: 'GI Bleeding', icon: '🩸',
tag: 'Resuscitate, risk-stratify, find the source.',
overview: 'GI bleeding is resuscitation first, diagnosis second. Hemodynamics beat the hematocrit (it lags for hours). Estimate upper vs lower from the story, risk-stratify (Glasgow-Blatchford for UGIB; Oakland for selected LGIB), and know the variceal pathway — it changes drugs and endoscopy timing.',
approach: [
    'Resuscitate first: two large-bore IVs, hemodynamics over the first hematocrit.',
    'Upper vs lower from the story; variceal pathway changes drugs and endoscopy timing.',
    'Risk-stratify: Glasgow-Blatchford 0–1 can leave (ACG 2021).',
    'Restrictive transfusion (Hb 7; ~8 if CVD); do not over-transfuse varices.'
],
dontMiss: [
['Variceal hemorrhage', 'critical', 'Cirrhosis + hematemesis: vasoactive drug (octreotide; terlipressin where available) + ceftriaxone + endoscopy within 12 h; restrictive transfusion (Hb 7–8 g/dL).'],
['Aortoenteric fistula', 'critical', 'Prior AAA repair + any GI bleed = fistula until excluded (CTA / surgery).'],
['Massive lower GI bleed (diverticular, angiodysplasia)', 'critical', 'Instability directs CTA → IR/endoscopy over colonoscopy-first.'],
['Mesenteric ischemia with bleeding', 'critical', 'Bloody stool + pain out of proportion in a vasculopath.'],
['Anticoagulant-associated bleeding', 'critical', 'Agent-specific reversal for life-threatening hemorrhage; balance thrombosis risk (ACG/CAG 2022).'],
['Ischemic colitis / IBD flare', 'emergent', 'Pain + bloody diarrhea; steroids for IBD per severity.'],
['Peptic ulcer / gastritis / anorectal sources', 'common', 'Most frequent; PPI after endoscopy per ACG; outpatient endoscopy if GBS 0–1.']
],
history: ['Hematemesis vs coffee-ground vs melena vs hematochezia — map the likely level', 'NSAIDs, anticoagulants, antiplatelets, alcohol, cirrhosis', 'Prior ulcers, H. pylori, AAA repair, radiation, IBD', 'Volume-loss symptoms: syncope, angina with anemia'],
exam: ['Vitals and orthostatics — tachycardia is the earliest reliable sign', 'Stigmata of liver disease: caput, ascites, asterixis', 'Rectal exam: color, mass, trauma', 'Skin: petechiae (thrombocytopenia), telangiectasias'],
workup: [
['Bedside', ['Two large-bore IVs; crossmatch early', 'POCUS for ascites; NG lavage is not routinely recommended']],
['Labs', ['CBC (expect lag), type & crossmatch, coagulation/INR, BUN/Cr (BUN rise suggests upper source), lactate', 'Glasgow-Blatchford for UGIB disposition; LFTs if liver disease']],
['Imaging / scope', ['Upper endoscopy within 24 h (within 12 h if variceal suspected)', 'CTA for massive/obscure LGIB → IR; colonoscopy for stable LGIB after prep']]
],
redFlags: ['Hemodynamic instability or orthostatic symptoms', 'Active hematemesis or massive hematochezia', 'Cirrhosis with any upper GI bleeding', 'Known AAA repair with any bleed', 'Melena + syncope (brisk upper source)', 'Anticoagulation with life-threatening hemorrhage'],
disposition: [
['Discharge', 'Glasgow-Blatchford 0–1 (ACG 2021: very-low-risk UGIB, ≤1% need for intervention) — outpatient endoscopy pathway, stable vitals, reliable follow-up.'],
['Admit (ward / HDU)', 'GBS ≥2, identified stable source, anticoagulation management needed.'],
['ICU / endoscopy-IR activation', 'Hemodynamic instability, active transfusion need, suspected variceal bleed, aortoenteric fistula.']
],
pitfalls: ['The hematocrit lags 12–24 h — a normal first value means nothing acutely.', 'Melena can come from the right colon; hematochezia can be a brisk upper bleed.', 'Restrictive transfusion (Hb 7 g/dL; ~8 g/dL if cardiovascular disease) improves UGIB outcomes (Villanueva NEJM 2013; ACG 2021).', 'Over-transfusing variceal bleeding raises portal pressure and rebleeding (Baveno VII).', 'Pre-endoscopic PPI has no ACG recommendation for or against — do not let it delay endoscopy.', 'NG lavage does not reliably risk-stratify and is not required.'],
pearls: ['Hemodynamics beat the hematocrit — the first Hb lags 12–24 h.', 'Glasgow-Blatchford 0–1 can leave for outpatient endoscopy (ACG 2021).', 'Restrictive transfusion: Hb 7 g/dL (≈8 if cardiovascular disease).', 'Variceal bleed: vasoactive drug + ceftriaxone + endoscopy within 12 h; do not over-transfuse.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — GI bleeding', 'ACG 2021 Clinical Guideline: Upper GI and Ulcer Bleeding (Laine et al.) — GBS 0–1 discharge; Hb 7 g/dL', 'Baveno VII (2022) portal hypertension consensus; AASLD variceal hemorrhage guidance']
},
{
id: 'fever', name: 'Fever & Sepsis', icon: '🌡️',
tag: 'Find the source; respect the host\u2019s risk.',
overview: 'Fever evaluation is host-dependent: age, immunosuppression, devices, pregnancy, and travel define the danger list. Screen for sepsis with a sensitive tool (NEWS2, MEWS, or SIRS — not qSOFA alone). Treat shock immediately; possible sepsis without shock gets a rapid workup and antibiotics within 3 hours if infection remains likely.',
approach: [
    'Screen with NEWS2, MEWS, or SIRS — not qSOFA alone.',
    'Host first: age, neutropenia, devices, pregnancy, travel.',
    'Shock or probable sepsis: antibiotics within 1 hour. Possible sepsis without shock: rapid look, then within 3 hours if infection remains likely.',
    'Start crystalloid resuscitation, then use dynamic reassessment to individualize further fluid; start norepinephrine if MAP remains low during resuscitation (SSC).'
],
dontMiss: [
['Sepsis / septic shock', 'critical', 'Hypotension, tachypnea, altered mentation, lactate >2. Antibiotics within 1 h for shock or probable sepsis; within 3 h for possible sepsis without shock after a rapid look. Use balanced crystalloid for initial resuscitation and dynamic measures to guide further fluid. Begin norepinephrine if MAP remains low during resuscitation (SSC 2026).'],
['Necrotizing soft-tissue infection / toxic shock', 'critical', 'Pain out of proportion, rapid spread, crepitus, or shock with a wound/soft-tissue source — surgery now, not a wait-for-CT strategy.'],
['Neutropenic fever', 'critical', 'ANC <500 + a single temperature ≥38.3°C (or ≥38.0°C for 1 h) — immediate empiric antipseudomonal antibiotics. MASCC/CISNE may identify low-risk outpatient candidates.'],
['Bacterial meningitis', 'critical', 'Fever + meningismus/altered mentation — first dose of antibiotics (and dexamethasone if pneumococcal likely) must not wait on CT.'],
['Infective endocarditis', 'critical', 'Fever + new murmur, IVDU, embolic signs — blood cultures ×3, echo.'],
['Malaria / travel sepsis', 'critical', 'Any fever returning from an endemic area = malaria until proven otherwise (thick/thin smear ± RDT, repeated if negative).'],
['Ectopic pregnancy / puerperal sepsis', 'critical', 'Fever in pregnancy or within 6 weeks postpartum — obstetric pathway.'],
['URIs, gastroenteritis, pharyngitis, UTI', 'common', 'Self-limited or outpatient-managed; keep criteria strict.']
],
history: ['Temperature course and home antipyretics', 'Host factors: age >65, chemotherapy, steroids/biologics, HIV, asplenia, devices (lines, valves, shunts), pregnancy', 'Travel, exposures, TB contacts', 'Localizing symptoms: cough, dysuria, rash, diarrhea, headache, joints', 'Recent procedures, wounds, dental work'],
exam: ['Full vitals including RR and mentation; use NEWS2/MEWS/SIRS — qSOFA is specific but too insensitive to screen alone (SSC 2021 and 2026)', 'Rash: petechial/purpuric (meningococcemia), target (Lyme), drug eruptions', 'Line and wound sites; murmurs; costovertebral and joint exam', 'Meningeal signs; fundoscopy; abdominal/pelvic exam as indicated'],
workup: [
['Bedside', ['Glucose, lactate, pregnancy test when appropriate', 'POCUS: effusions, hydronephrosis, cardiac function']],
['Labs', ['CBC with differential, cultures before antibiotics when it will not delay them', 'Urine studies and CXR per focus; malaria smear if travel; LP if CNS suspicion', 'Inflammatory markers (CRP/procalcitonin) as institutional adjuncts — they do not rule out sepsis']],
['Imaging', ['CXR; CT for occult source (intra-abdominal abscess) when unclear']]
],
redFlags: ['Hypotension, tachypnea, or altered mentation', 'Lactate ≥2 mmol/L or fluid-unresponsive hypotension', 'Neutropenia, asplenia, recent chemotherapy', 'Fever + new murmur or IVDU', 'Purpuric rash or severe headache', 'Fever in pregnancy or within 6 weeks postpartum', 'Return from a malaria-endemic region'],
disposition: [
['Discharge', 'Benign source, normal vitals and mentation, reliable follow-up with clear return precautions (uncomplicated viral illness). Selected low-risk neutropenic fever (MASCC) per protocol.'],
['Admit', 'Sepsis without shock, comorbidity burden, uncertain source needing IV therapy, social/safety concerns.'],
['ICU', 'Septic shock, unstable neutropenic sepsis, deteriorating meningitis, multi-organ dysfunction.']
],
pitfalls: ['Afebrile ≠ not septic — elderly, immunosuppressed, and antipyretic-treated patients may never spike.', 'Do not use qSOFA as the sole screening tool (SSC strong recommendation). NEWS2/MEWS/SIRS are more sensitive.', 'Antibiotics within 1 h for septic shock and for probable sepsis; possible sepsis without shock allows a rapid evaluation and antibiotics within 3 h if infection remains likely.', 'Do not continue giving fluid without reassessment — use dynamic measures, perfusion, and the patient’s current condition to guide further resuscitation.', 'Neutropenic patients lack pus and peritoneal signs.', 'Asplenic + fever = an emergency (encapsulated organisms).', 'Line infections hide inside \u201Cno obvious source\u201D sepsis.', 'Necrotizing infection looks like \u201Ccellulitis\u201D until the patient is in shock — pain out of proportion is the tell.'],
pearls: ['Do not screen with qSOFA alone — NEWS2, MEWS, or SIRS are more sensitive (SSC).', 'Antibiotics within 1 h for shock or probable sepsis; within 3 h for possible sepsis without shock after a rapid look.', 'Use balanced crystalloid initially, then dynamic reassessment and norepinephrine when MAP remains low.', 'Afebrile does not mean not septic — especially the elderly and immunosuppressed.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — fever & sepsis', 'Surviving Sepsis Campaign 2021; SSC 2026 update (NEWS/MEWS/SIRS over qSOFA; antibiotic timing stratified by shock)', 'IDSA: neutropenic fever, bacterial meningitis, asymptomatic bacteriuria']
},
{
id: 'dizziness', name: 'Dizziness & Vertigo', icon: '🔄',
tag: 'The one question: is it the inner ear or the brainstem?',
overview: 'Sort dizziness into vertigo, presyncope, disequilibrium, or nonspecific — then, for vertigo, decide central vs peripheral. Duration, triggers, and HINTS (only in continuous acute vestibular syndrome, by a trained examiner) outperform early CT; sustained vertigo with vascular risk factors needs posterior-circulation imaging (MRI-DWI).',
approach: [
    'Vertigo vs presyncope vs disequilibrium vs nonspecific.',
    'If positional and seconds-long: Dix-Hallpike / Epley (BPPV).',
    'HINTS only in continuous acute vestibular syndrome, by a trained examiner — normal HIT is central.',
    'Sustained vertigo with vascular risks: MRI-DWI (CT misses posterior stroke).'
],
dontMiss: [
['Posterior circulation stroke', 'critical', 'Sustained vertigo + HINTS central signs, or any focal/cranial-nerve deficit — MRI-DWI (CT misses most).'],
['Cerebellar hemorrhage', 'critical', 'Headache, ataxia, inability to walk — CT now; neurosurgery.'],
['Vestibular schwannoma / CPA mass', 'emergent', 'Progressive unilateral hearing loss + vertigo — MRI.'],
['BPPV', 'common', 'Brief (<1 min) positional vertigo, positive Dix-Hallpike — Epley maneuver treats in the ED.'],
['Vestibular neuritis', 'common', 'Acute sustained vertigo, HINTS peripheral, no hearing loss — symptomatic care + vestibular rehab. Do not use HINTS for episodic symptoms.'],
['Ménière disease', 'common', 'Episodes with tinnitus, fluctuating hearing loss, ear fullness.'],
['Presyncope / arrhythmia / orthostatic', 'common', 'Light-headed, not rotational — evaluate like syncope.']
],
history: ['Character: spinning (vertigo) vs light-headed vs imbalance', 'Duration: seconds (BPPV), hours (Ménière, TIA), days (neuritis, stroke)', 'Triggers: position changes (BPPV), head motion, standing (orthostatic)', 'Vascular risks: age, hypertension, diabetes, smoking, atrial fibrillation', 'Hearing change, tinnitus, diplopia, dysarthria, dysphagia, headache/neck pain'],
exam: ['HINTS only in continuous AVS: Head-Impulse — a corrective saccade (abnormal HIT) is peripheral; a normal HIT (no saccade) is central and concerning. Direction-changing or vertical nystagmus = central. Test-of-skew (vertical refixation) = central', 'Gait — unable to walk at all suggests central', 'Neuro: cranial nerves, cerebellar tests, dysmetria', 'Dix-Hallpike if positional symptoms; otoscopy', 'Orthostatic vitals if presyncopal'],
workup: [
['Bedside', ['HINTS exam in acute vestibular syndrome by a trained examiner (more sensitive than early MRI when applied correctly)', 'Glucose; orthostatics; ECG if presyncopal']],
['Labs', ['As directed by the picture: CBC, glucose, electrolytes']],
['Imaging', ['MRI-DWI for suspected central cause (CT is poor for the posterior fossa)', 'CT first if hemorrhage is suspected; CTA/MRA for vascular assessment']]
],
redFlags: ['Any new focal/cranial-nerve deficit or severe imbalance', 'Sudden headache with vertigo (hemorrhage)', 'Normal head-impulse test, direction-changing or vertical nystagmus, or skew deviation', 'Vascular risk factors with sustained (not positional) vertigo', 'New hearing loss with neuro signs', 'Inability to stand or walk even with support'],
disposition: [
['Discharge', 'BPPV (post-Epley with home exercises), peripheral neuritis with a confident HINTS-peripheral exam, Ménière flare with follow-up — safety-net advice.'],
['Admit', 'High-risk acute vestibular syndrome while MRI is arranged, Ménière with intractable vomiting, electrolyte derangements.'],
['Stroke pathway / neurosurgery', 'Posterior circulation stroke (thrombolysis/thrombectomy if eligible), cerebellar hemorrhage with mass effect.']
],
pitfalls: ['HINTS is invalid in episodic/positional vertigo — that is a Dix-Hallpike question, not a HINTS question.', 'CT can miss posterior strokes — MRI-DWI when suspicion persists.', 'A \u201Cdizzy\u201D elderly patient with falls may have presyncope, not vertigo — re-interview.', 'Nystagmus that changes direction with gaze = central until proven otherwise.', 'Do not treat undifferentiated vertigo with meclizine and discharge — the exam decides.', 'BPPV can coexist with serious causes; re-test if atypical.'],
pearls: ['HINTS is only for continuous acute vestibular syndrome, by a trained examiner — not for episodic spinning.', 'Abnormal HIT (corrective saccade) is peripheral; a normal HIT is central and concerning.', 'CT misses most posterior strokes — MRI-DWI when suspicion persists.', 'BPPV is diagnosed with Dix-Hallpike and treated with Epley in the ED.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dizziness & vertigo', 'HINTS exam: Kattah et al., Stroke 2009; subsequent AVS imaging studies', 'AHA/ASA posterior-circulation stroke statements']
},
{
id: 'back-pain', name: 'Low Back Pain', icon: '🦴',
tag: 'Most leave with advice — the task is finding the dangerous few.',
overview: '>90% of ED back pain is non-specific mechanical disease. The ED task is a red-flag sweep: infection, malignancy (including MSCC), fracture, cauda equina, and AAA. Below age 50 without red flags, imaging adds cost and radiation — not diagnosis.',
approach: [
    'Red-flag sweep: infection, cancer/MSCC, fracture, cauda equina, AAA.',
    'No imaging for non-specific pain under 6 weeks without red flags.',
    'Retention, saddle numbness, or bilateral weakness → emergency MRI.',
    'NSAIDs and activity, not bed rest or opioids-first.'
],
dontMiss: [
['Cauda equina syndrome', 'critical', 'Saddle anesthesia, urinary retention/incontinence, bilateral leg weakness — emergency MRI + neurosurgery. Do not wait for a \u201Ccomplete\u201D picture.'],
['Metastatic cord compression', 'critical', 'Cancer history + spinal pain or neurology — contact the MSCC pathway, MRI, and start dexamethasone 16 mg if there are neurological signs (NICE NG234).'],
['Spinal epidural abscess / discitis', 'critical', 'Fever, IVDU, immunosuppression, recent procedures, exquisite midline tenderness — MRI + antibiotics. Do not give steroids if infection is the leading diagnosis.'],
['Pathologic fracture / malignancy', 'critical', 'Cancer history, night pain, weight loss, age >50 — MRI; myeloma can have normal X-rays.'],
['Rupturing / expanding AAA', 'critical', 'Elderly vasculopath with back pain = AAA until excluded (bedside US/CTA).'],
['Osteoporotic compression fracture', 'emergent', 'Elderly, steroids, minimal or no trauma — X-ray, treat pain, brace per ortho. Not immediately life-threatening but easy to miss.'],
['Inflammatory spondyloarthropathy', 'common', 'Night pain, morning stiffness >30 min, improves with activity, onset <40 y — not an ED emergency; HLA-B27 and SI-joint MRI as outpatient.'],
['Renal colic / pyelonephritis / pancreatitis', 'common', 'Flank radiation, urinary symptoms — urinalysis, lipase, CT as indicated.'],
['Mechanical / radicular pain (sciatica)', 'common', 'Positional, dermatomal radiation, positive straight-leg raise — NSAIDs, stay active, no bed rest.']
],
history: ['Trauma? Osteoporosis or chronic steroids? Cancer history?', 'Red-flag screen: fever, weight loss, night pain, immunosuppression, IVDU', 'Neuro: leg weakness, saddle numbness, bowel/bladder changes', 'Inflammatory vs mechanical pattern (morning stiffness, activity response)', 'Recent spinal procedures or surgery'],
exam: ['Midline tenderness (fracture/abscess) vs paraspinal (muscular)', 'Straight-leg raise; dermatomal power, sensation, reflexes', 'Perianal sensation and rectal tone when cauda equina is possible', 'Fever; abdominal and pulsatile-mass exam; CVA tenderness', 'Gait and overall neurologic observation'],
workup: [
['Bedside', ['Focused neuro mapping; post-void residual (bladder scanner) if retention is possible', 'Vitals including temperature', 'Bedside US if AAA is on the list']],
['Labs', ['CBC, ESR/CRP for infection/malignancy screen; urinalysis', 'Myeloma screen (SPEP, calcium, creatinine) when age + red flags fit']],
['Imaging', ['No imaging for non-specific pain <6 weeks without red flags (ACP 2017; NICE NG59)', 'Emergency MRI for cauda equina, abscess, or MSCC — do not delay for plain films', 'X-ray first for osteoporotic fracture screen', 'Bedside US/CTA when AAA is suspected']]
],
redFlags: ['Urinary retention or saddle anesthesia', 'Bilateral leg weakness or progressive deficit', 'Fever or IVDU with spinal pain', 'Cancer history, unexplained weight loss, night pain', 'Significant trauma — or minor trauma in the osteoporotic/elderly', 'Age >50 with new severe pain + vascular history'],
disposition: [
['Discharge', 'Non-specific mechanical pain without red flags: NSAIDs/acetaminophen ± heat, stay active (no bed rest), return precautions and follow-up. Opioids-first is outdated.'],
['Admit', 'Epidural abscess on IV antibiotics, pathologic fracture needing stabilization, intractable radicular pain, social issues.'],
['Emergency MRI + neurosurgery/ortho/oncology', 'Cauda equina, MSCC, unstable fracture, spinal infection with neuro signs.']
],
pitfalls: ['Cauda equina with \u201Conly\u201D retention and back pain — do not wait for full saddle numbness.', 'Dexamethasone is for MSCC, not discogenic CES and not for suspected epidural abscess.', 'Epidural abscess can mimic simple sciatica in IVDU/diabetics — ESR/CRP is cheap, MRI is decisive.', 'Myeloma X-rays look normal — escalate to MRI/SPEP if suspicion persists.', 'AAA presenting as back pain in the elderly is a killer misdiagnosis.', 'Bed rest and opioids-first are outdated — NSAIDs plus activity (ACP; Chou JAMA 2023).'],
pearls: ['Most ED back pain is mechanical — the job is the red-flag sweep, not an x-ray for everyone.', 'Cauda equina: emergency MRI, do not wait for a complete saddle-anesthesia picture.', 'Elderly vasculopath with back pain = AAA until the aorta is seen.', 'NSAIDs plus activity beat bed rest and opioids-first (ACP; Chou JAMA 2023).'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — back pain', 'ACP guideline (Annals 2017); NICE NG59 (low back pain)', 'NICE NG234 (2023) metastatic spinal cord compression', 'Chou et al., JAMA 2023 systematic review']
},
{
id: 'red-eye', name: 'Red Eye & Eye Emergencies', icon: '👁️',
tag: 'Vision + pain + halos = ophthalmology tonight.',
overview: 'Red eyes are mostly benign (conjunctivitis), but the vision- or globe-threatening causes — chemical burn, angle-closure glaucoma, keratitis, orbital cellulitis, sudden vision loss — are time-critical. A chemical burn is the one true treat-before-you-assess emergency.',
approach: [
    'Chemical burn: irrigate until pH 7.0–7.4, then examine.',
    'Visual acuity in every other red eye.',
    'Pain, halos, or a white spot (especially contact-lens wearers) is ophthalmology tonight.',
    'CRAO is a stroke equivalent — call both pathways.'
],
dontMiss: [
['Chemical burn (alkali worse than acid)', 'critical', 'Immediate copious saline irrigation until conjunctival pH is 7.0–7.4 (often 30+ min / litres). Check pH after, then assess. Do not wait for a full exam.'],
['Acute angle-closure glaucoma', 'critical', 'Painful red eye, halos, mid-dilated fixed pupil, cloudy cornea, vision loss — lower IOP + ophthalmology NOW.'],
['Infectious keratitis (bacterial / herpetic)', 'critical', 'Contact lens + pain + white corneal infiltrate = ulcer; never patch, never start topical steroids, urgent ophthalmology.'],
['Orbital cellulitis', 'critical', 'Proptosis, painful eye movement, fever — CT orbits + IV antibiotics (preseptal is milder).'],
['Endophthalmitis', 'critical', 'Post-surgery/injection severe pain with hypopyon — emergency intraocular therapy.'],
['Central retinal artery occlusion', 'critical', 'Sudden painless profound monocular vision loss; pale retina, cherry-red spot. Treat as a stroke equivalent (AHA) — emergency ophthalmology + stroke pathway. IV tPA evidence is mixed; do not delay the call.'],
['Retinal detachment', 'emergent', 'Curtain over vision, shower of floaters — urgent ophthalmology (hours, not days, if macula is threatened).'],
['Conjunctivitis / subconjunctival hemorrhage', 'common', 'Benign when acuity, pupils, and cornea are normal.']
],
history: ['Contact lenses (ulcer risk), trauma, ocular surgery/injections, chemical exposure', 'Pain: deep vs superficial; photophobia; discharge character', 'Vision change: blurring, curtain, floaters, halos around lights', 'Systemic disease: autoimmune (scleritis/uveitis), recent shingles'],
exam: ['Visual acuity in EVERY red eye — with pinhole and correction (except irrigate first in chemical burns)', 'Pupils: swinging-flashlight for afferent defect', 'Fluorescein staining (ulcer, dendrite), chamber depth, cells/flare, hypopyon', 'Everted lids for foreign body (after anesthetic); red reflex', 'Proptosis, painful eye movements, periorbital edema'],
workup: [
['Bedside', ['Acuity, fluorescein staining; tonometry when glaucoma is suspected', 'Chemical splash: irrigate first, then measure pH until 7.0–7.4']],
['Labs', ['As indicated: CBC/inflammatory markers for orbital cellulitis; ophthalmology-led corneal scraping']],
['Imaging', ['CT orbits for cellulitis, intraocular foreign body, or fracture', 'None needed for simple conjunctivitis; stroke-protocol imaging for CRAO']]
],
redFlags: ['Any loss of visual acuity', 'Moderate-severe pain, photophobia, or halos', 'Contact-lens wearer with pain or a white spot', 'Proptosis, limited/painful movement, fever', 'Abnormal pupil or afferent pupillary defect', 'Chemical splash — irrigate immediately, no exceptions', 'Hypopyon or corneal infiltrate'],
disposition: [
['Discharge', 'Uncomplicated conjunctivitis or subconjunctival hemorrhage with normal acuity, pupils, and cornea — hygiene advice and follow-up.'],
['Urgent ophthalmology (same day)', 'Keratitis, uveitis, retinal-detachment symptoms, hyphema, preseptal cellulitis.'],
['Emergency ophthalmology / admission / stroke pathway', 'Chemical burn (after irrigation), angle-closure glaucoma, endophthalmitis, orbital cellulitis, CRAO.']
],
pitfalls: ['Never patch or give steroids over a possibly herpetic or ulcerated cornea.', 'Chemical burns: delayed irrigation means permanent damage — triage straight to eye-wash and keep going until pH normalizes.', 'Contact lens + red eye + pain = ulcer until fluorescein proves otherwise.', 'Skipping visual acuity is the universal red-eye pitfall.', 'Periorbital swelling + fever: test eye movement and proptosis to separate preseptal from orbital.', 'CRAO is a stroke until the workup says otherwise — look for GCA in patients ≥50 y with preceding headache/jaw claudication.'],
pearls: ['Visual acuity in every red eye — after you finish irrigating a chemical burn.', 'Irrigate alkali/acid until conjunctival pH is 7.0–7.4, then examine.', 'Contact lens + pain + a white spot is a corneal ulcer until fluorescein proves otherwise.', 'CRAO is a stroke equivalent — call ophthalmology and the stroke pathway together.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — ocular emergencies', 'AAO Preferred Practice Patterns (bacterial keratitis, primary angle closure, CRAO)', 'AHA: CRAO as a stroke equivalent; Tintinalli\u2019s 9th ed. — eye emergencies']
},


{
id: 'joint-pain', name: 'Acute Joint Pain', icon: '🦵',
tag: 'The hot swollen joint is septic until drained otherwise.',
overview: 'A single hot, swollen joint is septic arthritis until aspiration proves otherwise — delay costs cartilage. Then split the rest: crystal, trauma, degenerative, inflammatory. Multiple joints suggest systemic disease (gout flare, rheumatic, reactive, viral, gonococcal).',
approach: [
    'A single hot joint is septic until the tap says otherwise.',
    'Aspirate before antibiotics when safe: Gram stain, culture, crystals, cell count.',
    'Crystals do not exclude infection.',
    'Prosthetic joints belong to orthopedics — do not tap through cellulitis.'
],
dontMiss: [
['Septic arthritis', 'critical', 'Fever + hot joint (or an immunosuppressed/diabetic patient without fever) — aspirate before antibiotics when safe; IV therapy + washout. Synovial WBC >50,000/µL is suggestive, not diagnostic; gonococcal and immunocompromised septic joints are often well below that.'],
['Prosthetic joint infection', 'critical', 'Any prosthesis + joint symptoms — urgent orthopedics. They perform the aspiration; do not tap through overlying cellulitis.'],
['Fracture / osteomyelitis', 'critical', 'Trauma, diabetic foot, sickle cell — X-ray first; MRI for deep infection.'],
['Hemarthrosis (anticoagulated, hemophilia)', 'emergent', 'Tense painful joint — reverse coagulopathy / factor replacement + ortho. Do not inject steroids into an uncultured joint.'],
['Lyme arthritis', 'emergent', 'Endemic area, often a large knee effusion weeks to months after the tick — serology per regional pathway.'],
['Gout / pseudogout flare', 'common', 'First MTP or knee; negatively birefringent needles = MSU (gout). Crystals do not exclude coexistent infection.'],
['Reactive / viral / gonococcal arthritis', 'common', 'Migratory polyarthralgia; pustules and tenosynovitis suggest disseminated gonococcus — culture/NAAT mucosa, not just the joint.'],
['Traumatic effusion / OA flare', 'common', 'Mechanical history, chronic pattern — image and conservative care.']
],
history: ['Onset speed: minutes (trauma), hours–days (septic, crystal), weeks (inflammatory, Lyme)', 'Fever, chills, immunosuppression, diabetes, IVDU (septic risk)', 'Prior similar episodes and crystal disease; alcohol/diuretics (gout)', 'Prosthetic joint? Recent procedures or wounds?', 'Travel/ticks (Lyme), sexual history (gonococcal, reactive)'],
exam: ['Single vs multiple joints; hot, swollen, painful range of motion (all three = septic until excluded)', 'Skin over the joint: entry wounds, cellulitis, pustules (gonococcal)', 'Systemic: rash, psoriasis plaques, urethritis, conjunctivitis', 'Weight-bearing ability; neurovascular status'],
workup: [
['Bedside', ['Joint aspiration before antibiotics when possible: Gram stain, culture, crystals, cell count with differential', 'POCUS to confirm effusion and guide the tap']],
['Labs', ['CBC, ESR/CRP, blood cultures; uric acid is unreliable in the acute flare', 'Gonococcal NAAT (urine/cervix/throat/rectum as exposed); Lyme serology in endemic regions']],
['Imaging', ['X-ray for fracture, gas, chondrocalcinosis', 'MRI for osteomyelitis; US for effusion and guided aspiration']]
],
redFlags: ['Fever with a hot swollen joint', 'Prosthetic joint involved', 'Immunosuppression, diabetes, or IVDU', 'Inability to bear weight or move the joint', 'Overlying skin breaks or pustules', 'Synovial fluid that is purulent or Gram-stain positive (WBC >50,000/µL supports but does not prove infection)'],
disposition: [
['Discharge', 'Crystal-proven flare responding to NSAIDs/colchicine/steroids, non-septic pattern, functioning follow-up. Never inject intra-articular steroid until infection is excluded.'],
['Admit', 'Septic arthritis on IV antibiotics + washout plan, polyarticular systemic disease, uncertain diagnosis needing serial exams.'],
['Emergency aspiration/washout + ortho', 'Purulent joint, prosthetic infection, hemarthrosis with coagulopathy.']
],
pitfalls: ['Antibiotics before aspiration can sterilize the culture — tap first when safe.', 'Gout and septic arthritis coexist — crystals do not exclude infection.', 'Gonococcal arthritis is often a migratory tenosynovitis with skin lesions and a modest synovial WBC.', 'The immunosuppressed patient with a \u201Cmildly\u201D swollen joint can have a septic one — and a synovial WBC well under 50,000.', 'Elderly gout often strikes the knee or midfoot, not the big toe.', 'Do not tap a prosthetic joint through cellulitis; call ortho.'],
pearls: ['A single hot joint is septic until the tap says otherwise — aspirate before antibiotics when safe.', 'Crystals do not exclude infection; gout and septic arthritis coexist.', 'Synovial WBC >50,000/µL is suggestive, not diagnostic — gonococcal and immunocompromised joints run lower.', 'Do not tap a prosthesis through cellulitis; that aspiration belongs to orthopedics.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — arthritis & joint infection', 'IDSA guidance on native and prosthetic joint infection', 'EULAR crystal arthritis recommendations; Tintinalli\u2019s 9th ed. — musculoskeletal emergencies']
},
{
id: 'coma', name: 'Coma & Depressed LOC', icon: '😴',
tag: 'Protect, correct the two reversible killers, image.',
overview: 'Coma is failure of both hemispheres or the ascending reticular activating system. Airway, glucose, oxygen, and naloxone/thiamine are given empirically while the exam localizes the lesion (breathing pattern, pupils, brainstem reflexes, motor tone) and imaging defines structure.',
approach: [
    'Airway, glucose, oxygen — naloxone and thiamine as indicated (never delay dextrose).',
    'Pupils, breathing pattern, and brainstem reflexes localise structure vs toxin.',
    'Non-contrast CT for structural causes; EEG if non-convulsive status is possible.',
    'Do not label it “alcohol” without glucose, a CT, and a level.'
],
dontMiss: [
['Hypoglycemia', 'critical', 'Glucose every time — the most treatable cause of coma.'],
['Opioid overdose', 'critical', 'Pinpoint pupils + hypoventilation — titrate naloxone to breathing.'],
['Herniation (uncal / central)', 'critical', 'Blown or unilateral pupil, posturing, Cushing reflex — hypertonic saline/mannitol, neurosurgery.'],
['Massive ICH / SAH / basilar occlusion', 'critical', 'Non-contrast CT immediately; basilar thrombosis can present as coma without lateralizing signs.'],
['Non-convulsive status epilepticus', 'critical', 'Coma with subtle myoclonus — EEG; treat without waiting.'],
['Meningoencephalitis', 'critical', 'Fever or no focus — empiric therapy when suspected.'],
['Wernicke encephalopathy', 'critical', 'Alcohol use/malnutrition — give thiamine with (or immediately after) glucose; never delay dextrose.'],
['Toxic-metabolic (CO, TCA, hypothermia)', 'critical', 'ECG, temperature, anion/osmolar gaps; deep coma with intact pupillary reflexes suggests toxin.']
],
history: ['EMS/family: speed of onset, preceding symptoms (headache, seizure, fever, chest pain)', 'Access to medications/toxins; alcohol; psychiatric history', 'Trauma — especially falls in the anticoagulated', 'End-organ disease: liver, renal, diabetes, thyroid'],
exam: ['ABCDE; GCS with attention to airway reflexes', 'Pupils: metabolic causes = small and reactive; structural = asymmetric/fixed', 'Breathing pattern: Cheyne-Stokes, central hyperventilation, apneustic', 'Brainstem reflexes: oculocephalic/cold caloric, corneal, cough', 'Motor: tone, symmetry, posturing to noxious stimulus', 'Trauma stigmata; skin for cyanosis, tracks, rash'],
workup: [
['Bedside', ['Glucose immediately; naloxone/thiamine as indicated', 'ECG; VBG/ABG; core temperature']],
['Labs', ['Electrolytes (Na, Ca), renal/hepatic panels, ammonia, lactate, CBC, coagulation', 'Targeted toxicology; TSH; cortisol if endocrine suspicion']],
['Imaging / monitoring', ['Non-contrast head CT first among structural tests', 'EEG for non-convulsive status; LP after imaging when indicated']]
],
redFlags: ['Unequal or fixed-dilated pupils', 'Motor posturing or irregular breathing', 'Falling GCS, seizures, or hyperthermia', 'Hypoglycemia unresponsive to therapy; hypothermia', 'Meningeal signs with rapid progression', 'Anticoagulation with any trauma history'],
disposition: [
['Discharge', 'Rare — only full recovery from a clearly reversible cause with observation and follow-up (e.g., brief hypoglycemia in a reliable setting).'],
['Admit (monitored)', 'Post-ictal or toxic with improving exam and a secured airway plan; correcting metabolic derangements.'],
['ICU / neurosurgery', 'Undifferentiated coma, herniation signs, ICH/SAH, status epilepticus, need for airway protection.']
],
pitfalls: ['Locked-in syndrome mimics coma — check for vertical eye movements.', 'Small reactive pupils + deep coma = toxin more often than structure.', 'Never attribute coma to \u201Calcohol\u201D without glucose, a CT, and a level.', 'Hypothermia halts almost everything — rewarm before declaring brainstem reflexes lost.', 'Non-convulsive status hides inside \u201Cpost-ictal\u201D labels.', 'Never delay dextrose for thiamine — give them together.'],
pearls: ['Glucose, oxygen, and naloxone are given empirically while the exam localizes.', 'Basilar artery occlusion can present as coma without lateralizing signs — think CTA/CTP or MRI if CT is unrevealing.', 'The FOUR score captures brainstem findings that GCS misses.', 'Intact pupillary reflexes in deep coma point toward toxin/metabolic more than structure.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — coma & depressed level of consciousness', 'FOUR score (Wijdicks et al., Ann Neurol 2005)', 'Neurocritical Care Society guidance']
},
{
id: 'pelvic-pain', name: 'Acute Pelvic Pain (Women)', icon: '🩺',
tag: 'Pregnancy status first — then torsion, then the rest.',
overview: 'Acute pelvic pain in women is triaged by pregnancy status and hemodynamic stability. The threats are ectopic pregnancy, ovarian torsion, tubo-ovarian abscess, and hemorrhagic cyst rupture — all imaging-and-surgery decisions made early. Transvaginal ultrasound is the workhorse.',
approach: [
    'Pregnancy test first. Unstable + positive hCG goes to the OR, not the scanner.',
    'Then torsion: sudden unilateral pain — Doppler is supportive, not exclusive.',
    'Transvaginal US is the workhorse; CT when US is non-diagnostic and pregnancy is excluded.',
    'IVF: an IUP does not exclude heterotopic pregnancy.'
],
dontMiss: [
['Ruptured ectopic pregnancy', 'critical', 'hCG first in every patient of childbearing potential; unstable = operating room, not imaging.'],
['Ovarian torsion', 'critical', 'Sudden severe unilateral pain ± mass; Doppler US — delay loses the ovary.'],
['Tubo-ovarian abscess', 'critical', 'PID with mass or sepsis — admission, IV antibiotics, drainage per response.'],
['Hemorrhagic ruptured ovarian cyst', 'critical', 'Sudden pain with free fluid; watch hemodynamics, especially anticoagulated.'],
['Septic abortion / puerperal infection', 'critical', 'Fever + bleeding + uterine tenderness in pregnancy or postpartum.'],
['Appendicitis / diverticulitis', 'emergent', 'GI mimics — CT when US is non-diagnostic and pregnancy excluded.'],
['UTI / kidney stone', 'common', 'Dysuria or flank-to-groin radiation — urinalysis ± CT.'],
['Mittelschmerz / dysmenorrhea / endometriosis', 'common', 'Cyclical patterns with a benign exam.']
],
history: ['LMP, contraception (IUD), fertility treatments (↑torsion/ectopic risk)', 'Pain: sudden vs gradual, unilateral vs central, migration', 'Vaginal bleeding, discharge, fever, dysuria', 'Prior ectopic, PID, pelvic surgery, endometriosis', 'Sexual history and reliability of contraception'],
exam: ['Vitals incl. orthostatics; peritoneal signs', 'Abdomen: rebound, guarding, masses', 'Pelvic: cervical motion tenderness, adnexal mass/tenderness, discharge', 'Quantify any bleeding; volume status'],
workup: [
['Bedside', ['Urine/serum hCG immediately', 'POCUS then transvaginal US — the definitive study']],
['Labs', ['Quantitative β-hCG, CBC, type & screen, CRP; urinalysis', 'Cervical cultures / wet mount for PID']],
['Imaging', ['Transvaginal US for ectopic, torsion, masses', 'CT when US non-diagnostic and pregnancy excluded; MRI in pregnancy if needed']]
],
redFlags: ['Positive hCG with pain or bleeding — ectopic until excluded', 'Hypotension, syncope, or peritoneal signs', 'Sudden severe unilateral pain (torsion)', 'Fever with adnexal tenderness (TOA)', 'IUD in situ with pain or pregnancy', 'Bleeding at any stage of pregnancy'],
disposition: [
['Discharge', 'Benign/cyclical pain, negative hCG, normal imaging when indicated, reliable follow-up with strict return precautions.'],
['Admit', 'PID/TOA on IV antibiotics, medically-managed ectopic per criteria, hemorrhagic cyst under observation, uncontrolled pain.'],
['Emergency surgery / IR', 'Ruptured ectopic, ovarian torsion, ruptured TOA, unstable hemorrhagic cyst.']
],
pitfalls: ['Ectopic with no risk factors and a normal exam is common — the hCG decides.', 'Preserved Doppler flow does not exclude torsion (dual blood supply).', 'Heterotopic pregnancy in IVF — an IUP does not exclude an ectopic.', 'PID with an IUD can progress rapidly to TOA.', 'Don\u2019t assume threatened abortion — image first.'],
pearls: ['Pregnancy test first, always — unstable + positive hCG goes to the OR, not the scanner.', 'Ovarian torsion is a clinical diagnosis; Doppler is supportive, not exclusive.', 'Free fluid in the pouch of Douglas with a positive hCG is ruptured ectopic until proven otherwise.', 'IVF patients can have heterotopic pregnancy — seeing an IUP is not enough.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — acute pelvic pain', 'ACOG Practice Bulletins (ectopic pregnancy; PID)', 'Tintinalli\u2019s 9th ed. — gynecologic emergencies']
},
{
id: 'vaginal-bleeding', name: 'Vaginal Bleeding', icon: '🌸',
tag: 'Pregnant or not? Stable or not? Those two answers run the show.',
overview: 'Vaginal bleeding splits cleanly by pregnancy status. In pregnancy: ectopic, miscarriage, molar, placenta previa (no vaginal exam!), abruption, and postpartum hemorrhage. Outside pregnancy: anovulatory bleeding, fibroids, cervicitis, malignancy — with coagulopathy and massive bleeding managed first.',
approach: [
    'Two questions: pregnant or not, stable or not.',
    'Resuscitate shock first. TXA within 3 h of PPH (WOMAN).',
    'No digital exam until previa is excluded by US.',
    'Rh-negative unsensitized patients need anti-D; abruption is a clinical diagnosis.'
],
dontMiss: [
['Hemorrhagic shock from any source', 'critical', 'Resuscitate before diagnosing: two IVs, crossmatch. TXA within 3 h of PPH (WOMAN trial); TXA is also used for selected non-pregnant heavy bleeding.'],
['Ectopic pregnancy', 'critical', 'Bleeding + pain + positive hCG — transvaginal US urgently.'],
['Placenta previa', 'critical', 'Painless bright-red bleeding in later pregnancy — NO digital vaginal exam; US first.'],
['Placental abruption', 'critical', 'Painful woody uterus, fetal distress — obstetric emergency, deliver.'],
['Postpartum hemorrhage', 'critical', 'Uterine atony > retained tissue > trauma; uterotonics + bimanual compression pathway.'],
['Retained products / molar pregnancy', 'emergent', 'US; molar = preeclampsia-before-20-weeks picture, oncology referral.'],
['Anovulatory bleeding / fibroids / cervicitis', 'common', 'Common non-pregnant causes; measure hemoglobin burden.'],
['Bleeding disorder / anticoagulation', 'common', 'vWD and coagulopathy hide in \u201Cheavy periods\u201D — ask since menarche.']
],
history: ['Pregnant? LMP, contraception; volume of bleeding (pads/hour, clots, dizziness)', 'Pregnancy stage & prior ultrasounds; trauma (abruption)', 'Postpartum timing (atony vs retained tissue vs infection)', 'Non-pregnant: cycle pattern, intermenstrual or post-coital bleeding, anticoagulants, bleeding since menarche'],
exam: ['Vitals & orthostatics; signs of shock', 'Abdomen: fundal height if pregnant, tenderness, contractions', 'Speculum exam (avoid digital if previa suspected) — source: cervix vs uterine', 'Postpartum: uterine tone, ongoing loss'],
workup: [
['Bedside', ['Urine/serum hCG immediately in all patients of childbearing potential', 'POCUS; pad counting for quantification']],
['Labs', ['CBC, type & screen/crossmatch, Rh status (anti-D for Rh-negative unsensitized patients per pathway); Kleihauer-Betke only if significant fetomaternal hemorrhage is a question', 'Coagulation ± DIC panel in abruption/PPH; quantitative β-hCG; TSH for non-pregnant chronic patterns']],
['Imaging', ['Transvaginal US in pregnancy: IUP vs ectopic, previa, abruption signs', 'US pelvis for non-pregnant structural causes']]
],
redFlags: ['Any bleeding with positive hCG and pain', 'Painless bright-red bleeding in later pregnancy (previa)', 'Painful rigid uterus with fetal distress (abruption)', 'Postpartum bleeding saturating pads rapidly', 'Orthostatic symptoms or hemodynamic instability', 'Bleeding on anticoagulation or with known bleeding disorder'],
disposition: [
['Discharge', 'Non-pregnant, hemodynamically stable, mild anemia with follow-up (gynecology ± iron therapy); threatened miscarriage with viable IUP and reliable care.'],
['Admit', 'Ectopic per criteria, symptomatic miscarriage needing care, moderate bleeding with anemia, anticoagulation reversal issues.'],
['Emergency obstetrics / OR / ICU', 'Placenta previa or abruption in viable pregnancy, postpartum hemorrhage, shock of any source, molar pregnancy.']
],
pitfalls: ['Never do a digital exam when previa is possible — ultrasound first, always. Speculum exam is for obstetrics once previa is excluded or in a controlled setting.', 'A normal early hematocrit reassures falsely — the bleed is ongoing.', 'Rh-negative unsensitized patients need anti-D; Kleihauer-Betke is for quantifying fetomaternal hemorrhage, not a routine type-and-screen substitute.', 'Post-coital bleeding in an older patient = cervical cancer screen.', 'Postpartum \u201Clochia\u201D turning bright red with clots is a hemorrhage, not normal.', 'Ultrasound is insensitive for abruption — the diagnosis is clinical (painful woody uterus, fetal distress).'],
pearls: ['Two questions run the show: pregnant or not, stable or not.', 'Painless bright-red third-trimester bleeding = previa until US says otherwise — no digital exam.', 'TXA reduces PPH death when given within 3 hours (WOMAN).', 'PALM-COEIN organizes non-pregnant AUB; coagulopathy (including vWD) hides in \u201Cheavy periods since menarche.\u201D'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — vaginal bleeding', 'ACOG Practice Bulletins (previa, abruption, PPH)', 'WOMAN trial (Lancet 2017) — TXA in PPH; FIGO PALM-COEIN; RCOG guidance']
},
{
id: 'scrotal-pain', name: 'Scrotal Pain & Swelling', icon: '⚠️',
tag: 'Torsion until proven otherwise — imaging must not delay the OR.',
overview: 'Acute scrotal pain is testicular torsion until proven otherwise. Salvage is highest if detorsion is within about 6 hours, but operate on clinical suspicion — do not wait out a clock. Doppler US helps when the diagnosis is uncertain; a high-riding, transverse testis with an absent cremasteric reflex goes straight to exploration. Fournier gangrene and incarcerated hernia round out the killers.',
approach: [
    'Torsion until proven otherwise — high-riding transverse testis and absent cremasteric reflex go to the OR.',
    'Do not delay exploration for Doppler when suspicion is high.',
    'Salvage is highest within ~6 h, but operate on suspicion even later.',
    'Then Fournier, incarcerated hernia, and trauma.'
],
dontMiss: [
['Testicular torsion', 'critical', 'Sudden pain, high-riding transverse testis, absent cremasteric reflex — urology/OR immediately; US must not delay exploration when suspicion is high.'],
['Fournier gangrene', 'critical', 'Perineal pain, crepitus, sepsis, diabetes — broad antibiotics + debridement.'],
['Incarcerated / strangulated inguinal hernia', 'critical', 'Irreducible tender groin mass with obstruction signs — surgery.'],
['Traumatic rupture / testicular hematoma', 'critical', 'Scrotal trauma — US; rupture needs repair within hours.'],
['Epididymo-orchitis', 'common', 'Gradual pain, fever, dysuria; Prehn sign is unreliable — antibiotics by age and risk.'],
['Torsion of the appendix testis', 'common', 'Prepubertal, \u201Cblue-dot\u201D sign; conservative care per urology.'],
['Hydrocele / varicocele', 'common', 'Chronic swelling, transillumination or bag-of-worms feel.']
],
history: ['Onset: abrupt severe (torsion) vs gradual (infection)', 'Nausea/vomiting with torsion is classic', 'Trauma; prior self-resolving episodes (intermittent torsion)', 'Sexual activity / urethral symptoms (epididymitis)', 'Diabetes and immunosuppression (Fournier)'],
exam: ['Testis position & lie: high-riding, horizontal = torsion', 'Cremasteric reflex — absent in torsion', 'Point tenderness: upper pole (appendix testis), epididymis vs diffuse testis', 'Groin exam for hernia; perineal crepitus and odor', 'Prehn sign — supportive only, unreliable'],
workup: [
['Bedside', ['Immediate urology consult when torsion is suspected — imaging must not delay the OR', 'POCUS Doppler: flow absence; whirlpool sign of the cord']],
['Labs', ['Urinalysis & cultures (infection vs torsion overlap)', 'CBC, CRP; lactate/sepsis screen for Fournier; glucose']],
['Imaging', ['Doppler US when diagnosis uncertain and OR not imminent', 'CT pelvis for Fournier extent; X-ray for subcutaneous gas']]
],
redFlags: ['Sudden severe testicular pain with vomiting', 'High-riding or transverse testis', 'Absent cremasteric reflex', 'Perineal pain with crepitus or sepsis (Fournier)', 'Irreducible groin mass', 'Scrotal trauma with persistent pain (rupture)'],
disposition: [
['Discharge', 'Epididymitis on appropriate antibiotics (cover gonorrhea/chlamydia), appendix-testis torsion with NSAIDs per urology, resolved mechanical pain with follow-up.'],
['Admit', 'Epididymo-orchitis needing IV therapy, Fournier post-debridement, monitored equivocal cases.'],
['Emergency surgery', 'Testicular torsion (immediate exploration), Fournier debridement, strangulated hernia, testicular rupture.']
],
pitfalls: ['A negative US does not exclude torsion when the story fits — explore.', 'Recurrent self-resolving pain = intermittent torsion — needs elective fixation.', 'Epididymitis in an older diabetic can coexist with torsion.', 'Fournier pain precedes skin changes — examine for deep tenderness and crepitus.', 'Delaying surgery for CT in suspected torsion is the classic litigation case.', 'Salvage falls after ~6 h but later exploration can still save a testis — do not withhold surgery because \u201Cit has been too long.\u201D'],
pearls: ['High-riding, transverse testis + absent cremasteric reflex = OR now, not Doppler first.', 'Nausea/vomiting with acute scrotal pain is torsion until proven otherwise.', 'Prehn sign is unreliable — do not use it to rule torsion in or out.', 'Fournier is a clinical diagnosis; skin findings lag the pain and sepsis.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — scrotal pain', 'AUA urotrauma & acute scrotum guidance', 'Tintinalli\u2019s 9th ed. — urologic emergencies']
},
{
id: 'seizures', name: 'Seizures', icon: '⚡',
tag: 'Stop the seizure, find the reversible cause, decide if this is status.',
overview: 'A seizure lasting ≥5 minutes, or recurrent seizures without recovery, is status epilepticus — treat it as such. Benzodiazepines first (AES 2016), then any of levetiracetam, valproate, or fosphenytoin at full ESETT doses. Glucose, pregnancy (eclampsia = magnesium), fever/meningitis, and sodium are the reversible checks that cannot wait.',
approach: [
    '≥5 min continuous, or recurrent without recovery, is status — treat it as such.',
    'Benzodiazepines first (adequate dose). Then levetiracetam, valproate, or fosphenytoin at full ESETT doses.',
    'Reversible checks that cannot wait: glucose, pregnancy (magnesium), fever/meningitis, sodium.',
    'A patient who is not waking up may be in non-convulsive status.'
],
dontMiss: [
['Convulsive status epilepticus', 'critical', '≥5 min continuous or ≥2 seizures without recovery. IM midazolam or IV lorazepam first (AES 2016 / RAMPART). Then levetiracetam 60 mg/kg (max 4.5 g), valproate 40 mg/kg (max 3 g), or fosphenytoin 20 mg PE/kg — ESETT 2019 showed equivalent efficacy (~47%).'],
['Eclampsia', 'critical', 'Seizure in pregnancy or ≤6 weeks postpartum — magnesium sulfate, not a conventional AED as first-line; deliver.'],
['Hypoglycemia / hyponatremia / isoniazid', 'critical', 'Glucose every time. Severe hyponatremia: careful 3% saline. INH: pyridoxine in gram-for-gram equivalent.'],
['ICH / SAH / CNS infection', 'critical', 'First seizure with fever, headache, anticoagulation, or incomplete recovery — CT ± LP, antimicrobials if meningitis is possible.'],
['Non-convulsive status epilepticus', 'critical', 'Prolonged post-ictal state or coma with subtle twitching — EEG; treat empirically if high suspicion.'],
['Eclampsia mimics / PRES / TTP', 'emergent', 'Visual change, hypertension, thrombocytopenia — the seizure is the siren, not the diagnosis.'],
['Alcohol withdrawal seizure', 'common', 'Usually brief, within 48 h of stopping; still exclude other causes the first time. Benzodiazepines treat the withdrawal, not a new AED.'],
['Unprovoked first seizure / known epilepsy breakthrough', 'common', 'Back to baseline, normal exam: neuro follow-up. Breakthrough: levels, infection, missed doses, alcohol.']
],
history: ['Duration, recovery of consciousness, number of events, tongue bite, incontinence', 'Pregnancy / postpartum; fever, HIV, immunosuppression, travel', 'AED list and adherence; alcohol/benzodiazepine withdrawal; INH, tramadol, bupropion', 'Head trauma, anticoagulation, prior epilepsy, developmental history'],
exam: ['Ongoing convulsive activity vs post-ictal vs unresponsive (non-convulsive)', 'Glucose, SpO₂, temperature; pupil and focal neuro findings', 'Meningismus, rash, trauma from the fall', 'Blood pressure (eclampsia, PRES, ICH)'],
workup: [
['Bedside', ['Glucose immediately; airway and pulse oximetry', 'ECG (QT, ischemia, TCA); core temperature']],
['Labs', ['Na, Ca, Mg, glucose, CBC, renal/hepatic panels, AED levels if relevant', 'hCG; CK after prolonged convulsions; toxicology as indicated']],
['Imaging / EEG', ['Non-contrast CT for first seizure with incomplete recovery, focal signs, trauma, anticoagulation, HIV, or age >40–50 without a clear provoked cause', 'LP if CNS infection is possible after imaging', 'EEG for suspected non-convulsive status']]
],
redFlags: ['Seizure ≥5 minutes or no return to baseline', 'Pregnancy or recent postpartum', 'Fever, meningismus, or immunocompromise', 'Focal deficit, trauma, or anticoagulation', 'Status not responding to a benzodiazepine', 'Infantile spasm or neonatal seizure (different pathway)'],
disposition: [
['Discharge', 'Returned to baseline after a typical event in known epilepsy, or a first unprovoked seizure with a normal exam and no red flags — driving counselling, close neurology follow-up, safety-net advice.'],
['Admit', 'Prolonged post-ictal state, first seizure with an unclear workup, withdrawal with ongoing risk, infection under treatment, social/safety concerns.'],
['ICU / RSI / EEG', 'Established or refractory status, eclampsia, ICH, need for airway protection or continuous EEG.']
],
pitfalls: ['Under-dosing benzodiazepines is the most common treatable error in status.', 'Valproate is contraindicated in pregnancy and in some mitochondrial disease — choose levetiracetam or fosphenytoin.', 'Do not start a daily AED after a single unprovoked seizure solely because it happened in the ED — shared decision with neurology (ILAE).', 'Psychogenic non-epileptic seizures occur (~10% in ESETT) — still treat until you are sure; then stop stacking AEDs.', 'A \u201Cpost-ictal\u201D patient who is not waking up may be in non-convulsive status.'],
pearls: ['Status starts at 5 minutes — do not wait for 20.', 'After benzos, ESETT: levetiracetam, valproate, and fosphenytoin are equivalent; pick one at a full dose and move on.', 'Eclampsia is magnesium and delivery, not phenytoin-first.', 'Glucose, sodium, pregnancy, and fever are the four checks that change the drug.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — seizures', 'AES 2016 evidence-based guideline for convulsive status epilepticus', 'ESETT (Kapur et al., NEJM 2019); RAMPART (Silbergleit et al., NEJM 2012)', 'ACOG / NICE eclampsia — magnesium sulfate']
},
{
id: 'sore-throat', name: 'Sore Throat & Neck', icon: '😷',
tag: 'Airway first — then the deep spaces that kill.',
overview: 'Most sore throats are viral. The ED task is to find the airway and deep-space infections: epiglottitis, peritonsillar and retropharyngeal abscess, Ludwig angina, and Lemierre syndrome. Do not force a tongue-blade exam in a drooling, tripod patient. Centor/McIsaac gates testing for GAS — it does not rule out the killers.',
approach: [
    'Airway first. Tripod + drool = skilled airway, not a tongue blade.',
    'Hunt deep-space infection: epiglottitis, PTA, RPA, Ludwig, Lemierre.',
    'Centor/McIsaac gates GAS testing — it does not exclude the killers.',
    'Throat pain with exertional features in a vasculopath still needs an ECG.'
],
dontMiss: [
['Acute epiglottitis (supraglottitis)', 'critical', 'Drooling, tripoding, muffled voice, stridor — keep the patient sitting, call airway experts, do not force a tongue blade. Adult epiglottitis is now more common than pediatric in vaccinated populations. Lateral neck x-ray (thumbprint) only if stable.'],
['Ludwig angina', 'critical', 'Floor-of-mouth brawny edema, tongue elevation, dental source — early airway and IV antibiotics covering oral flora.'],
['Retropharyngeal abscess', 'critical', 'Fever, neck stiffness, drooling in a child (or adult after instrumentation) — CT neck with contrast once the airway is safe.'],
['Lemierre syndrome', 'critical', 'Pharyngitis then septic thrombophlebitis of the IJ (Fusobacterium) — persistent fever, neck pain, pulmonary septic emboli. CT/US of the neck + blood cultures + prolonged antibiotics.'],
['Peritonsillar abscess', 'emergent', 'Trismus, uvular deviation, hot-potato voice — drain + antibiotics. Distinguish from epiglottitis before you put a needle in.'],
['Diphtheria / angioedema / anaphylaxis', 'critical', 'Gray membrane, travel/unimmunized; or rapid swelling after ACE-inhibitor or allergen — airway + epinephrine as indicated.'],
['ACS presenting as throat pain', 'emergent', 'Especially women, diabetics, and the elderly — ECG if the story is exertional or accompanied by diaphoresis/dyspnea.'],
['Viral pharyngitis / GAS', 'common', 'Centor/McIsaac to gate testing; treat confirmed GAS. Most do not need antibiotics.']
],
history: ['Tempo: hours (epiglottitis, angioedema) vs days (PTA, viral)', 'Drooling, trismus, voice change, inability to swallow saliva', 'Dental pain or recent extraction (Ludwig)', 'Immunization (Hib, diphtheria); travel; ACE-inhibitor use', 'Sexual history (gonococcal pharyngitis); immunosuppression'],
exam: ['Work of breathing and preferred posture — do not lie the unstable patient down', 'Floor of mouth, tongue elevation, neck crepitus or swelling', 'Tonsillar asymmetry, uvular deviation, trismus', 'IJ tenderness; lung findings (septic emboli)', 'Skin: rash of scarlet fever, membrane of diphtheria'],
workup: [
['Bedside', ['Airway assessment first; flexible nasopharyngoscopy by a skilled operator if stable and epiglottitis is possible', 'Do not force a complete oropharyngeal exam in stridor/drooling']],
['Labs', ['Centor-gated RADT/culture for GAS in typical pharyngitis', 'CBC, blood cultures if toxic; throat NAAT for gonorrhea when indicated']],
['Imaging', ['CT neck with contrast for deep-space abscess once the airway is secure', 'Lateral neck x-ray only in a stable patient if it will not delay airway care']]
],
redFlags: ['Drooling, tripoding, stridor, or sitting bolt upright', 'Trismus or a muffled / hot-potato voice', 'Floor-of-mouth swelling or an elevated tongue', 'Toxic appearance with delayed neck pain after pharyngitis (Lemierre)', 'Rapidly progressive swelling after ACE-inhibitor or allergen', 'Inability to swallow saliva'],
disposition: [
['Discharge', 'Viral or confirmed GAS pharyngitis with a safe airway, taking fluids, reliable follow-up. Analgesia; antibiotics only for GAS or a drained PTA on an oral regimen per local protocol.'],
['Admit', 'PTA after drainage if toxic or unable to take fluids, severe pharyngitis in the immunocompromised, recovering deep-space infection on IV antibiotics.'],
['Airway team / ICU / OT', 'Epiglottitis, Ludwig, RPA with airway threat, Lemierre with septic emboli, angioedema of the tongue/floor of mouth.']
],
pitfalls: ['A tongue-blade exam in epiglottitis can precipitate complete obstruction.', 'Centor scores do not exclude epiglottitis, PTA, or Lemierre.', 'Adult epiglottitis is often missed because we still think of it as a pediatric Hib disease.', 'Needle aspiration of a \u201CPTA\u201D that is actually a carotid aneurysm or an epiglottic problem is disastrous — confirm anatomy.', 'Sore throat + chest discomfort in a vasculopath is ACS until the ECG says otherwise.'],
pearls: ['Tripod + drool = airway team, not a throat swab.', 'Ludwig is a floor-of-mouth disease — look up from below the mandible.', 'Pharyngitis that \u201Cgot better\u201D then the patient became septic with neck pain = Lemierre until CT/US of the IJ is negative.', 'Centor gates GAS testing; it is not a license to skip the airway exam.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — sore throat', 'IDSA 2012 GAS pharyngitis guideline; Centor/McIsaac', 'Tintinalli\u2019s 9th ed. — deep neck infections']
},
{
id: 'hemoptysis', name: 'Hemoptysis', icon: '🫁',
tag: 'Protect the good lung; find whether this is massive.',
overview: 'Hemoptysis is blood from below the glottis. First separate true hemoptysis from hematemesis and nasopharyngeal bleeding. Massive hemoptysis is defined variably (often ≥100 mL/h or ≥300–500 mL/24 h, or any volume that threatens the airway) — the practical definition is airway compromise or abnormal gas exchange. Place the bleeding lung down, call IR and pulmonology, and resuscitate.',
approach: [
    'Confirm true hemoptysis (not hematemesis or a nosebleed).',
    'Massive is about the airway and gas exchange, not a millilitre cutoff.',
    'Bleeding lung down; call bronchoscopy and IR.',
    'Stable small-volume still needs a cancer/TB/PE plan in the right host.'
],
dontMiss: [
['Massive / airway-threatening hemoptysis', 'critical', 'Sit up, bleeding-side down, low-volume ventilation of the good lung; reverse coagulopathy; call bronchoscopy and bronchial-artery embolization.'],
['Diffuse alveolar hemorrhage', 'critical', 'Falling hemoglobin, dropping saturations, bilateral infiltrates — capillaritis, cocaine, anticoagulants; bronchoscopy, immunosuppression per cause.'],
['Pulmonary embolism', 'critical', 'Hemoptysis can be the presenting feature; do not assume \u201Cbronchitis\u201D in a patient with VTE risks.'],
['Lung cancer / aspergilloma / bronchiectasis', 'critical', 'The most common sources of massive bleeding in adults — CT and IR, not a discharge inhaler.'],
['TB / necrotizing pneumonia / lung abscess', 'critical', 'Fever, night sweats, endemic or reactivation risk — isolation + imaging + micro.'],
['Mitral stenosis / pulmonary venous hypertension', 'emergent', 'The cardiac cause that is easy to forget — murmur, AF, echo.'],
['Bronchitis / mild bronchiectasis flare', 'common', 'Small-volume, clear CXR, stable — still need a plan to exclude cancer in smokers over 40.']
],
history: ['Volume, duration, true cough vs vomiting vs epistaxis', 'Fever, weight loss, night sweats, TB exposure, smoking', 'VTE risks; cocaine/crack; anticoagulation', 'Known bronchiectasis, aspergilloma, cancer, rheumatic heart disease'],
exam: ['Airway and work of breathing; which side sounds worse', 'Hemodynamic stability; fever', 'Clubbing, cachexia, cervical nodes', 'Cardiac: rumbling diastolic murmur of MS, AF', 'Oropharynx and nose to exclude an upper source'],
workup: [
['Bedside', ['Upright posture; bleeding lung dependent if the side is known', 'SpO₂, CXR, POCUS lungs; type & crossmatch if more than streaks']],
['Labs', ['CBC (the hemoglobin lags), coagulation, type & screen', 'Sputum AFB/GeneXpert when TB is possible; BNP if cardiac suspicion; D-dimer/PE pathway if indicated']],
['Imaging / procedures', ['CXR first; CT chest (CTPA if PE is on the list) is the localizing study in stable patients', 'Bronchoscopy for ongoing airway bleeding; bronchial-artery embolization for massive bleeding']]
],
redFlags: ['Any volume with hypoxia, shock, or inability to protect the airway', 'Rapidly falling hemoglobin or bilateral infiltrates (DAH)', 'TB risks with hemoptysis', 'Anticoagulation with more than streaks', 'Known aspergilloma, cavity, or cancer', 'Hemoptysis plus VTE risks'],
disposition: [
['Discharge', 'Streaks in a well patient with a clear CXR, no cancer/TB/VTE red flags, and arranged follow-up (including outpatient CT in smokers ≥40 y with a first episode).'],
['Admit', 'Recurrent or moderate-volume bleeding, need for further imaging, infection on IV therapy, anticoagulation management.'],
['ICU / IR / bronchoscopy', 'Airway-threatening or massive hemoptysis, DAH, unstable PE, need for embolization or intubation.']
],
pitfalls: ['Intubating and laying the bleeding lung up drowns the good lung — bleeding side down.', 'A normal CXR does not exclude a significant source — CT is the localizer in the stable patient.', 'Do not use nebulized TXA as the only plan for massive bleeding — it is an adjunct, not a substitute for IR/airway.', 'Hematemesis and posterior epistaxis are repeatedly mislabelled as hemoptysis — look in the mouth and the nose.', 'Cancer until proven otherwise in a smoker with new hemoptysis, even if the volume is small.'],
pearls: ['Massive is about gas exchange and airway, not a millilitre cutoff.', 'Bleeding lung down, good lung up.', 'Bronchial-artery embolization is the intervention of choice for most massive non-traumatic hemoptysis.', 'Always ask: is this actually hematemesis or a nosebleed?'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — hemoptysis', 'BTS / ACCP hemoptysis statements; bronchial artery embolization series', 'Tintinalli\u2019s 9th ed. — pulmonary hemorrhage']
},
{
id: 'shock', name: 'Shock', icon: '💔',
tag: 'Name the pump, the tank, the pipes, or the obstruction.',
overview: 'Shock is tissue hypoperfusion, not a blood-pressure number. Classify early with history, exam, and a RUSH/POCUS exam: hypovolemic, distributive, cardiogenic, obstructive — mixed pictures are the rule in the ED. Lactate and serial exams beat a single MAP. Fluids help hypovolemic and distributive shock; they harm the wet cardiogenic and the obstructed RV.',
approach: [
    'Shock is hypoperfusion, not a blood-pressure number.',
    'Assign the box with RUSH/POCUS: empty tank, broken pump, leaky pipes, obstruction.',
    'Fluids help hypovolemic and distributive shock; they harm wet cardiogenic and the obstructed RV. In septic shock, use balanced crystalloid then dynamic reassessment; start norepinephrine if MAP remains low during resuscitation.',
    'The drug follows the box: blood, epinephrine, norepinephrine, needle, or OR.'
],
dontMiss: [
['Obstructive shock (tamponade, tension PTX, massive PE)', 'critical', 'POCUS first: effusion with RA/RV collapse, absent lung sliding, RV strain. Needle/finger thoracostomy, pericardiocentesis, or reperfusion — not a 30 mL/kg bolus.'],
['Cardiogenic shock', 'critical', 'Wet, cool, JVP up, B-lines, poor LV — cautious fluids, vasopressors (norepinephrine), urgent revascularization if ACS (2025 ACC/AHA ACS).'],
['Septic / distributive shock', 'critical', 'Antibiotics within 1 h. Use balanced crystalloid for initial resuscitation, then dynamic reassessment to guide further fluid. Start norepinephrine if MAP remains low (SSC 2026).'],
['Neurogenic shock', 'critical', 'Hypotension with warm dry skin after spinal injury — fluids then norepinephrine; do not treat as hypovolemia alone.'],
['Hemorrhagic / hypovolemic shock', 'critical', 'Blood, source control, TXA in trauma/PPH per pathway; do not dilute with litres of crystalloid in exsanguination.'],
['Anaphylactic shock', 'critical', 'IM epinephrine anterolateral thigh immediately, then fluids and aerosolized epinephrine if airway edema — do not wait for a rash.'],
['Adrenal crisis / occult bleeding / mixed', 'emergent', 'Steroid-dependent, meningococcemia, GI bleed without hematemesis, ruptured AAA — treat while you look.'],
['Compensated / occult shock', 'common', 'Normal BP with lactate, delayed cap refill, or unexplained tachypnea — especially in the young and pregnant.']
],
history: ['Tempo: sudden (PE, tamponade, anaphylaxis, arrhythmia) vs hours (sepsis, bleed)', 'Chest pain, dyspnea, fever, allergen, trauma, GI bleeding, pregnancy', 'Heart failure, anticoagulation, adrenal replacement, immunocompromise', 'Drugs: beta-blockers, calcium-channel blockers, antihypertensives'],
exam: ['Skin: warm vs cool; mottling; urticaria', 'JVP, heart sounds (muffled, new murmur), lung sliding and B-lines', 'Pulse pressure, cap refill, mental status, urine output', 'Abdomen and pelvis: AAA, pregnancy, peritonism, occult blood', 'Anaphylaxis: stridor, wheeze, swelling — or none of these'],
workup: [
['Bedside', ['RUSH/POCUS: pump, tank, pipes, sliding, DVT', 'ECG, SpO₂, glucose, lactate', 'Finger thoracostomy / pericardiocentesis when the ultrasound diagnosis is made in extremis']],
['Labs', ['Lactate, VBG, CBC, coagulation, troponin, cultures before antibiotics when they will not delay them', 'Type & crossmatch; cortisol/TSH if endocrine shock is possible', 'Pregnancy test in patients of childbearing potential']],
['Imaging', ['CXR; CT only in the stabilized patient', 'CTPA, CTA aorta, or FAST as the leading diagnosis dictates']]
],
redFlags: ['Hypotension with cool skin or rising lactate', 'Muffled heart sounds or absent lung sliding', 'Anaphylaxis features after an exposure', 'GI bleeding, AAA, or positive hCG with shock', 'Chest pain with shock (ACS, dissection, PE, tamponade)', 'Fever with neutropenia or asplenia'],
disposition: [
['Discharge', 'Almost never from undifferentiated shock. Occasional fully reversed anaphylaxis after a full observation window with a prescription for epinephrine autoinjectors and allergy follow-up.'],
['Admit (HDU)', 'Resolved occult hypoperfusion under monitoring, treated infection with improving lactate, compensated cardiogenic states pending further testing.'],
['ICU / theatre / cath lab / IR', 'Any shock needing vasopressors, airway, massive transfusion, reperfusion, or source-control surgery.']
],
pitfalls: ['A \u201Cnormal\u201D blood pressure does not exclude shock — use lactate, mentation, and skin.', 'Fluids are not interchangeable across shock phenotypes: cardiogenic and obstructive shock need immediate cause-directed care.', 'Epinephrine in anaphylaxis is IM first, not an IV drip you wait to mix.', 'Pressors without a diagnosis: look at the RV and the pericardium before the third litre.', 'Beta-blocked and the elderly decompensate without tachycardia.'],
pearls: ['Four boxes: empty tank, broken pump, leaky pipes, obstruction. POCUS assigns the box in minutes.', 'Norepinephrine is the first-line vasopressor for septic shock (SSC).', 'Blood for blood loss; epinephrine for anaphylaxis; needle for tension; OR for the ruptured AAA — the drug follows the box.', 'Serial lactate and cap refill outperform a single MAP target.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — shock', 'Surviving Sepsis Campaign 2021 and 2026 update', '2025 ACC/AHA ACS Guideline (cardiogenic shock); RUSH protocol literature']
},
{
id: 'nausea-vomiting', name: 'Nausea & Vomiting', icon: '🤢',
tag: 'Not a GI complaint until the brain, heart, sugar, and pregnancy are clear.',
overview: 'Vomiting is a final common pathway. The ED sequence is: glucose, pregnancy, ECG (especially in women and diabetics), surgical abdomen/obstruction, raised ICP, and toxin/metabolic (DKA, adrenal, hyponatremia, cannabinoid hyperemesis). Ondansetron is a treatment, not a diagnosis.',
approach: [
    'Glucose, pregnancy, ECG — before the antiemetic is the diagnosis.',
    'Pain before vomiting leans surgical; bilious or feculent vomiting is obstruction until imaged.',
    'Then raised ICP, DKA/adrenal, and cannabinoid hyperemesis as an exclusion.',
    'Ondansetron is a treatment, not a workup.'
],
dontMiss: [
['Bowel obstruction / volvulus / perforation', 'critical', 'Bilious or feculent vomiting, distension, prior surgery, hernia — CT. Sigmoid/cecal volvulus is time-critical ischemia.'],
['ACS / inferior MI', 'critical', 'Isolated vomiting, especially in women, elderly, and diabetics — ECG before the antiemetic is blamed for the \u201Ccure.\u201D'],
['Raised ICP / SAH / posterior stroke', 'critical', 'Headache, diplopia, ataxia, no abdominal findings — CT/MRI. Projectile vomiting is a clue, not a rule.'],
['DKA / HHS / adrenal crisis / hyponatremia', 'critical', 'Glucose and electrolytes in every unexplained case. Steroid-dependent patients get stress-dose steroids.'],
['Pregnancy complications (hyperemesis vs ectopic vs molar)', 'critical', 'hCG first; ketones and electrolytes in hyperemesis; ectopic if pain + bleeding.'],
['Acute glaucoma / testicular or ovarian torsion', 'emergent', 'The referred-pain mimics — eye and groin exams exist for a reason.'],
['Cannabinoid hyperemesis / cyclic vomiting / gastritis', 'common', 'Hot-water bathing is a cannabinoid clue; capsaicin and haloperidol are options. Still exclude the killers once.']
],
history: ['Duration, bilious vs food vs blood, ability to keep down liquids', 'Pain: before vomiting (surgical) vs after (medical/gastroenteritis)', 'Headache, visual change, chest pain, pregnancy possibility', 'Diabetes, adrenal disease, cannabis, chemotherapy, prior abdominal surgery, hernias'],
exam: ['Vitals including glucose; orthostatics', 'Abdomen: distension, hernias, peritoneal signs, succussion splash', 'Neuro: pupils, papilledema, ataxia, neck stiffness', 'Eye (glaucoma), groin (torsion), pregnancy'],
workup: [
['Bedside', ['Glucose, hCG, ECG', 'POCUS: AAA, free fluid, IUP, B-lines']],
['Labs', ['Electrolytes including Na, K, Mg; VBG/ketones if DKA possible; lipase', 'LFTs, CBC, renal panel; cortisol if adrenal crisis is possible']],
['Imaging', ['CT abdomen/pelvis with contrast for obstruction/ischemia when suspected', 'CT/MRI head for raised-ICP features; AXR is insensitive for obstruction']]
],
redFlags: ['Bilious or feculent vomiting, or vomiting with peritonitis', 'Chest pain, dyspnea, or diaphoresis with vomiting', 'Headache, diplopia, or ataxia', 'Glucose high or very low; steroid-dependent patient', 'Positive hCG with pain or bleeding', 'Intractable vomiting with severe electrolyte derangement'],
disposition: [
['Discharge', 'Gastroenteritis or cannabinoid hyperemesis after successful oral challenge, normal vitals and labs when indicated, reliable follow-up. Driving advice if sedating antiemetics were given.'],
['Admit', 'Obstruction without ischemia, DKA on a protocol, hyperemesis with ketosis not yet reversed, inability to tolerate oral intake in a high-risk host.'],
['Theatre / ICU / cath lab', 'Perforation, ischemic bowel/volvulus, ACS, raised ICP, adrenal crisis, airway from aspiration.']
],
pitfalls: ['Treating with ondansetron and discharging a missed inferior MI or SBO is a classic error.', 'AXR misses a large fraction of obstruction — CT is the test when suspicion is real.', 'Cannabinoid hyperemesis is a diagnosis of exclusion in the first presentations.', 'Ondansetron prolongs QT — look at the ECG in the already-sick.', 'Children with bilious vomiting have malrotation/volvulus until proven otherwise.'],
pearls: ['Pain before vomiting leans surgical; vomiting before pain leans medical — not a law, a nudge.', 'ECG and glucose are cheaper than a missed STEMI or DKA.', 'Bilious vomiting in a neonate or young child is surgical until imaging says otherwise.', 'Steroid-dependent + vomiting = stress-dose steroids, do not wait for a cortisol.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — nausea and vomiting', '2025 ACC/AHA ACS Guideline (atypical symptoms)', 'ADA DKA/HHS guidance; Tintinalli\u2019s 9th ed.']
},
{
id: 'diarrhea', name: 'Diarrhea', icon: '🚽',
tag: 'Volume first; then blood, fever, antibiotics, and the host.',
overview: 'Most ED diarrhea is viral and self-limited. Resuscitate volume, then sort inflammatory (blood, fever, tenesmus) from non-inflammatory. Do not give antibiotics for suspected STEC (HUS risk). C. difficile is now treated with fidaxomicin preferred or vancomycin — not metronidazole first-line (IDSA/SHEA 2021). Always consider mesenteric ischemia in the older vasculopath with pain out of proportion.',
approach: [
    'Volume first.',
    'Inflammatory (blood, fever, tenesmus) vs non-inflammatory.',
    'No antibiotics and no loperamide if STEC is possible. Fidaxomicin (or vancomycin) for C. difficile — not metronidazole first-line.',
    'Pain out of proportion in a vasculopath is CTA, not a stool PCR.'
],
dontMiss: [
['Mesenteric ischemia', 'critical', 'Pain out of proportion ± bloody diarrhea in AF or vasculopathy — CTA, not stool studies first.'],
['Toxic megacolon / fulminant C. difficile / IBD', 'critical', 'Fever, shock, distension, immunosuppression or recent antibiotics — AXR/CT, surgical consult, oral vancomycin ± IV metronidazole for fulminant CDI (IDSA).'],
['STEC / HUS', 'critical', 'Bloody diarrhea after undercooked beef or outbreaks, little or no fever — do not give antibiotics or antimotility agents; watch creatinine, hemolysis, platelets.'],
['Cholera / severe secretory dehydration', 'critical', 'Rice-water stool, travel; WHO-ORS or IV; antibiotics as an adjunct once volume is restored.'],
['Typhoid / invasive bacterial colitis / amoebiasis', 'emergent', 'Fever + blood + travel; cultures; treat per destination and severity. Avoid empiric fluoroquinolones where resistance is high.'],
['Adrenal crisis / thyrotoxicosis / overflow from obstruction', 'emergent', 'Not every loose stool is gastroenteritis — look at the whole patient.'],
['Viral gastroenteritis / traveller\u2019s diarrhea', 'common', 'ORS, loperamide in non-bloody non-febrile adults; azithromycin for severe traveller\u2019s per CDC.']
],
history: ['Volume, blood, fever, duration (>2 weeks changes the list), restaurant/outbreak, travel, antibiotics, PPI, hospital exposure', 'Pain out of proportion, AF, vascular disease', 'Immunosuppression, IBD, pregnancy', 'Sick contacts, water, undercooked meat'],
exam: ['Volume status: orthostatics, mucous membranes, cap refill, mental status', 'Abdomen: peritonitis, distension, masses', 'Fever; rash (typhoid, HSP); joints and uveitis (IBD, reactive)', 'PR exam for blood, overflow, mass'],
workup: [
['Bedside', ['Glucose, orthostatics, pregnancy test when appropriate', 'POCUS for AAA/free fluid if ischemic or surgical features']],
['Labs', ['CBC, creatinine, electrolytes; hemolysis labs if HUS possible (LDH, smear, platelets)', 'Stool: C. difficile when antibiotics/healthcare; culture/PCR multiplex per severity and travel; STEC testing if bloody', 'Blood cultures if febrile and toxic']],
['Imaging', ['CT angiography if mesenteric ischemia is possible', 'CT/AXR if obstruction, megacolon, or perforation is possible — skip imaging in straightforward viral illness']]
],
redFlags: ['Pain out of proportion, AF, or vasculopathy', 'Bloody diarrhea with little fever after ground beef (STEC)', 'Recent antibiotics or hospitalization (C. difficile)', 'Shock, severe abdominal distension, or immunosuppression', 'Fever in a returned traveller', 'Anuria, petechiae, or rising creatinine after a diarrheal prodrome (HUS)'],
disposition: [
['Discharge', 'Non-bloody, well-hydrated after oral challenge, no host red flags — ORS, hygiene, return precautions. Avoid antimotility agents if bloody or febrile.'],
['Admit', 'Inability to maintain volume, severe electrolyte derangement, CDI, inflammatory diarrhea needing IV therapy, HUS under observation, high-risk host.'],
['ICU / surgery / IR', 'Shock, toxic megacolon, mesenteric ischemia, fulminant CDI, severe HUS.']
],
pitfalls: ['Antibiotics for STEC increase HUS risk — do not treat empirically \u201Cjust in case.\u201D', 'Metronidazole is no longer first-line for CDI (IDSA/SHEA 2021): fidaxomicin preferred, vancomycin acceptable.', 'Loperamide in bloody or febrile diarrhea can precipitate megacolon.', '\u201CGastroenteritis\u201D in a 75-year-old with AF is mesenteric ischemia until the pain is explained.', 'HUS presents after the diarrhea is improving — check the smear and the creatinine.'],
pearls: ['Volume first, then inflammatory vs non-inflammatory, then the host.', 'No antibiotics, no loperamide, if STEC is on the list.', 'Fidaxomicin (or vancomycin) for CDI — metronidazole only if those are unavailable and disease is non-severe.', 'Bloody diarrhea + pain out of proportion = CTA, not a stool PCR first.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — diarrhea', 'IDSA/SHEA 2021 focused update: C. difficile (fidaxomicin preferred)', 'IDSA infectious diarrhea 2017; CDC traveller\u2019s diarrhea; STEC/HUS literature']
},
{
id: 'jaundice', name: 'Jaundice', icon: '🟡',
tag: 'Obstructive, hepatocellular, or hemolytic — and is the liver failing?',
overview: 'Jaundice is conjugated or unconjugated, then extrahepatic obstruction vs hepatocellular injury vs hemolysis. The ED questions that change disposition: is this cholangitis, acute liver failure (encephalopathy + INR), massive hemolysis, or acetaminophen? Charcot\u2019s triad is insensitive — fever and jaundice still need a biliary tree look.',
approach: [
    'Three buckets: obstructed duct, injured hepatocyte, lysed red cell.',
    'Fever + jaundice is cholangitis until the biliary tree is seen — Charcot’s triad is insensitive.',
    'INR + encephalopathy = acute liver failure; call transplant early.',
    'Acetaminophen is the reversible cause you must not miss.'
],
dontMiss: [
['Ascending cholangitis', 'critical', 'Fever + jaundice ± RUQ pain (Charcot); shock/confusion (Reynolds). Tokyo criteria. Resuscitate, cultures, broad antibiotics, urgent biliary drainage (ERCP).'],
['Acute liver failure', 'critical', 'INR ≥1.5 plus encephalopathy in a patient with acute liver injury — transplant pathway, NAC if acetaminophen or even if etiology is unclear in many protocols, glucose, ICP precautions.'],
['Acetaminophen (and other toxin) hepatitis', 'critical', 'The treatable cause — level, NAC immediately if delayed, staggered, or unknown time (2023 US/Canada consensus).'],
['Ascending cholangitis mimics / hepatic abscess / sepsis', 'critical', 'Jaundice in the septic patient is not \u201Cjust Gilbert.\u201D'],
['Massive hemolysis (malaria, G6PD, transfusion, sickle, TTP/DIC)', 'emergent', 'Unconjugated bilirubin, falling hemoglobin, LDH, smear; treat the cause.'],
['Acute viral hepatitis / alcoholic hepatitis / choledocholithiasis without cholangitis', 'emergent', 'Image the duct; score alcoholic hepatitis (MELD/MDF) for steroids per protocol once infection is excluded.'],
['Gilbert syndrome / isolated unconjugated / pancreatic head mass', 'common', 'Gilbert is benign (isolated unconjugated, normal everything else). Painless progressive jaundice with weight loss needs outpatient staging but is rarely an ED crash.']
],
history: ['Tempo: hours–days (obstruction, toxin, hemolysis) vs weeks (viral, malignant)', 'Fever, pale stools, dark urine, pruritus (obstructive)', 'Acetaminophen, alcohol, new drugs (amoxicillin-clavulanate, isoniazid), mushrooms', 'Travel, injections, sexual contacts, pregnancy (HELLP, AFLP)', 'Prior gallstones, biliary stents, hemolytic history'],
exam: ['Encephalopathy and asterixis (ALF)', 'Fever, RUQ tenderness, peritoneal signs, Murphy sign', 'Stigmata of chronic liver disease vs an acute unmarked patient', 'Splenomegaly (hemolysis, chronic liver); petechiae (DIC, TTP)', 'Volume status and occult GI bleeding'],
workup: [
['Bedside', ['Glucose (ALF patients crash); POCUS for CBD dilatation, stones, abscess']],
['Labs', ['Fractionated bilirubin, ALT/AST, ALP/GGT, INR, albumin, glucose, CBC, smear/LDH/haptoglobin if hemolysis', 'Acetaminophen level in nearly every acute hepatocellular pattern', 'Blood cultures if febrile; viral serologies; pregnancy test']],
['Imaging / procedures', ['RUQ US first for obstruction', 'CT/MRCP if US is inconclusive; ERCP for cholangitis drainage', 'Avoid unnecessary sedation in ALF — ICP risk']]
],
redFlags: ['Fever with jaundice (cholangitis until excluded)', 'Any encephalopathy or INR ≥1.5 in acute liver injury', 'Hypoglycemia, shock, or GI bleeding', 'Acetaminophen exposure, mushrooms, or new drugs', 'Pale stools and dark urine with duct dilatation', 'Pregnancy with jaundice (HELLP/AFLP)'],
disposition: [
['Discharge', 'Isolated Gilbert-pattern unconjugated bilirubin with normal exam and labs; mild choledocholithiasis without cholangitis and reliable early GI follow-up per local pathway.'],
['Admit', 'Acute hepatitis, choledocholithiasis awaiting ERCP, alcoholic hepatitis under infection screen, hemolysis needing treatment.'],
['ICU / transplant / ERCP now', 'Cholangitis with shock, acute liver failure, acetaminophen with rising INR, HELLP/AFLP.']
],
pitfalls: ['Charcot\u2019s triad is absent in a large fraction of cholangitis — do not wait for it.', 'A \u201Cnormal\u201D acetaminophen level late after ingestion does not exclude toxicity — treat on timing and enzymes/INR.', 'Giving sedation for MRI in ALF can mask and worsen intracranial hypertension.', 'Isolated unconjugated bilirubin with a normal CBC and enzymes is Gilbert until you force it to be something else.', 'Painless jaundice is cancer until staged — but it is rarely the reason they die tonight; cholangitis and ALF are.'],
pearls: ['Three buckets: obstructed duct, injured hepatocyte, lysed red cell. ALP vs ALT vs LDH/smear assigns the bucket.', 'Cholangitis needs source control (ERCP), not antibiotics alone.', 'ALF = INR + encephalopathy. Call transplant early.', 'Acetaminophen is the reversible cause you will not forgive yourself for missing.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — jaundice', 'Tokyo Guidelines 2018/2023 for acute cholangitis', 'EASL / AASLD acute liver failure guidance; 2023 US/Canada acetaminophen consensus']
},
{
id: 'cyanosis', name: 'Cyanosis', icon: '🔵',
tag: 'Blue from lung, heart, or the blood itself?',
overview: 'Cyanosis is ≥4–5 g/dL of deoxyhemoglobin (central) or local stasis (peripheral). The trap is that methemoglobinemia and sulfhemoglobinemia look blue with a \u201Cnormal\u201D PaO₂ and an SpO₂ stuck near 85%. Chocolate-brown blood that does not redden on oxygen is the bedside clue. Treat the airway and the cause — methylene blue for methemoglobin (not in G6PD).',
approach: [
    'Central (tongue/lips) vs peripheral (nail beds only).',
    'SpO₂ stuck ~85% with a normal PaO₂ is a saturation gap — send co-oximetry (methemoglobin, CO).',
    'Chocolate-brown blood that does not redden on oxygen: methylene blue unless G6PD deficiency.',
    'Oxygen will not fix a right-to-left shunt — find it.'
],
dontMiss: [
['Methemoglobinemia', 'critical', 'SpO₂ ~85% despite O₂, chocolate blood, normal PaO₂, saturation gap. Benzocaine, dapsone, nitrites, aniline. Methylene blue 1–2 mg/kg IV unless G6PD deficiency (then ascorbic acid / exchange).'],
['Hypoxemic respiratory failure (PE, pneumonia, shunt, high altitude)', 'critical', 'Central cyanosis that improves (or does not) with oxygen tells you shunt vs V/Q. Treat the lung/PE.'],
['Cyanotic congenital heart disease / Eisenmenger', 'critical', 'The crying infant or the adult with repaired CHD — do not over-oxygenate some mixing lesions; call cardiology. Hyperoxia test at the bedside.'],
['Sulfhemoglobinemia', 'emergent', 'Similar picture to methemoglobin but does not correct with methylene blue — phenazopyridine, sulfonamides; supportive care.'],
['Carbon monoxide is NOT cyanosis', 'emergent', 'CO patients are often cherry or pale, not blue; SpO₂ is falsely normal — CO-oximetry. Listed here because it is the classic mis-association.'],
['Peripheral cyanosis / Raynaud / cold', 'common', 'Warm the patient; central mucous membranes should be pink. If they are not, it is not \u201Cjust cold.\u201D']
],
history: ['Onset with drugs/anesthetics (benzocaine spray), well-water nitrites, dapsone', 'Lung or cardiac disease, altitude, diving', 'Known congenital heart disease', 'Cold exposure vs mucus-membrane involvement'],
exam: ['Central (lips, tongue) vs peripheral (hands, feet only)', 'Work of breathing, lung findings, cardiac murmurs, clubbing (chronic)', 'Blood colour on the gauze: chocolate-brown vs red'],
workup: [
['Bedside', ['SpO₂, ABG with co-oximetry (MetHb, COHb) — a standard ABG PaO₂ will miss methemoglobin', 'Hyperoxia test in infants with suspected CHD']],
['Labs', ['CBC (polycythemia, anemia changes the cyanosis threshold), co-oximetry panel', 'G6PD before repeat methylene-blue doses if the ancestry/history fits']],
['Imaging', ['CXR, CTPA as the lung/PE picture dictates', 'Echo for shunt and pulmonary hypertension']]
],
redFlags: ['Cyanosis of the tongue/lips that does not correct with oxygen', 'SpO₂ near 85% with a normal PaO₂ (saturation gap)', 'Infant with mixing-lesion physiology', 'Recent topical anesthetic, nitrites, or dapsone', 'Shock with cyanosis'],
disposition: [
['Discharge', 'Clear peripheral cyanosis from cold that reverses with warming; known stable chronic cyanotic heart disease at baseline with clinic follow-up.'],
['Admit', 'New unexplained central cyanosis, treated methemoglobinemia under observation, pneumonia/PE on therapy.'],
['ICU', 'Refractory hypoxemia, methemoglobin with shock or level typically >30% (or symptomatic at lower levels), mixing lesions, massive PE.']
],
pitfalls: ['Trusting SpO₂ and PaO₂ without co-oximetry misses methemoglobin and CO.', 'Methylene blue is contraindicated in G6PD deficiency and can worsen hemolysis.', 'Anemic patients may not look blue until they are profoundly hypoxemic (not enough hemoglobin to make 5 g/dL deoxy).', 'Do not assume \u201Cperipheral\u201D until you have seen the tongue.', 'Oxygen will not fix a right-to-left shunt — find it.'],
pearls: ['Saturation gap (pulse ox vs calculated SaO₂ from PaO₂) = dyshemoglobin until co-oximetry.', 'Chocolate blood + SpO₂ 85% on oxygen = methemoglobin.', 'Central vs peripheral is mucous membranes vs nail beds.', 'CO is not a cyanosis diagnosis — do not skip co-oximetry because the patient is not blue.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — cyanosis', 'Goldfrank\u2019s / ACMT methemoglobinemia guidance', 'AHA pediatric CHD / hyperoxia test teaching']
},
{
id: 'overdose', name: 'Poisoning & Overdose', icon: '☠️',
tag: 'Support the airway, find the toxidrome, call the antidote.',
overview: 'The poisoned patient is treated by pattern: ABCDE first, then toxidrome recognition (vitals, pupils, skin, mental status), focused antidotes, and decontamination when appropriate. Paracetamol deserves special respect — treat on probability and timing, not on early symptoms.',
approach: [
    'ABCDE first; never delay glucose.',
    'Name the toxidrome: vitals, pupils, skin, bowel, temperature.',
    'Paracetamol and salicylate in every deliberate overdose; NAC on timing and probability, not symptoms.',
    'Call the poison centre early for mixed, delayed-release, or unknown ingestions.'
],
dontMiss: [
['Acetaminophen (paracetamol)', 'critical', 'Biggest silent killer. Plot a level drawn ≥4 h post-ingestion on the Rumack-Matthew nomogram (US treatment line 150 µg/mL at 4 h). Start NAC if the level will return after 8 h, the time is unknown, or the ingestion is repeated/staggered; use the poison-centre pathway for high-risk exposure (≥30 g or ≥500 mg/kg, whichever is less) and all complex presentations. SNAP 12 h NAC is a UK regimen; US/Canada use their 2023 consensus pathway.'],
['Opioids', 'critical', 'Pinpoint pupils + respiratory depression → titrate naloxone to ventilation, not wakefulness.'],
['Tricyclic antidepressants / sodium-channel blockers', 'critical', 'QRS ≥100–110 ms → sodium bicarbonate immediately; anticipate sudden deterioration.'],
['Salicylates', 'critical', 'Tinnitus, hyperventilation, mixed acid-base picture — alkalinize serum/urine, prepare for hemodialysis.'],
['Carbon monoxide', 'critical', 'Whole household, headache, normal SpO₂ — CO-oximetry, high-flow O₂ ± hyperbaric per criteria.'],
['Organophosphates / nerve agents', 'critical', 'SLUDGE, pinpoint pupils — atropine (lots) + pralidoxime; protect staff.'],
['Sympathomimetics / serotonin syndrome', 'emergent', 'Hyperthermia + agitation + clonus — benzodiazepines, active cooling. Avoid physical restraint as the only strategy.'],
['Toxic alcohols (methanol / ethylene glycol) / alcohol withdrawal', 'emergent', 'Anion-gap acidosis, visual change (methanol) — fomepizole, dialysis planning.']
],
history: ['What, when, how much, why (suicidal vs accidental vs recreational)', 'Co-ingestants — always ask; ethanol and polypharmacy dominate', 'Empty containers, notes, access to others\u2019 medications; extended-release products', 'Chronic medications and occupational exposures'],
exam: ['ABCDE with airway priority; GCS and pupils', 'Vital-sign fingerprint: sympathomimetic vs cholinergic vs sedative-hypnotic vs anticholinergic vs opioid', 'Skin: sweating, dry (anticholinergic), needle tracks', 'Odor: bitter almond, garlic (organophosphate), acetone', 'Seizure activity, temperature (hyperthermia = emergency)'],
workup: [
['Bedside', ['Glucose (never delay), ECG (QRS/QT), SpO₂ + CO-oximetry when relevant', 'Activated charcoal within ~1 h for selected agents if the airway is protected; later for anticholinergics/delayed-release — call poison centre']],
['Labs', ['Paracetamol and salicylate levels in all deliberate overdoses (and when history is incomplete)', 'ABG/VBG, electrolytes, anion and osmolar gap, lactate, glucose', 'LFTs (late for paracetamol), INR, CK for rhabdo']],
['Imaging / antidotes', ['CXR for aspiration; CT if trauma/fall', 'Naloxone, NAC, sodium bicarbonate, fomepizole, atropine + pralidoxime, high-dose insulin for CCB/BB — know kit location and call poison centre']]
],
redFlags: ['Falling GCS or failing airway reflexes', 'QRS widening or new arrhythmia', 'Seizure, hyperthermia, or severe agitation', 'Metabolic acidosis or rising lactate', 'Hypotension unresponsive to fluids', 'Paracetamol presentation that will miss the 8 h NAC window if you wait for a level'],
disposition: [
['Discharge', 'Awake, below-treatment paracetamol level on a timed 4 h sample (single acute ingestion), completed observation window for the agent, and safe for psychiatric assessment if needed.'],
['Admit (monitored bed)', 'NAC in progress, delayed-release or staggered ingestions, short-acting agents under observation, self-harm safety planning.'],
['ICU', 'Intubated/airway-compromised, pressors, seizures, hyperthermia, hemodialysis (salicylates, methanol, ethylene glycol, lithium), severe TCA cardiotoxicity.']
],
pitfalls: ['A declining GCS in a \u201Cstable\u201D overdose precedes the crash — reassess continuously.', 'A paracetamol level drawn before 4 h is not interpretable on the nomogram. Staggered, repeated, and unknown-time ingestions are treated empirically — the nomogram does not apply.', 'Do not give flumazenil in undifferentiated, mixed, or chronic benzodiazepine overdose (seizures, withdrawal). A limited role remains for iatrogenic, benzodiazepine-naive procedural sedation (AHA 2023 toxicology update).', 'QRS widening + hypotension = bicarbonate, not more fluids.', 'Never delay dextrose for thiamine.', 'Call the poison centre early for high-risk, unknown, or multi-agent ingestions.'],
pearls: ['Toxidrome first: vitals, pupils, skin, bowel sounds, temperature.', 'Paracetamol in every deliberate overdose — silent until day 2–3.', 'Naloxone is titrated to ventilation, not to a GCS of 15.', 'QRS ≥100–110 ms in a possible TCA/sodium-channel blocker = bicarbonate now.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — toxicology', 'Dart RC et al. Management of acetaminophen poisoning in the US and Canada: a consensus statement. JAMA Netw Open 2023', 'RCEM/NPIS 2023 SNAP NAC regimen (UK default)', 'AHA 2023 focused update: cardiac arrest or life-threatening toxicity due to poisoning', 'Goldfrank\u2019s Toxicologic Emergencies']
},
{
id: 'pediatric-fever', name: 'Pediatric Fever', icon: '🧒',
tag: 'Age decides the workup; appearance decides the urgency.',
overview: 'Fever in a child is screened by three questions: How old? Immunized? Well-appearing? The 2021 AAP guideline for well-appearing febrile infants 8–60 days stratifies 8–21, 22–28, and 29–60 days — \u201Csafely do less\u201D in the older, well, immunized infant. Any ill-appearing infant, and all neonates 0–7 days, still get a full sepsis evaluation. Always hunt the hidden source — urine in the young — and take seriously the child who \u201Cjust doesn\u2019t look right.\u201D',
approach: [
    'Three questions: How old? Immunized? Well-appearing? (Judge appearance between fever spikes.)',
    'Ill-appearing any age, and all 0–7 days: full sepsis evaluation.',
    'AAP 2021 for well-appearing 8–60 days: 8–21 d LP + antibiotics; 22–28 d LP if markers up; 29–60 d may skip LP if well with normal markers.',
    'Hunt the hidden source — urine in the young. Fever >5 days: Kawasaki, including incomplete.'
],
dontMiss: [
['Neonatal / young-infant sepsis', 'critical', 'Ill-appearing at any age = full workup + empiric antibiotics. 0–7 days (outside the AAP CPG) and well-appearing 8–21 days: urine, blood, LP, and parenteral antibiotics. 22–28 days: urine, blood, inflammatory markers; LP if any IM is abnormal. 29–60 days: LP may be omitted if well-appearing with normal IMs (AAP 2021).'],
['Meningitis / bacteremia', 'critical', 'Toxic appearance, petechiae, bulging fontanelle — antibiotics and LP pathway.'],
['UTI (hidden source)', 'critical', 'Especially girls <24 months and uncircumcised boys <12 months — catheterized specimen (or SPA); bag urine is a screen only.'],
['Kawasaki disease', 'critical', '≥5 days of fever + ≥4 of: bilateral nonexudative conjunctivitis, rash, mucositis, extremity changes, cervical nodes — or incomplete Kawasaki with labs/echo. IVIG window matters (AHA 2017).'],
['HSV in the young infant', 'critical', 'Vesicles, seizures, CSF RBC/pleocytosis, hepatitis in the neonate — empiric acyclovir.'],
['Intussusception', 'emergent', 'Colicky pain, red-currant stool, drawing-up legs — US then air/contrast enema. Fever is not required.'],
['Bronchiolitis / croup / viral URIs', 'common', 'Supportive care; know the deterioration signs (apnea in young infants).'],
['Post-vaccination fever', 'common', 'Within 48 h of vaccines in a well child — comfort care. Exclude from AAP febrile-infant pathways when that is the only finding.']
],
history: ['Exact age in days, gestational age, immunization status, day-care/sick contacts', 'Temperature measured how/where? Antipyretics given when?', 'Appearance between fevers: feeding, activity, consolability', 'Specific symptoms: cough, vomiting, diarrhea, rash, reduced wet diapers', 'Maternal risks in neonates (GBS, prolonged rupture, maternal fever, HSV)'],
exam: ['Overall appearance: toxic vs well — the most important sign, judged between fever spikes', 'Vitals with age-adjusted norms; capillary refill', 'Full undressed exam: rashes, fontanelle, ears, throat, chest', 'Hydration: mucous membranes, tears, urine output', 'Localizing signs: limp, ear pull, drooling + tripod (croup/epiglottitis)'],
workup: [
['Bedside', ['Rectal temperature in infants; urine collection (catheter or SPA <2 y when a culture is needed)', 'POCUS/lung US for pneumonia/effusion in trained hands']],
['Labs (age-gated, AAP 2021 for well-appearing 8–60 d)', ['8–21 days: UA/culture, blood culture, LP ± IMs; empiric parenteral antibiotics', '22–28 days: UA/culture, blood culture, IMs (PCT, ANC, CRP); LP if IM abnormal', '29–60 days: UA/culture, blood culture, IMs; LP optional if IMs normal and well-appearing', '>60 days / >3 months well-appearing: clinical ± urine; inflammatory markers to gate antibiotics per local pathway']],
['Imaging', ['CXR if respiratory signs; US for intussusception suspicion (then air enema); echo if Kawasaki']]
],
redFlags: ['Any fever ≥38°C in an infant ≤21 days, or ill appearance at any age', 'Toxic appearance, inconsolability, lethargy', 'Petechial/purpuric rash or bulging fontanelle', 'Grunting, retractions, apnea, or cyanosis', 'Unable to feed or reduced wet diapers', 'Fever >5 days (think Kawasaki, including incomplete)'],
disposition: [
['Discharge', 'Well-appearing, immunized child — and, if 29–60 days, normal IMs with a negative UA — with reliable caregivers and clear return precautions, per local pathway.'],
['Admit', '8–21-day-old infants on empiric antibiotics; 22–28-day-olds pending cultures; UTI needing IV therapy; bronchiolitis with feeding or respiratory distress; uncertain appearance.'],
['ICU / urgent therapy', 'Meningitis/septic shock, Kawasaki needing IVIG, intussusception pre/post reduction, neonatal HSV.']
],
pitfalls: ['\u201CWell-looking\u201D must be judged between fever spikes. The AAP CPG does not apply to ill-appearing, premature, or immunocompromised infants, or to 0–7 days of life.', 'Immunization status changes the risk of occult bacteremia in older infants — document it.', 'Fever without source in a young infant is a workup, not a diagnosis.', 'Antipyretics can mask a toxic child.', 'Rectal temperatures in neonates; axillary/tympanic under-read in the young.', 'Incomplete Kawasaki (fever + 2–3 criteria with inflammatory labs) is easy to miss and still needs echo/IVIG consideration.'],
pearls: ['Age in days, immunizations, and appearance decide the workup — in that order.', 'AAP 2021: 8–21 d full including LP; 22–28 d LP if inflammatory markers are up; 29–60 d may skip LP if well with normal markers.', 'Urine is the hidden source in the young febrile infant.', 'Kawasaki is a 5-day fever diagnosis — incomplete counts.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — pediatric fever', 'AAP 2021 CPG: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days Old', 'NICE NG143 Fever in under 5s', 'AHA 2017 Kawasaki disease statement']
},
{
id: 'suicidal', name: 'Agitation & Suicidal Ideation', icon: '🧑‍⚕️',
tag: 'Medical first — then safety, then psychiatry.',
overview: 'Acute agitation is a medical presentation until glucose, oxygen, temperature, trauma, and toxidrome are addressed — hypoxia, hypoglycemia, encephalitis, serotonin syndrome, sympathomimetics, and withdrawal kill before a psychiatric label is safe. Self-harm thought still deserves a direct, non-judgmental ask (asking does not plant the idea). Safety (means, environment, observation) and then disposition against local mental-health law.',
approach: [
    'Glucose, SpO₂, temperature, and a toxidrome exam first — agitation is medical until those are done.',
    'Then safety: means, environment, 1:1 observation — no gaps for imaging or the toilet.',
    'Ask directly about suicide. Asking does not plant the idea.',
    'Paracetamol and salicylate in every intentional overdose. Disposition is a written safety plan or admission — document who they leave with.'
],
dontMiss: [
['Active suicidal intent with a plan and access to means', 'critical', 'Constant observation now; remove means; do not leave alone for imaging, the toilet, or a smoke break.'],
['Recent attempt', 'critical', 'Medical stabilization first (paracetamol/salicylate levels in every intentional overdose). The repeat-attempt window is highest in the following weeks to months, and after psychiatric discharge.'],
['Agitation from a medical cause', 'critical', 'Hypoxia, hypoglycemia, encephalitis, serotonin syndrome, sympathomimetics, DTs, head injury, thyrotoxicosis — treat these before a psychiatric label. Verbal de-escalation, then medication; restraint only per protocol with monitoring.'],
['Agitation with violence risk', 'critical', 'Safety of staff and patient; medical workup proceeds in parallel, not after the patient is \u201Cmedically cleared\u201D as a checkbox.'],
['Adolescent disclosure', 'emergent', 'Screen every young person (ASQ); explain confidentiality limits before the interview.'],
['Depression / anxiety / psychosis without acute intent', 'common', 'Treat, ask about suicidality in every psychiatric presentation, and arrange close follow-up.']
],
history: ['Ideation: passive (wish to be dead) vs active (plan, intent, preparation, rehearsal)', 'Plan specificity and access to means (firearms, medications, heights, ligatures)', 'Prior attempts — the strongest single clinical predictor', 'Substances, recent losses, recent discharge from psychiatric care (high-risk window)', 'Protective factors: reasons for living, dependents, engaged care, future orientation', 'Epidemiologic amplifiers (older age, male sex, isolation, access to firearms) inform risk but are not a substitute for the interview'],
exam: ['Medical clearance: vitals, glucose, targeted tox, trauma from attempts — clearance is not a psych screen', 'Mental status: orientation, psychosis, mood, hopelessness, command hallucinations', 'Signs of intoxication/withdrawal that alter risk and capacity', 'Agitation level and environmental safety scan'],
workup: [
['Bedside', ['Glucose, SpO₂; breath alcohol when relevant', 'Environment: remove ligatures/sharps; 1:1 observation for high risk']],
['Labs', ['Paracetamol and salicylate in all intentional overdoses and when history is incomplete', 'Targeted toxicology; TSH, electrolytes when a medical cause is possible']],
['Screening tools', ['C-SSRS or ASQ (youth) to structure the interview — tools inform, they do not replace judgment or a safety plan']]
],
redFlags: ['Stated intent with available means', 'Attempt within the last days to week', 'Psychotic symptoms or command hallucinations', 'Intoxication with ongoing access to means', 'Discharge from psychiatric care in the past month', 'Inability to engage in a safety plan, or no safe person to go home with'],
disposition: [
['Discharge', 'Low acute risk: no plan/intent, strong protective factors, means-restriction counselling, written safety plan, reliable follow-up within days, and crisis-line numbers. Document who they leave with.'],
['Admit (psychiatric, after medical clearance)', 'Active ideation with plan, attempt survivors, high risk with insufficient supports — per local mental-health law (voluntary/involuntary).'],
['Emergency psychiatric hold + security', 'Imminent danger to self/others, agitation requiring restraint protocols, refusal of care with impaired capacity.']
],
pitfalls: ['Asking about suicide does not increase risk — it opens the door.', 'Apparent calm after an attempt can signal a decision, not relief.', 'Medical clearance is not a psych-screen substitute — delirium and toxins masquerade as psychiatric illness.', 'Observation gaps (imaging, toilets, smoking areas) are when patients elope or harm themselves.', 'Document risk, protective factors, means restriction, capacity, and who the patient goes home with.', 'Do not use sex or age as a checkbox that replaces the interview — they are epidemiologic context, not disposition rules.'],
pearls: ['Agitation is medical first: glucose, oxygen, temperature, toxidrome — then psychiatry.', 'Ask directly. Asking does not plant the idea.', 'Paracetamol and salicylate in every intentional overdose.', 'The highest-risk window is the days after an attempt and the month after psychiatric discharge.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — behavioral & psychiatric emergencies', 'Columbia Suicide Severity Rating Scale; ASQ Toolkit (NIMH)', 'Joint Commission NPSG 15.01.01; Zero Suicide framework']
},
{
id: 'diplopia', name: 'Diplopia', icon: '👀',
tag: 'Binocular + painful or pupil-involved = the ones that kill.',
overview: 'First decide monocular (optical: refractive, cataract, functional) vs binocular (alignment: nerve, muscle, NMJ, internuclear). Binocular diplopia that is painful, pupil-involving, or accompanied by other neuro signs is a neurologic emergency — think posterior communicating artery aneurysm (CN III), giant cell arteritis, myasthenia, and brainstem stroke. Cover-uncover and a careful pupil exam do more than a CT.',
approach: [
    'Monocular (optical) vs binocular (alignment): covering either eye kills binocular diplopia.',
    'Painful pupil-involving CN III = CTA now (PCOM aneurysm).',
    'Age ≥50: ask about jaw claudication and treat GCA on suspicion.',
    'INO or crossed signs: MRI-DWI, not a reassurance CT.'
],
dontMiss: [
['Posterior communicating artery aneurysm (CN III)', 'critical', 'Painful pupil-involving third-nerve palsy (down-and-out, ptosis, blown pupil) — CTA/MRA now, neurosurgery. A complete pupil-sparing CN III in a vasculopath >50 y is more often microvascular, but pain or incomplete palsies still get imaged.'],
['Brainstem stroke / INO (internuclear ophthalmoplegia)', 'critical', 'Sudden diplopia with ataxia, dysarthria, or crossed findings — posterior-circulation pathway, MRI-DWI. INO (impaired adduction + contralateral nystagmus) is MLF until proven otherwise.'],
['Giant cell arteritis', 'critical', 'Age ≥50, new headache, jaw claudication, diplopia or amaurosis — start glucocorticoids immediately to protect the other eye; ESR/CRP can be normal.'],
['Myasthenic crisis', 'critical', 'Fatigable binocular diplopia and ptosis, worse late in the day; pupils spared. Watch NIF/VC; avoid triggering antibiotics.'],
['Cavernous sinus thrombosis / orbital apex', 'critical', 'Diplopia + proptosis, chemosis, fever or CN V1 pain — CT/MR venography, antibiotics if septic, anticoagulation if atraumatic.'],
['Botulism', 'emergent', 'Descending paralysis, poorly reactive pupils, GI prodrome — antitoxin; do not wait for culture.'],
['Microvascular cranial neuropathy / decompensated phoria', 'common', 'Isolated pupil-sparing CN III/IV/VI in a diabetic or hypertensive adult often resolves — still arrange close follow-up and image if incomplete, painful, or not isolated.']
],
history: ['Monocular (persists covering one eye) vs binocular (resolves covering either)', 'Pain, headache, scalp tenderness, jaw claudication', 'Fatigability through the day, ptosis, dysarthria, limb weakness', 'Vascular risks, atrial fibrillation, trauma, recent infection or canned food'],
exam: ['Cover-uncover / alternate cover; ductions and versions in nine positions', 'Pupils: size, reactivity, RAPD; complete vs pupil-sparing CN III', 'Fatigable ptosis (sustained upgaze); ice-pack test if MG possible', 'Orbital signs: proptosis, chemosis, resistance to retropulsion', 'Full neuro: INO, ataxia, other cranial nerves, temporal arteries'],
workup: [
['Bedside', ['Visual acuity, pupils, cover testing; glucose', 'Ice-pack or rest test if MG is likely and the patient is stable']],
['Labs', ['ESR/CRP if age ≥50 with diplopia or GCA features', 'AChR/MuSK later; they do not change the ED airway decision']],
['Imaging', ['CTA/MRA for painful or pupil-involving CN III', 'MRI-DWI ± CTA for brainstem/INO features', 'CT/MR orbits and cavernous sinus if orbital or febrile']]
],
redFlags: ['Painful pupil-involving third-nerve palsy', 'Age ≥50 with diplopia plus headache or jaw claudication', 'Proptosis, chemosis, or fever with diplopia', 'Fatigable weakness or falling vital capacity', 'Crossed findings, ataxia, or INO', 'Poorly reactive pupils with descending weakness (botulism)'],
disposition: [
['Discharge', 'Clear monocular optical cause, or isolated pupil-sparing microvascular CN palsy in a vasculopath after a careful exam, with ophthalmology/neuro follow-up within days and return precautions.'],
['Admit', 'Incomplete or painful cranial neuropathies pending imaging, MG under NIF observation, treated GCA on steroids, orbital infection on IV antibiotics.'],
['Stroke / neurosurgery / ICU', 'PCOM aneurysm, brainstem stroke, cavernous sinus thrombosis, myasthenic crisis, botulism.']
],
pitfalls: ['Calling a pupil-involving CN III \u201Cmicrovascular\u201D without vascular imaging misses a PCOM aneurysm.', 'Monocular diplopia is almost never a brain-attack — check refraction, dry eye, and the lens.', 'GCA diplopia can be fleeting and the ESR can be normal — treat on suspicion.', 'Myasthenia pupils are spared; if the pupils are involved, look elsewhere.', 'CT is a poor posterior-fossa test — MRI-DWI when INO or crossed signs are present.'],
pearls: ['Binocular + cover test: if covering either eye kills the double vision, it is alignment.', 'Painful pupil-involving CN III = CTA now, not \u201Cfollow up with neuro.\u201D', 'Diplopia in the over-50s is GCA until you have asked about jaw claudication and started steroids when the story fits.', 'INO is a brainstem localizer — skip the reassurance CT.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — diplopia', 'AHA/ASA posterior-circulation stroke statements', 'ACR/EULAR GCA recommendations; AAO cranial neuropathy guidance']
},
{
id: 'constipation', name: 'Constipation', icon: '🧱',
tag: 'Rarely the disease — often the mask.',
overview: 'True simple constipation is common and benign. The ED task is to find the masqueraders: bowel obstruction, mesenteric ischemia, fecal impaction with overflow, spinal cord/cauda equina, opioid ileus, hypercalcemia, and hypothyroidism. New severe constipation in the elderly with pain or vomiting is obstruction until imaged.',
approach: [
    'Constipation is a symptom — look for obstruction, ischemia, cord, calcium, thyroid, opioids.',
    'DRE in the frail and in “diarrhea” that may be overflow.',
    'New constipation + retention or saddle numbness = MRI for cauda, not lactulose.',
    'No red flags and a benign exam: bowel regimen and follow-up, not a CT.'
],
dontMiss: [
['Bowel obstruction / volvulus', 'critical', 'Vomiting, distension, prior surgery, hernia, tympany — CT. Sigmoid/cecal volvulus is time-critical.'],
['Mesenteric ischemia', 'critical', 'Pain out of proportion, AF, bloody stool — CTA, not a discharge laxative.'],
['Cauda equina / cord compression', 'critical', 'New constipation plus back pain, saddle anesthesia, or urinary retention — emergency MRI.'],
['Fecal impaction with overflow / stercoral colitis', 'critical', 'The frail elderly \u201Cdiarrhea\u201D that is overflow; DRE. Stercoral ulceration can perforate.'],
['Hypercalcemia / myxedema / opioid ileus', 'emergent', 'Bones, stones, groans, psychiatric overtones; delayed reflexes; the medication list.'],
['Toxic megacolon / Ogilvie (acute colonic pseudo-obstruction)', 'emergent', 'Distended silent abdomen in IBD, C. diff, or the hospitalized/post-op patient — decompression pathway.'],
['Simple functional constipation / opioid-induced', 'common', 'No red flags, benign exam — osmotic laxative, enemas as needed, bowel regimen, follow-up.']
],
history: ['Last stool, character, overflow liquid, blood, vomiting, ability to pass flatus', 'Prior surgeries, hernias, opioid or anticholinergic use, immobilization', 'Back pain, saddle numbness, urinary retention', 'Weight loss, iron deficiency (obstructing cancer)', 'Thyroid, calcium, psychiatric meds'],
exam: ['Abdomen: distension, hernias, peritoneal signs, bowel sounds', 'DRE: impaction, blood, tone (cauda)', 'Neuro if back pain or retention: saddle sensation, post-void residual', 'Volume status and signs of hypothyroidism'],
workup: [
['Bedside', ['DRE; bladder scan if retention is possible', 'Glucose; POCUS for free fluid/AAA if surgical features']],
['Labs', ['Electrolytes including K and Ca, TSH if myxedema possible, CBC, creatinine', 'β-hCG when relevant; lactate if ischemia is on the list']],
['Imaging', ['No imaging for simple constipation with a benign exam', 'CT abdomen/pelvis when obstruction, ischemia, or stercoral colitis is possible', 'MRI spine if cauda/cord features']]
],
redFlags: ['Vomiting, distension, or an irreducible hernia', 'Pain out of proportion or bloody stool', 'New constipation with back pain, saddle numbness, or retention', 'Fever or peritonitis (stercoral perforation, megacolon)', 'Weight loss or iron-deficiency anemia in the older adult', 'Opioid ileus with a rock-hard abdomen'],
disposition: [
['Discharge', 'Simple constipation, empty rectum after disimpaction if needed, taking oral fluids, a bowel regimen, and return precautions. Stop or reduce the offending opioid/anticholinergic when safe.'],
['Admit', 'Fecal impaction needing serial enemas in a frail host, Ogilvie under monitoring, electrolyte or thyroid replacement, obstructing cancer staging.'],
['Theatre / MRI / ICU', 'Obstruction with ischemia or perforation, volvulus, stercoral perforation, cauda equina.']
],
pitfalls: ['Treating mesenteric ischemia or SBO with polyethylene glycol is a classic miss.', '\u201CDiarrhea\u201D in the elderly is overflow until a DRE is done.', 'New constipation plus urinary retention is cauda equina, not a laxative trial.', 'AXR is insensitive for obstruction — CT when the story is real.', 'Discharging without a bowel regimen after opioids guarantees a bounce-back.'],
pearls: ['Constipation is a symptom. Ask what you are missing: obstruction, ischemia, cord, calcium, thyroid, opioids.', 'DRE is part of the exam, not optional, in the frail and in overflow diarrhea.', 'No red flags + a benign exam = regimen and follow-up, not a CT.', 'Back pain + constipation + retention = MRI, not lactulose.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — constipation', 'Tintinalli\u2019s 9th ed. — bowel obstruction', 'NICE NG59 / cauda equina red flags; WSES obstruction guidance']
},
{
id: 'limb-ischemia', name: 'Acute Limb Ischemia', icon: '🦵',
tag: 'A cold pulseless limb is a clock — and sometimes a dissected aorta.',
overview: 'Acute limb ischemia is a vascular emergency: the six Ps (pain, pallor, pulselessness, poikilothermia, paresthesia, paralysis) mark time-to-muscle. Embolus, thrombosis of a diseased vessel, aortic dissection into a limb, phlegmasia, and necrotizing infection can share the stage. Do not wait for an ABI when the exam is classic — heparin, vascular surgery, and CTA of the aorta-to-runoff as the story dictates.',
approach: [
    'Exam first: pulses, Doppler, comparison with the other limb, and a motor/sensory map.',
    'Chest or back pain with a pulse deficit is dissection until CTA says otherwise — do not anticoagulate blindly.',
    'Classic ALI: unfractionated heparin and an immediate vascular call; imaging must not delay a clearly threatened limb.',
    'Pain out of proportion after reperfusion or crush is compartment syndrome — fasciotomy, not another scan.'
],
dontMiss: [
['Embolic or thrombotic acute limb ischemia', 'critical', 'Sudden pain, pallor, pulselessness — Rutherford threatened limb needs revascularization now. Heparin unless dissection is the leading diagnosis.'],
['Aortic dissection into a limb', 'critical', 'Chest/back pain + pulse deficit or a cold arm/leg — CTA aorta first; anticoagulating this as a simple embolus can be lethal.'],
['Phlegmasia cerulea dolens / massive DVT', 'critical', 'Cyanotic swollen limb, often malignant or post-op — anticoagulation ± thrombolysis/thrombectomy; watch for venous gangrene.'],
['Compartment syndrome', 'critical', 'Pain on passive stretch after trauma, crush, or reperfusion — compartment pressures support but do not override clinical diagnosis; fasciotomy.'],
['Necrotizing soft-tissue infection', 'critical', 'Pain out of proportion, rapid spread, crepitus, or shock — surgery now.'],
['Blue toe / cholesterol emboli after cath', 'emergent', 'Livedo and intact pulses after an aortic procedure — do not miss ongoing aortic source.'],
['Chronic PAD / claudication flare', 'common', 'Exertional calf pain that resolves with rest, pulses diminished but tissue viable — outpatient vascular pathway if no rest pain or tissue loss.']
],
history: ['Tempo: seconds–minutes (embolus, dissection) vs hours–days (thrombosis, infection)', 'Chest, back, or abdominal pain (dissection, AAA)', 'AF, recent MI, aneurysm, bypass graft, cath access', 'Trauma, crush, lithotomy, anticoagulation, malignancy'],
exam: ['Pulses and Doppler in both limbs; ankle-brachial index only if it will not delay care', 'Skin: pallor vs cyanosis vs mottling vs crepitus', 'Motor and sensory — paralysis means muscle is dying', 'Heart: AF, murmur; abdomen: AAA; chest: BP in both arms', 'Passive stretch pain of the compartments'],
workup: [
['Bedside', ['ECG (AF, ischemia); bilateral arm BP', 'Handheld Doppler; POCUS for AAA and dissection flap if trained', 'Glucose, lactate']],
['Labs', ['CBC, coagulation, CK, creatinine, type & screen', 'Cultures if infection/shock']],
['Imaging', ['CTA aorta-to-runoff when dissection or embolic shower is possible', 'Duplex if the diagnosis is uncertain and the limb is viable', 'Do not delay a threatened limb for perfect pictures']]
],
redFlags: ['Pulseless, pale, or paralyzed limb', 'Chest or back pain with a pulse deficit', 'Pain on passive stretch after trauma or reperfusion', 'Crepitus, bullae, or shock with a soft-tissue source', 'Cyanotic swollen limb (phlegmasia)', 'Rest pain in a vasculopath with tissue loss'],
disposition: [
['Discharge', 'Chronic claudication without rest pain or tissue threat, intact Doppler, reliable vascular follow-up.'],
['Admit (vascular)', 'Viable but symptomatic ischemia, phlegmasia on anticoagulation, post-cath blue toe, infection needing IV therapy.'],
['Emergency revascularization / OR / ICU', 'Threatened or irreversible ALI, dissection, compartment syndrome, necrotizing infection.']
],
pitfalls: ['Waiting for ABI or formal angiography while the limb dies.', 'Heparin for \u201Cembolus\u201D that is really a type A dissection.', 'Calling cellulitis when the pain is out of proportion (nec fasc or compartment).', 'Irreversible ischemia still needs source control and often amputation planning — do not send home a dead limb.', 'Reperfusion without watching compartments produces a second disaster.'],
pearls: ['Six Ps are a clock, not a checklist to complete before calling vascular.', 'Pulse deficit + chest or back pain = aorta, not a femoral embolus in isolation.', 'Heparin unless dissection leads; imaging must not delay a threatened limb.', 'Passive stretch pain after crush or reperfusion is compartment syndrome.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — peripheral vascular and aortic disease', 'AHA/ACC PAD and aortic disease guidance', 'SVS acute limb ischemia recommendations']
},
{
id: 'hyperglycemia', name: 'DKA, HHS & Adrenal Crisis', icon: '🧪',
tag: 'Sugar, potassium, volume — and never withhold steroids in the crashing steroid-dependent patient.',
overview: 'Hyperglycemic crises and adrenal crisis are metabolic shock. DKA is ketosis plus anion-gap acidosis (glucose may be near-normal on SGLT2 inhibitors). HHS is extreme hyperosmolarity with profound volume loss and a quieter acid-base picture. Adrenal crisis is refractory shock in the steroid-dependent or Waterhouse-Friderichsen patient — give hydrocortisone without waiting for a cortisol. Potassium before insulin if K⁺ is low; fluids are the first drug in DKA/HHS.',
approach: [
    'Bedside glucose, VBG/ketones, and potassium in every sick diabetic or unexplained shock.',
    'DKA: fluids first, potassium repletion, then insulin. Defer insulin if K⁺ is <3.5 mmol/L.',
    'HHS: slower osmolar correction, hunt the trigger (infection, MI, stroke), watch sodium and neuro status.',
    'Steroid-dependent + shock or vomiting: stress-dose hydrocortisone now — do not wait for a cortisol.'
],
dontMiss: [
['Diabetic ketoacidosis', 'critical', 'Anion-gap acidosis + ketones. Euglycemic DKA on SGLT2 inhibitors is easy to miss — check ketones when the story fits even if glucose is modest.'],
['Hyperosmolar hyperglycemic state', 'critical', 'Glucose often >600 mg/dL (33 mmol/L), effective osmolality high, mental status change, milder ketosis — huge water deficit; correct slowly to avoid cerebral edema.'],
['Adrenal crisis', 'critical', 'Shock, hyponatremia, hyperkalemia, or hypoglycemia in a steroid-dependent, pituitary, or meningococcemia patient — hydrocortisone 100 mg IV now.'],
['Precipitant ACS / sepsis / pancreatitis', 'critical', 'The crisis is often triggered — ECG, cultures, lipase as indicated. Treat the trigger with the protocol.'],
['Hypokalemia during insulin', 'critical', 'Total-body K⁺ is low even when the first value is normal; insulin drives K⁺ in — replace and monitor.'],
['Cerebral edema (especially pediatric DKA)', 'critical', 'Headache, bradycardia, or deteriorating GCS during treatment — raise head, mannitol/hypertonic saline, slow the fluids, ICU.'],
['Simple hyperglycemia / missed insulin', 'common', 'No acidosis, no ketones, well-appearing — hydration, insulin plan, follow-up. Still hunt infection.']
],
history: ['Polyuria, polydipsia, weight loss, vomiting, abdominal pain', 'SGLT2 inhibitors, insulin omission, infection, pregnancy', 'Steroid use or recent cessation; pituitary disease; pigmentation', 'Chest pain, fever, diarrhea as precipitants'],
exam: ['Volume status: tachycardia, dry mucosa, delayed cap refill', 'Kussmaul breathing (DKA); focal neuro or coma (HHS)', 'Abdomen (pancreatitis, surgical mimic); fever; skin (meningococcus, candida)', 'Medic-alert jewellery; insulin pump in situ'],
workup: [
['Bedside', ['Glucose, VBG, ketones (serum or urine), ECG', 'Potassium on the blood gas while the lab is pending']],
['Labs', ['Electrolytes with anion gap, osmolality, creatinine, phosphate, CBC, lipase', 'Cultures if febrile; troponin if ACS possible; cortisol after steroids are given if adrenal crisis is treated empirically', 'β-hCG when relevant']],
['Imaging', ['CXR; CT only for a suspected surgical or neurologic precipitant', 'Do not delay DKA/HHS therapy for imaging']]
],
redFlags: ['Altered mentation with hyperglycemia or ketones', 'K⁺ <3.5 before insulin, or falling K⁺ on treatment', 'Steroid-dependent patient with shock or vomiting', 'SGLT2 inhibitor + acidosis even with a \u201Cnormal\u201D glucose', 'Headache or falling GCS in a child on a DKA protocol', 'Hypotension that does not respond to fluids (think adrenal, sepsis, ACS)'],
disposition: [
['Discharge', 'Isolated hyperglycemia without ketosis or HHS features, a clear missed-dose story, reliable insulin access and follow-up.'],
['Admit (ward / HDU)', 'Uncomplicated DKA responding on a protocol, new diabetes needing education, HHS with improving osmolality under monitoring.'],
['ICU', 'Severe acidosis, shock, HHS with coma, pediatric DKA, adrenal crisis, cerebral edema, or a dangerous precipitant (ACS, sepsis).']
],
pitfalls: ['Starting insulin before potassium is replaced when K⁺ is already low — ventricular arrhythmia.', 'Missing euglycemic DKA because the glucose is 180 mg/dL on an SGLT2 inhibitor.', 'Waiting for a random cortisol in adrenal crisis.', 'Over-rapid correction of HHS sodium/osmolality.', 'Calling DKA abdominal pain \u201Cjust ketosis\u201D without considering pancreatitis or a surgical abdomen.', 'Stopping insulin when glucose falls, before the anion gap has closed — a dextrose infusion continues the insulin.'],
pearls: ['Fluids, potassium, then insulin. That order prevents the crash.', 'SGLT2 + unwell = check ketones even if glucose is not high.', 'Hydrocortisone in the crashing steroid-dependent patient is a resuscitation drug, not an endocrine consult.', 'Close the gap, not just the glucose.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — DKA, HHS, adrenal insufficiency', 'ADA/EASD/AACE/JBDS/DTS Hyperglycemic Crises in Adults Consensus Report (2024); ADA Standards of Care 2026', 'ISPAD pediatric DKA; Endocrine Society adrenal insufficiency guidance']
},
{
id: 'heat-cold', name: 'Heat Stroke & Hypothermia', icon: '🌡️',
tag: 'Cool the hot brain; warm the cold dead — temperature is the treatment.',
overview: 'Temperature extremes are treated while you diagnose. Heat stroke is CNS dysfunction plus typically core temperature ≥40°C — evaporative or (better) ice-water immersion cooling starts immediately; do not wait for a laboratory gold standard. Hypothermia is not dead until warm and dead; afterdrop, arrhythmia, and delayed drugs are the traps. Submersion injury is a hypoxic emergency with optional C-spine when the mechanism fits. Envenomation is regional — antivenom and poison-centre support, not a delay for species certainty.',
approach: [
    'Measure a true core temperature (rectal/esophageal/bladder) — peripheral temps lie.',
    'Heat stroke: cool first (ice-water immersion when available), then support ABC and look for rhabdo, DIC, and liver injury.',
    'Hypothermia: handle gently, rewarm by severity, withhold aggressive drugs until warmer, and continue resuscitation until warm.',
    'Submersion: oxygenate and ventilate; C-spine only if the mechanism suggests injury. Call poison centre for bites and stings.'
],
dontMiss: [
['Classic or exertional heat stroke', 'critical', 'Altered mentation + high core temperature — cool immediately to ~39°C. Ice-water immersion is first-line for exertional heat stroke (ACSM/NATA). Antipyretics do not work.'],
['Heat exhaustion vs sepsis vs NMS / serotonin syndrome / sympathomimetic storm', 'critical', 'Not every hot altered patient is environmental — toxidrome, rigidity, meds, and infection still apply. Cooling proceeds while you sort.'],
['Accidental hypothermia with cardiac arrest', 'critical', 'Prolonged CPR and extracorporeal rewarming when available; not dead until warm (typically ~32°C) and dead. Gentle handling to avoid VF.'],
['Submersion / drowning', 'critical', 'Hypoxia is the disease. Rescue breaths, intubation as needed, delayed pulmonary edema. C-spine if diving or trauma mechanism.'],
['Rhabdomyolysis / DIC / acute liver failure after heat stroke', 'critical', 'The cooling is not the end — watch CK, coagulation, glucose, and mental status for 24 h.'],
['Severe envenomation (region-specific)', 'emergent', 'Snake, scorpion, marine — antivenom when indicated, pressure immobilization per local protocol, poison centre. Do not cut, suck, or tourniquet.'],
['Heat exhaustion / mild hypothermia', 'common', 'Normal mentation, milder temperature derangement — oral or passive rewarming/cooling, hydration, and a safe environment.']
],
history: ['Environment, exertion, clothing, drugs (anticholinergics, diuretics, stimulants, neuroleptics, SSRIs)', 'Last seen well, duration of exposure, submersion details', 'Heart disease, age, alcohol, homelessness', 'Bite or sting: species if known, time, first aid already given'],
exam: ['Core temperature; GCS and sweating (may be absent in classic heat stroke)', 'Shivering vs rigid; pupils; frostbite; arrhythmia', 'Trauma and C-spine indications after submersion', 'Compartment and bite-site exam; fasciculations (elapid/crotalid patterns)'],
workup: [
['Bedside', ['Core temperature; ECG (Osborn J waves, VF risk); glucose; SpO₂', 'Strip and cool, or insulate and rewarm, while lines go in']],
['Labs', ['CBC, coagulation, CK, electrolytes, creatinine, LFTs, lactate, ABG/VBG', 'DIC panel and glucose in heat stroke; potassium in hypothermia (rises with rewarming)']],
['Imaging / extras', ['CXR after submersion; CT head if trauma or unexplained coma', 'Do not delay cooling or rewarming for a scanner']]
],
redFlags: ['Any CNS change with a high core temperature', 'Core temperature <30°C or cardiac arrest in the cold', 'Submersion with apnea or foam', 'Rising CK, falling platelets, or hypoglycemia after heat exposure', 'Progressive swelling or paralysis after a bite', 'Anticholinergic or neuroleptic exposure in a heat wave'],
disposition: [
['Discharge', 'Heat exhaustion or mild hypothermia with normal mentation, a safe warm/cool environment, and reliable observation.'],
['Admit', 'Heat stroke after cooling (even if mentation improved), moderate hypothermia, submersion with any respiratory findings, envenomation needing observation.'],
['ICU / ECMO / antivenom pathway', 'Heat stroke with organ failure, hypothermic arrest, severe submersion hypoxia, shock from envenomation.']
],
pitfalls: ['Waiting for a \u201Cdiagnosis\u201D before cooling a hot, altered patient.', 'Using paracetamol to treat heat stroke.', 'Declaring death in hypothermia before adequate rewarming.', 'Rough handling of the severely hypothermic patient (VF).', 'Skipping C-spine in a diver, or immobilizing every pool drowning.', 'Cutting and sucking snakebites — call the poison centre instead.'],
pearls: ['Hot and altered: cool now. Cold and lifeless: warm before you stop.', 'Ice-water immersion is the treatment of exertional heat stroke, not a last resort.', 'Antipyretics do not treat environmental hyperthermia.', 'Core temperature, not the forehead thermometer, decides the pathway.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — heat, cold, submersion, envenomation', 'Wilderness Medical Society & NATA/ACSM exertional heat-stroke statements', 'AHA hypothermia and drowning resuscitation guidance']
},
{
id: 'palpitations', name: 'Palpitations & Dysrhythmia', icon: '💓',
tag: 'Capture the rhythm, then decide whether the patient or the ECG is unstable.',
overview: 'Palpitations range from benign ectopy to a rhythm causing shock, ischemia, heart failure, or syncope. The first ECG and a strip during symptoms are more valuable than retrospective labels.',
approach: ['ABCs, monitor, IV access and 12-lead ECG; treat instability immediately.', 'Classify regular versus irregular and narrow versus wide only after checking the patient.', 'Search for ischemia, electrolyte disturbance, thyroid disease, stimulant use, structural disease, and inherited-risk clues.'],
dontMiss: [['Unstable tachyarrhythmia or bradyarrhythmia', 'critical', 'Hypotension, shock, ischemic pain, pulmonary edema, or altered mentation means immediate resuscitation per local ACLS protocol.'], ['Ventricular tachycardia', 'critical', 'Assume wide-complex tachycardia is VT until expert review proves otherwise.'], ['Pre-excited atrial fibrillation', 'critical', 'Irregular wide-complex rhythm may deteriorate rapidly; avoid AV-nodal-only treatment and seek expert help.'], ['ACS, PE, dissection, or toxicologic cause', 'emergent', 'Palpitations may be the presenting symptom of another time-critical illness.'], ['Sinus tachycardia / ectopy', 'common', 'A diagnosis of exclusion; explain and treat the driver rather than only the rate.']],
history: ['Onset/offset, regularity, duration, exertional or supine symptoms', 'Syncope, chest pain, dyspnea, neurologic symptoms, family history of sudden death', 'Stimulants, alcohol, supplements, medications, thyroid disease, prior ECG/device'],
exam: ['Perfusion, blood pressure, mental status, heart-failure signs', 'Pulse regularity and rate; murmurs; volume status', 'Look for toxidrome, fever, anemia, or thyrotoxicosis clues'],
workup: [['Immediate', ['12-lead ECG and continuous rhythm monitoring', 'Glucose and targeted electrolytes; pregnancy test when relevant']], ['Targeted', ['Troponin when ischemia is possible; CBC, magnesium, TSH when clinically indicated', 'POCUS/echo when structural disease, heart failure, or pericardial disease is suspected']], ['Do not miss', ['Obtain prior ECGs and device interrogation when available', 'Ambulatory monitoring only after dangerous rhythm and structural disease are reasonably excluded']]],
redFlags: ['Syncope or persistent hypotension', 'Wide-complex or very rapid rhythm', 'Chest pain, ischemic ECG changes, or acute heart failure', 'Known structural heart disease or inherited-arrhythmia history', 'Palpitations during exertion or with stimulant/toxin exposure'],
disposition: [['Discharge', 'Resolved low-risk symptoms, reassuring ECG/assessment, no syncope or structural-risk features, and reliable follow-up.'], ['Observation / telemetry', 'Uncaptured recurrent symptoms, abnormal ECG, electrolyte correction, new AF, or uncertain cause.'], ['Resuscitation / ICU / cardiology', 'Unstable rhythm, VT, pre-excitation concern, high-grade block, ischemia, or decompensated heart failure.']],
pitfalls: ['Calling every fast rhythm anxiety before obtaining an ECG.', 'Treating a wide rhythm as SVT without considering VT or pre-excitation.'],
pearls: ['The patient’s perfusion determines urgency; the ECG defines the next branch.', 'A rhythm strip during symptoms is often the diagnostic test.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — dysrhythmias', 'AHA ACLS and ACC/AHA/HRS arrhythmia guidance; apply local protocols']
},
{
id: 'focal-neurologic-deficit', name: 'Focal Neurologic Deficit / Suspected Stroke', icon: '🧠',
tag: 'Time last known well, glucose, disability, imaging, reperfusion team.',
overview: 'A new focal deficit is stroke until proven otherwise, but hemorrhage, seizure, hypoglycemia, migraine, dissection, and toxic-metabolic causes may mimic it. The clock starts at last known well, not arrival.',
approach: ['Record last-known-well, baseline function, anticoagulants, glucose, and deficit severity.', 'Activate the local stroke pathway; noncontrast CT excludes hemorrhage and vascular imaging selects thrombectomy candidates.', 'Do not let a low NIHSS dismiss a disabling deficit; reperfusion eligibility is protocol- and imaging-dependent.'],
dontMiss: [['Acute ischemic stroke with disabling deficit', 'critical', 'Rapid stroke-team assessment; IV thrombolysis and/or thrombectomy eligibility follows local protocol and imaging.'], ['Intracranial hemorrhage', 'critical', 'CT first; control physiology and reverse anticoagulation per local pathway.'], ['Basilar artery occlusion', 'critical', 'Vertigo, diplopia, dysarthria, weakness, coma, or fluctuating signs demand posterior-circulation vigilance.'], ['Cervical artery dissection', 'emergent', 'Neck pain/headache with partial Horner syndrome or focal deficit; CTA/MRA.'], ['Hypoglycemia, seizure/Todd paralysis, migraine', 'common', 'Treat mimics promptly, but do not delay stroke imaging when uncertainty remains.']],
history: ['Last known well, wake-up symptoms, exact deficit onset and progression', 'Anticoagulants, recent surgery/bleeding, prior stroke, seizure, headache/neck trauma', 'Baseline disability, pregnancy/postpartum status, vascular risk factors'],
exam: ['Glucose, NIHSS/local stroke scale, gaze/visual fields/language/neglect', 'Posterior signs: gait, dysarthria, diplopia, crossed findings', 'Blood pressure, airway, swallowing and aspiration risk'],
workup: [['Immediate', ['Bedside glucose, ECG, CBC/coagulation and type/screen without delaying imaging', 'Noncontrast CT; CTA head/neck and perfusion/advanced imaging per local stroke protocol']], ['Targeted', ['Pregnancy test when relevant; troponin and rhythm monitoring', 'MRI when diagnosis or wake-up/extended-window selection remains uncertain']], ['Avoid delay', ['Do not wait for every laboratory result before activating the reperfusion pathway unless locally required']]],
redFlags: ['Disabling aphasia, neglect, hemiparesis, or visual loss', 'Reduced consciousness or brainstem/posterior-circulation signs', 'Thunderclap headache, vomiting, meningismus, or seizure', 'Neck pain after minor trauma or new Horner syndrome', 'Anticoagulation or severe hypertension with neurologic change'],
disposition: [['Discharge', 'Only after a confirmed low-risk mimic or specialist-directed TIA pathway with rapid follow-up.'], ['Stroke unit', 'Confirmed stroke/TIA, persistent deficit, or incomplete etiologic assessment.'], ['Resuscitation / neuro-ICU / thrombectomy centre', 'Reperfusion candidate, hemorrhage, large-vessel occlusion, declining consciousness, or airway risk.']],
pitfalls: ['Using arrival time rather than last-known-well.', 'Calling a mild NIHSS “minor” when the deficit is disabling for the patient.'],
pearls: ['Glucose is immediate, but it is not a reason to postpone imaging once corrected.', 'Posterior strokes can be subtle and still catastrophic.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — acute stroke', '2026 AHA/ASA Early Management of Acute Ischemic Stroke Guideline; local stroke pathway']
},
{
id: 'airway-stridor', name: 'Airway Symptoms & Stridor', icon: '🗣️',
tag: 'Recognize a threatened airway early; call help before the airway becomes impossible.',
overview: 'Stridor, drooling, muffled voice, rapidly changing voice, or escalating work of breathing can signal upper-airway failure. Do not agitate, lie flat, or repeatedly instrument a patient who is maintaining a precarious airway.',
approach: ['Assess ability to speak, swallow secretions, oxygenate, and lie flat while calling senior airway help early.', 'Differentiate obstruction (foreign body, edema, infection, mass) from lower-airway wheeze.', 'Prepare a shared airway plan: primary approach, backup, and surgical-airway rescue; use local protocols.'],
dontMiss: [['Impending upper-airway obstruction', 'critical', 'Stridor at rest, drooling, muffled voice, exhaustion, or altered mentation requires immediate expert airway management.'], ['Anaphylaxis / angioedema', 'critical', 'Treat as anaphylaxis when systemic allergic features or airway progression are present; do not wait for rash.'], ['Epiglottitis / deep-neck-space infection', 'critical', 'Toxic appearance, odynophagia out of proportion, trismus, neck swelling, or voice change; avoid forceful examination.'], ['Foreign body aspiration', 'critical', 'Sudden onset, unilateral findings, choking, or persistent symptoms after a choking event.'], ['Croup, laryngitis, vocal-cord dysfunction', 'common', 'Still reassess after therapy; a quiet or tiring patient is not reassuring.']],
history: ['Tempo, choking event, allergen/ACE-inhibitor exposure, fever and odynophagia', 'Voice change, drooling, dysphagia, neck surgery/radiation, immunosuppression', 'Prior difficult airway, asthma/COPD, inhalation injury'],
exam: ['Work of breathing, stridor at rest, ability to phonate and manage secretions', 'Oral/neck swelling only if safe; trismus, tongue elevation, urticaria', 'Avoid upsetting a child with suspected epiglottitis; keep position of comfort'],
workup: [['Immediate', ['Continuous monitoring and airway equipment; capnography when feasible', 'Flexible visualization or imaging only when the airway is stable and expert teams agree']], ['Targeted', ['CT neck with contrast for stable suspected deep-neck infection', 'CXR/neck radiography only when it will not delay airway care']], ['Do not delay', ['Airway intervention for a scanner, blood work, or a perfect diagnosis']]],
redFlags: ['Stridor at rest or silent/tiring airway', 'Drooling, tripod position, inability to lie flat', 'Rapidly progressive face/tongue/neck swelling', 'Muffled voice, trismus, toxic appearance', 'Burns, soot, enclosed-space smoke exposure'],
disposition: [['Discharge', 'Clearly benign cause, resolved symptoms, normal observation period, and reliable return precautions.'], ['Admit / ENT / anesthesia', 'Persistent stridor, suspected infection, recurrent edema, or uncertain airway trajectory.'], ['Resuscitation / operating room', 'Threatened airway, rapidly progressive swelling, inhalation injury, or foreign body with obstruction.']],
pitfalls: ['Repeated tongue-depressor examination in a threatened infectious airway.', 'Calling stridor “wheeze” and delaying upper-airway planning.'],
pearls: ['A calm, upright patient is often buying time—do not remove their compensations.', 'The best airway plan includes a backup and surgical rescue before the first attempt.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — airway and upper-respiratory emergencies', 'ACEP airway resources; local difficult-airway and ENT pathways']
},
{
id: 'rash', name: 'Rash, Purpura & Dermatologic Emergencies', icon: '🩹',
tag: 'Rash is skin until it is sepsis, necrosis, mucosal disease, or anaphylaxis.',
overview: 'Most rashes are benign, but the dangerous minority declare themselves through toxicity, nonblanching purpura, pain out of proportion, mucosal involvement, skin failure, or rapid progression.',
approach: ['Assess illness severity, vital signs, mucosa, eyes, palms/soles, and whether lesions blanch.', 'Separate infectious/toxic, medication-related, ischemic/necrotizing, and allergic patterns.', 'Photograph or mark progression when appropriate; reassess rather than trusting a single examination.'],
dontMiss: [['Meningococcemia / purpura fulminans', 'critical', 'Toxic patient with nonblanching petechiae or purpura: resuscitate, cultures/antibiotics per sepsis protocol, and escalate.'], ['Necrotizing soft-tissue infection', 'critical', 'Pain out of proportion, rapid progression, bullae, anesthesia, or systemic toxicity; urgent surgical review.'], ['SJS/TEN or severe drug reaction', 'critical', 'Mucosal erosions, targetoid/blistering rash, skin pain, or detachment after a medication exposure.'], ['Anaphylaxis / angioedema', 'critical', 'Skin findings plus airway, breathing, circulation, or severe GI involvement is anaphylaxis.'], ['Cellulitis, urticaria, viral exanthem', 'common', 'Treat the patient and disposition according to systemic features and progression.']],
history: ['New drugs in the last days to weeks, immunization, infection, travel, contacts', 'Fever, pain, mucosal/ocular symptoms, pruritus, rapid progression', 'Immunosuppression, anticoagulation, animal/tick exposure, pregnancy'],
exam: ['Vitals and toxic appearance; blanching versus nonblanching', 'Mucosa, eyes, palms/soles, skin tenderness, bullae, crepitus', 'Mark margins of suspected cellulitis; full-body examination when concern is high'],
workup: [['Immediate', ['Sepsis workup and broad treatment when toxic or purpuric', 'Surgical consultation first when necrotizing infection is plausible']], ['Targeted', ['CBC, renal/liver tests, coagulation, cultures when systemically unwell', 'Biopsy/dermatology and ophthalmology input for suspected severe cutaneous adverse reaction']], ['Avoid delay', ['Do not use normal labs or imaging to rule out necrotizing infection when the examination is concerning']]],
redFlags: ['Nonblanching purpura with fever or shock', 'Painful, rapidly spreading, anesthetic, bullous, or necrotic skin', 'Mucosal or ocular involvement', 'Facial/tongue swelling, wheeze, hypotension', 'New high-risk medication with skin pain or blistering'],
disposition: [['Discharge', 'Clearly benign, stable rash with explicit return precautions and follow-up.'], ['Admit / specialty review', 'Extensive cellulitis, immunocompromise, diagnostic uncertainty, mucosal disease, or failed outpatient treatment.'], ['Resuscitation / OR / burn-level care', 'Sepsis/purpura, necrotizing infection, anaphylaxis, or extensive SJS/TEN.']],
pitfalls: ['Calling painful skin disease simple cellulitis without considering necrosis or drug reaction.', 'Ignoring eye and mucosal examination in blistering disease.'],
pearls: ['Nonblanching plus toxic is a sepsis emergency until proven otherwise.', 'Skin pain is a higher-risk clue than itch.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — dermatologic presentations', 'IDSA skin/soft-tissue infection guidance; local burn/dermatology pathways']
},
{
id: 'flank-pain', name: 'Flank Pain & Renal Colic', icon: '🪨',
tag: 'Confirm the stone—but first exclude infected obstruction, AAA, and the surgical mimics.',
overview: 'Renal colic is common, but flank pain can be vascular, infectious, gynecologic, gastrointestinal, or spinal. A stone with sepsis, solitary kidney, anuria, or refractory symptoms is not a routine discharge.',
approach: ['Check vital signs, pregnancy status, urinalysis, renal function, and analgesic response.', 'Look for sepsis or obstruction before choosing outpatient stone care.', 'Use ultrasound or CT according to risk, first episode, diagnostic uncertainty, pregnancy, and local pathways.'],
dontMiss: [['Infected obstructed urinary system', 'critical', 'Fever/systemic illness plus obstruction requires urgent urology drainage and antibiotics—not outpatient stone management.'], ['Ruptured AAA / aortic dissection', 'critical', 'Older patient, hypotension, vascular risk, abdominal/back pain, or pulse deficit: image the aorta.'], ['Pyelonephritis with sepsis', 'critical', 'Fever, flank tenderness, shock, or vomiting warrants sepsis treatment and source-control assessment.'], ['Ectopic pregnancy / ovarian torsion', 'emergent', 'Pregnancy test and pelvic consideration remain essential when anatomy and symptoms fit.'], ['Uncomplicated ureteric stone', 'common', 'Analgesia, hydration advice, urine straining where used, and follow-up depend on size, location, renal function, and symptoms.']],
history: ['Colicky versus constant pain, radiation to groin, urinary symptoms, hematuria', 'Fever/chills, vomiting, anuria, solitary kidney, prior stones/urologic procedures', 'Pregnancy possibility, anticoagulation, vascular disease, trauma'],
exam: ['Vitals and sepsis screen; abdominal, CVA, vascular, and genital/pelvic examination as indicated', 'Look for peritonism, pulsatile mass, testicular tenderness, or neurologic deficit', 'Reassess pain and oral tolerance after treatment'],
workup: [['Bedside', ['Urinalysis, pregnancy test when relevant, creatinine', 'POCUS for hydronephrosis and aortic screening when indicated']], ['Imaging', ['Low-dose noncontrast CT for uncertain/high-risk cases per local policy', 'Ultrasound/MRI pathway in pregnancy or radiation-sensitive patients']], ['Targeted', ['CBC/cultures/lactate if febrile or systemically unwell', 'Do not rely on hematuria alone to prove or exclude a stone']]],
redFlags: ['Fever, rigors, hypotension, or toxicity', 'Anuria, solitary kidney, acute kidney injury, or bilateral obstruction', 'Uncontrolled pain or vomiting', 'Older patient with vascular risk or hypotension', 'Pregnancy with pain or bleeding'],
disposition: [['Discharge', 'Uncomplicated symptoms controlled orally, no infection/AKI/high-risk anatomy, and clear follow-up.'], ['Admit / urology', 'Infection concern, AKI, refractory symptoms, large/complicated stone, or unreliable follow-up.'], ['Urgent drainage / resuscitation', 'Septic obstructed system, anuria with obstruction, or vascular catastrophe.']],
pitfalls: ['Diagnosing a stone from hematuria alone.', 'Discharging a febrile obstructed patient with antibiotics but no drainage plan.'],
pearls: ['The emergency is infection plus obstruction, not the stone size alone.', 'A first or atypical episode deserves a broader differential.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — renal and genitourinary emergencies', 'EAU/AUA urolithiasis guidance; local imaging and urology pathways']
},
{
id: 'urinary-retention', name: 'Urinary Symptoms & Acute Retention', icon: '🚻',
tag: 'Measure the bladder, relieve obstruction safely, and never miss cord compression or sepsis.',
overview: 'Dysuria and retention are often straightforward, but retention can be the first sign of cauda equina, spinal cord disease, medication toxicity, obstructed infection, or a neurologic emergency.',
approach: ['Assess for sepsis, renal failure, neurologic deficits, and painful distension.', 'Use bladder scan and urinalysis; decompress acute retention using local catheter practice while tracking output.', 'Escalate early for suspected cauda equina, infected obstruction, traumatic catheterization risk, or recurrent retention.'],
dontMiss: [['Cauda equina syndrome / spinal cord compression', 'critical', 'Back pain with saddle sensory change, new retention/incontinence, bilateral symptoms, or weakness needs urgent MRI and spine review.'], ['Urosepsis / infected obstruction', 'critical', 'Systemic illness with urinary source needs sepsis treatment and source-control assessment.'], ['Acute kidney injury from obstruction', 'emergent', 'Bilateral obstruction, solitary kidney, anuria, or rising creatinine requires urgent decompression planning.'], ['Prostatitis with retention', 'emergent', 'Fever, pelvic pain, toxic appearance; avoid traumatic repeated instrumentation and involve urology.'], ['UTI / medication-related / BPH-related symptoms', 'common', 'Use targeted therapy and follow-up after excluding high-risk features.']],
history: ['Last void, suprapubic pain, stream changes, hematuria, fever', 'Back pain, saddle symptoms, weakness, cancer, anticoagulation, trauma', 'Medication/anticholinergic/opioid exposure; neurologic disease; pregnancy'],
exam: ['Vitals, suprapubic fullness, flank tenderness, genital examination when indicated', 'Focused lower-limb neurologic and perineal examination when red flags exist', 'Bladder scan before and after intervention when feasible'],
workup: [['Bedside', ['Bladder scan, urinalysis/culture when infection suspected, pregnancy test when relevant', 'ECG/electrolytes/creatinine for significant retention, AKI, or systemic illness']], ['Imaging', ['Renal ultrasound for hydronephrosis/high-risk obstruction', 'Urgent MRI for suspected cauda equina/spinal compression']], ['Procedure', ['Catheterize using local policy; document volume, hematuria, complications, and a removal/follow-up plan']]],
redFlags: ['Saddle anesthesia, bilateral weakness, or new bowel dysfunction', 'Fever/shock or rigors with urinary symptoms', 'Anuria, AKI, or a solitary kidney', 'Gross hematuria/clots or traumatic catheterization', 'Known malignancy, recent spinal procedure, or IV drug use with back pain'],
disposition: [['Discharge', 'Simple lower-tract symptoms or resolved retention with safe catheter plan and timely follow-up.'], ['Admit / urology', 'AKI, recurrent/complicated retention, infection, difficult catheterization, or high-risk anatomy.'], ['Urgent MRI / spine / resuscitation', 'Cauda equina/spinal compression or sepsis with obstruction.']],
pitfalls: ['Attributing retention to BPH without a neurologic screen.', 'Repeated traumatic catheter attempts instead of escalating.'],
pearls: ['Retention plus saddle symptoms is a spine emergency.', 'The discharge plan must specify catheter care and who removes it.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — genitourinary and spinal emergencies', 'AUA urologic emergencies resources; local catheter and cauda-equina pathways']
},
{
id: 'edema', name: 'Peripheral Edema', icon: '🦶',
tag: 'Bilateral or unilateral? Volume overload, venous disease, thrombosis, or a systemic cause?',
overview: 'Edema is a finding, not a diagnosis. The high-risk split is acute unilateral swelling that may be DVT or infection versus bilateral edema with heart, renal, hepatic, medication, or low-protein causes.',
approach: ['Check oxygenation, blood pressure, weight change, and whether swelling is unilateral or bilateral.', 'Screen for acute heart failure, DVT/PE, cellulitis/necrotizing infection, renal failure, and liver disease.', 'Use focused ultrasound and probability-based testing rather than treating all swelling as simple fluid retention.'],
dontMiss: [['Acute heart failure / pulmonary edema', 'critical', 'Dyspnea, hypoxia, JVP elevation, crackles, or diffuse B-lines require an acute-heart-failure assessment.'], ['DVT with pulmonary embolism', 'critical', 'Unilateral swelling plus chest symptoms, syncope, or hypoxia needs VTE pathway assessment.'], ['Necrotizing infection / compartment syndrome', 'critical', 'Pain out of proportion, rapid progression, bullae, anesthesia, or systemic toxicity.'], ['Acute kidney injury / nephrotic syndrome / hepatic decompensation', 'emergent', 'Generalized edema with oliguria, severe hypertension, ascites, or biochemical derangement.'], ['Chronic venous insufficiency / medication-related edema', 'common', 'Consider after dangerous vascular and systemic causes are excluded.']],
history: ['Unilateral/bilateral onset, pain, erythema, weight gain, dyspnea, orthopnea', 'VTE risks, immobilization, malignancy, estrogen, anticoagulation', 'Heart/renal/liver disease, pregnancy, calcium-channel blockers/NSAIDs, protein loss'],
exam: ['Vitals, oxygenation, JVP, lungs, cardiac and abdominal examination', 'Compare calves; tenderness, warmth, pulses, skin changes, pitting', 'Assess for ascites, sacral edema, infection, and neurovascular compromise'],
workup: [['Bedside', ['POCUS: lung B-lines, cardiac function, IVC context, compression ultrasound where trained', 'ECG and CXR when heart failure or PE is plausible']], ['Labs', ['Creatinine/electrolytes, liver tests, albumin, urinalysis/protein, BNP when clinically useful', 'Probability-based D-dimer/ultrasound for suspected DVT']], ['Imaging', ['Formal venous ultrasound when indicated; avoid using a negative D-dimer in high pretest probability']]],
redFlags: ['Dyspnea, hypoxia, chest pain, syncope, or hypotension', 'Rapid painful unilateral swelling', 'Fever, bullae, anesthesia, or pain out of proportion', 'Oliguria, severe hypertension, or generalized edema', 'Pregnancy/postpartum with new edema plus headache, dyspnea, or hypertension'],
disposition: [['Discharge', 'Stable chronic/medication-related edema with dangerous causes excluded and follow-up arranged.'], ['Admit', 'New heart/renal/hepatic decompensation, cellulitis requiring IV treatment, or uncertain VTE workup.'], ['Resuscitation / specialty pathway', 'Pulmonary edema, PE with instability, necrotizing infection, or compartment concern.']],
pitfalls: ['Giving diuretics before confirming volume overload.', 'Assuming bilateral edema excludes DVT or acute heart failure.'],
pearls: ['Unilateral edema is a vascular/infectious question first; bilateral edema is a systemic question first.', 'POCUS helps, but it does not replace clinical probability.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — cardiovascular, vascular, renal and hepatic emergencies', 'ACEP acute heart-failure clinical policy; VTE pathways']
},
{
id: 'anaphylaxis', name: 'Anaphylaxis & Angioedema', icon: '🆘',
tag: 'Airway, breathing, circulation: epinephrine first when anaphylaxis is suspected.',
overview: 'Anaphylaxis is a clinical diagnosis. Skin findings may be absent; progression of airway, breathing, circulation, or severe gastrointestinal symptoms after an exposure is enough to act. Angioedema may be histamine-mediated or bradykinin-mediated and airway progression matters more than the label.',
approach: ['Call for airway help early when voice, tongue, floor-of-mouth, or breathing changes appear.', 'Give IM epinephrine promptly for suspected anaphylaxis per local protocol; do not delay for antihistamines or steroids.', 'Observe according to severity, treatment response, comorbidity, and local policy; discharge only with education and an autoinjector plan where appropriate.'],
dontMiss: [['Anaphylaxis with airway/breathing/circulation involvement', 'critical', 'IM epinephrine and resuscitation per local protocol; prepare for a difficult airway.'], ['Rapidly progressive tongue/laryngeal angioedema', 'critical', 'Voice change, drooling, stridor, or inability to manage secretions requires immediate expert airway planning.'], ['Refractory shock', 'critical', 'Escalate to monitored resuscitation and vasopressor/critical-care pathway after repeated IM treatment and fluids per protocol.'], ['Bradykinin-mediated angioedema', 'emergent', 'ACE-inhibitor or hereditary pattern may lack urticaria and respond poorly to antihistamines; airway management remains central.'], ['Isolated urticaria', 'common', 'No airway, breathing, circulation, or severe GI involvement; still give explicit escalation advice.']],
history: ['Trigger and timing: food, drug, venom, latex, exercise/cofactor, ACE inhibitor', 'Prior reactions, asthma, mast-cell disease, beta blocker use', 'Voice change, dysphagia, wheeze, vomiting, syncope, abdominal cramps'],
exam: ['Airway/voice/secretions; tongue, lips, face, and floor of mouth', 'Work of breathing, wheeze/stridor, perfusion and blood pressure', 'Skin may be normal—do not use absence of hives to rule it out'],
workup: [['Immediate', ['Continuous monitoring, repeat airway examinations, ECG/glucose as clinically indicated', 'Treat first; testing is not required to diagnose anaphylaxis']], ['Targeted', ['Tryptase may support later specialist assessment but must never delay treatment', 'Investigate alternative shock/airway diagnoses when the presentation is atypical']], ['Discharge readiness', ['Document trigger uncertainty, action plan, autoinjector teaching and allergy referral per local practice']]],
redFlags: ['Stridor, hoarseness, drooling, tongue/floor-of-mouth swelling', 'Hypotension, syncope, cyanosis, severe wheeze', 'Rapid progression or repeated epinephrine requirement', 'Severe asthma or delayed presentation', 'ACE-inhibitor/hereditary angioedema with voice change'],
disposition: [['Discharge', 'Complete resolution after appropriate observation, with action plan, epinephrine-autoinjector pathway, trigger avoidance, and follow-up.'], ['Admit / monitored observation', 'Persistent symptoms, severe asthma, significant comorbidity, unreliable access to rescue treatment, or evolving angioedema.'], ['Resuscitation / ICU / airway team', 'Airway compromise, shock, refractory symptoms, or repeated epinephrine requirement.']],
pitfalls: ['Using antihistamines or steroids instead of epinephrine for anaphylaxis.', 'Waiting for rash before treating airway or circulatory involvement.'],
pearls: ['Epinephrine is the first-line rescue treatment; adjuncts do not secure an airway or reverse shock.', 'Angioedema is an airway trajectory problem—reassess repeatedly.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — allergy, anaphylaxis and angioedema', 'WAO anaphylaxis guidance; local anaphylaxis and difficult-airway protocols']
},
{
id: 'multiple-trauma', name: 'Multiple Trauma / Primary Survey', icon: '🚑',
tag: 'Treat immediate threats in order; reassess after every intervention.',
overview: 'Major trauma is a time-critical systems problem. A structured primary survey prevents fixation on a visible injury while airway obstruction, tension physiology, hemorrhage, brain injury, or pelvic bleeding progresses.',
approach: ['Activate the trauma team and use local primary-survey, massive-transfusion, and imaging pathways.', 'Address catastrophic external hemorrhage, then airway, breathing, circulation, disability, and exposure with repeated reassessment.', 'Use physiology and mechanism to guide imaging; a stable patient can deteriorate during transfer or scanning.'],
dontMiss: [['Catastrophic hemorrhage', 'critical', 'Tourniquet/pressure/pelvic stabilization and massive-transfusion pathway per local protocol; definitive control is surgical/IR.'], ['Tension pneumothorax / massive hemothorax', 'critical', 'Treat clinically in an unstable patient; do not wait for imaging.'], ['Traumatic brain injury with herniation risk', 'critical', 'Prevent hypoxia and hypotension; urgent neuro/trauma input.'], ['Unstable pelvic, abdominal, or vascular injury', 'critical', 'Shock after blunt/penetrating trauma needs rapid source-control decisions.'], ['Spinal cord injury / airway burn', 'emergent', 'Immobilize selectively by mechanism and examination; plan early airway support for inhalation injury.']],
history: ['Mechanism, time, anticoagulants, allergies/medications, baseline function when available', 'Prehospital vitals/interventions and response', 'Pregnancy, comorbidity, tetanus and blood-product considerations'],
exam: ['Primary survey with team communication and repeated vital trends', 'Head-to-toe secondary survey only after immediate threats are addressed', 'Distal pulses, neurologic status, log-roll/skin, temperature'],
workup: [['Immediate', ['eFAST, portable chest/pelvis imaging as indicated, blood gas/lactate/type and cross', 'Massive-transfusion and tranexamic-acid pathways only under local trauma protocol']], ['Imaging', ['CT trauma series for stable or transient responder per team decision', 'Do not send an unstable patient to CT when they need the operating room/IR']], ['Reassessment', ['Repeat primary survey after airway procedure, decompression, transfusion, movement, and clinical change']]],
redFlags: ['Hypotension, tachycardia, altered mental status, or rising lactate', 'Penetrating torso/neck trauma or high-risk mechanism', 'Unilateral absent breath sounds, distended neck veins, severe respiratory distress', 'Unstable pelvis, abdominal distension, external hemorrhage', 'Anticoagulation, pregnancy, frailty, or pediatric age'],
disposition: [['Discharge', 'Only after a complete evaluation for low-risk trauma, normal observation when needed, and reliable precautions.'], ['Admit / trauma service', 'Significant injury, serial examination need, anticoagulation/frailty risk, or pain/functional barrier.'], ['OR / IR / ICU / transfer', 'Ongoing hemorrhage, airway/thoracic emergency, major TBI, unstable spine, or need for higher-level trauma care.']],
pitfalls: ['Completing a secondary survey before hemorrhage or tension physiology is controlled.', 'Treating a single normal pressure as proof that bleeding has stopped.'],
pearls: ['The primary survey is a loop, not a checklist completed once.', 'Do not make CT the destination of an unstable trauma patient.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — multiple trauma and trauma systems', 'ACS ATLS principles; local trauma and massive-transfusion protocols']
},
{
id: 'falls-geriatric-trauma', name: 'Falls & Geriatric Trauma', icon: '🧓',
tag: 'A fall may be injury, syncope, medication harm, infection, or a sentinel loss of function.',
overview: 'Older adults can have major injury and serious medical precipitants after low-energy mechanisms. Pain and examination may be muted; anticoagulation, frailty, baseline cognition, and safe disposition matter as much as the initial radiograph.',
approach: ['Treat injury and ask why the fall happened: trip, collapse, dizziness, seizure, stroke, medication effect, or infection.', 'Lower the threshold for head, cervical-spine, pelvic, and hip evaluation when examination or history is unreliable.', 'Assess mobility, cognition, supports, medications, and ability to return safely before discharge.'],
dontMiss: [['Intracranial hemorrhage', 'critical', 'Head strike, anticoagulation, altered baseline, vomiting, or new neurologic symptom warrants a low imaging threshold and local pathway.'], ['Hip/pelvic fracture', 'critical', 'Persistent hip/groin pain or inability to bear weight can be occult despite normal initial radiographs.'], ['Syncope/arrhythmia/ACS/stroke as precipitant', 'critical', 'An unexplained fall may be transient loss of consciousness or neurologic event.'], ['Cervical-spine injury', 'emergent', 'Neck pain, neurologic symptoms, distracting injury, or unreliable assessment needs imaging per local rule/pathway.'], ['Delirium, infection, medication toxicity, dehydration', 'emergent', 'Often the cause of the fall and a marker of unsafe discharge.']],
history: ['Witnesses, prodrome, loss of consciousness, head strike, time on floor', 'Baseline mobility/cognition, medications including anticoagulants/sedatives', 'Chest pain, palpitations, focal symptoms, urinary/respiratory infection symptoms'],
exam: ['Full trauma and neurologic examination; skin for pressure injury', 'Orthostatic context only after urgent causes are considered', 'Gait/transfer assessment and delirium screen when safe'],
workup: [['Immediate', ['ECG, glucose, targeted labs; CT head/c-spine per risk and local pathway', 'X-ray hip/pelvis; CT/MRI for persistent suspicion with negative radiographs']], ['Targeted', ['Urinalysis/cultures only when symptoms or systemic concern support infection testing', 'Medication review and collateral history']], ['Safety', ['PT/OT, social work, caregiver communication, mobility aids, and falls-prevention referral where available']]],
redFlags: ['Anticoagulation with head impact or neurologic change', 'Inability to bear weight, severe hip/groin or neck pain', 'Unwitnessed collapse, exertional fall, or prodromal palpitations/chest pain', 'New delirium, hypotension, fever, or prolonged time on floor', 'Unsafe home environment or no reliable observation'],
disposition: [['Discharge', 'No serious injury/medical cause, safe ambulation or support plan, and explicit return precautions.'], ['Admit / observation', 'Occult-injury concern, functional decline, delirium, medical precipitant, or unsafe disposition.'], ['Trauma / neurology / cardiology pathway', 'Hemorrhage, fracture, syncope/arrhythmia, stroke, or significant trauma.']],
pitfalls: ['Calling it a mechanical fall without asking about prodrome or collapse.', 'Using a negative X-ray to dismiss persistent inability to bear weight.'],
pearls: ['A successful ED disposition restores safety, not only normal vital signs.', 'Frailty and anticoagulation lower the threshold for imaging and observation.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — geriatric emergency and trauma care', 'ACEP geriatric emergency-department resources; local head-injury pathways']
},
{
id: 'pregnancy-emergency', name: 'Pregnancy-Related Emergency', icon: '🤰',
tag: 'Pregnancy status changes the differential, imaging, medications, destination, and team.',
overview: 'Pregnant and postpartum patients can present with the same emergencies as anyone else plus pregnancy-specific catastrophes. The ED must stabilize first, establish gestational/postpartum context, and involve obstetric expertise early under local pathways.',
approach: ['Confirm pregnancy status and gestational/postpartum age without delaying resuscitation.', 'Prioritize hemorrhage, ectopic pregnancy, severe hypertension/eclampsia, thromboembolism, sepsis, trauma, and cardiopulmonary disease.', 'Use obstetric, anesthesia, neonatal, and transfer resources early; local destination protocols matter.'],
dontMiss: [['Ruptured ectopic pregnancy', 'critical', 'Pain/bleeding with positive pregnancy test and instability is a surgical emergency.'], ['Severe preeclampsia / eclampsia', 'critical', 'Severe hypertension, headache, visual symptoms, RUQ pain, dyspnea, seizure, or postpartum presentation needs immediate obstetric protocol.'], ['Obstetric hemorrhage / placental abruption', 'critical', 'Bleeding, pain, uterine tenderness, shock, or trauma requires resuscitation and obstetric escalation.'], ['Pulmonary embolism / peripartum cardiomyopathy', 'critical', 'Dyspnea, chest symptoms, syncope, hypoxia, or new heart-failure signs require urgent evaluation.'], ['Hyperemesis, UTI, uncomplicated early-pregnancy symptoms', 'common', 'Assess hydration, ketones, infection, fetal/obstetric context, and safety-net carefully.']],
history: ['Gestational age, LMP, parity, postpartum interval, prior ectopic/cesarean', 'Bleeding, pain, contractions, fluid loss, fetal movement when relevant', 'Headache, visual symptoms, RUQ pain, dyspnea, VTE risk, trauma, medications'],
exam: ['ABCs and shock assessment; blood pressure with correct cuff', 'Abdominal/uterine tenderness, bleeding estimate, pelvic examination only when appropriate', 'Neuro/respiratory/heart-failure signs; fetal assessment per gestation and local resources'],
workup: [['Immediate', ['Pregnancy test, CBC/type and screen, focused ultrasound when available, ECG/glucose as indicated', 'Rh status and obstetric hemorrhage protocol according to local practice']], ['Imaging', ['Use ultrasound first when suitable; do not withhold indicated maternal imaging for a life-threatening diagnosis', 'CTA/VQ/MRI selection follows local pregnancy pathways']], ['Consultation', ['Early obstetric/anesthesia involvement; arrange transfer to appropriate maternal level of care when needed']]],
redFlags: ['Hypotension, syncope, severe abdominal pain, shoulder pain, or heavy bleeding', 'Severe hypertension, seizure, headache/visual change, RUQ pain', 'Dyspnea, hypoxia, chest pain, syncope, or unilateral leg swelling', 'Trauma, decreased fetal movement, fluid loss, or painful contractions', 'Postpartum symptoms—risk persists after delivery'],
disposition: [['Discharge', 'Only stable low-risk symptoms after obstetric assessment or explicit local follow-up pathway.'], ['Admit / obstetric unit', 'Bleeding, hypertension, infection, hyperemesis with derangement, trauma, or uncertain maternal/fetal status.'], ['Resuscitation / OR / transfer', 'Ectopic rupture, eclampsia, major hemorrhage, severe cardiopulmonary illness, or need for higher-level obstetric care.']],
pitfalls: ['Letting pregnancy delay maternal resuscitation or indicated imaging.', 'Treating postpartum headache, dyspnea, or hypertension as benign without an obstetric differential.'],
pearls: ['The best fetal resuscitation begins with maternal resuscitation.', 'Pregnancy and postpartum status must be visible in every handoff.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — emergencies in pregnancy', 'ACOG obstetric-emergencies resources and local maternal-transfer pathways']
},
{
id: 'pediatric-respiratory-distress', name: 'Child with Respiratory Distress', icon: '🧒',
tag: 'Appearance and work of breathing matter more than the first saturation.',
overview: 'Children compensate until they do not. Recognize respiratory distress early, distinguish upper from lower airway disease, and prepare for failure when fatigue, altered mental status, or poor air entry appears.',
approach: ['Use the pediatric assessment triangle: appearance, work of breathing, circulation to skin.', 'Identify upper-airway obstruction, bronchiolitis/asthma, pneumonia/sepsis, foreign body, anaphylaxis, and metabolic causes.', 'Escalate before exhaustion; pediatric airway support needs experienced hands and weight-based local protocols.'],
dontMiss: [['Impending respiratory failure', 'critical', 'Exhaustion, altered responsiveness, apnea, cyanosis, poor air entry, or a normalizing respiratory rate after severe distress.'], ['Upper-airway obstruction / epiglottitis / bacterial tracheitis', 'critical', 'Stridor at rest, drooling, toxic appearance, tripod position, or voice change needs expert airway planning.'], ['Foreign body aspiration', 'critical', 'Sudden onset or focal unilateral findings after choking can have a normal initial radiograph.'], ['Anaphylaxis', 'critical', 'Airway/breathing/circulation symptoms after exposure require immediate local anaphylaxis protocol.'], ['Asthma, bronchiolitis, pneumonia', 'common', 'Treat and reassess work of breathing, feeding, hydration, and oxygen requirement objectively.']],
history: ['Age, prematurity, immunization, baseline respiratory disease, feeding/urine output', 'Onset, fever, choking, allergen exposure, sick contacts, smoke exposure', 'Apnea, color change, lethargy, prior ICU/intubation, response to home treatment'],
exam: ['Appearance, interaction, tone, consolability, work of breathing, ability to feed/speak', 'Stridor versus wheeze versus crackles; symmetry and air entry', 'Hydration, perfusion, temperature, rash and focal neurologic signs'],
workup: [['Immediate', ['Continuous monitoring when moderate/severe; bedside glucose for altered child', 'Weight-based oxygen/medication/airway care under local pediatric protocol']], ['Targeted', ['CXR, viral testing, blood gas, cultures only when they will change management', 'Foreign-body imaging/bronchoscopy pathway when history/exam warrants']], ['Avoid delay', ['Do not agitate a child with a threatened upper airway for a routine examination or IV']]],
redFlags: ['Apnea, cyanosis, altered mental status, exhaustion, poor air entry', 'Stridor at rest, drooling, tripod position, or inability to feed', 'Hypoxia despite oxygen or rapidly rising oxygen requirement', 'Unilateral absent breath sounds or choking history', 'Young infant, prematurity, serious comorbidity, or unreliable observation'],
disposition: [['Discharge', 'Mild disease with stable work of breathing, safe feeding/hydration, reliable caregivers, and clear precautions.'], ['Admit', 'Oxygen need, dehydration, moderate distress, high-risk age/comorbidity, or uncertain trajectory.'], ['Resuscitation / PICU / specialist airway', 'Failure signs, upper-airway threat, foreign body, anaphylaxis, sepsis, or escalating support.']],
pitfalls: ['Being reassured by a quiet child who is actually tiring.', 'Using a single normal saturation to overrule severe work of breathing.'],
pearls: ['Children often compensate with tachypnea; bradypnea can be a pre-arrest sign.', 'Reassessment after every intervention is part of treatment.'],
refs: ['Rosen’s Emergency Medicine, 10th ed. — pediatric respiratory emergencies', 'AAP/PALS principles and local pediatric airway, asthma, and bronchiolitis pathways']
}
];
if (typeof window !== 'undefined') window.CP_DATA = CP_DATA;

/* ══════════ EM-CPs ECG Interpretation Data ══════════
   Framework: Rosen's Emergency Medicine 10th ed. (2023) — Cardinal Presentations & Acute Resuscitation.
   Corroborated with the Fifth Universal Definition of MI (2026), 2025 ACC/AHA/ACEP ACS,
   2023 ESC ACS, OMI literature (2024–2026), and ACLS resuscitation practice.
   Educational reference only — never replaces clinical judgment or local protocols.
*/
const ECG_DATA = {
    title: 'Emergency ECG Interpretation — From Scratch to the Shift',
    subtitle: 'A systematic 7-step method plus the patterns that change management in the next minutes.',
    tag: 'Read the patient first — then read the tracing systematically.',
    overview: 'The ED ECG is a decision tool, not wallpaper. First: is the patient perfusing, and is this tracing technically real? Then branch the rhythm (rate, regularity, QRS width) and hunt the patterns that change management now — occlusion MI and its equivalents, hyperkalemia, unstable bradycardia or VT, pre-excited AF, and a dangerously long QT. Millimetre STEMI criteria still drive many cath-lab activations, but they miss a large fraction of acute coronary occlusions; that is the OMI skill. New or presumed-new LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP ACS). Compare with an old tracing and repeat the ECG if symptoms evolve.',
    meta: {
        edition: "Rosen's 10th ed. (2023) · 2025 ACC/AHA/ACEP ACS · OMI 2024–2026",
        approach: 'Patient first, then a systematic 7-step method — never jump straight to the ST segments'
    },
    firstPass: [
        'Unstable? Treat the patient. Do not delay defibrillation or cardioversion for a prettier 12-lead.',
        'Is the tracing usable? Speed 25 mm/s, gain 10 mm/mV, limbs not reversed, V1/V2 in the 4th intercostal space.',
        'Branch the rhythm: rate · regular vs irregular · narrow vs wide QRS.',
        'Scan the killers: OMI/STEMI equivalents, hyperK, VT, high-grade AV block, pre-excited AF, QTc ≥500 ms, Type 1 Brugada.',
        'Pull an old ECG and repeat the tracing if symptoms persist, migrate, or return.'
    ],
    redFlags: [
        'Shock, pulmonary edema, severe ischemic pain, or altered mentation with any concerning tracing',
        'STEMI millimetre criteria or an OMI equivalent (Wellens, de Winter, posterior, Smith-modified Sgarbossa, hyperacute T)',
        'Wide-complex tachycardia — treat as VT until proven otherwise',
        'Pre-excited AF (irregular, wide, very fast) — no AV-nodal blockers',
        'Sine-wave, widening QRS, or disappearing P waves — hyperkalemia until proven otherwise',
        'Complete heart block, Mobitz II, or long pauses',
        'QTc ≥500 ms, pause-dependent polymorphic VT, or TdP',
        'Type 1 Brugada pattern, especially with syncope or fever',
        'Low voltage plus electrical alternans plus tachycardia — tamponade until echo says otherwise'
    ],
    steps: [
        {
            num: 1,
            id: 'rate-calibration',
            name: 'Calibration, Leads & Rate',
            icon: '⏱️',
            summary: 'Confirm the tracing is real, then count the ventricular rate yourself.',
            details: [
                '<strong>Standard calibration:</strong> Paper speed 25 mm/s (1 small box = 40 ms; 1 large box = 200 ms). Voltage 10 mm/mV (1 small box = 0.1 mV; 2 large boxes = 1.0 mV). Check the calibration rectangle at the left edge.',
                '<strong>Lead placement before diagnosis:</strong> V1–V2 in the 4th intercostal space at the sternal edge. High V1/V2 creates late RBBB-like rSR′ and can mimic Brugada or posterior OMI. Limb reversal: negative P and QRS in lead I with positive aVR.',
                '<strong>Regular rate (300 rule):</strong> R wave on a heavy line, then 300 ÷ large boxes to the next R: 300, 150, 100, 75, 60, 50, 43, 37. Exact: 1500 ÷ small boxes.',
                '<strong>Irregular rate (6-second rule):</strong> QRS count across 30 large boxes × 10. Mandatory in AF, flutter with variable block, or frequent ectopy.',
                '<strong>ED rate meaning:</strong> Instability is perfusion, not a magic number. Cardiovert if the rate is causing shock, ischemia, heart failure, or AMS. Machine rates fail on artifact, tall T waves, and pacemaker spikes — count it yourself.'
            ],
            pearl: 'Never trust a machine rate or axis on a tachycardic, paced, or artifact-laden tracing. Confirm speed and gain before you call low voltage or LVH.',
            pitfall: 'Missing half-standard (5 mm/mV) or double-standard (20 mm/mV) calibration, which falsely mimics or hides low voltage and LVH. High V1/V2 is a common source of “new RBBB” and false Brugada.'
        },
        {
            num: 2,
            id: 'rhythm-axis',
            name: 'Rhythm Branch & Axis',
            icon: '🧭',
            summary: 'Rate · regularity · QRS width first. Then sinus vs not, then the frontal axis.',
            details: [
                '<strong>The ED rhythm branch (do this before naming the rhythm):</strong> (1) Fast or slow? (2) Regular or irregular? (3) Narrow (&lt;120 ms) or wide (≥120 ms)? That triad is the ACLS fork.',
                '<strong>Sinus 4-point check:</strong> P before every QRS; QRS after every P; P upright in I, II, aVF and inverted in aVR; PR constant 120–200 ms.',
                '<strong>Frontal axis (I and aVF, then confirm with II):</strong>',
                '• <strong>Normal (about −30° to +90°):</strong> Net positive in I and aVF. If aVF is negative, check lead II — positive II means 0° to −30° (physiologic), not pathologic LAD.',
                '• <strong>Pathologic LAD (−30° to −90°):</strong> I positive, aVF negative, II negative → LAFB, LVH, inferior infarct, or LBBB.',
                '• <strong>RAD (+90° to +180°):</strong> I negative, aVF positive → RVH, acute PE, LPFB, lateral infarct, COPD, sodium-channel toxicity, or limb reversal.',
                '• <strong>Extreme / northwest axis (−90° to ±180°):</strong> I and aVF both negative → VT, severe hyperK, or limb-lead reversal until proven otherwise.',
                '<strong>If P in lead I is negative:</strong> arm-lead reversal (P and QRS positive in aVR) vs dextrocardia (whole precordial R-wave progression also reversed).'
            ],
            pearl: 'Name the branch (narrow/wide, regular/irregular) before you name the rhythm. Extreme axis in a wide tachycardia is VT until proven otherwise.',
            pitfall: 'Calling 0° to −30° “left axis” without checking lead II. Diagnosing a rhythm from a single 3-second snapshot when the strip shows something else.'
        },
        {
            num: 3,
            id: 'intervals',
            name: 'Intervals (PR, QRS, QTc)',
            icon: '📏',
            summary: 'PR (AV conduction), QRS (ventricular conduction), QTc (repolarization risk) — in that order.',
            details: [
                '<strong>PR (normal 120–200 ms / 3–5 small boxes):</strong>',
                '• Short (&lt;120 ms): pre-excitation / WPW (delta wave) first. Isolated short PR without a delta wave is not an ED emergency label.',
                '• Long (&gt;200 ms): first-degree AV block — note it, look harder if the patient is on AV-nodal blockers or has Lyme/ischemia.',
                '• Dropped beats: Mobitz I (Wenckebach — lengthening PR, usually AV-nodal) vs Mobitz II (fixed PR, unexpected drop — infranodal, pacing prep). 2:1 block cannot be typed on PR alone — treat as high-grade if the QRS is wide or the patient is unstable. Complete heart block: AV dissociation, regular escape.',
                '• PR depression: pericarditis (with PR elevation in aVR) — but territorial STE plus reciprocal STD is OMI, not pericarditis.',
                '<strong>QRS (normal &lt;120 ms):</strong>',
                '• Wide (≥120 ms): LBBB/RBBB, VT, paced, hyperK, sodium-channel blockade (TCA, flecainide), WPW.',
                '• <strong>RBBB:</strong> rsR′ in V1–V2, wide slurred S in I, aVL, V5–V6.',
                '• <strong>LBBB:</strong> broad QS or rS in V1, broad notched R in I, aVL, V5–V6 without Q waves. New LBBB alone is not a STEMI equivalent (2025 ACC/AHA).',
                '<strong>QTc:</strong> Bazett (QT/√RR) over-corrects when the rate is fast — use Fridericia (QT/∛RR) or a tachycardic-aware method. Commonly cited upper limits: men ~440–450 ms, women ~460–470 ms. <strong>ED danger zone ≥500 ms</strong> (TdP). Short QTc (&lt;360 ms, especially &lt;330 ms) raises SQTS/hypercalcemia/digoxin questions. With bundle branch block, consider JT/JTc rather than raw QTc.',
                '• TdP treatment: unsynchronized defibrillation if pulseless; IV magnesium 2 g for TdP even if the magnesium is “normal”; overdrive pacing if pause-dependent and magnesium fails. Pull QT-prolonging drugs and replete K⁺/Mg²⁺.'
            ],
            pearl: 'At 60–100 bpm, QT should be less than half the preceding RR. If the T wave ends past the midpoint, the QT is long. QTc ≥500 ms is an ED action item, not a curiosity.',
            pitfall: 'Measuring QT in a U-wave lead (pseudo-long QT), ignoring a wide QRS, or using Bazett alone at HR 130. Giving AV-nodal blockers to an irregular wide-complex tachycardia that is pre-excited AF.'
        },
        {
            num: 4,
            id: 'hypertrophy',
            name: 'Voltage, Chambers & Low Voltage',
            icon: '🫀',
            summary: 'LVH/RVH change the ST-T baseline. Low voltage and alternans change the next test.',
            details: [
                '<strong>LVH voltage (supportive, not a stand-alone ED diagnosis):</strong> First confirm gain. At 10 mm/mV, Sokolow–Lyon is S in V1 + R in V5/V6 ≥35 mm, or R in aVL ≥11 mm. Cornell is R aVL + S V3 &gt;28 mm (men) or &gt;20 mm (women). Voltage has limited sensitivity/specificity: confirm suspected structural disease with echo, not the ECG alone.',
                '• <strong>LV strain:</strong> asymmetric down-sloping STD + inverted T in I, aVL, V5–V6. Chronic strain is not ACS — but new or changing ST/T is.',
                '<strong>RVH:</strong> dominant R in V1 (R/S &gt; 1, R &gt; 7 mm) + RAD + RV strain (TWI/STD V1–V3 ± inferior). Differential of tall R in V1: RVH, RBBB, posterior OMI, WPW, lead misplacement, Duchenne, dextrocardia.',
                '<strong>Atrial abnormality (an ECG clue, not a chamber-size diagnosis):</strong> RAE pattern — peaked P ≥2.5 mm in II. LAE pattern — notched P ≥120 ms in II, or a terminal negative P component in V1 that is ≥1 mm deep and ≥40 ms wide. Confirm anatomy with echo when it matters.',
                '<strong>Low voltage:</strong> QRS &lt;5 mm in <strong>all</strong> limb leads or &lt;10 mm in <strong>all</strong> precordial leads; one small complex does not establish the diagnosis. Confirm gain first. Low voltage alone is nonspecific; low voltage + sinus tachycardia + electrical alternans should trigger immediate POCUS/echo for effusion/tamponade.',
                '<strong>LV aneurysm vs acute STE:</strong> persistent STE with deep Q waves, no reciprocal depression, stable vs an old ECG. Acute OMI has reciprocal change and evolving T waves.'
            ],
            pearl: 'Young, thin, or athletic chests often exceed Sokolow–Lyon without pathologic LVH. Pair voltage with LA enlargement and strain, and always compare with a prior ECG.',
            pitfall: 'Calling anteroseptal MI from RVH (tall R V1), or calling lateral ischemia from chronic LV strain without looking at an old tracing. Missing tamponade because “the ECG is low voltage from obesity.”'
        },
        {
            num: 5,
            id: 'ischemia-map',
            name: 'Ischemia Map & Fifth UDMI Lead Criteria',
            icon: '🗺️',
            summary: 'Use the Fifth Universal Definition lead-by-lead: ≥1 mm in every standard lead except V2–V3; add posterior or right-sided leads when the 12-lead leaves a clinical gap.',
            details: [
                '<strong>Fifth Universal Definition (2026) — new J-point STE in two contiguous leads:</strong> <strong>≥1.0 mm in every standard 12-lead except V2–V3</strong> (I, aVL, II, III, aVF, V1, V4–V6). There is no single-lead STEMI rule; interpret anatomically contiguous lead groups and the clinical presentation. These thresholds do not apply unchanged in LBBB, paced rhythm, or LVH.',
                '• <strong>V2–V3 only:</strong> ≥2.5 mm in men &lt;40 years, ≥2.0 mm in men ≥40 years, or ≥1.5 mm in women regardless of age.',
                '• <strong>Inferior (II, III, aVF):</strong> usually RCA or LCx. STE III &gt; II supports RCA. Reciprocal STD in aVL is a high-yield clue; obtain right-sided leads when inferior injury is present.',
                '• <strong>Septal/anterior (V1–V4) and lateral (I, aVL, V5–V6):</strong> look for a contiguous distribution, reciprocal inferior change, and dynamic evolution. Isolated I/aVL change can be high-lateral/diagonal ischemia, but still needs context and comparison.',
                '<strong>Supplemental leads — record, do not infer:</strong> with inferior OMI, record V3R–V6R (especially V4R) for RV involvement; STE ≥0.5 mm is supportive (≥1.0 mm in men &lt;30 years). With V1–V3 depression or suspected LCx occlusion, record V7 (left posterior axillary), V8 (mid-scapular), and V9 (left paraspinal) in the V6 horizontal plane; STE ≥0.5 mm supports posterior infarction (use ≥1.0 mm in men &lt;40 years for greater specificity).',
                '<strong>Ischemic changes beyond STE (Fifth UDMI):</strong> new horizontal/downsloping STD ≥0.5 mm in ≥2 contiguous leads; new or dynamic T-wave inversion ≥1 mm in ≥2 contiguous leads; broad symmetric hyperacute T waves disproportionate to the QRS in ≥2 contiguous leads; pathologic Q waves ≥40 ms and/or ≥25% of the R wave in ≥2 contiguous leads.',
                '<strong>Posterior and occlusion clues:</strong> posterior MI is suggested by STD ≥1 mm in V1, V2, and/or V3, particularly with a dominant R in V1/V2, then confirmed on V7–V9. Acute occlusion can also present as de Winter, Wellens, Sgarbossa/modified Sgarbossa, Aslanger, or the South African flag pattern — these do not wait for a millimetre STEMI label.',
                '<strong>Serial and prior ECGs:</strong> compare with an old tracing and repeat promptly with ongoing/recurrent symptoms or an initially nondiagnostic ECG. A normal or sub-threshold first ECG does not exclude an acute coronary occlusion.'
            ],
            pearl: 'The core rule is simple: 1 mm in all standard leads except V2–V3. The work is recognizing a contiguous territory, adding V3R–V6R or V7–V9 when indicated, and acting on dynamic occlusion patterns before a textbook threshold appears.',
            pitfall: 'Using one lead alone, treating V2–V3 as a 1 mm rule, or calling V1–V3 depression “anterior ischemia” without posterior leads. Do not give nitrate-dependent comfort false reassurance in an inferior MI before considering RV involvement.'
        },
        {
            num: 6,
            id: 'omi-equivalents',
            name: 'OMI Equivalents & What Is Not STEMI',
            icon: '🚨',
            summary: 'Occlusion MI that misses millimetre STEMI criteria — and the patterns that are no longer automatic lab activations.',
            details: [
                '<strong>Paradigm:</strong> STEMI vs NSTEMI is a millimetre rule. OMI vs NOMI is whether the artery is occluded. More than 1 in 4 occlusions never meet STEMI millimetres. New or presumed-new <strong>LBBB alone is not a STEMI equivalent</strong> (2025 ACC/AHA/ACEP ACS) — use Smith-modified Sgarbossa plus the patient.',
                '<strong>1. Wellens (critical proximal LAD stenosis):</strong> pain-free after resolved angina. Type A (~25%): biphasic T in V2–V3. Type B (~75%): deep symmetric inverted T in V2–V3 ± V4–V5. Preserved R waves, little or no STE, no pathologic Q. <em>Stress testing is contraindicated.</em> T waves may “normalize” when pain returns — that is occlusion, not improvement.',
                '<strong>2. de Winter T waves (acute proximal LAD occlusion):</strong> 1–3 mm upsloping J-point STD in precordial leads into tall, broad, symmetric T waves. STE in aVR is common but not required. Activate as anterior OMI.',
                '<strong>3. Smith-modified Sgarbossa (LBBB or ventricular paced):</strong> positive if <em>any</em> of: (1) concordant STE ≥ 1 mm in a lead with a positive QRS; (2) concordant STD ≥ 1 mm in V1–V3; (3) excessively discordant STE with ST/S ratio ≤ −0.25 (STE ≥ 25% of S-wave depth). Original Sgarbossa’s 5 mm discordant rule missed many anterior occlusions.',
                '<strong>4. Isolated posterior OMI:</strong> horizontal STD V1–V3, upright T, tall R (R/S &gt; 1 in V2). V7–V9 STE ≥ 0.5 mm is diagnostic. Do not call this “anterior ischemia.”',
                '<strong>5. aVR STE + widespread STD:</strong> severe subendocardial ischemia from LMCA/3VD/proximal LAD <em>or</em> demand ischemia (shock, hypoxia, anemia, AS). <strong>Not automatic code STEMI if the patient is stable</strong> (2025 ACS: high-risk NSTE-ACS → urgent angiography). Immediate activation if unstable or the rest of the ECG is occlusive.',
                '<strong>6. Hyperacute T waves:</strong> earliest OMI sign (minutes). Broad, bulky, symmetric T that dwarfs a small R; loss of normal ST-T concavity. Precedes millimetre STE. Serial ECGs.',
                '<strong>7. Aslanger pattern (easy to miss inferior + posterior OMI):</strong> STE in III (sometimes aVF) with STD in V4–V6 and STE in V1. Often labelled “nonspecific.” It is OMI.'
            ],
            pearl: 'More than 25% of acute coronary occlusions never meet millimetre STEMI criteria. Wellens or de Winter during a pain-free interval is still an emergency.',
            pitfall: 'Activating the lab for isolated new LBBB, or dismissing Wellens/de Winter as “nonspecific ST-T changes.” Treating stable aVR-STE + diffuse STD as automatic code STEMI without asking whether this is demand ischemia.'
        },
        {
            num: 7,
            id: 'toxic-metabolic-mimics',
            name: 'Deadly Mimics, Toxic & Metabolic',
            icon: '🧪',
            summary: 'HyperK, channelopathy, PE strain, pericarditis vs BER, sodium-channel blockade, hypothermia, and tamponade.',
            details: [
                '<strong>Hyperkalemia (treat the tracing, not the lab):</strong> peaked tented T → PR long / P flat → QRS wide → sine wave → arrest. <em>IV calcium now</em> for wide QRS, sine wave, or instability — do not wait for potassium. Follow with insulin 5–10 units IV + dextrose (many EDs start at 5 units to cut hypoglycemia), high-dose albuterol, bicarbonate if acidemic, and definitive removal (dialysis). Do not mix calcium and bicarbonate in the same line.',
                '<strong>Hypokalemia:</strong> flat T, ST depression, U waves (best V2–V3), apparent long QU, ectopy, TdP risk. Replete K⁺ and Mg²⁺. Looks a little like ischemia — check the potassium.',
                '<strong>Calcium disorders:</strong> hypercalcemia shortens QT (short ST); hypocalcemia lengthens QT (long ST segment with a normal T).',
                '<strong>Hypothermia:</strong> Osborn (J) waves — positive hump at the J point, biggest in V2–V5 — plus bradycardia, AF, long PR/QRS/QT, shivering artifact. VF risk during handling. Treatment is rewarming, not an antiarrhythmic chase.',
                '<strong>Brugada Type 1:</strong> coved STE ≥ 2 mm in V1–V2 then negative T (“shark-fin” pseudo-RBBB). Fever, sodium-channel drugs, cocaine unmask it. If borderline, repeat V1–V2 one interspace higher.',
                '<strong>PE / RV strain:</strong> sinus tachycardia is the common finding. S1Q3T3 is neither sensitive nor specific. More useful: TWI in V1–V4 ± inferior leads, new RBBB, RAD. Normal ECG does not exclude PE.',
                '<strong>Pericarditis vs BER vs OMI:</strong> pericarditis — diffuse concave STE, PR depression, PR elevation/STD in aVR, Spodick sign, <em>no</em> reciprocal STD except aVR/V1. BER — fish-hook J-point notching (often V4), ST/T ratio in V6 &lt; 0.25. <strong>Any territorial STE + reciprocal STD is OMI until proven otherwise.</strong>',
                '<strong>TCA / sodium-channel blockade:</strong> sinus tach, QRS &gt; 100 ms (seizure risk) / &gt; 160 ms (arrhythmia), terminal R in aVR ≥ 3 mm. Sodium bicarbonate 1–2 mEq/kg IV push, repeat toward QRS &lt; 100 ms and pH ~7.50–7.55. Avoid class Ia/Ic agents.',
                '<strong>Electrical alternans + low voltage + tachycardia:</strong> tamponade until bedside echo. Low voltage alone is not tamponade.',
                '<strong>Digoxin effect vs toxicity:</strong> scooped STD is “digitalis effect,” not a diagnosis of toxicity. Toxicity: ectopy, bidirectional VT, atrial tach with block. Fab fragments; discuss calcium with toxicology if hyperK is from digoxin.'
            ],
            pearl: 'If the ECG looks bizarre, wide, slow, or refuses to classify, treat hyperkalemia while the lab runs. Calcium for the membrane; insulin/albuterol/dialysis for the potassium.',
            pitfall: 'Giving beta-blockers, diltiazem, or amiodarone to a wide-complex bradycardia that is actually hyperK. Calling territorial STE “pericarditis” because it is concave.'
        }
    ],
    patterns: [
        {
            id: 'stemi-criteria',
            name: 'Classic STEMI Millimetre Criteria',
            tag: 'STEMI activation rule',
            category: 'omi',
            severity: 'critical',
            leads: 'II, III, aVF (STE) + aVL (mirror STD) — 2 contiguous at J point',
            criteria: 'Inferior example: convex STE ≥1 mm in II + III + aVF with mirror STD in aVL. General rule: STE in V2–V3 ≥ 2.5 mm (men &lt;40), ≥ 2.0 mm (men ≥40), ≥ 1.5 mm (women); ≥ 1.0 mm in all other leads ×2 contiguous. Posterior V7–V9 ≥ 0.5 mm. MIRROR — inferior up, aVL down.',
            significance: 'Still the operational trigger for most cath-lab activations. Misses &gt;25% of acute occlusions — that is why OMI equivalents exist.',
            action: 'If millimetre STEMI + compatible symptoms/signs: immediate reperfusion pathway per local STEMI protocol. Add V4R for inferior STE and V7–V9 for isolated anterior STD.',
            caution: 'A tracing that fails millimetre criteria can still be OMI (hyperacute T, Wellens, de Winter, posterior, Aslanger, Smith-modified Sgarbossa).'
        },
        {
            id: 'hyperacute-t',
            name: 'Hyperacute T Waves',
            tag: 'Earliest OMI sign',
            category: 'omi',
            severity: 'critical',
            leads: 'One V3 viewpoint, three shapes: normal vs hyperacute vs hyperK',
            criteria: 'Side-by-side in a single V3 viewpoint. Normal: smooth asymmetric T, R > T. Hyperacute: broad-based bulky ("inflated") T dwarfing QRS with straightened takeoff — always confirm territorial across 2+ adjacent leads in the patient, never all leads. HyperK tenting: narrow pointed peak with flat P, usually diffuse. May precede any millimetre STE. Compare with an old ECG, repeat in 10–15 minutes, and check potassium too — OMI and hyperK can coexist.',
            significance: 'Minutes-old coronary occlusion. Waiting for millimetre STE loses myocardium.',
            action: 'Treat as OMI: serial ECGs, old tracing, posterior/right-sided leads as indicated, immediate cardiology escalation. Do not wait for a “diagnostic” STEMI millimetre if the T waves are blowing up in a territorial distribution.',
            caution: 'HyperK tented T waves are narrow-based and diffuse; hyperacute T waves are broad-based and territorial. HyperK and OMI can coexist — treat both possibilities.'
        },
        {
            id: 'wellens',
            name: 'Wellens Syndrome (Type A & B)',
            tag: 'OMI equivalent',
            category: 'omi',
            severity: 'critical',
            leads: 'V2–V3 (often V1–V5)',
            criteria: 'Pain-free after resolved angina. Type A (~25%): biphasic T in V2–V3. Type B (~75%): deep symmetric inverted T in V2–V3. Preserved R-wave progression, isoelectric or minimally elevated ST, no pathologic Q waves.',
            significance: 'Critical proximal LAD stenosis. Extensive anterior OMI is imminent — sometimes within hours to days.',
            action: 'Urgent cardiology for catheterization. Strict medical management. <strong>Do not send for an exercise stress test.</strong>',
            caution: 'T waves may pseudo-normalize when pain returns — that is occlusion, not recovery. Repeat the ECG with every symptom change.'
        },
        {
            id: 'dewinter',
            name: 'de Winter T Waves',
            tag: 'OMI equivalent',
            category: 'omi',
            severity: 'critical',
            leads: 'V1–V6; aVR often',
            criteria: '1–3 mm upsloping J-point STD in the precordial leads continuing into tall, prominent, symmetric T waves. STE in aVR is common but not required.',
            significance: 'Acute proximal LAD occlusion without classic STE (~2% of anterior LAD occlusions). Mortality matches anterior STEMI.',
            action: 'Immediate cath-lab activation. Treat as anterior OMI, not “nonspecific anterior ischemia.”',
            caution: 'The pattern can evolve into frank anterior STE or appear only on the first tracing. Do not wait for millimetre STE.'
        },
        {
            id: 'sgarbossa',
            name: 'Smith-Modified Sgarbossa (LBBB & Paced)',
            tag: 'OMI in LBBB / paced',
            category: 'omi',
            severity: 'critical',
            leads: 'Any lead with a positive QRS; V1–V3',
            criteria: 'Positive if ANY of: (1) concordant STE ≥ 1 mm in a lead with a positive QRS; (2) concordant STD ≥ 1 mm in V1–V3; (3) excessively discordant STE, ST/S ratio ≤ −0.25 (STE ≥ 25% of S-wave depth).',
            significance: 'Finds occlusion MI when the baseline is LBBB or a ventricular paced rhythm. New LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP).',
            action: 'If any Smith-modified criterion is met in a compatible patient: immediate reperfusion pathway. Unmodified 5 mm discordant STE is obsolete as a standalone rule.',
            caution: 'A paced or LBBB tracing that fails Sgarbossa can still be OMI clinically — use serial ECGs, old tracings, and the patient, not the millimetre rule alone.'
        },
        {
            id: 'posterior-omi',
            name: 'Isolated Posterior OMI',
            tag: 'OMI equivalent',
            category: 'omi',
            severity: 'critical',
            leads: 'V1–V3 (mirror); V7–V9 (true posterior)',
            criteria: 'Horizontal STD in V1–V3 with upright T waves and prominent R waves (R/S &gt; 1 in V2). Posterior leads: STE ≥ 0.5 mm in V7–V9 is diagnostic.',
            significance: 'Transmural posterior wall occlusion (LCx or distal RCA). Often labelled “anterior ischemia” and not activated.',
            action: 'Place V7–V9 immediately. Activate the lab if posterior STE ≥ 0.5 mm or the mirror image is clear in a compatible patient.',
            caution: 'Turning the tracing over (or mentally flipping V1–V3) shows the STEMI hiding in the ST depression. Digitalis effect is scooped, not horizontal, and is not territorial.'
        },
        {
            id: 'avr-lmca',
            name: 'aVR STE with Diffuse ST Depression',
            tag: 'High-risk ACS / demand ischemia',
            category: 'omi',
            severity: 'critical',
            leads: 'aVR STE; widespread STD in I, II, aVL, V4–V6',
            criteria: 'STE ≥ 1 mm in aVR (sometimes aVR &gt; V1) plus horizontal STD in ≥ 6 other leads.',
            significance: 'Severe subendocardial ischemia: LMCA / proximal LAD / triple-vessel disease, <em>or</em> demand ischemia from shock, hypoxia, anemia, or critical AS. True complete LM occlusion often presents in extremis.',
            action: 'Resuscitate the cause (shock, hypoxia, anemia). Urgent cardiology. Immediate lab activation if unstable or the tracing is otherwise occlusive. Avoid heavy nitrates if hypotensive or RV/preload dependent.',
            caution: '2025 ACC/AHA ACS: this is high-risk NSTE-ACS, not automatic code STEMI in a stable patient. Do not skip the bedside echo and the rest of the shock workup.'
        },
        {
            id: 'hyperkalemia',
            name: 'Hyperkalemia Spectrum & Sine Wave',
            tag: 'Metabolic emergency',
            category: 'toxic',
            severity: 'critical',
            leads: 'Diffuse',
            criteria: 'Peaked, narrow-based tented T waves → PR prolongation and flat P waves → QRS widening (can mimic BBB or VT) → sine wave.',
            significance: 'Membrane instability. Once the QRS widens, VF/PEA/asystole can be minutes away.',
            action: 'If QRS is wide, sine-wave, or the patient is unstable: IV calcium immediately (gluconate 10% 10 mL / 1 g over 2–5 min, repeat if no ECG improvement; chloride 10% via large/central vein in arrest). Then insulin 5–10 units IV + dextrose, albuterol 10–20 mg neb, bicarbonate if acidemic, and dialysis. Follow local protocol.',
            caution: 'Do not wait for the lab if the tracing is already wide or sine-wave in a dialysis or oliguric patient. Do not mix calcium and bicarbonate in one line. Do not give AV-nodal blockers or amiodarone to a wide, slow, bizarre rhythm that is hyperK.'
        },
        {
            id: 'hypokalemia',
            name: 'Hypokalemia, U Waves & Long QU',
            tag: 'Metabolic emergency',
            category: 'toxic',
            severity: 'emergent',
            leads: 'V2–V3 best; diffuse ST-T',
            criteria: 'Flattened T waves, ST depression, prominent U waves (best V2–V3), apparent QT/QU prolongation, increased PVCs. Severe K⁺ can precipitate VT/TdP, especially with low Mg²⁺ or QT drugs.',
            significance: 'Arrhythmogenic and a common ACS mimic. The “ischemic” STD of hypokalemia is usually diffuse, not territorial.',
            action: 'Replete potassium and magnesium on a monitored bed. Review diuretics, GI losses, and QT-prolonging drugs. Repeat the ECG after repletion before calling residual ischemia.',
            caution: 'Do not send a hypokalemic patient with U waves and a long QU home on a QT-prolonging antiemetic. Apparent long QT is often QU.'
        },
        {
            id: 'hypothermia',
            name: 'Hypothermia & Osborn (J) Waves',
            tag: 'Environmental / metabolic',
            category: 'toxic',
            severity: 'critical',
            leads: 'J waves biggest in V2–V5; rhythm strip',
            criteria: 'Osborn J waves (positive hump at the J point) plus sinus bradycardia or AF, prolonged PR/QRS/QT, shivering artifact, and sometimes STE that mimics OMI.',
            significance: 'Core temperature, not an epicardial artery, is driving the tracing. VF risk rises as temperature falls and during rough handling or rapid rewarming.',
            action: 'Confirm core temperature. Handle gently. Rewarm per local hypothermia protocol. Defibrillate VF; below ~30 °C, drugs and shocks are often ineffective until rewarming is underway.',
            caution: 'Do not activate the cath lab for J waves and bradycardia until the patient is warm enough for the tracing to be interpretable — unless the story and territorial STE still scream OMI.'
        },
        {
            id: 'brugada',
            name: 'Brugada Syndrome (Type 1)',
            tag: 'Channelopathy',
            category: 'mimics',
            severity: 'critical',
            leads: 'V1–V2 (repeat one interspace higher if borderline)',
            criteria: 'Coved STE ≥ 2 mm in V1–V2 followed by a negative T wave (Type 1). Type 2/3 saddleback is not diagnostic until converted to Type 1.',
            significance: 'Risk of polymorphic VT/VF, often during sleep or fever. Sodium-channel drugs, cocaine, and fever unmask it.',
            action: 'Treat fever aggressively. Avoid Brugada-unmasking drugs (flecainide, procainamide, bupivacaine, many TCAs — check brugadadrugs.org). Telemetry, EP/cardiology, ICD discussion for Type 1 with syncope or arrest.',
            caution: 'High V1/V2 placement and RBBB can fake a Brugada-like tracing. Move the leads to the correct 4th ICS, then — if suspicion remains — one space up to unmask a true Type 1.'
        },
        {
            id: 'pe-strain',
            name: 'Acute PE & RV Strain',
            tag: 'Cardiopulmonary',
            category: 'mimics',
            severity: 'critical',
            leads: 'I, III, V1–V4, aVF',
            criteria: 'Sinus tachycardia is the usual finding. RV strain: TWI in V1–V4 ± inferior leads, new RBBB, RAD, or S1Q3T3 (deep S in I, Q in III, TWI in III).',
            significance: 'S1Q3T3 is neither sensitive nor specific (~10–20%). TWI V1–V4 is more useful when present. A normal ECG does not exclude PE.',
            action: 'This tracing supports RV strain — it does not diagnose PE. Bedside echo (RV dilation, McConnell), then the PE pathway (PERC/Wells/YEARS ± CTPA). High-risk PE with shock: local reperfusion/PERT, not the ECG alone.',
            caution: 'Do not delay the PE workup because S1Q3T3 is absent. Do not call every TWI V1–V4 “Wellens” — Wellens is pain-free LAD disease with preserved R waves and a coronary story.'
        },
        {
            id: 'pericarditis-ber',
            name: 'Pericarditis vs BER vs OMI',
            tag: 'Inflammatory / normal variant',
            category: 'mimics',
            severity: 'emergent',
            leads: 'Diffuse limb + precordial; aVR; V4 for BER notch',
            criteria: 'Pericarditis: diffuse concave STE, PR depression, aVR PR elevation/STD, Spodick sign, no reciprocal STD except aVR/V1. BER: fish-hook J-point notching (often V4), ST/T amplitude ratio in V6 &lt; 0.25, stable vs old ECG.',
            significance: 'The dangerous error is labelling OMI as pericarditis because the STE is concave.',
            action: 'If STE is territorial and any reciprocal STD exists (except aVR/V1): treat as OMI. Pericarditis: echo (effusion/tamponade), NSAID + colchicine per local practice, no anticoagulation if effusion is present.',
            caution: 'Pericarditis almost never causes reciprocal STD in III or aVL. That pattern is inferior or high-lateral OMI. Myopericarditis exists — when uncertain, take the OMI path.'
        },
        {
            id: 'tca-toxicity',
            name: 'TCA / Sodium-Channel Blockade',
            tag: 'Toxicology',
            category: 'toxic',
            severity: 'critical',
            leads: 'aVR and the rhythm strip',
            criteria: 'Sinus tachycardia + QRS widening (&gt;100 ms seizure risk, &gt;160 ms ventricular arrhythmia risk) + terminal R in aVR ≥ 3 mm (or R/S in aVR &gt; 0.7).',
            significance: 'Fast sodium-channel blockade. The ECG is the dose of bicarbonate, not the drug level.',
            action: 'Sodium bicarbonate 1–2 mEq/kg IV push, repeat until QRS narrows (&lt;100 ms) and pH ~7.50–7.55, then an infusion. Hypertonic sodium is the antidote. Poison centre. Avoid class Ia/Ic antiarrhythmics and physostigmine.',
            caution: 'A “borderline” QRS of 110 ms in an overdose is already actionable. Do not wait for 160 ms. Flecainide, carbamazepine, and diphenhydramine can look identical.'
        },
        {
            id: 'wpw',
            name: 'WPW and Pre-excited AF',
            tag: 'Accessory pathway',
            category: 'rhythm',
            severity: 'critical',
            leads: 'All leads; the strip during tachycardia',
            criteria: 'Sinus: short PR (&lt;120 ms) + delta wave + wide QRS. Pre-excited AF: irregular, wide, bizarre, often &gt;200–250 bpm with changing QRS morphology.',
            significance: 'The accessory pathway can conduct 1:1 from AF to VF. AV-nodal blockers funnel all impulses down the pathway.',
            action: 'Unstable: immediate cardioversion. Stable pre-excited AF: procainamide or shock. <strong>Adenosine, beta-blockers, diltiazem, verapamil, and digoxin are contraindicated in pre-excited AF.</strong>',
            caution: 'Delta waves fake Q waves (pseudo-infarct) and fake bundle-branch block. An irregular wide tachycardia that is very fast is pre-excited AF until proven otherwise — not “fast AF with RBBB.”'
        },
        {
            id: 'vt-vs-svt',
            name: 'VT vs SVT with Aberrancy',
            tag: 'Wide-complex tachycardia',
            category: 'rhythm',
            severity: 'critical',
            leads: 'All leads, especially V1–V6',
            criteria: 'Wide-complex tachycardia (QRS ≥120 ms, HR &gt;100). Favours VT: AV dissociation, fusion/capture beats, extreme axis, precordial concordance, Brugada/Vereckei algorithms, history of MI or structural disease.',
            significance: '&gt;80% of regular wide-complex tachycardias in the ED are VT; &gt;90% if there is prior MI. The cost of treating VT as SVT is collapse.',
            action: '<strong>Treat as VT.</strong> Unstable: synchronized cardioversion (defibrillate if pulseless or truly polymorphic). Stable monomorphic: procainamide or amiodarone per local ACLS, or elective cardioversion. Adenosine only if regular, monomorphic, and you still think SVT with aberrancy — never if irregular.',
            caution: 'Never give verapamil or diltiazem to an undifferentiated wide-complex tachycardia. Irregular and wide is not “SVT with aberrancy” — think AF + RBBB, pre-excited AF, or polymorphic VT.'
        },
        {
            id: 'complete-heart-block',
            name: 'High-Grade AV Block & Complete Heart Block',
            tag: 'Bradycardia emergency',
            category: 'rhythm',
            severity: 'critical',
            leads: 'Rhythm strip plus full 12-lead',
            criteria: 'Mobitz II: constant PR, sudden dropped QRS, often wide QRS (infranodal). Complete heart block: P waves and QRS independent; escape may be narrow (junctional) or wide (ventricular, slower, less stable). 2:1 block cannot be typed from PR alone.',
            significance: 'Infranodal block can collapse to ventricular standstill. Atropine often fails when the escape is wide.',
            action: 'ABCs, pads on, atropine 1 mg while preparing transcutaneous pacing if unstable. Dopamine/epinephrine infusion per ACLS if needed. Look for reversible causes: hyperK, ischemia (especially inferior vs anterior), Lyme, beta-blocker/calcium-channel/digoxin, post-cardiac surgery. Transvenous pacing / cardiology for persistent infranodal block.',
            caution: 'Isorhythmic dissociation is not complete heart block. Do not send Mobitz II home because the patient “looks well” in the chair. Treat hyperK before you pace a wide, slow, bizarre escape.'
        },
        {
            id: 'electrical-alternans',
            name: 'Low Voltage & Electrical Alternans',
            tag: 'Tamponade warning',
            category: 'mimics',
            severity: 'critical',
            leads: 'All leads; QRS amplitude beat-to-beat',
            criteria: 'Low voltage: QRS &lt; 5 mm in every limb lead or &lt; 10 mm in every precordial lead. Electrical alternans: beat-to-beat QRS (sometimes P/T) amplitude change. The triad of low voltage + alternans + sinus tachycardia is tamponade until echo.',
            significance: 'Alternans means the heart is swinging in a large effusion. Low voltage alone has a wide differential (COPD, obesity, infiltrative disease, anasarca).',
            action: 'Bedside echo now. If tamponade physiology: IV fluid while arranging pericardiocentesis (or the local surgical pathway if type A dissection / post-op). Do not delay for a formal lab ECG repeat.',
            caution: 'Total electrical alternans is specific but insensitive — tamponade can have a “normal” ECG. Shock plus a quiet heart on ultrasound beats any millimetre rule.'
        }
    ],
    pearls: [
        'Patient first: an unstable wide-complex rhythm is shocked or cardioverted — the 12-lead can wait.',
        'STEMI millimetres still activate labs; OMI equivalents catch the occlusions those millimetres miss.',
        'New LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP). Use Smith-modified Sgarbossa.',
        'Isolated STD V1–V3 with upright T waves is posterior OMI until V7–V9 are placed.',
        'Bizarre, wide, slow, unclassifiable = hyperkalemia until calcium has gone in.',
        'Irregular + wide + very fast = pre-excited AF. No AV-nodal blockers.',
        'Territorial STE plus reciprocal STD is OMI, even if the STE is concave.'
    ],
    pitfalls: [
        'Activating the lab for isolated new LBBB, or discharging Wellens because the patient is pain-free.',
        'Calling aVR STE + diffuse STD automatic code STEMI in a stable, shocked, or hypoxic patient.',
        'Treating VT as SVT with diltiazem or verapamil.',
        'Skipping V4R in inferior STE and then giving nitrates to an RV infarct.',
        'Trusting a machine QTc on tachycardia, artifact, or a wide QRS.',
        'Labelling territorial STE “pericarditis” because it is concave.',
        'Waiting for the potassium result on a sine-wave tracing.'
    ],
    refs: [
        "Rosen's Emergency Medicine, 10th ed. (2023) — ECG, ACS, dysrhythmia, and toxicology chapters",
        'Fifth Universal Definition of Myocardial Infarction (2026) — current standard-lead ischemia/infarction criteria',
        'Fourth Universal Definition of Myocardial Infarction (2018) — supplemental posterior/right-sided lead placement and thresholds',
        '2025 ACC/AHA/ACEP ACS Guideline (new LBBB is not a STEMI equivalent; high-risk NSTE-ACS including aVR STE)',
        '2023 ESC ACS Guidelines',
        'Smith-modified Sgarbossa (Smith, Pendell Meyers, and OMI literature 2012–2026)',
        'AHA ACLS: unstable tachycardia/bradycardia, hyperkalemia, and TdP',
        'AHA/ACCF/HRS ECG standardisation Parts III–IV (Surawicz et al., Rautaharju et al., 2009) — QRS/BBB criteria, QT measurement method and limits',
        'Educational ECG libraries: LITFL, Dr. Smith’s ECG Blog — pattern recognition adjuncts, not protocols'
    ],
    related: ['chest-pain', 'palpitations', 'syncope', 'overdose', 'shock', 'heat-cold']
};

if (typeof window !== 'undefined') {
    window.ECG_DATA = ECG_DATA;
}

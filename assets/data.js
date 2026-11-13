/* ══════════ EM-CPs clinical data ══════════
   Framework: informed by Rosen's Emergency Medicine 10th ed. (2023) — approach to cardinal presentations; not affiliated with or endorsed by Elsevier.
   Educational synthesis; content and selected evidence reviewed 8 Oct 2026. See docs/CLINICAL-AUDIT-2026-10-08.md for scope and limits.
   Targeted expansion: 10 Nov 2026, eight adult presentations — assessment, investigation and reassessment; see docs/PRESENTATION-EXPANSION-2026-11-10.md.
   Severity: critical = life/limb/sight threat now · emergent = time-sensitive morbidity · common = high-frequency.
   Second targeted expansion: 10 Nov 2026, eight additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-10-BATCH-2.md.
   Third targeted expansion: 10 Nov 2026, eight additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-10-BATCH-3.md.
   Fourth targeted expansion: 10 Nov 2026, eight additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-10-BATCH-4.md.
   Fifth targeted expansion: 10 Nov 2026, eight additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-10-BATCH-5.md.
   Sixth targeted expansion: 10 Nov 2026, eight additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-10-BATCH-6.md.
   Final targeted expansion: 13 Nov 2026, four additional presentations — see docs/PRESENTATION-EXPANSION-2026-11-13-BATCH-7.md.
   Oncology Emergencies: 13 Nov 2026, six adult emergency guides. See docs/ONCOLOGY-EMERGENCIES-2026-11-13.md.
   Clinical consistency audit: 13 Nov 2026, selected high-risk treatment rows and decision tools. See docs/CLINICAL-CONSISTENCY-2026-11-13.md.
   Diagnosis guides: 13–14 Nov 2026. See docs/DIAGNOSIS-GUIDES-2026-11-13.md.
   Optional fourth differential field: a list of topic IDs with dedicated guidance.
   Educational reference only — never replaces clinical judgment or local protocols.
*/
const CP_DATA = [

{
id: 'chest-pain', name: 'Chest Pain', icon: '🫀',
tag: 'Rule out the six killers first — then risk-stratify the rest.',
overview: 'Chest pain is ~5–10% of ED visits. The task is not to name every cause but to exclude the life-threats, then risk-stratify the rest. A nonischemic ECG and a single reference-range troponin do not exclude ACS: use an assay-specific hs-cTn 0/1-h or 0/2-h pathway (or a single very-low hs-cTn rule-out only when symptom onset is ≥3 hours earlier), with HEART or EDACS as adjuncts.',
approach: [
    'ECG within 10 minutes; repeat if symptoms evolve or the first tracing is nondiagnostic.',
    'Exclude the six killers: ACS/OMI, dissection, PE, tension pneumothorax, Boerhaave, tamponade.',
    'Run an assay-specific hs-cTn 0/1h or 0/2h pathway (or HEART/EDACS with contemporary troponin); one normal value is not a rule-out unless it meets a ≥3 h very-low threshold.',
    'Record posterior (V7–V9) or right-sided (V4R) leads when inferior STE or anterior V1–V3 ST depression is present.'
],
dontMiss: [
['Acute Coronary Syndrome (STEMI / NSTEMI / UA / OMI)', 'critical', 'Serial ECG + hs-troponin algorithm — not a single snapshot. Occlusion MI can exist without classic STE.', ['acute-coronary-syndrome']],
['Aortic dissection', 'critical', 'Tearing pain to the back, pulse/BP differential, wide mediastinum. Anticoagulating this as ACS can be lethal.', ['acute-aortic-syndrome']],
['Pulmonary embolism', 'critical', 'Very-low gestalt → PERC; otherwise a validated Wells/age-adjusted or YEARS probability-adapted D-dimer pathway. Normal sats do not exclude it.', ['pulmonary-embolism']],
['Tension pneumothorax', 'critical', 'Suspected tension with hemodynamic instability or severe respiratory compromise needs immediate decompression before imaging.', ['tension-pneumothorax']],
['Esophageal rupture (Boerhaave)', 'critical', 'Post-emesis chest pain, subcutaneous emphysema, mediastinal air on CT.', ['esophageal-perforation']],
['Cardiac tamponade', 'critical', 'The full Beck triad may be absent. Interpret bedside echo with perfusion and hemodynamics, and arrange cause-specific drainage.', ['cardiac-tamponade']],
['Myocarditis / Takotsubo / cocaine ischemia', 'emergent', 'Young patients with atypical pain, HF features, or sympathomimetic use.'],
['GERD / musculoskeletal / anxiety', 'common', 'Real diagnoses — only after life-threats and validated ACS/PE pathways are negative.']
],
history: [
    "Ask about dyspnea, diaphoresis, nausea and unexplained fatigue even when chest discomfort is absent; ischemia may present through these accompanying symptoms.",
    "Review prior ECGs, coronary imaging and stress-test results, including when they were performed; previous testing informs risk but does not replace assessment of new symptoms.",
    'OPQRST + radiation to jaw, arm, or back', 'High-risk ACS features: exertional, rest pain, diaphoresis, syncope', 'Tearing/inter-scapular migration → dissection; pleuritic → PE/pleural; post-emesis → Boerhaave', 'Risk enhancers: age, diabetes, smoking, family history, cocaine, CKD', 'VTE risks: immobility, malignancy, surgery, estrogen, pregnancy'],
exam: ['Vitals with bilateral BP; pulse oximetry', 'Cardiac: new murmur (AS/dissection), rub (pericarditis/tamponade)', 'Lungs: symmetry, crackles (HF), unilateral absent sounds (PTX)', 'Vascular: pulse deficits; pulsatile abdominal mass (AAA)', 'Chest-wall reproducibility lowers — but does not exclude — ACS'],
workup: [
['Bedside', ['12-lead ECG within 10 minutes; repeat at 15–30 min if symptoms evolve or the first tracing is nondiagnostic', 'Posterior (V7–V9) and right-sided leads when inferior or isolated anterior ST depression', 'POCUS: pericardial effusion, lung sliding, RV strain']],
['Labs', ['Assay-specific hs-cTn 0/1h or 0/2h pathway (avoid legacy 6-h waits when hs-cTn is in use; with conventional troponin, use validated serial timing + HEART/EDACS)', 'HEART or EDACS risk score as a pathway adjunct', 'Gated D-dimer when PE pretest is non-high (PERC if very-low gestalt; otherwise age-adjusted or YEARS cutoff — do not mix cutoffs)', 'CBC, BMP, coagulation if antiplatelet/anticoagulation planned']],
['Imaging', ['CXR: mediastinum, PTX, edema, free air', 'CTA chest for dissection or PE; echo for RWMA/tamponade']]
],
redFlags: ['Hypotension, syncope or pre-syncope', 'ST elevation, hyperacute T waves, De Winter, Wellens, or suspected posterior injury (ST depression maximal in V1–V3)', 'Sgarbossa / Smith-modified criteria in LBBB or paced rhythm', 'Pain radiating to the back with pulse/BP asymmetry', 'New murmur or pulsus paradoxus', 'Unilateral absent breath sounds or tracheal deviation', 'Subcutaneous emphysema after vomiting', 'Ongoing pain despite antianginals'],
disposition: [
['Discharge', 'hs-cTn rule-out (0/1h or 0/2h) + non-ischemic ECG + no high-risk features; or HEART 0–3 with serial negative troponin on a score-based pathway. Arrange follow-up ± outpatient CTA/stress per local CDP.'],
['Admit (observation / telemetry)', 'Observe-zone troponin kinetics, HEART 4–6, new AF, ongoing atypical symptoms, or incomplete rule-out.'],
['ICU / cath lab activation', 'STEMI or occlusion-MI pattern, hemodynamic instability, suspected dissection/tamponade, refractory ischemic symptoms, arrhythmia.']
],
pitfalls: [
    "An MI rule-out pathway answers the MI question. Reassess for other dangerous causes when the history or examination remains concerning.",
    'ST depression maximal in V1–V3 raises concern for posterior occlusion: record V7–V9, repeat ECGs and escalate when clinically indicated. Negative posterior leads do not exclude occlusion.', 'Wellens and de Winter patterns need urgent ACS assessment even when pain-free; the ECG does not establish exact culprit anatomy or current artery patency.', 'New or presumed-new LBBB alone is not a STEMI equivalent (2025 ACC/AHA ACS) — use Sgarbossa/Smith criteria and clinical context.', 'Dissection mislabeled as NSTEMI and anticoagulated — check pulses/BP in both arms.', 'Do not default to a 6-hour troponin wait when an hs-cTn 0/1h or 0/2h protocol is available.', 'PE in the young and pregnant — non-tachycardic PE is common.', '\u201CMusculoskeletal\u201D + risk factors = the classic anchoring error.', 'A cold, pulseless limb with chest or back pain is dissection until the aorta is seen.'],
pearls: [
    "Before discharge, explain the working diagnosis and remaining uncertainty, arrange accessible follow-up, and give explicit instructions to return for recurrent or worsening symptoms.",
    'The six killers first — ACS, dissection, PE, tension PTX, Boerhaave, tamponade — then the hs-cTn 0/1h or 0/2h algorithm.', 'ST depression maximal in V1–V3 may reflect posterior occlusion; negative V7–V9 do not exclude it.', 'New LBBB alone is not a STEMI equivalent (2025 ACC/AHA); use Sgarbossa/Smith and the patient.', 'Single very-low hs-cTn rule-out requires symptom onset ≥3 h earlier; early presenters or ongoing concern need serial troponins.'],
doseScope: 'Acute aortic syndrome / aortic dissection only — these are not general chest-pain treatment instructions. Use monitored specialist-led care.',
doses: [
    ['Heart-rate and BP control (first-line)', ['IV labetalol 10–20 mg bolus, then infusion 0.5–2 mg/min', 'IV esmolol 500 mcg/kg bolus, then 50–200 mcg/kg/min infusion (titratable, short-acting)', 'Target heart rate 60–80 bpm and SBP <120 mmHg, or the lowest pressure that maintains adequate end-organ perfusion']],
    ['Vasodilator after heart-rate control if BP remains above target', ['Nicardipine infusion 5 mg/h, titrate by 2.5 mg/h every 5 min to max 15 mg/h (preferred over nitroprusside)', 'Avoid pure vasodilators before beta-blockade — reflex tachycardia increases aortic wall stress']],
    ['Analgesia and anti-impulse', ['IV opioid for pain (e.g. fentanyl) — pain drives tachycardia and hypertension', 'If acute aortic syndrome is suspected, defer antithrombotic therapy pending urgent assessment; this is not a blanket restriction for all chest pain']],
    ['Type B (uncomplicated) / medical management', ['Continue heart-rate and BP control under the aortic-team plan; transition to oral therapy when stable', 'Urgent surgery for malperfusion, rupture, refractory pain or refractory hypertension']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — cardiac & chest pain chapters', '2021 AHA/ACC Chest Pain Guideline; 2022 ACC Expert Consensus Pathway (ED chest pain)', '2025 ACC/AHA/ACEP ACS Guideline', '2023 ESC ACS Guidelines (0/1h and 0/2h hs-cTn algorithms)', '2026 AHA/ACC Acute PE Guideline']
},
{
id: 'dyspnea', name: 'Shortness of Breath', icon: '🫁',
tag: 'Lungs, heart, blood, blood-gases, or plumbing?',
overview: 'Dyspnea is a symptom, not a diagnosis. Rapidly separate hypoxemic vs hypercapnic vs non-pulmonary drivers. Bedside ultrasound (B-lines, lung sliding, RV dilatation) plus a focused history resolves most cases faster than any single test.',
approach: [
    'Separate hypoxemic vs hypercapnic vs non-pulmonary drivers.',
    'POCUS: B-lines, lung sliding, RV size — plus a focused history.',
    'Gate PE (PERC if very-low gestalt; otherwise a validated Wells/age-adjusted or YEARS D-dimer pathway).',
    'Work of breathing decides urgency: silent chest or a “normalizing” CO₂ is pre-arrest.',
    "If respiratory distress prevents a history, obtain collateral information from EMS or family while stabilization continues."
],
dontMiss: [
['Pulmonary embolism', 'critical', 'Sudden dyspnea with clear lungs; PERC if very-low gestalt, otherwise a validated Wells/age-adjusted or YEARS D-dimer pathway. Echo may show RV strain.', ['pulmonary-embolism']],
['Tension pneumothorax', 'critical', 'Trauma, COPD or PPV + hemodynamic collapse → decompress before imaging.', ['tension-pneumothorax']],
['Acute pulmonary edema / LV failure', 'critical', 'Orthopnea, crackles, diffuse B-lines — early NIV + nitrates if hypertensive.'],
['Near-fatal asthma / COPD exacerbation', 'critical', 'Silent chest, normalizing CO₂, exhaustion = pre-arrest physiology.'],
['Anaphylaxis', 'critical', 'IM epinephrine into the anterolateral thigh immediately — do not wait for urticaria (it may be absent).', ['anaphylaxis']],
['Carbon monoxide poisoning', 'critical', 'Headache, whole household ill; standard SpO₂ is falsely normal — CO-oximetry.'],
['Metabolic acidosis (Kussmaul breathing)', 'emergent', 'DKA, sepsis, salicylates, uremia — lungs compensating for the blood.'],
['Neuromuscular weakness (GBS, myasthenia)', 'emergent', 'Orthopnea, weak cough, falling NIF/VC — monitor before the crash.'],
['Pneumonia / COPD exacerbation / anemia', 'common', 'High-frequency drivers; treat and reassess objectively.']
],
history: ['Tempo: seconds (PE/PTX), minutes (asthma/edema), hours–days (pneumonia/HF), weeks (anemia/effusion)', 'Positional: orthopnea & PND → LV failure; platypnea → shunt', 'Exposures: smoke, allergens, occupational, CO source, diving', 'Background: asthma/COPD, HF, VTE risks, immunosuppression', 'Associated chest pain, fever, leg swelling, hemoptysis'],
exam: [
    "Listen for voice change, stridor and drooling; inspect for upper-airway swelling before attributing respiratory distress to lower-airway disease.",
    'Work of breathing: accessory muscles, tripod posture, speech in words vs sentences', 'Stridor (upper airway), wheeze (airway), crackles (alveolar), absent sounds (PTX/effusion)', 'JVP, edema, S3 → congestion', 'Cyanosis, agitation, drowsiness = objective severity', 'POCUS: anterior B-lines, sliding, effusions, RV/LV ratio'],
workup: [
['Bedside', ['SpO₂ + observation; peak flow in asthma if the patient can perform it', 'POCUS + ECG (RV strain, ischemia)', 'VBG/ABG when hypercapnia or deterioration is suspected']],
['Labs', ['BNP/NT-proBNP, troponin, gated D-dimer (age-adjusted or YEARS), CBC, BMP, lactate', 'CO-oximetry if exposure suspected']],
['Imaging', ['CXR first-line; CTPA when the PE pathway is positive', 'Echo for systolic dysfunction or suspected high-risk PE']]
],
redFlags: ['Silent chest, exhaustion, or falling respiratory rate in asthma/COPD', 'Rising CO₂ or falling pH on VBG', 'SpO₂ <90% despite high-flow oxygen', 'Hemodynamic instability or stridor at rest', 'Absent lung sliding with shock', 'New confusion or drowsiness (CO₂ narcosis)'],
disposition: [
['Discharge', 'Asthma/COPD back to baseline, acceptable room-air SpO₂, reliable follow-up. Asthma: prescribe an ICS-containing regimen (GINA 2026 for adults, adolescents, and children 6–11 y; use the preschool pathway under 6 y).'],
['Admit (ward / HDU)', 'Persistent hypoxia, moderate exacerbation, or PE/pneumonia needing inpatient care (selected low-risk PE may qualify for outpatient therapy via Hestia/PESI + bleeding/follow-up checks; use PSI + clinical judgment in pneumonia).'],
['ICU / NIV-ventilation', 'NIV failure or exhaustion; COPD with pH <7.25 or falling despite NIV; tension physiology; high-risk PE (shock/hypotension) — PERT/reperfusion, not RV strain alone.']
],
pitfalls: [
    "Supplemental oxygen does not correct inadequate ventilation. Assess respiratory effort, mental status and blood gas when indicated rather than following SpO₂ alone.",
    'Normal SpO₂ excludes neither PE nor early CO poisoning (cherry-red skin is uncommon and unreliable).', 'Wheeze in the elderly is not always asthma — think HF (\u201Ccardiac asthma\u201D).', 'A fatiguing asthmatic with a \u201Cnormal\u201D CO₂ is deteriorating, not improving.', 'Diffuse B-lines are not always edema — integrate context (ARDS, pneumonia, fibrosis).', 'Discharging asthma on SABA (albuterol) alone increases severe exacerbations and mortality (GINA 2026).'],
pearls: [
    "NIV requires a suitable patient and close monitoring: respiratory arrest, inability to protect the airway, significant aspiration risk or hemodynamic instability demand urgent airway assessment.",
    "After initial treatment, reassess respiratory rate, work of breathing, mentation, oxygen requirement and gas exchange when indicated; deterioration requires escalation even if saturation improves.",
    'POCUS (B-lines, sliding, RV) plus a focused history resolves most dyspnea faster than any single lab.', 'Normal SpO₂ excludes neither PE nor early CO — use the pathway and co-oximetry.', 'A fatiguing asthmatic with a \u201Cnormal\u201D CO₂ is pre-arrest, not improving.', 'Never discharge asthma on SABA alone: pair with ICS-containing therapy (≥6 y) or the preschool pathway (<6 y).'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dyspnea & respiratory distress', 'GINA 2026 (ICS-formoterol Track 1; no SABA-only therapy)', 'GOLD 2026', '2019 ESC/ERS PE Guidelines; 2026 AHA/ACC Acute PE Guideline']
},
{
id: 'abdominal-pain', name: 'Abdominal Pain', icon: '🎯',
tag: 'Age, location, pregnancy status, and the vascular exam.',
overview: 'The ED goal is triage: exsanguinating and necrotizing causes first, then time-sensitive surgical causes, then medical mimics. Localization follows embryology (epigastric=foregut, periumbilical=midgut, suprapubic=hindgut) — migration of pain is diagnostic gold.',
approach: [
    'hCG in every patient of childbearing potential.',
    'Killers first: AAA, mesenteric ischemia, ectopic, perforation, torsion.',
    'Localize by embryology and migration; then image (US for biliary/GYN, CT as the workhorse).',
    'Consider extra-abdominal and metabolic causes alongside abdominal disease: inferior MI, basal pneumonia and DKA.'
],
dontMiss: [
['Ruptured AAA', 'critical', 'New abdominal or back pain, syncope or shock with an aortic risk feature needs early vascular assessment. Use bedside ultrasound for an aneurysm and urgent CTA when safe.', ['ruptured-abdominal-aortic-aneurysm']],
['Mesenteric ischemia', 'critical', 'Pain out of proportion, AFib or vasculopathy; lactate and WBC may be normal early — CTA is the test.', ['acute-mesenteric-ischemia']],
['Ruptured ectopic pregnancy', 'critical', "Test for pregnancy when possible. Suspected rupture with instability needs hemorrhage resuscitation and immediate gynecology.", ['ectopic-pregnancy']],
['Perforated viscus', 'critical', "Abrupt severe pain or peritonitis needs urgent surgical review. CT can identify free air or the source when transport is safe. A perforated ulcer is one cause.", ['perforated-peptic-ulcer']],
['Ovarian / testicular torsion', 'critical', "Abrupt unilateral pelvic, groin or scrotal pain with vomiting warrants urgent specialist assessment. Preserved Doppler flow does not exclude torsion.", ['ovarian-torsion', 'testicular-torsion']],
['Aortic dissection with abdominal malperfusion', 'critical', 'Abrupt abdominal or back pain with pulse deficits, neurologic changes or shock warrants urgent aortic assessment.', ['acute-aortic-syndrome']],
['Acute cholangitis', 'critical', 'Right upper quadrant pain with fever, jaundice or sepsis warrants evaluation for infected biliary obstruction.', ['acute-cholangitis']],
['DKA, inferior MI, basal pneumonia', 'emergent', 'Medical mimics — check glucose, ECG, and lungs in every atypical story.', ['hyperglycemia', 'acute-coronary-syndrome']],
['Appendicitis / cholecystitis / diverticulitis / obstruction', 'common', "Use pain location, serial examination and selective imaging to narrow the cause. Escalate peritonitis, sepsis or suspected bowel compromise.", ['acute-appendicitis', 'acute-cholecystitis', 'acute-diverticulitis', 'small-bowel-obstruction']],
['Acute pancreatitis', 'emergent', 'Persistent epigastric pain, often radiating to the back, warrants lipase testing when the presentation fits.', ['acute-pancreatitis']]
],
history: [
    "Ask about the last bowel movement and passage of flatus, prior abdominal operations and hernias when obstruction is possible.",
    'Onset & migration: periumbilical → RLQ (appendicitis); sudden maximal (perforation, torsion, AAA)', 'Relationship to meals (biliary), defecation (colonic), vomiting first vs pain first (surgical vs medical)', 'Blood: hematemesis, melena, hematochezia; last menstrual period & pregnancy possibility', 'Vascular history: AFib, known AAA, atherosclerosis → ischemia', 'Immunosuppression and steroids blunt peritoneal signs'],
exam: ['Peritoneal signs: rigidity, rebound, guarding', 'Murphy sign (cholecystitis), McBurney (appendicitis), Rovsing/psoas/obturator', 'Pulsatile mass + bruits; Cullen/Grey-Turner are late and uncommon (retroperitoneal blood)', 'Hernial orifices and genital exam in every male with scrotal/inguinal pain', 'Volume status: tachycardia, dry mucosa, capillary refill'],
workup: [
['Bedside', ['Urine hCG in all patients of childbearing potential', 'POCUS: AAA size, free fluid, gallbladder wall/stone, intrauterine pregnancy']],
['Labs', [
    "Tailor laboratory tests to the differential; a standard abdominal panel cannot independently exclude surgical disease.",
    'CBC, CRP, electrolytes, glucose, lactate, lipase, LFTs, urinalysis', 'Type & screen when surgery is likely; quantitative β-hCG']],
['Imaging', ['CT abdomen/pelvis with IV contrast for appropriate abdominal differentials; suspected mesenteric ischemia requires urgent CTA with an arterial-phase protocol', 'US first for biliary and gynecologic; MRI in pregnancy when US is inconclusive']]
],
redFlags: ['Hypotension or syncope with abdominal pain', 'Pain out of proportion to exam findings', 'Rigid abdomen or positive peritoneal signs', 'GI bleeding with known AAA repair (aortoenteric fistula)', 'Acute scrotal pain — treat as torsion until proven otherwise', 'Immunosuppressed with mild findings (can decompensate fast)'],
disposition: [
['Discharge', 'Benign exam, normal labs/imaging when indicated, reliable return precautions — reassess within 24–48 h if pain persists.'],
['Admit / surgical consult', 'Appendicitis (early laparoscopic appy, or antibiotics-first per local protocol), cholecystitis, diverticulitis, obstruction without strangulation.'],
['Emergency surgery / IR / ICU', 'Ruptured AAA, perforation, mesenteric ischemia, strangulated obstruction, torsion.']
],
pitfalls: ['Analgesia does not mask the diagnosis — treat the pain and re-examine (ACEP).', 'Normal lactate & WBC do not exclude early mesenteric ischemia.', 'Ectopic pregnancy happens with \u201Cno risk factors\u201D and a negative exam — and with a history of tubal ligation.', 'Elderly with soft findings can have catastrophes — lower the threshold for CT.', 'Diaphragmatic irritation (basal pneumonia, inferior MI) presents as upper abdominal pain.'],
pearls: [
    "Reassess vital signs, pain and abdominal findings after treatment. If important uncertainty persists, use observation, repeat examination or senior review before discharge.",
    "Explain that undifferentiated abdominal pain can evolve: return promptly for worsening pain, persistent vomiting, bleeding, syncope or fever rather than waiting for the planned follow-up.",
    'hCG in every patient of childbearing potential — no exceptions for \u201Cno risk factors.\u201D', 'Pain out of proportion with a quiet belly is mesenteric ischemia until CTA says otherwise.', 'Analgesia does not mask the surgical abdomen — treat pain and re-examine.', 'The elderly with a soft abdomen still perforate, infarct, and rupture AAAs — lower the CT threshold.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — abdominal pain & surgical abdomen', 'Tintinalli\u2019s Emergency Medicine, 9th ed.', 'WSES 2025 edition appendicitis guideline (published 2026); WSES 2020 diverticulitis guideline; CODA trial (NEJM 2020)']
},
{
id: 'headache', name: 'Headache', icon: '🧠',
tag: 'Thunderclap, worst-ever, or any red flag = imaging.',
overview: 'Primary headaches (migraine, tension, cluster) dominate ED volumes, but the task is to filter the ~1–5% with secondary catastrophes. Thunderclap onset, fever with meningismus, papilledema, and new neuro deficits change everything.',
approach: [
    'Thunderclap, worst-ever, or any red flag → image.',
    'For suspected SAH, a high-quality noncontrast CT within 6 h with expert interpretation can exclude SAH in neurologically intact adults. AHA/ASA 2023 recommends CT then LP if negative when presentation is >6 h or there is a new neurological deficit; ACEP permits LP or CTA for residual risk after negative CT through shared decision-making.',
    'Do not delay antibiotics for CT when meningitis is possible. Give IV dexamethasone with or before the first antibiotic dose in adults with suspected bacterial meningitis (NICE NG240) — continue only if pneumococcus or Hib is confirmed.',
    'Age ≥50 with visual symptoms: treat GCA on suspicion — do not wait for ESR.'
],
dontMiss: [
['Subarachnoid hemorrhage', 'critical', 'Sudden worst-ever headache (<1 min to peak). Negative high-quality CT <6 h in a neurologically intact adult rules out SAH (ACEP); otherwise use LP or CTA via shared decision-making. Ottawa SAH applies only to alert, intact patients ≥16 y with new nontraumatic headache peaking <1 h.'],
['Intracranial hemorrhage', 'critical', 'Focal deficits, anticoagulation, hypertension — non-contrast CT first.'],
['Meningitis / encephalitis', 'critical', 'Fever + meningismus ± altered mentation — antibiotics within 1 h; add IV dexamethasone with or before the first dose in adults with suspected bacterial meningitis (NICE NG240). Do not wait on CT; LP when safe.'],
['Cerebral venous sinus thrombosis', 'critical', 'Progressive headache, papilledema, hypercoagulable state, postpartum — CTV/MRV.'],
['Arterial dissection (carotid/vertebral)', 'critical', 'Head/neck pain + Horner syndrome or posterior-circulation symptoms after trauma or neck manipulation.'],
['Acute angle-closure glaucoma', 'critical', 'Painful red eye, halos, mid-dilated pupil, vision loss — ophthalmology now.'],
['Giant cell arteritis (temporal arteritis)', 'emergent', 'Age ≥50, jaw claudication, new headache, visual symptoms — start glucocorticoids immediately if cranial GCA/visual threat is suspected; do not wait for biopsy. ESR/CRP can be normal.'],
['Migraine / tension / cluster', 'common', 'Recurrent pattern without red flags; treat (prefer non-opioids) and arrange follow-up.']
],
history: [
    "Document the exact onset and time to peak intensity separately from total headache duration; record onset time when applying the early-CT SAH pathway.",
    'Onset speed: thunderclap (<1 min to peak) = SAH until excluded', 'Worst-ever, first-ever, or atypical-for-this-patient headache', 'Fever, immunosuppression, malignancy, anticoagulation, pregnancy/postpartum', 'Positional (post-LP, intracranial hypotension), transient (RCVS), exertional or wake-up pattern', 'Associated: neck pain, photophobia, visual change, jaw claudication'],
exam: ['Full neuro: focal deficits, gait, fundoscopy for papilledema', 'Meningismus: nuchal rigidity, Kernig/Brudzinski (insensitive — do not rely on them alone)', 'Temporal artery tenderness; scalp allodynia', 'Eye: acuity, pupils, red eye, corneal clouding', 'Skin: zoster, neurocutaneous stigmata'],
workup: [
['Bedside', ['Glucose, vitals including temperature, fundoscopy']],
['Labs', ['ESR and CRP if GCA is possible (normal values do not exclude it)', 'Coagulation before LP', 'LP when selected after imaging and safety assessment: opening pressure, RBC and WBC counts, xanthochromia and microbiology as indicated; interpret timing and traumatic taps through the local SAH pathway']],
['Imaging', ['Non-contrast CT for thunderclap/red flags (rules out SAH if <6 h, neurologically intact, expert read)', 'CTV/MRV for CVT; CTA/MRA for dissection and aneurysm', 'MRI for posterior fossa or progressive headaches']]
],
redFlags: ['Thunderclap or \u201Cworst headache of my life\u201D', 'Fever with meningismus or altered mentation', 'New focal deficit, seizure, or papilledema', 'First headache ≥50 y, in pregnancy/postpartum, cancer, or immunocompromise', 'Progressive or sleep-waking pattern over days', 'Painful red eye with visual loss', 'Trauma or anticoagulation with new headache'],
disposition: [
['Discharge', 'Primary migraine/tension headache with benign exam, effective non-opioid relief, and no red flags — return precautions and follow-up.'],
['Admit', 'Meningitis on therapy, CVT anticoagulation, GCA on glucocorticoids, refractory migraine/cluster infusions.'],
['Neurosurgery / stroke unit / ICU', 'SAH (aneurysm securing), ICH per protocol, deteriorating meningitis, elevated ICP.']
],
pitfalls: [
    "Improvement after analgesia does not establish a benign cause or exclude SAH.",
    "A negative SAH evaluation does not exclude meningitis, cerebral venous thrombosis or other secondary causes; pursue the remaining differential.",
    'Do not extend the early-CT rule-out to late presentation or new neurological deficits. AHA/ASA recommends LP after a negative CT in these settings; CTA is an alternative under the ACEP shared-decision pathway, with different limitations.', 'Sentinel \u201Cwarning\u201D headaches precede 10–40% of aneurysm ruptures.', 'Ottawa SAH Rule is highly sensitive but poorly specific — any positive criterion requires testing.', 'GCA can present without a tender temporal artery and with a normal ESR.', 'Do not relabel a first \u201Cmigraine\u201D after age 50 without considering imaging.', 'Opioids are not first-line for primary headache in the ED (ACEP).'],
pearls: [
    "Explain the LP/CTA tradeoffs when considering the ACEP alternative pathway: LP may identify other CSF disease but can produce traumatic taps; CTA can reveal incidental aneurysms, adds contrast/radiation and does not directly test for subarachnoid blood. Follow local specialist pathways.",
    'Negative high-quality CT within 6 h in a neurologically intact adult excludes SAH; >6 h or persistent concern needs LP or CTA.', 'An all-negative Ottawa SAH rule avoids SAH testing only in eligible alert patients (peaking <1 h) without other red flags.', 'Start glucocorticoids immediately if cranial GCA with visual threat is suspected — do not wait for ESR or biopsy.', 'A first \u201Cmigraine\u201D after age 50 is a red flag, not a diagnosis.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — headache', 'ACEP 2019 Clinical Policy: Acute Headache (Ottawa SAH Rule; 6-hour CT rule; LP or CTA after negative CT)', 'AHA/ASA 2023 Guideline for Aneurysmal SAH', 'ACR/EULAR 2022 GCA classification (research criteria, not a diagnostic exclusion rule); EULAR GCA management recommendations']
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
['Stroke / intracranial hemorrhage', 'critical', 'Sudden focal signs or anticoagulation — non-contrast CT now. Check reperfusion eligibility (IV tenecteplase/alteplase ≤4.5 h, or 4.5–9 h/unknown onset via advanced imaging; mechanical thrombectomy up to 24 h in selected large-core and basilar occlusions per 2026 AHA/ASA).'],
['SAH', 'critical', 'Sudden headache + collapse; CT then LP or CTA as indicated.'],
['Meningitis / encephalitis', 'critical', 'Fever, meningismus — empiric therapy must not wait on imaging.'],
['Wernicke encephalopathy', 'critical', 'Alcohol use/malnutrition — give thiamine with (or immediately after) glucose; do not withhold glucose.'],
['Toxic ingestion (CO, TCA, salicylates, opioids)', 'critical', 'Pupils, skin, ECG (QRS widening), anion gap, temperature. Cherry-red skin is an unreliable CO sign — use CO-oximetry.'],
['Severe hyponatremia / hyperammonemia / uremia', 'emergent', 'Metabolic catastrophes — labs before labels.'],
['Delirium from infection / retention / medications', 'common', 'Find the driver; \u201CUTI\u201D alone is an overused explanation in the elderly (asymptomatic bacteriuria does not establish symptomatic UTI).']
],
history: [
    "Ask family or carers about recent changes in attention, interaction, sleep and function, including fluctuation over hours; establish what is normal for this patient.",
    'Baseline cognition and tempo of change (family, care home, EMS)', 'Medications: sedatives, anticholinergics, insulin, anticoagulants', 'Substance use, alcohol, psychiatric history, toxin access', 'Trauma/falls — subdural in the elderly, especially if anticoagulated', 'Fever, headache, seizure activity, end-organ disease'],
exam: [
    "Look for hypoactive delirium: withdrawal, slowed responses, reduced movement and poor concentration can be easier to miss than agitation.",
    "When delirium indicators are present outside critical care, use the 4AT to support assessment; in critical care use CAM-ICU or ICDSC. A competent clinician confirms the diagnosis and investigates causes.",
    'GCS + focused neuro: pupils, focal signs, meningismus', 'Glucose and SpO₂ at the bedside — mandatory first steps', 'Skin: needle tracks, rash, pallor; do not rely on cherry-red color for CO', 'Breath odor: hepatic, ketotic, alcohol, uremic', 'Trauma stigmata: hemotympanum, raccoon eyes, scalp hematoma'],
workup: [
['Bedside', ['Glucose, SpO₂, temperature, VBG', 'ECG (TCA patterns, ischemia, dysrhythmia)', 'POCUS for systemic causes of shock as trained; it cannot exclude intracranial pathology']],
['Labs', ['Electrolytes (Na, Ca), renal and hepatic panels; ammonia if liver disease', 'Lactate, CBC, coagulation, targeted toxicology, TSH', 'CO-oximetry if CO is possible']],
['Imaging', ['Head CT before LP when indicated by focal signs, severe depressed consciousness or raised-ICP concern. Anticoagulation/coagulopathy requires a separate LP safety assessment; a normal CT does not make LP safe', 'CXR; LP and EEG per clinical picture']]
],
redFlags: ['Falling GCS or new focal neurology', 'Hypoglycemia or hypothermia', 'Meningismus, fever, or new seizure', 'Suspected overdose with QRS widening or absent gag reflex', 'Anticoagulation + head injury', 'Hypercapnia or acidosis on VBG'],
disposition: [
['Discharge', 'Baseline mental status restored, reversible cause treated, safe environment with reliable observers (e.g., resolved simple hypoglycemia with a plan).'],
['Admit', 'Delirium of unclear cause, treated infection under observation, uncorrected metabolic derangement.'],
['ICU / stroke pathway', 'Coma, airway compromise, status epilepticus, severe intoxication, massive ICH, fulminant sepsis, large-vessel occlusion within the EVT window.']
],
pitfalls: ['\u201CUTI causing AMS\u201D is overcalled — keep looking for the true driver (IDSA: do not treat asymptomatic bacteriuria).', 'A single glucose bolus does not precipitate Wernicke encephalopathy; prolonged carbohydrate loads without thiamine can.', 'Subdurals in the elderly can be progressive confusion \u201Cwithout trauma\u201D.', 'Hypothermia masks toxidromes and infection signs.', 'Post-ictal states normalize — image when they don\u2019t.'],
pearls: [
    "Support recovery with calm reorientation, reassurance, familiar carers when possible, and working hearing/visual aids; assess pain, hydration, constipation and medication contributors.",
    'Glucose and oxygen before the mnemonic.', 'Never delay dextrose for thiamine — give them together.', '\u201CUTI causing AMS\u201D is overcalled; asymptomatic bacteriuria does not establish symptomatic UTI (IDSA).', 'A changing elderly patient without a clear fall still has a subdural until you look.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — altered mental status & delirium', 'Han JH, Wilber ST. Altered mental status in older patients in the emergency department. Clin Geriatr Med.', '2026 AHA/ASA acute ischemic stroke guideline; IDSA asymptomatic bacteriuria', 'Donnino et al., Ann Emerg Med 2007; Schabelman & Kuo, J Emerg Med 2012 — thiamine/glucose sequence']
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
['High-risk PE', 'critical', 'Syncope can be the only symptom; check VTE risks and RV strain.', ['pulmonary-embolism']],
['Internal hemorrhage (AAA, GI bleed, ectopic)', 'critical', 'Syncope with anemia, abdominal/back pain, or positive hCG.', ['ruptured-abdominal-aortic-aneurysm', 'gib', 'ectopic-pregnancy']],
['SAH and other intracranial causes', 'critical', 'Headache + collapse; \u201Csyncope with head injury\u201D may be the other way around.'],
['Carotid / subclavian steal', 'emergent', 'Arm-exercise syncope with pulse/BP asymmetry.'],
['Vasovagal / orthostatic / situational', 'common', 'Prodrome (warmth, pallor, nausea) + trigger + upright posture — the reassuring triad.']
],
history: [
    "Obtain a witness account of posture, triggers, duration, movements and recovery; prolonged confusion or focal deficits should reopen the differential beyond uncomplicated syncope.",
    'Circumstances: posture, triggers (blood, standing, micturition), exertion?', 'Prodrome vs no warning — cardiac causes often strike without prodrome', 'Palpitations, chest pain, dyspnea before the event', 'Family history of sudden death <40 y; known cardiomyopathy/channelopathy', 'QT-prolonging or hypotensive medications; alcohol'],
exam: ['Orthostatic vitals; BP in both arms', 'Cardiac: murmurs (AS, HCM), rhythm, gallops', 'Volume status; rectal exam / visible melena if bleeding is suspected', 'Post-event neuro: seizure vs syncope (tongue biting, confusion, orientation)', 'Injury pattern consistent with abrupt collapse'],
workup: [
['Bedside', ['12-lead ECG for everyone — QTc, blocks, delta waves, Brugada, ischemia, QRS axis/duration', 'Glucose; POCUS: RV strain, effusion, AAA, IVC']],
['Labs', ['hCG in childbearing potential; heme screen if bleeding is suspected', 'Troponin when cardiac suspicion (a CSRS component if measured)', 'Electrolytes, CBC as indicated']],
['Imaging / monitoring', [
    "Do not routinely request head CT/MRI, carotid imaging or EEG for uncomplicated syncope without relevant focal neurological findings, head injury or seizure features.",
    'Head imaging for relevant trauma, focal findings or another specific intracranial concern; CTPA per PE pathway', 'ED rhythm monitoring; outpatient cardiac monitoring for selected intermediate-risk patients']]
],
redFlags: ['Exertional syncope or syncope while supine', 'No prodrome / sudden collapse with facial injury', 'Abnormal ECG (QTc >480 ms per CSRS; blocks, pre-excitation, Brugada, ischemia)', 'Structural heart disease or family history of sudden death', 'Chest pain, dyspnea, or palpitations preceding the event', 'Ongoing blood loss or positive hCG', 'CSRS ≥4 (high / very high)'],
disposition: [
['Discharge', 'Reflex/vasovagal pattern, normal ECG, CSRS −3 to 0 (very low / low; 30-day serious outcome <1%) — hydration, counseling, primary care follow-up.'],
['Admit (telemetry) or shared decision', 'CSRS +1 to +3 (medium, ~8% 30-day serious outcomes): shared decision / brief observation. Abnormal ECG not clearly chronic; frail elderly living alone.'],
['Monitored admission / expedited cardiac workup; ICU if unstable', 'CSRS ≥4, documented arrhythmia, exertional syncope with murmur, PE with shock or strain plus biomarkers, positive troponin with ischemic features.']
],
pitfalls: [
    "Orthostatic hypotension may coexist with other disease; a positive standing BP result must fit the event and does not cancel cardiac or bleeding red flags.",
    'Facial injury can follow either cardiac or reflex syncope — assess both the trauma and the syncope mechanism.', 'Convulsive syncope mimics seizure — weigh the whole story.', 'A normal ED ECG does not exclude intermittent arrhythmia — history drives follow-up.', 'GI bleeding may be occult — look for melena in unexplained syncope.', 'Exertional syncope is cardiac until proven otherwise (rarely a post-exertional reflex faint — do not label it vasovagal in the ED).', 'CSRS ≥1 is medium, not high — do not automatically admit every +1.'],
pearls: [
    "When arrhythmic syncope remains possible, choose rhythm monitoring according to event frequency and risk, and arrange ownership of results and follow-up before outpatient discharge.",
    'ECG for every syncope, no exceptions.', 'CSRS −3 to 0 (very low/low) can go home; +1 to +3 is shared decision; ≥4 is high-risk.', 'Abrupt collapse without prodrome raises arrhythmic risk; integrate history, ECG, and exam.', 'Exertional or supine syncope is cardiac until the opposite is proven.'],
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
['Acute stroke / TIA', 'critical', 'Sudden focal weakness — last-known-well, glucose, non-contrast CT. Check eligibility for IV TNK/alteplase (≤4.5 h, or 4.5–9 h/unknown onset via advanced imaging) and EVT (≤24 h, including selected large-core infarcts per 2026 AHA/ASA).'],
['Guillain-Barré syndrome', 'critical', 'Ascending (or variant) weakness, areflexia; monitor NIF/VC — intubate before the crash. CSF may be normal in the first week.'],
['Cauda equina / cord compression', 'critical', 'Back pain + leg weakness ± saddle anesthesia, urinary retention — emergency MRI + spine surgery. Dexamethasone is for metastatic cord compression (NICE NG234), not routine for discogenic CES.'],
['Myasthenic crisis', 'critical', 'Fatigable weakness (ptosis, diplopia worse late in the day); NIF monitoring; avoid macrolides, fluoroquinolones, aminoglycosides.'],
['Transverse myelitis', 'critical', 'Sensory level, bladder dysfunction — MRI + steroids after infection is addressed.'],
['Botulism / tick paralysis', 'emergent', 'Descending weakness with poorly reactive pupils (botulism); find and remove the tick.'],
['Rhabdomyolysis / dyskalemic paralysis', 'emergent', 'Pigmented urine or extreme K⁺ shifts — ECG and treat the potassium.'],
['Anemia, hypothyroid, depression, OSA, deconditioning', 'common', 'The chronic-fatigue cohort — screen systematically.']
],
history: ['Tempo and pattern: sudden focal (vascular), ascending over days (GBS), fatigability through the day (MG)', 'Sensory level, back pain, bowel/bladder function, cancer history (MSCC)', 'Tick exposure, recent infections (Campylobacter), medications', 'Family history (periodic paralysis, dystrophy)', 'Fatigue screen: sleep, mood, weight change, bleeding, fevers'],
exam: [
    "Check bulbar function, neck strength and cough, not just limb power; rapid progression or impaired airway clearance needs early critical-care assessment.",
    'Map the pattern: proximal vs distal, symmetric vs focal, UMN (brisk reflexes, spasticity) vs LMN (flaccid, areflexia)', 'Interpret reflexes with the full pattern; GBS variants can retain reflexes', 'Perianal sensation and rectal tone when cauda equina is possible', 'Fatigability: sustained upgaze for ptosis (MG)', 'Respiratory: single-breath count, cough strength'],
workup: [
['Bedside', [
    "Follow serial vital capacity and respiratory examination in suspected GBS; worsening trends matter even before obvious respiratory distress.",
    'Glucose; NIHSS if focal', 'NIF / vital capacity in suspected GBS or MG', 'Urine color for myoglobin; tick search', 'Post-void residual if CES is possible']],
['Labs', ['K⁺, phosphate, magnesium, CK, TFTs, CBC, B12, glucose/HbA1c', 'CSF (albuminocytologic dissociation) for GBS — may be normal early; AChR/MuSK antibodies for MG']],
['Imaging', ['Urgent MRI spine for cord/cauda/MSCC suspicion — do not delay for plain films', 'CT/MRI brain for focal weakness']]
],
redFlags: ['Progressive ascending weakness or falling NIF/VC', 'Back pain with weakness or urinary retention (cauda equina / MSCC)', 'Sudden focal deficit (stroke pathway)', 'Respiratory symptoms in neuromuscular disease', 'Dark urine with muscle pain (rhabdo)', 'Bilateral leg weakness with a sensory level', 'Known cancer + new spinal pain or neurology (MSCC)'],
disposition: [
['Discharge', 'Chronic fatigue with a clear treated cause and safe follow-up; benign post-viral fatigue with red-flag education.'],
['Admit', 'GBS/MG under monitoring (even if ambulating), electrolyte derangements, moderate rhabdo on IV fluids, progressive unclear cases.'],
['ICU / emergency intervention', 'Impending respiratory failure (NIF weaker than −30 cmH₂O, e.g. −20; VC <15–20 mL/kg; or 20/30/40 rule), cord compression, severe hyperkalemia, stroke needing intervention.']
],
pitfalls: [
    "Normal nerve-conduction studies in the first week do not exclude GBS; specialist-directed repeat testing may be needed.",
    'GBS presenting as back pain or with preserved reflexes early — serial exams and NIFs. CSF protein often rises only after the first week.', 'Myasthenia worsens with macrolides, fluoroquinolones, and aminoglycosides.', 'Do not wait for a \u201Ccomplete\u201D CES picture (full saddle anesthesia) before MRI.', 'Dexamethasone is indicated for suspected MSCC, not as routine therapy for discogenic cauda equina.', 'Periodic paralysis after a heavy carbohydrate meal or exercise — check K⁺ and family history.', 'Elderly \u201Cweakness\u201D may hide a hip fracture, pneumonia, or sepsis.'],
pearls: [
    "Monitor suspected GBS for autonomic instability, including fluctuating blood pressure and heart rate, as well as weakness.",
    'First decide true weakness vs fatigue, then map the pattern with reflexes.', 'Watch NIF/VC in GBS and myasthenia — intubate before the crash.', 'Dexamethasone is for metastatic cord compression, not routine discogenic cauda equina.', 'Do not wait for a \u201Ccomplete\u201D CES picture before MRI.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — weakness & neuromuscular disease', 'EAN/PNS 2023 Guillain-Barré syndrome guideline', 'NICE NG234 (2023) metastatic spinal cord compression — dexamethasone 16 mg for MSCC with neurology', 'AAN guidance on myasthenic crisis']
},
{
id: 'gib', name: 'GI Bleeding', icon: '🩸',
tag: 'Resuscitate, risk-stratify, find the source.',
overview: 'GI bleeding is resuscitation first, diagnosis second. Hemodynamics beat the hematocrit (it lags for hours). Estimate upper vs lower from the story, risk-stratify (Glasgow-Blatchford for UGIB; Oakland for selected LGIB), and know the variceal pathway — it changes drugs and endoscopy timing.',
approach: [
    'Resuscitate first: two large-bore IVs, hemodynamics over the first hematocrit.',
    'Upper vs lower from the story; variceal pathway changes drugs and endoscopy timing.',
    'Risk-stratify: Glasgow-Blatchford 0–1 may support outpatient UGIB care when clinical assessment and follow-up are suitable (ACG 2021).',
    'In stable UGIB, usual Hb trigger 7 g/dL (often 8 with CVD); active shock and ACS need individualized transfusion. Avoid over-transfusing varices.'
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
history: [
    "Record the exact antithrombotic drug, indication and last dose, and assess renal function; reversal and interruption decisions need the bleeding severity and thrombotic risk.",
    'Hematemesis vs coffee-ground vs melena vs hematochezia — map the likely level', 'NSAIDs, anticoagulants, antiplatelets, alcohol, cirrhosis', 'Prior ulcers, H. pylori, AAA repair, radiation, IBD', 'Volume-loss symptoms: syncope, angina with anemia'],
exam: ['Serial pulse/BP, mental status and peripheral perfusion; a normal pulse does not establish stability', 'Stigmata of liver disease: caput, ascites, asterixis', 'Rectal exam: color, mass, trauma', 'Skin: petechiae (thrombocytopenia), telangiectasias'],
workup: [
['Bedside', ['Two large-bore IVs; crossmatch early', 'POCUS for ascites; NG lavage is not routinely recommended']],
['Labs', ['CBC (expect lag), type & crossmatch, coagulation/INR, BUN/Cr (BUN rise suggests upper source), lactate', 'Glasgow-Blatchford for UGIB disposition; LFTs if liver disease']],
['Imaging / scope', [
    "For ongoing hemodynamically significant hematochezia, consider CTA to localize active bleeding and involve IR promptly when extravasation is found. Resuscitation continues during planning.",
    "Most stable inpatients needing colonoscopy can undergo a nonurgent examination after bowel preparation; routine colonoscopy within 24 hours has not improved major outcomes.",
    'Upper endoscopy within 24 h (within 12 h if variceal suspected)']]
],
redFlags: ['Hemodynamic instability or orthostatic symptoms', 'Active hematemesis or massive hematochezia', 'Cirrhosis with any upper GI bleeding', 'Known AAA repair with any bleed', 'Melena + syncope (brisk upper source)', 'Anticoagulation with life-threatening hemorrhage'],
disposition: [
['Discharge', 'Glasgow-Blatchford 0–1 (ACG 2021: very-low-risk UGIB, ≤1% need for intervention) — outpatient endoscopy pathway, stable vitals, reliable follow-up.'],
['Admit (ward / HDU)', 'GBS ≥2, identified stable source, anticoagulation management needed.'],
['ICU / endoscopy-IR activation', 'Hemodynamic instability, active transfusion need, suspected variceal bleed, aortoenteric fistula.']
],
pitfalls: [
    "Risk scores supplement clinical judgment. A low score does not override ongoing bleeding, unstable physiology, important comorbidity or an unsafe outpatient plan.",
    'Hemoglobin/hematocrit may initially be normal in acute hemorrhage and change with equilibration and fluids. Use perfusion, ongoing loss and serial measurements.', 'Melena can come from the right colon; hematochezia can be a brisk upper bleed.', 'Restrictive transfusion is usual in stable UGIB (Hb 7 g/dL; often 8 with CVD). Hemorrhagic shock and active ACS need individualized decisions rather than waiting for that threshold.', 'Over-transfusing variceal bleeding raises portal pressure and rebleeding (Baveno VII).', 'Pre-endoscopic PPI has no ACG recommendation for or against — do not let it delay endoscopy.', 'NG lavage does not reliably risk-stratify and is not required.'],
pearls: ['An initially normal hemoglobin does not exclude major acute blood loss; reassess perfusion and serial hemoglobin.', 'Glasgow-Blatchford 0–1 may support outpatient endoscopy after assessment confirms clinical stability and reliable follow-up (ACG 2021).', 'Usual Hb triggers in stable bleeding: 7 g/dL (often 8 with CVD); do not apply a fixed trigger to hemorrhagic shock or active ACS.', 'Variceal bleed: vasoactive drug + ceftriaxone + endoscopy within 12 h; do not over-transfuse.'],
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
    'Start crystalloid resuscitation, then use dynamic reassessment to individualize further fluid; start norepinephrine if MAP remains low during resuscitation (SSC).',
    "Identify early whether infection needs drainage, relief of obstruction, debridement or removal of an infected device; antibiotics alone may not achieve source control."
],
dontMiss: [
['Sepsis / septic shock', 'critical', 'Hypotension, tachypnea, altered mentation, lactate >2. Antibiotics within 1 h for shock or probable sepsis; within 3 h for possible sepsis without shock after a rapid look. Use balanced crystalloid for initial resuscitation and dynamic measures to guide further fluid. Begin norepinephrine if MAP remains low during resuscitation (SSC 2026).'],
['Necrotizing soft-tissue infection / toxic shock', 'critical', 'Pain out of proportion, rapid spread, crepitus, or shock with a wound/soft-tissue source — surgery now, not a wait-for-CT strategy.'],
['Neutropenic fever', 'critical', 'ANC <500 + a single temperature ≥38.3°C (or ≥38.0°C for 1 h) — immediate empiric antipseudomonal antibiotics. MASCC/CISNE may identify low-risk outpatient candidates.'],
['Bacterial meningitis', 'critical', 'Fever + meningismus/altered mentation — first antibiotic dose within 1 h; give IV dexamethasone with or before it in adults with suspected bacterial meningitis (continue only if pneumococcus/Hib). Do not wait on CT.'],
['Infective endocarditis', 'critical', 'Fever + new murmur, IVDU, embolic signs — blood cultures ×3, echo.'],
['Malaria / travel sepsis', 'critical', 'Any fever returning from an endemic area = malaria until proven otherwise (thick/thin smear ± RDT, repeated if negative).'],
['Ectopic pregnancy / puerperal sepsis', 'critical', 'Fever in pregnancy or within 6 weeks postpartum — obstetric pathway.'],
['URIs, gastroenteritis, pharyngitis, UTI', 'common', 'Self-limited or outpatient-managed; keep criteria strict.']
],
history: [
    "Review previous cultures, recent antibiotics and healthcare exposure to guide resistance risk and initial antimicrobial selection.",
    'Temperature course and home antipyretics', 'Host factors: age >65, chemotherapy, steroids/biologics, HIV, asplenia, devices (lines, valves, shunts), pregnancy', 'Travel, exposures, TB contacts', 'Localizing symptoms: cough, dysuria, rash, diarrhea, headache, joints', 'Recent procedures, wounds, dental work'],
exam: [
    "Repeat perfusion assessment: mental status, capillary refill, urine output and hemodynamic trends complement lactate; no single finding establishes adequate resuscitation.",
    'Full vitals including RR and mentation; use NEWS2/MEWS/SIRS — qSOFA is specific but too insensitive to screen alone (SSC 2021 and 2026)', 'Rash: petechial/purpuric (meningococcemia), target (Lyme), drug eruptions', 'Line and wound sites; murmurs; costovertebral and joint exam', 'Meningeal signs; fundoscopy; abdominal/pelvic exam as indicated'],
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
pearls: [
    "Reassess the infection diagnosis as results and response evolve. If another cause becomes more likely, stop unnecessary empiric antimicrobials; otherwise narrow treatment when susceptibility results allow.",
    'Do not screen with qSOFA alone — NEWS2, MEWS, or SIRS are more sensitive (SSC).', 'Antibiotics within 1 h for shock or probable sepsis; within 3 h for possible sepsis without shock after a rapid look.', 'Use balanced crystalloid initially, then dynamic reassessment and norepinephrine when MAP remains low.', 'Afebrile does not mean not septic — especially the elderly and immunosuppressed.'],
doses: [
    ['Fluids (first 3 h, septic shock / sepsis-induced hypoperfusion)', ['Balanced crystalloid 30 mL/kg IV within the first 3 h (individualise for heart failure, renal failure or frailty)', 'Reassess after each bolus with dynamic measures (passive leg raise, stroke-volume variation, echo) rather than static CVP', 'Start norepinephrine if MAP <65 mmHg during or after fluids — do not delay vasopressors for more fluid']],
    ['Antibiotics (timing matters more than the drug)', ['Septic shock / probable sepsis: empiric broad-spectrum antibiotics within 1 h', 'Possible sepsis without shock: rapid assessment, then antibiotics within 3 h if infection remains likely', 'Dose at the high end of normal; consider a loading dose for vancomycin and beta-lactams in shock']],
    ['Vasoactive support', ['Norepinephrine 0.05–1 mcg/kg/min (first-line, titrate to MAP ≥65 mmHg)', 'Add vasopressin 0.03 units/min when norepinephrine requirement rises, or epinephrine for myocardial dysfunction', 'Hydrocortisone 200 mg/24 h IV (50 mg q6h or infusion) for septic shock refractory to fluids and vasopressors']],
    ['Source control', ['Drain, debride or remove the infected focus as soon as feasible — antibiotics do not fix an undrained abscess or infected line']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — fever & sepsis', 'Surviving Sepsis Campaign 2021; SSC 2026 update (NEWS/MEWS/SIRS over qSOFA; antibiotic timing stratified by shock)', 'NICE NG240 (2024) bacterial meningitis — dexamethasone with/before first antibiotic in adults', 'IDSA: neutropenic fever, bacterial meningitis, asymptomatic bacteriuria']
},
{
id: 'dizziness', name: 'Dizziness & Vertigo', icon: '🔄',
tag: 'The one question: is it the inner ear or the brainstem?',
overview: 'Classify dizziness by timing and triggers: continuous acute vestibular syndrome, spontaneous episodes, or triggered episodes; symptom labels alone are unreliable. Duration, triggers, and HINTS (only in ongoing acute vestibular syndrome with nystagmus, by a trained examiner) outperform early CT; sustained vertigo with vascular risk factors needs posterior-circulation imaging (MRI-DWI).',
approach: [
    'Timing and triggers first: continuous acute vestibular syndrome, spontaneous episodes, or triggered episodes.',
    'If positional and seconds-long: Dix-Hallpike / Epley (BPPV).',
    'HINTS only in ongoing acute vestibular syndrome with nystagmus, by a trained examiner. Without nystagmus, assess gait and neurologic findings.',
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
history: [
    "Distinguish brief episodes triggered from an asymptomatic baseline from continuous dizziness merely worsened by head movement; the latter is not automatically BPPV.",
    'Character: spinning (vertigo) vs light-headed vs imbalance', 'Duration: seconds (BPPV), hours (Ménière, TIA), days (neuritis, stroke)', 'Triggers: position changes (BPPV), head motion, standing (orthostatic)', 'Vascular risks: age, hypertension, diabetes, smoking, atrial fibrillation', 'Hearing change, tinnitus, diplopia, dysarthria, dysphagia, headache/neck pain'],
exam: [
    "In spontaneous episodic dizziness, assess cranial nerves, visual fields, eye movements, limb coordination and gait, and ask about symptoms during the attack.",
    'HINTS in ongoing AVS with nystagmus, by a trained examiner: a corrective saccade supports peripheral dysfunction but can occur in stroke; a normal HIT is a central warning in this setting. Interpret the complete examination, including hearing. Direction-changing or vertical nystagmus = central. Test-of-skew (vertical refixation) = central', 'Gait — unable to walk at all suggests central', 'Neuro: cranial nerves, cerebellar tests, dysmetria', 'Dix-Hallpike if positional symptoms; otoscopy', 'Orthostatic vitals if presyncopal'],
workup: [
['Bedside', ['Trained HINTS plus hearing assessment for ongoing AVS with nystagmus; assess gait severity when nystagmus is absent', 'Glucose; orthostatics; ECG if presyncopal']],
['Labs', ['As directed by the picture: CBC, glucose, electrolytes']],
['Imaging', [
    "Central or equivocal HINTS findings require MRI/MRA assessment; if TIA is suspected in spontaneous episodic dizziness, use CTA/MRA for large-vessel assessment.",
    'MRI-DWI for suspected central cause (CT is poor for the posterior fossa)', 'CT first if hemorrhage is suspected; CTA/MRA for vascular assessment']]
],
redFlags: ['Any new focal/cranial-nerve deficit or severe imbalance', 'Sudden headache with vertigo (hemorrhage)', 'Normal head-impulse test, direction-changing or vertical nystagmus, or skew deviation', 'Vascular risk factors with sustained (not positional) vertigo', 'New hearing loss with neuro signs', 'Inability to stand or walk even with support'],
disposition: [
['Discharge', 'BPPV (post-Epley with home exercises), peripheral neuritis with a confident HINTS-peripheral exam, Ménière flare with follow-up — safety-net advice.'],
['Admit', 'High-risk acute vestibular syndrome while MRI is arranged, Ménière with intractable vomiting, electrolyte derangements.'],
['Stroke pathway / neurosurgery', 'Posterior circulation stroke (thrombolysis/thrombectomy if eligible), cerebellar hemorrhage with mass effect.']
],
pitfalls: ['HINTS is invalid in episodic/positional vertigo — that is a Dix-Hallpike question, not a HINTS question.', 'CT is insensitive for posterior ischemia. Early MRI-DWI can also be falsely negative; persistent central concern needs specialist assessment and sometimes repeat imaging.', 'A \u201Cdizzy\u201D elderly patient with falls may have presyncope, not vertigo — re-interview.', 'Nystagmus that changes direction with gaze = central until proven otherwise.', 'Do not treat undifferentiated vertigo with meclizine and discharge — the exam decides.', 'BPPV can coexist with serious causes; re-test if atypical.'],
pearls: [
    "For characteristic posterior-canal BPPV confirmed by Dix-Hallpike, perform an Epley maneuver; routine brain imaging is unnecessary when the presentation and examination are typical.",
    'HINTS requires ongoing AVS with nystagmus and a trained examiner; use gait/neurologic assessment without nystagmus.', 'An abnormal HIT supports peripheral dysfunction but does not exclude stroke; interpret all HINTS findings and hearing together.', 'CT misses most posterior strokes — MRI-DWI when suspicion persists.', 'BPPV is diagnosed with Dix-Hallpike and treated with Epley in the ED.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dizziness & vertigo', 'HINTS exam: Kattah et al., Stroke 2009; subsequent AVS imaging studies', '2026 AHA/ASA stroke guidance; SAEM GRACE-3 (2023) acute dizziness guideline']
},
{
id: 'back-pain', name: 'Low Back Pain', icon: '🦴',
tag: 'Most leave with advice — the task is finding the dangerous few.',
overview: '>90% of ED back pain is non-specific mechanical disease. The ED task is a red-flag sweep: infection, malignancy (including MSCC), fracture, cauda equina, and AAA. Below age 50 without red flags, imaging adds cost and radiation — not diagnosis.',
approach: [
    'Red-flag sweep: infection, cancer/MSCC, fracture, cauda equina, AAA.',
    'Do not routinely image non-specific back pain without red flags; duration alone does not determine imaging.',
    'Retention, saddle numbness, or bilateral weakness → emergency MRI.',
    'NSAIDs and activity, not bed rest or opioids-first.'
],
dontMiss: [
['Cauda equina syndrome', 'critical', 'Saddle anesthesia, urinary retention/incontinence, bilateral leg weakness — emergency MRI + neurosurgery. Do not wait for a \u201Ccomplete\u201D picture.'],
['Metastatic cord compression', 'critical', 'Cancer history + spinal pain or neurology — contact the MSCC pathway, MRI, and start dexamethasone 16 mg if there are neurological signs (NICE NG234).', ['metastatic-spinal-cord-compression']],
['Spinal epidural abscess / discitis', 'critical', 'Fever, IVDU, immunosuppression, recent procedures, exquisite midline tenderness — MRI + antibiotics. Do not give steroids if infection is the leading diagnosis.'],
['Pathologic fracture / malignancy', 'critical', 'Cancer history, night pain, weight loss, age >50 — MRI; myeloma can have normal X-rays.'],
['Rupturing / expanding AAA', 'critical', 'Elderly vasculopath with back pain = AAA until excluded (bedside US/CTA).', ['ruptured-abdominal-aortic-aneurysm']],
['Osteoporotic compression fracture', 'emergent', 'Elderly, steroids, minimal or no trauma — X-ray, treat pain, brace per ortho. Not immediately life-threatening but easy to miss.'],
['Inflammatory spondyloarthropathy', 'common', 'Night pain, morning stiffness >30 min, improves with activity, onset <40 y — not an ED emergency; HLA-B27 and SI-joint MRI as outpatient.'],
['Renal colic / pyelonephritis / pancreatitis', 'common', 'Flank radiation, urinary symptoms — urinalysis, lipase, CT as indicated.', ['acute-pancreatitis']],
['Mechanical / radicular pain (sciatica)', 'common', 'Positional, dermatomal radiation, positive straight-leg raise — NSAIDs, stay active, no bed rest.']
],
history: [
    "Ask what has changed since prior episodes or earlier assessment; a new symptom requires a fresh differential rather than automatic reuse of a mechanical-pain diagnosis.",
    'Trauma? Osteoporosis or chronic steroids? Cancer history?', 'Red-flag screen: fever, weight loss, night pain, immunosuppression, IVDU', 'Neuro: leg weakness, saddle numbness, bowel/bladder changes', 'Inflammatory vs mechanical pattern (morning stiffness, activity response)', 'Recent spinal procedures or surgery'],
exam: ['Midline tenderness (fracture/abscess) vs paraspinal (muscular)', 'Straight-leg raise; dermatomal power, sensation, reflexes', 'Perianal sensation and rectal tone when cauda equina is possible', 'Fever; abdominal and pulsatile-mass exam; CVA tenderness', 'Gait and overall neurologic observation'],
workup: [
['Bedside', ['Focused neuro mapping; post-void residual (bladder scanner) if retention is possible', 'Vitals including temperature', 'Bedside US if AAA is on the list']],
['Labs', ['CBC, ESR/CRP for infection/malignancy screen; urinalysis', 'Myeloma screen (SPEP, calcium, creatinine) when age + red flags fit']],
['Imaging', [
    "Persistent pain alone is not an automatic indication for imaging at six weeks; in specialist care, image when the result is likely to change management or serious pathology is suspected.",
    'Do not routinely image non-specific back pain without red flags; specialist imaging should change management (NICE NG59)', 'Emergency MRI for cauda equina, abscess, or MSCC — do not delay for plain films', 'X-ray first for osteoporotic fracture screen', 'Bedside US/CTA when AAA is suspected']]
],
redFlags: ['Urinary retention or saddle anesthesia', 'Bilateral leg weakness or progressive deficit', 'Fever or IVDU with spinal pain', 'Cancer history, unexplained weight loss, night pain', 'Significant trauma — or minor trauma in the osteoporotic/elderly', 'Age >50 with new severe pain + vascular history'],
disposition: [
['Discharge', 'Non-specific mechanical pain without red flags: consider an NSAID at the lowest effective dose for the shortest period after checking risks, plus heat/activity and follow-up. Do not offer acetaminophen alone as effective first-line treatment (NICE NG59). Opioids-first is outdated.'],
['Admit', 'Epidural abscess on IV antibiotics, pathologic fracture needing stabilization, intractable radicular pain, social issues.'],
['Emergency MRI + neurosurgery/ortho/oncology', 'Cauda equina, MSCC, unstable fracture, spinal infection with neuro signs.']
],
pitfalls: ['Cauda equina with \u201Conly\u201D retention and back pain — do not wait for full saddle numbness.', 'Dexamethasone is for MSCC, not discogenic CES and not for suspected epidural abscess.', 'Epidural abscess can mimic simple sciatica in IVDU/diabetics — ESR/CRP is cheap, MRI is decisive.', 'Myeloma X-rays look normal — escalate to MRI/SPEP if suspicion persists.', 'AAA presenting as back pain in the elderly is a killer misdiagnosis.', 'Bed rest and opioids-first are outdated — NSAIDs plus activity (ACP; Chou JAMA 2023).'],
pearls: [
    "Known cancer with new limb weakness, gait change or bladder/bowel dysfunction needs emergency MSCC coordination and urgent MRI, even if back pain is not dramatic.",
    "For uncomplicated mechanical pain, explain the diagnosis, encourage tolerable normal activity and agree follow-up; new neurological or bladder/bowel symptoms require urgent reassessment.",
    'Most ED back pain is mechanical — the job is the red-flag sweep, not an x-ray for everyone.', 'Cauda equina: emergency MRI, do not wait for a complete saddle-anesthesia picture.', 'Elderly vasculopath with back pain = AAA until the aorta is seen.', 'NSAIDs plus activity beat bed rest and opioids-first (ACP; Chou JAMA 2023).'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — back pain', 'ACP guideline (Annals 2017); NICE NG59 (low back pain)', 'NICE NG234 (2023) metastatic spinal cord compression', 'Chou et al., JAMA 2023 systematic review']
},
{
id: 'red-eye', name: 'Red Eye & Eye Emergencies', icon: '👁️',
tag: 'Vision + pain + halos = ophthalmology tonight.',
overview: 'Red eyes are mostly benign (conjunctivitis), but the vision- or globe-threatening causes — chemical burn, angle-closure glaucoma, keratitis, orbital cellulitis, sudden vision loss — are time-critical. A chemical burn is the one true treat-before-you-assess emergency.',
approach: [
    'Chemical burn: irrigate promptly to physiologic pH; suspected open-globe injury needs immediate ophthalmology-directed care.',
    'Visual acuity in every other red eye.',
    'Pain, halos, or a white spot (especially contact-lens wearers) is ophthalmology tonight.',
    'CRAO is a stroke equivalent — call both pathways.'
],
dontMiss: [
['Chemical burn (alkali worse than acid)', 'critical', 'Immediate copious saline irrigation until conjunctival pH is 7.0–7.4 (often 30+ min / liters). Check pH after, then assess. Do not wait for a full exam.'],
['Acute angle-closure glaucoma', 'critical', 'Painful red eye, halos, mid-dilated fixed pupil, cloudy cornea, vision loss — lower IOP + ophthalmology NOW.'],
['Infectious keratitis (bacterial / herpetic)', 'critical', 'Contact lens + pain + white corneal infiltrate = ulcer; never patch, never start topical steroids, urgent ophthalmology.'],
['Orbital cellulitis', 'critical', 'Proptosis, painful eye movement, fever — CT orbits + IV antibiotics (preseptal is milder).'],
['Endophthalmitis', 'critical', 'Post-surgery/injection severe pain with hypopyon — emergency intraocular therapy.'],
['Central retinal artery occlusion', 'critical', 'Sudden painless profound monocular vision loss; pale retina, cherry-red spot. Treat as a stroke equivalent (AHA) — emergency ophthalmology + stroke pathway. IV tPA evidence is mixed; do not delay the call.'],
['Retinal detachment', 'emergent', 'Curtain over vision, shower of floaters — urgent ophthalmology (hours, not days, if macula is threatened).'],
['Conjunctivitis / subconjunctival hemorrhage', 'common', 'Benign when acuity, pupils, and cornea are normal.']
],
history: [
    "For chemical exposure, establish the agent, concentration, time, prior rinsing and any penetrating/high-pressure mechanism while irrigation is being arranged or continued.",
    'Contact lenses (ulcer risk), trauma, ocular surgery/injections, chemical exposure', 'Pain: deep vs superficial; photophobia; discharge character', 'Vision change: blurring, curtain, floaters, halos around lights', 'Systemic disease: autoimmune (scleritis/uveitis), recent shingles'],
exam: ['Visual acuity in EVERY red eye — with pinhole and correction (except irrigate first in chemical burns)', 'Pupils: swinging-flashlight for afferent defect', 'Fluorescein staining (ulcer, dendrite), chamber depth, cells/flare, hypopyon', 'Everted lids for foreign body (after anesthetic); red reflex', 'Proptosis, painful eye movements, periorbital edema'],
workup: [
['Bedside', [
    "After irrigation normalizes pH, pause for at least five minutes and recheck; rebound suggests retained chemical and requires further assessment/irrigation.",
    "After excluding open-globe injury, evert the lids and inspect the fornices for retained particles; remove debris and recheck pH.",
    'Acuity, fluorescein/slit-lamp examination; tonometry for suspected glaucoma only after excluding open-globe injury', 'Chemical splash: irrigate first, then measure pH until 7.0–7.4']],
['Labs', ['As indicated: CBC/inflammatory markers for orbital cellulitis; ophthalmology-led corneal scraping']],
['Imaging', ['CT orbits for cellulitis, intraocular foreign body, or fracture', 'None needed for simple conjunctivitis; stroke-protocol imaging for CRAO']]
],
redFlags: ['Any loss of visual acuity', 'Moderate-severe pain, photophobia, or halos', 'Contact-lens wearer with pain or a white spot', 'Proptosis, limited/painful movement, fever', 'Abnormal pupil or afferent pupillary defect', 'Chemical splash — immediate irrigation unless open-globe injury is strongly suspected; get urgent ophthalmology help', 'Hypopyon or corneal infiltrate'],
disposition: [
['Discharge', 'Uncomplicated conjunctivitis or subconjunctival hemorrhage with normal acuity, pupils, and cornea — hygiene advice and follow-up.'],
['Urgent ophthalmology (same day)', 'Keratitis, uveitis, retinal-detachment symptoms, hyphema, preseptal cellulitis.'],
['Emergency ophthalmology / admission / stroke pathway', 'Chemical burn (after irrigation), angle-closure glaucoma, endophthalmitis, orbital cellulitis, CRAO.']
],
pitfalls: [
    "A chemical exposure combined with suspected open-globe injury needs immediate ophthalmology-directed management; avoid pressure, lid manipulation or routine irrigation devices over a possibly ruptured globe.",
    'Never patch or give steroids over a possibly herpetic or ulcerated cornea.', 'Chemical burns: delayed irrigation means permanent damage — triage straight to eye-wash and keep going until pH normalizes.', 'Contact lens + painful red eye warrants urgent keratitis assessment. A negative fluorescein examination alone does not exclude early infection; assess infiltrates, acuity and the slit-lamp examination.', 'Skipping visual acuity is the universal red-eye pitfall.', 'Periorbital swelling + fever: test eye movement and proptosis to separate preseptal from orbital.', 'CRAO is a stroke until the workup says otherwise — look for GCA in patients ≥50 y with preceding headache/jaw claudication.'],
pearls: ['Visual acuity in every red eye — after you finish irrigating a chemical burn.', 'Irrigate alkali/acid until conjunctival pH is 7.0–7.4, then examine.', 'Contact lens + pain + a white spot needs urgent keratitis assessment; negative fluorescein alone cannot exclude early infection.', 'CRAO is a stroke equivalent — call ophthalmology and the stroke pathway together.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — ocular emergencies', 'AAO Preferred Practice Patterns (bacterial keratitis, primary angle closure, CRAO)', 'AHA: CRAO as a stroke equivalent; Tintinalli\u2019s 9th ed. — eye emergencies']
},


{
id: 'joint-pain', name: 'Acute Joint Pain', icon: '🦵',
tag: 'A hot swollen joint needs urgent assessment for infection.',
overview: 'A single hot, swollen joint requires urgent assessment for septic arthritis — delay costs cartilage. No single synovial finding excludes infection. Then split the rest: crystal, trauma, degenerative, inflammatory. Multiple joints suggest systemic disease (gout flare, rheumatic, reactive, viral, gonococcal).',
approach: [
    'Urgently assess a hot swollen joint; a negative Gram stain, low cell count or crystals cannot exclude infection.',
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
['Bedside', [
    "If synovial fluid is scarce, prioritize bacterial identification, then cell count/differential, then crystals; coordinate with the laboratory.",
    "A dry tap may reflect needle position rather than absence of infection. Seek image guidance when needed; do not inject saline just to improve culture yield.",
    'Joint aspiration before antibiotics when possible: Gram stain, culture, crystals, cell count with differential', 'POCUS to confirm effusion and guide the tap']],
['Labs', [
    "A normal CRP cannot exclude septic arthritis. Serial CRP can help monitor response but must be interpreted with the examination and microbiology.",
    'CBC, ESR/CRP, blood cultures; uric acid is unreliable in the acute flare', 'Gonococcal NAAT (urine/cervix/throat/rectum as exposed); Lyme serology in endemic regions']],
['Imaging', ['X-ray for fracture, gas, chondrocalcinosis', 'MRI for osteomyelitis; US for effusion and guided aspiration']]
],
redFlags: ['Fever with a hot swollen joint', 'Prosthetic joint involved', 'Immunosuppression, diabetes, or IVDU', 'Inability to bear weight or move the joint', 'Overlying skin breaks or pustules', 'Synovial fluid that is purulent or Gram-stain positive (WBC >50,000/µL supports but does not prove infection)'],
disposition: [
['Discharge', 'Crystal-proven flare responding to NSAIDs/colchicine/steroids, non-septic pattern, functioning follow-up. Never inject intra-articular steroid until infection is excluded.'],
['Admit', 'Septic arthritis on IV antibiotics + washout plan, polyarticular systemic disease, uncertain diagnosis needing serial exams.'],
['Emergency aspiration/washout + ortho', 'Purulent joint, prosthetic infection, hemarthrosis with coagulopathy.']
],
pitfalls: ['Antibiotics before aspiration can sterilize the culture — tap first when safe.', 'Gout and septic arthritis coexist — crystals do not exclude infection.', 'Gonococcal arthritis is often a migratory tenosynovitis with skin lesions and a modest synovial WBC.', 'The immunosuppressed patient with a \u201Cmildly\u201D swollen joint can have a septic one — and a synovial WBC well under 50,000.', 'Elderly gout often strikes the knee or midfoot, not the big toe.', 'Do not tap a prosthetic joint through cellulitis; call ortho.'],
pearls: [
    "Persistent pain, swelling, systemic illness or worsening function despite treatment suggests failure; reassess drainage, cultures and possible adjacent abscess or osteomyelitis with orthopedics.",
    'Aspirate a concerning hot joint before antibiotics when safe; negative Gram stain, low cell count or crystals do not exclude infection. Do not delay antibiotics in sepsis.', 'Crystals do not exclude infection; gout and septic arthritis coexist.', 'Synovial WBC >50,000/µL is suggestive, not diagnostic — gonococcal and immunocompromised joints run lower.', 'Do not tap a prosthesis through cellulitis; that aspiration belongs to orthopedics.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — arthritis & joint infection', 'IDSA guidance on native and prosthetic joint infection', 'EULAR crystal arthritis recommendations; Tintinalli\u2019s 9th ed. — musculoskeletal emergencies']
},
{
id: 'coma', name: 'Coma & Depressed LOC', icon: '😴',
tag: 'Protect, correct the two reversible killers, image.',
overview: 'Coma is failure of both hemispheres or the ascending reticular activating system. Support airway and ventilation, check/treat glucose, and give oxygen for hypoxemia, naloxone for suspected opioid respiratory depression and thiamine when indicated while the exam localizes the lesion (breathing pattern, pupils, brainstem reflexes, motor tone) and imaging defines structure.',
approach: [
    'Airway, glucose, oxygen — naloxone and thiamine as indicated (never delay dextrose).',
    'Pupils, breathing pattern, and brainstem reflexes localize structure vs toxin.',
    'Non-contrast CT for structural causes; EEG if non-convulsive status is possible.',
    'Do not attribute unexplained coma to alcohol alone; check glucose and investigate structural, toxic and metabolic causes.'
],
dontMiss: [
['Hypoglycemia', 'critical', 'Glucose every time — the most treatable cause of coma.'],
['Opioid overdose', 'critical', 'Pinpoint pupils + hypoventilation — titrate naloxone to breathing.'],
['Herniation (uncal / central)', 'critical', 'Blown or unilateral pupil, posturing, Cushing reflex — hypertonic saline/mannitol, neurosurgery.'],
['Massive ICH / SAH / basilar occlusion', 'critical', 'Non-contrast CT immediately; basilar thrombosis can present as coma without lateralizing signs.'],
['Non-convulsive status epilepticus', 'critical', 'Coma with subtle myoclonus — EEG; treat without waiting.'],
['Meningoencephalitis', 'critical', 'Fever or no focus — empiric therapy when suspected.'],
['Wernicke encephalopathy', 'critical', 'Alcohol use/malnutrition — give thiamine with (or immediately after) glucose; never delay dextrose.'],
['Toxic-metabolic (CO, TCA, hypothermia)', 'critical', 'ECG, temperature, anion/osmolar gaps; consider toxins, but preserved pupillary responses do not exclude structural disease.']
],
history: ['EMS/family: speed of onset, preceding symptoms (headache, seizure, fever, chest pain)', 'Access to medications/toxins; alcohol; psychiatric history', 'Trauma — especially falls in the anticoagulated', 'End-organ disease: liver, renal, diabetes, thyroid'],
exam: [
    "Document the examination before and after resuscitation, including sedative/paralytic exposure and any change in pupils or motor asymmetry.",
    'ABCDE; GCS with attention to airway reflexes', 'Pupils: asymmetry or fixed dilation raises structural concern, but toxic/metabolic causes can also alter pupils; preserved reactivity does not exclude a structural lesion', 'Breathing pattern: Cheyne-Stokes, central hyperventilation, apneustic', 'Brainstem reflexes: pupils, corneal and cough; do not perform oculocephalic maneuvers until cervical injury is excluded', 'Motor: tone, symmetry, posturing to noxious stimulus', 'Trauma stigmata; skin for cyanosis, tracks, rash'],
workup: [
['Bedside', ['Glucose immediately; naloxone/thiamine as indicated', 'ECG; VBG/ABG; core temperature']],
['Labs', ['Electrolytes (Na, Ca), renal/hepatic panels, ammonia, lactate, CBC, coagulation', 'Targeted toxicology; TSH; cortisol if endocrine suspicion']],
['Imaging / monitoring', [
    "Sudden unexplained coma or brainstem findings warrants consideration of CTA for basilar occlusion even when noncontrast CT is unrevealing.",
    'Non-contrast head CT first among structural tests', 'EEG for non-convulsive status; LP after imaging when indicated']]
],
redFlags: ['Unequal or fixed-dilated pupils', 'Motor posturing or irregular breathing', 'Falling GCS, seizures, or hyperthermia', 'Hypoglycemia unresponsive to therapy; hypothermia', 'Meningeal signs with rapid progression', 'Anticoagulation with any trauma history'],
disposition: [
['Discharge', 'Rare — only full recovery from a clearly reversible cause with observation and follow-up (e.g., brief hypoglycemia in a reliable setting).'],
['Admit (monitored)', 'Post-ictal or toxic with improving exam and a secured airway plan; correcting metabolic derangements.'],
['ICU / neurosurgery', 'Undifferentiated coma, herniation signs, ICH/SAH, status epilepticus, need for airway protection.']
],
pitfalls: [
    "Failure to awaken after correcting glucose or treating suspected opioid toxicity requires continued investigation; a treatment response does not exclude coexisting disease.",
    'Locked-in syndrome mimics coma — check for vertical eye movements.', 'Small pupils can accompany opioid toxicity or brainstem pathology; pupil size alone cannot determine the cause.', 'An ethanol level does not establish the cause of coma; persistent or unexplained impairment needs further investigation.', 'Hypothermia halts almost everything — rewarm before declaring brainstem reflexes lost.', 'Non-convulsive status hides inside \u201Cpost-ictal\u201D labels.', 'Never delay dextrose for thiamine — give them together.'],
pearls: [
    "Persistent uncertainty after initial CT and metabolic assessment needs a directed plan for MRI, EEG or safe LP, rather than observation under an unconfirmed post-ictal label.",
    'Support airway and ventilation, check glucose, and use oxygen, naloxone and thiamine according to the clinical indication.', 'Basilar artery occlusion can present as coma without lateralizing signs — think CTA/CTP or MRI if CT is unrevealing.', 'The FOUR score captures brainstem findings that GCS misses.', 'Preserved pupillary responses do not exclude a structural cause of coma.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — coma & depressed level of consciousness', 'FOUR score (Wijdicks et al., Ann Neurol 2005)', 'Neurocritical Care Society guidance']
},
{
id: 'pelvic-pain', name: 'Acute Pelvic Pain (Women)', icon: '🩺',
tag: 'Pregnancy status first — then torsion, then the rest.',
overview: 'Acute pelvic pain in women is triaged by pregnancy status and hemodynamic stability. The threats are ectopic pregnancy, ovarian torsion, tubo-ovarian abscess, and hemorrhagic cyst rupture — all imaging-and-surgery decisions made early. Transvaginal ultrasound is the workhorse.',
approach: [
    'Pregnancy test first. Unstable with suspected ruptured ectopic: resuscitate and involve obstetrics for surgery; bedside US must not delay care.',
    'Then torsion: sudden unilateral pain — Doppler is supportive, not exclusive.',
    'Transvaginal US is the workhorse; CT when US is non-diagnostic and pregnancy is excluded.',
    'IVF: an IUP does not exclude heterotopic pregnancy.'
],
dontMiss: [
['Ruptured ectopic pregnancy', 'critical', 'Test for pregnancy when possible. Suspected rupture with instability needs immediate hemorrhage resuscitation and gynecology involvement.', ['ectopic-pregnancy']],
['Ovarian torsion', 'critical', 'Sudden severe unilateral pain ± mass; Doppler US — delay loses the ovary.', ['ovarian-torsion']],
['Tubo-ovarian abscess', 'critical', 'PID with mass or sepsis — admission, IV antibiotics, drainage per response.'],
['Hemorrhagic ruptured ovarian cyst', 'critical', 'Sudden pain with free fluid; watch hemodynamics, especially anticoagulated.'],
['Septic abortion / puerperal infection', 'critical', 'Fever + bleeding + uterine tenderness in pregnancy or postpartum.'],
['Appendicitis / diverticulitis', 'emergent', 'GI mimics — CT when US is non-diagnostic and pregnancy excluded.', ['acute-appendicitis', 'acute-diverticulitis']],
['UTI / kidney stone', 'common', 'Dysuria or flank-to-groin radiation — urinalysis ± CT.'],
['Mittelschmerz / dysmenorrhea / endometriosis', 'common', 'Cyclical patterns with a benign exam.']
],
history: ['LMP, contraception (IUD), fertility treatments (↑torsion/ectopic risk)', 'Pain: sudden vs gradual, unilateral vs central, migration', 'Vaginal bleeding, discharge, fever, dysuria', 'Prior ectopic, PID, pelvic surgery, endometriosis', 'Sexual history and reliability of contraception'],
exam: ['Vitals incl. orthostatics; peritoneal signs', 'Abdomen: rebound, guarding, masses', 'Pelvic: cervical motion tenderness, adnexal mass/tenderness, discharge', 'Quantify any bleeding; volume status'],
workup: [
['Bedside', ['Urine/serum hCG immediately', 'POCUS and transvaginal US interpreted with symptoms and follow-up; an inconclusive scan does not exclude ectopic pregnancy']],
['Labs', [
    "For a stable pregnancy of unknown location, arrange two serum hCG measurements close to 48 hours apart, not earlier, with an early-pregnancy service directing repeat imaging and further review.",
    'Quantitative β-hCG, CBC, type & screen, CRP; urinalysis', 'Cervical cultures / wet mount for PID']],
['Imaging', [
    "Positive hCG with no pregnancy identified on transvaginal US is a pregnancy of unknown location, not proof of a completed miscarriage; ectopic pregnancy remains possible.",
    'Transvaginal US for ectopic, torsion, masses', 'CT when US non-diagnostic and pregnancy excluded; MRI in pregnancy if needed']]
],
redFlags: ['Positive hCG with pain or bleeding — ectopic until excluded', 'Hypotension, syncope, or peritoneal signs', 'Sudden severe unilateral pain (torsion)', 'Fever with adnexal tenderness (TOA)', 'IUD in situ with pain or pregnancy', 'Bleeding at any stage of pregnancy'],
disposition: [
['Discharge', 'Benign/cyclical pain, negative hCG, normal imaging when indicated, reliable follow-up with strict return precautions.'],
['Admit', 'PID/TOA on IV antibiotics, ectopic needing inpatient treatment/observation (selected methotrexate patients can follow a reliable outpatient pathway), hemorrhagic cyst under observation, uncontrolled pain.'],
['Emergency surgery / IR', 'Ruptured ectopic, ovarian torsion, ruptured TOA, unstable hemorrhagic cyst.']
],
pitfalls: [
    "New or worsening symptoms outweigh a previously reassuring hCG trend; reassess immediately rather than waiting for the next scheduled sample.",
    'Ectopic pregnancy can occur without risk factors or abnormal examination. A single hCG cannot locate a pregnancy; interpret symptoms, ultrasound and follow-up together.', 'Preserved Doppler flow does not exclude torsion (dual blood supply).', 'Heterotopic pregnancy in IVF — an IUP does not exclude an ectopic.', 'IUD-associated PID risk is mainly in the first 3 weeks after insertion. Treat PID and reassess at 48–72 h; routine immediate IUD removal is not required (CDC).', 'Don\u2019t assume threatened abortion — image first.'],
pearls: [
    "Before outpatient follow-up of a pregnancy of unknown location, provide written return advice and a 24-hour emergency contact/access plan; confirm who will review results.",
    'Pregnancy test first, always — unstable + positive hCG goes to the OR, not the scanner.', 'Ovarian torsion is a clinical diagnosis; Doppler is supportive, not exclusive.', 'Moderate/large or complex free fluid with positive hCG raises concern for hemoperitoneum; fluid alone does not diagnose ectopic rupture. Instability requires immediate obstetric assessment.', 'IVF patients can have heterotopic pregnancy — seeing an IUP is not enough.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — acute pelvic pain', 'ACOG Practice Bulletins (ectopic pregnancy; PID)', 'Tintinalli\u2019s 9th ed. — gynecologic emergencies']
},
{
id: 'vaginal-bleeding', name: 'Vaginal Bleeding', icon: '🌸',
tag: 'Pregnant or not? Stable or not? Those two answers run the show.',
overview: 'Vaginal bleeding splits cleanly by pregnancy status. In pregnancy: ectopic, miscarriage, molar, placenta previa (avoid digital examination before exclusion), abruption, and postpartum hemorrhage. Outside pregnancy: anovulatory bleeding, fibroids, cervicitis, malignancy — with coagulopathy and massive bleeding managed first.',
approach: [
    'Two questions: pregnant or not, stable or not.',
    'Resuscitate shock first. TXA as soon as PPH is diagnosed and within 3 h of birth (WHO/WOMAN).',
    'In later-pregnancy bleeding with possible placenta previa, avoid digital vaginal examination until ultrasound excludes it.',
    'Anti-D depends on gestation and event: follow current obstetric guidance; it is not routinely required for every pregnancy loss before 12 weeks. Abruption is clinical.'
],
dontMiss: [
['Hemorrhagic shock from any source', 'critical', 'Resuscitate before diagnosing: two IVs, crossmatch. TXA promptly for diagnosed PPH within 3 h of birth (WHO/WOMAN); TXA is also used for selected non-pregnant heavy bleeding.'],
['Ectopic pregnancy', 'critical', 'Bleeding + pain + positive hCG — transvaginal US urgently.', ['ectopic-pregnancy']],
['Placenta previa', 'critical', 'Painless bright-red bleeding in later pregnancy — NO digital vaginal exam; US first.'],
['Placental abruption', 'critical', 'Painful woody uterus, fetal distress — obstetric emergency, deliver.'],
['Postpartum hemorrhage', 'critical', 'Uterine atony > retained tissue > trauma; uterotonics + bimanual compression pathway.'],
['Retained products / molar pregnancy', 'emergent', 'US; molar = preeclampsia-before-20-weeks picture, oncology referral.'],
['Anovulatory bleeding / fibroids / cervicitis', 'common', 'Common non-pregnant causes; measure hemoglobin burden.'],
['Bleeding disorder / anticoagulation', 'common', 'vWD and coagulopathy hide in \u201Cheavy periods\u201D — ask since menarche.']
],
history: [
    "Describe the bleeding pattern, persistent intermenstrual bleeding, pelvic pressure and impact on daily life; pad counts alone do not capture the burden.",
    'Pregnant? LMP, contraception; volume of bleeding (pads/hour, clots, dizziness)', 'Pregnancy stage & prior ultrasounds; trauma (abruption)', 'Postpartum timing (atony vs retained tissue vs infection)', 'Non-pregnant: cycle pattern, intermenstrual or post-coital bleeding, anticoagulants, bleeding since menarche'],
exam: ['Vitals & orthostatics; signs of shock', 'Abdomen: fundal height if pregnant, tenderness, contractions', 'Speculum exam (avoid digital if previa suspected) — source: cervix vs uterine', 'Postpartum: uterine tone, ongoing loss'],
workup: [
['Bedside', ['Urine/serum hCG immediately in all patients of childbearing potential', 'POCUS; pad counting for quantification']],
['Labs', [
    "Consider coagulation-disorder testing when heavy periods began at menarche and personal or family bleeding history is suggestive.",
    'CBC, type & screen/crossmatch, Rh status (anti-D for Rh-negative unsensitized patients per pathway); Kleihauer-Betke only if significant fetomaternal hemorrhage is a question', 'Coagulation ± DIC panel in abruption/PPH; quantitative β-hCG when indicated']],
['Imaging', ['Transvaginal US in pregnancy: IUP vs ectopic, previa, abruption signs', 'US pelvis for non-pregnant structural causes']]
],
redFlags: ['Any bleeding with positive hCG and pain', 'Painless bright-red bleeding in later pregnancy (previa)', 'Painful rigid uterus with fetal distress (abruption)', 'Postpartum bleeding saturating pads rapidly', 'Orthostatic symptoms or hemodynamic instability', 'Bleeding on anticoagulation or with known bleeding disorder'],
disposition: [
['Discharge', 'Non-pregnant, hemodynamically stable, mild anemia with follow-up (gynecology ± iron therapy); threatened miscarriage with viable IUP and reliable care.'],
['Admit', 'Ectopic per criteria, symptomatic miscarriage needing care, moderate bleeding with anemia, anticoagulation reversal issues.'],
['Emergency obstetrics / OR / ICU', 'Placenta previa or abruption in viable pregnancy, postpartum hemorrhage, shock of any source, molar pregnancy.']
],
pitfalls: [
    "Do not routinely order thyroid tests for heavy menstrual bleeding unless other symptoms or signs suggest thyroid disease.",
    'When placenta previa is possible, avoid digital vaginal examination until ultrasound excludes it. A careful speculum examination by an experienced clinician may help identify the bleeding source; coordinate obstetric assessment.', 'A normal early hematocrit reassures falsely — the bleed is ongoing.', 'Anti-D is event- and gestation-specific. ACOG 2024 suggests forgoing routine Rh testing/RhIg for abortion or pregnancy loss before 12 weeks; do not extend this to every ectopic, trauma, or later-pregnancy event. Follow the local obstetric pathway. Kleihauer-Betke quantifies fetomaternal hemorrhage when indicated.', 'Post-coital bleeding in an older patient = cervical cancer screen.', 'Postpartum \u201Clochia\u201D turning bright red with clots is a hemorrhage, not normal.', 'Ultrasound is insensitive for abruption — the diagnosis is clinical (painful woody uterus, fetal distress).'],
pearls: [
    "Unexplained postmenopausal bleeding needs a documented gynecology/endometrial assessment pathway even when bleeding has stopped; use current local cancer-referral criteria, including HRT context.",
    'Two questions run the show: pregnant or not, stable or not.', 'Painless bright-red third-trimester bleeding = previa until US says otherwise — no digital exam.', 'TXA for diagnosed PPH reduces death from bleeding when given promptly within 3 hours of birth (WHO/WOMAN).', 'PALM-COEIN organizes non-pregnant AUB; coagulopathy (including vWD) hides in \u201Cheavy periods since menarche.\u201D'],
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
['Testicular torsion', 'critical', 'Sudden pain, high-riding transverse testis, absent cremasteric reflex — urology/OR immediately; US must not delay exploration when suspicion is high.', ['testicular-torsion']],
['Fournier gangrene', 'critical', 'Perineal pain, crepitus, sepsis, diabetes — broad antibiotics + debridement.'],
['Incarcerated / strangulated inguinal hernia', 'critical', 'Irreducible tender groin mass with obstruction signs — surgery.'],
['Traumatic rupture / testicular hematoma', 'critical', 'Scrotal trauma — US; rupture needs repair within hours.'],
['Epididymo-orchitis', 'common', 'Gradual pain, fever, dysuria; Prehn sign is unreliable — choose antibiotics by STI/enteric exposure and cultures, not age alone.'],
['Torsion of the appendix testis', 'common', 'Prepubertal, \u201Cblue-dot\u201D sign; conservative care per urology.'],
['Hydrocele / varicocele', 'common', 'Chronic swelling, transillumination or bag-of-worms feel.']
],
history: ['Onset: abrupt severe (torsion) vs gradual (infection)', 'Nausea/vomiting with torsion is classic', 'Trauma; prior self-resolving episodes (intermittent torsion)', 'Sexual activity / urethral symptoms (epididymitis)', 'Diabetes and immunosuppression (Fournier)'],
exam: ['Testis position & lie: high-riding, horizontal = torsion', 'Cremasteric reflex — absent in torsion', 'Point tenderness: upper pole (appendix testis), epididymis vs diffuse testis', 'Groin exam for hernia; perineal crepitus and odor', 'Prehn sign — supportive only, unreliable'],
workup: [
['Bedside', ['Immediate urology consult when torsion is suspected — imaging must not delay the OR', 'POCUS Doppler: flow absence; whirlpool sign of the cord']],
['Labs', [
    "When epididymitis is suspected, obtain urine NAAT for gonorrhea/chlamydia and a bacterial urine culture; exposure history and susceptibility results guide treatment.",
    'Urinalysis & cultures (infection vs torsion overlap)', 'CBC, CRP; lactate/sepsis screen for Fournier; glucose']],
['Imaging', ['Doppler US when diagnosis uncertain and OR not imminent', 'CT may define Fournier extent when stable; imaging must not delay debridement in a convincing presentation']]
],
redFlags: ['Sudden severe testicular pain with vomiting', 'High-riding or transverse testis', 'Absent cremasteric reflex', 'Perineal pain with crepitus or sepsis (Fournier)', 'Irreducible groin mass', 'Scrotal trauma with persistent pain (rupture)'],
disposition: [
['Discharge', 'Epididymitis on antibiotics selected for STI versus enteric risk, cultures and local resistance, appendix-testis torsion with NSAIDs per urology, resolved mechanical pain with follow-up.'],
['Admit', 'Epididymo-orchitis needing IV therapy, Fournier post-debridement, monitored equivocal cases.'],
['Emergency surgery', 'Testicular torsion (immediate exploration), Fournier debridement, strangulated hernia, testicular rupture.']
],
pitfalls: [
    "Ultrasound may not distinguish partial torsion from epididymitis; persistent clinical concern still needs urgent urologic review.",
    'A negative US does not exclude torsion when the story fits — explore.', 'Recurrent self-resolving pain = intermittent torsion — needs elective fixation.', 'Epididymitis in an older diabetic can coexist with torsion.', 'Fournier pain precedes skin changes — examine for deep tenderness and crepitus.', 'Delaying surgery for CT in suspected torsion is the classic litigation case.', 'Salvage falls after ~6 h but later exploration can still save a testis — do not withhold surgery because \u201Cit has been too long.\u201D'],
pearls: [
    "If epididymitis is not improving within 72 hours, reassess the diagnosis and treatment; persistent swelling after treatment needs evaluation for abscess, infarction or tumor.",
    "For suspected or confirmed STI-related epididymitis, arrange partner evaluation and HIV/syphilis testing; advise abstinence until both partners are treated and symptoms resolve.",
    'High-riding, transverse testis + absent cremasteric reflex = OR now, not Doppler first.', 'Nausea/vomiting with acute scrotal pain is torsion until proven otherwise.', 'Prehn sign is unreliable — do not use it to rule torsion in or out.', 'Fournier is a clinical diagnosis; skin findings lag the pain and sepsis.'],
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
['Convulsive status epilepticus', 'critical', '≥5 min continuous or ≥2 seizures without recovery. IM midazolam or IV lorazepam first (AES 2016 / RAMPART). Then levetiracetam 60 mg/kg (max 4.5 g), valproate 40 mg/kg (max 3 g), or fosphenytoin 20 mg PE/kg (max 1,500 mg PE) — ESETT 2019 showed equivalent efficacy (~47%).'],
['Eclampsia', 'critical', 'Seizure in pregnancy or ≤6 weeks postpartum — magnesium sulfate, not a conventional AED as first-line; deliver.'],
['Hypoglycemia / hyponatremia / isoniazid', 'critical', 'Glucose every time. Severe hyponatremia: careful 3% saline. INH: pyridoxine in gram-for-gram equivalent.'],
['ICH / SAH / CNS infection', 'critical', 'First seizure with fever, headache, anticoagulation, or incomplete recovery — CT ± LP, antimicrobials if meningitis is possible.'],
['Non-convulsive status epilepticus', 'critical', 'Prolonged post-ictal state or coma with subtle twitching — EEG; treat empirically if high suspicion.'],
['Eclampsia mimics / PRES / TTP', 'emergent', 'Visual change, hypertension, thrombocytopenia — the seizure is the siren, not the diagnosis.'],
['Alcohol withdrawal seizure', 'common', 'Usually brief, within 48 h of stopping; still exclude other causes the first time. Benzodiazepines treat the withdrawal, not a new AED.'],
['Unprovoked first seizure / known epilepsy breakthrough', 'common', 'Back to baseline, normal exam: neuro follow-up. Breakthrough: levels, infection, missed doses, alcohol.']
],
history: [
    "Obtain an eyewitness account or available video, including onset and recovery; use it to distinguish epileptic seizures from syncope and other mimics.",
    'Duration, recovery of consciousness, number of events, tongue bite, incontinence', 'Pregnancy / postpartum; fever, HIV, immunosuppression, travel', 'AED list and adherence; alcohol/benzodiazepine withdrawal; INH, tramadol, bupropion', 'Head trauma, anticoagulation, prior epilepsy, developmental history'],
exam: ['Ongoing convulsive activity vs post-ictal vs unresponsive (non-convulsive)', 'Glucose, SpO₂, temperature; pupil and focal neuro findings', 'Meningismus, rash, trauma from the fall', 'Blood pressure (eclampsia, PRES, ICH)'],
workup: [
['Bedside', ['Glucose immediately; airway and pulse oximetry', 'ECG (QT, ischemia, TCA); core temperature']],
['Labs', ['Na, Ca, Mg, glucose, CBC, renal/hepatic panels, AED levels if relevant', 'hCG; CK after prolonged convulsions; toxicology as indicated']],
['Imaging / EEG', [
    "A normal routine EEG does not exclude epilepsy. EEG supports diagnosis and classification; urgent EEG for persistent impaired consciousness addresses a different question.",
    "Do not routinely repeat CT after a typical seizure in established epilepsy when recovery and examination are as expected and no additional concern is present.",
    'Non-contrast CT for first seizure with incomplete recovery, focal signs, trauma, anticoagulation, HIV, or age >40–50 without a clear provoked cause', 'LP when safe if CNS infection is possible; CT first only when indicated, and never delay empiric antimicrobials', 'EEG for suspected non-convulsive status']]
],
redFlags: ['Seizure ≥5 minutes or no return to baseline', 'Pregnancy or recent postpartum', 'Fever, meningismus, or immunocompromise', 'Focal deficit, trauma, or anticoagulation', 'Status not responding to a benzodiazepine', 'Infantile spasm or neonatal seizure (different pathway)'],
disposition: [
['Discharge', 'Returned to baseline after a typical event in known epilepsy, or a first unprovoked seizure with a normal exam and no red flags — driving counseling, close neurology follow-up, safety-net advice.'],
['Admit', 'Prolonged post-ictal state, first seizure with an unclear workup, withdrawal with ongoing risk, infection under treatment, social/safety concerns.'],
['ICU / RSI / EEG', 'Established or refractory status, eclampsia, ICH, need for airway protection or continuous EEG.']
],
pitfalls: ['Under-dosing benzodiazepines is the most common treatable error in status.', 'Valproate is contraindicated in pregnancy and in some mitochondrial disease — choose levetiracetam or fosphenytoin.', 'Do not start a daily AED after a single unprovoked seizure solely because it happened in the ED — shared decision with neurology (ILAE).', 'Psychogenic non-epileptic seizures occur (~10% in ESETT) — still treat until you are sure; then stop stacking AEDs.', 'A \u201Cpost-ictal\u201D patient who is not waking up may be in non-convulsive status.'],
pearls: [
    "After a first suspected seizure, arrange urgent specialist assessment (NICE: within two weeks), with first-aid and safety advice, local driving guidance, and instructions for recurrence while awaiting review.",
    'Status starts at 5 minutes — do not wait for 20.', 'After benzos, ESETT: levetiracetam, valproate, and fosphenytoin are equivalent; pick one at a full dose and move on.', 'Eclampsia is magnesium and delivery, not phenytoin-first.', 'Glucose, sodium, pregnancy, and fever are the four checks that change the drug.'],
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
['ACS presenting as throat pain', 'emergent', 'Especially women, diabetics, and the elderly — ECG if the story is exertional or accompanied by diaphoresis/dyspnea.', ['acute-coronary-syndrome']],
['Viral pharyngitis / GAS', 'common', 'Centor/McIsaac to gate testing; treat confirmed GAS. Most do not need antibiotics.']
],
history: ['Tempo: hours (epiglottitis, angioedema) vs days (PTA, viral)', 'Drooling, trismus, voice change, inability to swallow saliva', 'Dental pain or recent extraction (Ludwig)', 'Immunization (Hib, diphtheria); travel; ACE-inhibitor use', 'Sexual history (gonococcal pharyngitis); immunosuppression'],
exam: ['Work of breathing and preferred posture — do not lie the unstable patient down', 'Floor of mouth, tongue elevation, neck crepitus or swelling', 'Tonsillar asymmetry, uvular deviation, trismus', 'IJ tenderness; lung findings (septic emboli)', 'Skin: rash of scarlet fever, membrane of diphtheria'],
workup: [
['Bedside', ['Airway assessment first; flexible nasopharyngoscopy by a skilled operator if stable and epiglottitis is possible', 'Do not force a complete oropharyngeal exam in stridor/drooling']],
['Labs', [
    "Clear viral features such as cough, rhinorrhea, hoarseness or oral ulcers usually make GAS testing unnecessary; this does not replace assessment for airway or deep-space disease.",
    "A negative rapid antigen test in an adult does not routinely need a backup culture; children aged three years or older do need backup culture, with an explicit result-review/contact process.",
    'Use a validated clinical score to guide GAS testing in patients aged ≥3 years; high-risk exposure/complications may warrant testing despite a low score. Back up a negative RADT with culture in symptomatic children aged ≥3 years; follow assay-specific policy for NAAT', 'CBC, blood cultures if toxic; throat NAAT for gonorrhea when indicated']],
['Imaging', ['CT neck with contrast for deep-space abscess once the airway is secure', 'Lateral neck x-ray only in a stable patient if it will not delay airway care']]
],
redFlags: ['Drooling, tripoding, stridor, or sitting bolt upright', 'Trismus or a muffled / hot-potato voice', 'Floor-of-mouth swelling or an elevated tongue', 'Toxic appearance with delayed neck pain after pharyngitis (Lemierre)', 'Rapidly progressive swelling after ACE-inhibitor or allergen', 'Inability to swallow saliva'],
disposition: [
['Discharge', 'Viral or confirmed GAS pharyngitis with a safe airway, taking fluids, reliable follow-up. Analgesia; antibiotics only for GAS or a drained PTA on an oral regimen per local protocol.'],
['Admit', 'PTA after drainage if toxic or unable to take fluids, severe pharyngitis in the immunocompromised, recovering deep-space infection on IV antibiotics.'],
['Airway team / ICU / OT', 'Epiglottitis, Ludwig, RPA with airway threat, Lemierre with septic emboli, angioedema of the tongue/floor of mouth.']
],
pitfalls: [
    "Tonsillar exudate alone does not distinguish GAS from viral infection; confirm GAS when indicated rather than prescribing solely from appearance.",
    'A tongue-blade exam in epiglottitis can precipitate complete obstruction.', 'Centor scores do not exclude epiglottitis, PTA, or Lemierre.', 'Adult epiglottitis is often missed because we still think of it as a pediatric Hib disease.', 'Needle aspiration of a \u201CPTA\u201D that is actually a carotid aneurysm or an epiglottic problem is disastrous — confirm anatomy.', 'Exertional throat/chest discomfort can be ACS; a normal first ECG does not exclude it. Use clinical assessment and a validated troponin pathway.'],
pearls: [
    "For confirmed GAS, explain treatment adherence, hand hygiene and return to school/work only when afebrile and at least 12–24 hours after appropriate antibiotics, following local policy.",
    'Tripod + drool = airway team, not a throat swab.', 'Ludwig is a floor-of-mouth disease — look up from below the mandible.', 'Pharyngitis that \u201Cgot better\u201D then the patient became septic with neck pain = Lemierre until CT/US of the IJ is negative.', 'Centor gates GAS testing; it is not a license to skip the airway exam.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — sore throat', 'IDSA 2025 GAS pharyngitis risk-assessment update; CDC GAS testing guidance; Centor/McIsaac', 'Tintinalli\u2019s 9th ed. — deep neck infections']
},
{
id: 'hemoptysis', name: 'Hemoptysis', icon: '🫁',
tag: 'Protect the good lung; find whether this is massive.',
overview: 'Hemoptysis is blood from below the glottis. First separate true hemoptysis from hematemesis and nasopharyngeal bleeding. Massive hemoptysis is defined variably (often ≥100 mL/h or ≥300–500 mL/24 h, or any volume that threatens the airway) — the practical definition is airway compromise or abnormal gas exchange. Place the bleeding lung down, call IR and pulmonology, and resuscitate.',
approach: [
    'Confirm true hemoptysis (not hematemesis or a nosebleed).',
    'Massive is about the airway and gas exchange, not a milliliter cutoff.',
    'Bleeding lung down; call bronchoscopy and IR.',
    'Stable small-volume still needs a cancer/TB/PE plan in the right host.'
],
dontMiss: [
['Massive / airway-threatening hemoptysis', 'critical', 'If the bleeding side is known, place it dependent; support oxygenation and urgently involve airway/bronchoscopy experts for suction and lung isolation when needed. Reverse coagulopathy and arrange bronchial-artery embolization.'],
['Diffuse alveolar hemorrhage', 'critical', 'Falling hemoglobin, dropping saturations, bilateral infiltrates — capillaritis, cocaine, anticoagulants; bronchoscopy, immunosuppression per cause.'],
['Pulmonary embolism', 'critical', 'Hemoptysis can be the presenting feature; do not assume \u201Cbronchitis\u201D in a patient with VTE risks.', ['pulmonary-embolism']],
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
['Imaging / procedures', [
    "For significant active bleeding in a stable patient, discuss a hemoptysis-specific contrast CTA protocol with radiology; bronchial/nonbronchial systemic vessels may need mapping for embolization.",
    'CXR first; CT chest (CTPA if PE is on the list) is the localizing study in stable patients', 'Bronchoscopy for ongoing airway bleeding; bronchial-artery embolization for massive bleeding']]
],
redFlags: ['Any volume with hypoxia, shock, or inability to protect the airway', 'Rapidly falling hemoglobin or bilateral infiltrates (DAH)', 'TB risks with hemoptysis', 'Anticoagulation with more than streaks', 'Known aspergilloma, cavity, or cancer', 'Hemoptysis plus VTE risks'],
disposition: [
['Discharge', 'Streaks in a well patient with a clear CXR, no cancer/TB/VTE red flags, and arranged follow-up (including outpatient CT in smokers ≥40 y with a first episode).'],
['Admit', 'Recurrent or moderate-volume bleeding, need for further imaging, infection on IV therapy, anticoagulation management.'],
['ICU / IR / bronchoscopy', 'Airway-threatening or massive hemoptysis, DAH, unstable PE, need for embolization or intubation.']
],
pitfalls: [
    "CTPA targets pulmonary arteries; it is not automatically interchangeable with a protocol designed to map the systemic bleeding supply.",
    'Intubating and laying the bleeding lung up drowns the good lung — bleeding side down.', 'A normal CXR does not exclude a significant source — CT is the localizer in the stable patient.', 'Do not use nebulized TXA as the only plan for massive bleeding — it is an adjunct, not a substitute for IR/airway.', 'Hematemesis and posterior epistaxis are repeatedly mislabeled as hemoptysis — look in the mouth and the nose.', 'Cancer until proven otherwise in a smoker with new hemoptysis, even if the volume is small.'],
pearls: [
    "If airway control or clot extraction is urgent, bedside bronchoscopy may take priority over transport for CT; coordinate airway, respiratory and IR teams.",
    "Embolization controls bleeding but does not treat every underlying cause; arrange investigation and treatment of infection, bronchiectasis or malignancy and a plan for recurrence.",
    'Massive is about gas exchange and airway, not a milliliter cutoff.', 'Bleeding lung down, good lung up.', 'Bronchial-artery embolization is the intervention of choice for most massive non-traumatic hemoptysis.', 'Always ask: is this actually hematemesis or a nosebleed?'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — hemoptysis', 'BTS / ACCP hemoptysis statements; bronchial artery embolization series', 'Tintinalli\u2019s 9th ed. — pulmonary hemorrhage']
},
{
id: 'shock', name: 'Shock', icon: '💔',
tag: 'Name the pump, the tank, the pipes, or the obstruction.',
overview: 'Shock is tissue hypoperfusion, not a blood-pressure number. Classify early with history, exam, and a RUSH/POCUS exam: hypovolemic, distributive, cardiogenic, obstructive — mixed pictures are the rule in the ED. Integrate pressure, serial perfusion and lactate with the cause; individualize fluids and watch for congestion.',
approach: [
    'Shock is hypoperfusion, not a blood-pressure number.',
    'Assign the box with RUSH/POCUS: empty tank, broken pump, leaky pipes, obstruction.',
    'Individualize fluids by cause, perfusion and congestion; avoid repeated unassessed boluses. In septic shock, use balanced crystalloid with dynamic reassessment and norepinephrine if hypotension persists.',
    'The drug follows the box: blood, epinephrine, norepinephrine, needle, or OR.'
],
dontMiss: [
['Obstructive shock (tamponade, tension PTX, massive PE)', 'critical', 'Use clinical assessment and rapid POCUS when available: effusion/chamber collapse or RV strain may support the cause. Absent lung sliding alone does not diagnose PTX. Treat tension PTX immediately without waiting for imaging; arrange tamponade drainage or PE reperfusion as indicated. Fluids require individualized reassessment.', ['cardiac-tamponade', 'tension-pneumothorax', 'pulmonary-embolism']],
['Cardiogenic shock', 'critical', 'Wet, cool, JVP up, B-lines, poor LV — cautious fluids, vasopressors (norepinephrine), urgent revascularization if ACS (2025 ACC/AHA ACS).'],
['Septic / distributive shock', 'critical', 'Antibiotics within 1 h. Use balanced crystalloid for initial resuscitation, then dynamic reassessment to guide further fluid. Start norepinephrine if MAP remains low (SSC 2026).'],
['Neurogenic shock', 'critical', 'Hypotension with warm dry skin after spinal injury — fluids then norepinephrine; do not treat as hypovolemia alone.'],
['Hemorrhagic / hypovolemic shock', 'critical', 'Blood, source control, TXA in trauma/PPH per pathway; do not dilute with liters of crystalloid in exsanguination.'],
['Anaphylactic shock', 'critical', 'IM epinephrine anterolateral thigh immediately, then fluids and aerosolized epinephrine if airway edema — do not wait for a rash.', ['anaphylaxis']],
['Adrenal crisis / occult bleeding / mixed', 'emergent', 'Steroid-dependent, meningococcemia, GI bleed without hematemesis, ruptured AAA — treat while you look.'],
['Compensated / occult shock', 'common', 'Normal BP with lactate, delayed cap refill, or unexplained tachypnea — especially in the young and pregnant.']
],
history: ['Tempo: sudden (PE, tamponade, anaphylaxis, arrhythmia) vs hours (sepsis, bleed)', 'Chest pain, dyspnea, fever, allergen, trauma, GI bleeding, pregnancy', 'Heart failure, anticoagulation, adrenal replacement, immunocompromise', 'Drugs: beta-blockers, calcium-channel blockers, antihypertensives'],
exam: ['Skin: warm vs cool; mottling; urticaria', 'JVP, heart sounds (muffled, new murmur), lung sliding and B-lines', 'Pulse pressure, cap refill, mental status, urine output', 'Abdomen and pelvis: AAA, pregnancy, peritonism, occult blood', 'Anaphylaxis: stridor, wheeze, swelling — or none of these'],
workup: [
['Bedside', [
    "For septic shock, assess dynamic fluid response when feasible; a static IVC image alone is insufficient.",
    'RUSH/POCUS: pump, tank, pipes, sliding, DVT', 'ECG, SpO₂, glucose, lactate', 'Immediate decompression for clinically suspected tension PTX in extremis; ultrasound-guided tamponade drainage by a trained operator when indicated']],
['Labs', ['Lactate, VBG, CBC, coagulation, troponin, cultures before antibiotics when they will not delay them', 'Type & crossmatch; cortisol/TSH if endocrine shock is possible', 'Pregnancy test in patients of childbearing potential']],
['Imaging', ['CXR; CT only in the stabilized patient', 'CTPA, CTA aorta, or FAST as the leading diagnosis dictates']]
],
redFlags: ['Hypotension with cool skin or rising lactate', 'Muffled heart sounds or absent lung sliding', 'Anaphylaxis features after an exposure', 'GI bleeding, AAA, or positive hCG with shock', 'Chest pain with shock (ACS, dissection, PE, tamponade)', 'Fever with neutropenia or asplenia'],
disposition: [
['Discharge', 'Almost never from undifferentiated shock. Occasional fully reversed anaphylaxis after a full observation window with a prescription for epinephrine autoinjectors and allergy follow-up.'],
['Admit (HDU)', 'Resolved occult hypoperfusion under monitoring, treated infection with improving lactate, compensated cardiogenic states pending further testing.'],
['ICU / OR / cath lab / IR', 'Any shock needing vasopressors, airway, massive transfusion, reperfusion, or source-control surgery.']
],
pitfalls: [
    "Do not give fluids solely to normalize lactate; reassess perfusion, congestion and other causes of elevation.",
    'A \u201Cnormal\u201D blood pressure does not exclude shock — use lactate, mentation, and skin.', 'Fluids are not interchangeable across shock phenotypes: cardiogenic and obstructive shock need immediate cause-directed care.', 'Epinephrine in anaphylaxis is IM first, not an IV drip you wait to mix.', 'Pressors without a diagnosis: look at the RV and the pericardium before the third liter.', 'Beta-blocked and the elderly decompensate without tachycardia.'],
pearls: [
    "Start needed septic-shock vasopressors through a suitable monitored peripheral IV rather than waiting for central access; follow local safeguards.",
    "After each intervention, reassess mentation, capillary refill, urine output, pressure and respiratory status; reconsider mixed shock if the response is unexpected.",
    'Four boxes: empty tank, broken pump, leaky pipes, obstruction. POCUS can support the working diagnosis; mixed shock and nonspecific findings require reassessment.', 'Norepinephrine is the first-line vasopressor for septic shock (SSC).', 'Blood for blood loss; epinephrine for anaphylaxis; needle for tension; OR for the ruptured AAA — the drug follows the box.', 'Use serial lactate and capillary refill alongside pressure and other perfusion measures, not as replacements for the overall assessment.'],
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
['Bowel obstruction / volvulus / perforation', 'critical', 'Bilious or feculent vomiting, distension, prior surgery, hernia — CT. Sigmoid/cecal volvulus is time-critical ischemia.', ['small-bowel-obstruction', 'perforated-peptic-ulcer']],
['ACS / inferior MI', 'critical', 'Isolated vomiting, especially in women, elderly, and diabetics — ECG before the antiemetic is blamed for the \u201Ccure.\u201D', ['acute-coronary-syndrome']],
['Raised ICP / SAH / posterior stroke', 'critical', 'Headache, diplopia, ataxia, no abdominal findings — CT/MRI. Projectile vomiting is a clue, not a rule.'],
['DKA / HHS / adrenal crisis / hyponatremia', 'critical', 'Glucose and electrolytes in every unexplained case. Steroid-dependent patients get stress-dose steroids.'],
['Pregnancy complications (hyperemesis vs ectopic vs molar)', 'critical', 'hCG first; assess oral intake, weight loss, hydration and electrolytes in hyperemesis. Ketonuria does not grade severity; blood ketones/acidosis are relevant if DKA is suspected. Ectopic if pain + bleeding.', ['ectopic-pregnancy']],
['Acute glaucoma / testicular or ovarian torsion', 'emergent', 'The referred-pain mimics — eye and groin exams exist for a reason.', ['ovarian-torsion', 'testicular-torsion']],
['Cannabinoid hyperemesis / cyclic vomiting / gastritis', 'common', 'Hot-water bathing is a cannabinoid clue; capsaicin and haloperidol are options. Still exclude the killers once.']
],
history: [
    "Ask nonjudgmentally about regular cannabis use, cyclic episodes and hot bathing; these clues support suspected CHS but do not confirm it.",
    'Duration, bilious vs food vs blood, ability to keep down liquids', 'Pain: before vomiting (surgical) vs after (medical/gastroenteritis)', 'Headache, visual change, chest pain, pregnancy possibility', 'Diabetes, adrenal disease, cannabis, chemotherapy, prior abdominal surgery, hernias'],
exam: ['Vitals including glucose; orthostatics', 'Abdomen: distension, hernias, peritoneal signs, succussion splash', 'Neuro: pupils, papilledema, ataxia, neck stiffness', 'Eye (glaucoma), groin (torsion), pregnancy'],
workup: [
['Bedside', ['Glucose, hCG, ECG', 'POCUS: AAA, free fluid, IUP, B-lines']],
['Labs', [
    "In suspected cannabinoid hyperemesis, actively assess hypoglycemia, renal injury, electrolyte losses and acid-base disturbance rather than treating nausea alone.",
    'Electrolytes including Na, K, Mg; VBG/ketones if DKA possible; lipase', 'LFTs, CBC, renal panel; cortisol if adrenal crisis is possible']],
['Imaging', ['CT abdomen/pelvis with contrast for obstruction/ischemia when suspected', 'CT/MRI head for raised-ICP features; AXR is insensitive for obstruction']]
],
redFlags: ['Bilious or feculent vomiting, or vomiting with peritonitis', 'Chest pain, dyspnea, or diaphoresis with vomiting', 'Headache, diplopia, or ataxia', 'Glucose high or very low; steroid-dependent patient', 'Positive hCG with pain or bleeding', 'Intractable vomiting with severe electrolyte derangement'],
disposition: [
['Discharge', 'Gastroenteritis or cannabinoid hyperemesis after successful oral challenge, normal vitals and labs when indicated, reliable follow-up. Driving advice if sedating antiemetics were given.'],
['Admit', 'Obstruction without ischemia, DKA on a protocol, hyperemesis with ongoing dehydration, electrolyte disturbance or inability to tolerate oral therapy, inability to tolerate oral intake in a high-risk host.'],
['OR / ICU / cath lab', 'Perforation, ischemic bowel/volvulus, ACS, raised ICP, adrenal crisis, airway from aspiration.']
],
pitfalls: [
    "Before haloperidol for refractory suspected CHS, check ECG/QTc and correct electrolyte abnormalities; avoid it with prolonged QTc, Parkinson disease or Lewy body dementia and monitor for dystonia.",
    'Treating with ondansetron and discharging a missed inferior MI or SBO is a classic error.', 'AXR misses a large fraction of obstruction — CT is the test when suspicion is real.', 'Cannabinoid hyperemesis is a diagnosis of exclusion in the first presentations.', 'Ondansetron prolongs QT — look at the ECG in the already-sick.', 'Children with bilious vomiting have malrotation/volvulus until proven otherwise.'],
pearls: [
    "Explain that sustained cannabis abstinence prevents CHS recurrence; provide written information and practical cessation support rather than a symptom-only discharge plan.",
    'Pain before vomiting leans surgical; vomiting before pain leans medical — not a law, a nudge.', 'ECG and glucose are cheaper than a missed STEMI or DKA.', 'Bilious vomiting in a neonate or young child is surgical until imaging says otherwise.', 'Steroid-dependent + vomiting = stress-dose steroids, do not wait for a cortisol.'],
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
['Mesenteric ischemia', 'critical', 'Pain out of proportion ± bloody diarrhea in AF or vasculopathy — CTA, not stool studies first.', ['acute-mesenteric-ischemia']],
['Toxic megacolon / fulminant C. difficile / IBD', 'critical', 'Fever, shock, distension, immunosuppression or recent antibiotics — AXR/CT, surgical consult, oral/NG vancomycin plus IV metronidazole for fulminant CDI; consider rectal vancomycin with ileus (IDSA/SHEA).'],
['STEC / HUS', 'critical', 'Bloody diarrhea after undercooked beef or outbreaks, little or no fever — do not give antibiotics or antimotility agents; watch creatinine, hemolysis, platelets.'],
['Cholera / severe secretory dehydration', 'critical', 'Rice-water stool, travel; WHO-ORS or IV; antibiotics as an adjunct once volume is restored.'],
['Typhoid / invasive bacterial colitis / amoebiasis', 'emergent', 'Fever + blood + travel; cultures; treat per destination and severity. Avoid empiric fluoroquinolones where resistance is high.'],
['Adrenal crisis / thyrotoxicosis / overflow from obstruction', 'emergent', 'Not every loose stool is gastroenteritis — look at the whole patient.'],
['Viral gastroenteritis / traveler\u2019s diarrhea', 'common', 'ORS, loperamide in non-bloody non-febrile adults; azithromycin for severe traveler\u2019s per CDC.']
],
history: ['Volume, blood, fever, duration (>2 weeks changes the list), restaurant/outbreak, travel, antibiotics, PPI, hospital exposure', 'Pain out of proportion, AF, vascular disease', 'Immunosuppression, IBD, pregnancy', 'Sick contacts, water, undercooked meat'],
exam: ['Volume status: orthostatics, mucous membranes, cap refill, mental status', 'Abdomen: peritonitis, distension, masses', 'Fever; rash (typhoid, HSP); joints and uveitis (IBD, reactive)', 'PR exam for blood, overflow, mass'],
workup: [
['Bedside', ['Glucose, orthostatics, pregnancy test when appropriate', 'POCUS for AAA/free fluid if ischemic or surgical features']],
['Labs', [
    "Use stool testing selectively when fever, blood/mucus, severe abdominal tenderness or sepsis makes a result clinically useful; interpret multiplex detections in context, not as proof that every detected organism needs treatment.",
    'CBC, creatinine, electrolytes; hemolysis labs if HUS possible (LDH, smear, platelets)', 'Stool: C. difficile when antibiotics/healthcare; culture/PCR multiplex per severity and travel; STEC testing if bloody', 'Blood cultures if febrile and toxic']],
['Imaging', ['CT angiography if mesenteric ischemia is possible', 'CT/AXR if obstruction, megacolon, or perforation is possible — skip imaging in straightforward viral illness']]
],
redFlags: ['Pain out of proportion, AF, or vasculopathy', 'Bloody diarrhea with little fever after ground beef (STEC)', 'Recent antibiotics or hospitalization (C. difficile)', 'Shock, severe abdominal distension, or immunosuppression', 'Fever in a returned traveler', 'Anuria, petechiae, or rising creatinine after a diarrheal prodrome (HUS)'],
disposition: [
['Discharge', 'Non-bloody, well-hydrated after oral challenge, no host red flags — ORS, hygiene, return precautions. Avoid antimotility agents if bloody or febrile.'],
['Admit', 'Inability to maintain volume, severe electrolyte derangement, CDI needing inpatient care, inflammatory diarrhea needing IV therapy, HUS under observation, high-risk host.'],
['ICU / surgery / IR', 'Shock, toxic megacolon, mesenteric ischemia, fulminant CDI, severe HUS.']
],
pitfalls: ['Antibiotics for STEC increase HUS risk — do not treat empirically \u201Cjust in case.\u201D', 'Metronidazole is no longer first-line for CDI (IDSA/SHEA 2021): fidaxomicin preferred, vancomycin acceptable.', 'Loperamide in bloody or febrile diarrhea can precipitate megacolon.', '\u201CGastroenteritis\u201D in a 75-year-old with AF is mesenteric ischemia until the pain is explained.', 'HUS presents after the diarrhea is improving — check the smear and the creatinine.'],
pearls: [
    "Use reduced-osmolarity oral rehydration solution for mild-to-moderate dehydration, replacing ongoing stool losses; shock, ileus, altered mentation or failed oral rehydration needs IV therapy.",
    "Resume an age-appropriate usual diet during or after rehydration; continue breastfeeding rather than withholding feeds.",
    "Persistent diarrhea after travel warrants a broader assessment, including parasites; reconsider medications, IBD and postinfectious disease if symptoms continue.",
    'Volume first, then inflammatory vs non-inflammatory, then the host.', 'No antibiotics, no loperamide, if STEC is on the list.', 'Fidaxomicin (or vancomycin) for CDI — metronidazole only if those are unavailable and disease is non-severe.', 'Bloody diarrhea + pain out of proportion = CTA, not a stool PCR first.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — diarrhea', 'IDSA/SHEA 2021 focused update: C. difficile (fidaxomicin preferred)', 'IDSA infectious diarrhea 2017; CDC traveler\u2019s diarrhea; STEC/HUS literature']
},
{
id: 'jaundice', name: 'Jaundice', icon: '🟡',
tag: 'Obstructive, hepatocellular, or hemolytic — and is the liver failing?',
overview: 'Jaundice is conjugated or unconjugated, then extrahepatic obstruction vs hepatocellular injury vs hemolysis. The ED questions that change disposition: is this cholangitis, acute liver failure (encephalopathy + INR), massive hemolysis, or acetaminophen? Charcot\u2019s triad is insensitive — fever and jaundice still need a biliary tree look.',
approach: [
    'Three buckets: obstructed duct, injured hepatocyte, lysed red cell.',
    'Fever + jaundice is cholangitis until the biliary tree is seen — Charcot’s triad is insensitive.',
    'Acute liver injury with INR ≥1.5 and encephalopathy, usually without established cirrhosis, suggests acute liver failure; call transplant early.',
    'Acetaminophen is the reversible cause you must not miss.'
],
dontMiss: [
['Ascending cholangitis', 'critical', 'Fever + jaundice ± RUQ pain (Charcot); shock/confusion (Reynolds). Tokyo criteria. Resuscitate, cultures, broad antibiotics, urgent biliary drainage (ERCP).', ['acute-cholangitis']],
['Acute liver failure', 'critical', 'INR ≥1.5 plus encephalopathy in acute liver injury without established cirrhosis (distinguish acute-on-chronic failure) — transplant pathway, NAC if acetaminophen or even if etiology is unclear in many protocols, glucose, ICP precautions.'],
['Acetaminophen (and other toxin) hepatitis', 'critical', 'A treatable cause — obtain acetaminophen level, AST/ALT and INR; start NAC promptly for suspected toxic exposure with delayed testing or liver injury and use the poison-center pathway for unknown timing or repeated ingestion.'],
['Ascending cholangitis mimics / hepatic abscess / sepsis', 'critical', 'Jaundice in the septic patient is not \u201Cjust Gilbert.\u201D'],
['Massive hemolysis (malaria, G6PD, transfusion, sickle, TTP/DIC)', 'emergent', 'Unconjugated bilirubin, falling hemoglobin, LDH, smear; treat the cause.'],
['Acute viral hepatitis / alcoholic hepatitis / choledocholithiasis without cholangitis', 'emergent', 'Image the duct; score alcoholic hepatitis (MELD/MDF) for steroids per protocol once infection is excluded.'],
['Gilbert syndrome / isolated unconjugated / pancreatic head mass', 'common', 'Gilbert is benign (isolated unconjugated, normal everything else). Painless progressive jaundice with weight loss needs outpatient staging but is rarely an ED crash.']
],
history: [
    "Reconcile all medicines, over-the-counter products, herbs and supplements, including recent starts and repeated acetaminophen exposure; ask relatives if cognition is impaired.",
    'Tempo: hours–days (obstruction, toxin, hemolysis) vs weeks (viral, malignant)', 'Fever, pale stools, dark urine, pruritus (obstructive)', 'Acetaminophen, alcohol, new drugs (amoxicillin-clavulanate, isoniazid), mushrooms', 'Travel, injections, sexual contacts, pregnancy (HELLP, AFLP)', 'Prior gallstones, biliary stents, hemolytic history'],
exam: ['Encephalopathy and asterixis (ALF)', 'Fever, RUQ tenderness, peritoneal signs, Murphy sign', 'Stigmata of chronic liver disease vs an acute unmarked patient', 'Splenomegaly (hemolysis, chronic liver); petechiae (DIC, TTP)', 'Volume status and occult GI bleeding'],
workup: [
['Bedside', ['Glucose (ALF patients crash); POCUS for CBD dilatation, stones, abscess']],
['Labs', [
    "In suspected acute liver failure, follow serial INR, glucose, renal function and neurological findings; discuss evolving organ dysfunction with the liver/transplant team early.",
    'Fractionated bilirubin, ALT/AST, ALP/GGT, INR, albumin, glucose, CBC, smear/LDH/haptoglobin if hemolysis', 'Acetaminophen level in nearly every acute hepatocellular pattern', 'Blood cultures if febrile; viral serologies; pregnancy test']],
['Imaging / procedures', ['RUQ US first for obstruction', 'CT/MRCP if US is inconclusive; ERCP for cholangitis drainage', 'Avoid unnecessary sedation in ALF — ICP risk']]
],
redFlags: ['Fever with jaundice (cholangitis until excluded)', 'Any encephalopathy or INR ≥1.5 in acute liver injury', 'Hypoglycemia, shock, or GI bleeding', 'Acetaminophen exposure, mushrooms, or new drugs', 'Pale stools and dark urine with duct dilatation', 'Pregnancy with jaundice (HELLP/AFLP)'],
disposition: [
['Discharge', 'Isolated Gilbert-pattern unconjugated bilirubin with normal exam and labs; mild choledocholithiasis without cholangitis and reliable early GI follow-up per local pathway.'],
['Admit', 'Acute hepatitis, choledocholithiasis awaiting ERCP, alcoholic hepatitis under infection screen, hemolysis needing treatment.'],
['ICU / transplant / ERCP now', 'Cholangitis with shock, acute liver failure, acetaminophen with rising INR, HELLP/AFLP.']
],
pitfalls: [
    "Falling aminotransferases do not prove recovery if INR, bilirubin or encephalopathy is worsening; reassess the whole trajectory.",
    'Charcot\u2019s triad is absent in a large fraction of cholangitis — do not wait for it.', 'A \u201Cnormal\u201D acetaminophen level late after ingestion does not exclude toxicity — treat on timing and enzymes/INR.', 'Giving sedation for MRI in ALF can mask and worsen intracranial hypertension.', 'Isolated unconjugated bilirubin with a normal CBC and enzymes is Gilbert until you force it to be something else.', 'Painless jaundice is cancer until staged — but it is rarely the reason they die tonight; cholangitis and ALF are.'],
pearls: [
    "In cholangitis too unstable for extensive endoscopic therapy, drainage alone may be the initial source-control procedure; coordinate the definitive stone-treatment plan after stabilization.",
    'Three buckets: obstructed duct, injured hepatocyte, lysed red cell. ALP vs ALT vs LDH/smear assigns the bucket.', 'Cholangitis needs source control (ERCP), not antibiotics alone.', 'ALF: acute liver injury with INR ≥1.5 and encephalopathy, usually without pre-existing cirrhosis. Call transplant early.', 'Acetaminophen is the reversible cause you will not forgive yourself for missing.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — jaundice', 'Tokyo Guidelines 2018 for acute cholangitis', 'EASL / AASLD acute liver failure guidance; 2023 US/Canada acetaminophen consensus']
},
{
id: 'cyanosis', name: 'Cyanosis', icon: '🔵',
tag: 'Blue from lung, heart, or the blood itself?',
overview: 'Visible cyanosis classically occurs at approximately 5 g/dL of deoxyhemoglobin in capillary blood; this is an approximate teaching value, not a fixed diagnostic threshold. Peripheral cyanosis can reflect local stasis. The trap is that dyshemoglobinemias may cause cyanosis with a normal PaO₂; significant methemoglobinemia often drives SpO₂ toward 85%, while sulfhemoglobinemia readings vary. Chocolate-brown blood that does not redden on oxygen is the bedside clue. Treat the airway and the cause — methylene blue for methemoglobin (not in G6PD).',
approach: [
    'Central (tongue/lips) vs peripheral (nail beds only).',
    'Unexpected SpO₂ or discordance with PaO₂: check the signal and request measured co-oximetry when dyshemoglobinemia is possible.',
    'Chocolate-brown blood or a saturation gap raises suspicion for dyshemoglobinemia; obtain co-oximetry and urgent toxicology advice. Antidotes depend on symptoms, measured MetHb and contraindications.',
    'A substantial right-to-left shunt may respond poorly to oxygen; support oxygenation and obtain urgent cause-directed assessment.'
],
dontMiss: [
['Methemoglobinemia', 'critical', 'A saturation gap and chocolate blood suggest MetHb; confirm by co-oximetry. For significant symptoms or levels typically 20–30%, use methylene blue 1–2 mg/kg IV per toxicology protocol. Avoid in G6PD deficiency; check serotonergic interactions. Severe cases need urgent specialist alternatives.'],
['Hypoxemic respiratory failure (PE, pneumonia, shunt, high altitude)', 'critical', 'Support hypoxemia urgently; response to oxygen alone cannot establish shunt versus V/Q mismatch. Investigate and treat the underlying cause.'],
['Cyanotic congenital heart disease / Eisenmenger', 'critical', 'The crying infant or the adult with repaired CHD — do not over-oxygenate some mixing lesions; call cardiology. Urgent pediatric/cardiology assessment and echocardiography; do not delay escalation for a bedside hyperoxia test.'],
['Sulfhemoglobinemia', 'emergent', 'Similar picture to methemoglobin but does not correct with methylene blue — phenazopyridine, sulfonamides; supportive care.'],
['Carbon monoxide is NOT cyanosis', 'emergent', 'CO skin color is unreliable; cherry-red appearance is uncommon; SpO₂ is falsely normal — CO-oximetry. Listed here because it is the classic mis-association.'],
['Peripheral cyanosis / Raynaud / cold', 'common', 'Warm the patient; central mucous membranes should be pink. If they are not, it is not \u201Cjust cold.\u201D']
],
history: [
    "Ask about heaters, generators, fires and other people with similar symptoms; a shared exposure can reveal CO poisoning even without visible cyanosis.",
    'Onset with drugs/anesthetics (benzocaine spray), well-water nitrites, dapsone', 'Lung or cardiac disease, altitude, diving', 'Known congenital heart disease', 'Cold exposure vs mucus-membrane involvement'],
exam: [
    "Check probe position, waveform/signal quality and peripheral perfusion; cold skin or poor circulation can make the displayed saturation unreliable.",
    'Central (lips, tongue) vs peripheral (hands, feet only)', 'Work of breathing, lung findings, cardiac murmurs, clubbing (chronic)', 'Blood color on the gauze: chocolate-brown vs red'],
workup: [
['Bedside', ['SpO₂, ABG with co-oximetry (MetHb, COHb) — a standard ABG PaO₂ will miss methemoglobin', 'Urgent neonatal/cardiology assessment and echocardiography for suspected critical CHD']],
['Labs', ['CBC (polycythemia, anemia changes the cyanosis threshold), co-oximetry panel', 'Check G6PD history and serotonergic medications before methylene blue when feasible; consult toxicology urgently for treatment selection and alternatives']],
['Imaging', ['CXR, CTPA as the lung/PE picture dictates', 'Echo for shunt and pulmonary hypertension']]
],
redFlags: ['Cyanosis of the tongue/lips that does not correct with oxygen', 'SpO₂ near 85% with a normal PaO₂ (saturation gap)', 'Infant with mixing-lesion physiology', 'Recent topical anesthetic, nitrites, or dapsone', 'Shock with cyanosis'],
disposition: [
['Discharge', 'Clear peripheral cyanosis from cold that reverses with warming; known stable chronic cyanotic heart disease at baseline with clinic follow-up.'],
['Admit', 'New unexplained central cyanosis, treated methemoglobinemia under observation, pneumonia/PE on therapy.'],
['ICU', 'Refractory hypoxemia, methemoglobin with shock or level typically >30% (or symptomatic at lower levels), mixing lesions, massive PE.']
],
pitfalls: [
    "Pulse oximeters may overestimate oxygenation with darker skin pigmentation; investigate discordance with symptoms and examination rather than accepting a reassuring number alone.",
    'Trusting SpO₂ and PaO₂ without co-oximetry misses methemoglobin and CO.', 'Methylene blue is contraindicated in G6PD deficiency and can worsen hemolysis.', 'Anemic patients may not look blue until they are profoundly hypoxemic (not enough hemoglobin to make 5 g/dL deoxy).', 'Do not assume \u201Cperipheral\u201D until you have seen the tongue.', 'A substantial right-to-left shunt may respond poorly to oxygen; support oxygenation and obtain urgent cause-directed assessment.'],
pearls: [
    "Blood CO-oximetry can use venous or arterial samples; interpret COHb with exposure timing, prior oxygen and clinical severity because a delayed low value may underestimate the exposure.",
    'A gap between pulse oximetry and calculated saturation suggests dyshemoglobinemia or measurement error; co-oximetry distinguishes the cause.', 'Chocolate blood and an SpO₂ near 85% suggest methemoglobinemia; confirm by co-oximetry rather than treating the color alone.', 'Central vs peripheral is mucous membranes vs nail beds.', 'CO is not a cyanosis diagnosis — do not skip co-oximetry because the patient is not blue.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — cyanosis', 'Goldfrank\u2019s / ACMT methemoglobinemia guidance', 'CPS critical CHD detection guidance; EHA/EuroBloodNet methemoglobinemia consensus (2021)']
},
{
id: 'overdose', name: 'Poisoning & Overdose', icon: '☠️',
tag: 'Support the airway, find the toxidrome, call the antidote.',
overview: 'The poisoned patient is treated by pattern: ABCDE first, then toxidrome recognition (vitals, pupils, skin, mental status), focused antidotes, and decontamination when appropriate. Acetaminophen (paracetamol) deserves special respect — treat on probability and timing, not on early symptoms.',
approach: [
    'ABCDE first; never delay glucose.',
    'Name the toxidrome: vitals, pupils, skin, bowel, temperature.',
    'Acetaminophen and salicylate in every deliberate overdose; NAC on timing and probability, not symptoms.',
    'Call the poison center early for mixed, delayed-release, or unknown ingestions.'
],
dontMiss: [
['Acetaminophen (paracetamol)', 'critical', 'Silent early killer. Plot a level drawn ≥4 h post-ingestion on the Rumack-Matthew nomogram (150 µg/mL at 4 h); start NAC empirically if results will not return before 8 h. Unknown timing or repeated supratherapeutic ingestion (>24 h) uses serum concentration + AST/ALT rather than the nomogram. Massive ingestions (≥30 g or above the high-risk line) need toxicology input; continue NAC until clinical and lab stopping criteria are met (US/Canada 2023 consensus and ACMT 2026 stopping guidance).'],
['Opioids', 'critical', 'Pinpoint pupils + respiratory depression → titrate naloxone to ventilation, not wakefulness.'],
['Tricyclic antidepressants / sodium-channel blockers', 'critical', 'In suspected TCA toxicity, QRS widening beyond 100 ms, ventricular arrhythmia or hypotension calls for prompt bicarbonate and toxicology input.'],
['Salicylates', 'critical', 'Tinnitus, hyperventilation, mixed acid-base picture — alkalinize serum/urine, prepare for hemodialysis.'],
['Carbon monoxide', 'critical', 'Whole household, headache, normal SpO₂ — CO-oximetry, high-flow O₂ ± hyperbaric per criteria.'],
['Organophosphates / nerve agents', 'critical', 'SLUDGE, pinpoint pupils — atropine (lots) + pralidoxime; protect staff.'],
['Sympathomimetics / serotonin syndrome', 'emergent', 'Hyperthermia + agitation + clonus — benzodiazepines, active cooling. Avoid physical restraint as the only strategy.'],
['Toxic alcohols (methanol / ethylene glycol) / alcohol withdrawal', 'emergent', 'Anion-gap acidosis, visual change (methanol) — fomepizole, dialysis planning.']
],
history: ['What, when, how much, why (suicidal vs accidental vs recreational)', 'Co-ingestants — always ask; ethanol and polypharmacy dominate', 'Empty containers, notes, access to others\u2019 medications; extended-release products', 'Chronic medications and occupational exposures'],
exam: ['ABCDE with airway priority; GCS and pupils', 'Vital-sign fingerprint: sympathomimetic vs cholinergic vs sedative-hypnotic vs anticholinergic vs opioid', 'Skin: sweating, dry (anticholinergic), needle tracks', 'Odor: bitter almond, garlic (organophosphate), acetone', 'Seizure activity, temperature (hyperthermia = emergency)'],
workup: [
['Bedside', ['Glucose (never delay), ECG (QRS/QT), SpO₂ + CO-oximetry when relevant', 'Activated charcoal within ~1 h for selected agents if the airway is protected; later for anticholinergics/delayed-release — call poison center']],
['Labs', ['Acetaminophen and salicylate levels in all deliberate overdoses (and when history is incomplete)', 'ABG/VBG, electrolytes, anion and osmolar gap, lactate, glucose', 'LFTs (late for acetaminophen), INR, CK for rhabdo']],
['Imaging / antidotes', ['CXR for aspiration; CT if trauma/fall', 'Naloxone, NAC, sodium bicarbonate, fomepizole, atropine + pralidoxime, high-dose insulin for CCB/BB — know kit location and call poison center']]
],
redFlags: ['Falling GCS or failing airway reflexes', 'QRS widening or new arrhythmia', 'Seizure, hyperthermia, or severe agitation', 'Metabolic acidosis or rising lactate', 'Hypotension unresponsive to fluids', 'Acetaminophen presentation that will miss the 8 h NAC window if you wait for a level'],
disposition: [
['Discharge', 'Awake, below-treatment acetaminophen level on a timed 4 h sample (single acute ingestion), completed observation window for the agent, and completed psychosocial assessment and an aftercare plan when self-harm is involved.'],
['Admit (monitored bed)', 'NAC in progress, delayed-release or staggered ingestions, short-acting agents under observation, self-harm safety planning.'],
['ICU', 'Intubated/airway-compromised, pressors, seizures, hyperthermia, hemodialysis (salicylates, methanol, ethylene glycol, lithium), severe TCA cardiotoxicity.']
],
pitfalls: [
    "After naloxone response, recurrent respiratory depression remains possible. Observation depends on the opioid, formulation and clinical course; a brief improvement is not discharge clearance.",
    'A declining GCS in a \u201Cstable\u201D overdose precedes the crash — reassess continuously.', 'Do not plot a pre-4-hour level: the acute nomogram applies to a reliable ingestion history spanning <24 h, including multiple doses (timed from the first dose); extended-release or anticholinergic/opioid co-ingestions may need a 4–6 h repeat level.', 'Do not give flumazenil in undifferentiated, mixed, or chronic benzodiazepine overdose (seizures, withdrawal). A limited role remains for iatrogenic, benzodiazepine-naive procedural sedation (AHA 2023 toxicology update).', 'QRS widening with hypotension in suspected sodium-channel blockade warrants bicarbonate, resuscitation and poison-center input.', 'Never delay dextrose for thiamine.', 'Call the poison center early for high-risk, unknown, or multi-agent ingestions.'],
pearls: [
    "Before discharge after opioid overdose, reassess consciousness, vital signs and ventilation, and ensure low risk of recurrence; long-acting exposures or recurrent depression need longer monitored care.",
    "Offer take-home naloxone with recognition and response training where available, and link survivors to treatment for opioid use disorder.",
    "After intentional self-poisoning, complete psychosocial assessment and a collaborative aftercare/safety plan before discharge; medical stabilization and mental-health care should proceed together.",
    'Toxidrome first: vitals, pupils, skin, bowel sounds, temperature.', 'Early symptoms do not reliably predict acetaminophen toxicity. Check the concentration and interpret it with the ingestion timeline.', 'Naloxone is titrated to ventilation, not to a GCS of 15.', 'Reassess QRS and perfusion after bicarbonate. Follow pH and sodium before repeat dosing.'],
doses: [
    ['Acetaminophen (paracetamol) poisoning — acetylcysteine', ['IV NAC (21-h regimen): 150 mg/kg over 60 min, then 50 mg/kg over 4 h, then 100 mg/kg over 16 h', 'IV NAC (SNAP where adopted locally): 100 mg/kg over 2 h, then 200 mg/kg over 10 h. Reassess before stopping and extend treatment according to the protocol and toxicology advice', 'Oral NAC: 140 mg/kg loading dose followed by 70 mg/kg every 4 h in the traditional regimen. Use toxicology guidance for treatment duration', 'Before stopping IV NAC, confirm all ACMT 2026 criteria: acetaminophen <10 µg/mL, AST/ALT at baseline or down 25–50% from peak, INR <2, and improving prognostic markers. Continue and consult toxicology if these are not met', 'Use the nomogram only for a reliably timed acute ingestion. If a potentially toxic acute ingestion is suspected and results would delay NAC beyond 8 h, begin treatment while awaiting the level. For unknown timing or repeated ingestion, use the appropriate toxicology pathway']],
    ['Other high-yield antidotes', ['Opioid: naloxone 0.04–0.4 mg IV (0.4 mg IM/IN), titrate to respiration; repeat or infuse', 'Benzodiazepine: flumazenil is generally avoided (seizure risk in mixed overdose)', 'Beta-blocker: high-dose glucagon 3–10 mg IV, then infusion; add high-dose insulin/euglycaemia', 'Calcium-channel blocker: calcium chloride 10% 10–20 mL (or gluconate 30–60 mL) IV, then high-dose insulin/glucose', 'Life-threatening TCA sodium-channel blockade: sodium bicarbonate 1–2 mEq/kg IV initially. Guide further treatment by ECG, perfusion, pH and sodium with toxicology. Avoid pH above 7.55 or sodium above 155 mEq/L', 'Methanol/ethylene glycol: fomepizole (or ethanol) + folic acid/thiamine/pyridoxine + dialysis', 'Salicylate: sodium bicarbonate infusion to alkalinise urine; haemodialysis for severe toxicity', 'Iron: deferoxamine 15 mg/kg/h IV', 'Digoxin: digoxin-specific antibody fragments (Fab) for life-threatening toxicity']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — toxicology', 'Dart RC et al. Management of acetaminophen poisoning in the US and Canada: a consensus statement. JAMA Netw Open 2023', 'RCEM/NPIS 2023 SNAP NAC regimen (UK default)', 'AHA 2023 focused update: cardiac arrest or life-threatening toxicity due to poisoning', 'Goldfrank\u2019s Toxicologic Emergencies']
},
{
id: 'pediatric-fever', name: 'Pediatric Fever', icon: '🧒',
tag: 'Age decides the workup; appearance decides the urgency.',
overview: 'Fever in a child is screened by three questions: How old? Immunized? Well-appearing? Any ill-appearing child and all febrile neonates 0–7 days require a full sepsis evaluation and empiric parenteral antibiotics. For well-appearing term infants 8–60 days, the 2021 AAP guideline stratifies care into 8–21, 22–28, and 29–60 day pathways. Always hunt for occult UTI and take seriously the child who \u201Cjust doesn\u2019t look right.\u201D',
approach: [
    'Three questions: How old? Immunized? Well-appearing? (Judge appearance between fever spikes.)',
    'Ill-appearing at any age, or a febrile neonate 0–7 days: urgent sepsis assessment and empiric antibiotics. Obtain urine/blood cultures and CSF when indicated and safe; do not delay stabilization or antibiotics for LP.',
    'Well-appearing term infants 8–60 days: follow the AAP 2021 age-stratified pathway (8–21 d, 22–28 d, 29–60 d).',
    'Hunt the hidden source — catheter/SPA urine in young children; consider Kawasaki disease when fever lasts ≥5 days.'
],
dontMiss: [
['Neonatal / young-infant sepsis', 'critical', 'Ill-appearing at any age or 0–7 days = urine, blood, LP, and parenteral antibiotics. Well-appearing AAP 2021 bands: 8–21 d (full workup + LP + parenteral antibiotics); 22–28 d (urine, blood, inflammatory markers [IMs], and LP if any IM is abnormal); 29–60 d (LP may be omitted if well-appearing with normal IMs).'],
['Meningitis / bacteremia', 'critical', 'Toxic appearance, petechiae, bulging fontanelle — antibiotics and LP pathway.'],
['UTI (hidden source)', 'critical', 'Especially girls <24 months and uncircumcised boys <12 months — catheterized specimen (or SPA); bag urine is a screen only.'],
['Kawasaki disease', 'critical', '≥5 days of fever + ≥4 of: bilateral nonexudative conjunctivitis, rash, mucositis, extremity changes, cervical nodes — or incomplete Kawasaki with labs/echo. Do not wait for day 5 when the clinical picture is convincing; seek pediatric/cardiology assessment (AHA 2024).'],
['HSV in the young infant', 'critical', 'Vesicles, seizures, CSF RBC/pleocytosis, hepatitis in the neonate — empiric acyclovir.'],
['Intussusception', 'emergent', 'Colicky pain, red-currant stool, drawing-up legs — US then air/contrast enema. Fever is not required.'],
['Bronchiolitis / croup / viral URIs', 'common', 'Supportive care; know the deterioration signs (apnea in young infants).'],
['Post-vaccination fever', 'common', 'Recent immunization does not exclude bacterial infection. Infants immunized within 48 h are outside the AAP 8–60-day algorithm: use age, examination and the local infant pathway; do not default to comfort care.']
],
history: [
    "Ask what worries the caregiver most, whether this illness differs from previous episodes, and whether they have sought advice repeatedly.",
    "A documented fever at home still matters in a young infant who is afebrile on arrival; apply the age-appropriate pathway rather than dismissing the history.",
    'Exact age in days, gestational age, immunization status, day-care/sick contacts', 'Temperature measured how/where? Antipyretics given when?', 'Appearance between fevers: feeding, activity, consolability', 'Specific symptoms: cough, vomiting, diarrhea, rash, reduced wet diapers', 'Maternal risks in neonates (GBS, prolonged rupture, maternal fever, HSV)'],
exam: ['Assess appearance and perfusion immediately and repeatedly; do not wait for a fever-free interval', 'Vitals with age-adjusted norms; capillary refill', 'Full undressed exam: rashes, fontanelle, ears, throat, chest', 'Hydration: mucous membranes, tears, urine output', 'Localizing signs: limp, ear pull, drooling + tripod (croup/epiglottitis)'],
workup: [
['Bedside', ['Rectal temperature in infants; urine collection (catheter or SPA <2 y when a culture is needed)', 'POCUS/lung US for pneumonia/effusion in trained hands']],
['Labs (age-gated, AAP 2021 for well-appearing 8–60 d)', ['8–21 days: UA/culture, blood culture, LP ± IMs; empiric parenteral antibiotics', '22–28 days: UA/culture, blood culture, IMs (PCT, ANC, CRP); LP if IM abnormal', '29–60 days: UA/culture, blood culture, IMs; LP optional if IMs normal and well-appearing', '61–90 days: use a dedicated young-infant pathway; do not apply the AAP 8–60-day algorithm or assume the child is >3 months. Older children: clinical risk assessment and targeted urine/testing']],
['Imaging', ['CXR if respiratory signs; US for intussusception suspicion (then air enema); echo if Kawasaki']]
],
redFlags: ['Any fever ≥38°C in an infant ≤21 days, or ill appearance at any age', 'Toxic appearance, inconsolability, lethargy', 'Petechial/purpuric rash or bulging fontanelle', 'Grunting, retractions, apnea, or cyanosis', 'Unable to feed or reduced wet diapers', 'Fever >5 days (think Kawasaki, including incomplete)'],
disposition: [
['Discharge', 'Older well-appearing child after age-appropriate assessment. Selected term 29–60-day infants with reassuring IMs/urine assessment may go home under the full AAP/local pathway, reliable caregivers and arranged reassessment within 24 h; a positive UA may qualify for outpatient UTI treatment in selected cases.'],
['Admit', '8–21-day-old infants on empiric antibiotics; 22–28-day-olds pending cultures; UTI needing IV therapy; bronchiolitis with feeding or respiratory distress; uncertain appearance.'],
['ICU / urgent therapy', 'Meningitis/septic shock, severe complications of Kawasaki/intussusception, or neonatal HSV with organ dysfunction. IVIG or uncomplicated intussusception reduction alone does not mandate ICU.']
],
pitfalls: ['AAP 2021 excludes ill-appearing, premature (<37 wk), or immunocompromised infants, neonates 0–7 days, focal bacterial infections, clinical bronchiolitis, and immunization within 48 h.', 'Antipyretic response does not distinguish viral from bacterial illness — reassess appearance repeatedly without waiting for defervescence.', 'Immunization status changes the risk of occult bacteremia in older infants — document it.', 'Fever without source in a young infant is a workup, not a diagnosis.', 'Rectal temperatures in neonates; axillary/tympanic under-read in the young.', 'Incomplete Kawasaki (fever + 2–3 criteria with inflammatory labs) is easy to miss and still needs echo/IVIG consideration.'],
pearls: [
    "Use antipyretics for distress, not simply to normalize temperature; they do not prevent febrile seizures.",
    "Give caregivers written and verbal return advice for worsening appearance, breathing, hydration or a nonblanching rash, and specify how to obtain reassessment.",
    'Age in days, immunizations, and appearance decide the workup — in that order.', 'AAP 2021 well-appearing term infants: 8–21 d full sepsis workup; 22–28 d LP if IMs elevated; 29–60 d may omit LP when IMs are normal.', 'Urine is the most common hidden bacterial source in the young febrile infant.', 'Suspect Kawasaki with persistent fever and mucocutaneous signs; incomplete presentations need the laboratory/echo pathway.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — pediatric fever', 'AAP 2021 CPG: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days Old', 'NICE NG143 Fever in under 5s', 'AHA 2024 Kawasaki disease scientific statement']
},
{
id: 'suicidal', name: 'Agitation & Suicidal Ideation', icon: '🧑‍⚕️',
tag: 'Medical first — then safety, then psychiatry.',
overview: 'Acute agitation is a medical presentation until glucose, oxygen, temperature, trauma, and toxidrome are addressed — hypoxia, hypoglycemia, encephalitis, serotonin syndrome, sympathomimetics, and withdrawal kill before a psychiatric label is safe. Self-harm thought still deserves a direct, non-judgmental ask (asking does not plant the idea). Safety (means, environment, observation) and then disposition against local mental-health law.',
approach: [
    'Glucose, SpO₂, temperature, and a toxidrome exam first — agitation is medical until those are done.',
    'Then safety: means, environment, 1:1 observation — no gaps for imaging or the toilet.',
    'Ask directly about suicide. Asking does not plant the idea.',
    'Acetaminophen and salicylate in every intentional overdose. Disposition is a written safety plan or admission — document who they leave with.'
],
dontMiss: [
['Active suicidal intent with a plan and access to means', 'critical', 'Constant observation now; remove means; do not leave alone for imaging, the toilet, or a smoke break.'],
['Recent attempt', 'critical', 'Medical stabilization first (acetaminophen/salicylate levels in every intentional overdose). The repeat-attempt window is highest in the following weeks to months, and after psychiatric discharge.'],
['Agitation from a medical cause', 'critical', 'Hypoxia, hypoglycemia, encephalitis, serotonin syndrome, sympathomimetics, DTs, head injury, thyrotoxicosis — treat these before a psychiatric label. Verbal de-escalation, then medication; restraint only per protocol with monitoring.'],
['Agitation with violence risk', 'critical', 'Safety of staff and patient; medical workup proceeds in parallel, not after the patient is \u201Cmedically cleared\u201D as a checkbox.'],
['Adolescent disclosure', 'emergent', 'Screen every young person (ASQ); explain confidentiality limits before the interview.'],
['Depression / anxiety / psychosis without acute intent', 'common', 'Treat, ask about suicidality in every psychiatric presentation, and arrange close follow-up.']
],
history: ['Ideation: passive (wish to be dead) vs active (plan, intent, preparation, rehearsal)', 'Plan specificity and access to means (firearms, medications, heights, ligatures)', 'Prior attempts — the strongest single clinical predictor', 'Substances, recent losses, recent discharge from psychiatric care (high-risk window)', 'Protective factors: reasons for living, dependents, engaged care, future orientation', 'Epidemiologic amplifiers (older age, male sex, isolation, access to firearms) inform risk but are not a substitute for the interview'],
exam: ['Medical clearance: vitals, glucose, targeted tox, trauma from attempts — clearance is not a psych screen', 'Mental status: orientation, psychosis, mood, hopelessness, command hallucinations', 'Signs of intoxication/withdrawal that alter risk and capacity', 'Agitation level and environmental safety scan'],
workup: [
['Bedside', [
    "Begin psychosocial assessment alongside physical treatment after self-harm; do not wait for medical treatment to finish.",
    'Glucose, SpO₂; breath alcohol when relevant', 'Environment: remove ligatures/sharps; 1:1 observation for high risk']],
['Labs', ['Acetaminophen and salicylate in all intentional overdoses and when history is incomplete', 'Targeted toxicology; TSH, electrolytes when a medical cause is possible']],
['Screening tools', ['C-SSRS/ASQ can structure screening and the interview; do not use scores or low/medium/high risk categories to predict suicide or determine discharge. Arrange individualized psychosocial assessment and safety planning']]
],
redFlags: ['Stated intent with available means', 'Attempt within the last days to week', 'Psychotic symptoms or command hallucinations', 'Intoxication with ongoing access to means', 'Discharge from psychiatric care in the past month', 'Inability to engage in a safety plan, or no safe person to go home with'],
disposition: [
['Discharge', 'Individual psychosocial assessment supports outpatient care; agree means restriction, a written safety plan, suitable support and timely aftercare. Absence of stated intent or a low screening score alone cannot establish suitability. Document the agreed support and contacts.'],
['Psychiatric admission when indicated, with concurrent medical care', 'Active ideation with plan, attempt survivors, high risk with insufficient supports — per local mental-health law (voluntary/involuntary).'],
['Emergency psychiatric hold + security', 'Imminent danger to self/others, agitation requiring restraint protocols, refusal of care with impaired capacity.']
],
pitfalls: [
    "Alcohol levels alone should not delay psychosocial assessment. If the patient cannot participate, maintain safety and review regularly until assessment is possible.",
    'Asking about suicide does not increase risk — it opens the door.', 'Apparent calm after an attempt can signal a decision, not relief.', 'Medical clearance is not a psych-screen substitute — delirium and toxins masquerade as psychiatric illness.', 'Observation gaps (imaging, toilets, smoking areas) are when patients elope or harm themselves.', 'Document risk, protective factors, means restriction, capacity, and who the patient goes home with.', 'Do not use sex or age as a checkbox that replaces the interview — they are epidemiologic context, not disposition rules.'],
pearls: [
    "Build a collaborative safety plan covering warning signs, coping strategies, supportive contacts and reducing access to lethal means; involve carers when appropriate.",
    "After self-harm, agree who provides aftercare and how to access urgent help; ongoing safety concerns require initial aftercare within 48 hours of psychosocial assessment (NICE).",
    'Agitation is medical first: glucose, oxygen, temperature, toxidrome — then psychiatry.', 'Ask directly. Asking does not plant the idea.', 'Acetaminophen and salicylate in every intentional overdose.', 'The highest-risk window is the days after an attempt and the month after psychiatric discharge.'],
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
['Posterior communicating artery aneurysm (CN III)', 'critical', 'Painful pupil-involving third-nerve palsy (down-and-out, ptosis, blown pupil) — CTA/MRA now, neurosurgery. Pupil sparing does not exclude an aneurysm. Obtain urgent specialist assessment and vascular imaging for every new acquired CN III palsy rather than relying on the pupil rule.'],
['Brainstem stroke / INO (internuclear ophthalmoplegia)', 'critical', 'Sudden diplopia with ataxia, dysarthria, or crossed findings — posterior-circulation pathway, MRI-DWI. INO (impaired adduction + contralateral nystagmus) is MLF until proven otherwise.'],
['Giant cell arteritis', 'critical', 'Age ≥50, new headache, jaw claudication, diplopia or amaurosis — start glucocorticoids immediately to protect the other eye; ESR/CRP can be normal.'],
['Myasthenic crisis', 'critical', 'Fatigable binocular diplopia and ptosis, worse late in the day; pupils spared. Watch NIF/VC; avoid triggering antibiotics.'],
['Cavernous sinus thrombosis / orbital apex', 'critical', 'Diplopia + proptosis, chemosis, fever or CN V1 pain — CT/MR venography, antibiotics if septic, anticoagulation if atraumatic.'],
['Botulism', 'emergent', 'Descending paralysis, poorly reactive pupils, GI prodrome — antitoxin; do not wait for culture.'],
['Microvascular cranial neuropathy / decompensated phoria', 'common', 'Isolated CN IV/VI palsy may be microvascular after appropriate assessment. Every new acquired CN III palsy needs urgent imaging/specialist assessment, even with pupil sparing.']
],
history: [
    "Establish onset and progression, fluctuation with fatigue, previous strabismus/eye surgery and antecedent trauma; intermittent symptoms can still reflect myasthenia or GCA.",
    'Monocular (persists covering one eye) vs binocular (resolves covering either)', 'Pain, headache, scalp tenderness, jaw claudication', 'Fatigability through the day, ptosis, dysarthria, limb weakness', 'Vascular risks, atrial fibrillation, trauma, recent infection or canned food'],
exam: [
    "Check visual fields, ptosis, facial sensation and other cranial nerves as well as eye movements; additional deficits broaden concern beyond an isolated ocular motor palsy.",
    'Cover-uncover / alternate cover; ductions and versions in nine positions', 'Pupils: size, reactivity, RAPD; complete vs pupil-sparing CN III', 'Fatigable ptosis (sustained upgaze); ice-pack test if MG possible', 'Orbital signs: proptosis, chemosis, resistance to retropulsion', 'Full neuro: INO, ataxia, other cranial nerves, temporal arteries'],
workup: [
['Bedside', [
    "Test each eye separately and consider pinhole when diplopia is monocular; improvement supports an optical cause without replacing a full eye examination.",
    'Visual acuity, pupils, cover testing; glucose', 'Ice-pack or rest test if MG is likely and the patient is stable']],
['Labs', ['ESR/CRP if age ≥50 with diplopia or GCA features', 'AChR/MuSK later; they do not change the ED airway decision']],
['Imaging', ['Urgent CTA/MRA and specialist assessment for new acquired CN III palsy, including pupil-sparing cases', 'MRI-DWI ± CTA for brainstem/INO features', 'CT/MR orbits and cavernous sinus if orbital or febrile']]
],
redFlags: ['Painful pupil-involving third-nerve palsy', 'Age ≥50 with diplopia plus headache or jaw claudication', 'Proptosis, chemosis, or fever with diplopia', 'Fatigable weakness or falling vital capacity', 'Crossed findings, ataxia, or INO', 'Poorly reactive pupils with descending weakness (botulism)'],
disposition: [
['Discharge', 'Clear monocular optical cause, or specialist-assessed microvascular palsy with appropriate imaging and follow-up. Do not discharge a new CN III palsy solely because the pupil is spared.'],
['Admit', 'Incomplete or painful cranial neuropathies pending imaging, MG under NIF observation, treated GCA on steroids, orbital infection on IV antibiotics.'],
['Stroke / neurosurgery / ICU', 'PCOM aneurysm, brainstem stroke, cavernous sinus thrombosis, myasthenic crisis, botulism.']
],
pitfalls: ['Calling a new CN III palsy microvascular without vascular imaging can miss an aneurysm, including pupil-sparing cases.', 'Monocular diplopia is almost never a brain-attack — check refraction, dry eye, and the lens.', 'GCA diplopia can be fleeting and the ESR can be normal — treat on suspicion.', 'Myasthenia pupils are spared; if the pupils are involved, look elsewhere.', 'CT is a poor posterior-fossa test — MRI-DWI when INO or crossed signs are present.'],
pearls: [
    "Arrange explicit follow-up and return advice for evolving ptosis, pupil changes or new neurological symptoms; an initially isolated palsy may change over time.",
    'Binocular + cover test: if covering either eye kills the double vision, it is alignment.', 'Every new acquired CN III palsy needs urgent vascular imaging and specialist assessment, even when the pupil is spared.', 'Diplopia in the over-50s is GCA until you have asked about jaw claudication and started steroids when the story fits.', 'INO is a brainstem localizer — skip the reassurance CT.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — diplopia', '2026 AHA/ASA stroke guidance; SAEM GRACE-3 (2023) acute dizziness guideline', 'ACR/EULAR GCA recommendations; AAO cranial neuropathy guidance']
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
['Bowel obstruction / volvulus', 'critical', 'Vomiting, distension, prior surgery, hernia, tympany — CT. Sigmoid/cecal volvulus is time-critical.', ['small-bowel-obstruction']],
['Mesenteric ischemia', 'critical', 'Pain out of proportion, AF, bloody stool — CTA, not a discharge laxative.', ['acute-mesenteric-ischemia']],
['Cauda equina / cord compression', 'critical', 'New constipation plus back pain, saddle anesthesia, or urinary retention — emergency MRI.'],
['Fecal impaction with overflow / stercoral colitis', 'critical', 'The frail elderly \u201Cdiarrhea\u201D that is overflow; DRE. Stercoral ulceration can perforate.'],
['Hypercalcemia / myxedema / opioid ileus', 'emergent', 'Bones, stones, groans, psychiatric overtones; delayed reflexes; the medication list.'],
['Toxic megacolon / Ogilvie (acute colonic pseudo-obstruction)', 'emergent', 'Distended silent abdomen in IBD, C. diff, or the hospitalized/post-op patient — decompression pathway.'],
['Simple functional constipation / opioid-induced', 'common', 'No red flags, benign exam — osmotic laxative, enemas as needed, bowel regimen, follow-up.']
],
history: [
    "Ask about straining, incomplete evacuation and the need for manual assistance; persistent outlet symptoms may indicate pelvic-floor dysfunction.",
    'Last stool, character, overflow liquid, blood, vomiting, ability to pass flatus', 'Prior surgeries, hernias, opioid or anticholinergic use, immobilization', 'Back pain, saddle numbness, urinary retention', 'Weight loss, iron deficiency (obstructing cancer)', 'Thyroid, calcium, psychiatric meds'],
exam: ['Abdomen: distension, hernias, peritoneal signs, bowel sounds', 'DRE: impaction, blood, tone (cauda)', 'Neuro if back pain or retention: saddle sensation, post-void residual', 'Volume status and signs of hypothyroidism'],
workup: [
['Bedside', ['DRE; bladder scan if retention is possible', 'Glucose; POCUS for free fluid/AAA if surgical features']],
['Labs', ['Electrolytes including K and Ca, TSH if myxedema possible, CBC, creatinine', 'β-hCG when relevant; lactate if ischemia is on the list']],
['Imaging', [
    "Constipation alone is not an indication for colonoscopy; arrange appropriate screening or investigation for bleeding, anemia, weight loss, changed bowel habit or a strong colorectal-cancer family history.",
    'No imaging for simple constipation with a benign exam', 'CT abdomen/pelvis when obstruction, ischemia, or stercoral colitis is possible', 'MRI spine if cauda/cord features']]
],
redFlags: ['Vomiting, distension, or an irreducible hernia', 'Pain out of proportion or bloody stool', 'New constipation with back pain, saddle numbness, or retention', 'Fever or peritonitis (stercoral perforation, megacolon)', 'Weight loss or iron-deficiency anemia in the older adult', 'Opioid ileus with a rock-hard abdomen'],
disposition: [
['Discharge', 'Simple constipation, empty rectum after disimpaction if needed, taking oral fluids, a bowel regimen, and return precautions. Stop or reduce the offending opioid/anticholinergic when safe.'],
['Admit', 'Fecal impaction needing serial enemas in a frail host, Ogilvie under monitoring, electrolyte or thyroid replacement, obstructing cancer staging.'],
['OR / MRI / ICU', 'Obstruction with ischemia or perforation, volvulus, stercoral perforation, cauda equina.']
],
pitfalls: ['Treating mesenteric ischemia or SBO with polyethylene glycol is a classic miss.', '\u201CDiarrhea\u201D in the elderly is overflow until a DRE is done.', 'New constipation plus urinary retention is cauda equina, not a laxative trial.', 'AXR is insensitive for obstruction — CT when the story is real.', 'Discharging without a bowel regimen after opioids guarantees a bounce-back.'],
pearls: [
    "After excluding impaction or obstruction requiring other care, agree a bowel regimen with adequate fluid intake and gradual fiber adjustment; review constipating medicines.",
    "Persistent difficulty evacuating despite initial treatment warrants specialist assessment; pelvic-floor dyssynergia may respond to biofeedback rather than escalating laxatives alone.",
    'Constipation is a symptom. Ask what you are missing: obstruction, ischemia, cord, calcium, thyroid, opioids.', 'DRE is part of the exam, not optional, in the frail and in overflow diarrhea.', 'No red flags + a benign exam = regimen and follow-up, not a CT.', 'Back pain + constipation + retention = MRI, not lactulose.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — constipation', 'Tintinalli\u2019s 9th ed. — bowel obstruction', 'NICE NG59 / cauda equina red flags; WSES obstruction guidance']
},
{
id: 'limb-ischemia', name: 'Acute Limb Ischemia', icon: '🦵',
tag: 'A cold pulseless limb is a clock — and sometimes a dissected aorta.',
overview: 'Acute limb ischemia is a vascular emergency: the six Ps (pain, pallor, pulselessness, poikilothermia, paresthesia, paralysis) mark time-to-muscle. Embolus, thrombosis of a diseased vessel, aortic dissection into a limb, phlegmasia, and necrotizing infection can share the stage. Do not wait for an ABI when the exam is classic — heparin, vascular surgery, and CTA of the aorta-to-runoff as the story dictates.',
approach: [
    'Exam first: pulses, Doppler, comparison with the other limb, and a motor/sensory map.',
    'Chest or back pain with a pulse deficit is dissection until CTA says otherwise — do not anticoagulate blindly.',
    'Classic ALI: unfractionated heparin unless contraindicated and an immediate vascular call; imaging must not delay a clearly threatened limb.',
    'Pain out of proportion after reperfusion or crush is compartment syndrome — fasciotomy, not another scan.'
],
dontMiss: [
['Embolic or thrombotic acute limb ischemia', 'critical', 'Sudden pain, pallor, pulselessness — Rutherford threatened but salvageable limb needs revascularization now; irreversible ischemia needs a different surgical plan. Give heparin unless contraindicated, including active bleeding, suspected dissection or HIT; obtain urgent vascular advice for alternatives.'],
['Aortic dissection into a limb', 'critical', 'Chest/back pain + pulse deficit or a cold arm/leg — CTA aorta first; anticoagulating this as a simple embolus can be lethal.', ['acute-aortic-syndrome']],
['Phlegmasia cerulea dolens / massive DVT', 'critical', 'Cyanotic swollen limb, often malignant or post-op — anticoagulation ± thrombolysis/thrombectomy; watch for venous gangrene.'],
['Compartment syndrome', 'critical', 'Pain on passive stretch after trauma, crush, or reperfusion — compartment pressures support but do not override clinical diagnosis; fasciotomy.'],
['Necrotizing soft-tissue infection', 'critical', 'Pain out of proportion, rapid spread, crepitus, or shock — surgery now.'],
['Blue toe / cholesterol emboli after cath', 'emergent', 'Livedo and intact pulses after an aortic procedure — do not miss ongoing aortic source.'],
['Chronic PAD / claudication flare', 'common', 'Exertional calf pain that resolves with rest, pulses diminished but tissue viable — outpatient vascular pathway if no rest pain or tissue loss.']
],
history: [
    "Document the exact onset and previous limb function, prior bypass/stent and earlier claudication; these help the vascular team judge the cause and treatment options.",
    'Tempo: seconds–minutes (embolus, dissection) vs hours–days (thrombosis, infection)', 'Chest, back, or abdominal pain (dissection, AAA)', 'AF, recent MI, aneurysm, bypass graft, cath access', 'Trauma, crush, lithotomy, anticoagulation, malignancy'],
exam: [
    "Record arterial and venous Doppler signals with a timed motor/sensory examination. New weakness or sensory loss changes limb-threat assessment and requires immediate escalation.",
    'Pulses and Doppler in both limbs; ankle-brachial index only if it will not delay care', 'Skin: pallor vs cyanosis vs mottling vs crepitus', 'Motor and sensory — paralysis means muscle is dying', 'Heart: AF, murmur; abdomen: AAA; chest: BP in both arms', 'Passive stretch pain of the compartments'],
workup: [
['Bedside', ['ECG (AF, ischemia); bilateral arm BP', 'Handheld Doppler; POCUS for AAA and dissection flap if trained', 'Glucose, lactate']],
['Labs', ['CBC, coagulation, CK, creatinine, type & screen', 'Cultures if infection/shock']],
['Imaging', ['CTA aorta-to-runoff when dissection or embolic shower is possible', 'Duplex if the diagnosis is uncertain and the limb is viable', 'Do not delay a threatened limb for perfect pictures']]
],
redFlags: ['Pulseless, pale, or paralyzed limb', 'Chest or back pain with a pulse deficit', 'Pain on passive stretch after trauma or reperfusion', 'Crepitus, bullae, or shock with a soft-tissue source', 'Cyanotic swollen limb (phlegmasia)', 'Rest pain in a vasculopath with tissue loss'],
disposition: [
['Discharge', 'Chronic claudication without rest pain or tissue threat, intact Doppler, reliable vascular follow-up.'],
['Admit (vascular)', 'Viable but symptomatic ischemia, phlegmasia on anticoagulation, post-cath blue toe, infection needing IV therapy.'],
['Emergency vascular surgery / OR / ICU', 'Threatened ALI needs revascularization; irreversible ALI needs amputation/source-control planning rather than revascularization. Dissection, compartment syndrome and necrotizing infection also need emergency specialist care.']
],
pitfalls: [
    "Do not delay emergency vascular assessment while searching for an embolic source; ECG and cardiac/aortic investigation should not postpone treatment of the threatened limb.",
    'Waiting for ABI or formal angiography while the limb dies.', 'Heparin for \u201Cembolus\u201D that is really a type A dissection.', 'Calling cellulitis when the pain is out of proportion (nec fasc or compartment).', 'Irreversible ischemia still needs source control and often amputation planning — do not send home a dead limb.', 'Reperfusion without watching compartments produces a second disaster.'],
pearls: [
    "After revascularization, continue serial limb and compartment assessments; reperfusion can produce compartment syndrome even after blood flow has returned.",
    'Six Ps are a clock, not a checklist to complete before calling vascular.', 'Pulse deficit + chest or back pain = aorta, not a femoral embolus in isolation.', 'Heparin unless contraindicated (including bleeding, suspected dissection or HIT); imaging must not delay a threatened limb.', 'Passive stretch pain after crush or reperfusion is compartment syndrome.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — peripheral vascular and aortic disease', '2024 ACC/AHA multisociety PAD guideline; 2022 ACC/AHA aortic disease guideline', 'SVS acute limb ischemia recommendations']
},
{
id: 'hyperglycemia', name: 'DKA, HHS & Adrenal Crisis', icon: '🧪',
tag: 'Sugar, potassium, volume — and never withhold steroids in the crashing steroid-dependent patient.',
overview: 'Hyperglycemic crises and adrenal crisis are metabolic shock. DKA requires diabetes/hyperglycemia, ketonemia and metabolic acidosis; blood β-hydroxybutyrate is preferred (glucose may be near-normal on SGLT2 inhibitors). HHS is extreme hyperosmolarity with profound volume loss and a quieter acid-base picture. Adrenal crisis is refractory shock in the steroid-dependent or Waterhouse-Friderichsen patient — give hydrocortisone without waiting for a cortisol. Potassium before insulin if K⁺ is low; fluids are an early treatment in DKA/HHS; individualize volume for heart failure, renal failure and frailty.',
approach: [
    'Bedside glucose, VBG/ketones, and potassium in every sick diabetic or unexplained shock.',
    'DKA: fluids first, potassium repletion, then insulin. Defer insulin if K⁺ is <3.5 mmol/L.',
    'HHS: slower osmolar correction, hunt the trigger (infection, MI, stroke), watch sodium and neuro status.',
    'Steroid-dependent + shock or vomiting: stress-dose hydrocortisone now — do not wait for a cortisol.'
],
dontMiss: [
['Diabetic ketoacidosis', 'critical', 'Diabetes history or glucose ≥200 mg/dL, β-hydroxybutyrate ≥3 mmol/L (or urine ketones ≥2+), and pH <7.3 and/or bicarbonate <18 mmol/L. Euglycemic DKA on SGLT2 inhibitors is easy to miss — check ketones when the story fits even if glucose is modest.'],
['Hyperosmolar hyperglycemic state', 'critical', 'Glucose ≥600 mg/dL, effective osmolality >300 or total >320 mOsm/kg, β-hydroxybutyrate <3 mmol/L, pH ≥7.3 and bicarbonate ≥15 mmol/L; altered mentation is not required — huge water deficit; correct slowly to avoid cerebral edema.'],
['Adrenal crisis', 'critical', 'Shock, hyponatremia, hyperkalemia, or hypoglycemia in a steroid-dependent, pituitary, or meningococcemia patient — adult hydrocortisone 100 mg IV now; children need age/body-surface dosing under the pediatric protocol.'],
['Precipitant ACS / sepsis / pancreatitis', 'critical', 'The crisis is often triggered — ECG, cultures, lipase as indicated. Treat the trigger with the protocol.'],
['Hypokalemia during insulin', 'critical', 'Total-body K⁺ is low even when the first value is normal; insulin drives K⁺ in — replace and monitor.'],
['Cerebral injury (especially pediatric DKA)', 'critical', 'Headache, bradycardia or deteriorating GCS — immediate pediatric/critical-care response, head elevation and mannitol/hypertonic saline per protocol; do not wait for CT. Reassess fluids while maintaining perfusion; do not stop resuscitation reflexively.'],
['Simple hyperglycemia / missed insulin', 'common', 'No acidosis, no ketones, well-appearing — hydration, insulin plan, follow-up. Still hunt infection.']
],
history: ['Polyuria, polydipsia, weight loss, vomiting, abdominal pain', 'SGLT2 inhibitors, insulin omission, infection, pregnancy', 'Steroid use or recent cessation; pituitary disease; pigmentation', 'Chest pain, fever, diarrhea as precipitants'],
exam: ['Volume status: tachycardia, dry mucosa, delayed cap refill', 'Kussmaul breathing (DKA); focal neuro or coma (HHS)', 'Abdomen (pancreatitis, surgical mimic); fever; skin (meningococcus, candida)', 'Medic-alert jewelry; insulin pump in situ'],
workup: [
['Bedside', [
    "During adult DKA/HHS treatment, check bedside glucose every 1–2 hours; reassess fluid balance, mental status and cardiovascular response throughout treatment.",
    'Glucose, VBG, blood β-hydroxybutyrate (urine if unavailable), ECG', 'Potassium on the blood gas while the lab is pending']],
['Labs', [
    "In adult DKA, repeat electrolytes, creatinine, phosphate, β-hydroxybutyrate and venous pH every 4 hours until resolution. In HHS, also follow serum osmolality every 4 hours; measure potassium 2 hours after starting insulin and every 4 hours thereafter.",
    'Electrolytes with anion gap, osmolality, creatinine, phosphate, CBC, lipase', 'Cultures if febrile; troponin if ACS possible; draw cortisol/ACTH before hydrocortisone only if this causes no treatment delay; hydrocortisone confounds subsequent cortisol interpretation', 'β-hCG when relevant']],
['Imaging', ['CXR; CT only for a suspected surgical or neurologic precipitant', 'Do not delay DKA/HHS therapy for imaging']]
],
redFlags: ['Altered mentation with hyperglycemia or ketones', 'K⁺ <3.5 before insulin, or falling K⁺ on treatment', 'Steroid-dependent patient with shock or vomiting', 'SGLT2 inhibitor + acidosis even with a \u201Cnormal\u201D glucose', 'Headache or falling GCS in a child on a DKA protocol', 'Hypotension that does not respond to fluids (think adrenal, sepsis, ACS)'],
disposition: [
['Discharge', 'Isolated hyperglycemia without ketosis or HHS features, a clear missed-dose story, reliable insulin access and follow-up.'],
['Admit (ward / HDU)', 'Uncomplicated DKA responding on a protocol, new diabetes needing education, HHS with improving osmolality under monitoring.'],
['ICU', 'Severe acidosis, shock, HHS with coma, cerebral injury or a dangerous precipitant. All pediatric DKA needs a pediatric protocol and specialist monitored care; ICU depends on severity and neurologic/hemodynamic status. Adrenal crisis with instability needs ICU.']
],
pitfalls: ['Starting insulin before potassium is replaced when K⁺ is already low — ventricular arrhythmia.', 'Missing euglycemic DKA because the glucose is 180 mg/dL on an SGLT2 inhibitor.', 'Waiting for a random cortisol in adrenal crisis.', 'Over-rapid correction of HHS sodium/osmolality.', 'Calling DKA abdominal pain \u201Cjust ketosis\u201D without considering pancreatitis or a surgical abdomen.', 'Do not stop insulin just because glucose falls: add dextrose and continue until ketoacidosis resolves. Adult resolution: β-hydroxybutyrate <0.6 mmol/L plus venous pH ≥7.3 or bicarbonate ≥18 mmol/L; ideally glucose <200 mg/dL. The anion gap and urine ketones are not resolution targets.'],
pearls: [
    "When transitioning resolved adult DKA from IV to subcutaneous insulin, overlap by 1–2 hours according to the protocol to prevent rebound ketosis; account for intake and hypoglycemia risk.",
    "Before discharge, address the precipitant, insulin access, supplies, injection technique, ketone testing and sick-day advice; agree a follow-up plan rather than treating insulin omission as the whole explanation.",
    'Fluids, potassium, then insulin. That order prevents the crash.', 'SGLT2 + unwell = check ketones even if glucose is not high.', 'Hydrocortisone in the crashing steroid-dependent patient is a resuscitation drug, not an endocrine consult.', 'Clear ketonemia and acidosis, not just hyperglycemia; saline-related hyperchloremic acidosis can leave bicarbonate low despite ketone clearance; the anion gap is not a resolution target.'],
doses: [
    ['Fluids', ['Isotonic crystalloid (0.9% saline or balanced crystalloid) 1–1.5 L in the first hour (15–20 mL/kg in children, then reassess)', 'Thereafter 250–500 mL/h guided by volume status, sodium and urine output; prefer balanced crystalloid when chloride is rising', 'Severe hypovolaemia/shock: faster initial resuscitation, then individualise for heart failure, renal failure or frailty']],
    ['Insulin', ['Regular insulin 0.1 U/kg/h IV infusion (or 0.14 U/kg/h if no bolus)', 'Continue until ketoacidosis resolves — do not stop insulin when glucose normalises', 'When glucose <200–250 mg/dL: add dextrose (5–10%) and reduce to 0.05 U/kg/h', 'Subcutaneous rapid-acting analogue (0.1–0.2 U/kg q2h) is an alternative for mild DKA; not for HHS or severe DKA']],
    ['Potassium', ['If K⁺ <3.5 mmol/L: replace (e.g. 20–40 mmol/h) and defer insulin until K⁺ ≥3.5 and stable', 'If K⁺ 3.5–5.0 mmol/L: add 20–30 mmol/L of infusion fluid to keep K⁺ in range', 'If K⁺ >5.0 mmol/L: hold replacement and recheck', 'Check K⁺ and glucose 2 h after starting insulin, then every 2–4 h']],
    ['Bicarbonate / phosphate', ['Bicarbonate only for pH <6.9: 100 mmol in 400 mL sterile water with 20 mmol KCl over 2 h, repeat until pH >7.0', 'Phosphate only if <1 mg/dL (0.32 mmol/L) or with cardiac/respiratory compromise: 20–30 mmol potassium phosphate']],
    ['Adrenal crisis (adjunct)', ['Adult hydrocortisone 100 mg IV immediately, then 50 mg IV q6h (or 200 mg/24 h infusion)', 'Children (adrenal crisis): hydrocortisone 50–100 mg/m² IV/IM, or age-banded 25 mg (<3 y), 50 mg (3–12 y), 100 mg (>12 y), then 50–100 mg/m²/day', 'Add fludrocortisone only after stabilisation and when on a maintenance regimen']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — DKA, HHS, adrenal insufficiency', 'ADA/EASD/AACE/JBDS/DTS Hyperglycemic Crises in Adults Consensus Report (2024); ADA Standards of Care 2026', 'ISPAD pediatric DKA; Endocrine Society adrenal insufficiency guidance']
},
{
id: 'heat-cold', name: 'Heat Stroke & Hypothermia', icon: '🌡️',
tag: 'Cool the hot brain; warm the cold dead — temperature is the treatment.',
overview: 'Temperature extremes are treated while you diagnose. Heat stroke is CNS dysfunction plus typically core temperature ≥40°C — evaporative or (better) ice-water immersion cooling starts immediately; do not wait for a laboratory gold standard. Hypothermia is not dead until warm and dead; afterdrop, arrhythmia, and delayed drugs are the traps. Submersion injury is a hypoxic emergency with optional C-spine when the mechanism fits. Envenomation is regional — antivenom and poison-center support, not a delay for species certainty.',
approach: [
    'Measure a true core temperature (rectal/esophageal/bladder) — peripheral temps lie.',
    'Heat stroke: start rapid cooling (ice-water immersion when available) alongside ABC support; assess for rhabdo, DIC and liver injury.',
    'Hypothermia: handle gently, start rewarming and follow the local temperature-specific ALS shock/drug algorithm; discuss ECLS transfer early in arrest or instability.',
    'Submersion: oxygenate and ventilate; C-spine only if the mechanism suggests injury. Call poison center for bites and stings.'
],
dontMiss: [
['Classic or exertional heat stroke', 'critical', 'Altered mentation + high core temperature — cool immediately to ~39°C. Ice-water immersion is first-line for exertional heat stroke (ACSM/NATA). Antipyretics do not work.'],
['Heat exhaustion vs sepsis vs NMS / serotonin syndrome / sympathomimetic storm', 'critical', 'Not every hot altered patient is environmental — toxidrome, rigidity, meds, and infection still apply. Cooling proceeds while you sort.'],
['Accidental hypothermia with cardiac arrest', 'critical', 'Prolonged CPR and extracorporeal rewarming when available; use a validated prognostic approach such as HOPE and specialist assessment; no single temperature determines when resuscitation stops. Gentle handling to avoid VF.'],
['Submersion / drowning', 'critical', 'Hypoxia is the disease. Rescue breaths, intubation as needed, delayed pulmonary edema. C-spine if diving or trauma mechanism.'],
['Rhabdomyolysis / DIC / acute liver failure after heat stroke', 'critical', 'The cooling is not the end — watch CK, coagulation, glucose, and mental status for 24 h.'],
['Severe envenomation (region-specific)', 'emergent', 'Snake, scorpion, marine — antivenom when indicated, pressure immobilization per local protocol, poison center. Do not cut, suck, or tourniquet.'],
['Heat exhaustion / mild hypothermia', 'common', 'Normal mentation, milder temperature derangement — oral or passive rewarming/cooling, hydration, and a safe environment.']
],
history: ['Environment, exertion, clothing, drugs (anticholinergics, diuretics, stimulants, neuroleptics, SSRIs)', 'Last seen well, duration of exposure, submersion details', 'Heart disease, age, alcohol, homelessness', 'Bite or sting: species if known, time, first aid already given'],
exam: ['Core temperature; GCS and sweating (may be absent in classic heat stroke)', 'Shivering vs rigid; pupils; frostbite; arrhythmia', 'Trauma and C-spine indications after submersion', 'Compartment and bite-site exam; fasciculations (elapid/crotalid patterns)'],
workup: [
['Bedside', [
    "During rapid heat-stroke cooling, monitor core temperature and clinical response to avoid overcooling; follow the treatment endpoint in the local resuscitation protocol.",
    'Core temperature; ECG (Osborn J waves, VF risk); glucose; SpO₂', 'Strip and cool, or insulate and rewarm, while lines go in']],
['Labs', ['CBC, coagulation, CK, electrolytes, creatinine, LFTs, lactate, ABG/VBG', 'DIC panel and glucose in heat stroke; potassium in hypothermia (rises with rewarming)']],
['Imaging', ['CXR after submersion; CT head if trauma or unexplained coma', 'Do not delay cooling or rewarming for a scanner']]
],
redFlags: ['Any CNS change with a high core temperature', 'Core temperature <30°C or cardiac arrest in the cold', 'Submersion with apnea or foam', 'Rising CK, falling platelets, or hypoglycemia after heat exposure', 'Progressive swelling or paralysis after a bite', 'Anticholinergic or neuroleptic exposure in a heat wave'],
disposition: [
['Discharge', 'Heat exhaustion or mild hypothermia with normal mentation, a safe warm/cool environment, and reliable observation.'],
['Admit', 'Heat stroke after cooling (even if mentation improved), moderate hypothermia, submersion with any respiratory findings, envenomation needing observation.'],
['ICU / ECMO / antivenom pathway', 'Heat stroke with organ failure, hypothermic arrest, severe submersion hypoxia, shock from envenomation.']
],
pitfalls: ['Waiting for a \u201Cdiagnosis\u201D before cooling a hot, altered patient.', 'Using acetaminophen to treat heat stroke.', 'Declaring death in hypothermia before adequate rewarming.', 'Rough handling of the severely hypothermic patient (VF).', 'Skipping C-spine in a diver, or immobilizing every pool drowning.', 'Cutting and sucking snakebites — call the poison center instead.'],
pearls: [
    "Move a hypothermic patient out of exposure, remove wet clothing when feasible, and insulate while active rewarming is arranged.",
    "Use continuous rhythm and perfusion monitoring in significant hypothermia; handle gently and escalate instability to an ECLS-capable service early.",
    "Treat heat-stroke cooling and airway/circulatory support in parallel; neither should wait for completion of the other.",
    'Hot and altered: cool now. Cold and lifeless: warm before you stop.', 'Ice-water immersion is the treatment of exertional heat stroke, not a last resort.', 'Antipyretics do not treat environmental hyperthermia.', 'Core temperature, not the forehead thermometer, decides the pathway.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — heat, cold, submersion, envenomation', 'Wilderness Medical Society & NATA/ACSM exertional heat-stroke statements', 'AHA hypothermia and drowning resuscitation guidance']
},
{
id: 'palpitations', name: 'Palpitations & Dysrhythmia', icon: '💓',
tag: 'Capture the rhythm, then decide whether the patient or the ECG is unstable.',
overview: 'Palpitations range from benign ectopy to a rhythm causing shock, ischemia, heart failure, or syncope. The first ECG and a strip during symptoms are more valuable than retrospective labels.',
approach: ['ABCs, monitor, IV access, and 12-lead ECG; treat hemodynamic instability immediately.', 'Classify rate, regularity, and QRS width only after checking the patient\u2019s perfusion.', 'Assume regular wide-complex tachycardia is VT until proven otherwise; never give AV-nodal blockers to an irregular wide rhythm.', 'Search for reversible drivers: ischemia, electrolytes (K⁺, Mg²⁺), thyroid disease, stimulants, structural disease, and inherited channelopathies.'],
dontMiss: [['Unstable tachyarrhythmia or bradyarrhythmia', 'critical', 'Hypotension, shock, ischemic pain, pulmonary edema, or altered mentation means immediate resuscitation per local ACLS protocol.'], ['Ventricular tachycardia', 'critical', 'Assume wide-complex tachycardia is VT until expert review proves otherwise.'], ['Pre-excited atrial fibrillation', 'critical', 'Irregular wide-complex rhythm may deteriorate rapidly; avoid AV-nodal blockers and IV amiodarone; unstable patients need cardioversion, stable patients need expert procainamide/ibutilide or cardioversion assessment.'], ['ACS, PE, dissection, or toxicologic cause', 'emergent', 'Palpitations may be the presenting symptom of another time-critical illness.'], ['Sinus tachycardia / ectopy', 'common', 'A diagnosis of exclusion; explain and treat the driver rather than only the rate.']],
history: ['Onset/offset (abrupt vs gradual), regularity, duration, exertional or supine symptoms', 'Syncope, chest pain, dyspnea, neurologic symptoms, family history of sudden death <40 y', 'Stimulants, alcohol, supplements, QT-prolonging medications, thyroid disease, prior ECG/device'],
exam: ['Perfusion, blood pressure, mental status, heart-failure signs (JVP, crackles)', 'Pulse regularity and rate; pathologic murmurs (AS, HCM); volume status', 'Look for toxidrome, fever, anemia, or thyrotoxicosis clues'],
workup: [['Bedside', ['12-lead ECG and continuous rhythm strip during symptoms; compare with prior ECGs and device interrogation', 'Bedside glucose and POCUS/echo when structural disease, heart failure, or pericardial effusion is suspected']], ['Labs', ['Electrolytes (K⁺, Mg²⁺, Ca²⁺), CBC, renal function, pregnancy test when relevant', 'hs-cTn when ischemia is possible; TSH when clinically indicated']], ['Imaging', [
    "Choose ambulatory monitoring by symptom frequency: a short Holter suits frequent episodes; infrequent unpredictable symptoms usually need longer event/loop monitoring.",
    'CXR if heart failure or pulmonary driver suspected; formal echo or ambulatory monitor after dangerous rhythms are excluded']]],
redFlags: ['Syncope, presyncope, or persistent hypotension', 'Wide-complex or very rapid irregular rhythm', 'Chest pain, ischemic ECG changes, or acute heart failure', 'Known structural heart disease, QTc ≥500 ms, Brugada, WPW, or family sudden death', 'Palpitations during exertion or with stimulant/toxin exposure'],
disposition: [['Discharge', 'Resolved low-risk symptoms, normal ECG/QTc, no syncope or structural risk features, and arranged ambulatory follow-up.'], ['Observation / telemetry', 'Uncaptured recurrent symptoms, abnormal baseline ECG, electrolyte correction, new AF, or uncertain cause.'], ['Resuscitation / ICU / cardiology', 'Unstable rhythm, VT, pre-excitation concern, high-grade AV block, ischemia, or decompensated heart failure.']],
pitfalls: ['Calling every fast rhythm anxiety before obtaining an ECG.', 'Treating a wide rhythm as SVT with calcium-channel or beta blockers without excluding VT or pre-excitation.', 'Slowing compensatory sinus tachycardia with nodal blockers instead of treating sepsis, bleeding, or PE.'],
pearls: [
    "Ask the patient to record symptom times and activity so captured rhythms can be correlated with the actual episodes.",
    "Preserve available ECG recordings from symptomatic episodes; a normal tracing between episodes does not exclude an intermittent arrhythmia.",
    "Outpatient monitoring is a diagnostic plan, not a substitute for urgent assessment of syncope, instability or significant structural/inherited cardiac risk.",
    'The patient\u2019s perfusion determines urgency; the ECG defines the next branch.', 'Capture an ECG during symptoms. Adenosine is reserved for appropriate regular rhythms through the ALS pathway; it is not a general diagnostic trial for palpitations.', 'Irregular + wide + fast is pre-excited AF until proven otherwise — avoid AV-nodal blockers and IV amiodarone.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dysrhythmias', 'AHA ACLS and ACC/AHA/HRS arrhythmia guidance; apply local protocols']
},
{
id: 'focal-neurologic-deficit', name: 'Focal Neurologic Deficit / Suspected Stroke', icon: '🧠',
tag: 'Time last known well, glucose, disability, imaging, reperfusion team.',
overview: 'A new focal deficit is stroke until proven otherwise, but hemorrhage, seizure, hypoglycemia, migraine, dissection, and toxic-metabolic causes may mimic it. The clock starts at last known well, not arrival.',
approach: [
    "After correcting hypoglycemia, immediately reassess residual deficits; persistent focal findings still need the stroke pathway.",
    'Record exact last-known-well time, baseline function, anticoagulant use, bedside glucose, and deficit severity.', 'Activate the local stroke pathway immediately; get noncontrast head CT to exclude hemorrhage and CTA head/neck to identify large-vessel occlusion.', 'Assess both NIHSS and functional disability (aphasia, hemianopia, gait inability); low NIHSS does not exclude a disabling stroke.', 'Screen for posterior-circulation strokes and cervical dissection when vertigo, diplopia, ataxia, or neck pain accompany focal signs.'],
dontMiss: [['Acute ischemic stroke with disabling deficit', 'critical', 'Rapid stroke-team assessment; IV thrombolysis and/or thrombectomy eligibility follows local protocol and imaging.'], ['Intracranial hemorrhage', 'critical', 'CT first; control physiology and reverse anticoagulation per local pathway.'], ['Basilar artery occlusion', 'critical', 'Vertigo, diplopia, dysarthria, weakness, coma, or fluctuating signs demand posterior-circulation vigilance.'], ['Cervical artery dissection', 'emergent', 'Neck pain/headache with partial Horner syndrome or focal deficit; CTA/MRA.'], ['Hypoglycemia, seizure/Todd paralysis, migraine', 'common', 'Treat mimics promptly, but do not delay stroke imaging when uncertainty remains.']],
history: ['Last known well vs wake-up symptoms, exact deficit onset and progression', 'Anticoagulants (last dose), recent surgery/bleeding, prior stroke, seizure, headache/neck trauma', 'Baseline disability, pregnancy/postpartum status, vascular risk factors (AF, hypertension)'],
exam: ['Bedside glucose, NIHSS, gaze deviation, visual fields, language, and neglect', 'Posterior signs: truncal ataxia/gait, dysarthria, diplopia, crossed cranial-nerve/motor findings', 'Blood pressure, cardiac rhythm, airway protection, and dysphagia screen before oral intake'],
workup: [['Bedside', ['Capillary glucose immediately; 12-lead ECG and continuous rhythm monitoring (do not delay CT)', 'Focused NIHSS + posterior-circulation screen']], ['Labs', ['CBC, electrolytes, creatinine, coagulation (INR/aPTT/anti-Xa), type & screen, troponin', 'Pregnancy test when relevant; do not delay imaging or thrombolysis for routine labs unless coagulopathy is suspected']], ['Imaging', ['Immediate noncontrast head CT + CTA head/neck; CT perfusion or MRI per extended-window/wake-up protocol']]],
redFlags: ['Disabling aphasia, neglect, hemiparesis, or visual field loss', 'Reduced consciousness or brainstem/posterior-circulation signs (diplopia, dysarthria, ataxia)', 'Thunderclap headache, vomiting, meningismus, or seizure at onset', 'Neck pain after minor trauma or new Horner syndrome', 'Anticoagulation or severe hypertension with acute neurologic change'],
disposition: [['Discharge', 'Only after a confirmed low-risk mimic or specialist-directed TIA pathway with completed neurovascular imaging and rapid follow-up.'], ['Stroke unit', 'Confirmed stroke or high-risk TIA, persistent deficit, or incomplete etiologic/cardiac assessment.'], ['Resuscitation / neuro-ICU / thrombectomy center', 'Thrombolysis or EVT candidate, intracranial hemorrhage, large-vessel occlusion, declining GCS, or airway risk.']],
pitfalls: ['Using ED arrival time rather than last-known-well time to judge the reperfusion window.', 'Calling a low NIHSS \u201Cminor\u201D when isolated aphasia, hemianopia, or hand/gait loss is disabling for the patient.', 'Missing posterior-circulation stroke because standard NIHSS underweights truncal ataxia and cranial-nerve signs.'],
pearls: [
    "Keep the patient nil by mouth, including oral medicines, until an appropriate swallowing screen has been completed.",
    "When eligible for both IV thrombolysis and thrombectomy, do not delay EVT to wait for a response to the IV treatment.",
    "After successful anterior-circulation EVT, routine intensive SBP lowering below 140 mmHg is harmful; use the specialist post-reperfusion target and account for other indications.",
    'Check glucose immediately, then go straight to the CT scanner.', 'A disabling deficit with a low NIHSS is still a reperfusion candidate.', 'Neck pain or Horner syndrome with focal deficits is cervical dissection until CTA/MRA excludes it.'],
doses: [
    ['IV thrombolysis (alteplase / tenecteplase)', ['Alteplase 0.9 mg/kg IV (10% as a bolus over 1 min, remainder over 60 min), max 90 mg — within 4.5 h of onset', 'Tenecteplase 0.25 mg/kg IV bolus (max 25 mg) is an accepted alternative in eligible patients', 'Do not give if BP >185/110 mmHg — lower first and keep <180/105 for 24 h; no antiplatelet/anticoagulant for 24 h']],
    ['BP targets', ['Ischemic stroke without reperfusion: permissive hypertension unless >220/120 mmHg or another condition requires treatment; if lowering, use the specialist protocol (usually ~15% in 24 h)', 'Before/after thrombolysis: <185/110 to start, then <180/105 for 24 h', 'Selected mild-to-moderate ICH with initial SBP 150–220 mmHg: target ~140, maintaining 130–150 mmHg; avoid <130. Severe/large ICH requires individualized specialist targets']],
    ['Reversal (haemorrhage / anticoagulated)', ['Warfarin: 4-factor PCC + vitamin K 10 mg IV', 'Dabigatran: idarucizumab 5 g IV; anti-Xa DOACs: andexanet alfa or 4F-PCC per protocol', 'Heparin (last 4 h): protamine 1 mg per 100 units (max 50 mg)']],
    ['Glucose & seizure', ['Treat hypoglycaemia (<60 mg/dL) immediately; target 140–180 mg/dL', 'Status epilepticus: benzodiazepine first — see the Status Epilepticus quick sheet', 'Do not treat mild permissive hyperglycaemia with insulin infusions in the acute phase']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — acute stroke', '2026 AHA/ASA Early Management of Acute Ischemic Stroke Guideline; local stroke pathway']
},
{
id: 'airway-stridor', name: 'Airway Symptoms & Stridor', icon: '🗣️',
tag: 'Recognize a threatened airway early; call help before the airway becomes impossible.',
overview: 'Stridor, drooling, muffled voice, rapidly changing voice, or escalating work of breathing can signal upper-airway failure. Do not agitate, lie flat, or repeatedly instrument a patient who is maintaining a precarious airway.',
approach: ['Assess ability to speak, swallow secretions, oxygenate, and sit upright while calling senior airway/ENT/anesthesia help early.', 'Keep the patient in a position of comfort; never force a patient with upper-airway obstruction to lie flat.', 'Treat reversible airway edema early (IM epinephrine for anaphylaxis; nebulized epinephrine + dexamethasone for croup/edema).', 'Prepare a shared double-setup airway plan: video/fiberoptic primary approach, supraglottic backup, and marked cricothyrotomy landmark before any sedative/paralytic.'],
dontMiss: [['Impending upper-airway obstruction', 'critical', 'Stridor at rest, drooling, muffled voice, exhaustion, or altered mentation requires immediate expert airway management.'], ['Anaphylaxis / angioedema', 'critical', 'Treat as anaphylaxis when systemic allergic features or airway progression are present; do not wait for rash.'], ['Epiglottitis / deep-neck-space infection', 'critical', 'Toxic appearance, odynophagia out of proportion, trismus, neck swelling, or voice change; avoid forceful examination.'], ['Foreign body aspiration', 'critical', 'Sudden onset, unilateral findings, choking, or persistent symptoms after a choking event.'], ['Croup, laryngitis, vocal-cord dysfunction', 'common', 'Still reassess after therapy; a quiet or tiring patient is not reassuring.']],
history: ['Tempo, choking event, allergen/ACE-inhibitor exposure, fever and odynophagia', 'Voice change, drooling, dysphagia, recent neck surgery/intubation/radiation, immunosuppression', 'Prior difficult airway, hereditary angioedema history, inhalation/burn injury'],
exam: [
    "In a child with croup, quieter stridor plus fatigue, reduced air entry or declining consciousness can indicate impending failure rather than improvement.",
    'Work of breathing, stridor at rest, ability to phonate and manage secretions', 'Anterior neck/floor-of-mouth swelling, tracheal position, trismus, tongue elevation, urticaria', 'Avoid tongue-depressor provocation in a child with suspected epiglottitis; keep upright in caregiver\u2019s arms'],
workup: [['Bedside', ['Continuous pulse oximetry, waveform capnography, and double-setup airway cart at bedside', 'Awake flexible nasolaryngoscopy only by experienced operator when stable']], ['Labs', ['Blood cultures and CBC/lactate only after the airway is stable or secured', 'Avoid venipuncture in an agitated child with threatened upper airway']], ['Imaging', ['CT neck with IV contrast only in stable patients able to lie flat; never send an unstable stridulous airway to the scanner', 'Portable soft-tissue neck/chest radiograph at bedside only if it will not delay definitive care']]],
redFlags: ['Stridor at rest or a quiet/fatiguing airway', 'Drooling, tripod posture, or inability to lie flat', 'Rapidly progressive face, tongue, or floor-of-mouth swelling', 'Muffled \u201Chot-potato\u201D voice, severe trismus, or toxic appearance', 'Facial burns, carbonaceous sputum, or enclosed-space smoke inhalation'],
disposition: [['Discharge', 'For croup treated with dexamethasone and nebulized epinephrine: no recurrent symptoms during 2–4 h observation, no stridor at rest or significant distress, and reliable return precautions. Other causes require their own disposition criteria.'], ['Admit / ENT / step-down', 'Persistent stridor, deep-neck infection with stable airway, recurrent angioedema, or recurrent symptoms after nebulized epinephrine.'], ['Resuscitation / OR / ICU', 'Threatened airway, progressive tongue/laryngeal edema, epiglottitis, inhalation injury, or obstructing foreign body.']],
pitfalls: [
    "High fever, toxic appearance or poor response to nebulized epinephrine should prompt reassessment for bacterial tracheitis or another dangerous cause of stridor.",
    'Forcing a tripod patient flat for examination or CT scanning and precipitating complete obstruction.', 'Paralyzing a distorted upper airway (epiglottitis, Ludwig angina, angioedema) without an awake/fiberoptic plan and surgical setup.', 'Discharging a child immediately after nebulized epinephrine before observing for recurrent stridor.'],
pearls: [
    "After dexamethasone and nebulized epinephrine for croup, CPS supports discharge only when symptoms do not recur during 2–4 hours of observation; follow local criteria and escalate persistent or recurrent distress.",
    "Recurrent, prolonged, unusually severe or very early-age croup warrants assessment for an underlying airway problem rather than repeated treatment under the same label.",
    'A calm, upright patient is compensating — protect their posture and call anesthesia/ENT early.', 'Mark the cricothyroid membrane before giving any sedative in a threatened upper airway.', 'Stridor is an airway warning; do not treat it like simple bronchospasm.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — airway and upper-respiratory emergencies', 'ACEP difficult-airway guidance; local ENT and anesthesia airway pathways']
},
{
id: 'rash', name: 'Rash, Purpura & Dermatologic Emergencies', icon: '🩹',
tag: 'Rash is skin until it is sepsis, necrosis, mucosal disease, or anaphylaxis.',
overview: 'Most rashes are benign, but the dangerous minority declare themselves through toxicity, nonblanching purpura, pain out of proportion, mucosal involvement, skin failure, or rapid progression.',
approach: ['Assess systemic toxicity, vital signs, mucosal surfaces (eyes, mouth, genitals), palms/soles, and whether lesions blanch.', 'Separate purpuric/septic, necrotizing soft-tissue, blistering drug-induced (SJS/TEN/DRESS), and anaphylactic patterns.', 'Stop suspected culprit drugs immediately and involve surgery, burn/dermatology, or ophthalmology early when red flags appear.', 'Outline lesion borders with a skin marker and reassess progression rather than relying on a single snapshot exam.'],
dontMiss: [['Meningococcemia / purpura fulminans', 'critical', 'Toxic patient with nonblanching petechiae or purpura: resuscitate, cultures/antibiotics per sepsis protocol, and escalate.'], ['Necrotizing soft-tissue infection', 'critical', 'Pain out of proportion, rapid progression, bullae, anesthesia, or systemic toxicity; urgent surgical review.'], ['SJS/TEN or severe drug reaction', 'critical', 'Mucosal erosions, targetoid/blistering rash, skin pain, or detachment after a medication exposure.'], ['Anaphylaxis / angioedema', 'critical', 'Skin findings plus airway, breathing, circulation, or severe GI involvement is anaphylaxis.'], ['Cellulitis, urticaria, viral exanthem', 'common', 'Treat the patient and disposition according to systemic features and progression.']],
history: [
    "Ask about bites, water exposure, penetrating injuries and immune compromise; these change likely pathogens and the need for cultures or broader assessment.",
    'New medications in the past 1–8 weeks (anticonvulsants, sulfonamides, allopurinol, NSAIDs, antibiotics)', 'Fever, skin pain out of proportion, mucosal/ocular irritation, pruritus, speed of spread', 'Immunosuppression, diabetes, cirrhotic/marine/tick exposure, vaccination status'],
exam: [
    "Distinguish a drainable purulent abscess from nonpurulent cellulitis; drainage/source control and antibiotic decisions depend on the pattern and systemic illness.",
    'Vitals and toxic appearance; diascopy/glass test for blanching vs nonblanching purpura', 'Inspect conjunctivae, oral cavity, and urogenital mucosa; check Nikolsky sign, bullae, crepitus, and wooden induration', 'Mark borders of erythema/tenderness and re-examine within 30–60 minutes when progression is suspected'],
workup: [['Bedside', ['Vital signs, glass/blanch test, marked skin borders, and bedside glucose', 'POCUS for subcutaneous gas/fluid collection (never use a negative scan to exclude NSTI)']], ['Labs', [
    "Routine blood or skin cultures are unnecessary in typical uncomplicated cellulitis; consider them with severe systemic illness, neutropenia, major immune compromise, bites or immersion injury.",
    'CBC with differential (eosinophilia in DRESS), BMP, lactate, CK, CRP, LFTs, coagulation/DIC panel, blood cultures when toxic', 'Urinalysis and organ-injury screen in suspected systemic drug reaction or vasculitis']], ['Imaging', ['CT or plain radiograph may show fascial gas in NSTI, but never delay surgical exploration of high-suspicion NSTI for imaging']]],
redFlags: ['Nonblanching petechiae/purpura with fever, tachycardia, or hypotension', 'Pain out of proportion, rapid spread, violaceous bullae, skin anesthesia, or crepitus', 'Mucosal erosions (≥2 sites), conjunctival injection, or epidermal detachment (Nikolsky positive)', 'Facial/tongue swelling, stridor, wheeze, or hypotension', 'Fever + rash + facial edema/eosinophilia/transaminitis 2–8 weeks after starting a high-risk drug (DRESS)'],
disposition: [['Discharge', 'Systemically well patient with benign blanching exanthem, uncomplicated urticaria, or localized cellulitis and clear return precautions.'], ['Admit / specialty consult', 'Extensive cellulitis, immunocompromised host, DRESS without organ failure, or early mucosal drug reaction needing dermatology/ophthalmology review.'], ['Resuscitation / OR / burn unit', 'Meningococcemia/purpura fulminans, necrotizing soft-tissue infection (immediate debridement), anaphylaxis, or SJS/TEN.']],
pitfalls: ['Labeling severe pain out of proportion as \u201Csimple cellulitis\u201D while necrotizing fasciitis spreads beneath the skin.', 'Missing ocular involvement in SJS/TEN and risking permanent corneal scarring.', 'Waiting for laboratory scores (LRINEC) or CT before calling surgery for clinically obvious NSTI.'],
pearls: [
    "For uncomplicated limb cellulitis, elevate the affected area and address edema, eczema and interdigital fissures or fungal disease to reduce recurrence.",
    'Nonblanching purpura + fever/toxicity = empiric IV ceftriaxone/sepsis resuscitation immediately.', 'Skin pain is a red flag; itching does not establish a benign cause or exclude a serious drug reaction.', 'Always examine the eyes, mouth, and genitals in any blistering or febrile drug rash.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — dermatologic presentations', 'IDSA skin and soft-tissue infection guidelines; UK/US SJS/TEN and burn-center pathways']
},
{
id: 'flank-pain', name: 'Flank Pain & Renal Colic', icon: '🪨',
tag: 'Confirm the stone—but first exclude infected obstruction, AAA, and the surgical mimics.',
overview: 'Renal colic is common, but flank pain can be vascular, infectious, gynecologic, gastrointestinal, or spinal. A stone with sepsis, solitary kidney, anuria, or refractory symptoms is not a routine discharge.',
approach: ['Give prompt analgesia (NSAID + IV opioid if severe) while checking vitals, pregnancy status, urinalysis, and creatinine.', 'Screen older or hypotensive patients with flank/back pain for ruptured AAA by bedside aorta ultrasound before calling it a first stone.', 'Rule out infected ureteral obstruction (fever/SIRS/pyuria + hydronephrosis/stone) — that requires emergency urologic decompression.', 'Choose imaging wisely: POCUS/ultrasound first in young recurrent stone formers and pregnancy; low-dose noncontrast CT for first episode, older age, or diagnostic uncertainty.'],
dontMiss: [['Infected obstructed urinary system', 'critical', 'Fever/systemic illness plus obstruction requires urgent urology drainage and antibiotics—not outpatient stone management.'], ['Ruptured AAA / aortic dissection', 'critical', 'Older patient, hypotension, vascular risk, abdominal/back pain, or pulse deficit: image the aorta.', ['ruptured-abdominal-aortic-aneurysm', 'acute-aortic-syndrome']], ['Pyelonephritis with sepsis', 'critical', 'Fever, flank tenderness, shock, or vomiting warrants sepsis treatment and source-control assessment.'], ['Ectopic pregnancy / ovarian torsion', 'emergent', 'Pregnancy test and pelvic consideration remain essential when anatomy and symptoms fit.', ['ectopic-pregnancy', 'ovarian-torsion']], ['Uncomplicated ureteral stone', 'common', 'Analgesia, hydration advice, urine straining where used, and follow-up depend on size, location, renal function, and symptoms.']],
history: ['Abrupt colicky vs constant tearing pain, radiation to groin/testicle/labia, gross hematuria, dysuria', 'Fever, rigors, intractable vomiting, anuria, solitary or transplant kidney, prior stones/stents', 'Pregnancy possibility, age >60 with smoking/hypertension (AAA mimic), anticoagulation, AFib (renal infarct)'],
exam: ['Vitals (fever, tachycardia, hypotension); abdominal tenderness vs benign soft belly of classic colic', 'CVA tenderness, palpation for pulsatile abdominal mass, femoral pulses', 'Testicular/inguinal exam in males and pelvic consideration in females with lower-quadrant/groin radiation'],
workup: [['Bedside', ['Urinalysis, urine hCG in childbearing potential, and POCUS (hydronephrosis + abdominal aorta <3 cm)', '12-lead ECG if older or AFib/renal-infarct mimic suspected']], ['Labs', ['BMP/creatinine, CBC; add blood/urine cultures and lactate if febrile or SIRS-positive', 'Absence of microscopic hematuria (~10–15% of stones) does not exclude ureterolithiasis']], ['Imaging', [
    "Fever, a solitary kidney or diagnostic uncertainty requires immediate evaluation; ultrasound can miss ureteral stones, so a negative scan cannot settle a concerning presentation.",
    'Low-dose noncontrast CT abdomen/pelvis for first stone, older patients, febrile obstruction, or uncertain diagnosis', 'Renal/pelvic ultrasound (or MRI) first-line in pregnancy; CT with IV contrast if renal infarct or vascular mimic suspected']]],
redFlags: ['Fever, rigors, hypotension, or elevated lactate with flank pain', 'Solitary or transplant kidney, bilateral obstruction, anuria, or acute kidney injury', 'Age >60 with first-ever \u201Crenal colic\u201D (AAA until aorta imaged)', 'Refractory pain or persistent vomiting despite ED analgesia/antiemetics', 'Positive hCG with flank or unilateral lower abdominal pain'],
disposition: [['Discharge', 'Uncomplicated stone (typically <10 mm, especially ≤5 mm) with oral pain/nausea control, normal renal function, no infection, and urology follow-up.'], ['Admit / urology consult', 'Refractory pain/vomiting, significant AKI, solitary kidney with obstruction, proximal stone >10 mm, or uncomplicated pyelonephritis needing IV therapy.'], ['Urgent decompression / OR / ICU', 'Obstructed infected kidney (stent or percutaneous nephrostomy + broad IV antibiotics), ruptured AAA, or septic shock.']],
pitfalls: ['Calling flank pain in an older adult a \u201Cfirst kidney stone\u201D without checking the abdominal aorta.', 'Discharging a febrile or leukocytotic patient with an obstructing stone on oral antibiotics instead of urgent drainage.', 'Assuming a normal urinalysis without hematuria rules out a ureteral stone or AAA.'],
pearls: [
    "Ask the patient to strain urine and retain a recovered stone for analysis; arrange confirmation of stone passage and recovery of baseline renal function.",
    "Observation is appropriate only while uncomplicated: infection, refractory pain, persistent obstruction or worsening renal function requires reassessment for active treatment.",
    "Spontaneous passage depends on both stone size and location; a small distal stone is more likely to pass than a similar proximal stone. Explain the follow-up plan and reasons to return.",
    'An obstructed infected kidney is surgical pus under pressure — antibiotics alone cannot cure it without drainage.', 'NSAIDs (e.g., IV ketorolac) reduce ureteral spasm and renal capsule pressure when renal function and bleeding risk allow.', 'At the bedside, ultrasound the aorta first in anyone over 60 with new flank or back pain.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — renal and genitourinary emergencies', 'EAU/AUA urolithiasis guidelines; ACR Appropriateness Criteria for acute flank pain']
},
{
id: 'urinary-retention', name: 'Urinary Symptoms & Acute Retention', icon: '🚻',
tag: 'Measure the bladder, relieve obstruction safely, and never miss cord compression or sepsis.',
overview: 'Dysuria and retention are often straightforward, but retention can be the first sign of cauda equina, spinal cord disease, medication toxicity, obstructed infection, or a neurologic emergency.',
approach: ['Screen every retention patient for cauda equina/cord compression (back pain, saddle sensory change, bilateral sciatica, leg weakness) before assuming BPH.', 'Confirm bladder volume on bedside ultrasound and decompress promptly with a Foley catheter (or coudé/urology escalation if resistance is met).', 'Check renal function and electrolytes in high-volume or chronic retention, and monitor for post-obstructive diuresis (>200 mL/h for ≥2 consecutive hours).', 'Review culprit medications (anticholinergics, antihistamines, opioids, sympathomimetics, TCAs) and stop offending agents.'],
dontMiss: [['Cauda equina syndrome / spinal cord compression', 'critical', 'Back pain with saddle sensory change, new retention/incontinence, bilateral symptoms, or weakness needs urgent MRI and spine review.'], ['Urosepsis / infected obstruction', 'critical', 'Systemic illness with urinary source needs sepsis treatment and source-control assessment.'], ['Acute kidney injury from obstruction', 'emergent', 'Bilateral obstruction, solitary kidney, anuria, or rising creatinine requires urgent decompression planning.'], ['Prostatitis with retention', 'emergent', 'Fever, pelvic pain, toxic appearance; avoid traumatic repeated instrumentation and involve urology.'], ['UTI / medication-related / BPH-related symptoms', 'common', 'Use targeted therapy and follow-up after excluding high-risk features.']],
history: ['Last void, suprapubic pain vs painless overflow incontinence, weak stream/hesitancy, gross hematuria/clots', 'Back pain, saddle numbness, bilateral leg pain/weakness, fecal incontinence, malignancy history', 'New anticholinergics, opioids, cold remedies, spinal anesthesia/surgery, urethral trauma or stricture history'],
exam: ['Vitals, suprapubic palpation, CVA tenderness, external meatus (blood, phimosis/paraphimosis, stricture)', 'Lower-extremity motor/reflexes, perineal/saddle pinprick sensation, and rectal tone when neurologic cause is plausible', 'Gently assess prostate only when indicated; avoid vigorous prostatic massage in suspected acute bacterial prostatitis'],
workup: [['Bedside', [
    "Blood at the urethral meatus after pelvic trauma needs a urethral-injury pathway, usually retrograde urethrography before catheter passage; avoid blind instrumentation and involve urology.",
    'Bladder ultrasound/scan before catheterization; record immediate drained residual volume', 'Urinalysis + urine culture; 12-lead ECG if hyperkalemia from obstructive AKI is suspected']], ['Labs', ['BMP (creatinine, K⁺), CBC; blood cultures and lactate if febrile or septic', 'PSA is rarely helpful acutely and is falsely elevated in retention/prostatitis']], ['Imaging', ['Renal ultrasound for bilateral hydronephrosis when creatinine is elevated or retention is chronic', 'Emergent lumbar/spine MRI when cauda equina or cord compression is suspected']]],
redFlags: ['Back pain with saddle anesthesia, bilateral radiculopathy, or lower-limb weakness', 'Fever, rigors, hypotension, or acute bacterial prostatitis with retention', 'Post-obstructive AKI, hyperkalemia, or diuresis >200 mL/h for ≥2 hours', 'Gross hematuria with clot retention or urethral blood after trauma', 'Failed Foley/coudé placement or severe urethral pain during attempt'],
disposition: [['Discharge', 'Uncomplicated BPH or drug-induced retention after smooth decompression, normal creatinine, no diuresis, alpha-blocker (e.g., tamsulosin) started when appropriate, and leg-bag/trial-without-catheter follow-up in 3–7 days.'], ['Admit / urology consult', 'Obstructive AKI, pathologically brisk post-obstructive diuresis, clot retention needing continuous bladder irrigation, febrile UTI/prostatitis, or difficult/suprapubic catheterization.'], ['Emergent MRI / spine / ICU', 'Suspected cauda equina/spinal cord compression or septic shock from urinary obstruction.']],
pitfalls: ['Attributing new urinary retention (or overflow incontinence) to BPH or UTI without checking saddle sensation and leg strength.', 'Forcing a standard Foley catheter through a stricture, false passage, or traumatic urethra instead of using a coudé or calling urology.', 'Clamping a draining catheter intermittently — drain completely and monitor for post-obstructive diuresis and transient hypotension.'],
pearls: [
    "Before discharge with a catheter, demonstrate hand hygiene, bag emptying, securement and keeping the bag below bladder level with tubing free of kinks.",
    "Give a contact plan for a blocked or displaced catheter, fever/rigors, new lower abdominal pain or significant bleeding; leakage can indicate blockage rather than simple incontinence.",
    "Confirm the catheter review/removal appointment, required supplies and who to contact after hours; a functioning drainage bag alone is not a complete discharge plan.",
    'Painless retention with overflow incontinence + back pain is cauda equina until MRI says otherwise.', 'Drain acute retention completely; intermittent clamping does not prevent hematuria or hypotension and delays decompression.', 'Start an alpha-1 blocker (e.g., tamsulosin) at catheter placement in BPH retention to improve trial-without-catheter success.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — genitourinary and spinal emergencies', 'AUA acute urinary retention and urethral catheterization guidance; local cauda-equina pathways']
},
{
id: 'edema', name: 'Peripheral Edema', icon: '🦶',
tag: 'Bilateral or unilateral? Volume overload, venous disease, thrombosis, or a systemic cause?',
overview: 'Edema is a finding, not a diagnosis. The high-risk split is acute unilateral swelling that may be DVT or infection versus bilateral edema with heart, renal, hepatic, medication, or low-protein causes.',
approach: ['Split first by symmetry and tempo: acute unilateral swelling is a vascular/infectious problem (DVT, cellulitis, compartment); bilateral swelling is a systemic/hydrostatic/oncotic problem.', 'Check oxygenation, work of breathing, JVP, and lung ultrasound before prescribing diuretics.', 'Use one validated DVT pathway consistently. NICE uses the two-level Wells score: DVT likely → proximal ultrasound first; DVT unlikely → D-dimer first, then ultrasound if positive.', 'Look for preeclampsia/peripartum cardiomyopathy in any pregnant or postpartum patient with new edema plus hypertension, headache, or dyspnea.'],
dontMiss: [['Acute heart failure / pulmonary edema', 'critical', 'Dyspnea, hypoxia, JVP elevation, crackles, or diffuse B-lines require an acute-heart-failure assessment.'], ['DVT with pulmonary embolism', 'critical', 'Unilateral swelling plus chest symptoms, syncope, or hypoxia needs VTE pathway assessment.'], ['Necrotizing infection / compartment syndrome', 'critical', 'Pain out of proportion, rapid progression, bullae, anesthesia, or systemic toxicity.'], ['Acute kidney injury / nephrotic syndrome / hepatic decompensation', 'emergent', 'Generalized edema with oliguria, severe hypertension, ascites, or biochemical derangement.'], ['Chronic venous insufficiency / medication-related edema', 'common', 'Consider after dangerous vascular and systemic causes are excluded.']],
history: [
    "For suspected DVT, record previous DVT, active cancer, recent surgery/immobility and whether another diagnosis explains the swelling; use these findings in the validated probability pathway.",
    'Unilateral vs bilateral onset, calf/thigh pain, erythema, rapid weight gain, orthopnea, PND', 'VTE risks: recent surgery/trauma, immobilization, active cancer, estrogen/pregnancy, prior DVT/PE', 'Heart failure, CKD/nephrotic history, cirrhosis, dihydropyridine CCBs (amlodipine), NSAIDs, steroids'],
exam: ['Vitals, SpO₂, JVP, lung auscultation, cardiac S3/murmurs, ascites', 'Measure calf circumference 10 cm below tibial tuberosity (≥3 cm asymmetry = +1 Wells DVT); check warmth, pitting, and distal pulses', 'Screen for phlegmasia cerulea dolens (massive painful cyanotic limb swelling with arterial compromise) and skin breakdown'],
workup: [['Bedside', ['POCUS: 2-region/3-point lower-extremity compression ultrasound, lung B-lines, IVC/cardiac contractility', '12-lead ECG and urine dipstick (proteinuria screen for nephrotic syndrome)']], ['Labs', ['BMP (creatinine, electrolytes), LFTs, albumin, urinalysis with protein/creatinine ratio when generalized', 'D-dimer according to the selected DVT probability pathway; BNP/NT-proBNP and troponin if heart failure suspected']], ['Imaging', [
    "NICE DVT-likely pathway: a negative proximal scan with a positive D-dimer needs a repeat proximal scan in 6–8 days; document the appointment and return precautions.",
    'Formal duplex venous ultrasound for high-probability DVT or positive D-dimer; CXR if dyspnea/HF suspected']]],
redFlags: ['Concurrent dyspnea, pleuritic chest pain, syncope, or hypoxemia (PE until excluded)', 'Cyanotic, tensely swollen, painful limb with diminished pulses (phlegmasia cerulea dolens)', 'Fever, bullae, crepitus, or pain out of proportion (NSTI)', 'Oliguria/anuria, pulmonary rales, or severe hypertension', 'Pregnant or postpartum patient with headache, visual symptoms, RUQ pain, or BP ≥140/90 mmHg'],
disposition: [['Discharge', 'Uncomplicated DVT suitable for outpatient DOAC with reliable follow-up, or stable chronic/CCB-induced edema after excluding systemic decompensation.'], ['Admit', 'Decompensated heart failure, acute kidney injury/nephrotic crisis, decompensated cirrhosis, cellulitis failing oral therapy, or high-bleed-risk DVT.'], ['Resuscitation / ICU / IR', 'Acute pulmonary edema, PE with hemodynamic instability, phlegmasia cerulea dolens (catheter/surgical thrombectomy), or NSTI.']],
pitfalls: [
    "A limited bedside compression scan is not automatically equivalent to a complete diagnostic pathway; interpret a negative study with its anatomical coverage and pretest probability.",
    'Prescribing loop diuretics for CCB-induced or venous-insufficiency ankle edema and causing hypovolemia/AKI.', 'Ruling out DVT with a negative D-dimer in a high-pretest-probability patient.', 'Missing bilateral iliac/IVC thrombosis or heart failure because swelling is symmetric.'],
pearls: [
    "If definitive DVT testing is delayed, follow a timed local pathway for interim therapeutic anticoagulation after contraindication/bleeding-risk assessment; make the scan and result-review plan explicit.",
    'Unilateral swelling is DVT, ruptured Baker cyst, or cellulitis first; bilateral swelling is heart, kidneys, liver, or drugs first.', 'Amlodipine/nifedipine ankle edema comes from precapillary arteriolar vasodilation, not sodium overload — diuretics rarely fix it.', 'In low-risk proximal DVT, outpatient direct oral anticoagulation (apixaban or rivaroxaban) is safe and effective without bridging.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — peripheral edema, VTE, and heart failure', 'ASH / ACCP VTE guidelines; ACEP acute heart-failure clinical policy']
},
{
id: 'anaphylaxis', name: 'Anaphylaxis & Angioedema', icon: '🆘',
tag: 'Airway, breathing, circulation: epinephrine first when anaphylaxis is suspected.',
overview: 'Anaphylaxis is a clinical diagnosis. Skin findings may be absent; progression of airway, breathing, circulation, or severe gastrointestinal symptoms after an exposure is enough to act. Angioedema may be histamine-mediated or bradykinin-mediated and airway progression matters more than the label.',
approach: ['Give IM epinephrine immediately when anaphylaxis is suspected, into the mid-anterolateral thigh (1 mg/mL). Adults: 0.3–0.5 mg. Children: follow one published standard and state it — US practice parameter (JTFPP): 0.01 mg/kg, max 0.3 mg (use a 0.15 mg device for 7.5–25 kg, a 0.3 mg device for ≥25 kg); UK (RCUK) age bands: 6 months–6 years 0.15 mg, 6–12 years 0.3 mg, >12 years 0.5 mg, <6 months 0.1–0.15 mg. Repeat q5–15 min if needed.', 'Call senior airway help early if voice hoarseness, stridor, drooling, or tongue/floor-of-mouth swelling is present.', 'Keep cardiovascularly unstable patients flat, with legs elevated when appropriate. A semi-recumbent position may help predominantly respiratory symptoms only without cardiovascular instability. Give IV crystalloid boluses and repeat IM epinephrine q5–15 min, or use an expert-led infusion if refractory.', 'Distinguish histamine-mediated angioedema (urticaria, pruritus, allergen) from bradykinin-mediated angioedema (ACE inhibitor, C1-inhibitor deficiency, no hives/itch).'],
dontMiss: [['Anaphylaxis with airway/breathing/circulation involvement', 'critical', 'IM epinephrine and resuscitation per local protocol; prepare for a difficult airway.'], ['Rapidly progressive tongue/laryngeal angioedema', 'critical', 'Voice change, drooling, stridor, or inability to manage secretions requires immediate expert airway planning.'], ['Refractory shock', 'critical', 'Escalate to monitored resuscitation and vasopressor/critical-care pathway after repeated IM treatment and fluids per protocol.'], ['Bradykinin-mediated angioedema', 'emergent', 'ACE-inhibitor or hereditary pattern may lack urticaria and respond poorly to antihistamines; airway management remains central.'], ['Isolated urticaria', 'common', 'No airway, breathing, circulation, or severe GI involvement; still give explicit escalation advice.']],
history: ['Trigger and timing: food, medication, insect venom, IV contrast, exercise cofactor, or ACE inhibitor (can occur years after starting)', 'Prior anaphylaxis, poorly controlled asthma, mastocytosis, beta-blocker use (blunts epinephrine response)', 'Hoarseness, dysphagia, throat tightness, wheeze, repetitive vomiting/cramps, dizziness/syncope'],
exam: ['Voice quality, ability to swallow saliva, stridor, uvular/tongue/floor-of-mouth vs isolated lip edema', 'Work of breathing, bronchospasm/wheeze, capillary refill, and blood pressure', 'Inspect skin for urticaria/flushing — remember 10–20% of anaphylaxis has no skin findings initially'],
workup: [['Bedside', ['Continuous SpO₂ and cardiac/BP monitoring with frequent airway reassessment; prepare expert airway support if lingual/laryngeal swelling develops', 'Treat clinically first — never delay IM epinephrine for blood tests or IV access']], ['Labs', ['Serum tryptase within 1–3 hours only if diagnostic uncertainty exists later; blood gas/lactate in shock', 'C4 and C1-esterase inhibitor levels if hereditary angioedema is suspected (send, do not wait for results)']], ['Imaging', ['Not indicated acutely; use flexible nasolaryngoscopy by an experienced operator if laryngeal involvement is uncertain in a stable patient']]],
redFlags: ['Stridor, hoarseness, drooling, or tongue/floor-of-mouth/uvular swelling', 'Hypotension, syncope, cyanosis, or silent/severe bronchospasm', 'Need for ≥2 doses of epinephrine or fluid-refractory shock', 'Severe baseline asthma or beta-blocker therapy (consider glucagon 1–5 mg IV if refractory)', 'ACE-inhibitor or hereditary angioedema progressing beyond the anterior lips'],
disposition: [['Discharge', 'Complete symptom resolution after risk-stratified observation (often 4–6 h, or shorter if single-dose rapid resolution without risk factors per guidelines), 2 epinephrine autoinjectors, written action plan, and allergy referral.'], ['Admit / monitored observation', 'Protracted or biphasic risk (≥2 epinephrine doses, severe asthma, hypotension at presentation, late-night presentation alone), or palatal/mild tongue angioedema.'], ['Resuscitation / ICU / OR airway', 'Airway compromise, lingual/laryngeal progression, epinephrine infusion requirement, or refractory shock.']],
pitfalls: [
    "Do not let a recovering patient stand or walk suddenly; posture changes can precipitate cardiovascular collapse.",
    "A normal tryptase does not exclude anaphylaxis, and sampling must never delay treatment.",
    'Giving H1/H2 antihistamines or corticosteroids first and delaying IM epinephrine.', 'Sitting a profoundly hypotensive anaphylaxis patient upright abruptly (empty-ventricle cardiac arrest).', 'Expecting antihistamines and steroids to stop ACE-inhibitor or hereditary bradykinin angioedema.'],
pearls: [
    "Persistent airway, breathing or circulation problems after two appropriate IM epinephrine doses need expert-led refractory-anaphylaxis care; use a monitored IV infusion pathway, not routine IV boluses.",
    "Before discharge, check autoinjector technique with a trainer, provide an action plan, explain when to use it and seek emergency care, and arrange allergy follow-up.",
    'IM epinephrine into the vastus lateralis is the only first-line life-saving medication in anaphylaxis; steroids do not reliably prevent biphasic reactions.', 'Absence of hives does not rule out anaphylaxis — hypotension or bronchospasm after a likely allergen is enough.', 'In angioedema, anterior lip swelling is usually lower risk, whereas tongue, floor-of-mouth, or voice change demands early awake airway planning.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — allergy, anaphylaxis, and angioedema', 'WAO / AAAAI 2020–2023 Anaphylaxis Practice Parameter (biphasic observation & epinephrine first); ACEP angioedema guidance']
},
{
id: 'multiple-trauma', name: 'Multiple Trauma / Primary Survey', icon: '🚑',
tag: 'Treat immediate threats in order; reassess after every intervention.',
overview: 'Major trauma is a time-critical systems problem. A structured primary survey prevents fixation on a visible injury while airway obstruction, tension physiology, hemorrhage, brain injury, or pelvic bleeding progresses.',
approach: ['Activate the trauma team and follow xABCDE: control catastrophic external bleeding first, then Airway + C-spine, Breathing, Circulation, Disability, and Exposure/environment.', 'Decompress tension pneumothorax clinically, apply a pelvic binder at the greater trochanters for suspected pelvic hemorrhage, and keep the patient warm.', 'Activate the local major hemorrhage protocol for suspected life-threatening bleeding. Give blood components per protocol, monitor ionized calcium and give TXA promptly when indicated within 3 hours of injury.', 'If suspected hemorrhage causes persistent instability despite resuscitation, limit imaging to what directs immediate bleeding control. Stable patients and sustained responders can proceed to indicated CT.'],
dontMiss: [['Catastrophic hemorrhage', 'critical', 'Tourniquet/pressure/pelvic stabilization and massive-transfusion pathway per local protocol; definitive control is surgical/IR.'], ['Tension pneumothorax / massive hemothorax', 'critical', 'Treat clinically in an unstable patient; do not wait for imaging.', ['tension-pneumothorax']], ['Traumatic brain injury with herniation risk', 'critical', 'Prevent hypoxia and hypotension; urgent neuro/trauma input.'], ['Unstable pelvic, abdominal, or vascular injury', 'critical', 'Shock after blunt/penetrating trauma needs rapid source-control decisions.'], ['Spinal cord injury / airway burn', 'emergent', 'Immobilize selectively by mechanism and examination; plan early airway support for inhalation injury.']],
history: ['AMPLE history, exact time of injury (3-h TXA window), mechanism (high-speed MVC, ejection, fall height, penetrating weapon)', 'Prehospital vital trends, GCS trajectory, tourniquet application time, blood/fluids given', 'Anticoagulants/antiplatelets, beta-blockers (mask tachycardia), pregnancy status, tetanus status'],
exam: ['Primary survey (xABCDE) with continuous vital reassessment after every maneuver', 'Chest wall symmetry, breath sounds, subcutaneous emphysema; abdomen and single gentle pelvic stability check (do not rock the pelvis)', 'GCS + pupils, four-limb motor/sensory, hard signs of vascular injury, full exposure + log-roll with normothermia protection'],
workup: [['Bedside', ['eFAST (pericardial, RUQ, LUQ, pelvis, bilateral anterior pleura), bedside glucose, and core temperature', 'Use portable chest or pelvic imaging in unstable blunt trauma when the result will direct immediate intervention']], ['Labs', ['Type & crossmatch (activate MTP early), VBG/ABG with base deficit and lactate, ionized calcium, CBC, coagulation/TEG/ROTEM', 'Urine/serum hCG in all females of childbearing potential; urinalysis for gross hematuria']], ['Imaging', ['Consider whole-body CT for adults with blunt major trauma and suspected multiple injuries when physiology permits. Select imaging by suspected injuries in children.']]],
redFlags: ['Shock index (HR/SBP) ≥1.0, SBP <90 mmHg, base deficit >6 mEq/L, or rising lactate', 'Penetrating injury to neck, thorax, abdomen, or junctional groin/axilla', 'Unilateral absent breath sounds, subcutaneous emphysema, or pericardial fluid on eFAST', 'GCS ≤8, drop in GCS ≥2 points, or asymmetric/dilated pupil', 'Hard signs of vascular injury (pulsatile bleeding, expanding hematoma, absent distal pulse, thrill/bruit)'],
disposition: [['Discharge', 'Isolated low-energy injury with negative validated clinical decision rules (NEXUS/CCR, Canadian CT Head), normal serial exams, and safe home observation.'], ['Admit / trauma service', 'Rib/sternal fractures, solid-organ injury managed nonoperatively, observation for hollow-viscus injury, anticoagulated head strike, or geriatric frailty.'], ['OR / IR / trauma ICU', 'Hemodynamic instability with positive eFAST/peritonitis, massive hemothorax (>1500 mL initial or >200 mL/h × 2–4 h), unstable pelvic hemorrhage, TBI needing neurosurgery, or hard vascular signs.']],
pitfalls: [
    "A negative eFAST leaves intraperitoneal and retroperitoneal bleeding possible. Proceed with indicated CT when the patient is stable enough.",
    "Permissive hypotension requires patient selection. In severe traumatic brain injury, prioritize adequate cerebral perfusion.",
    'Completing a detailed secondary survey or suturing lacerations before controlling hemorrhage or decompressing tension pneumothorax.', 'Giving large volumes of cold crystalloid instead of blood products, calcium, and active warming (worsening the lethal diamond of hypothermia, acidosis, coagulopathy, and hypocalcemia).', 'Sending a hemodynamically unstable non-responder to the CT scanner (\u201Cdonut of death\u201D) instead of the OR or IR suite.'],
pearls: [
    "When immediate CT is indicated and the patient is ready, avoid delaying it for a screening FAST or routine plain films.",
    "After initial empiric blood components, tailor transfusion to ongoing bleeding and available coagulation or viscoelastic results.",
    'Any change in status (intubation, transport, hypotension) resets you to the top of the primary survey (ABCDE).', 'During massive transfusion, check and replace ionized calcium frequently — citrate in blood products chelates calcium and worsens shock and coagulopathy.', 'In suspected severe TBI, protect oxygenation and cerebral perfusion during resuscitation and transfer.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — multiple trauma and trauma systems', 'ACS ATLS 10th ed. principles; CRASH-2 / CRASH-3 trials; local trauma and massive-transfusion protocols']
},
{
id: 'falls-geriatric-trauma', name: 'Falls & Geriatric Trauma', icon: '🧓',
tag: 'A fall may be injury, syncope, medication harm, infection, or a sentinel loss of function.',
overview: 'Older adults can have major injury and serious medical precipitants after low-energy mechanisms. Pain and examination may be muted; anticoagulation, frailty, baseline cognition, and safe disposition matter as much as the initial radiograph.',
approach: ['Always ask two parallel questions: (1) What injuries did the fall cause? and (2) What medical emergency caused the fall?', 'Have a low threshold for head CT and C-spine CT in older adults, especially with anticoagulants/antiplatelets, cognitive change, or supra-clavicular trauma.', 'Persistent suspicion of hip fracture after adequate negative X-rays: NICE prefers MRI; if unavailable within 24 h or contraindicated, consider CT. Maintain injury precautions.', 'Assess safe mobility with the usual aid once injury precautions allow, alongside medication/delirium review and the support available at discharge; do not force weight-bearing when fracture remains suspected.'],
dontMiss: [['Intracranial hemorrhage', 'critical', 'Head strike, anticoagulation, altered baseline, vomiting, or new neurologic symptom warrants a low imaging threshold and local pathway.'], ['Hip/pelvic fracture', 'critical', 'Persistent hip/groin pain or inability to bear weight can be occult despite normal initial radiographs.'], ['Syncope/arrhythmia/ACS/stroke as precipitant', 'critical', 'An unexplained fall may be transient loss of consciousness or neurologic event.'], ['Cervical-spine injury', 'emergent', 'Neck pain, neurologic symptoms, distracting injury, or unreliable assessment needs imaging per local rule/pathway.'], ['Delirium, infection, medication toxicity, dehydration', 'emergent', 'Often the cause of the fall and a marker of unsafe discharge.']],
history: ['Exact mechanics (trip vs sudden legs giving way/syncope), witnesses, prodrome, head strike, and total time on the floor (rhabdomyolysis risk)', 'Baseline cognition and mobility (cane/walker), living situation, and high-risk meds (DOACs, warfarin, dual antiplatelets, antihypertensives, sedatives)', 'Preceding chest pain, palpitations, dyspnea, melena, focal weakness, or acute confusion'],
exam: [
    "When safe, include lying/standing BP, vision, footwear, cognition, nutrition and gait/balance in the falls assessment; tailor examination to pain and injury precautions.",
    'Head-to-toe trauma survey: scalp hematomas, C-spine tenderness, rib/chest wall pain, pelvis/hip rotation and axial-loading pain', 'Compare cognition against baseline (4AT/bCAM delirium screen); full focal neurologic exam', 'Supervised ambulation trial once spine/hip injury is excluded — inability to walk safely is an admission criterion until resolved'],
workup: [['Bedside', ['12-lead ECG (silent MI, bradyarrhythmia, QTc, block), capillary glucose, and postural vitals when safe', 'POCUS for rib fractures/hemothorax, bladder retention, or free fluid as indicated']], ['Labs', ['CBC, BMP, CK (if prolonged floor lie), coagulation/INR if on warfarin, troponin if syncope or cardiac risk', 'Urinalysis only when dysuria, fever, or systemic sepsis features exist — avoid reflexly blaming asymptomatic bacteriuria']], ['Imaging', ['Noncontrast head CT + C-spine CT for head strike, anticoagulation, age ≥65 rule triggers, or altered baseline', 'AP pelvis + hip radiographs; persistent hip-fracture suspicion despite negative films → MRI preferred; consider CT if MRI unavailable within 24 h or contraindicated']]],
redFlags: ['Anticoagulant or antiplatelet therapy with head impact or any supra-clavicular injury', 'Persistent inability to bear weight or painful hip internal/external rotation despite negative X-ray', 'Unwitnessed collapse, facial fractures (lack of protective hand-out), or preceding palpitations/chest pain', 'New delirium, prolonged floor lie (>1 h), CK elevation, or rib fractures in a frail patient', 'Inability to ambulate safely at baseline or lack of safe caregiver support'],
disposition: [['Discharge', 'No acute fracture or intracranial bleed, benign ECG/medical workup, successful ambulation test at baseline, culprit medications reviewed, and PT/falls follow-up arranged.'], ['Admit / geriatric observation', 'Occult hip fracture workup, multiple rib fractures (pain/incentive spirometry), delirium/medical precipitant, anticoagulated head trauma per local observation policy, or failed mobility trial.'], ['Trauma / neurosurgery / ICU', 'Intracranial hemorrhage (reverse anticoagulation immediately), unstable spine/pelvic fracture, operative hip fracture with instability, or cardiac syncope.']],
pitfalls: [
    "A falls-risk score cannot replace assessment of the individual causes and modifiable risks.",
    'Labeling an unexplained geriatric fall \u201Cmechanical\u201D without obtaining an ECG or asking whether they fainted first.', 'Discharging an older patient who cannot walk after a negative hip X-ray — up to 5–10% of hip fractures are radiographically occult.', 'Underestimating ground-level rib fractures in older adults (high pneumonia and respiratory failure mortality).'],
pearls: [
    "Frailty, injury needing treatment, loss of consciousness, inability to get up unaided or recurrent falls should trigger comprehensive falls assessment or an arranged referral.",
    "Link identified risks to action: structured medication review, tailored strength/balance work and home-hazard assessment when indicated; involve the patient and carers in the follow-up plan.",
    'Facial trauma without hand injuries in an older adult suggests syncope (no time to break the fall).', 'A negative hip X-ray does not settle persistent fracture suspicion; arrange definitive imaging and a safe disposition.', 'Assess baseline versus current mobility when safe; if testing is limited by suspected injury, arrange supported investigation and disposition instead of forcing a walking trial.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — geriatric emergency and trauma care', 'Geriatric ED Guidelines (ACEP/AGS/ENA/SAEM); Canadian CT Head & C-Spine rules']
},
{
id: 'pregnancy-emergency', name: 'Pregnancy-Related Emergency', icon: '🤰',
tag: 'Pregnancy status changes the differential, imaging, medications, destination, and team.',
overview: 'Pregnant and postpartum patients can present with the same emergencies as anyone else plus pregnancy-specific catastrophes. The ED must stabilize first, establish gestational/postpartum context, and involve obstetric expertise early under local pathways.',
approach: ['Confirm pregnancy status and gestational age or time since delivery. Consider postpartum preeclampsia, VTE and cardiomyopathy based on symptoms and timing.', 'Stabilize the mother first: left uterine displacement at ≥20 weeks, oxygen to keep SpO₂ ≥95%, and early obstetrics/anesthesia/neonatology activation.', 'Repeat severe BP promptly. Treat confirmed persistent SBP ≥160 or DBP ≥110 mmHg as soon as possible within 30–60 minutes using the obstetric pathway (IV labetalol, IV hydralazine or immediate-release oral nifedipine). Use IV magnesium sulfate for eclampsia or seizure prophylaxis in preeclampsia with severe features.', 'Never withhold indicated maternal life-saving imaging (CTA, head CT, trauma CT) or resuscitation because the patient is pregnant.'],
dontMiss: [['Ruptured ectopic pregnancy', 'critical', 'Pain/bleeding with positive pregnancy test and instability is a surgical emergency.', ['ectopic-pregnancy']], ['Severe preeclampsia / eclampsia', 'critical', 'Severe hypertension, headache, visual symptoms, RUQ pain, dyspnea, seizure, or postpartum presentation needs immediate obstetric protocol.'], ['Obstetric hemorrhage / placental abruption', 'critical', 'Bleeding, pain, uterine tenderness, shock, or trauma requires resuscitation and obstetric escalation.'], ['Pulmonary embolism / peripartum cardiomyopathy', 'critical', 'Dyspnea, chest symptoms, syncope, hypoxia, or new heart-failure signs require urgent evaluation.'], ['Hyperemesis, UTI, uncomplicated early-pregnancy symptoms', 'common', 'Assess oral intake, hydration, electrolytes, infection and obstetric context; ketonuria does not grade hyperemesis severity. Give thiamine in prolonged vomiting/poor intake, especially before planned dextrose; never delay correction of hypoglycemia.']],
history: [
    "Ask about hypertension in pregnancy, antihypertensives and the last BP check. New postpartum headache or visual symptoms need prompt BP measurement.",
    'Gestational age (LMP vs dating ultrasound), gravidity/parity, days/weeks postpartum, prior ectopic/cesarean/placenta previa', 'Vaginal bleeding, abdominal/pelvic/shoulder-tip pain, contractions, gush of fluid, fetal movement (≥20 weeks)', 'Headache, scotomata, RUQ/epigastric pain, orthopnea/dyspnea, unilateral leg swelling, minor or major trauma'],
exam: ['Maternal vitals (normal pregnancy lowers BP; \u201Cnormal\u201D BP may mask early shock; BP ≥140/90 is abnormal) with left uterine displacement if ≥20 weeks', 'Fundal height (umbilicus ≈ 20 weeks), uterine tone/tenderness; avoid digital vaginal exam in 2nd/3rd-trimester bleeding until placenta previa is excluded by ultrasound', 'Clonus/hyperreflexia, pulmonary rales/JVP, calf asymmetry, and fetal heart rate after maternal stabilization'],
workup: [['Bedside', ['Urine/serum hCG, bedside glucose, 12-lead ECG, and POCUS (free peritoneal fluid + intrauterine pregnancy / fetal heart activity)', 'Continuous cardiotocographic monitoring at viable gestational age (typically ≥20–24 weeks) per OB protocol']], ['Labs', ['CBC, type & screen + Rh status, coagulation/fibrinogen (low fibrinogen <200 mg/dL warns of severe obstetric hemorrhage/DIC)', 'BMP, AST/ALT, LDH, uric acid, and urine protein/creatinine ratio when preeclampsia/HELLP is suspected']], ['Imaging', ['Pelvic/transvaginal ultrasound for early pregnancy bleeding/pain or placental localization', 'Compression venous ultrasound, V/Q or low-dose CTPA for suspected PE, and head CT/MRI for eclampsia/stroke — do not withhold critical maternal scans']]],
redFlags: ['Positive hCG with hypotension, syncope, shoulder-tip pain, or free fluid on RUQ/pelvic ultrasound', 'SBP ≥160 or DBP ≥110 mmHg, seizure, persistent headache, visual change, RUQ pain, or pulmonary edema (up to 6 weeks postpartum)', 'Second/third-trimester bleeding, painful woody uterus (abruption), or fibrinogen <200 mg/dL', 'Any trauma at ≥20 weeks (abruption risk even with minor maternal findings)', 'Postpartum dyspnea, orthopnea, chest pain, or hypoxia (PE or peripartum cardiomyopathy)'],
disposition: [['Discharge', 'Discharge depends on the diagnosis, clinical stability, symptom control and reliable follow-up. For stable pregnancy of unknown location, arrange serial hCG and reassessment through the local early-pregnancy pathway with written emergency return instructions.'], ['Admit / L&D / obstetric unit', 'Preeclampsia, 2nd/3rd-trimester bleeding, trauma needing obstetric observation and fetal monitoring based on viability and findings, pyelonephritis in pregnancy, or severe hyperemesis with electrolyte derangement.'], ['Resuscitation / OR / ICU', 'Ruptured ectopic pregnancy, eclampsia/HELLP, massive obstetric hemorrhage, amniotic fluid embolism, peripartum cardiomyopathy, or maternal cardiac arrest. For an in-hospital arrest, perform indicated resuscitative delivery where the arrest occurs.']],
pitfalls: [
    "A previously reassuring hCG trend does not override new pain, bleeding or syncope in a pregnancy of unknown location. Reassess symptoms urgently.",
    'Performing a digital pelvic exam in second- or third-trimester vaginal bleeding before ultrasound excludes placenta previa.', 'Dismissing a postpartum patient with headache, hypertension, or dyspnea because \u201Cshe already delivered.\u201D', 'Delaying maternal CT/CTA or surgery out of misplaced fear of fetal radiation in a life-threatening emergency.'],
pearls: [
    "For viable pregnancy after trauma, EAST conditionally recommends at least 4–6 hours of formal observation. Coordinate duration and fetal assessment with obstetrics based on symptoms and monitoring findings.",
    "Remove fetal monitors during maternal cardiac arrest and focus on maternal CPR, airway management and preparation for indicated delivery.",
    'Never do a digital vaginal exam in late-pregnancy bleeding until placenta previa is ruled out on ultrasound.', 'In maternal cardiac arrest with the fundus at or above the umbilicus, provide manual left uterine displacement during supine CPR. Prepare for resuscitative delivery at recognition, aiming to complete it by 5 minutes if ROSC is absent.', 'Postpartum eclampsia and peripartum cardiomyopathy frequently present days to weeks after hospital discharge.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — emergencies in pregnancy', 'ACOG Practice Bulletins (ectopic pregnancy, gestational hypertension/preeclampsia, obstetric hemorrhage); AHA maternal resuscitation guidance']
},
{
id: 'pediatric-respiratory-distress', name: 'Child with Respiratory Distress', icon: '🧒',
tag: 'Appearance and work of breathing matter more than the first saturation.',
overview: 'Children compensate until they do not. Recognize respiratory distress early, distinguish upper from lower airway disease, and prepare for failure when fatigue, altered mental status, or poor air entry appears.',
approach: ['Start at the doorway with the Pediatric Assessment Triangle (PAT): Appearance, Work of breathing, and Circulation to skin.', 'Keep the distressed child calm in the caregiver\u2019s arms — agitation dramatically increases oxygen demand and dynamic airway collapse.', 'Localize by sound: inspiratory stridor = upper airway (croup, foreign body, anaphylaxis); expiratory wheeze = lower airway (asthma, bronchiolitis); grunting = alveolar disease (pneumonia, edema); tachypnea without lung findings = metabolic acidosis (DKA, sepsis, myocarditis).', 'Escalate early to HFNC, NIV, or weight-based airway intervention before exhaustion, silent chest, or bradypnea occurs.'],
dontMiss: [['Impending respiratory failure', 'critical', 'Exhaustion, altered responsiveness, apnea, cyanosis, poor air entry, or a normalizing respiratory rate after severe distress.'], ['Upper-airway obstruction / epiglottitis / bacterial tracheitis', 'critical', 'Stridor at rest, drooling, toxic appearance, tripod position, or voice change needs expert airway planning.'], ['Foreign body aspiration', 'critical', 'Sudden onset or focal unilateral findings after choking can have a normal initial radiograph.'], ['Anaphylaxis', 'critical', 'Airway/breathing/circulation symptoms after exposure require immediate local anaphylaxis protocol.'], ['Asthma, bronchiolitis, pneumonia', 'common', 'Treat and reassess work of breathing, feeding, hydration, and oxygen requirement objectively.']],
history: ['Age, prematurity/chronic lung disease, immunization status, and current feeding/wet-diaper output (<50% normal intake signals moderate–severe distress)', 'Sudden choking/coughing episode (foreign body), barking cough (croup), allergen exposure, or fever', 'Apneic pauses (especially infants <2 months with RSV/bronchiolitis), lethargy, prior PICU admissions'],
exam: ['PAT: tone, interactiveness, consolability, gaze, cry; nasal flaring, subcostal/suprasternal/head-bobbing retractions, grunting', 'Auscultate air entry and symmetry: stridor vs wheeze vs focal crackles vs silent chest', 'Check liver edge/gallop (myocarditis/CHD mimic of bronchiolitis), capillary refill, and hydration'],
workup: [['Bedside', [
    "In bronchiolitis, consider suction for secretions impairing feeding or breathing; avoid routine suction.",
    "Assess feeding, hydration, apnea risk and respiratory effort alongside saturation before discharge.",
    'Continuous pulse oximetry, respiratory-score reassessment after suctioning/bronchodilators, and bedside glucose in any lethargic or tachypneic child', 'Selective nasal suctioning when secretions impair feeding/breathing; weight-based therapy for the diagnosed condition (dexamethasone ± nebulized epinephrine for croup; SABA + ipratropium + steroid for asthma)']], ['Labs', ['Routine labs/blood gases are rarely needed in typical bronchiolitis or mild–moderate croup/asthma', 'Obtain VBG, glucose/ketones, lactate, and sepsis workup if lethargic, toxic, or Kussmaul breathing without lung findings']], ['Imaging', ['Avoid routine CXR in classic bronchiolitis or mild croup', 'Obtain CXR (including bilateral decubitus/expiratory views if cooperative) for suspected foreign body, focal asymmetry, toxic pneumonia, or cardiomegaly']]],
redFlags: ['Lethargy, hypotonia, poor eye contact, or inconsolable agitation (hypoxia/hypercapnia)', 'Apnea, cyanosis, grunting, head bobbing, silent chest, or slowing respiratory rate', 'Stridor at rest, drooling, tripod posture, or inability to drink/breastfeed (<50% usual intake)', 'Sudden-onset distress after a choking episode or unilateral decreased breath sounds', 'Infant <6–8 weeks, history of prematurity <32 weeks, congenital heart disease, or SpO₂ <90–92%'],
disposition: [['Discharge', 'Stable child with adequate intake, condition-specific oxygen/observation criteria met and reliable caregivers. Use age/risk-specific bronchiolitis criteria; observe 2–4 h after nebulized epinephrine for croup per local protocol.'], ['Admit (pediatric ward)', 'Persistent hypoxemia, moderate retractions, inability to maintain oral hydration, high-risk infant (apnea risk), or incomplete asthma response.'], ['Resuscitation / PICU / OR bronchoscopy', 'Impending respiratory failure, HFNC/NIV/intubation need, bacterial tracheitis/epiglottitis, severe status asthmaticus, or airway foreign body.']],
pitfalls: ['Being reassured by a slowing respiratory rate and quieter chest in an exhausted child.', 'Ordering routine chest X-rays, albuterol, or steroids for uncomplicated infant viral bronchiolitis when nasal suctioning, hydration, and oxygen/HFNC are what help.', 'Missing DKA or myocarditis in a tachypneic child with clear lungs (or hepatomegaly/gallop).'],
pearls: [
    "NICE bronchiolitis discharge: clinically stable, adequate intake and room-air SpO₂ over 90% at ≥6 weeks, or over 92% under 6 weeks/with underlying conditions, for 4 hours including sleep.",
    "Explain return signs: apnea, cyanosis, exhaustion, worsening recession or poor intake; confirm caregivers can obtain help.",
    'In pediatrics, tachypnea with clear lungs is DKA, sepsis, salicylates, or myocarditis until glucose and exam prove otherwise.', 'In bronchiolitis, consider nasal suction for obstructing secretions affecting feeding or breathing; avoid routine suction in every infant.', 'Bradypnea in a distressed child is an ominous pre-arrest sign — bag-mask ventilate and call for senior airway help immediately.'],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — pediatric respiratory emergencies', 'AAP Bronchiolitis Clinical Practice Guideline; PALS guidelines; GINA 2026 pediatric asthma']
},
{
id: 'cardiac-arrest', name: 'Cardiac Arrest & Peri-Arrest (ACLS)', icon: '🫀',
tag: 'High-quality CPR, shock the shockable, find and fix the reversible cause.',
overview: 'Cardiac arrest care is a sequence, not a diagnosis: start compressions, attach a defibrillator, and follow the rhythm branch. Shockable rhythms are VF and pulseless VT — defibrillate early; non-shockable rhythms are asystole and PEA — give epinephrine and hunt the cause. Perfusing peri-arrest rhythms (unstable bradycardia and tachycardia) get treated before they become an arrest. In every arrest, correct the reversible cause rather than escalating drugs alone.',
approach: [
    'Start high-quality chest compressions immediately: 100–120/min, depth 5–6 cm, full recoil, minimise interruptions.',
    'Attach the monitor/defibrillator and analyse the rhythm as soon as it is available.',
    'Shockable (VF/pVT): defibrillate, resume compressions, give epinephrine after the second shock, amiodarone/lidocaine after the third.',
    'Non-shockable (PEA/asystole): epinephrine early, continue compressions, and actively hunt the reversible cause.',
    'Treat unstable bradycardia per ACLS. For instability caused by a tachyarrhythmia with a pulse, use synchronized cardioversion when appropriate. Sustained polymorphic VT requires immediate unsynchronized defibrillation.'
],
dontMiss: [
    ['Ventricular fibrillation / pulseless VT', 'critical', 'Shockable rhythm. Defibrillate as early as possible; each minute of delay reduces survival. Resume compressions immediately after the shock without pausing to check a pulse for rhythm.'],
    ['Pulseless electrical activity', 'critical', 'Organised rhythm without a pulse. Treat as a reversible-cause problem: hypoxia, hypovolaemia, hypo/hyperkalaemia, hypothermia, H⁺ (acidaemia), toxins, tamponade, tension pneumothorax, thrombosis (coronary/pulmonary).'],
    ['Unstable bradycardia', 'critical', 'Bradycardia with hypotension, ischaemia, altered mental status, or shock — atropine 1 mg IV (repeat to max 3 mg), then transcutaneous pacing and/or a dopamine or epinephrine infusion.'],
    ['Unstable tachycardia', 'critical', 'Identify whether the tachyarrhythmia is causing shock, ischemia, acute heart failure or altered mentation. Use rhythm-specific electrical treatment promptly.'],
    ['Tension pneumothorax / cardiac tamponade', 'critical', 'Both can cause PEA. Treat suspected tension with emergency pleural decompression. For tamponade, arrange cause-specific drainage and involve the trauma or cardiac surgical team when bleeding or dissection is suspected.', ['tension-pneumothorax', 'cardiac-tamponade']],
    ['Hyperkalaemia / toxicologic arrest', 'critical', 'Treat the suspected reversible cause alongside CPR and indicated shocks. Follow the local hyperkalemic arrest or toxicology pathway as appropriate.']
],
history: ['Collapse circumstances and bystander CPR; downtime and any ROSC', 'Witnessed vs unwitnessed; any prodrome (chest pain, palpitations, syncope)', 'Comorbidities: dialysis, heart failure, prior arrhythmia, implanted device', 'Drugs and toxins: QT-prolonging agents, sodium-channel blockers, opioids', 'Recent fever/infection, immobilisation, immobility (thrombosis), temperature exposure'],
exam: ['Confirm unresponsiveness, absent normal breathing, and no pulse (≤10 s)', 'Rhythm on the monitor; check for a shockable rhythm and any organised electrical activity', 'Airway: patency, obvious obstruction, vomit/blood', 'Chest: symmetrical expansion, breath sounds, subcutaneous emphysema', 'Neck veins, heart sounds, and abdominal distension (obstructive/haemorrhagic causes)', 'Temperature; skin (rash, cyanosis, needle marks)', 'After ROSC: neurological, pupils, 12-lead ECG, end-tidal CO₂ trend'],
workup: [['Bedside', ['Use waveform capnography to confirm and monitor endotracheal tube placement. An abrupt ETCO₂ rise can support recognition of ROSC. Interpret low values in context.', 'Point-of-care glucose and potassium, ABG/VBG', 'Experienced clinicians may use POCUS for a suspected reversible cause when it can be done without prolonging interruptions in CPR']], ['Labs', ['Potassium, glucose, blood gas, lactate, troponin', 'Toxicology screen when the story suggests poisoning', 'Type & screen and coagulation if haemorrhage is possible']], ['Imaging', ['CXR after ROSC and tube placement; look for pneumothorax and tube position', 'Obtain a 12-lead ECG promptly after ROSC. Seek emergency coronary assessment for persistent ST elevation or an equivalent pattern when a cardiac cause is suspected.']]],
redFlags: ['Any organised rhythm on the monitor without a pulse (PEA — look for the reversible cause)', 'Tracheal deviation, unilateral absent breath sounds, or distended neck veins during PEA', 'Hyperkalaemia on the gas in a dialysis patient', 'Sodium-channel-blocker toxidrome (wide QRS) in an overdose', 'A patient who arrests and shows no reversible cause — reconsider hypoxia and volume'],
disposition: [['ROSC — ICU', 'Stabilize oxygenation, ventilation and perfusion, then treat the cause. Use protocolized temperature control for patients who remain unable to follow commands after ROSC.'],
['ROSC with persistent ST elevation or equivalent', 'Emergency coronary angiography is indicated when a cardiac cause is suspected and ST elevation persists, regardless of coma.'],
['Refractory arrest', 'Continue high-quality CPR, consider ECPR/extracorporeal CPR where available, and treat reversible causes. Termination decisions follow the local protocol and clinical context, never a single number.']],
pitfalls: [
    "Early coma after ROSC is an unreliable standalone prognostic sign. Use delayed multimodal assessment after confounders such as sedation and temperature effects are addressed.",
    'Interrupting compressions to check a pulse or a rhythm for more than 10 s.', 'A single shock followed by a long pulse check instead of immediate resumed compressions.', 'Hyperventilation (raising intrathoracic pressure and lowering coronary perfusion).', 'Forgetting the reversible cause — "give more epinephrine" is not a diagnosis.', 'Missing a tension pneumothorax or tamponade in PEA because the team is looking at the rhythm instead of the patient.'],
pearls: [
    "After ROSC, use 100% oxygen until SpO₂ or PaO₂ can be measured reliably. Then titrate to the AHA adult SpO₂ range of 90–98% and avoid hypoxemia.",
    "Without ST elevation, consider emergency coronary angiography selectively for suspected cardiac etiology with cardiogenic shock, recurrent ventricular arrhythmias or significant ongoing ischemia.",
    "Check that synchronization markers track QRS complexes before each synchronized shock. Some devices require synchronization to be re-enabled after a shock.",
    'Shockable rhythms get electricity; non-shockable rhythms get epinephrine and a cause hunt.', 'Use ETCO₂ trends alongside CPR quality and the clinical context. An isolated ETCO₂ reading cannot determine when to stop resuscitation.', 'Use exposure history and the clinical and ECG pattern to identify likely sodium-channel blocker toxicity. QRS widening alone has several possible causes.', 'Reassess the arrest cause after ROSC using the ECG, clinical history, hemodynamics and targeted imaging.'],
doses: [
    ['Shock energy & compression', ['Defibrillation (VF/pVT): biphasic 120–200 J (per device); if unknown, use the maximum', 'AHA 2025 initial synchronized energy: AF or atrial flutter 200 J, regular narrow-complex tachycardia or monomorphic VT 100 J. Sustained polymorphic VT needs an unsynchronized high-energy shock.', 'Compressions 100–120/min, depth 5–6 cm, full recoil, ≤10 s pauses']],
    ['Arrest drugs', ['Epinephrine 1 mg IV/IO every 3–5 min (shockable: after the second shock; non-shockable: as early as possible)', 'Amiodarone 300 mg IV/IO bolus after the third shock, then 150 mg; or lidocaine 1–1.5 mg/kg then 0.5–0.75 mg/kg', 'Magnesium sulfate 1–2 g IV/IO for torsades de pointes that persists after defibrillation']],
    ['Bradycardia', ['Atropine 1 mg IV every 3–5 min (max 3 mg) if vagal or AV nodal', 'Dopamine 5–20 mcg/kg/min or epinephrine 2–10 mcg/min infusion; transcutaneous pacing if drugs fail']],
    ['Reversible causes (specific antidotes)', ['Suspected hyperkalemic cardiac arrest: follow the local arrest protocol. AHA 2025 describes outcome evidence for IV calcium, bicarbonate and insulin/glucose in this setting as uncertain.', 'Life-threatening TCA sodium-channel blockade: give IV sodium bicarbonate per toxicology protocol. Reassess hemodynamics and ECG, and monitor pH and sodium before further dosing.', 'Suspected opioid overdose with a pulse and absent breathing: ventilate and give naloxone. In cardiac arrest, give compression-ventilation CPR and indicated shocks. Naloxone can be considered if it does not interrupt standard resuscitation.', 'Tension pneumothorax: needle decompression then chest drain', 'Tamponade: pericardiocentesis or resuscitative thoracotomy where indicated']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — cardiopulmonary arrest', 'AHA 2025 Guidelines for CPR and ECC (ACLS adult cardiac arrest algorithm)', 'AHA 2025 electrical cardioversion, special circumstances and post-cardiac arrest care']
},
{
id: 'electrolytes', name: 'Electrolyte Emergencies', icon: '⚗️',
tag: 'Sodium, potassium, calcium — the numbers that stop the heart and the brain.',
overview: 'Electrolyte emergencies are common, lethal and treatable. Hyperkalaemia threatens the myocardium and is treated with membrane stabilisation first. Dysnatraemia causes neurological injury and must be corrected at a measured rate to avoid osmotic demyelination or cerebral oedema. Hypercalcaemia, hypocalcaemia and severe derangements of magnesium all produce arrhythmia, weakness and altered consciousness. Check the potassium and glucose in any sick patient, and repeat an unexpected result promptly without delaying treatment of a clinically unstable patient.',
approach: [
    'Hyperkalaemia with ECG changes is a cardiac emergency: stabilise the membrane while you remove the potassium.',
    'Dysnatraemia: correct slowly and predictably — rapid shifts cause osmotic demyelination (hyponatraemia) or cerebral injury (hypernatraemia).',
    'Severe hypocalcaemia presents with tetany, seizures or a long QT; replace calcium and check magnesium.',
    'Severe hypercalcaemia: rehydrate first, then treat the cause and consider calcitonin/bisphosphonate.',
    'Every electrolyte emergency: check glucose, magnesium, renal function and an ECG, and treat the cause.'
],
dontMiss: [
    ['Hyperkalaemia with ECG changes', 'critical', 'Peaked T waves, PR prolongation, loss of P waves, QRS widening → sine wave. Give calcium first if there are ECG changes, then shift and remove potassium. Never give calcium and bicarbonate in the same line.'],
    ['Severe hyponatraemia with neurological symptoms', 'critical', 'Seizure, coma or vomiting from brain oedema. Use hypertonic (3%) saline for symptomatic hyponatraemia and correct slowly once the seizure is controlled; over-rapid correction risks osmotic demyelination.'],
    ['Severe hypernatraemia', 'critical', 'Profound free-water deficit, often from inadequate access to water (infants, elderly, impaired thirst). Correct slowly to avoid cerebral oedema; do not drop the sodium faster than ~0.5 mmol/L/h.'],
    ['Hypocalcaemia / hypomagnesaemia', 'critical', 'Tetany, carpopedal spasm, seizures, prolonged QTc, refractory arrhythmia. Replace calcium and magnesium together — hypomagnesaemia makes hypocalcaemia refractory.'],
    ['Severe hypercalcaemia', 'critical', 'Corrected calcium >14 mg/dL (3.5 mmol/L) with confusion, dehydration, constipation or arrhythmia. Rehydrate with isotonic fluid, then treat the underlying cause (malignancy, hyperparathyroidism).'],
    ['Refeeding syndrome', 'emergent', 'Falling phosphate, potassium and magnesium after refeeding a malnourished patient — replace electrolytes and give thiamine before glucose.']
],
history: ['Vomiting, diarrhoea, diuretics, laxatives, dialysis, poor intake', 'Polyuria and polydipsia (hypercalcaemia, diabetes insipidus)', 'Weakness, cramps, palpitations, syncope (potassium, calcium, magnesium)', 'Confusion and seizures (sodium extremes)', 'Medications: ACE inhibitors, ARBs, spironolactone, NSAIDs, potassium supplements, lithium, digoxin', 'Malignancy, bone pain, recent weight loss; access to water in the elderly and infants'],
exam: ['Cardiovascular: pulse, rate, rhythm, blood pressure, JVP', 'Neurological: conscious level, seizures, focal deficit', 'Signs of volume status (dry mucosae, skin turgor, oedema)', 'Trousseau and Chvostek signs (hypocalcaemia)', 'Muscle power and reflexes; respiratory effort (potassium, magnesium)'],
workup: [['Bedside', ['12-lead ECG in any potassium, calcium or magnesium problem', 'Bedside potassium and glucose; repeat the sample if the result is unexpected', 'Urine output monitoring (catheter if needed)']], ['Labs', ['Repeat electrolytes, urea, creatinine and glucose', 'Magnesium, phosphate, and a blood gas', 'Serum and urine osmolality and urine sodium for dysnatraemia', 'Corrected calcium and PTH if hypercalcaemia is suspected']], ['Imaging', ['CXR and other targeted imaging for a suspected malignant cause of hypercalcaemia', 'Renal ultrasound if obstruction or chronic kidney disease is suspected']]],
redFlags: ['Peaked T waves, wide QRS, or sine wave on the ECG', 'Seizure or coma with an abnormal sodium', 'Refractory arrhythmia with a normal potassium', 'Hypercalcaemia with confusion or a very short QT', 'An unexpected critical result — repeat before treating if the patient looks well'],
disposition: [['Home with follow-up', 'Mild, asymptomatic, stable derangement with a corrected cause and reliable review.'],
['Admit (medical)', 'Symptomatic or marked derangement that needs serial electrolytes and cardiac monitoring, or an uncorrected cause.'],
['ICU / emergency dialysis', 'Severe hyperkalaemia refractory to medical therapy, symptomatic severe dysnatraemia, or a patient needing urgent renal replacement.']],
pitfalls: [
    "A normal ECG cannot exclude severe hyperkalemia.",
    "If pseudohyperkalemia is suspected, repeat promptly; do not delay emergency treatment of a clinically unstable patient.",
    'Giving calcium and bicarbonate through the same line (calcium carbonate precipitate).', 'Correcting sodium too quickly — osmotic demyelination is irreversible.', 'Treating hypocalcaemia without checking and replacing magnesium.', 'Using insulin-dextrose alone for severe hyperkalaemia without first stabilising the membrane in a patient with ECG changes.', 'Assuming a spuriously high or low potassium is real (haemolysed or delayed sample) — repeat when the patient looks well.'],
pearls: [
    "Potassium may rebound after shifting therapy; repeat levels and establish a removal/cause-control plan.",
    "Identify sodium overcorrection risk early, especially with malnutrition, alcohol-use disorder, liver disease or hypokalemia; monitor sodium and urine output closely.",
    'In hyperkalaemia: calcium stabilises, insulin-dextrose and salbutamol shift, dialysis removes. None of the shifts is definitive treatment.', 'A short QT with confusion is hypercalcaemia until proven otherwise.', 'The safest dysnatraemia correction is measured and documented — set a rate and recheck.', 'Potassium, glucose and an ECG in every sick patient — the sequence rarely misleads.'],
doses: [
    ['Hyperkalaemia', ['UKKA adult ECG-change regimen: calcium gluconate 10% 30 mL IV over 10 min; calcium chloride 10% 10 mL over 5 min is preferred in arrest/peri-arrest. Reassess ECG; follow local protocol', 'UKKA: soluble insulin 10 units with 25 g glucose IV; check glucose at baseline, every 30 min through 2 h, then hourly through 6 h. Follow hypoglycemia-prevention protocol', 'If pretreatment glucose <7 mmol/L: UKKA adds 10% glucose at 50 mL/h for 5 h after insulin-glucose', 'Salbutamol 10–20 mg nebulised (a shift, not a removal)', 'IV bicarbonate is not routine hyperkalemia therapy; selected severe metabolic acidosis needs specialist-directed treatment. Sodium-channel poisoning is a separate indication', 'Definitive removal: dialysis; add a potassium binder when available']],
    ['Dysnatraemia', ['Severe symptomatic hyponatremia (seizures/coma): US expert-panel approach, 3% saline 100 mL IV over 10 min, up to 3 boluses total as needed; reassess symptoms and sodium', 'Set a patient-specific sodium correction limit; high ODS risk: do not exceed 8 mmol/L in any 24 h. Seek specialist rescue advice if overcorrecting', 'Severe hypernatraemia: correct ≤0.5 mmol/L/h, using enteral or IV free water based on the calculated deficit', 'Check sodium every 2–4 h during active correction']],
    ['Calcium and magnesium', ['Symptomatic hypocalcaemia: calcium gluconate 10% 10–20 mL IV over 10 min, then infusion', 'Hypomagnesaemia: magnesium sulfate 1–2 g IV over 15–60 min, then infusion if severe', 'Severe hypercalcaemia: isotonic saline 1–2 L, then calcitonin ± bisphosphonate; furosemide only after rehydration']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — fluid, electrolyte and acid-base disorders', 'KDIGO electrolyte guidance; UK Kidney Association hyperkalaemia guideline (2023)', 'European hyponatraemia guideline (2014) and its clinical practice updates']
},
{
id: 'head-injury', name: 'Head Injury & Traumatic Brain Injury', icon: '🧠',
tag: 'Protect the brain: oxygen, perfusion, glucose — and do not miss the expanding lesion.',
overview: 'Traumatic brain injury ranges from a reassuring minor head injury to a surgical emergency. The emergency priorities are to prevent secondary injury: maintain oxygenation, blood pressure and glucose, and detect an expanding intracranial lesion before the brain herniates. Anticoagulated and older patients can deteriorate with a normal initial examination. Use a validated rule (Canadian CT Head or NICE) to decide on imaging, and treat any drop in GCS as a clinical event, not a number to watch.',
approach: [
    'Immobilise the cervical spine until cleared; treat the ABCDEs and any other trauma simultaneously.',
    'Prevent secondary brain injury: SpO₂ ≥94%, MAP to perfuse the brain, normoglycaemia, normocapnia, and normothermia.',
    'Use age-appropriate CT criteria; focal deficit or deterioration needs emergency imaging. Anticoagulants and antiplatelets other than aspirin alone lower the CT threshold; apply the recommended timing and clinical context.',
    'Suspect rising intracranial pressure with a falling GCS, new focal deficit, unequal pupils, or Cushing response.',
    'Reverse anticoagulation in haemorrhage, and call neurosurgery early when the lesion is surgical.'
],
dontMiss: [
    ['Extradural haematoma', 'critical', 'Classically a lucid interval then deterioration, often temporal with a biconvex lens on CT. A surgical emergency — neurosurgery must be called as soon as it is seen.'],
    ['Acute subdural haematoma', 'critical', 'Crescentic bleed, common in the elderly, anticoagulated and alcohol-dependent. Can expand rapidly; a thin film can look benign and still need surgery.'],
    ['Diffuse axonal injury / cerebral oedema', 'critical', 'Impaired consciousness out of proportion to the CT, or diffuse swelling with lost cisterns. Manage intracranial pressure and avoid hypotension and hypoxia.'],
    ['Skull base or open fracture', 'critical', 'Skull-base signs or an open fracture need urgent specialist assessment; avoid nasal instrumentation. Basilar fracture/CSF leak alone does not justify prophylactic antibiotics; open or penetrating injury has separate antibiotic indications.'],
    ['Anticoagulation-related haemorrhage', 'critical', 'Warfarin: 4F-PCC + vitamin K. Dabigatran: idarucizumab. Anti-Xa DOACs: andexanet alfa or PCC. Antithrombotic use changes the imaging assessment; aspirin monotherapy is not an automatic CT indication. After a reassuring adult minor-injury assessment, admission is not automatic.'],
    ['Cervical spine injury', 'critical', 'Distracting injuries and intoxication mask it. Keep the collar until clinical or imaging clearance per NEXUS/Canadian C-spine rules.']
],
history: [
    "Establish baseline cognition and neurological function with a carer when possible; interpret post-injury change against that baseline.",
    'Mechanism, height of fall, loss of consciousness, amnesia, seizure, vomiting', 'Anticoagulants, antiplatelets, alcohol, other drugs', 'Age, prior neurosurgery, ventriculoperitoneal shunt, seizures, cognitive baseline', 'Witnessed change in conscious level and the time course', 'Other injuries; high-risk mechanisms (pedestrian, ejection, fall >1 m or 5 stairs)'],
exam: ['GCS with its trend (eye, verbal, motor) and the time it was taken', 'Pupils (size, symmetry, reactivity) and eye movements', 'Focal neurological deficits, seizures, posturing', 'Signs of skull fracture, scalp haematoma, facial trauma', 'Cervical spine and the rest of the trauma survey', 'Glucose, temperature, and signs of intoxication'],
workup: [['Bedside', ['Serial GCS and pupils, documented with times', 'Glucose; treat hypoglycaemia', 'If intubated: sedate, ventilate to normocapnia, avoid hypotension']], ['Labs', ['Full blood count, coagulation, and a pregnancy test when relevant', 'Type & screen if haemorrhage is possible', 'Toxicology screen when the presentation is unclear']], ['Imaging', [
    "Use each head-CT rule only in its validated population; adult rules cannot be substituted for pediatric assessment or used to exclude CT in anticoagulated patients.",
    'Non-contrast CT head: immediate for any high-risk feature, focal deficit or GCS drop', 'CT cervical spine per clearance rule; CT trauma series for major mechanism', 'Repeat CT if the GCS falls or the patient deteriorates after the first scan']]],
redFlags: ['GCS falling by ≥1 point (especially motor) or GCS ≤8', 'Unequal or unreactive pupils; Cushing triad (hypertension, bradycardia, irregular respiration)', 'New focal deficit or seizure after the injury', 'Open or depressed fracture, CSF leak, penetrating injury', 'Anticoagulant/antiplatelet use, age and intoxication need risk-based assessment; aspirin alone is not an automatic CT indication', 'Repeated vomiting or significant amnesia: apply the complete age-appropriate CT criteria, including their eligibility conditions'],
disposition: [['Discharge with head-injury advice', 'GCS back to 15 or documented baseline, indicated imaging reassuring, no other admission reason, reliable supervision and written return advice. In adult minor injury with normal CT and baseline neurology, antithrombotic use alone does not mandate admission (ACEP).'],
['Admit for observation', 'Persistent neurological change, concerning symptoms, intoxication preventing assessment, other injuries or unsafe supervision: observe with access to rapid re-imaging. Do not routinely admit or repeat CT solely for antithrombotic use in an otherwise reassuring adult minor-injury assessment (ACEP).'],
['Neurosurgery / ICU', 'Any surgical lesion, GCS ≤8, rising intracranial pressure, or a need for invasive monitoring and neuroprotective care.']],
pitfalls: [
    "A normal head CT does not exclude concussion or later symptoms; arrange appropriate follow-up for persistent problems and explain return to usual activities.",
    'Reassurance by a normal first CT in an anticoagulated or older patient who then deteriorates.', 'Documenting a single GCS without the trend or the time.', 'Hypotension and hypoxia — the two commonest preventable causes of secondary injury.', 'Nasal intubation or a nasogastric tube with a suspected base-of-skull fracture.', 'Missing cervical spine injury because of intoxication or distracting pain.'],
pearls: [
    "Give written and verbal advice to the patient and carer, including supervision by a responsible adult for the first 24 hours and urgent return for neurological deterioration.",
    'A lucid interval means an extradural haematoma is still possible — never a reason to relax.', 'A drop in motor response is an urgent warning; repeat the neurological assessment and escalate unexplained deterioration.', 'Prevent the second injury: oxygen, blood pressure, glucose and temperature are treatment.', 'Reverse anticoagulation early in any traumatic intracranial haemorrhage.'],
doses: [
    ['Intracranial pressure / neuroprotection', ['Head-up 30°, normocapnia (PaCO₂ 35–40 mmHg) unless herniating, and normothermia', 'Hypertonic saline 3% 100–250 mL bolus or mannitol 0.25–1 g/kg for acute herniation while arranging surgery', 'Brief hyperventilation (PaCO₂ 30–35 mmHg) only as a bridge to definitive treatment']],
    ['Seizure and sedation', ['Levetiracetam 60 mg/kg IV (max 4.5 g) or fosphenytoin 20 mg PE/kg for post-traumatic seizures', 'Ketamine 1–2 mg/kg or etomidate 0.3 mg/kg for induction in haemodynamic compromise (either drug can be followed by hypotension. Prepare hemodynamic support)']],
    ['Reversal of anticoagulation', ['Warfarin: 4-factor PCC (per INR) + vitamin K 10 mg IV', 'Dabigatran: idarucizumab 5 g IV', 'Anti-Xa DOAC: andexanet alfa or 4F-PCC per local protocol', 'Heparin: protamine 1 mg per 100 units (max 50 mg)']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — head trauma', 'NICE NG232 head injury (2023); Canadian CT Head and NEXUS rules', 'Brain Trauma Foundation severe TBI guidance; ACS/ATLS 10th ed.']
},
{
id: 'hypertensive-emergency', name: 'Hypertensive Emergency', icon: '🩺',
tag: 'Fast numbers are not the emergency — organ damage is. Lower it carefully.',
overview: 'Hypertensive emergency is severe blood pressure with acute target-organ damage; hypertensive urgency is a high number without damage and rarely needs IV therapy or an emergency department stay. The rate of reduction matters more than the absolute number: overshooting causes cerebral, coronary and renal ischaemia. Choose the agent by the organ involved and monitor in a setting that can titrate. Always confirm the pressure with a correctly sized cuff and check for a cause (pain, drugs, pregnancy, endocrine).',
approach: [
    'Confirm with a correctly sized cuff and repeat; exclude pain, anxiety, bladder distension and missed medication as drivers.',
    'Look for acute target-organ damage: brain, heart, aorta, retina, kidney.',
    'No organ damage (urgency): do not rush — restart or optimise oral therapy and arrange close follow-up; IV therapy is usually unnecessary.',
    'With organ damage: lower the pressure in a controlled, monitored way, choosing the drug by the organ system.',
    'Reassess the patient, not just the monitor, after each titration.'
],
dontMiss: [
    ['Hypertensive encephalopathy', 'critical', 'Severe hypertension with headache, confusion, visual disturbance, seizure or coma — cerebral oedema. Reduce MAP by ~20–25% in the first hour. Nicardipine or labetalol.'],
    ['Acute aortic dissection', 'critical', 'Tearing chest/back pain with a pulse or pressure differential. Target heart rate ≤60 bpm first (esmolol or labetalol), then SBP 100–120 mmHg; avoid pure vasodilators before beta-blockade.', ['acute-aortic-syndrome']],
    ['Acute pulmonary oedema', 'critical', 'Hypertension with flash pulmonary oedema — nitroglycerin infusion plus non-invasive ventilation.'],
    ['Acute coronary syndrome / ischaemic stroke', 'critical', 'Lower blood pressure only when it threatens therapy or exceeds the thrombolysis threshold; navigate within the ACS/stroke pathways.', ['acute-coronary-syndrome', 'focal-neurologic-deficit']],
    ['Intracerebral haemorrhage', 'emergent', 'Smoothly target SBP ~140 mmHg when presenting SBP is 150–220 mmHg (INTERACT2/ATACH-II); avoid drops below 130 mmHg.'],
    ['Eclampsia / pre-eclampsia', 'critical', 'Magnesium sulfate for seizure prophylaxis and treatment; labetalol, hydralazine or nifedipine for blood pressure. Delivery is definitive.'],
    ['Catecholamine excess', 'emergent', 'Cocaine, amphetamine, phaeochromocytoma, or clonidine withdrawal — avoid unopposed beta-blockade; use a vasodilator or an alpha-blocker first.']
],
history: ['Headache, visual change, chest or back pain, breathlessness, focal weakness, seizure', 'Missed or changed antihypertensive medication, compliance, and current drugs', 'Stimulants, decongestants, corticosteroids, NSAIDs, monoamine oxidase inhibitors', 'Pregnancy and postpartum state', 'Established vascular disease, renal disease and dialysis'],
exam: ['Blood pressure in both arms; correctly sized cuff; confirm the number', 'Neurological examination and fundoscopy if trained (papilloedema, haemorrhage)', 'Cardiovascular: murmurs, pulse deficits, JVP, lung crackles', 'Signs of pulmonary oedema (hypoxia, crackles, frothy sputum)', 'Pregnancy: fundal height, oedema, reflexes, and fetal wellbeing'],
workup: [['Bedside', ['ECG (ischaemia, LVH, arrhythmia); 12-lead in chest pain', 'Urine dipstick for blood and protein (renal involvement, pre-eclampsia)', 'Bedside glucose and neurological assessment']], ['Labs', ['Urea, creatinine and electrolytes; troponin; full blood count and haemolysis screen', 'Urine protein:creatinine ratio or protein in pregnancy', 'Pregnancy test in women of childbearing age']], ['Imaging', ['CT head for neurological symptoms; CTA for suspected dissection', 'CXR and echocardiography for acute heart failure', 'Fundoscopy or specialist retinal assessment for malignant hypertension']]],
redFlags: ['Neurological signs: encephalopathy, seizure, focal deficit, papilloedema', 'Tearing chest or back pain with a pulse deficit (dissection)', 'Acute breathlessness with crackles (pulmonary oedema)', 'Acute kidney injury or visible haematuria', 'Pregnancy or postpartum with headache and hypertension', 'Blood pressure that does not respond to treatment (reconsider the cause)'],
disposition: [['Discharge with follow-up', 'Hypertensive urgency without organ damage: restart or optimise oral therapy, arrange review within days, and give clear return advice.'],
['Admit with monitoring', 'Any acute target-organ damage needing titrated IV therapy and serial reassessment.'],
['ICU / specialist', 'Aortic dissection, hypertensive encephalopathy, eclampsia, or refractory hypertension needing invasive monitoring.']],
pitfalls: [
    "Chronic LVH or stable chronic kidney disease alone does not establish acute pressure-related organ injury; assess what is new or worsening.",
    'Treating the number instead of the patient and overshooting into cerebral or coronary ischaemia.', 'Giving sublingual nifedipine or a rapid-release agent, producing uncontrolled reductions.', 'Using a pure vasodilator before beta-blockade in dissection (reflex tachycardia worsens the wall stress).', 'Missing pregnancy, stimulant use, or a missed ACE-inhibitor dose as the real cause.', 'Discharging an urgency patient without a plan for missed medication and follow-up.'],
pearls: [
    "Document the affected organ and its treatment target; ischemic stroke, aortic dissection and pregnancy-related emergencies do not share one universal reduction strategy.",
    "Explore medication access, adverse effects and other barriers before adjusting treatment; make the follow-up plan achievable.",
    "During titration, record neurological symptoms, chest discomfort, perfusion and renal trends alongside BP to detect harm from excessive reduction.",
    'The presence of organ damage, not the height of the number, defines the emergency.', 'In dissection the first target is heart rate; in encephalopathy it is a measured 20–25% MAP reduction.', 'A pressure that will not budge should make you reconsider the cause and the cuff.', 'Confirm with a manual repeat before you commit the patient to an IV infusion.'],
doses: [
    ['Titratable IV agents', ['Nicardipine infusion 5 mg/h, titrate by 2.5 mg/h every 5 min to max 15 mg/h', 'Labetalol 10–20 mg IV bolus then 0.5–2 mg/min infusion (avoid in acute heart failure/asthma)', 'Esmolol 500 mcg/kg bolus then 50–200 mcg/kg/min (dissection, titratable)', 'Nitroglycerin 5–200 mcg/min for pulmonary oedema and ACS', 'Hydralazine 5–10 mg IV every 20–30 min in pregnancy (watch for reflex tachycardia)']],
    ['Rate and target by organ', ['Encephalopathy: reduce MAP 20–25% in the first hour, then to ~160/100 mmHg over 2–6 h', 'Acute aortic syndrome (ACC/AHA): heart rate 60–80 bpm and SBP <120 mmHg, or the lowest pressure maintaining adequate organ perfusion', 'Selected mild-to-moderate ICH with initial SBP 150–220 mmHg: target ~140, maintaining 130–150 mmHg; severe/large ICH needs individualized specialist targets', 'Ischaemic stroke/thrombolysis: <185/110 to treat, then <180/105 for 24 h']],
    ['Eclampsia', ['Magnesium sulfate 4 g IV over 5–10 min, then 1 g/h infusion for 24 h', 'Recurrent seizure: further 2 g IV bolus; monitor reflexes, respiratory rate and urine output']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — hypertension', '2023 ESH hypertension guideline; 2017 ACC/AHA hypertension guideline', 'AHA/ASA 2026 acute ischaemic stroke guideline; NICE NG133 hypertension in pregnancy']
},
{
id: 'burns', name: 'Burns & Inhalation Injury', icon: '🔥',
tag: 'Cool the burn, warm the patient, and look for the airway you cannot see.',
overview: 'Major burns kill through airway injury, shock and infection, not the skin alone. Estimate the total body surface area (TBSA), start fluid resuscitation guided by the burn size, and look specifically for inhalation injury. For adults with burns ≥20% TBSA, ABA recommends a starting estimate of 2 mL/kg per %TBSA in the first 24 h from injury; titrate to perfusion and urine output with the burn service. Pediatric fluid calculations require a separate protocol. Chemical and electrical burns need their own considerations, and circumferential burns may need escharotomy.',
approach: [
    'Stop the burning process and remove nonadherent clothing; use cool running water for thermal burns while preventing hypothermia. Chemical burns need agent-appropriate decontamination and poison/burn-service advice.',
    'Assess suspected inhalation injury early. Soot or singed hair alone does not mandate intubation; airway compromise, respiratory failure or anticipated progressive obstruction needs expert airway management.',
    'Estimate TBSA excluding simple erythema; use Lund–Browder in children. Adults with ≥20% TBSA need formal resuscitation; children require a dedicated pediatric burn-fluid protocol.',
    'Give analgesia generously — burns are among the most painful injuries — and provide tetanus cover.',
    'Cover with clean, non-adherent dressings and keep the patient warm; refer burns needing specialist care.'
],
dontMiss: [
    ['Inhalation injury / airway oedema', 'critical', 'Enclosed-space fire, soot, singed hair, hoarseness or stridor — intubate early with a large tube. Airway oedema progresses over hours and can make later intubation impossible.'],
    ['Carbon monoxide poisoning', 'critical', 'Headache, confusion, syncope; pulse oximetry reads falsely normal. Treat with high-flow oxygen; hyperbaric oxygen for severe poisoning, neurological signs or pregnancy, where available.'],
    ['Cyanide toxicity', 'critical', 'Smoke inhalation with unexplained severe lactic acidosis or cardiovascular collapse after cyanide-containing combustion. Give hydroxocobalamin empirically in the crashing smoke-inhalation patient.'],
    ['Circumferential burn / compartment syndrome', 'critical', 'Chest wall restriction impairs ventilation; limb constriction impairs perfusion. Escharotomy or fasciotomy may be required.'],
    ['Electrical injury', 'critical', 'The surface burn underestimates deep injury — cardiac arrhythmia, rhabdomyolysis, fracture and neurological injury. Obtain an ECG and check creatine kinase.'],
    ['Chemical burns', 'critical', 'Ocular burns need immediate copious irrigation before anything else; alkali, hydrofluoric acid (needs calcium) and white phosphorus have specific measures.']
],
history: ['Time and mechanism: flame, scald, contact, chemical, electrical, explosion', 'Enclosed space, inhalational exposure, duration trapped; loss of consciousness', 'Airway symptoms: hoarseness, cough, stridor, dysphagia', 'Tetanus status and premorbid illness', 'Child: consider non-accidental injury and the pattern of the burn'],
exam: ['Primary survey with the airway assessed first: mouth, oropharynx, soot, voice', 'Percentage TBSA by rule of nines / Lund–Browder; exclude simple erythema', 'Depth: superficial (painful, red) vs partial (blisters, moist) vs full thickness (leathery, painless)', 'Eyes: fluorescein after chemical/thermal exposure', 'ECG in electrical injury; neurovascular status of circumferential burns', 'Temperature: keep warm, this is a co-injury with major burns'],
workup: [['Bedside', ['Continuous oximetry and, if intubated, waveform capnography', 'Urine output via catheter for major burns, hourly', 'ECG after electrical injury']], ['Labs', ['Carboxyhaemoglobin and blood gas for smoke inhalation', 'Potassium, glucose, urea, creatinine, and creatine kinase (rhabdomyolysis)', 'Lactate if cyanide toxicity is suspected']], ['Imaging', ['CXR for inhalation injury and later ARDS; early CXR is often normal', 'Bronchoscopy when diagnosed airway injury changes management', 'Other trauma imaging for explosions and falls']]],
redFlags: ['Stridor, hoarseness, or a hoarse voice developing after a fire', 'Soot in the mouth, singed nasal hair, or carbonaceous sputum', 'Burns of the face, neck, or perineum; circumferential burns', 'Loss of consciousness in an enclosed space (carbon monoxide/cyanide)', 'Electrical burn with arrhythmia, deep pain, or neurological deficit', 'Burn >20% TBSA (adult) or >10% (child), or any suspicion of non-accidental injury'],
disposition: [['Discharge with dressing plan', 'Small, superficial or partial-thickness burns (not face, hands, feet, joints, perineum), safe home circumstances, tetanus up to date, and clear review.'],
['Admit (burns ward or general ward)', 'Moderate burns, significant pain needing IV analgesia, difficulty with self-care, or social/child-safeguarding concerns.'],
['Burns centre / ICU / theatre', 'Major or deep burns, inhalational injury, electrical or chemical burns, burns to the face/hands/perineum, or circumferential burns needing escharotomy.']],
pitfalls: ['Waiting for stridor before intubating an inhalation injury — the window closes as oedema develops.', 'Fluid overload from treating the starting estimate as a fixed prescription instead of titrating to perfusion and urine output.', 'Missing carbon monoxide because the oximeter reads normally.', 'Underestimating TBSA or electrical depth.', 'Forgetting tetanus, analgesia, and warming the patient.', 'Assuming an upper-airway injury is absent because the initial voice is normal.'],
pearls: [
    "For thermal burns, ANZCOR recommends cool running water for at least 20 minutes as soon as possible; benefit may remain up to 3 hours. Keep the rest of the patient warm.",
    "Remove rings, watches and nonadherent clothing early before swelling develops; leave material stuck to the skin for careful specialist management.",
    "Record the injury time and fluids already administered; resuscitation calculations run from injury, not from arrival, and require repeated adjustment.",
    "Consult a burn center for potentially deep burns, difficult pain control, functional-area injuries or caregiver needs; pediatric burns may benefit from referral even when small.",
    'Repeated airway assessment is essential; secure a threatened airway early, while avoiding automatic intubation for singed hair alone.', 'Titrate fluids to a urine output of ~0.5 mL/kg/h (1 mL/kg/h in children) rather than to the formula.', 'A normal SpO₂ does not exclude carbon monoxide poisoning.', 'Electrical burns hide deep injury; think heart, muscle and kidney.'],
doses: [
    ['Fluid resuscitation', ['Adult burns ≥20% TBSA: ABA recommends initiating crystalloid calculations at 2 mL/kg per %TBSA over the first 24 h from injury; individualize the rate with the burn service', 'Titrate to urine output ~0.5 mL/kg/h (adult) or 1 mL/kg/h (child); reduce the rate if over-resuscitating', 'Children also need maintenance fluid plus dextrose']],
    ['Airway and inhalation', ['Expert-led intubation for airway compromise, respiratory failure or anticipated progressive obstruction; assess suspected inhalation injury early', '100% oxygen for suspected carbon monoxide/cyanide, then titrate to SpO₂ ≥94% once excluded', 'Hydroxocobalamin 5 g IV for suspected cyanide toxicity']],
    ['Analgesia and adjuncts', ['IV opioid titrated to pain (e.g. morphine or fentanyl) — parenteral for major burns', 'Ketamine 0.1–0.3 mg/kg for dressing changes and procedural analgesia', 'Tetanus immunoglobulin and/or toxoid per status; antibiotics only for proven infection']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — thermal, chemical and electrical injuries', 'ABA practice guidelines (burn shock resuscitation, inhalation injury)', 'ATLS 10th ed.; European Burns Association guidance']
},
{
id: 'alcohol-withdrawal', name: 'Alcohol Withdrawal & Delirium Tremens', icon: '🍺',
tag: 'Benzodiazepines treat withdrawal; thiamine protects the brain. Do not miss the mimics.',
overview: 'Alcohol withdrawal ranges from tremor and autonomic overactivity to delirium tremens — a life-threatening syndrome of confusion, agitation, hallucination, fever and autonomic storm that peaks at 48–96 h. Match benzodiazepines to reliable assessment and monitoring. Give thiamine promptly; never delay emergency glucose. Exclude the mimics: hypoglycaemia, head injury, infection, hepatic encephalopathy and other withdrawal syndromes.',
approach: [
    'Diagnose withdrawal clinically; CIWA-Ar requires reliable patient participation.',
    'Use symptom-triggered benzodiazepines if scoring is reliable; otherwise use a monitored fixed-dose/front-loading protocol.',
    'Give thiamine promptly; never delay emergency glucose. Replace deficiencies as indicated.',
    'Exclude the mimics and co-injuries: hypoglycaemia, head injury, infection, GI bleed, hepatic encephalopathy, pancreatitis.',
    'Delirium tremens needs higher benzodiazepine doses in a monitored setting and a search for precipitating illness.'
],
dontMiss: [
    ['Delirium tremens', 'critical', 'Confusion, agitation, hallucinations, marked tremor, fever, tachycardia and hypertension, typically 48–96 h after the last drink. A medical emergency requiring high-dose benzodiazepines and monitoring.'],
    ['Alcohol withdrawal seizure', 'critical', 'A generalised tonic–clonic seizure 6–48 h after cessation; multiple or focal seizures should prompt investigation for another cause.'],
    ['Wernicke encephalopathy', 'critical', 'Confusion, ophthalmoplegia and ataxia from thiamine deficiency — treat immediately with parenteral thiamine; do not wait for confirmation. Untreated it progresses to Korsakoff syndrome.'],
    ['Hypoglycaemia', 'critical', 'Alcohol blocks gluconeogenesis, especially in the malnourished patient. Treat hypoglycemia immediately and give thiamine promptly.'],
    ['Head injury / intracranial bleed', 'critical', 'Alcohol and falls go together — a normal examination does not exclude a subdural haematoma, especially with anticoagulation.'],
    ['Hepatic encephalopathy / GI bleed / pancreatitis', 'critical', 'Alcohol-related illnesses that mimic or complicate withdrawal — examine for chronic liver disease signs, melaena, and epigastric pain.']
],
history: ['Last drink and the drinking pattern; prior withdrawal seizures or delirium tremens', 'Current medications, benzodiazepine use, other substance use', 'Nutrition, weight loss, vomiting, access to food', 'Falls, head injury, melaena, abdominal pain, fever', 'Comorbid psychiatric illness and suicide risk'],
exam: ['Conscious level, orientation, and CIWA-Ar score components (tremor, sweating, agitation, hallucinations)', 'Vital signs: fever, tachycardia, hypertension, tachypnoea', 'Neurological: ataxia, ophthalmoplegia, focal signs, seizure markers', 'Chronic liver disease signs: jaundice, spider naevi, ascites, encephalopathy (asterixis)', 'Trauma survey for head injury and other injuries', 'Glucose, and temperature (infection)'],
workup: [['Bedside', ['CIWA-Ar scoring and serial reassessment', 'Bedside glucose; treat hypoglycaemia immediately, with prompt thiamine', 'ECG for arrhythmia and electrolyte effects']], ['Labs', ['Electrolytes, magnesium, phosphate, calcium, and glucose', 'Full blood count, coagulation, and liver function tests', 'Blood gas if acid-base disturbance is suspected; ethanol level (does not guide treatment)']], ['Imaging', ['CT head for trauma, focal signs, or an atypical presentation', 'CXR and cultures if infection is suspected', 'Abdominal imaging for suspected pancreatitis or other alcohol-related pathology']]],
redFlags: ['Delirium tremens or a withdrawal seizure', 'Fever, marked autonomic instability, or a very high CIWA-Ar score', 'Focal neurological signs, head injury, or anticoagulation', 'Jaundice, melaena, haematemesis, or severe abdominal pain', 'Hypoglycaemia, hyponatraemia, or hypomagnesaemia', 'Concurrent benzodiazepine or opioid withdrawal (higher risk)'],
disposition: [['Discharge with a plan', 'Mild withdrawal, no red flags, CIWA-Ar low, social support and reliable access to thiamine/folate and follow-up.'],
['Admit (ward with monitoring)', 'Moderate withdrawal, a withdrawal seizure, or an illness needing treatment; symptom-triggered benzodiazepines with regular reassessment.'],
['High-dependency / ICU', 'Delirium tremens, refractory autonomic instability, or a patient needing large cumulative benzodiazepine doses or a phenobarbital/adjunct protocol.']],
pitfalls: [
    "A positive ethanol level does not exclude withdrawal.",
    'Delaying emergency glucose for thiamine; give both promptly.', 'Applying CIWA-Ar-driven treatment when reliable scoring is impossible.', 'Missing hypoglycaemia, head injury or infection by attributing everything to withdrawal.', 'Under-treating delirium tremens out of fear of sedation — it is life-threatening and needs adequate doses.', 'Forgetting to check and replace magnesium and phosphate.'],
pearls: [
    "Monitor sedation and breathing during benzodiazepine treatment.",
    "CIWA-Ar is unsuitable in delirium; use an appropriate monitored assessment.",
    "Withdrawal care should link directly to ongoing alcohol-use-disorder treatment.",
    'Never delay emergency glucose; administer thiamine promptly.', 'Match benzodiazepine strategy to the patient and monitoring available.', 'Delirium tremens is a diagnosis of exclusion as much as of withdrawal — hunt the precipitant.', 'A focal or prolonged seizure in withdrawal should prompt neuroimaging and workup.'],
doses: [
    ['Benzodiazepines (symptom-triggered)', ['Chlordiazepoxide 25–50 mg PO every 1–2 h until the CIWA-Ar is controlled (usual 24 h total 100–200 mg) — long-acting, preferred where safe', 'Diazepam 10–20 mg PO/IV every 15–30 min for severe withdrawal/delirium tremens, titrated to sedation, then tapered', 'Lorazepam 1–2 mg IV every 15–30 min in severe liver disease or the elderly (no active metabolites)']],
    ['Adjuncts', ['Suspected Wernicke encephalopathy: thiamine 300–500 mg IV three times daily for 3–5 days with daily review (UK guidance); give in a setting equipped to manage infusion reactions', 'Prevention is distinct from treatment: ASAM typical thiamine prophylaxis is 100 mg IV/IM daily for 3–5 days; use the local risk-based regimen', 'Magnesium sulfate 1–2 g IV and phosphate replacement as indicated', 'Folate 5 mg PO daily and a multivitamin; correct potassium']],
    ['Refractory delirium tremens', ['Phenobarbital 10–15 mg/kg IV loading (monitored) where protocols exist and benzodiazepines alone fail', 'Dexmedetomidine 0.2–1.4 mcg/kg/h as an adjunct for autonomic overactivity — not a substitute for benzodiazepines']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — alcohol and substance withdrawal', 'ASAM clinical practice guideline on alcohol withdrawal management (2020)', 'NICE CG100 alcohol-use disorders: physical complications; CIWA-Ar validated scale']
},
{
id: 'thyroid-storm', name: 'Thyroid Storm & Myxoedema Coma', icon: '🦋',
tag: 'Two extremes of thyroid disease that are treated on clinical grounds alone.',
overview: 'Thyroid storm is decompensated thyrotoxicosis with fever, marked tachycardia, agitation or delirium, heart failure, and a precipitant (infection, surgery, trauma, iodine load, withdrawal of antithyroid therapy). Myxoedema coma is severe hypothyroidism with hypothermia, depressed consciousness, bradycardia, hyponatraemia and hypoventilation. Both are clinical diagnoses with high mortality — treat on suspicion before the laboratory confirms, and look for and treat the trigger. Do not delay therapy for a confirmatory result.',
approach: [
    'Suspect thyroid storm with fever, tachycardia, tremor, agitation and a known or likely precipitant; treat clinically.',
    'For storm: block hormone synthesis, block release, block peripheral conversion, and support the heart and circulation.',
    'Suspect myxoedema coma with hypothermia, reduced consciousness, bradycardia and hyponatraemia; give IV stress-dose glucocorticoid before IV levothyroxine.',
    'Search for and treat the precipitant in both: infection, MI, stroke, drugs, pregnancy complications.',
    'Supportive care is shared: cardiac monitoring, careful fluid balance, and a warm (not overheated) environment in myxoedema.'
],
dontMiss: [
    ['High-output heart failure / AF', 'critical', 'Assess perfusion and ventricular function before selecting rate control. Beta blockade can precipitate collapse in low-output heart failure or shock.'],
    ['Hypotension after thyroid hormone', 'critical', 'Starting thyroid hormone before steroids in coexisting adrenal insufficiency can precipitate vascular collapse — cover with hydrocortisone.'],
    ['Precipitating illness', 'critical', 'Infection, DKA, ACS, stroke, pulmonary embolism, trauma or surgery are the triggers that kill. Treat the trigger, not just the thyroid.'],
    ['Myxoedema coma hypoventilation', 'critical', 'Depressed consciousness, CO₂ retention and respiratory failure; be ready to support ventilation and expect a slow recovery.'],
    ['Severe hyponatraemia (myxoedema)', 'emergent', 'Common and often dilutional; correct cautiously and reassess thyroid status.'],
    ['Drug and iodine effects', 'emergent', 'Amiodarone, contrast and iodinated drugs can precipitate storm; pregnancy has its own considerations (PTU in the first trimester).']
],
history: ['Known thyroid disease, treatment adherence, recent thyroid surgery or radioiodine', 'Recent infection, trauma, surgery, MI, stroke or pregnancy', 'Weight change, heat or cold intolerance, palpitations, tremor, mood change', 'Medications: amiodarone, contrast, thyroxine dose changes, lithium', 'Cold exposure and a reduced level of consciousness in myxoedema'],
exam: ['Temperature, heart rate and rhythm, blood pressure (wide pulse pressure in storm)', 'Conscious level, agitation, tremor, reflexes (delayed relaxation in hypothyroidism)', 'Eyes: exophthalmos, ophthalmoplegia; goitre and thyroid tenderness', 'Signs of heart failure, hypoxia, and infection source', 'Capillary refill and volume status; look for a precipitating focus'],
workup: [['Bedside', ['ECG for AF, ischaemia, and QT; continuous monitoring', 'Glucose and, in myxoedema, temperature and respiratory monitoring']], ['Labs', ['TSH, free T4 and total T3 (do not wait for the result to begin treatment when the clinical picture is clear)', 'Full blood count, electrolytes, glucose, liver and renal function; cortisol if adrenal insufficiency is possible', 'Blood gas for acidosis/CO₂ retention; cultures for infection']], ['Imaging', ['CXR for heart failure and infection; thyroid imaging only if it changes management', 'Head imaging if the conscious level is unexplained']]],
redFlags: ['Fever with tachycardia, tremor and agitation after a precipitant', 'Delirium, seizures or coma with thyrotoxic features', 'Hypothermia with reduced consciousness and bradycardia', 'Hypotension, arrhythmia or heart failure during treatment', 'Hyponatraemia or hypoventilation in myxoedema', 'Coexisting adrenal insufficiency (risk with thyroid hormone)'],
disposition: [['Urgent HDU / ICU assessment', 'Suspected thyroid storm or myxoedema coma requires early endocrine and critical-care involvement and intensive monitoring.'],
['ICU / high-dependency', 'Haemodynamic instability, arrhythmia, heart failure, reduced consciousness, or a patient needing ventilatory support.'],
['Ward with endocrinology review', 'Milder thyrotoxicosis or hypothyroidism without decompensation — investigate and treat electively.']],
pitfalls: [
    "Thyroid hormone levels overlap between uncomplicated thyrotoxicosis and thyroid storm. Use organ dysfunction and clinical trajectory. Diagnostic scores can support that assessment.",
    "Normal or low TSH can occur in central hypothyroidism. Interpret it with free T4 and the clinical picture when myxoedema coma is suspected.",
    'Waiting for thyroid-function tests before treating a patient who fits the clinical picture.', 'Giving thyroid hormone without covering for adrenal insufficiency.', 'Missing the precipitant — infection, MI, stroke, DKA — that is actually driving the decompensation.', 'Over-vigorous fluid resuscitation or active overheating in myxoedema.', 'Using a beta-blocker in a patient with decompensated heart failure without senior input.'],
pearls: [
    "In thyroid storm with suspected cardiac dysfunction, obtain early echocardiography to guide rate control and circulatory support.",
    "Follow mental status, ventilation, perfusion and free thyroid hormones during myxoedema treatment. TSH can lag behind early clinical recovery.",
    'Thyroid storm and myxoedema coma are clinical diagnoses: treat first, confirm later.', 'In thyroid storm, treat hormone excess and its trigger in parallel. Individualize beta blockade according to perfusion and ventricular function.', 'In myxoedema, the airway, ventilation, temperature and glucose matter as much as the hormone.', 'Always look for the trigger — it is often what is actually killing the patient.'],
doses: [
    ['Thyroid storm', ['Propylthiouracil 500–1000 mg PO/NG loading then 250 mg every 4 h (also blocks peripheral conversion)', 'In the ATA sequence for thyroid storm, give iodine at least 1 h after the antithyroid drug, never before', 'Hydrocortisone 100 mg IV then 50 mg every 6 h (also covers adrenal insufficiency)', 'Propranolol 60–80 mg PO every 4 h is a guideline option for stable adults without significant LV dysfunction. In suspected cardiomyopathy or shock, obtain critical-care input before beta blockade and individualize drug and dose.', 'Supportive: cooling, IV fluids, treat the precipitant']],
    ['Myxoedema coma', ['Hydrocortisone 100 mg IV before levothyroxine, then 50 mg IV every 6 h until the adrenal axis has been evaluated and cleared', 'Levothyroxine 200–400 mcg IV loading after glucocorticoid coverage. Use a lower load for smaller or older patients or those with coronary disease or arrhythmia. Maintenance is 1.6 mcg/kg/day enterally, reduced to 75% while given IV.', 'Liothyronine is an optional specialist adjunct if response is inadequate. Consider cardiac risk and follow the endocrine protocol.', 'Passive rewarming, cautious IV fluids, and ventilatory support as needed']]
],
refs: ['Rosen\u2019s Emergency Medicine, 10th ed. (2023) — thyroid disorders', 'Joint endocrine society consensus statements (2026) and ATA hyperthyroidism and hypothyroidism guidelines']
},
{
    id: 'neutropenic-sepsis',
    name: 'Febrile Neutropenia & Neutropenic Sepsis',
    icon: '🩺',
    tag: 'Recognize infection after anticancer treatment and give empiric antibiotics promptly.',
    overview: 'Adult emergency assessment after myelosuppressive therapy or with known neutropenia. Infection can progress quickly with few localizing signs. An unwell patient can have neutropenic sepsis even without fever.',
    approach: [
        'Assess airway, breathing and circulation, obtain IV access and contact acute oncology or hematology early.',
        'Give empiric antibiotics immediately when neutropenic sepsis is suspected. ASCO/IDSA specifies initial antibiotics within 1 hour of triage for febrile neutropenia.',
        'Use the local neutropenic sepsis regimen with antipseudomonal coverage. Check allergies, renal function, prior resistant organisms and recent antimicrobial exposure.',
        'Draw blood cultures promptly if this can be done without delaying antibiotics. Start sepsis resuscitation and escalate organ dysfunction or shock.'
    ],
    dontMiss: [
        ['Afebrile neutropenic sepsis', 'critical', 'Hypotension, rigors, confusion or unexplained deterioration after anticancer therapy can be the presenting clues.'],
        ['Neutropenic enterocolitis', 'critical', 'New abdominal pain, distension, diarrhea or bleeding warrants urgent assessment and consideration of CT when safe.'],
        ['Central line infection', 'emergent', 'Inspect the line and consider paired peripheral and line cultures when feasible. A central line alone is insufficient reason for routine empiric glycopeptide coverage.']
    ],
    history: ['Document the cancer, regimen, last treatment date, prior neutrophil count and any transplant.', 'Ask about fever at home, rigors, focal symptoms, antibiotics, allergies and prior culture results.'],
    exam: ['Reassess perfusion, mentation and respiratory effort. Inspect oral mucosa, skin and vascular access sites.', 'Assess abdominal tenderness, distension and signs of peritonitis.'],
    workup: [
        ['Initial tests', ['Obtain CBC with differential, renal and liver function, lactate and blood cultures. NICE defines confirmed neutropenic sepsis during anticancer treatment as ANC ≤0.5 × 10⁹/L with temperature above 38°C or other signs of clinically significant sepsis. Begin treatment on suspicion while results are pending.']],
        ['Directed tests', ['Select imaging and further cultures by the clinical presentation. Obtain chest imaging when respiratory findings or another indication warrants it.']]
    ],
    redFlags: ['Shock, new oxygen requirement or altered mental status.', 'New abdominal pain with tenderness, distension or bleeding.', 'Unwell after anticancer treatment despite a normal temperature.'],
    disposition: [
        ['Admit / critical care as indicated', 'Organ dysfunction, instability, high-risk neutropenia, uncontrolled symptoms or unreliable follow-up.'],
        ['Selected outpatient pathway', 'Consider only after treatment, clinical observation and specialist-led validated risk assessment, with reliable access to medications, follow-up and urgent reassessment. ASCO/IDSA calls for at least 4 hours of monitoring before discharge.']
    ],
    pitfalls: ['Waiting for a neutrophil count or culture result before treating suspected neutropenic sepsis.', 'Using a risk score alone to justify discharge.'],
    pearls: ['Record the triage and first antibiotic times, then reassess perfusion and response.'],
    refs: ['NICE CG151 neutropenic sepsis', 'ASCO/IDSA adult fever and neutropenia guideline', 'AGIHO/DGHO adult gastrointestinal complications guideline']
},
{
    id: 'tumor-lysis-syndrome',
    name: 'Tumor Lysis Syndrome (TLS)',
    icon: '🩺',
    tag: 'Recognize the electrolyte pattern and monitor for arrhythmia and acute kidney injury.',
    overview: 'Tumor lysis can occur spontaneously or after effective cancer treatment. Suspect it with rising potassium, phosphate and uric acid, falling calcium, or acute kidney injury in a patient with cancer, particularly a high-burden or rapidly proliferating hematologic malignancy.',
    approach: [
        'Obtain an ECG and start cardiac monitoring when TLS is suspected. Treat life-threatening hyperkalemia through the emergency electrolyte pathway.',
        'Contact hematology or oncology early and involve nephrology for kidney injury, oliguria, or severe or refractory electrolyte disturbance.',
        'Use IV hydration tailored to perfusion, urine output and volume status. Reassess for pulmonary edema and fluid overload.',
        'Discuss urgent rasburicase for established TLS with the treating team. It is contraindicated in G6PD deficiency. Establish G6PD status and involve pharmacy and hematology promptly when the result is unknown.'
    ],
    dontMiss: [
        ['Hyperkalemic arrhythmia', 'critical', 'Treat immediately through the emergency hyperkalemia pathway when the ECG or clinical state warrants it.'],
        ['Phosphate-driven hypocalcemia', 'critical', 'Seizure, tetany or arrhythmia requires urgent specialist-directed treatment. Routine replacement for asymptomatic hypocalcemia can promote calcium-phosphate deposition.'],
        ['Progressive acute kidney injury', 'critical', 'Oliguria, refractory electrolyte disturbance or fluid overload warrants urgent assessment for renal replacement therapy.']
    ],
    history: ['Ask about recent systemic therapy, including targeted agents, and about high tumor burden or baseline renal disease.', 'Review urine output, vomiting, muscle cramps, palpitations and previous TLS prophylaxis.'],
    exam: ['Check perfusion and volume status, including pulmonary congestion.', 'Assess for tetany, weakness, seizure or altered mental status.'],
    workup: [
        ['Initial and repeat labs', ['Measure potassium, phosphate, calcium, uric acid, creatinine and LDH. Follow trends at intervals set by severity and the TLS protocol.']],
        ['Bedside', ['Obtain ECG, monitor rhythm and chart strict intake and output. Tell the laboratory if rasburicase was given so uric acid specimens are handled correctly.']]
    ],
    redFlags: ['ECG changes, arrhythmia or severe hyperkalemia.', 'Seizure, tetany, oliguria or pulmonary edema.', 'Rapidly changing electrolytes or rising creatinine after anticancer treatment.'],
    disposition: [
        ['Monitored admission', 'Suspected or established TLS requires serial labs and specialist treatment.'],
        ['Critical care / nephrology', 'Escalate unstable patients and those with severe electrolyte disturbance, worsening kidney injury or fluid overload.']
    ],
    pitfalls: ['Excluding TLS because anticancer treatment has not yet started.', 'Relying on allopurinol alone to remove uric acid that is already elevated.'],
    pearls: ['Compare with pretreatment results when available, and treat dangerous abnormalities while confirming the diagnosis.'],
    refs: ['BSH tumor lysis syndrome guideline (2025)', 'MD Anderson adult TLS algorithm', 'eviQ TLS prevention and rasburicase safety']
},
{
    id: 'metastatic-spinal-cord-compression',
    name: 'Metastatic Spinal Cord Compression (MSCC)',
    icon: '🩺',
    tag: 'Act on new neurological symptoms in a patient with current or previous cancer.',
    overview: 'Severe progressive back pain can precede weakness and bladder or bowel dysfunction. Recognize spinal cord or cauda equina compression early to protect neurological function.',
    approach: [
        'In a patient with current or previous cancer and symptoms of cord or cauda equina compression, contact the MSCC pathway immediately.',
        'Document baseline motor, sensory, gait and bladder or bowel function. Start spinal precautions promptly if neurological findings suggest spinal instability.',
        'Arrange urgent whole-spine MRI as soon as possible and within 24 hours for suspected MSCC. Use radiology and specialist advice if MRI is contraindicated.',
        'For neurological symptoms or signs of MSCC, give dexamethasone promptly per the NICE regimen below. Coordinate surgery or radiotherapy planning with the specialist team.'
    ],
    dontMiss: [
        ['Motor deficit or new gait change', 'critical', 'New weakness, difficulty walking, or neurological deterioration requires immediate MSCC assessment.'],
        ['Cauda equina compression', 'critical', 'New urinary retention or incontinence, saddle sensory change or bowel dysfunction requires urgent evaluation.'],
        ['Pain suggesting spinal metastases', 'emergent', 'With a cancer history, severe unremitting, progressive, nocturnal or mechanical spinal pain warrants MSCC pathway advice within 24 hours even without neurological findings.']
    ],
    history: ['Ask about prior cancer, known spinal lesions, escalating pain, radicular symptoms and pain with movement or straining.', 'Establish the onset and trajectory of weakness, gait change, sensory symptoms and bladder or bowel dysfunction.'],
    exam: ['Document limb strength, sensation and any sensory level. Assess gait only if safe.', 'Reassess neurological function while awaiting imaging and treatment.'],
    workup: [
        ['Imaging', ['Arrange whole-spine MRI for suspected MSCC. Discuss CT with radiology if MRI is contraindicated. Plain radiographs cannot exclude MSCC.']],
        ['Bedside', ['Assess bladder symptoms and consider a bladder scan when retention is suspected. Imaging urgency depends on the full neurological presentation.']]
    ],
    redFlags: ['New weakness, gait difficulty or sensory loss.', 'Bladder or bowel dysfunction or saddle sensory change.', 'Progressive spinal pain with new radicular symptoms in a patient with cancer.'],
    disposition: [
        ['Urgent admission or coordinated transfer', 'Suspected MSCC needs timely imaging and specialist management. Arrange supported transfer if the required imaging or care is unavailable locally.'],
        ['Spinal metastasis concern without neurological signs', 'Seek specialist advice within 24 hours and provide explicit instructions for neurological deterioration.']
    ],
    pitfalls: ['Waiting for paralysis or retention before escalating.', 'Starting corticosteroids in radiologically suspected lymphoma or myeloma with spinal lesions and no neurological symptoms or signs before seeking hematology advice.'],
    pearls: ['Record baseline mobility and the time symptoms changed to help the receiving team prioritize treatment.'],
    doseScope: 'NICE NG234 regimen for neurological symptoms or signs of metastatic spinal cord compression.',
    doses: [
        ['Dexamethasone', ['Give 16 mg orally or an equivalent parenteral dose as soon as possible. Continue 16 mg daily while awaiting surgery or radiotherapy, then taper according to specialist guidance. Stop dexamethasone given for suspected MSCC if imaging rules out both spinal metastases and MSCC. Account for other indications or prior steroid exposure. Monitor glucose and provide gastric protection.']]
    ],
    refs: ['NICE NG234 spinal metastases and metastatic spinal cord compression']
},
{
    id: 'hypercalcemia-of-malignancy',
    name: 'Hypercalcemia of Malignancy',
    icon: '🩺',
    tag: 'Treat symptomatic calcium elevation while assessing renal function and volume status.',
    overview: 'Think of hypercalcemia in a patient with cancer who develops thirst, polyuria, constipation, weakness or confusion. The speed of the rise, symptoms, kidney function and volume status all matter.',
    approach: [
        'Assess mental status, perfusion, volume status and ECG. Confirm the calcium result with albumin and use ionized calcium when total calcium is difficult to interpret.',
        'Restore volume with isotonic IV fluid when depleted, adjusting for cardiac and renal function.',
        'Arrange IV bisphosphonate or denosumab with the treating team. Check renal function before an IV bisphosphonate and plan follow-up calcium monitoring.',
        'For severe hypercalcemia of malignancy above 14 mg/dL (3.5 mmol/L), the Endocrine Society suggests adding calcitonin initially to an antiresorptive. Limit calcitonin to 48–72 hours.'
    ],
    dontMiss: [
        ['Severe symptomatic hypercalcemia', 'critical', 'Marked confusion, arrhythmia, dehydration or kidney injury warrants monitored treatment and early specialist involvement.'],
        ['Calcitriol-mediated hypercalcemia', 'emergent', 'Consider this mechanism in lymphoma. Glucocorticoids may be indicated with specialist guidance.'],
        ['Another cause of elevated calcium', 'emergent', 'Cancer can coexist with primary hyperparathyroidism or medication-related hypercalcemia. Use PTH and clinical context to investigate the mechanism.']
    ],
    history: ['Ask about symptom onset, intake, polyuria, constipation and previous calcium results.', 'Review supplements, thiazides, lithium, cardiac or kidney disease and prior antiresorptive therapy.'],
    exam: ['Assess hydration, mental status and strength. Look for congestion before and during IV fluids.'],
    workup: [
        ['Initial tests', ['Total calcium and albumin or ionized calcium, creatinine, electrolytes, phosphate and magnesium. Check ECG when symptomatic or severely elevated.']],
        ['Cause and response', ['Measure PTH when the mechanism is uncertain and trend calcium, renal function and fluid balance after treatment.']]
    ],
    redFlags: ['Altered mental status, arrhythmia or severe dehydration.', 'Oliguria or acute kidney injury.', 'Severe calcium elevation or rapid rise with symptoms.'],
    disposition: [
        ['Admit', 'Severe or symptomatic disease, kidney injury, inability to maintain hydration, or a need for monitored treatment.'],
        ['Selected outpatient follow-up', 'For mild, asymptomatic disease with a reliable oncology plan, arrange repeat labs and clear return instructions.']
    ],
    pitfalls: ['Using calcitonin alone as definitive treatment or continuing it beyond the short initial window.', 'Giving large fluid volumes without reassessing for overload.'],
    pearls: ['Plan calcium reassessment after antiresorptive treatment because the effect evolves over days.'],
    refs: ['Endocrine Society guideline on treatment of hypercalcemia of malignancy in adults', 'UKONS acute oncology initial management']
},
{
    id: 'superior-vena-cava-syndrome',
    name: 'Superior Vena Cava Syndrome (SVCS)',
    icon: '🩺',
    tag: 'Identify airway or neurological compromise in a patient with upper-body venous congestion.',
    overview: 'Superior vena cava obstruction can result from tumor compression or invasion, thrombosis, or both. Face, neck or arm swelling with prominent chest veins and dyspnea can be the first sign of malignancy.',
    approach: [
        'Assess airway, oxygenation, mental status and perfusion immediately. Keep the patient in a position that maintains breathing.',
        'Call airway and critical-care teams for stridor, severe respiratory distress, altered consciousness or hemodynamic compromise.',
        'Discuss contrast-enhanced chest CT with radiology when safe to define the obstruction, assess thrombus and guide management.',
        'Involve oncology and interventional radiology early. Urgent endovascular treatment may be needed for severe compromise. In stable patients coordinate diagnosis, including tissue sampling when needed, and cause-directed therapy.'
    ],
    dontMiss: [
        ['Laryngeal edema or central airway obstruction', 'critical', 'Stridor, rapidly worsening dyspnea or inability to tolerate lying flat requires an expert airway plan.'],
        ['Neurological or circulatory compromise', 'critical', 'New confusion, syncope or hypotension requires immediate escalation.'],
        ['Catheter-associated thrombosis', 'emergent', 'Ask about venous devices and evaluate for thrombus. Choose anticoagulation with specialist advice and bleeding-risk assessment.']
    ],
    history: ['Ask about the timing of swelling and breathlessness, positional symptoms, cancer history and central venous devices.'],
    exam: ['Look for face, neck and arm swelling, distended neck or chest wall veins, stridor and altered mental status.'],
    workup: [
        ['Imaging', ['Use contrast-enhanced chest CT or a venous-phase study selected with radiology. Escalate stabilization before transport when the airway or circulation is threatened.']],
        ['Before intervention', ['Check renal function and obtain blood counts and coagulation studies when relevant to contrast or procedural planning.']]
    ],
    redFlags: ['Stridor or rapidly progressive respiratory symptoms.', 'Altered consciousness, syncope or hypotension.'],
    disposition: [
        ['Resuscitation / critical care', 'Threatened airway or neurological or circulatory compromise needs immediate coordinated care.'],
        ['Urgent specialist assessment', 'New symptomatic obstruction needs a plan for monitoring, imaging and definitive treatment.']
    ],
    pitfalls: ['Assuming every obstruction is caused by tumor compression and overlooking catheter-related thrombus.', 'Sending a patient with positional airway compromise to lie flat without an airway plan.'],
    pearls: ['Include airway symptoms, time course, ability to lie flat and venous access history in the specialist handover.'],
    refs: ['ACR Appropriateness Criteria for suspected SVC syndrome', 'NHS Ayrshire & Arran initial management of superior vena cava obstruction']
},
{
    id: 'cancer-immunotherapy-toxicity',
    name: 'Cancer Immunotherapy Emergencies',
    icon: '🩺',
    tag: 'Recognize CAR-T and checkpoint inhibitor toxicities and evaluate infection in parallel.',
    overview: 'CAR-T and other immune effector therapies can cause cytokine release syndrome (CRS) and immune effector cell-associated neurotoxicity syndrome (ICANS). Checkpoint inhibitors can cause inflammatory injury in multiple organs, including after treatment has stopped.',
    approach: [
        'Identify the exact product, last dose or infusion, treating center and any treatment alert card. Contact the oncology or cell therapy team early.',
        'After CAR-T, consider CRS with fever, hypotension or hypoxia. Evaluate for infection and give indicated empiric antimicrobials because CRS and sepsis can coexist.',
        'Assess new confusion, language difficulty or seizure for ICANS and other acute neurological causes. Document change from baseline and use the local neurotoxicity assessment.',
        'After a checkpoint inhibitor, investigate the affected organ and competing causes. Coordinate urgent organ-specific therapy with the treating team.'
    ],
    dontMiss: [
        ['Cytokine release syndrome (CRS)', 'critical', 'Fever with hypotension or hypoxia after immune effector therapy needs monitored resuscitation and urgent treatment-center guidance.'],
        ['Immune effector cell-associated neurotoxicity (ICANS)', 'critical', 'Aphasia, encephalopathy or seizure can develop during or after CRS. Evaluate neurological mimics and escalate promptly.'],
        ['Checkpoint inhibitor myocarditis', 'critical', 'New cardiac symptoms, troponin elevation or conduction abnormalities need ECG, monitoring and urgent cardiology and oncology input. Screen for overlapping myositis or myasthenia when weakness is present.'],
        ['Pneumonitis, colitis or endocrine crisis', 'emergent', 'New dyspnea, diarrhea, or unexplained hypotension after checkpoint blockade warrants targeted assessment for toxicity and alternative diagnoses.']
    ],
    history: ['Ask about immunotherapy, infusion timing, prior toxicity, immunosuppression and recent infection.', 'Clarify baseline bowel frequency, exercise tolerance, cognition and strength.'],
    exam: ['Assess oxygen requirement, perfusion, speech and mentation. Look for ptosis, bulbar weakness or respiratory muscle involvement.'],
    workup: [
        ['Fever or instability after CAR-T', ['Obtain cultures and initial sepsis studies. Repeat respiratory, hemodynamic and neurological assessments during treatment.']],
        ['Suspected checkpoint inhibitor toxicity', ['Order organ-specific investigations. For suspected myocarditis obtain ECG and troponin, and consider CK when muscle involvement is suspected.']]
    ],
    redFlags: ['Hypotension, hypoxia or rapidly rising oxygen needs.', 'New aphasia, confusion, seizure or reduced consciousness.', 'New heart block, arrhythmia, troponin rise or bulbar weakness.'],
    disposition: [
        ['Monitored admission / critical care', 'Escalate suspected myocarditis, significant CRS, neurotoxicity, or respiratory or circulatory compromise.'],
        ['Specialist-directed disposition', 'Discuss even mild suspected toxicity with the treating team, using the exact product and clinical course to guide monitoring.']
    ],
    pitfalls: ['Attributing fever after CAR-T to CRS and missing sepsis.', 'Treating CAR-T neurotoxicity as isolated CRS. Grade and treat both syndromes through the cell therapy protocol.'],
    pearls: ['Aphasia or a change in handwriting can be an early neurotoxicity clue after CAR-T.'],
    refs: ['SITC immune effector cell-related adverse events guideline', 'SITC immune checkpoint inhibitor-related adverse events guideline']
},
{
    id: 'acute-coronary-syndrome', type: 'diagnosis', name: 'Acute Coronary Syndrome (ACS)', icon: '🫀',
    tag: 'Recognize coronary occlusion early and use serial testing for suspected non-ST-elevation ACS.',
    overview: 'ACS includes STEMI, NSTEMI and unstable angina from acute myocardial ischemia. Chest pressure, dyspnea, diaphoresis, nausea or epigastric discomfort can be the presenting symptom. Adult emergency pathway.',
    approach: [
        'Obtain and interpret a 12-lead ECG within 10 minutes. Repeat with persistent or recurrent symptoms and compare with prior tracings when available.',
        'Activate the local reperfusion pathway for STEMI. For other patterns concerning for acute coronary occlusion, ongoing refractory ischemia or hemodynamic instability, seek immediate cardiology and reperfusion assessment. Do not wait for troponin.',
        'Give aspirin 162–325 mg orally, chewed, for ACS if eligible. If acute aortic syndrome is suspected, prioritize urgent aortic assessment before starting antithrombotic therapy. Coordinate further antiplatelet and anticoagulant treatment with the local ACS pathway.',
        'For suspected non-ST-elevation ACS without an immediate invasive indication, use serial ECGs and a validated, assay-specific high-sensitivity troponin pathway.'
    ],
    dontMiss: [
        ['Posterior or right ventricular infarction', 'critical', 'Record V7–V9 for suspected posterior infarction and right-sided leads such as V4R for suspected right ventricular involvement.'],
        ['Acute aortic syndrome with coronary malperfusion', 'critical', 'Abrupt chest or back pain with pulse deficit, neurologic signs or new aortic regurgitation changes the immediate pathway.', ['acute-aortic-syndrome']],
        ['Mechanical complication of MI', 'critical', 'New murmur, pulmonary edema or shock after MI needs urgent echo and cardiology assessment.']
    ],
    history: ['Establish onset, ongoing or recurrent symptoms, exertional pattern, previous coronary disease and antithrombotic use. Ask about recent bleeding.'],
    exam: ['Assess perfusion, heart failure, new murmur and pulse asymmetry. A reassuring exam can occur in ACS.'],
    workup: [
        ['ECG', ['Repeat during symptoms. ST depression maximal in V1–V3 may reflect posterior occlusion even with negative supplemental leads.']],
        ['Biomarkers', ['Acute MI requires acute myocardial injury, usually a rise or fall in troponin with a value above the assay’s 99th percentile, and evidence of ischemia. An elevated troponin alone indicates injury.']]
    ],
    redFlags: ['STEMI or suspected acute coronary occlusion.', 'Ongoing ischemia, shock, acute heart failure or a life-threatening arrhythmia.'],
    disposition: [
        ['Immediate invasive assessment', 'STEMI or very-high-risk ACS needs emergency cardiology and the appropriate reperfusion or transfer pathway.'],
        ['Monitored evaluation', 'Confirmed or suspected ACS with unresolved risk requires continued observation or admission and a documented management plan.'],
        ['Discharge', 'Use a completed validated low-risk pathway, reassess symptoms and alternative diagnoses, and arrange follow-up and return precautions.']
    ],
    pitfalls: ['Ruling out ACS with a single reference-range troponin or a nondiagnostic ECG.', 'Equating every troponin rise with type 1 MI.'],
    pearls: ['Document symptom onset, serial ECG and troponin times, and the reason for escalation or discharge.'],
    refs: ['2025 ACC/AHA multisociety ACS guideline', '2022 ACC ED chest pain pathway', 'Fifth Universal Definition of MI']
},
{
    id: 'acute-aortic-syndrome', type: 'diagnosis', name: 'Acute Aortic Syndrome (Aortic Dissection)', icon: '🩺',
    tag: 'Think of the aorta in abrupt severe pain, unexplained shock or signs of malperfusion.',
    overview: 'Acute aortic syndrome includes dissection, intramural hematoma and penetrating aortic ulcer. Ascending aortic involvement can cause tamponade, acute aortic regurgitation or coronary and cerebral malperfusion. Adult emergency pathway.',
    approach: [
        'Monitor closely, obtain IV access, give analgesia and contact the aortic team early. Involve cardiothoracic surgery immediately for suspected ascending involvement.',
        'Obtain urgent aortic CTA when transport is safe. Discuss bedside transesophageal echocardiography when CT is unsafe or impractical.',
        'For a hypertensive patient with adequate perfusion, start monitored IV anti-impulse therapy, usually a beta blocker first if appropriate. Target HR 60–80 bpm and SBP <120 mmHg or the lowest pressure maintaining organ perfusion. Add a vasodilator only after rate control if needed.',
        'If hypotensive or shocked, support perfusion and urgently assess for rupture, tamponade or severe aortic regurgitation with the surgical team.'
    ],
    dontMiss: [
        ['Type A dissection', 'critical', 'Any ascending aortic involvement requires emergency surgical evaluation.'],
        ['Complicated type B dissection', 'critical', 'Rupture, malperfusion, extension or refractory pain or hypertension needs urgent aortic intervention assessment.'],
        ['Tamponade or coronary malperfusion', 'critical', 'Shock or ischemic ECG changes can be caused by dissection and require cause-directed treatment.', ['cardiac-tamponade', 'acute-coronary-syndrome']]
    ],
    history: ['Ask about abrupt pain maximal at onset, syncope, prior aortic disease or surgery, connective-tissue disease and family history.'],
    exam: ['Check pulses, limb perfusion, both arm pressures when feasible, focused neurologic findings and a new diastolic murmur.'],
    workup: [
        ['Imaging', ['Coordinate an aortic protocol with radiology to define the full extent and branch-vessel involvement. Use bedside echo to identify complications while definitive assessment proceeds.']],
        ['Parallel tests', ['Obtain ECG, blood counts, renal function and type and crossmatch when indicated. Keep imaging and surgical contact moving.']]
    ],
    redFlags: ['Shock, syncope, focal neurologic deficit or a painful ischemic limb.', 'Abrupt severe chest, back or abdominal pain with an aortic risk feature.'],
    disposition: [
        ['Emergency surgery / transfer', 'Suspected or confirmed type A dissection or complicated type B disease requires immediate specialist coordination.'],
        ['Monitored admission', 'Uncomplicated type B disease starts with specialist-led medical management and surveillance.']
    ],
    pitfalls: ['Using a normal chest radiograph, symmetric pulses or a negative bedside echo to exclude dissection.', 'Giving a vasodilator before rate control or lowering BP in a poorly perfused patient.'],
    pearls: ['Chest pain with a new neurologic deficit or ischemic limb may be one aortic diagnosis.'],
    refs: ['2022 ACC/AHA aortic disease guideline']
},
{
    id: 'pulmonary-embolism', type: 'diagnosis', name: 'Acute Pulmonary Embolism (PE)', icon: '🫁',
    tag: 'Match diagnostic testing to pretest probability and treatment urgency to clinical severity.',
    overview: 'PE may present with dyspnea, pleuritic pain, syncope or hemoptysis. The diagnostic pathway below is for nonpregnant adults. Pregnancy and postpartum evaluation need an adapted pathway.',
    approach: [
        'In shock or deterioration, resuscitate and involve critical care and the local PE response or reperfusion team early. Use bedside echo when transport to CT is unsafe and integrate other causes of shock.',
        'In a stable patient with very low clinical probability, apply PERC when appropriate. If all criteria are negative, further PE testing is generally unnecessary.',
        'For low or intermediate probability, use D-dimer in a validated pathway, with age-adjusted or probability-adjusted thresholds as specified. High probability goes directly to imaging.',
        'Treat confirmed PE with anticoagulation when eligible. Choose the agent according to bleeding risk, renal function and procedural plans. Assess patients with shock or deterioration for urgent reperfusion.'
    ],
    dontMiss: [
        ['PE with cardiopulmonary failure', 'critical', 'Persistent hypotension, shock or arrest needs immediate resuscitation and consideration of advanced therapy.'],
        ['Impending deterioration', 'critical', 'Escalating oxygen needs or signs of hypoperfusion call for monitored reassessment and early team involvement.'],
        ['Other causes of obstructive shock', 'critical', 'Assess for tension pneumothorax and tamponade while evaluating a crashing patient.', ['tension-pneumothorax', 'cardiac-tamponade']]
    ],
    history: ['Ask about prior VTE, surgery, immobilization, cancer, estrogen, bleeding and current anticoagulation.'],
    exam: ['Assess oxygenation, perfusion, work of breathing and unilateral leg swelling.'],
    workup: [
        ['Imaging', ['CT pulmonary angiography is the usual definitive study. Consider ventilation-perfusion imaging when CTPA is unsuitable.']],
        ['Severity assessment', ['Use hemodynamics, oxygen needs, RV imaging and biomarkers as appropriate to determine monitoring and treatment. RV strain alone does not establish a reperfusion indication.']]
    ],
    redFlags: ['Persistent hypotension, hypoperfusion, syncope with instability or rising oxygen needs.'],
    disposition: [
        ['Critical care', 'Shock, clinical deterioration or advanced therapy needs critical care and specialty input.'],
        ['Admission', 'Elevated clinical severity or barriers to safe outpatient care require inpatient treatment.'],
        ['Selected outpatient care', 'Use a validated low-risk assessment such as Hestia or PESI-based criteria plus bleeding risk, medication access and reliable follow-up.']
    ],
    pitfalls: ['Using PERC outside the very-low-risk group or mixing D-dimer thresholds from different pathways.', 'Ruling out PE because oxygen saturation is normal.'],
    pearls: ['Diagnostic probability and severity after diagnosis answer different questions. Document both.'],
    refs: ['2026 AHA/ACC multisociety acute PE guideline']
},
{
    id: 'tension-pneumothorax', type: 'diagnosis', name: 'Tension Pneumothorax', icon: '🫁',
    tag: 'Decompress suspected tension physiology with severe respiratory or circulatory compromise.',
    overview: 'Rising pleural pressure can impair ventilation and venous return. Tension can follow trauma, a procedure or positive-pressure ventilation, or complicate a spontaneous pneumothorax. Adult emergency pathway.',
    approach: [
        'Give oxygen as indicated, monitor and call for resuscitation help. Suspect tension when abrupt respiratory or circulatory compromise accompanies asymmetric chest findings or occurs after positive-pressure ventilation.',
        'If suspicion is high and the patient has hemodynamic instability or severe respiratory compromise, decompress immediately. Use the technique appropriate to the setting and team training. Do not delay for imaging.',
        'Ensure definitive pleural drainage after emergency decompression. Reassess ventilation, perfusion, response and drain function immediately.'
    ],
    dontMiss: [
        ['Persistent or recurrent tension', 'critical', 'If the patient fails to improve or deteriorates again, reassess the side, decompression effectiveness and drain patency while searching for other causes.'],
        ['Major hemothorax or tamponade after trauma', 'critical', 'Persistent shock may reflect bleeding or tamponade even when pleural decompression has succeeded.', ['cardiac-tamponade']]
    ],
    history: ['Ask about trauma, recent central access or pleural procedures, lung disease and ventilator changes.'],
    exam: ['Assess asymmetric air entry or chest movement, work of breathing, perfusion and ventilator pressures. Tracheal deviation and distended neck veins may be absent.'],
    workup: [
        ['Unstable', ['Clinical assessment drives emergency action. Use bedside ultrasound only if it does not delay decompression.']],
        ['Stable or after stabilization', ['Use lung ultrasound or chest imaging as appropriate to define pneumothorax and assess drainage and other injuries.']]
    ],
    redFlags: ['Shock, arrest or severe respiratory compromise with plausible tension pneumothorax.', 'Sudden desaturation or high airway pressures after intubation, trauma or a procedure.'],
    disposition: [['Monitored admission / critical care', 'Continue monitoring and definitive pleural drainage. Involve trauma, thoracic or critical-care teams as appropriate.']],
    pitfalls: ['Waiting for classic signs or a chest radiograph in a crashing patient.', 'Treating absent lung sliding alone as proof of tension.'],
    pearls: ['Reassessment after decompression can reveal a blocked drain, ongoing air leak or another cause of shock.'],
    refs: ['NICE NG39 major trauma recommendations', 'ERC 2025 traumatic cardiac arrest guidance', 'ACEP lung ultrasound Sonoguide']
},
{
    id: 'esophageal-perforation', type: 'diagnosis', name: 'Esophageal Perforation (Boerhaave Syndrome)', icon: '🩺',
    tag: 'Consider a leak after forceful vomiting or instrumentation and consult early.',
    overview: 'A full-thickness esophageal tear can contaminate the mediastinum, pleural space or abdomen. Boerhaave syndrome is spontaneous rupture, typically after forceful vomiting. Adult emergency pathway.',
    approach: [
        'Resuscitate, keep the patient NPO and involve thoracic or upper GI surgery immediately. Coordinate transfer early if definitive care is unavailable.',
        'Start IV broad-spectrum antibiotics covering aerobic and anaerobic organisms when perforation is suspected. Treat sepsis and obtain cultures if this does not delay antibiotics.',
        'When safe to transport, obtain contrast-enhanced CT using the suspected perforation or CT esophagography protocol agreed with radiology. Do not delay surgical contact for imaging.',
        'Coordinate drainage and repair, endoscopic treatment or selected nonoperative care with the specialist team based on stability, leak location and contamination.'
    ],
    dontMiss: [
        ['Free perforation or mediastinitis', 'critical', 'Sepsis, shock or extensive pleural or mediastinal contamination needs urgent source control.'],
        ['Competing chest pain emergencies', 'critical', 'Continue parallel assessment for ACS and aortic emergencies when the presentation supports them.', ['acute-coronary-syndrome', 'acute-aortic-syndrome']]
    ],
    history: ['Ask about forceful emesis, endoscopy, foreign body, severe pain with swallowing and symptom timing.'],
    exam: ['Assess for chest or epigastric tenderness, subcutaneous crepitus, respiratory distress and shock. Early findings can be subtle.'],
    workup: [
        ['Imaging', ['Look for extraluminal air or contrast, pleural fluid and mediastinal collections. Discuss persistent suspicion after nondiagnostic imaging with the specialist team.']],
        ['Labs', ['Blood count, metabolic profile and lactate help assess organ dysfunction and support resuscitation.']]
    ],
    redFlags: ['Severe chest or epigastric pain after vomiting or instrumentation.', 'Pleural effusion, subcutaneous air or sepsis in that setting.'],
    disposition: [
        ['Urgent surgery or transfer', 'Unstable patients or uncontrolled leaks require emergency source-control assessment.'],
        ['Specialist monitored admission', 'A stable patient with a contained leak may qualify for nonoperative management under close expert surveillance.']
    ],
    pitfalls: ['Waiting for vomiting, chest pain and subcutaneous emphysema to all be present.', 'Blindly passing a nasogastric tube when perforation is suspected.'],
    pearls: ['Distinguish full-thickness rupture from a mucosal Mallory–Weiss tear. Their treatment and risks differ.'],
    refs: ['WSES esophageal emergencies guideline']
},
{
    id: 'cardiac-tamponade', type: 'diagnosis', name: 'Cardiac Tamponade', icon: '🫀',
    tag: 'Identify impaired cardiac filling and arrange cause-specific drainage urgently.',
    overview: 'Pericardial pressure can impair ventricular filling and cause obstructive shock. The rate of fluid accumulation matters. A rapidly developing small effusion can be dangerous. Adult emergency pathway.',
    approach: [
        'Assess perfusion, monitor, obtain IV access and perform bedside echo. Call the team capable of urgent drainage as soon as tamponade is suspected.',
        'Interpret echo findings alongside hemodynamics. Right atrial or right ventricular collapse and a plethoric IVC support the diagnosis in context.',
        'Use supportive resuscitation as a bridge to urgent drainage in an unstable patient. If intubation is necessary, prepare for hemodynamic deterioration with an experienced team.',
        'Choose image-guided pericardiocentesis or surgical drainage based on the cause and setting. Suspected type A dissection, traumatic bleeding or myocardial free-wall rupture requires immediate surgical coordination.'
    ],
    dontMiss: [
        ['Hemopericardium from type A dissection', 'critical', 'Abrupt pain, aortic findings and an effusion with shock require emergency aortic surgical evaluation.', ['acute-aortic-syndrome']],
        ['Traumatic or post-procedure tamponade', 'critical', 'Notify the relevant procedural or trauma team promptly and plan definitive treatment based on mechanism.']
    ],
    history: ['Ask about trauma, recent cardiac procedures, cancer, renal failure, infection and anticoagulant use.'],
    exam: ['Look for tachycardia, low BP, elevated venous pressure and impaired perfusion. The full Beck triad is often absent.'],
    workup: [
        ['Echo', ['Perform focused bedside echo in shock and obtain formal imaging when feasible. Postoperative collections may be loculated and difficult to see.']],
        ['ECG', ['Low voltage or electrical alternans may support suspicion. A normal ECG does not exclude tamponade.']]
    ],
    redFlags: ['Hypoperfusion, persistent hypotension or PEA with a plausible pericardial cause.', 'New effusion with deterioration after trauma or a cardiac procedure.'],
    disposition: [['Emergency intervention / critical care', 'Unstable tamponade needs immediate intervention and monitoring for recurrence and the underlying cause.']],
    pitfalls: ['Equating any effusion with tamponade or excluding it because an effusion looks small.', 'Delaying definitive drainage while waiting for a complete workup in a deteriorating patient.'],
    pearls: ['The mechanism determines the drainage strategy. State it explicitly in the handover.'],
    refs: ['2025 ESC myocarditis and pericarditis guideline', 'ERC 2025 traumatic cardiac arrest guidance', '2022 ACC/AHA aortic disease guideline']
},
{
    id: 'acute-mesenteric-ischemia', type: 'diagnosis', name: 'Acute Mesenteric Ischemia', icon: '🩺',
    tag: 'Order urgent mesenteric CTA when suspected. Early exam and lactate may be reassuring.',
    overview: 'Acute intestinal ischemia can result from arterial embolism or thrombosis, mesenteric venous thrombosis, or low-flow nonocclusive ischemia. Treatment depends on the mechanism and bowel viability. Adult emergency pathway.',
    approach: [
        'Suspect ischemia with severe unexplained abdominal pain, especially with atrial fibrillation, vascular disease or a low-flow state. Peritoneal signs may develop late.',
        'Request urgent mesenteric CTA with arterial and portal venous phases. Avoid oral contrast. Suspected acute mesenteric ischemia warrants CTA even with acute kidney injury.',
        'Resuscitate, keep NPO, start broad-spectrum IV antibiotics and involve general and vascular surgery early. Discuss anticoagulation with the treating team based on mechanism, bleeding risk and operative plans.',
        'Peritonitis needs prompt operative exploration. Coordinate revascularization for arterial occlusion and cause-directed treatment for venous or low-flow disease.'
    ],
    dontMiss: [
        ['Arterial occlusion', 'critical', 'Abrupt pain with AF suggests embolism. Underlying atherosclerotic disease can predispose to arterial thrombosis. Both need urgent assessment for revascularization.'],
        ['Nonocclusive mesenteric ischemia', 'critical', 'Consider bowel ischemia in a low-flow or vasopressor-dependent patient with new distention, feeding intolerance or unexplained deterioration.'],
        ['Mesenteric venous thrombosis', 'critical', 'Consider in prothrombotic states. Anticoagulation is generally first-line when there is no peritonitis and bleeding risk permits.'],
        ['Bowel necrosis', 'critical', 'Peritonitis or shock with suspected infarction requires immediate surgical escalation.']
    ],
    history: ['Ask about AF, recent embolic events, prior postprandial pain or weight loss, low-flow illness and venous thrombotic risks.'],
    exam: ['Repeat perfusion and abdominal examinations. Pain may be out of proportion early. Guarding or rigidity raises concern for infarction.'],
    workup: [
        ['CTA', ['Tell radiology the specific concern so the scan includes the required vascular phases. A routine portal-venous CT alone may miss an arterial lesion.']],
        ['Parallel labs', ['Obtain blood counts, metabolic and coagulation studies, lactate and type and screen as indicated. A normal lactate cannot exclude early ischemia.']]
    ],
    redFlags: ['Severe unexplained pain with embolic or vascular risk.', 'Peritonitis, shock or unexplained deterioration in a low-flow state.'],
    disposition: [['Emergency surgery / vascular care', 'Arrange immediate specialty evaluation and early transfer if revascularization or surgery is unavailable.']],
    pitfalls: ['Waiting for lactate elevation, bloody stool or peritonitis to request CTA.', 'Using improvement after analgesia to rule out bowel ischemia.'],
    pearls: ['Name the suspected mechanism in the handover and report whether peritonitis is present.'],
    refs: ['WSES acute mesenteric ischemia guideline (2022)', 'ESVS mesenteric and renal vessel disease guideline (2025)', 'Emergency General Surgery Algorithms working group: acute mesenteric ischemia (2025)']
},
{
    id: 'ruptured-abdominal-aortic-aneurysm', type: 'diagnosis', name: 'Ruptured Abdominal Aortic Aneurysm (AAA)', icon: '🩺',
    tag: 'Recognize possible rupture with abdominal, back or flank pain, syncope or shock.',
    overview: 'An abdominal aortic aneurysm can rupture into the retroperitoneum, sometimes with transient hemodynamic stability. The classic combination of pain, hypotension and a pulsatile mass is often incomplete. Adult emergency pathway.',
    approach: [
        'Activate vascular surgery and the local major hemorrhage pathway early. Obtain IV access and prepare blood products while coordinating definitive repair or transfer.',
        'Use bedside aortic ultrasound when it can rapidly identify an aneurysm. It cannot reliably confirm or exclude rupture.',
        'Obtain urgent CTA for diagnosis and repair planning when feasible and safe. If the patient is deteriorating, coordinate direct intervention or transfer with the vascular team.',
        'Use the local ruptured-AAA resuscitation protocol. In hemorrhagic shock, give blood products as indicated and avoid large-volume crystalloid or targeting normal BP before hemorrhage control.'
    ],
    dontMiss: [
        ['Contained rupture', 'critical', 'Transient improvement in BP or pain does not establish stability. Maintain vascular involvement.'],
        ['Acute aortic syndrome', 'critical', 'Chest pain, pulse deficits or new neurologic signs raise concern for dissection with malperfusion.', ['acute-aortic-syndrome']]
    ],
    history: ['Ask about known aneurysm or prior repair, smoking and vascular disease. Clarify pain onset and any syncope.'],
    exam: ['Assess perfusion and mental status. Look for abdominal tenderness, pulsatile mass and limb ischemia, which may be absent.'],
    workup: [
        ['Bedside ultrasound', ['An aneurysm in a compatible presentation raises suspicion. A nondiagnostic scan or absent intraperitoneal free fluid cannot rule out rupture.']],
        ['CTA and labs', ['Coordinate the aortic imaging protocol and send blood count, coagulation studies and type and crossmatch in parallel.']]
    ],
    redFlags: ['New abdominal, flank or back pain in a patient with known AAA.', 'Unexplained hypotension, syncope or transient shock with a plausible aortic cause.'],
    disposition: [['Emergency vascular intervention / transfer', 'Suspected rupture requires urgent care at a center capable of definitive repair.']],
    pitfalls: ['Anchoring on renal colic in an older or vascular-risk patient with new flank pain.', 'Waiting for persistent hypotension or a palpable mass before consulting vascular surgery.'],
    pearls: ['Share the lowest BP, current perfusion, prior aortic repair and imaging availability when arranging transfer.'],
    refs: ['ESVS 2024 abdominal aorto-iliac aneurysm guideline']
},
{
    id: 'acute-appendicitis', type: 'diagnosis', name: 'Acute Appendicitis', icon: '🩺',
    tag: 'Use a risk-guided workup and distinguish uncomplicated disease from perforation or abscess.',
    overview: 'Appendicitis often causes progressive right lower quadrant pain, sometimes after central abdominal pain. Early disease, pregnancy and older age can produce less typical findings. This guide focuses on adult assessment.',
    approach: [
        'Assess for peritonitis or sepsis. Provide analgesia, antiemetics and fluids as needed. Contact surgery early for high suspicion, instability or complicated disease.',
        'Combine history, examination, labs and a validated score when used locally to guide observation and imaging. Obtain pregnancy testing when relevant.',
        'Select imaging for the clinical setting. CT is commonly used in nonpregnant adults with unresolved suspicion. In pregnancy, use ultrasound and consider MRI if ultrasound is nondiagnostic.',
        'Coordinate appendectomy or selected antibiotic-first management with surgery. Antibiotic-first treatment is an option for selected uncomplicated cases after discussion of failure, recurrence and follow-up.'
    ],
    dontMiss: [
        ['Perforation, abscess or generalized peritonitis', 'critical', 'Give appropriate IV antibiotics and involve surgery promptly for source-control planning.'],
        ['Ectopic pregnancy or adnexal torsion', 'critical', 'Consider pregnancy-related and gynecologic emergencies in the appropriate patient.', ['pelvic-pain']]
    ],
    history: ['Ask about migration, progression, appetite, vomiting, urinary symptoms and pregnancy or gynecologic symptoms when relevant.'],
    exam: ['Assess focal tenderness, guarding and signs of generalized peritonitis. Repeat the exam if initial findings are equivocal.'],
    workup: [
        ['Labs', ['Use CBC, inflammatory markers, urinalysis and pregnancy testing as indicated. Individual normal findings cannot exclude appendicitis.']],
        ['Imaging', ['Use a local risk-based imaging pathway. Persistent suspicion after a nondiagnostic study needs reassessment or further imaging.']]
    ],
    redFlags: ['Generalized peritonitis, sepsis or worsening pain despite observation.'],
    disposition: [
        ['Surgical evaluation', 'Confirmed or strongly suspected appendicitis requires surgical assessment.'],
        ['Observation or selected discharge', 'If uncertainty persists, reassess or observe. Discharge only after a low-risk reassessment with reliable follow-up and explicit return precautions.']
    ],
    pitfalls: ['Calling a nondiagnostic ultrasound negative.', 'Using temporary pain relief or a single normal blood test to exclude appendicitis.'],
    pearls: ['If imaging confirms appendicitis, note whether it shows an appendicolith, perforation or abscess. These findings inform the treatment discussion.'],
    refs: ['WSES Jerusalem guidelines for acute appendicitis (2025 edition)']
},
{
    id: 'small-bowel-obstruction', type: 'diagnosis', name: 'Small Bowel Obstruction (SBO)', icon: '🩺',
    tag: 'Identify closed-loop obstruction, ischemia and strangulated hernia early.',
    overview: 'SBO can cause colicky pain, vomiting, distention and reduced stool or flatus. Prior abdominal surgery suggests adhesions. Hernia and malignancy are other important causes. Adult emergency pathway.',
    approach: [
        'Assess perfusion and peritoneal signs. Keep NPO, give IV fluid and correct electrolyte losses. Obtain early surgical review.',
        'Use CT abdomen and pelvis, typically with IV contrast when suitable, to define the transition point, cause and signs of compromise.',
        'Consider nasogastric decompression for significant vomiting, distention or aspiration risk. Give appropriate antibiotics when ischemia, perforation or sepsis is suspected.',
        'Peritonitis, strangulation, bowel ischemia or closed-loop obstruction calls for urgent surgical assessment. Selected uncomplicated adhesive SBO can undergo monitored nonoperative care with serial examinations.'
    ],
    dontMiss: [
        ['Closed-loop obstruction or strangulation', 'critical', 'Continuous severe pain, peritonitis or CT signs of compromised bowel require urgent surgical escalation.'],
        ['Incarcerated or strangulated hernia', 'critical', 'Examine the groins and abdominal wall, including prior incisions.'],
        ['Acute mesenteric ischemia', 'critical', 'Severe unexplained pain or embolic risk may require a dedicated mesenteric CTA pathway.', ['acute-mesenteric-ischemia']]
    ],
    history: ['Ask about prior operations, hernias, malignancy, vomiting and last stool or flatus. Early or partial obstruction can still permit stool passage.'],
    exam: ['Assess hydration, distention, focal tenderness, peritoneal signs and hernias. Repeat the exam after resuscitation.'],
    workup: [
        ['CT', ['Look for a transition point, closed loop, reduced bowel wall enhancement or free fluid. Interpret CT with the clinical course.']],
        ['Labs', ['Check electrolytes and renal function for fluid losses, and CBC and lactate when ischemia or systemic illness is suspected.']]
    ],
    redFlags: ['Peritonitis, persistent severe pain, fever with deterioration or shock.', 'Closed-loop obstruction or imaging concern for ischemia.'],
    disposition: [
        ['Urgent operative assessment', 'Escalate possible ischemia, strangulation or perforation immediately.'],
        ['Surgical admission', 'Monitor selected uncomplicated adhesive SBO with serial examination and a defined plan for escalation.']
    ],
    pitfalls: ['Assuming every obstruction after surgery is uncomplicated adhesive disease.', 'Letting ongoing stool passage or a normal initial lactate override concerning findings.'],
    pearls: ['Describe the transition point, hernia findings, perfusion and whether the pain is changing from intermittent to continuous.'],
    refs: ['WSES Bologna guideline for adhesive small bowel obstruction', 'Emergency General Surgery Algorithms working group: small bowel obstruction (2025)']
},
{
    id: 'ectopic-pregnancy', type: 'diagnosis', name: "Ectopic Pregnancy", icon: '🩺',
    tag: "Recognize rupture early and arrange follow-up until pregnancy location or resolution is established.",
    overview: "Ectopic pregnancy can present with pelvic or abdominal pain, vaginal bleeding, syncope or shock. Tubal pregnancy is the focus of this guide. Risk factors may be absent.",
    approach: [
        "For suspected rupture with instability, resuscitate, activate hemorrhage support as indicated and call gynecology immediately for operative management. Do not delay for formal imaging.",
        "In stable patients with pain or bleeding and a positive pregnancy test, obtain pelvic ultrasound regardless of the hCG value. Use transvaginal imaging when appropriate.",
        "If ultrasound identifies neither an intrauterine nor an ectopic pregnancy, document pregnancy of unknown location (PUL). Arrange early-pregnancy follow-up with two quantitative hCG measurements as close as possible to 48 hours apart and no earlier, and repeat ultrasound according to the pathway. Reassess sooner for new or worsening symptoms.",
        "Confirmed unruptured tubal ectopic pregnancy may qualify for expectant management, methotrexate or surgery. Gynecology selects the option using symptoms, imaging, hCG, contraindications and ability to complete follow-up."
    ],
    dontMiss: [
        ["Ruptured ectopic pregnancy", "critical", "Syncope, shoulder-tip pain, peritonism, hypotension or concerning free fluid with possible pregnancy requires immediate escalation."],
        ["Heterotopic pregnancy", "emergent", "Persistent concerning pain or an adnexal mass warrants reassessment even with a confirmed intrauterine pregnancy, especially after assisted reproduction."]
    ],
    history: ["Ask about pain, bleeding, fainting, prior ectopic pregnancy, tubal surgery and assisted reproduction."],
    exam: ["Assess perfusion and abdominal tenderness or guarding. Repeat vitals and examination if symptoms evolve."],
    workup: [
        ["Imaging", ["Assess pregnancy location, both adnexa and free fluid. An empty uterus alone does not establish ectopic pregnancy."]],
        ["Labs", ["Quantitative serum hCG, CBC, blood type and testing for transfusion or Rh prophylaxis as indicated by the local pathway."]]
    ],
    redFlags: ["Shock, syncope, increasing pain, peritonism or significant free fluid."],
    disposition: [
        ["Emergency operation or transfer", "Suspected rupture with instability needs immediate gynecologic and hemorrhage management."],
        ["Reliable specialist follow-up", "A stable patient with PUL needs a named follow-up service, a scheduled test plan and written 24-hour return instructions. After methotrexate, follow serial hCG to resolution under the treating team."]
    ],
    pitfalls: [
        "Using one hCG result or a reassuring trend to rule out ectopic pregnancy.",
        "Giving methotrexate at the first visit based only on an empty uterus or an hCG threshold."
    ],
    pearls: ["When symptoms worsen, reassess immediately even if hCG is falling."],
    refs: ["NICE NG126 pregnancy location and follow-up", "NICE NG126 management of tubal ectopic pregnancy", "ACEP clinical policy: early pregnancy in the emergency department"]
},
{
    id: 'ovarian-torsion', type: 'diagnosis', name: "Ovarian Torsion (Adnexal Torsion)", icon: '🩺',
    tag: "Call gynecology promptly when the history suggests torsion, even with preserved Doppler flow.",
    overview: "Twisting of the ovary and sometimes the fallopian tube can compromise blood supply. Pain can be intermittent. An adnexal mass raises suspicion, but adolescents can have torsion without a mass.",
    approach: [
        "Suspect torsion with sudden unilateral pelvic or lower abdominal pain, particularly with nausea or vomiting.",
        "Provide analgesia and antiemetics, keep NPO and obtain a pregnancy test when relevant. Contact gynecology early when suspicion is high.",
        "Obtain pelvic ultrasound with Doppler promptly if it can be done without delaying specialist assessment. Use the transabdominal and, when appropriate, transvaginal approach.",
        "Persistent clinical concern needs urgent surgical evaluation despite equivocal imaging. Laparoscopy confirms the diagnosis and allows detorsion. Ovarian preservation is the usual goal in adolescents."
    ],
    dontMiss: [
        ["Intermittent torsion", "critical", "Pain can improve after spontaneous detorsion. Recurrent abrupt unilateral pain warrants assessment."],
        ["Ectopic pregnancy", "critical", "Assess pregnancy location and bleeding risk when the pregnancy test is positive.", ["ectopic-pregnancy"]]
    ],
    history: ["Ask about sudden onset, prior episodes, known adnexal cysts or masses, fertility treatment and pregnancy possibility."],
    exam: ["Assess perfusion and localized or generalized tenderness. Exam findings can be mild between episodes."],
    workup: [["Pelvic ultrasound", ["Look for ovarian enlargement, edema, peripheral follicles, a twisted pedicle and asymmetry. Preserved arterial flow does not rule out torsion."]]],
    redFlags: ["Abrupt or recurrent unilateral pain with vomiting, especially with an adnexal mass or concerning imaging."],
    disposition: [["Urgent gynecology assessment", "Arrange timely evaluation for laparoscopy or transfer when surgery is unavailable."]],
    pitfalls: ["Discharging solely because pain improved or Doppler flow is present."],
    pearls: ["Report pain onset and recurrence, adnexal findings and pregnancy status in the handover."],
    refs: ["ACOG committee opinion: adnexal torsion in adolescents", "ACR Appropriateness Criteria: acute pelvic pain in the reproductive age group"]
},
{
    id: 'testicular-torsion', type: 'diagnosis', name: "Testicular Torsion", icon: '🩺',
    tag: "Contact urology immediately when torsion is likely. Arrange exploration without delaying for imaging.",
    overview: "Twisting of the spermatic cord threatens testicular viability. Torsion can occur at any age and may present as lower abdominal or groin pain, especially in children and adolescents.",
    approach: [
        "Ask about onset and prior self-resolving episodes. Examine the testes when lower abdominal or groin pain could be referred.",
        "Give analgesia, keep NPO and contact urology immediately when suspicion is high. Arrange emergency exploration or transfer if definitive care is unavailable.",
        "Use urgent color Doppler ultrasound in equivocal cases when this will not delay treatment. Preserved flow can occur in partial or intermittent torsion.",
        "Manual detorsion may be attempted by an experienced clinician while awaiting surgery. Pain relief or restored flow still requires definitive surgical exploration and fixation."
    ],
    dontMiss: [
        ["Intermittent torsion", "critical", "Prior abrupt episodes or transient pain relief can indicate torsion and detorsion."],
        ["Incarcerated hernia or necrotizing infection", "critical", "Assess the inguinal region and perineum for other time-critical causes of an acute scrotum.", ["scrotal-pain"]]
    ],
    history: ["Establish the time of symptom onset. Ask about nausea, vomiting, trauma, dysuria and prior episodes."],
    exam: ["Compare testicular lie, position, swelling and tenderness. A present cremasteric reflex cannot exclude torsion."],
    workup: [["Doppler when appropriate", ["Compare flow with the opposite testis and assess for a twisted cord. Keep urology involved if imaging and examination disagree."]]],
    redFlags: ["Sudden severe unilateral pain, vomiting or a high-riding or transverse testis."],
    disposition: [["Emergency urology or transfer", "Salvage decreases with time. Escalate even when presentation is delayed or duration is uncertain."]],
    pitfalls: [
        "Treating presumed epididymitis before excluding torsion in a concerning presentation.",
        "Using six hours as a cutoff for referral or exploration."
    ],
    pearls: ["Give the receiving team the earliest known onset and details of any detorsion attempt."],
    refs: ["AUA medical student curriculum: acute scrotum", "EAU paediatric urology guideline: acute scrotum"]
},
{
    id: 'perforated-peptic-ulcer', type: 'diagnosis', name: "Perforated Peptic Ulcer", icon: '🩺',
    tag: "Suspect gastroduodenal perforation with abrupt severe epigastric pain and peritonism.",
    overview: "A perforated gastric or duodenal ulcer can rapidly cause peritonitis and sepsis. The findings can be subtle with a contained leak, in older adults or in immunosuppressed patients.",
    approach: [
        "Assess perfusion, obtain IV access, give analgesia and keep NPO. Contact general surgery early when perforation is suspected.",
        "Start broad-spectrum IV antibiotics covering enteric gram-negative, gram-positive and anaerobic organisms, guided by local policy. Resuscitate for sepsis or shock as indicated.",
        "Obtain urgent CT when the patient can safely undergo imaging. A radiograph can show free air if CT is unavailable, but a negative radiograph does not exclude a leak.",
        "Arrange urgent surgical source control for peritonitis, ongoing leak or significant free air in a compatible presentation. If CT is nondiagnostic and suspicion remains, discuss further imaging or exploration with surgery."
    ],
    dontMiss: [
        ["Free perforation with peritonitis", "critical", "Generalized guarding or deterioration needs urgent source-control assessment."],
        ["Other causes of abrupt abdominal pain", "critical", "Assess for mesenteric ischemia or a ruptured AAA in parallel when the clinical context fits.", ["acute-mesenteric-ischemia", "ruptured-abdominal-aortic-aneurysm"]]
    ],
    history: ["Ask about NSAIDs, ulcer disease, recent procedures and whether the pain started abruptly."],
    exam: ["Check perfusion, abdominal tenderness and guarding. Repeat examination after analgesia and resuscitation."],
    workup: [
        ["Imaging", ["CT can show extraluminal gas, fluid or a focal gastroduodenal defect. Discuss a water-soluble contrast study when concern remains despite initial imaging."]],
        ["Labs", ["Obtain CBC, renal function, lactate and type and screen as indicated without delaying surgical contact."]]
    ],
    redFlags: ["Generalized peritonitis, septic shock or imaging evidence of a free leak."],
    disposition: [["Emergency surgical assessment", "Most free perforations need prompt repair. Observation is reserved for carefully selected stable patients with evidence of a sealed leak under a surgical team."]],
    pitfalls: [
        "Using absence of free air on radiography to exclude perforation.",
        "Waiting for lab abnormalities before consulting surgery."
    ],
    pearls: ["Perforation and bleeding are distinct ulcer complications and require different first steps."],
    refs: ["WSES perforated and bleeding peptic ulcer guideline (2020)", "WSES and partner societies: source control in emergency general surgery (2023)"]
},
{
    id: 'acute-cholecystitis', type: 'diagnosis', name: "Acute Cholecystitis", icon: '🩺',
    tag: "Distinguish gallbladder inflammation from biliary colic and infected duct obstruction.",
    overview: "Acute cholecystitis commonly follows persistent cystic duct obstruction. Persistent right upper quadrant pain and signs of inflammation raise suspicion. Acalculous disease in critical illness follows a separate specialist pathway.",
    approach: [
        "Assess for sepsis and provide analgesia, antiemetics and fluids as indicated. Keep NPO while arranging surgical assessment.",
        "Use right upper quadrant ultrasound first. Interpret stones, gallbladder wall thickening, pericholecystic fluid and sonographic Murphy sign with the rest of the assessment.",
        "If suspicion persists after nondiagnostic ultrasound, discuss additional imaging with radiology and surgery. Assess for common bile duct obstruction if jaundice or cholestatic labs are present.",
        "Start antibiotics according to severity and local policy. Early laparoscopic cholecystectomy is preferred when feasible. If operative risk is high, individualize treatment with surgery. Consider drainage if surgery is unsuitable and infection remains uncontrolled."
    ],
    dontMiss: [
        ["Gangrenous, emphysematous or perforated cholecystitis", "critical", "Sepsis, peritonitis or concerning imaging needs urgent surgical source control."],
        ["Acute cholangitis", "critical", "Systemic inflammation plus cholestasis or imaging evidence of duct obstruction warrants prompt biliary drainage assessment.", ["acute-cholangitis"]]
    ],
    history: ["Ask about duration and recurrence, prior gallstones or biliary procedures, fever, jaundice and dark urine."],
    exam: ["Assess right upper quadrant tenderness, Murphy sign, jaundice and perfusion. No single exam sign excludes disease."],
    workup: [
        ["Labs", ["CBC, liver chemistry and bilirubin. Check lipase if pancreatitis is possible."]],
        ["Imaging", ["Ultrasound first. Additional imaging depends on whether the unresolved question is gallbladder inflammation, duct obstruction or another cause."]]
    ],
    redFlags: ["Hypotension, peritonitis, jaundice with systemic illness or concern for gallbladder necrosis."],
    disposition: [["Surgical assessment / admission", "Confirmed cholecystitis needs an early source-control plan. Escalate complications or organ dysfunction immediately."]],
    pitfalls: [
        "Diagnosing cholecystitis from gallstones alone.",
        "Assuming abnormal liver enzymes alone prove a common duct stone."
    ],
    pearls: ["Name whether the leading concern is gallbladder inflammation or infected duct obstruction."],
    refs: ["WSES acute calculous cholecystitis guideline (2020)", "EAST high-risk acute cholecystitis guideline (2026)"]
},
{
    id: 'acute-cholangitis', type: 'diagnosis', name: "Acute (Ascending) Cholangitis", icon: '🩺',
    tag: "Treat infection promptly and arrange drainage of the obstructed biliary system.",
    overview: "Acute cholangitis is infection of the biliary tree, usually with obstruction from a stone, stricture or blocked stent. Fever, jaundice and right upper quadrant pain need not all be present.",
    approach: [
        "Look for systemic inflammation, cholestasis and evidence of biliary obstruction. Check for shock, confusion and organ dysfunction early.",
        "Obtain cultures when feasible without delaying indicated antibiotics. Start empiric IV antibiotics and resuscitation according to severity and the local biliary sepsis pathway.",
        "Contact the biliary endoscopy team early. ERCP is preferred for drainage when feasible. In shock or deterioration, coordinate urgent drainage in parallel with resuscitation. ASGE generally favors decompression within 48 hours.",
        "If ERCP is unavailable or unsuccessful, coordinate transfer or alternative drainage. In an unstable patient, initial drainage alone may be safer than adding definitive stone clearance at the same procedure."
    ],
    dontMiss: [
        ["Cholangitis with shock or organ dysfunction", "critical", "Escalate to critical care and the drainage team immediately. A general timing target is not a reason to wait."],
        ["Obstructed biliary stent", "critical", "Ask about prior ERCP, stents and expected exchange dates when new fever or jaundice develops."]
    ],
    history: ["Ask about gallstones, biliary surgery or instrumentation, malignancy and previous resistant organisms."],
    exam: ["Assess perfusion, mental status, jaundice and abdominal tenderness. Repeat vital signs after treatment."],
    workup: [
        ["Labs", ["CBC, liver chemistry, bilirubin and renal function. Add lactate, cultures and coagulation studies when indicated."]],
        ["Imaging", ["Start with ultrasound when appropriate. A nondilated duct does not exclude early obstruction. Discuss CT, MRCP or endoscopic ultrasound if uncertainty remains and testing will not delay necessary drainage."]]
    ],
    redFlags: ["Hypotension, altered mental status, oliguria or respiratory compromise with suspected biliary infection."],
    disposition: [["Admission with drainage plan", "Coordinate timing and modality with gastroenterology and the receiving center. Organ dysfunction warrants critical-care assessment."]],
    pitfalls: [
        "Waiting for the full Charcot triad.",
        "Continuing antibiotics without reassessing source control when the patient worsens."
    ],
    pearls: ["Share prior biliary anatomy, stent history and resuscitation response when calling for drainage."],
    refs: ["ASGE management of cholangitis guideline (2021)", "Surviving Sepsis Campaign adult guideline (2026)"]
},
{
    id: 'acute-pancreatitis', type: 'diagnosis', name: "Acute Pancreatitis", icon: '🩺',
    tag: "Confirm the diagnosis, reassess early for organ failure, and identify a biliary cause.",
    overview: "Diagnose acute pancreatitis when at least two of three findings are present: typical pain, lipase or amylase at least three times the upper limit of normal, or characteristic imaging.",
    approach: [
        "Provide analgesia and antiemetics. Use moderately aggressive isotonic crystalloid when IV resuscitation is needed, preferably lactated Ringer’s. Reassess early and adjust to perfusion, volume status and cardiac or renal comorbidity.",
        "Check for gallstones with ultrasound and investigate other causes when the history and labs suggest them.",
        "Offer early oral feeding as tolerated in mild disease. Avoid routine prophylactic antibiotics, including for sterile necrosis.",
        "If biliary pancreatitis is complicated by cholangitis, discuss early ERCP with gastroenterology. Coordinate same-admission cholecystectomy for mild biliary pancreatitis when appropriate."
    ],
    dontMiss: [
        ["Organ failure", "critical", "Hypoxemia, shock or evolving kidney injury requires monitored care and reassessment."],
        ["Associated cholangitis", "critical", "Fever or sepsis with cholestasis calls for urgent biliary drainage assessment.", ["acute-cholangitis"]]
    ],
    history: ["Ask about prior episodes, alcohol, gallstones, new medications, recent ERCP and hypertriglyceridemia."],
    exam: ["Assess hydration, perfusion, respiratory status and abdominal findings. Consider alternative emergencies if there is peritonism or an atypical course."],
    workup: [
        ["Labs", ["Lipase, renal function, electrolytes, glucose and liver chemistry. Check triglycerides when a cause is unclear and hypertriglyceridemia is plausible."]],
        ["Imaging", ["Reserve early CT for diagnostic uncertainty or a suspected alternative emergency. Consider CT or MRI for failure to improve after 48–72 hours."]]
    ],
    redFlags: ["Shock, hypoxemia, oliguria, worsening renal function or suspected cholangitis."],
    disposition: [["Monitored admission or critical care", "Escalate evolving organ failure. Guide subsequent care by clinical severity, oral intake, cause and local criteria."]],
    pitfalls: [
        "Using lipase magnitude to grade severity.",
        "Continuing fluids at a fixed rate despite overload or poor response."
    ],
    pearls: ["Recheck perfusion, oxygen needs and volume status after initial treatment."],
    refs: ["ACG acute pancreatitis guideline (2024)", "IAP and partner societies: acute pancreatitis guideline (2025)"]
},
{
    id: 'acute-diverticulitis', type: 'diagnosis', name: "Acute Colonic Diverticulitis", icon: '🩺',
    tag: "Identify abscess, perforation or obstruction and select outpatient treatment carefully.",
    overview: "Diverticulitis often causes persistent lower abdominal pain, fever or bowel habit changes. Complicated disease includes abscess, free perforation, fistula or obstruction.",
    approach: [
        "Assess for sepsis, peritonitis and obstruction. Provide analgesia and fluids as needed.",
        "Use abdominal CT to confirm a first suspected episode and assess severe or atypical presentations for complications. Select imaging for repeat episodes according to the clinical course. Use a pregnancy-adapted imaging pathway when relevant.",
        "Antibiotics can be omitted in selected stable, immunocompetent, low-risk adults with uncomplicated disease and reliable follow-up. Treat complicated disease and consider antibiotics for immunocompromise, frailty or other high-risk features.",
        "Consult surgery for generalized peritonitis, obstruction, uncontrolled sepsis or other complications. Discuss drainable abscesses with surgery and interventional radiology."
    ],
    dontMiss: [
        ["Abscess or free perforation", "critical", "Persistent fever, sepsis, peritoneal signs or concerning CT warrants urgent source-control assessment."],
        ["Alternative diagnosis", "emergent", "Consider urinary and gynecologic causes, ischemia and malignancy when the presentation or recovery is atypical.", ["pelvic-pain", "acute-mesenteric-ischemia"]]
    ],
    history: ["Ask about prior imaging-confirmed episodes, immune suppression, bowel habits and ability to manage at home."],
    exam: ["Assess localized tenderness, guarding, distention and perfusion. Reassess after treatment."],
    workup: [
        ["Imaging", ["CT can distinguish localized inflammation from abscess, free air and obstruction. Discuss modality with radiology when contrast or pregnancy changes the plan."]],
        ["Labs", ["Use CBC, inflammatory markers and renal function to support severity assessment as indicated."]]
    ],
    redFlags: ["Generalized tenderness or guarding, organ dysfunction, obstruction, inability to tolerate fluids or worsening in an immunocompromised patient."],
    disposition: [
        ["Admission or surgical assessment", "Complications, systemic illness or inability to manage safely at home need inpatient evaluation."],
        ["Selected outpatient care", "Use symptom control, oral tolerance and reliable follow-up to guide discharge. Give return precautions for worsening pain, fever or inability to drink, and arrange follow-up to discuss whether interval colon evaluation is indicated."]
    ],
    pitfalls: ["Applying the no-antibiotic approach to a septic, immunocompromised or otherwise high-risk patient."],
    pearls: ["Document whether imaging shows uncomplicated inflammation or a source-control problem."],
    refs: ["ACG colonic diverticulitis guideline (2026)", "IDSA diagnostic imaging for acute diverticulitis (2024)", "NICE NG147: diverticular disease"]
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
    overview: 'This guide uses adult ECG thresholds; pediatric ECGs require age-specific interpretation. First check whether the patient is perfusing and whether the tracing is technically valid. Then branch the rhythm (rate, regularity, QRS width) and hunt the patterns that change management immediately — occlusion MI (OMI) and its equivalents, hyperkalemia, unstable bradycardia or VT, pre-excited AF, and QTc ≥500 ms. Millimeter STEMI criteria still drive many cath-lab activations, but they miss a substantial fraction of acute coronary occlusions. New or presumed-new LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP ACS). Always compare with an old tracing and repeat the ECG when symptoms evolve.',
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
        'STEMI criteria or high-risk ischemic patterns (de Winter, posterior injury, modified Sgarbossa, hyperacute T; Wellens often reflects reperfusion)',
        'Wide-complex tachycardia — treat as VT until proven otherwise',
        'Pre-excited AF (irregular, wide, very fast) — avoid AV-nodal blockers and IV amiodarone',
        'Sine-wave, widening QRS, or disappearing P waves — hyperkalemia until proven otherwise',
        'Complete heart block, Mobitz II, or long pauses',
        'QTc ≥500 ms, pause-dependent polymorphic VT, or TdP',
        'Type 1 Brugada pattern, especially with syncope or fever',
        'Low voltage plus electrical alternans plus tachycardia — tamponade until echo says otherwise'
    ],
    steps: [
        {
            num: 1,
            sources: [{"label": "AHA ST/T measurement", "url": "https://doi.org/10.1161/CIRCULATIONAHA.108.191096"}, {"label": "Fourth UDMI: TP reference", "url": "https://doi.org/10.1161/CIR.0000000000000617"}],
            id: 'rate-calibration',
            name: 'Calibration, Leads & Rate',
            icon: '⏱️',
            summary: 'Confirm the tracing is real, then count the ventricular rate yourself.',
            details: [
                '<strong>Standard calibration:</strong> Paper speed 25 mm/s (1 small box = 40 ms; 1 large box = 200 ms). Voltage 10 mm/mV (1 small box = 1 mm = 0.1 mV; 2 large boxes = 1.0 mV). Check the calibration pulse at the left edge.',
                '<strong>Isoelectric baseline & J-point measurement:</strong> Use a flat TP segment (end of T to next P onset) in the same lead as the zero reference; if tachycardia obscures TP, use an undisplaced PR segment (end of P to QRS onset). Measure vertical ST displacement at the J point (QRS end / ST onset) — never from P, R, or T peaks.',
                '<strong>Lead placement check:</strong> Place V1/V2 in the 4th intercostal space (ICS), V4 at the 5th ICS midclavicular line, V3 midway between V2 and V4, and V5/V6 horizontally aligned with V4. High V1/V2 placement creates pseudo-rSr′, negative P waves, and false septal changes; inverted P/QRS in lead I with upright aVR signals limb-lead reversal or dextrocardia.',
                '<strong>Regular rate (300 rule):</strong> At 25 mm/s, divide 300 by large boxes between R waves (300, 150, 100, 75, 60, 50, 43, 37) or 1500 by small boxes. At 50 mm/s, each small box is 20 ms (use 600 ÷ large boxes).',
                '<strong>Irregular rate (6-second / 10-second rule):</strong> Multiply the QRS count across 30 large boxes (6 s) by 10, or across a standard 10-second strip by 6.',
                '<strong>Clinical rate interpretation:</strong> Perfusion determines urgency. Cardioversion treats unstable primary tachyarrhythmias (shock, ischemic chest pain, pulmonary edema, altered mentation), whereas sinus tachycardia requires treating the underlying driver (sepsis, hypovolemia, PE, pain, toxin). Always count the rate manually when artifact, tall T waves, or pacing spikes confuse the monitor.'
            ],
            pearl: 'Never trust a machine rate or axis on a tachycardic, paced, or artifact-laden tracing. Confirm speed and gain before you call low voltage or LVH.',
            pitfall: 'Missing half-standard (5 mm/mV) or double-standard (20 mm/mV) calibration can mimic or hide low voltage and LVH. Document V1/V2 placement: accidental misplacement can alter morphology, while intentionally labeled high leads can reveal Brugada Type 1.'
        },
        {
            num: 2,
            sources: [{"label": "AHA conduction and axis", "url": "https://doi.org/10.1161/CIRCULATIONAHA.108.191095"}],
            id: 'rhythm-axis',
            name: 'Rhythm Branch & Axis',
            icon: '🧭',
            summary: 'Rate · regularity · QRS width first. Then sinus vs not, then the frontal axis.',
            details: [
                '<strong>The ED rhythm branch (do this before naming the rhythm):</strong> (1) Fast or slow? (2) Regular or irregular? (3) Narrow (&lt;120 ms) or wide (≥120 ms)? That triad is the ACLS fork.',
                '<strong>Sinus activity and conduction:</strong> In 1:1 sinus rhythm, an upright P in I/II (inverted in aVR) precedes every QRS. Assess atrial origin and AV conduction separately — sinus P waves can coexist with AV block.',
                '<strong>How to read atrial activity:</strong> Inspect the lead II rhythm strip and V1. Irregularly irregular R–R intervals without distinct P waves indicate AF; a regular narrow tachycardia near 150 bpm should prompt a close look for 2:1 atrial flutter.',
                '<strong>Frontal axis (leads I and aVF, confirmed with lead II):</strong> Use net QRS amplitude (positive height minus negative depth):',
                '• <strong>Normal (−30° to +90°):</strong> Net positive in I and aVF. If aVF is negative, check lead II — positive II means physiologic left shift (0° to −30°), not pathologic LAD.',
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
            sources: [{"label": "AHA QT measurement", "url": "https://doi.org/10.1161/CIRCULATIONAHA.108.191096"}, {"label": "AHA conduction", "url": "https://doi.org/10.1161/CIRCULATIONAHA.108.191095"}],
            id: 'intervals',
            name: 'Intervals (PR, QRS, QTc)',
            icon: '📏',
            summary: 'PR (AV conduction), QRS (ventricular conduction), QTc (repolarization risk) — in that order.',
            details: [
                '<strong>Interval endpoints:</strong> PR runs from P onset to QRS onset; QRS runs from first deflection to the J point; QT runs from QRS onset to the end of the T wave (use the maximum-slope tangent in lead II or V5/V6 and exclude separate U waves).',
                '<strong>PR (normal 120–200 ms / 3–5 small boxes):</strong>',
                '• Short (&lt;120 ms): check for a slurred upstroke (delta wave) of WPW pre-excitation.',
                '• Long (&gt;200 ms): first-degree AV block — review nodal blockers, potassium, inferior ischemia, or Lyme carditis.',
                '• Dropped beats: Mobitz I (progressive PR lengthening before a drop; usually AV-nodal) vs Mobitz II (fixed PR with sudden dropped QRS; infranodal — prepare pacing). Treat 2:1 block with wide QRS or instability as high-grade. Complete (3rd-degree) heart block shows independent P and QRS rates with a slower regular escape.',
                '• PR depression with aVR PR elevation supports pericarditis, whereas territorial STE with reciprocal STD requires urgent ACS evaluation.',
                '<strong>QRS (normal &lt;110 ms; wide ≥120 ms):</strong>',
                '• Wide (≥120 ms): LBBB/RBBB, VT, ventricular pacing, hyperkalemia, sodium-channel blockade (TCA, flecainide), or WPW.',
                '• <strong>RBBB:</strong> rsR′ in V1–V2 with wide slurred S in I, aVL, V5–V6.',
                '• <strong>LBBB:</strong> broad QS or rS in V1 with broad notched R in I, aVL, V5–V6 and absent septal Q waves. New LBBB alone is not a STEMI equivalent (2025 ACC/AHA).',
                '<strong>QTc (prolonged ≥450 ms men / ≥460 ms women; high TdP risk ≥500 ms):</strong> Convert QT and RR to seconds (e.g., QT 0.38 s, RR 0.80 s → Bazett QTc ≈ 425 ms). Bazett (QT/√RR) overcorrects in tachycardia — use Fridericia (QT/∛RR) at fast rates and account for wide QRS. Short QTc (&lt;360 ms) suggests hypercalcemia, digoxin effect, or short-QT syndrome.',
                '• <strong>Torsades de pointes (TdP):</strong> Defibrillate sustained/unstable TdP immediately (unsynchronized). Give IV magnesium sulfate 2 g regardless of baseline Mg²⁺, stop QT-prolonging drugs, replete K⁺ to high-normal, and use isoproterenol or overdrive pacing for pause-dependent recurrences.'
            ],
            pearl: 'The half-RR rule is only a rough screen and can miss prolonged QT at slow rates or overcall it at fast rates. Measure QT and calculate QTc. QTc ≥500 ms is an ED action item, not a curiosity.',
            pitfall: 'Measuring QT in a U-wave lead (pseudo-long QT), ignoring a wide QRS, or using Bazett alone at HR 130. Giving AV-nodal blockers to an irregular wide-complex tachycardia that is pre-excited AF.'
        },
        {
            num: 4,
            sources: [{"label": "AHA chamber patterns", "url": "https://doi.org/10.1161/CIRCULATIONAHA.108.191097"}],
            id: 'hypertrophy',
            name: 'Voltage, Chambers & Low Voltage',
            icon: '🫀',
            summary: 'LVH/RVH can produce secondary ST-T changes. Low voltage and alternans change the next test.',
            details: [
                '<strong>LVH voltage (confirm 10 mm/mV gain first):</strong> Sokolow–Lyon = S in V1 + R in V5 or V6 ≥35 mm (or R in aVL ≥11 mm); Cornell = R in aVL + S in V3 &gt;28 mm (men) or &gt;20 mm (women). Confirm structural hypertrophy with echocardiography.',
                '• <strong>LV strain:</strong> Asymmetric downsloping STD with T-wave inversion in lateral leads (I, aVL, V5–V6). Compare with a prior ECG — dynamic ST-T changes or ischemic symptoms still require ACS evaluation.',
                '<strong>RVH:</strong> Dominant R in V1 (R/S &gt; 1, R &gt; 7 mm) + right-axis deviation + V1–V3 TWI/STD. Tall R in V1 differential: RVH, RBBB, posterior OMI, WPW, high lead placement, dextrocardia.',
                '<strong>Atrial abnormality:</strong> Right atrial abnormality = peaked P ≥2.5 mm in II; left atrial abnormality = notched P ≥120 ms in II or V1 terminal negative P ≥1 mm deep × ≥40 ms wide.',
                '<strong>Low voltage & electrical alternans:</strong> Peak-to-peak QRS &lt;5 mm in <strong>all</strong> limb leads or &lt;10 mm in <strong>all</strong> precordial leads (at 5 mm/mV half-gain, double the measured boxes). Low voltage + sinus tachycardia + beat-to-beat QRS electrical alternans mandates immediate bedside echo for pericardial tamponade.',
                '<strong>LV aneurysm vs acute anterior STEMI:</strong> Persistent STE with deep pathologic Q waves unchanged from a prior ECG favors chronic aneurysm, whereas new symptoms, dynamic ST/T shifts, or reciprocal changes require urgent ACS evaluation.'
            ],
            pearl: 'Young, thin, or athletic chests often exceed Sokolow–Lyon without pathologic LVH. Pair voltage with LA enlargement and strain, and always compare with a prior ECG.',
            pitfall: 'Calling anteroseptal MI from RVH (tall R V1), or calling lateral ischemia from chronic LV strain without looking at an old tracing. Missing tamponade because “the ECG is low voltage from obesity.”'
        },
        {
            num: 5,
            sources: [{"label": "Fifth UDMI (2026), Table 5", "url": "https://doi.org/10.1093/eurheartj/ehag101"}, {"label": "Fourth UDMI: supplemental leads", "url": "https://doi.org/10.1161/CIR.0000000000000617"}],
            id: 'ischemia-map',
            name: 'Ischemia Map & Fifth UDMI Lead Criteria',
            icon: '🗺️',
            summary: 'Use the Fifth Universal Definition lead-by-lead: ≥1 mm in every standard lead except V2–V3; add posterior or right-sided leads when the 12-lead leaves a clinical gap.',
            details: [
                '<strong>Fifth Universal Definition (2026) — new J-point STE in ≥2 anatomically contiguous leads</strong> (measured from the same-lead TP reference):',
                '• <strong>All standard leads except V2–V3</strong> (I, aVL, II, III, aVF, V1, V4–V6): <strong>≥1.0 mm</strong>.',
                '• <strong>Leads V2–V3:</strong> <strong>≥2.5 mm</strong> in men &lt;40 y, <strong>≥2.0 mm</strong> in men ≥40 y, or <strong>≥1.5 mm</strong> in women of any age.',
                '• <strong>Contiguous territories & reciprocal clues:</strong> Inferior (II, III, aVF; STE III &gt; II favors RCA, often with reciprocal aVL STD), Anterior/septal (V1–V4), and Lateral (I, aVL, V5–V6).',
                '<strong>Supplemental leads (record directly):</strong> In inferior STE, record right-sided V3R–V6R (especially V4R; STE ≥0.5 mm, or ≥1.0 mm in men &lt;30 y, supports RV infarction). In V1–V3 ST depression or suspected LCx occlusion, record posterior V7–V9 (STE ≥0.5 mm, or ≥1.0 mm in men &lt;40 y, supports posterior infarction).',
                '<strong>Ischemic findings beyond STE (Fifth UDMI):</strong> New horizontal/downsloping STD ≥0.5 mm in ≥2 contiguous leads; new/dynamic T-wave inversion ≥1 mm in ≥2 contiguous leads; broad symmetric hyperacute T waves; or pathologic Q waves (≥40 ms wide and/or ≥25% of R-wave height in ≥2 contiguous leads).',
                '<strong>Posterior & high-risk occlusion clues:</strong> STD maximal in V1–V3 (especially with tall R in V1–V2) suggests posterior OMI — negative posterior leads do not exclude occlusion. Also screen for de Winter, Wellens (Wellens often reflects reperfusion), Smith-modified Sgarbossa, and Aslanger patterns, and repeat serial ECGs when symptoms evolve.'
            ],
            pearl: 'The core rule is simple: 1 mm in all standard leads except V2–V3. The work is recognizing a contiguous territory, adding V3R–V6R or V7–V9 when indicated, and acting on dynamic occlusion patterns before a textbook threshold appears.',
            pitfall: 'Using one lead alone, treating V2–V3 as a 1 mm rule, or calling V1–V3 depression “anterior ischemia” without posterior leads. Do not give nitrate-dependent comfort false reassurance in an inferior MI before considering RV involvement.'
        },
        {
            num: 6,
            sources: [{"label": "2025 ACC/AHA ACS guideline", "url": "https://doi.org/10.1016/j.jacc.2024.11.009"}, {"label": "Modified Sgarbossa study", "url": "https://doi.org/10.1016/j.annemergmed.2012.07.119"}],
            id: 'omi-equivalents',
            name: 'OMI Equivalents & What Is Not STEMI',
            icon: '🚨',
            summary: 'Occlusion MI that misses millimeter STEMI criteria — and the patterns that are no longer automatic lab activations.',
            details: [
                '<strong>Guideline & OMI framework:</strong> STEMI/NSTEMI remains the formal guideline classification, while OMI identifies acute coronary occlusions that miss millimeter STE cutoffs. In LBBB or paced rhythm, concordant ST shifts follow the dominant QRS direction and discordant shifts go opposite. New or presumed-new <strong>LBBB alone is not a STEMI equivalent</strong> (2025 ACC/AHA/ACEP ACS) — apply Smith-modified Sgarbossa and clinical context.',
                '<strong>1. Wellens syndrome (LAD reperfusion / critical stenosis):</strong> Pain-free after angina resolves, with preserved R waves and no pathologic Q waves. Type A (~25%): biphasic T waves in V2–V3; Type B (~75%): deep symmetric inverted T waves in V2–V3 (±V1, V4–V5). <em>Exercise stress testing is contraindicated.</em> Recurrent chest pain or T-wave pseudonormalization signals re-occlusion.',
                '<strong>2. de Winter T waves (proximal LAD occlusion pattern):</strong> 1–3 mm upsloping J-point STD in V1–V6 continuing into tall, broad, symmetric T waves (±aVR STE). With ongoing ischemic symptoms, activate immediate cardiology/reperfusion assessment.',
                '<strong>3. Smith-modified Sgarbossa (LBBB or ventricular paced rhythm):</strong> Positive if <em>any</em> of: (1) concordant STE ≥1 mm in any lead with a positive QRS; (2) concordant STD ≥1 mm in V1–V3; or (3) discordant STE ≥1 mm with ST/S ratio ≤ −0.25 (STE ≥25% of S-wave depth, e.g., 2 mm STE ÷ 8 mm S depth = 0.25).',
                '<strong>4. Isolated posterior OMI:</strong> Horizontal STD maximal in V1–V3 with tall R waves (R/S &gt; 1 in V2) and upright T waves. Record V7–V9 (STE ≥0.5 mm supports posterior MI; ≥1 mm is more specific in men &lt;40 y).',
                '<strong>5. aVR STE + diffuse multilead STD:</strong> STE ≥1 mm in aVR with STD in ≥6 leads indicates severe subendocardial ischemia (left main, proximal LAD, or 3-vessel disease) <em>or</em> global supply-demand mismatch (shock, severe anemia, hypoxia, tachyarrhythmia). <strong>Not an automatic STEMI activation in stable patients</strong> (2025 ACS: resuscitate drivers and arrange urgent invasive angiography; activate immediately if hemodynamically unstable or accompanying occlusion signs exist).',
                '<strong>6. Hyperacute T waves & Aslanger pattern:</strong> Broad, asymmetric, bulky T waves disproportionate to the QRS in a regional distribution can precede STE — repeat the ECG in 10–15 min and check K⁺. The Aslanger pattern (isolated STE in III + STD in V4–V6 with positive T terminal + ST in V1 &gt; V2) suggests inferior OMI with multivessel disease.'
            ],
            pearl: 'Coronary occlusion can occur below STEMI thresholds. Wellens needs urgent ACS assessment even when pain-free; de Winter with suspected ongoing ischemia warrants immediate cardiology/reperfusion assessment.',
            pitfall: 'Activating the lab for isolated new LBBB, or dismissing Wellens/de Winter as “nonspecific ST-T changes.” Treating stable aVR-STE + diffuse STD as automatic code STEMI without asking whether this is demand ischemia.'
        },
        {
            num: 7,
            sources: [{"label": "2025 AHA special circumstances", "url": "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/"}, {"label": "ESC: pericarditis assessment", "url": "https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-15/Diagnosis-of-acute-pericarditis/"}],
            id: 'toxic-metabolic-mimics',
            name: 'Deadly Mimics, Toxic & Metabolic',
            icon: '🧪',
            summary: 'HyperK, channelopathy, PE strain, pericarditis vs BER, sodium-channel blockade, hypothermia, and tamponade.',
            details: [
                '<strong>Integrate the full tracing and bedside context:</strong> Compare P, PR, QRS, QT, and ST-T across leads alongside labs, core temperature, medication history, and POCUS — never delay stabilizing an unstable patient.',
                '<strong>Hyperkalemia:</strong> Diffuse peaked T waves, PR prolongation, flattening/loss of P waves, QRS widening, or sine-wave morphology can occur in any order (and a normal ECG does not exclude hyperkalemia). Give IV calcium immediately for QRS widening or dangerous dysrhythmia, followed by K⁺-shifting and removal therapies with glucose monitoring.',
                '<strong>Hypokalemia & calcium disorders:</strong> Hypokalemia causes ST depression, flattened T waves, and prominent U waves (best in V2–V3) with prolonged QU and TdP risk — replete K⁺ and Mg²⁺. Hypercalcemia shortens the ST/QT; hypocalcemia prolongs the ST/QT.',
                '<strong>Hypothermia:</strong> Osborn (J) waves (positive J-point deflection, largest in V2–V5), bradycardia, AF, prolonged intervals, and shivering artifact. Handle gently and rewarm.',
                '<strong>Brugada Type 1:</strong> Coved STE ≥2 mm followed by a negative T wave in V1 and/or V2 (at standard 4th ICS or intentionally labeled 2nd/3rd ICS leads), often unmasked by fever or sodium-channel blockers.',
                '<strong>PE / acute RV strain:</strong> Sinus tachycardia is most common; TWI in V1–V4 (±inferior leads), new RBBB, or RAD are more useful than the classic but insensitive S1Q3T3 pattern.',
                '<strong>Pericarditis vs early repolarization (BER) vs OMI:</strong> Pericarditis shows diffuse concave STE and PR depression (with aVR PR elevation/STD) and lacks reciprocal STD outside aVR/V1. BER shows stable J-point notching (fish-hook in V4) and a V6 ST/T ratio &lt;0.25 (&gt;0.25 favors pericarditis), though neither ratio nor concavity excludes ACS. <strong>Territorial STE with reciprocal STD requires urgent ACS assessment.</strong>',
                '<strong>TCA / sodium-channel blockade:</strong> Sinus tachycardia, QRS &gt;100 ms (seizure risk; &gt;160 ms ventricular arrhythmia risk in TCA overdose), and terminal R ≥3 mm in aVR. Sodium bicarbonate 1–2 mEq/kg IV under poison-center guidance; reassess QRS, perfusion, Na⁺, K⁺, and pH. Avoid pH &gt;7.55 or Na⁺ &gt;155 mmol/L; do not keep dosing solely to force QRS &lt;100 ms, and avoid class Ia/Ic antiarrhythmics.',
                '<strong>Tamponade triad & digoxin:</strong> Low voltage + sinus tachycardia + electrical alternans warrants immediate bedside echo for tamponade. Scooped (“Salvador Dalí”) STD reflects digoxin effect; digoxin toxicity presents with bidirectional VT, atrial tachycardia with block, or hyperkalemia and requires digoxin immune Fab when life-threatening.'
            ],
            pearl: 'A wide, slow or sine-wave rhythm in a compatible context warrants urgent hyperkalemia treatment while potassium is measured. Consider toxins and other causes in parallel; use formulation-specific calcium and glucose monitoring.',
            pitfall: 'Giving beta-blockers, diltiazem, or amiodarone to a wide-complex bradycardia that is actually hyperK. Calling territorial STE “pericarditis” because it is concave.'
        }
    ],
    patterns: [
        {
            id: 'stemi-criteria',
            name: 'Classic STEMI Millimeter Criteria',
            tag: 'STEMI activation rule',
            category: 'omi',
            severity: 'critical',
            leads: 'II, III, aVF (STE) + aVL (mirror STD) — 2 contiguous at J point',
            criteria: 'Inferior example: convex STE ≥1 mm in II + III + aVF with mirror STD in aVL. General rule: STE in V2–V3 ≥ 2.5 mm (men &lt;40), ≥ 2.0 mm (men ≥40), ≥ 1.5 mm (women); ≥ 1.0 mm in all other leads ×2 contiguous. Posterior V7–V9 ≥ 0.5 mm. MIRROR — inferior up, aVL down.',
            significance: 'Still the operational trigger for most cath-lab activations. An ECG below these thresholds can still represent acute coronary occlusion.',
            action: 'If millimeter STEMI + compatible symptoms/signs: immediate reperfusion pathway per local STEMI protocol. Add V4R for inferior STE and V7–V9 for isolated anterior STD.',
            caution: 'STE below thresholds does not exclude occlusion. Distinguish ongoing injury patterns from reperfusion patterns such as Wellens; described Aslanger patterns need clinical correlation.'
        },
        {
            id: 'hyperacute-t',
            name: 'Hyperacute T Waves',
            tag: 'Earliest OMI sign',
            category: 'omi',
            severity: 'critical',
            leads: 'One V3 viewpoint, three shapes: normal vs hyperacute vs hyperK',
            criteria: 'Side-by-side in a single V3 viewpoint. Normal: smooth asymmetric T, R > T. Hyperacute: broad-based bulky ("inflated") T dwarfing QRS with straightened takeoff — always confirm territorial across 2+ adjacent leads in the patient, never all leads. HyperK tenting: narrow pointed peak with flat P, usually diffuse. May precede any millimeter STE. Compare with an old ECG, repeat in 10–15 minutes, and check potassium too — OMI and hyperK can coexist.',
            significance: 'Minutes-old coronary occlusion. Waiting for millimeter STE loses myocardium.',
            action: 'Treat as OMI: serial ECGs, old tracing, posterior/right-sided leads as indicated, immediate cardiology escalation. Do not wait for a “diagnostic” STEMI millimeter if the T waves are blowing up in a territorial distribution.',
            caution: 'HyperK tented T waves are narrow-based and diffuse; hyperacute T waves are broad-based and territorial. HyperK and OMI can coexist — treat both possibilities.'
        },
        {
            id: 'wellens',
            name: 'Wellens Syndrome (Type A & B)',
            tag: 'High-risk ACS pattern',
            category: 'omi',
            severity: 'critical',
            leads: 'V2–V3 (often V1–V5)',
            criteria: 'Pain-free after resolved angina. Type A (~25%): biphasic T in V2–V3. Type B (~75%): deep symmetric inverted T in V2–V3. Preserved R-wave progression, isoelectric or minimally elevated ST, no pathologic Q waves.',
            significance: 'Strongly associated with significant LAD disease and a high risk of anterior infarction. ECG alone does not establish exact lesion location or current artery patency.',
            action: 'Urgent cardiology assessment and an invasive ACS pathway as indicated. <strong>Do not send for an exercise stress test.</strong>',
            caution: 'Recurrent pain or T-wave pseudonormalization may indicate recurrent ischemia and requires immediate reassessment. Repeat the ECG with every symptom change.'
        },
        {
            id: 'dewinter',
            name: 'de Winter T Waves',
            tag: 'OMI equivalent',
            category: 'omi',
            severity: 'critical',
            leads: 'V1–V6; aVR often',
            criteria: '1–3 mm upsloping J-point STD in the precordial leads continuing into tall, prominent, symmetric T waves. STE in aVR is common but not required.',
            significance: 'A high-risk occlusion pattern, commonly associated with LAD disease, that can occur without classic STE. The exact culprit anatomy cannot be inferred from the ECG alone.',
            action: 'With compatible ongoing ischemia, seek immediate cardiology/reperfusion assessment under the local ACS pathway. Treat as a high-risk coronary occlusion pattern.',
            caution: 'The pattern can evolve into frank anterior STE or appear only on the first tracing. Do not wait for millimeter STE.'
        },
        {
            id: 'sgarbossa',
            name: 'Smith-Modified Sgarbossa (LBBB & Paced)',
            tag: 'OMI in LBBB / paced',
            category: 'omi',
            severity: 'critical',
            leads: 'Any lead with a positive QRS; V1–V3',
            criteria: 'Positive if ANY of: (1) concordant STE ≥ 1 mm in a lead with a positive QRS; (2) concordant STD ≥ 1 mm in V1–V3; (3) discordant STE ≥1 mm, ST/S ratio ≤ −0.25 (STE ≥ 25% of S-wave depth).',
            significance: 'Finds occlusion MI when the baseline is LBBB or a ventricular paced rhythm. New LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP).',
            action: 'If any Smith-modified criterion is met in a compatible patient: immediate reperfusion pathway. Unmodified 5 mm discordant STE is obsolete as a standalone rule.',
            caution: 'A paced or LBBB tracing that fails Sgarbossa can still be OMI clinically — use serial ECGs, old tracings, and the patient, not the millimeter rule alone.'
        },
        {
            id: 'posterior-omi',
            name: 'Isolated Posterior OMI',
            tag: 'OMI equivalent',
            category: 'omi',
            severity: 'critical',
            leads: 'V1–V3 (mirror); V7–V9 (true posterior)',
            criteria: 'Horizontal STD in V1–V3 with upright T waves and prominent R waves (R/S &gt; 1 in V2). Posterior leads: STE ≥ 0.5 mm in V7–V9 supports posterior infarction; ≥1 mm is more specific in men under 40.',
            significance: 'Transmural posterior wall occlusion (LCx or distal RCA). Often labeled “anterior ischemia” and not activated.',
            action: 'Place V7–V9 immediately. Use the urgent reperfusion pathway for a convincing posterior occlusion presentation; assess elevation in contiguous posterior leads with age-specific thresholds rather than one isolated measurement.',
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
            criteria: 'Possible findings: peaked T waves, PR prolongation, diminished/absent P waves, QRS widening and a sine-wave appearance. They need not occur in sequence; a normal ECG does not exclude dangerous hyperkalemia.',
            significance: 'Membrane instability. Once the QRS widens, VF/PEA/asystole can be minutes away.',
            action: 'With life-threatening ECG changes attributed to hyperkalemia, obtain emergency senior help and give IV calcium under the local formulation-specific protocol; reassess the ECG. Begin potassium shifting/removal treatment with glucose monitoring and urgent renal input. In cardiac arrest, follow the ALS special-circumstances protocol; evidence for adjunct drugs is limited.',
            caution: 'Do not wait for the lab if the tracing is already wide or sine-wave in a dialysis or oliguric patient. Do not mix calcium and bicarbonate in one line. Do not give AV-nodal blockers or amiodarone to a wide, slow, bizarre rhythm that is hyperK.'
        },
        {
            id: 'hypokalemia',
            name: 'Hypokalemia, U Waves & Long QU',
            tag: 'Metabolic emergency',
            category: 'toxic',
            severity: 'emergent',
            leads: 'V2–V3 best; diffuse ST-T',
            criteria: 'Flattened T waves, ST depression, prominent U waves (best V2–V3), apparent QT/QU prolongation, increased PVCs. Severe hypokalemia can precipitate VT/TdP, especially with low Mg²⁺ or QT drugs.',
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
            significance: 'Hypothermia can cause these findings and raises arrhythmia risk. J waves do not exclude coexisting coronary ischemia; assess core temperature and the clinical presentation.',
            action: 'Confirm core temperature. Handle gently. Rewarm per local hypothermia protocol. Start CPR/defibrillation for arrest and follow the local temperature-specific ALS protocol for subsequent shocks and drugs; arrange ECLS rewarming when indicated.',
            caution: 'J waves alone do not diagnose coronary occlusion. Ongoing ischemic symptoms, territorial changes or instability need urgent parallel assessment; do not defer suspected ACS solely while waiting for rewarming.'
        },
        {
            id: 'brugada',
            name: 'Brugada Type 1 ECG Pattern',
            tag: 'Channelopathy',
            category: 'mimics',
            severity: 'critical',
            leads: 'V1–V2 at 4th ICS; labeled recordings at 2nd/3rd ICS when indicated',
            criteria: 'Coved STE ≥2 mm followed by a negative T wave in at least one of V1–V2 (Type 1), recorded at the 4th or intentionally at the 2nd/3rd intercostal space. A saddleback pattern alone is not diagnostic; assess clinical context and exclude phenocopies.',
            significance: 'Risk of polymorphic VT/VF, often during sleep or fever. Sodium-channel drugs, cocaine, and fever unmask it.',
            action: 'Treat fever aggressively. Avoid Brugada-unmasking drugs (flecainide, procainamide, bupivacaine, many TCAs — check brugadadrugs.org). Telemetry, EP/cardiology, ICD discussion for Type 1 with syncope or arrest.',
            caution: 'Document lead placement. Standard V1/V2 use the 4th ICS; deliberate high right-precordial recordings at the 2nd/3rd ICS can reveal a true Type 1 pattern. Review ischemia, electrolytes, drug effects and the clinical history with cardiology/EP.'
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
            criteria: 'Pericarditis: diffuse concave STE, PR depression, aVR PR elevation/STD, Spodick sign, no reciprocal STD except aVR/V1. BER: fish-hook J-point notching (often V4), ST/T amplitude ratio in V6 &lt; 0.25 may support BER, particularly when stable versus an old ECG; neither feature alone excludes ACS.',
            significance: 'The dangerous error is labeling OMI as pericarditis because the STE is concave.',
            action: 'Territorial STE with reciprocal STD outside aVR/V1 strongly raises concern for coronary occlusion: arrange urgent ACS assessment. Pericarditis: echo (effusion/tamponade), NSAID + colchicine per local practice, review anticoagulation indications and bleeding/tamponade risk with cardiology; an effusion alone is not an absolute contraindication.',
            caution: 'Reciprocal depression outside aVR/V1 is atypical for uncomplicated pericarditis. Read it with territorial ST elevation and symptoms; myocardial inflammation can also mimic ACS. When occlusion remains a concern, seek urgent cardiology assessment.'
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
            action: 'For significant sodium-channel-blocker cardiotoxicity, give sodium bicarbonate 1–2 mEq/kg IV under the poison-center protocol and reassess QRS, perfusion, sodium, potassium and pH. Repeat/infuse with expert guidance; avoid pH >7.55 or sodium >155 mmol/L. Do not keep dosing solely to force QRS below 100 ms. Avoid class Ia/Ic antiarrhythmics and physostigmine.',
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
            significance: 'Rapid accessory-pathway conduction during AF can provoke VF. AV-nodal-blocking drugs can accelerate the ventricular response and are harmful in pre-excited AF.',
            action: 'Unstable: immediate cardioversion. Stable pre-excited AF: IV procainamide or ibutilide with expert monitoring, or electrical cardioversion. <strong>Avoid adenosine, beta-blockers, diltiazem, verapamil, digoxin and IV amiodarone in pre-excited AF.</strong>',
            caution: 'Delta waves fake Q waves (pseudo-infarct) and fake bundle-branch block. A very fast irregular wide tachycardia must raise concern for pre-excited AF. Consider AF with aberrancy and polymorphic VT as well; do not assume ordinary AF before assessing for pre-excitation.'
        },
        {
            id: 'vt-vs-svt',
            name: 'VT vs SVT with Aberrancy',
            tag: 'Wide-complex tachycardia',
            category: 'rhythm',
            severity: 'critical',
            leads: 'All leads, especially V1–V6',
            criteria: 'Wide-complex tachycardia (QRS ≥120 ms, HR &gt;100). Favors VT: AV dissociation, fusion/capture beats, extreme axis, precordial concordance, Brugada/Vereckei algorithms, history of MI or structural disease.',
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
            caution: 'Isorhythmic dissociation is not complete heart block. Do not send Mobitz II home because the patient “looks well” in the chair. Treat suspected hyperkalemia promptly while preparing pacing and circulatory support; do not delay stabilization of an unstable patient.'
        },
        {
            id: 'electrical-alternans',
            name: 'Low Voltage & Electrical Alternans',
            tag: 'Tamponade warning',
            category: 'mimics',
            severity: 'critical',
            leads: 'All leads; QRS amplitude beat-to-beat',
            criteria: 'Low voltage: QRS &lt; 5 mm in every limb lead or &lt; 10 mm in every precordial lead. Electrical alternans: beat-to-beat QRS (sometimes P/T) amplitude change. Low voltage + alternans + sinus tachycardia raises concern for a large effusion and warrants prompt assessment for tamponade.',
            significance: 'A large effusion can cause alternans through cardiac motion; alternans also occurs with tachyarrhythmias and other mechanisms and does not prove tamponade. Low voltage alone has a wide differential (COPD, obesity, infiltrative disease, anasarca).',
            action: 'Bedside echo now. If tamponade physiology: IV fluid while arranging pericardiocentesis (or the local surgical pathway if type A dissection / post-op). Do not delay for a formal lab ECG repeat.',
            caution: 'Electrical alternans is an insensitive clue and is not exclusive to tamponade. A normal ECG does not exclude tamponade; integrate hemodynamics and echocardiographic findings.'
        }
    ],
    pearls: [
        'Patient first: an unstable wide-complex rhythm is shocked or cardioverted — the 12-lead can wait.',
        'STEMI millimeters still activate labs; OMI equivalents catch the occlusions those millimeters miss.',
        'New LBBB alone is not a STEMI equivalent (2025 ACC/AHA/ACEP). Use Smith-modified Sgarbossa.',
        'STD maximal in V1–V3 can represent posterior occlusion: record V7–V9; negative supplemental leads do not exclude it.',
        'Wide, slow or sine-wave ECG in a compatible context: treat suspected hyperkalemia promptly while assessing other causes.',
        'Irregular, wide and very fast raises concern for pre-excited AF: avoid AV-nodal blockers and IV amiodarone; seek expert rhythm treatment.',
        'Territorial STE plus reciprocal STD raises urgent concern for occlusion, even when STE is concave; interpret with the patient and serial ECGs.'
    ],
    pitfalls: [
        'Activating the lab for isolated new LBBB, or discharging Wellens because the patient is pain-free.',
        'Calling aVR STE + diffuse STD automatic code STEMI in a stable, shocked, or hypoxic patient.',
        'Treating VT as SVT with diltiazem or verapamil.',
        'Skipping V4R in inferior STE and then giving nitrates to an RV infarct.',
        'Trusting a machine QTc on tachycardia, artifact, or a wide QRS.',
        'Labeling territorial STE “pericarditis” because it is concave.',
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
        'AHA/ACCF/HRS ECG standardization Parts III–IV (Surawicz et al., Rautaharju et al., 2009) — QRS/BBB criteria, QT measurement method and limits',
        'Educational ECG libraries: LITFL, Dr. Smith’s ECG Blog — pattern recognition adjuncts, not protocols'
    ],
    related: ['chest-pain', 'palpitations', 'syncope', 'overdose', 'shock', 'heat-cold']
};

if (typeof window !== 'undefined') {
    window.ECG_DATA = ECG_DATA;
}

// Focused comparisons close the gap between the displayed example and card title.
const ECG_COMPARISONS = {
    'pericarditis-ber': [
        ['Pericarditis', 'Often diffuse ST/PR changes with pleuritic positional pain; assess inflammation and effusion.'],
        ['Early repolarization (BER)', 'Prior stable pattern and J notching support it; ST/T ratios and concavity are clues, not exclusion tests for ACS.'],
        ['OMI', 'New territorial or reciprocal changes and ischemic symptoms require urgent assessment even with concave STE.']
    ],
    wpw: [
        ['Sinus pre-excitation (shown)', 'Organized P waves, short PR, delta wave and widened QRS; arrange specialist risk assessment.'],
        ['Pre-excited AF', 'Irregular RR and changing wide QRS morphology, often very fast. Cardioversion if unstable; avoid AV-nodal blockers and IV amiodarone.']
    ],
    'vt-vs-svt': [
        ['VT (shown)', 'AV dissociation and capture/fusion support VT, but are often absent. Structural heart disease increases suspicion.'],
        ['SVT with aberrancy', 'A supraventricular rhythm with abnormal ventricular conduction. A BBB-like shape alone cannot prove SVT; manage uncertain wide tachycardia as VT.']
    ],
    'complete-heart-block': [
        ['Mobitz I', 'Progressively lengthening PR before a nonconducted P in the typical pattern.'],
        ['Mobitz II', 'Intermittent nonconducted P with stable conducted PR intervals; exclude mimics and seek urgent pacing assessment.'],
        ['2:1 AV block', 'Every other P conducts. PR alone cannot distinguish Mobitz I from II.'],
        ['Complete block (shown)', 'Independent atrial and slower ventricular rhythms with no consistent conduction; assess the full rhythm strip.']
    ]
};
ECG_DATA.patterns.forEach(function (pattern) {
    if (ECG_COMPARISONS[pattern.id]) pattern.comparison = ECG_COMPARISONS[pattern.id];
});

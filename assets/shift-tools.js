/* ══════════ EM-CPs shift tools (experiment/ux-v2) ══════════
   Additive layer on top of the free runtime. Self-contained, no dependencies,
   works offline. Provides:
     1. Bedside calculators and clinical scores (interactive, keyboard-usable).
     2. A symptom-first search index for the "I do not know the diagnosis" entry point.
     3. Pure helpers that other modules can reuse.

   Educational reference only — never replaces clinical judgment or local protocols.
   No patient data is stored, collected or transmitted: inputs live in memory only.
*/
(function () {
    'use strict';

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
    }

    function num(value) {
        const n = parseFloat(value);
        return isFinite(n) ? n : NaN;
    }

    /* ────────────────────────────────────────────────────────────
       Clinical calculators.
       Each score declares its inputs, a pure compute() and rendering
       metadata. compute() returns { points, band, riskLevel, advice }.
       Bands and advice are educational summaries, not management orders.
    ──────────────────────────────────────────────────────────── */
    const SCORES = [
        {
            id: 'heart',
            name: 'HEART Score',
            topic: 'Chest pain',
            href: '#chest-pain',
            summary: '5-component risk stratification for undifferentiated chest pain (History, ECG, Age, Risk factors, Troponin).',
            caveat: 'Adjunct only. Never substitutes for an assay-specific hs-cTn 0/1h or 0/2h pathway. Bypass scoring for ongoing ischemia, instability, or OMI pattern.',
            inputs: [
                { key: 'history', label: 'History', type: 'select', options: [
                    { label: 'Slightly suspicious', value: 0 },
                    { label: 'Moderately suspicious', value: 1 },
                    { label: 'Highly suspicious', value: 2 }
                ] },
                { key: 'ecg', label: 'ECG', type: 'select', options: [
                    { label: 'Normal', value: 0 },
                    { label: 'Non-specific repolarisation changes', value: 1 },
                    { label: 'Significant ST deviation', value: 2 }
                ] },
                { key: 'age', label: 'Age', type: 'select', options: [
                    { label: '< 45 years', value: 0 },
                    { label: '45–64 years', value: 1 },
                    { label: '≥ 65 years', value: 2 }
                ] },
                { key: 'risk', label: 'Risk factors', type: 'select', options: [
                    { label: 'None known', value: 0 },
                    { label: '1–2 risk factors', value: 1 },
                    { label: '≥ 3 risk factors or known atherosclerotic disease', value: 2 }
                ] },
                { key: 'trop', label: 'Troponin', type: 'select', options: [
                    { label: '≤ 1× upper reference limit', value: 0 },
                    { label: '1–3× upper reference limit', value: 1 },
                    { label: '> 3× upper reference limit', value: 2 }
                ] }
            ],
            compute: function (v) {
                const points = v.history + v.ecg + v.age + v.risk + v.trop;
                if (points <= 3) return { points: points, band: '0–3 low risk', riskLevel: 'common', advice: 'A non-ischemic ECG plus serial negative hs-cTn on a validated 0/1h or 0/2h pathway supports early discharge with follow-up. Confirm the pathway and local CDP before disposition.' };
                if (points <= 6) return { points: points, band: '4–6 intermediate risk', riskLevel: 'emergent', advice: 'Admit for observation or telemetry with serial troponin kinetics, or continue a score-based rule-out protocol. Reassess for evolving symptoms and repeat the ECG.' };
                return { points: points, band: '7–10 high risk', riskLevel: 'critical', advice: 'Early invasive assessment. Ongoing ischemic symptoms, hemodynamic instability, or an OMI pattern require immediate coronary care regardless of the score.' };
            }
        },
        {
            id: 'perc',
            name: 'PERC Rule',
            topic: 'Pulmonary embolism',
            href: '#dyspnea',
            summary: 'Pulmonary Embolism Rule-out Criteria. All 8 must be absent to rule out PE without D-dimer — only when pretest probability is already very low (< 15%).',
            caveat: 'Do NOT apply when pretest probability is not low. PERC does not override clinical gestalt, pregnancy, or a Wells/age-adjusted D-dimer pathway when indicated.',
            inputs: [
                { key: 'age', label: 'Age ≥ 50 years', type: 'check' },
                { key: 'hr', label: 'Heart rate ≥ 100/min', type: 'check' },
                { key: 'sat', label: 'SpO₂ < 95% on room air', type: 'check' },
                { key: 'leg', label: 'Unilateral leg swelling', type: 'check' },
                { key: 'hemo', label: 'Hemoptysis', type: 'check' },
                { key: 'surg', label: 'Surgery or trauma within 4 weeks', type: 'check' },
                { key: 'vte', label: 'Prior DVT or PE', type: 'check' },
                { key: 'estro', label: 'Exogenous estrogen use', type: 'check' }
            ],
            compute: function (v) {
                const hits = Object.keys(v).filter(function (k) { return v[k]; }).length;
                if (hits === 0) return { points: 0, band: 'PERC negative', riskLevel: 'common', advice: 'All 8 criteria absent: in a very-low-pretest patient, PE can be excluded without D-dimer or imaging. Document the low gestalt. If pretest probability is not low, do not use this result.' };
                return { points: hits, band: hits + ' of 8 present — PERC positive', riskLevel: 'emergent', advice: 'PERC cannot rule out PE. Use a validated pathway: age-adjusted D-dimer (age × 10 ng/mL FEU if > 50 yr) or YEARS before CTPA. High pretest probability → proceed directly to CTPA.' };
            }
        },
        {
            id: 'wells-pe',
            name: 'Wells Score — PE',
            topic: 'Pulmonary embolism',
            href: '#dyspnea',
            summary: 'Pretest probability estimate for pulmonary embolism.',
            caveat: 'Combine with D-dimer only for low/intermediate probability. Do not use D-dimer to exclude PE in high probability or high-risk presentations.',
            inputs: [
                { key: 'dvt', label: 'Clinical signs of DVT', type: 'check', weight: 3 },
                { key: 'alt', label: 'PE is the most likely diagnosis (or equally likely)', type: 'check', weight: 3 },
                { key: 'hr', label: 'Heart rate > 100/min', type: 'check', weight: 1.5 },
                { key: 'immob', label: 'Immobilisation ≥ 3 days or surgery in previous 4 weeks', type: 'check', weight: 1.5 },
                { key: 'prev', label: 'Previous DVT or PE', type: 'check', weight: 1.5 },
                { key: 'hemo', label: 'Hemoptysis', type: 'check', weight: 1 },
                { key: 'ca', label: 'Active malignancy (treated within 6 months or palliative)', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points <= 1) return { points: points, band: 'Low probability', riskLevel: 'common', advice: 'Low pretest probability: a negative age-adjusted D-dimer can exclude PE. Escalate to CTPA if the D-dimer is positive or clinical concern persists.' };
                if (points <= 6) return { points: points, band: 'Moderate probability', riskLevel: 'emergent', advice: 'Intermediate pretest probability: use an age-adjusted or YEARS D-dimer pathway before CTPA. If the D-dimer is positive, image.' };
                return { points: points, band: 'High probability', riskLevel: 'critical', advice: 'High pretest probability: proceed directly to CTPA; do not use D-dimer to exclude. Assess hemodynamic stability — a massive PE with shock needs immediate escalation.' };
            }
        },
        {
            id: 'qsofa',
            name: 'qSOFA',
            topic: 'Sepsis screening',
            href: '#fever',
            summary: 'Bedside prompt for suspected infection. Not a stand-alone sepsis rule-in or rule-out.',
            caveat: 'qSOFA is a screening prompt only. Suspected sepsis with organ dysfunction requires immediate assessment and treatment regardless of the score. It is not a substitute for the full clinical picture.',
            inputs: [
                { key: 'rr', label: 'Respiratory rate ≥ 22/min', type: 'check', weight: 1 },
                { key: 'ams', label: 'Altered mentation (GCS < 15)', type: 'check', weight: 1 },
                { key: 'sbp', label: 'Systolic BP ≤ 100 mmHg', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points >= 2) return { points: points, band: 'qSOFA ≥ 2', riskLevel: 'critical', advice: 'Higher risk of poor outcome in suspected infection. Treat as possible sepsis/deterioration: reassess perfusion, lactate, urine output and antibiotics per local protocol. Do not wait for a score to escalate.' };
                return { points: points, band: 'qSOFA < 2', riskLevel: 'emergent', advice: 'A low qSOFA does not exclude sepsis. Continue the full assessment — vital-sign trends, organ dysfunction and source — and reassess if the patient changes.' };
            }
        },
        {
            id: 'curb65',
            name: 'CURB-65',
            topic: 'Community-acquired pneumonia severity',
            href: '#dyspnea',
            summary: 'Pneumonia severity estimate to support site-of-care decisions.',
            caveat: 'A decision-support adjunct only. Always integrate oxygen needs, comorbidity, frailty, social factors and local admission criteria.',
            inputs: [
                { key: 'conf', label: 'Confusion (new)', type: 'check', weight: 1 },
                { key: 'urea', label: 'Urea > 7 mmol/L (BUN > 19 mg/dL)', type: 'check', weight: 1 },
                { key: 'rr', label: 'Respiratory rate ≥ 30/min', type: 'check', weight: 1 },
                { key: 'bp', label: 'Systolic BP < 90 or diastolic ≤ 60 mmHg', type: 'check', weight: 1 },
                { key: 'age', label: 'Age ≥ 65 years', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points <= 1) return { points: points, band: 'Low severity (0–1)', riskLevel: 'common', advice: 'Often suitable for outpatient management when clinically stable and supported. Confirm oxygen requirement, comorbidity and follow-up access.' };
                if (points === 2) return { points: points, band: 'Moderate severity (2)', riskLevel: 'emergent', advice: 'Consider short admission or close observation. Reassess response to treatment and oxygen needs.' };
                return { points: points, band: 'High severity (≥ 3)', riskLevel: 'critical', advice: 'High severity: consider ICU assessment. Assess for severe CAP criteria and organ support needs early.' };
            }
        },
        {
            id: 'gcs',
            name: 'Glasgow Coma Scale (total)',
            topic: 'Level of consciousness',
            href: '#coma',
            summary: 'Sum of best eye, verbal and motor responses.',
            caveat: 'Record the components (E/V/M); the total alone hides pattern. A GCS ≤ 8 (motor ≤ 5, or loss of protective reflexes) raises airway concern — assess and protect early. Paediatric scoring differs.',
            inputs: [
                { key: 'eye', label: 'Eye opening (1–4)', type: 'select', options: [
                    { label: '4 — spontaneous', value: 4 },
                    { label: '3 — to sound', value: 3 },
                    { label: '2 — to pressure', value: 2 },
                    { label: '1 — none', value: 1 }
                ] },
                { key: 'verbal', label: 'Verbal response (1–5)', type: 'select', options: [
                    { label: '5 — oriented', value: 5 },
                    { label: '4 — confused', value: 4 },
                    { label: '3 — inappropriate words', value: 3 },
                    { label: '2 — sounds', value: 2 },
                    { label: '1 — none', value: 1 }
                ] },
                { key: 'motor', label: 'Best motor response (1–6)', type: 'select', options: [
                    { label: '6 — obeys commands', value: 6 },
                    { label: '5 — localises', value: 5 },
                    { label: '4 — normal flexion', value: 4 },
                    { label: '3 — abnormal flexion', value: 3 },
                    { label: '2 — extension', value: 2 },
                    { label: '1 — none', value: 1 }
                ] }
            ],
            compute: function (v) {
                const points = v.eye + v.verbal + v.motor;
                const detail = 'E' + v.eye + ' V' + v.verbal + ' M' + v.motor;
                if (points <= 8) return { points: points, band: 'GCS ' + points + ' — severe (' + detail + ')', riskLevel: 'critical', advice: 'Severe impairment. Assess airway protection, capillary glucose, pupils and neuro exam. A GCS ≤ 8 with loss of protective reflexes raises airway concern — discuss early with senior/anaesthetic support.' };
                if (points <= 12) return { points: points, band: 'GCS ' + points + ' — moderate (' + detail + ')', riskLevel: 'emergent', advice: 'Moderate impairment. Reassess the trend and treat reversible causes (glucose, hypoxia, drugs, seizure). A falling GCS is more important than the absolute value.' };
                return { points: points, band: 'GCS ' + points + ' — mild (' + detail + ')', riskLevel: 'common', advice: 'Mildly reduced to normal. Reassess trends and document the components. Interpret in context with the mechanism and pupil exam.' };
            }
        },
        {
            id: 'wells-dvt',
            name: 'Wells Score — DVT',
            topic: 'Deep vein thrombosis',
            href: '#edema',
            summary: 'Pretest probability estimate for a first lower-limb deep vein thrombosis.',
            caveat: 'Use with a validated D-dimer pathway for low/intermediate probability. Do not use D-dimer alone to exclude DVT in high probability.',
            inputs: [
                { key: 'ca', label: 'Active cancer (treatment within 6 months or palliative)', type: 'check', weight: 1 },
                { key: 'para', label: 'Paralysis, paresis or recent plaster immobilisation of the leg', type: 'check', weight: 1 },
                { key: 'bed', label: 'Bedridden ≥ 3 days or major surgery within 12 weeks', type: 'check', weight: 1 },
                { key: 'tender', label: 'Tenderness along the deep venous system', type: 'check', weight: 1 },
                { key: 'swell', label: 'Entire leg swollen', type: 'check', weight: 1 },
                { key: 'calf', label: 'Calf swelling ≥ 3 cm greater than the other side', type: 'check', weight: 1 },
                { key: 'pitting', label: 'Pitting oedema confined to the symptomatic leg', type: 'check', weight: 1 },
                { key: 'collat', label: 'Collateral (non-varicose) superficial veins', type: 'check', weight: 1 },
                { key: 'prev', label: 'Previously documented DVT', type: 'check', weight: 1 },
                { key: 'alt', label: 'Alternative diagnosis at least as likely as DVT', type: 'check', weight: -2 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points <= 0) return { points: points, band: 'DVT unlikely (≤ 0)', riskLevel: 'common', advice: 'DVT unlikely: a negative high-sensitivity D-dimer can exclude DVT; if positive, proceed to duplex ultrasound.' };
                if (points <= 2) return { points: points, band: 'DVT likely (1–2)', riskLevel: 'emergent', advice: 'Intermediate: obtain a D-dimer and/or duplex ultrasound per local pathway; treat on suspicion if the ultrasound will be delayed.' };
                return { points: points, band: 'DVT likely (≥ 3)', riskLevel: 'critical', advice: 'High probability: proceed to duplex ultrasound; consider empirical anticoagulation while awaiting imaging if bleeding risk allows.' };
            }
        },
        {
            id: 'canadian-ct-head',
            name: 'Canadian CT Head Rule',
            topic: 'Minor head injury (GCS 13–15)',
            href: '#multiple-trauma',
            summary: 'CT-head decision support for minor head trauma with GCS 13–15 after a witnessed loss of consciousness, amnesia or confusion.',
            caveat: 'Applies to adults with minor head injury only. Do not use for GCS <13, age <16, anticoagulation, seizure, or obvious open/depressed skull fracture — image these directly.',
            inputs: [
                { key: 'gcs', label: 'GCS < 15 at 2 h after injury', type: 'check', weight: 1 },
                { key: 'vomit', label: 'Vomiting ≥ 2 times', type: 'check', weight: 1 },
                { key: 'age65', label: 'Age ≥ 65 years', type: 'check', weight: 1 },
                { key: 'amnesia', label: 'Amnesia before impact > 30 min', type: 'check', weight: 1 },
                { key: 'mechanism', label: 'Dangerous mechanism (pedestrian, ejection, fall > 1 m / 5 stairs)', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points === 0) return { points: points, band: 'CT not indicated by the rule', riskLevel: 'common', advice: 'No high- or medium-risk feature: CT is not indicated by the Canadian CT Head Rule. Provide head-injury observation advice and return precautions.' };
                return { points: points, band: points + ' feature(s) present — CT indicated', riskLevel: 'emergent', advice: 'At least one high-risk criterion is present: obtain a non-contrast CT head. A normal CT does not by itself permit discharge — apply observation criteria and anticoagulation status.' };
            }
        },
        {
            id: 'anion-gap',
            name: 'Anion gap & delta ratio',
            topic: 'Metabolic acidosis',
            href: '#hyperglycemia',
            summary: 'Anion gap and delta ratio to separate a high-anion-gap acidosis and look for a mixed disorder.',
            caveat: 'Enter values in the units your lab reports. The delta ratio uses a reference gap of 10 without K⁺ or 14 with K⁺ included, and bicarbonate 24; adjust if your lab uses a different normal range or if albumin is low.',
            inputs: [
                { key: 'na', label: 'Sodium (mmol/L)', type: 'number', placeholder: 'e.g. 138' },
                { key: 'cl', label: 'Chloride (mmol/L)', type: 'number', placeholder: 'e.g. 100' },
                { key: 'hco3', label: 'Bicarbonate (mmol/L)', type: 'number', placeholder: 'e.g. 12' },
                { key: 'k', label: 'Potassium (mmol/L, optional)', type: 'number', placeholder: 'e.g. 4.0' }
            ],
            compute: function (v) {
                const hasK = isFinite(v.k);
                const k = hasK ? v.k : 0;
                if (!isFinite(v.na) || !isFinite(v.cl) || !isFinite(v.hco3)) return { points: 0, band: 'Enter Na, Cl and HCO₃', riskLevel: 'common', advice: 'Fill sodium, chloride and bicarbonate to compute the anion gap.' };
                const ag = (v.na + k) - (v.cl + v.hco3);
                /* Reference gap shifts with the K⁺ convention: ~8–12 without K⁺,
                   ~12–16 when K⁺ is included. */
                const refMid = hasK ? 14 : 10;
                const upper = hasK ? 16 : 12;
                const gap = hasK ? '(K⁺ included)' : '(without K⁺)';
                const delta = (ag - refMid) / (24 - v.hco3);
                const band = 'AG ' + ag.toFixed(0) + ' mEq/L ' + gap;
                if (ag <= upper) return { points: ag, band: band + ' — normal gap', riskLevel: 'common', advice: 'Normal anion gap: consider a non-gap (hyperchloraemic) acidosis — diarrhoea, RTA, saline load, acetazolamide. Check the clinical context.' };
                if (!isFinite(delta) || v.hco3 >= 24) return { points: ag, band: band + ' — high gap', riskLevel: 'emergent', advice: 'High-anion-gap acidosis: consider ketoacidosis, lactate, urate/renal failure, and toxins (methanol, ethylene glycol, salicylate). Calculate the delta ratio when bicarbonate is low.' };
                if (delta < 1) return { points: ag, band: band + ' · delta ' + delta.toFixed(2), riskLevel: 'emergent', advice: 'Delta ratio < 1 suggests a coexisting normal-gap (hyperchloraemic) acidosis in addition to the high-gap process.' };
                if (delta <= 2) return { points: ag, band: band + ' · delta ' + delta.toFixed(2), riskLevel: 'emergent', advice: 'Delta ratio 1–2 is consistent with a pure high-anion-gap acidosis. Treat the underlying cause.' };
                return { points: ag, band: band + ' · delta ' + delta.toFixed(2), riskLevel: 'critical', advice: 'Delta ratio > 2 suggests an additional metabolic alkalosis or a chronic respiratory acidosis. Re-examine the full blood gas.' };
            }
        },
        {
            id: 'corrected-sodium',
            name: 'Corrected sodium & osmolality',
            topic: 'Dysnatraemia',
            href: '#ams',
            summary: 'Glucose-corrected sodium and calculated serum osmolality with the osmolal gap.',
            caveat: 'Correction factors differ between references; the 2.4 mmol/L per 10 mg/dL (100 mg/dL) glucose rule is a common bedside estimate. Confirm with your local lab method. Interpret the osmolal gap cautiously.',
            inputs: [
                { key: 'na', label: 'Measured sodium (mmol/L)', type: 'number', placeholder: 'e.g. 128' },
                { key: 'glu', label: 'Glucose (mg/dL)', type: 'number', placeholder: 'e.g. 400' },
                { key: 'bun', label: 'Urea / BUN (mg/dL, optional)', type: 'number', placeholder: 'e.g. 14' }
            ],
            compute: function (v) {
                if (!isFinite(v.na) || !isFinite(v.glu)) return { points: 0, band: 'Enter sodium and glucose', riskLevel: 'common', advice: 'Enter sodium and glucose to estimate the corrected sodium.' };
                const corrected = v.na + 2.4 * ((v.glu - 100) / 100);
                const osm = 2 * v.na + v.glu / 18 + (isFinite(v.bun) ? v.bun / 2.8 : 0);
                const band = 'Corrected Na⁺ ' + corrected.toFixed(0) + ' mmol/L · osm ' + osm.toFixed(0) + ' mOsm/kg';
                if (corrected < 130) return { points: corrected, band: band, riskLevel: 'critical', advice: 'Corrected sodium is low: consider true hyponatraemia once hyperglycaemia is accounted for. Assess volume status, urine osmolality and sodium, and correct slowly to avoid osmotic demyelination.' };
                if (corrected > 145) return { points: corrected, band: band, riskLevel: 'critical', advice: 'Corrected sodium is high: consider hypernatraemia — assess free-water deficit and ongoing losses; correct gradually.' };
                return { points: corrected, band: band, riskLevel: 'common', advice: 'Corrected sodium is within the usual range. Interpret alongside the measured osmolality and the osmolal gap (measured − calculated).' };
            }
        },
        {
            id: 'qtc',
            name: 'QTc (Bazett & Fridericia)',
            topic: 'QT interval',
            href: '#palpitations',
            summary: 'Corrects a measured QT for heart rate by two common formulas.',
            caveat: 'Bazett over-corrects at high and under-corrects at low rates; Fridericia is more stable. Use the lead with the longest QT, and review the QT visually — automated values on a 12-lead can mislead.',
            inputs: [
                { key: 'qt', label: 'Measured QT (ms)', type: 'number', placeholder: 'e.g. 420' },
                { key: 'rr', label: 'RR interval (ms)', type: 'number', placeholder: 'e.g. 800' }
            ],
            compute: function (v) {
                if (!isFinite(v.qt) || !isFinite(v.rr) || v.rr <= 0) return { points: 0, band: 'Enter QT and RR', riskLevel: 'common', advice: 'Enter the measured QT and the RR interval to estimate the QTc.' };
                const rr = v.rr / 1000;
                const bazett = v.qt / Math.sqrt(rr);
                const fridericia = v.qt / Math.cbrt(rr);
                const band = 'QTc Bazett ' + bazett.toFixed(0) + ' ms · Fridericia ' + fridericia.toFixed(0) + ' ms';
                if (bazett >= 500 || fridericia >= 500) return { points: bazett, band: band, riskLevel: 'critical', advice: 'QTc ≥ 500 ms carries a high torsades risk. Stop QT-prolonging drugs, correct K⁺/Mg²⁺/Ca²⁺, and consider overdrive pacing or isoprenaline for bradycardia-dependent torsades.' };
                if (bazett >= 460) return { points: bazett, band: band, riskLevel: 'emergent', advice: 'QTc is prolonged. Review all QT-prolonging medications, replete electrolytes to high-normal, and monitor the ECG.' };
                return { points: bazett, band: band, riskLevel: 'common', advice: 'QTc is within the usual range. Reassess after any change in QT-prolonging drugs, electrolytes or rate.' };
            }
        }
    ];

    function scoreById(id) {
        for (let i = 0; i < SCORES.length; i++) if (SCORES[i].id === id) return SCORES[i];
        return null;
    }

    /* Pure evaluation used by rendering and tests. `state` maps input key → value. */
    function evaluate(score, state) {
        const values = {};
        score.inputs.forEach(function (input) {
            if (input.type === 'check') values[input.key] = !!state[input.key];
            else if (input.type === 'number') {
                const raw = state[input.key];
                values[input.key] = (raw === '' || raw === undefined || raw === null) ? NaN : num(raw);
            }
            else {
                const raw = state[input.key];
                const parsed = num(raw);
                values[input.key] = isFinite(parsed) ? parsed : (input.options[0] ? input.options[0].value : 0);
            }
        });
        return score.compute(values);
    }

    /* ────────────────────────────────────────────────────────────
       Symptom-first search terms.
       Maps lay/colloquial symptom phrases to the topic whose pathway
       answers them. Kept short and high-frequency: this is the
       "I don't know the diagnosis yet" entry point.
    ──────────────────────────────────────────────────────────── */
    const SYMPTOM_TERMS = [
        { cpId: 'chest-pain', terms: ['crushing chest pain', 'chest tightness', 'pain radiating to jaw', 'pain to left arm', 'tearing chest pain to back', 'chest pain worse on breathing', 'heart attack'] },
        { cpId: 'dyspnea', terms: ['cannot breathe', 'short of breath', 'breathless at rest', 'low oxygen saturation', 'hypoxia'] },
        { cpId: 'dyspnea', terms: ['sudden breathlessness after immobility', 'pleuritic chest pain and breathlessness'] },
        { cpId: 'abdominal-pain', terms: ['belly pain', 'stomach ache', 'right lower abdominal pain', 'epigastric pain'] },
        { cpId: 'headache', terms: ['worst headache ever', 'thunderclap headache', 'sudden severe headache', 'headache with neck stiffness'] },
        { cpId: 'dizziness', terms: ['room spinning', 'vertigo', 'light-headed when standing', 'unsteady'] },
        { cpId: 'syncope', terms: ['fainted', 'passed out', 'collapsed and woke up', 'blackout'] },
        { cpId: 'ams', terms: ['confused', 'not making sense', 'disoriented', 'acting strangely'] },
        { cpId: 'coma', terms: ['unconscious', 'unresponsive', 'cannot wake up'] },
        { cpId: 'weakness', terms: ['one-sided weakness', 'cannot move arm', 'facial droop', 'arm weakness'], },
        { cpId: 'focal-neurologic-deficit', terms: ['stroke symptoms', 'face droop arm weakness speech', 'sudden slurred speech', 'cannot speak', 'sudden vision loss one eye'] },
        { cpId: 'seizures', terms: ['convulsion', 'fitting', 'shaking all over', 'seizure'] },
        { cpId: 'shock', terms: ['low blood pressure', 'cold sweaty clammy', 'collapsed and pale', 'hypotension'] },
        { cpId: 'fever', terms: ['fever and shaking chills', 'hot and confused', 'tachycardic and febrile'] },
        { cpId: 'gib', terms: ['vomiting blood', 'black tarry stool', 'blood in stool', 'coffee-ground vomit'] },
        { cpId: 'hemoptysis', terms: ['coughing blood', 'blood in sputum'] },
        { cpId: 'anaphylaxis', terms: ['swollen lips and rash', 'allergic reaction with wheeze', 'throat closing after food sting'] },
        { cpId: 'airway-stridor', terms: ['noisy breathing', 'stridor', 'cannot swallow saliva', 'hoarse after collapse'] },
        { cpId: 'cyanosis', terms: ['blue lips', 'turning blue', 'cyanotic'] },
        { cpId: 'palpitations', terms: ['racing heart', 'heart pounding', 'fast irregular heartbeat'] },
        { cpId: 'edema', terms: ['swollen legs', 'swollen ankles', 'fluid in the legs'] },
        { cpId: 'limb-ischemia', terms: ['cold pale painful leg', 'sudden leg pain and pallor', 'pulseless limb'] },
        { cpId: 'back-pain', terms: ['back pain with saddle numbness', 'back pain with incontinence', 'back pain after fall', 'low back pain shooting down leg'] },
        { cpId: 'flank-pain', terms: ['loin to groin pain', 'kidney stone pain', 'blood in urine and flank pain'] },
        { cpId: 'urinary-retention', terms: ['cannot pass urine', 'unable to pee', 'painful bladder'] },
        { cpId: 'overdose', terms: ['took too many tablets', 'overdose', 'swallowed pills deliberately'] },
        { cpId: 'suicidal', terms: ['wants to harm self', 'suicidal thoughts', 'agitated and unsafe'] },
        { cpId: 'hyperglycemia', terms: ['very high sugar', 'diabetic and vomiting', 'fruity breath', 'sugar 40 mmol'] },
        { cpId: 'heat-cold', terms: ['collapsed in the heat', 'overheated after exercise', 'very cold and confused', 'hypothermia'] },
        { cpId: 'pediatric-fever', terms: ['baby with fever', 'febrile infant', 'child fever not drinking'] },
        { cpId: 'pediatric-respiratory-distress', terms: ['child struggling to breathe', 'baby grunting', 'child with wheeze and recession'] },
        { cpId: 'multiple-trauma', terms: ['road traffic accident', 'trauma primary survey', 'major trauma'] },
        { cpId: 'pregnancy-emergency', terms: ['pregnant with bleeding', 'pregnant with abdominal pain', 'severe headache in pregnancy'] },
        { cpId: 'vaginal-bleeding', terms: ['heavy period like bleeding', 'bleeding between periods', 'postmenopausal bleeding'] },
        { cpId: 'pelvic-pain', terms: ['lower abdominal pain woman', 'pelvic pain and discharge'] },
        { cpId: 'scrotal-pain', terms: ['testicle pain', 'sudden testicular pain'] },
        { cpId: 'rash', terms: ['rash that does not blanch', 'purpuric rash with fever', 'blanching rash'] },
        { cpId: 'sore-throat', terms: ['cannot swallow', 'sore throat with drooling', 'neck swelling'] },
        { cpId: 'red-eye', terms: ['red painful eye', 'sudden eye pain and blur', 'eye injury'] },
        { cpId: 'joint-pain', terms: ['swollen hot joint', 'cannot bear weight on joint'] },
        { cpId: 'jaundice', terms: ['yellow eyes', 'yellow skin'] },
        { cpId: 'nausea-vomiting', terms: ['vomiting repeatedly', 'cannot keep fluids down'] },
        { cpId: 'diarrhea', terms: ['loose stool and dehydrated', 'bloody diarrhea'] },
        { cpId: 'constipation', terms: ['no bowel movement and distended', 'cannot pass stool'] },
        { cpId: 'falls-geriatric-trauma', terms: ['older adult fell', 'elderly fall on anticoagulant'] }
    ];

    /* ────────────────────────────────────────────────────────────
       Rendering. All markup is built with escaped values. The module
       only touches the DOM after mount() is called so tests can load
       it in isolation.
    ──────────────────────────────────────────────────────────── */
    const state = {}; // scoreId → input key → value

    function stateFor(id) {
        if (!state[id]) state[id] = {};
        return state[id];
    }

    function riskBadge(level, text) {
        return '<span class="st-risk st-risk-' + esc(level) + '">' + esc(text) + '</span>';
    }

    function scoreCardHtml(score) {
        const s = stateFor(score.id);
        const inputs = score.inputs.map(function (input) {
            if (input.type === 'check') {
                return '<label class="st-check"><input type="checkbox" data-st-score="' + esc(score.id) + '" data-st-key="' + esc(input.key) + '"' +
                    (s[input.key] ? ' checked' : '') + '><span>' + esc(input.label) + '</span></label>';
            }
            if (input.type === 'number') {
                const val = s[input.key] !== undefined ? s[input.key] : '';
                return '<label class="st-field"><span>' + esc(input.label) + '</span><input type="number" inputmode="decimal" step="any" data-st-score="' + esc(score.id) + '" data-st-key="' + esc(input.key) + '"' +
                    ' value="' + esc(val) + '" placeholder="' + esc(input.placeholder || '') + '"></label>';
            }
            return '<label class="st-field"><span>' + esc(input.label) + '</span><select data-st-score="' + esc(score.id) + '" data-st-key="' + esc(input.key) + '">' +
                input.options.map(function (opt) {
                    const selected = s[input.key] !== undefined ? s[input.key] === opt.value : opt.value === input.options[0].value;
                    return '<option value="' + esc(opt.value) + '"' + (selected ? ' selected' : '') + '>' + esc(opt.label) + '</option>';
                }).join('') + '</select></label>';
        }).join('');
        return '<section class="st-score" data-st-score-card="' + esc(score.id) + '">' +
            '<div class="st-score-head"><div><h2>' + esc(score.name) + '</h2><p class="st-score-topic">' + esc(score.topic) + '</p></div>' +
            '<button type="button" class="st-reset" data-st-reset="' + esc(score.id) + '">Reset</button></div>' +
            '<p class="st-score-summary">' + esc(score.summary) + '</p>' +
            '<div class="st-inputs">' + inputs + '</div>' +
            '<output class="st-result" data-st-result="' + esc(score.id) + '" aria-live="polite"></output>' +
            '<p class="st-caveat"><strong>Use with care:</strong> ' + esc(score.caveat) + '</p>' +
            '<p class="st-score-link"><a href="' + esc(score.href) + '">Open the full pathway →</a></p>' +
            '</section>';
    }

    function renderResult(score) {
        const out = document.querySelector('[data-st-result="' + score.id + '"]');
        if (!out) return;
        const r = evaluate(score, stateFor(score.id));
        out.innerHTML = riskBadge(r.riskLevel, r.band + ' · ' + r.points + (r.points === 1 ? ' point' : ' points')) +
            '<p class="st-advice">' + esc(r.advice) + '</p>';
    }

    /* ────────────────────────────────────────────────────────────
       Pediatric weight-based dose & equipment reference.
       Doses follow AHA 2025 PALS; each row is {label, perKg (mg or J or mL
       per kg), unit, max, note}. Computed live from the entered weight so the
       resident gets a real number, not just a formula. Educational reference.
    ──────────────────────────────────────────────────────────── */
    const PEDS_DOSES = [
        { key: 'epi-arrest', label: 'Epinephrine (cardiac arrest)', perKg: 0.01, unit: 'mg', route: 'IV/IO', max: 1, note: '1:10,000; repeat every 3–5 min. ETT 0.1 mg/kg.' },
        { key: 'epi-anaph', label: 'Epinephrine (anaphylaxis IM)', perKg: 0.01, unit: 'mg', route: 'IM', max: 0.5, note: '1 mg/mL; max 0.3 mg per JTFPP, or use RCUK age bands.' },
        { key: 'defib', label: 'Defibrillation (VF / pulseless VT)', perKg: 2, unit: 'J', route: 'unsynchronised', max: 200, note: 'First shock 2 J/kg; subsequent 4 J/kg (max 10 J/kg or adult dose).' },
        { key: 'cardio', label: 'Synchronised cardioversion', perKg: 0.75, unit: 'J', route: 'synchronised', max: 100, note: '0.5–1 J/kg first, then 2 J/kg. Sedate if conscious.' },
        { key: 'amio', label: 'Amiodarone', perKg: 5, unit: 'mg', route: 'IV/IO', max: 300, note: 'Can repeat up to 15 mg/kg/day for refractory VF/VT.' },
        { key: 'lido', label: 'Lidocaine', perKg: 1, unit: 'mg', route: 'IV/IO', max: 100, note: 'Alternative to amiodarone.' },
        { key: 'mgso4', label: 'Magnesium sulfate (torsades)', perKg: 40, unit: 'mg', route: 'IV/IO', max: 2000, note: '25–50 mg/kg for torsades de pointes.' },
        { key: 'atropine', label: 'Atropine', perKg: 0.02, unit: 'mg', route: 'IV/IO', max: 0.5, note: 'Minimum single dose 0.1 mg to avoid paradoxical bradycardia.' },
        { key: 'adenosine', label: 'Adenosine (SVT)', perKg: 0.1, unit: 'mg', route: 'IV/IO rapid', max: 6, note: 'First 0.1 mg/kg (max 6 mg); second 0.2 mg/kg (max 12 mg).' },
        { key: 'fluid', label: 'Crystalloid bolus', perKg: 20, unit: 'mL', route: 'IV/IO', max: 1000, note: 'Reassess after each bolus for rales, hepatomegaly, work of breathing.' },
        { key: 'd10', label: 'Dextrose 10% (neonate/hypoglycaemia)', perKg: 5, unit: 'mL of D10W', route: 'IV/IO', max: 250, note: '2 mL/kg of D25W or 5 mL/kg of D10W; recheck glucose.' },
        { key: 'ceftriaxone', label: 'Ceftriaxone (suspected meningitis)', perKg: 50, unit: 'mg', route: 'IV/IM', max: 2000, note: '50 mg/kg for meningitis; add vancomycin per local protocol.' },
        { key: 'dex-croup', label: 'Dexamethasone (croup)', perKg: 0.15, unit: 'mg', route: 'PO/IV/IM', max: 10, note: '0.15–0.6 mg/kg single dose.' }
    ];

    /* Age-based airway equipment (does not need weight). */
    const PEDS_AIRWAY = [
        { label: 'ETT (cuffed)', formula: function (age) { return (age / 4) + 3; }, unit: 'mm ID', note: 'Cuffed tube = (age/4) + 3.' },
        { label: 'ETT (uncuffed)', formula: function (age) { return (age / 4) + 4; }, unit: 'mm ID', note: 'Uncuffed tube = (age/4) + 4.' },
        { label: 'ETT depth (children > 1 y)', formula: function (age) { return (age / 2) + 13; }, unit: 'cm at lip', note: 'Depth = age/2 + 13.' }
    ];

    /* Pure: compute pediatric doses for a weight in kg. Exposed for tests. */
    function pedsDoses(weightKg) {
        const w = num(weightKg);
        if (!isFinite(w) || w <= 0) return [];
        return PEDS_DOSES.map(function (d) {
            const raw = w * d.perKg;
            const capped = Math.min(raw, d.max);
            return {
                key: d.key, label: d.label, route: d.route, unit: d.unit, note: d.note,
                value: capped, capped: capped < raw, max: d.max
            };
        });
    }

    /* Pure: age-based airway equipment sizes. */
    function pedsAirway(ageYears) {
        const a = num(ageYears);
        if (!isFinite(a) || a < 0) return [];
        return PEDS_AIRWAY.map(function (s) {
            return { label: s.label, unit: s.unit, note: s.note, value: s.formula(a) };
        });
    }

    function fmtValue(v) {
        if (v >= 100) return String(Math.round(v));
        if (v >= 10) return (Math.round(v * 10) / 10).toString();
        return (Math.round(v * 100) / 100).toString();
    }

    /* Pure: map a route string to the semantic badge class it earns. The colour
       is a safety cue, so the mapping reads the route text alone and falls back
       to a neutral pathway badge instead of guessing a vascular route. */
    function routeClass(route) {
        const r = String(route || '').toUpperCase();
        if (/IM\b/.test(r) && !/I[VO]\b/.test(r)) return 'im';
        if (/I[VO]\b/.test(r)) return 'push';
        if (/SYNCHRON/.test(r)) return 'infusion';
        if (/INFUS|DRIP|MCG|UNITS/.test(r)) return 'infusion';
        return 'pathway';
    }

    /* ────────────────────────────────────────────────────────────
       Arrest cycle timer.
       A timekeeping aid for 2-minute CPR cycles: it counts up, marks each
       completed cycle and can pause or resume. It never decides when to shock,
       check a rhythm or give a drug — the arrest algorithm and the local
       protocol do that. State is module-level so it survives route changes, and
       the clock always reads Date.now() rather than accumulating ticks, so a
       throttled or backgrounded tab cannot make it drift.
    ──────────────────────────────────────────────────────────── */
    const CPR_CYCLE_MS = 120000;

    /* Pure: milliseconds → "m:ss", rounded to the nearest second. */
    function formatClock(ms) {
        const total = Math.max(0, Math.round((Number(ms) || 0) / 1000));
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    /* Pure: place an elapsed time inside its 2-minute cycle. */
    function cprPhase(ms) {
        const elapsed = Math.max(0, Number(ms) || 0);
        const completed = Math.floor(elapsed / CPR_CYCLE_MS);
        const inCycleMs = elapsed - completed * CPR_CYCLE_MS;
        return {
            cycle: completed + 1,
            completed: completed,
            inCycleMs: inCycleMs,
            remainingMs: CPR_CYCLE_MS - inCycleMs,
            percent: (inCycleMs / CPR_CYCLE_MS) * 100
        };
    }

    const cpr = { running: false, elapsedBefore: 0, startedAt: 0, tick: 0, listeners: [] };

    function cprElapsed() {
        return cpr.running ? cpr.elapsedBefore + (Date.now() - cpr.startedAt) : cpr.elapsedBefore;
    }

    function cprSnapshot() {
        const elapsedMs = cprElapsed();
        const phase = cprPhase(elapsedMs);
        return {
            running: cpr.running,
            elapsedMs: elapsedMs,
            cycle: phase.cycle,
            elapsed: formatClock(elapsedMs),
            remaining: formatClock(phase.remainingMs),
            percent: phase.percent
        };
    }

    /* A listener whose host element has left the document is dropped on the next
       tick, so a card destroyed by navigation stops receiving updates without an
       explicit unmount call. */
    function cprSubscribe(fn, host) {
        const entry = { fn: fn, host: host || null };
        cpr.listeners.push(entry);
        return function unsubscribe() {
            const i = cpr.listeners.indexOf(entry);
            if (i !== -1) cpr.listeners.splice(i, 1);
        };
    }

    function cprNotify() {
        const snapshot = cprSnapshot();
        for (let i = cpr.listeners.length - 1; i >= 0; i--) {
            const entry = cpr.listeners[i];
            if (entry.host && !entry.host.isConnected) { cpr.listeners.splice(i, 1); continue; }
            try { entry.fn(snapshot); } catch (e) {}
        }
    }

    function cprStopTicking() {
        if (cpr.tick) { clearInterval(cpr.tick); cpr.tick = 0; }
    }

    function cprStart() {
        if (!cpr.running) {
            cpr.running = true;
            cpr.startedAt = Date.now();
            if (!cpr.tick) cpr.tick = setInterval(cprNotify, 250);
        }
        cprNotify();
        return cprSnapshot();
    }

    function cprPause() {
        if (cpr.running) {
            cpr.elapsedBefore = cprElapsed();
            cpr.running = false;
        }
        cprStopTicking();
        cprNotify();
        return cprSnapshot();
    }

    function cprReset() {
        cpr.running = false;
        cpr.elapsedBefore = 0;
        cpr.startedAt = 0;
        cprStopTicking();
        cprNotify();
        return cprSnapshot();
    }

    function cprToggle() {
        return cpr.running ? cprPause() : cprStart();
    }

    function cprCardHtml(snapshot) {
        const snap = snapshot || cprSnapshot();
        return '<section class="st-score st-cpr" data-st-cpr>' +
            '<div class="st-score-head"><div><h2>CPR cycle timer</h2><p class="st-score-topic">Cardiac arrest · 2-minute cycles</p></div>' +
            '<button type="button" class="st-reset" data-st-cpr-reset>Reset</button></div>' +
            '<p class="st-score-summary">A timekeeping aid for 2-minute chest-compression cycles. Start it when compressions begin; the counter rolls over at each 2-minute mark.</p>' +
            '<div class="cpr-clockwrap">' +
            '<output class="cpr-clock" role="timer" data-st-cpr-clock>' + esc(snap.elapsed) + '</output>' +
            '<p class="cpr-meta"><span data-st-cpr-cycle>Cycle ' + esc(snap.cycle) + '</span> · <span data-st-cpr-remaining>' + esc(snap.remaining) + '</span> to the next mark</p>' +
            '<div class="cpr-track" aria-hidden="true"><span class="cpr-fill" data-st-cpr-fill></span></div>' +
            '</div>' +
            '<div class="cpr-actions"><button type="button" class="cpr-toggle" data-st-cpr-toggle aria-pressed="false">Start</button></div>' +
            '<p class="sr-only" role="status" aria-live="polite" data-st-cpr-live></p>' +
            '<p class="st-caveat"><strong>Timekeeping only:</strong> this timer never decides when to shock, check a rhythm or give a drug. Follow the current arrest algorithm and your local protocol, and watch the patient and the monitor rather than the clock.</p>' +
            '</section>';
    }

    /* Only one calculators screen is mounted at a time, so the previous card's
       subscription is released before the new one binds. */
    let cprCardUnsubscribe = null;

    function mountCprCard(root) {
        if (cprCardUnsubscribe) { cprCardUnsubscribe(); cprCardUnsubscribe = null; }
        const card = root.querySelector('[data-st-cpr]');
        if (!card) return;
        const clockEl = card.querySelector('[data-st-cpr-clock]');
        const cycleEl = card.querySelector('[data-st-cpr-cycle]');
        const remainEl = card.querySelector('[data-st-cpr-remaining]');
        const fillEl = card.querySelector('[data-st-cpr-fill]');
        const toggleEl = card.querySelector('[data-st-cpr-toggle]');
        const liveEl = card.querySelector('[data-st-cpr-live]');
        let lastCycle = null, lastRunning = null;
        const paint = function (snap) {
            if (clockEl) clockEl.textContent = snap.elapsed;
            if (cycleEl) cycleEl.textContent = 'Cycle ' + snap.cycle;
            if (remainEl) remainEl.textContent = snap.remaining;
            if (fillEl) fillEl.style.width = snap.percent.toFixed(1) + '%';
            if (toggleEl) {
                toggleEl.textContent = snap.running ? 'Pause' : (snap.elapsedMs > 0 ? 'Resume' : 'Start');
                toggleEl.setAttribute('aria-pressed', String(snap.running));
            }
            /* Announce cycle boundaries and state changes only — never every tick. */
            if (liveEl) {
                if (lastCycle !== null && snap.cycle !== lastCycle) liveEl.textContent = 'Two minutes — cycle ' + snap.cycle + '.';
                else if (lastRunning !== null && snap.running !== lastRunning) liveEl.textContent = snap.running ? 'Timer started.' : (snap.elapsedMs > 0 ? 'Timer paused at ' + snap.elapsed + '.' : 'Timer reset.');
            }
            lastCycle = snap.cycle;
            lastRunning = snap.running;
        };
        if (toggleEl) toggleEl.addEventListener('click', function () { cprToggle(); });
        const resetEl = card.querySelector('[data-st-cpr-reset]');
        if (resetEl) resetEl.addEventListener('click', function () { cprReset(); });
        cprCardUnsubscribe = cprSubscribe(paint, root);
        paint(cprSnapshot());
    }

    /* Quick facets for the calculators page. Each facet names the score ids it
       keeps, so renaming a score title can never silently empty a chip the way
       a substring match would. */
    const CALC_FACETS = [
        { key: 'all', label: 'All calculators', ids: [] },
        { key: 'chest', label: 'Chest pain', ids: ['heart'] },
        { key: 'vte', label: 'PE & DVT', ids: ['perc', 'wells-pe', 'wells-dvt'] },
        { key: 'sepsis', label: 'Sepsis & pneumonia', ids: ['qsofa', 'curb65'] },
        { key: 'neuro', label: 'Head & consciousness', ids: ['gcs', 'canadian-ct-head'] },
        { key: 'labs', label: 'Labs & ECG', ids: ['anion-gap', 'corrected-sodium', 'qtc'] },
        { key: 'peds', label: 'Paediatric doses', ids: [], pedsOnly: true }
    ];
    function facetByKey(key) {
        return CALC_FACETS.filter(function (f) { return f.key === key; })[0] || CALC_FACETS[0];
    }

    /* A weight written into the filter is a request for the dose card, not a
       text filter — no score name contains "12 kg". Accepted forms are a number
       with a kg unit ("12kg", "12 kg", "12 كجم") or a single bare number, so a
       score name that merely contains digits ("curb 65", "gcs 15") is never
       read as a weight. The number must also be a plausible body weight; an
       implausible one is left as ordinary filter text rather than dosing a
       wrong patient. Returns null when the filter carries no weight. */
    const WEIGHT_TOKEN = /^(\d+(?:[.,]\d+)?)(kg|kgs|كجم|كغ|كج)?$/i;
    const WEIGHT_UNIT = /^(kg|kgs|كجم|كغ|كج)$/i;
    function parseWeightFilter(filter) {
        const raw = String(filter == null ? '' : filter).trim();
        if (!raw) return null;
        const parts = raw.split(/\s+/);
        for (let i = 0; i < parts.length; i++) {
            const match = parts[i].match(WEIGHT_TOKEN);
            if (!match) continue;
            let last = i;
            if (!match[2]) {
                /* A bare number is a weight when it stands alone or is followed
                   by the unit; inside a phrase it is text. */
                if (WEIGHT_UNIT.test(parts[i + 1] || '')) last = i + 1;
                else if (parts.length !== 1) continue;
            }
            const weight = num(String(match[1]).replace(',', '.'));
            if (!isFinite(weight) || weight < 0.5 || weight > 200) continue;
            return {
                weight: weight,
                text: parts.filter(function (_, j) { return j < i || j > last; }).join(' ')
            };
        }
        return null;
    }

    const pedsState = { weight: '', age: '' };

    function pedsCardHtml() {
        return '<section class="st-score st-peds" data-st-peds>' +
            '<div class="st-score-head"><div><h2>Pediatric weight-based doses</h2><p class="st-score-topic">Resuscitation &amp; common drugs</p></div>' +
            '<button type="button" class="st-reset" data-st-peds-reset>Reset</button></div>' +
            '<p class="st-score-summary">Enter a weight to see calculated PALS and common emergency doses. Age gives airway device sizes. Values are rounded for bedside use.</p>' +
            '<div class="st-inputs"><div class="st-peds-inputs">' +
            '<label class="st-field"><span>Weight (kg)</span><input type="number" inputmode="decimal" step="any" data-st-peds-weight value="' + esc(pedsState.weight) + '" placeholder="e.g. 12"></label>' +
            '<label class="st-field"><span>Age (years, optional)</span><input type="number" inputmode="decimal" step="any" data-st-peds-age value="' + esc(pedsState.age) + '" placeholder="e.g. 3"></label>' +
            '</div></div>' +
            '<output class="st-result" data-st-peds-result aria-live="polite"></output>' +
            '<p class="st-caveat"><strong>Use with care:</strong> Doses follow AHA 2025 PALS for resuscitation and common references for the others; always confirm weight, indication and local protocol. This is an educational aid, not an order set.</p>' +
            '</section>';
    }

    function renderPeds(root) {
        const out = root.querySelector('[data-st-peds-result]');
        if (!out) return;
        const w = pedsState.weight;
        if (w === '' || !isFinite(num(w)) || num(w) <= 0) {
            out.innerHTML = '<p class="st-advice">Enter a weight in kilograms to calculate doses.</p>';
            return;
        }
        const rows = pedsDoses(w);
        const dsRows = rows.map(function (r) {
            return '<tr><th scope="row">' + esc(r.label) + '<span class="route-badge ' + routeClass(r.route) + '">' + esc(r.route) + '</span></th>' +
                '<td><span class="dose-amount">' + esc(fmtValue(r.value)) + ' ' + esc(r.unit) + '</span>' + (r.capped ? ' <span class="st-peds-max">(max)</span>' : '') + '</td></tr>';
        }).join('');
        let airwayHtml = '';
        if (pedsState.age !== '' && isFinite(num(pedsState.age))) {
            const air = pedsAirway(pedsState.age);
            airwayHtml = '<h3 class="st-peds-sub">Airway equipment (by age)</h3><table class="st-peds-table"><tbody>' +
                air.map(function (r) {
                    return '<tr><th scope="row">' + esc(r.label) + '</th><td>' + esc(fmtValue(r.value)) + ' ' + esc(r.unit) + '</td></tr>';
                }).join('') + '</tbody></table>';
        }
        out.innerHTML = '<p class="st-advice"><strong>Weight ' + esc(fmtValue(num(w))) + ' kg</strong> — calculated doses:</p>' +
            '<table class="st-peds-table"><tbody>' + dsRows + '</tbody></table>' + airwayHtml +
            '<details class="st-peds-notes"><summary>Notes, maxima and sources</summary><ul>' +
            rows.map(function (r) { return '<li><strong>' + esc(r.label) + ':</strong> ' + esc((r.unit === 'J' ? r.max + ' J max' : r.max + ' ' + r.unit + ' max') ) + ' — ' + esc(r.note) + '</li>'; }).join('') +
            '</ul><p>Sources: AHA 2025 PALS (resuscitation drugs, defibrillation, cardioversion); standard emergency references for the remaining rows. Confirm against your local formulary.</p></details>';
    }

    function calculatorsHtml(filter, facetKey) {
        /* A weight in the filter feeds the dose card instead of the score list,
           and the dose card moves to the top because it is what was asked for.
           The rest of the filter still narrows the scores as text. */
        const parsed = parseWeightFilter(filter);
        const q = (parsed ? parsed.text : (filter || '')).trim().toLowerCase();
        const facet = facetByKey(facetKey);
        const list = SCORES.filter(function (s) {
            if (facet.pedsOnly) return false;
            if (facet.ids.length && facet.ids.indexOf(s.id) === -1) return false;
            if (!q) return true;
            return (s.name + ' ' + s.topic + ' ' + s.summary).toLowerCase().indexOf(q) !== -1;
        });
        const showPeds = facet.pedsOnly || !!parsed || !q || /peds|paed|pediatr|weight|pals|dose|resuscitat|airway/.test(q);
        const pedsHtml = showPeds ? pedsCardHtml() : '';
        const showCpr = !q || /cpr|arrest|compression|cycle|timer|acls|resuscitat|shock/.test(q);
        const cprHtml = showCpr ? cprCardHtml() : '';
        const body = list.length ? list.map(scoreCardHtml).join('') : '';
        const facets = '<div class="chip-row" role="group" aria-label="Calculator categories">' +
            CALC_FACETS.map(function (f) {
                const active = f.key === facet.key;
                return '<button type="button" class="chip' + (active ? ' active' : '') + '" data-st-facet="' + esc(f.key) + '" aria-pressed="' + active + '">' + esc(f.label) + '</button>';
            }).join('') + '</div>';
        const empty = (!list.length && !showPeds && !showCpr) ?
            '<p class="empty-filter" role="status">No calculator matches "' + esc(filter) + '". Try HEART, PERC, Wells, qSOFA, CURB-65, GCS or paediatric doses.</p>' : '';
        return '<header class="st-header"><span class="study-kicker">THE EM POCKET · BEDSIDE TOOLS</span>' +
            '<h1>Clinical calculators</h1>' +
            '<p>Interactive scores for bedside use. Answers update as you change inputs and are held in memory only — nothing is saved or sent.</p>' +
            '<label class="st-search"><span class="sr-only">Filter calculators</span>' +
            '<input type="search" id="stCalcFilter" placeholder="Filter calculators…" value="' + esc(filter || '') + '" autocomplete="off"></label>' +
            facets +
            '</header>' +
            '<p class="clinical-safety-note">Educational decision support. Scores are adjuncts, never a substitute for clinical judgment, the full patient picture or local protocols.</p>' +
            '<div class="st-scores">' + (parsed ? pedsHtml + cprHtml : cprHtml + pedsHtml) + body + '</div>' + empty;
    }

    function calculatorsScreen(root, filter, facetKey) {
        /* A weight in the route or the filter box preloads the dose card, so a
           "#calc~12kg" link and a typed "12 kg" behave the same way. */
        const parsedWeight = parseWeightFilter(filter);
        if (parsedWeight) pedsState.weight = String(parsedWeight.weight);
        root.innerHTML = calculatorsHtml(filter, facetKey);
        const filterInput = root.querySelector('#stCalcFilter');
        if (filterInput) {
            filterInput.addEventListener('input', function () {
                const pos = this.selectionStart;
                /* Typing is the explicit intent, so it clears the facet chip. */
                calculatorsScreen(root, this.value, 'all');
                const next = root.querySelector('#stCalcFilter');
                if (next) { next.focus(); try { next.setSelectionRange(pos, pos); } catch (e) {} }
            });
        }
        root.querySelectorAll('[data-st-facet]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                const next = chip.dataset.stFacet === (facetKey || 'all') ? 'all' : chip.dataset.stFacet;
                calculatorsScreen(root, '', next);
            });
        });
        root.querySelectorAll('[data-st-score]').forEach(function (el) {
            const score = scoreById(el.dataset.stScore);
            const apply = function () {
                const s = stateFor(el.dataset.stScore);
                if (el.type === 'checkbox') s[el.dataset.stKey] = el.checked;
                else if (el.type === 'number') s[el.dataset.stKey] = el.value === '' ? '' : num(el.value);
                else s[el.dataset.stKey] = num(el.value);
                renderResult(score);
            };
            el.addEventListener('change', apply);
            if (el.type !== 'checkbox') { el.addEventListener('input', apply); apply(); }
        });
        root.querySelectorAll('[data-st-reset]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state[btn.dataset.stReset] = {};
                calculatorsScreen(root, filterInput ? filterInput.value : '', facetKey);
            });
        });
        /* Pediatric weight-based doses. */
        const wInput = root.querySelector('[data-st-peds-weight]');
        const aInput = root.querySelector('[data-st-peds-age]');
        if (wInput) wInput.addEventListener('input', function () {
            pedsState.weight = this.value;
            renderPeds(root);
        });
        if (aInput) aInput.addEventListener('input', function () {
            pedsState.age = this.value;
            renderPeds(root);
        });
        const pedsReset = root.querySelector('[data-st-peds-reset]');
        if (pedsReset) pedsReset.addEventListener('click', function () {
            pedsState.weight = '';
            pedsState.age = '';
            calculatorsScreen(root, filterInput ? filterInput.value : '', facetKey);
        });
        if (wInput) renderPeds(root);
        mountCprCard(root);
        SCORES.forEach(function (s) { if (state[s.id]) renderResult(s); });
    }

    /* ────────────────────────────────────────────────────────────
       Public surface.
    ──────────────────────────────────────────────────────────── */
    window.SHIFT_TOOLS = {
        scores: SCORES,
        scoreById: scoreById,
        evaluate: evaluate,
        pedsDoses: pedsDoses,
        pedsAirway: pedsAirway,
        routeClass: routeClass,
        calcFacets: CALC_FACETS,
        symptomTerms: SYMPTOM_TERMS,
        /* Pure: read a body weight out of a filter or query string, or null.
           Shared with the header search so a typed weight means the same thing
           in both boxes. */
        parseWeightFilter: parseWeightFilter,
        /* Arrest cycle timer. `subscribe(fn)` receives a snapshot and is called
           on every tick, state change and 2-minute cycle boundary. */
        timer: {
            start: cprStart,
            pause: cprPause,
            toggle: cprToggle,
            reset: cprReset,
            snapshot: cprSnapshot,
            subscribe: cprSubscribe,
            formatClock: formatClock,
            phase: cprPhase,
            cycleMs: CPR_CYCLE_MS
        },
        mountCalculators: function (root, filter) {
            if (!root) return;
            calculatorsScreen(root, filter || '');
        },
        /* Returns [{cpId, term, match}] for a symptom query, de-duplicated by topic. */
        symptomSearch: function (query) {
            const q = String(query || '').trim().toLowerCase();
            if (q.length < 2) return [];
            const seen = {};
            const out = [];
            SYMPTOM_TERMS.forEach(function (entry) {
                entry.terms.forEach(function (term) {
                    if (term.indexOf(q) === -1 && q.indexOf(term) === -1) return;
                    const key = entry.cpId;
                    if (seen[key]) return;
                    seen[key] = true;
                    out.push({ cpId: entry.cpId, term: term, match: term });
                });
            });
            return out;
        }
    };

    /* Auto-bind once the DOM is ready so index.html needs no inline change. */
    function boot() {
        const host = document.querySelector('[data-shift-tools="calculators"]');
        if (host) window.SHIFT_TOOLS.mountCalculators(host);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();

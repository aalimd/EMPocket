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
        if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return NaN;
        const n = Number(value);
        return Number.isFinite(n) ? n : NaN;
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
                { key: 'lowPretest', label: 'I confirmed very low pretest probability and assessed all eight PERC criteria', type: 'check' },
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
                const hits = this.inputs.filter(input => input.key !== 'lowPretest' && v[input.key]).length;
                if (!v.lowPretest) return { points: null, band: 'Assess pretest probability first', advice: 'PERC is for adults with very low pretest probability. Use a validated PE pathway for other patients.' };
                if (hits === 0) return { points: 0, band: 'PERC negative', riskLevel: 'common', advice: 'All 8 criteria absent: in a very-low-pretest patient, PE can be excluded without D-dimer or imaging. Document the low gestalt. If pretest probability is not low, do not use this result.' };
                return { points: hits, band: hits + ' of 8 present — PERC positive', riskLevel: 'emergent', advice: 'PERC cannot rule out PE. Use a validated pathway: age-adjusted D-dimer (age × 10 ng/mL FEU if > 50 yr) or YEARS before CTPA. High pretest probability → proceed directly to CTPA.' };
            }
        },
        {
            id: 'wells-pe',
            name: 'Wells Score — PE (three levels)',
            topic: 'Pulmonary embolism',
            href: '#dyspnea',
            confirmChecks: true,
            summary: 'Pretest probability estimate for pulmonary embolism.',
            caveat: 'Combine with D-dimer only for low/intermediate probability. Do not use D-dimer to exclude PE in high probability or high-risk presentations.',
            inputs: [
                { key: 'dvt', label: 'Clinical signs of DVT', type: 'check', weight: 3 },
                { key: 'alt', label: 'PE is more likely than an alternative diagnosis', type: 'check', weight: 3 },
                { key: 'hr', label: 'Heart rate > 100/min', type: 'check', weight: 1.5 },
                { key: 'immob', label: 'Immobilisation ≥ 3 days or surgery in previous 4 weeks', type: 'check', weight: 1.5 },
                { key: 'prev', label: 'Previous DVT or PE', type: 'check', weight: 1.5 },
                { key: 'hemo', label: 'Hemoptysis', type: 'check', weight: 1 },
                { key: 'ca', label: 'Active malignancy (treated within 6 months or palliative)', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points < 2) return { points: points, band: 'Low probability', riskLevel: 'common', advice: 'Use a validated PE pathway. If clinical pretest probability is very low, assess PERC; otherwise use the appropriate D-dimer pathway.' };
                if (points <= 6) return { points: points, band: 'Moderate probability', riskLevel: 'emergent', advice: 'Intermediate pretest probability: use an age-adjusted or YEARS D-dimer pathway before CTPA. If the D-dimer is positive, image.' };
                return { points: points, band: 'High probability', riskLevel: 'critical', advice: 'High pretest probability: proceed directly to CTPA; do not use D-dimer to exclude. Assess hemodynamic stability — a massive PE with shock needs immediate escalation.' };
            }
        },
        {
            id: 'qsofa',
            name: 'qSOFA',
            confirmChecks: true,
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
            confirmChecks: true,
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
                if (points === 15) return { points: points, band: 'GCS 15 (' + detail + ')', riskLevel: 'common', advice: 'Document all three assessed responses and reassess trends in clinical context.' };
                if (points <= 8) return { points: points, band: 'GCS ' + points + ' — severe (' + detail + ')', riskLevel: 'critical', advice: 'Severe impairment. Assess airway protection, capillary glucose, pupils and neuro exam. A GCS ≤ 8 with loss of protective reflexes raises airway concern — discuss early with senior/anaesthetic support.' };
                if (points <= 12) return { points: points, band: 'GCS ' + points + ' — moderate (' + detail + ')', riskLevel: 'emergent', advice: 'Moderate impairment. Reassess the trend and treat reversible causes (glucose, hypoxia, drugs, seizure). A falling GCS is more important than the absolute value.' };
                return { points: points, band: 'GCS ' + points + ' — mild (' + detail + ')', riskLevel: 'common', advice: 'Mildly reduced to normal. Reassess trends and document the components. Interpret in context with the mechanism and pupil exam.' };
            }
        },
        {
            id: 'wells-dvt',
            name: 'Wells Score — DVT',
            confirmChecks: true,
            topic: 'Deep vein thrombosis',
            href: '#edema',
            summary: 'NICE two-level Wells score for suspected lower-limb DVT in adults.',
            caveat: 'Use the adult NICE NG158 pathway. Pregnancy requires a separate assessment pathway.',
            inputs: [
                { key: 'ca', label: 'Active cancer (treatment within 6 months or palliative)', type: 'check', weight: 1 },
                { key: 'para', label: 'Paralysis, paresis or recent plaster immobilisation of the leg', type: 'check', weight: 1 },
                { key: 'bed', label: 'Recently bedridden ≥3 days or major surgery with general or regional anesthesia within 12 weeks', type: 'check', weight: 1 },
                { key: 'tender', label: 'Tenderness along the deep venous system', type: 'check', weight: 1 },
                { key: 'swell', label: 'Entire leg swollen', type: 'check', weight: 1 },
                { key: 'calf', label: 'Calf ≥3 cm larger than the other side, measured 10 cm below the tibial tuberosity', type: 'check', weight: 1 },
                { key: 'pitting', label: 'Pitting oedema confined to the symptomatic leg', type: 'check', weight: 1 },
                { key: 'collat', label: 'Collateral (non-varicose) superficial veins', type: 'check', weight: 1 },
                { key: 'prev', label: 'Previously documented DVT', type: 'check', weight: 1 },
                { key: 'alt', label: 'Alternative diagnosis at least as likely as DVT', type: 'check', weight: -2 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key]) points += i.weight; });
                if (points <= 1) return { points: points, band: 'DVT unlikely (≤1)', riskLevel: 'common', advice: 'Start with D-dimer. If positive, obtain proximal leg ultrasound. Follow local timing and interim anticoagulation guidance if testing is delayed.' };
                return { points: points, band: 'DVT likely (≥2)', riskLevel: 'emergent', advice: 'Obtain proximal leg ultrasound first. If negative, check D-dimer and arrange a repeat proximal scan in 6–8 days if D-dimer is positive. If imaging is delayed, use the local interim anticoagulation pathway and check bleeding risk.' };
            }
        },
        {
            id: 'canadian-ct-head',
            name: 'Canadian CT Head Rule',
            topic: 'Minor head injury (GCS 13–15)',
            href: '#head-injury',
            summary: 'CT-head decision support for minor head trauma with GCS 13–15 after a witnessed loss of consciousness, amnesia or confusion.',
            caveat: 'Apply only to eligible patients aged 16 or older with blunt minor head injury and loss of consciousness, amnesia or disorientation. Use a separate assessment for anticoagulation, antiplatelets other than aspirin, post-traumatic seizure, focal deficits or other exclusions.',
            inputs: [
                { key: 'eligible', label: 'I confirmed eligibility and assessed all seven criteria', type: 'check' },
                { key: 'gcs', label: 'GCS <15 at 2 hours after injury', type: 'check', weight: 1 },
                { key: 'open', label: 'Suspected open or depressed skull fracture', type: 'check', weight: 1 },
                { key: 'basal', label: 'Signs of basal skull fracture', type: 'check', weight: 1 },
                { key: 'vomit', label: 'Vomiting ≥ 2 times', type: 'check', weight: 1 },
                { key: 'age65', label: 'Age ≥ 65 years', type: 'check', weight: 1 },
                { key: 'amnesia', label: 'Amnesia before impact > 30 min', type: 'check', weight: 1 },
                { key: 'mechanism', label: 'Dangerous mechanism (pedestrian, ejection, fall from ≥3 feet or ≥5 stairs)', type: 'check', weight: 1 }
            ],
            compute: function (v) {
                let points = 0;
                this.inputs.forEach(function (i) { if (v[i.key] && i.weight) points += i.weight; });
                if (!v.eligible) return { points: null, band: 'Confirm rule eligibility', advice: 'Check the inclusion and exclusion criteria before using this rule to exclude imaging. Suspected skull fracture or neurological deterioration needs urgent assessment.' };
                if (points === 0) return { points: points, band: 'CT not indicated by the rule', riskLevel: 'common', advice: 'No high- or medium-risk feature: CT is not indicated by the Canadian CT Head Rule. Provide head-injury observation advice and return precautions.' };
                return { points: points, band: points + ' feature(s) present — CT indicated', riskLevel: 'emergent', advice: 'At least one high- or medium-risk criterion is present. Obtain a non-contrast head CT. A normal CT does not by itself permit discharge — apply observation criteria and anticoagulation status.' };
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
            href: '#hyperglycemia',
            summary: 'Estimate glucose-corrected sodium and calculate effective osmolality. Add BUN to calculate total osmolality.',
            caveat: 'This estimate adds 2.4 mmol/L to measured sodium per 100 mg/dL of glucose above 100 mg/dL. Correction factors vary. Use measured sodium for the osmolality calculations.',
            inputs: [
                { key: 'na', label: 'Measured sodium (mmol/L)', type: 'number', placeholder: 'e.g. 128' },
                { key: 'glu', label: 'Glucose (mg/dL)', type: 'number', placeholder: 'e.g. 400' },
                { key: 'bun', label: 'Blood urea nitrogen (BUN, mg/dL, optional)', type: 'number', placeholder: 'e.g. 14' }
            ],
            compute: function (v) {
                if (!isFinite(v.na) || !isFinite(v.glu) || v.na <= 0 || v.glu <= 0 || (isFinite(v.bun) && v.bun < 0)) return { points: 0, band: 'Enter valid sodium and glucose values', riskLevel: 'common', advice: 'Enter sodium and glucose to estimate the corrected sodium.' };
                const corrected = v.na + 2.4 * (Math.max(0, v.glu - 100) / 100);
                const effective = 2 * v.na + v.glu / 18;
                const total = isFinite(v.bun) ? effective + v.bun / 2.8 : null;
                const band = 'Corrected Na⁺ ' + corrected.toFixed(1) + ' mmol/L · effective ' + effective.toFixed(1) + ' mOsm/kg' +
                    (total === null ? '' : ' · total ' + total.toFixed(1) + ' mOsm/kg');
                return { points: corrected, band, riskLevel: 'common', advice: 'Interpret with symptoms, volume status and serial results. Use the full DKA/HHS criteria and treatment pathway when a hyperglycemic crisis is suspected.' };
            }
        },
        {
            id: 'qtc',
            name: 'QTc (Bazett & Fridericia)',
            topic: 'QT interval',
            href: '#ecg~step-intervals',
            summary: 'Corrects a measured QT for heart rate by two common formulas.',
            caveat: 'Bazett over-corrects at high and under-corrects at low rates; Fridericia is more stable. Use the lead with the longest QT, and review the QT visually — automated values on a 12-lead can mislead.',
            inputs: [
                { key: 'qt', label: 'Measured QT (ms)', type: 'number', placeholder: 'e.g. 420' },
                { key: 'rr', label: 'RR interval (ms)', type: 'number', placeholder: 'e.g. 800' }
            ],
            compute: function (v) {
                if (!isFinite(v.qt) || !isFinite(v.rr) || v.qt <= 0 || v.rr <= 0) return { points: 0, band: 'Enter QT and RR', riskLevel: 'common', advice: 'Enter the measured QT and the RR interval to estimate the QTc.' };
                const rr = v.rr / 1000;
                const bazett = v.qt / Math.sqrt(rr);
                const fridericia = v.qt / Math.cbrt(rr);
                const band = 'QTc Bazett ' + bazett.toFixed(0) + ' ms · Fridericia ' + fridericia.toFixed(0) + ' ms';
                if (bazett >= 500 || fridericia >= 500) return { points: bazett, band: band, riskLevel: 'critical', advice: 'A calculated QTc ≥500 ms needs prompt review. Confirm the QT measurement, QRS width and correction formula, and assess medications, electrolytes and rhythm. Use the resuscitation pathway for active torsades.' };
                return { points: bazett, band: band, riskLevel: 'common', advice: 'Interpret the estimates with age, sex, heart rate and QRS width. Review the ECG intervals guide for thresholds and measurement limits.' };
            }
        }
    ];

    function scoreById(id) {
        for (let i = 0; i < SCORES.length; i++) if (SCORES[i].id === id) return SCORES[i];
        return null;
    }

    /* Pure evaluation used by rendering and tests. `state` maps input key → value. */
    function evaluate(score, state) {
        const missingChoice = score.inputs.some(input => input.type === 'select' &&
            !input.options.some(option => option.value === num(state[input.key])));
        if (missingChoice || (score.confirmChecks && state.assessed !== true)) {
            const untestable = score.id === 'gcs' && score.inputs.some(input => state[input.key] === 'nt');
            return {
                points: null,
                band: untestable ? 'GCS total unavailable' : 'Assessment incomplete',
                advice: untestable ? 'Record the observed components and which response could not be tested.' :
                    'Assess all criteria before interpreting this score.'
            };
        }
        const values = {};
        score.inputs.forEach(function (input) {
            if (input.type === 'check') values[input.key] = !!state[input.key];
            else if (input.type === 'number') {
                const raw = state[input.key];
                values[input.key] = (raw === '' || raw === undefined || raw === null) ? NaN : num(raw);
            }
            else {
                values[input.key] = num(state[input.key]);
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
        { cpId: 'chest-pain', terms: ['ألم الصدر', 'ألم في الصدر', 'ضغط على الصدر'] },
        { cpId: 'dyspnea', terms: ['ضيق التنفس', 'ضيق نفس', 'صعوبة التنفس'] },
        { cpId: 'sepsis-and-septic-shock', terms: ['الصدمة الإنتانية', 'صدمة إنتانية', 'الإنتان', 'تسمم الدم'] },
        { cpId: 'acute-ischemic-stroke', terms: ['السكتة', 'السكتة الدماغية', 'جلطة دماغية', 'جلطة المخ'] },
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
        { cpId: 'neutropenic-sepsis', terms: ['fever after chemotherapy', 'chemo fever', 'neutropenic fever'] },
        { cpId: 'tumor-lysis-syndrome', terms: ['tumour lysis syndrome', 'TLS'] },
        { cpId: 'metastatic-spinal-cord-compression', terms: ['cancer back pain', 'MSCC'] },
        { cpId: 'hypercalcemia-of-malignancy', terms: ['hypercalcaemia of malignancy'] },
        { cpId: 'superior-vena-cava-syndrome', terms: ['SVC obstruction', 'SVCO'] },
        { cpId: 'cancer-immunotherapy-toxicity', terms: ['CAR-T fever', 'checkpoint inhibitor toxicity'] },
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
                '<option value="">Select assessed response</option>' +
                input.options.map(function (opt) {
                    const selected = num(s[input.key]) === opt.value;
                    return '<option value="' + esc(opt.value) + '"' + (selected ? ' selected' : '') + '>' + esc(opt.label) + '</option>';
                }).join('') + (score.id === 'gcs' ? '<option value="nt"' + (s[input.key] === 'nt' ? ' selected' : '') + '>Not testable</option>' : '') +
                '</select></label>';
        }).join('');
        const confirmation = score.confirmChecks ? '<label class="st-check"><input type="checkbox" data-st-score="' +
            esc(score.id) + '" data-st-key="assessed"' + (s.assessed ? ' checked' : '') + '><span>I assessed all criteria above</span></label>' : '';
        return '<section class="st-score" data-st-score-card="' + esc(score.id) + '">' +
            '<div class="st-score-head"><div><h2>' + esc(score.name) + '</h2><p class="st-score-topic">' + esc(score.topic) + '</p></div>' +
            '<button type="button" class="st-reset" data-st-reset="' + esc(score.id) + '">Reset</button></div>' +
            '<p class="st-score-summary">' + esc(score.summary) + '</p>' +
            '<div class="st-inputs">' + inputs + confirmation + '</div>' +
            '<output class="st-result" data-st-result="' + esc(score.id) + '" aria-live="polite"></output>' +
            '<p class="st-caveat"><strong>Use with care:</strong> ' + esc(score.caveat) + '</p>' +
            '<p class="st-score-link"><a href="' + esc(score.href) + '">Open the full pathway →</a></p>' +
            '</section>';
    }

    function renderResult(score) {
        const out = document.querySelector('[data-st-result="' + score.id + '"]');
        if (!out) return;
        const r = evaluate(score, stateFor(score.id));
        const showPoints = r.points !== null && score.id !== 'gcs' && !score.inputs.some(input => input.type === 'number');
        const result = r.band + (showPoints ? ' · ' + r.points + (r.points === 1 ? ' point' : ' points') : '');
        out.innerHTML = (r.points === null ? '<strong>' + esc(result) + '</strong>' : riskBadge(r.riskLevel, result)) +
            '<p class="st-advice">' + esc(r.advice) + '</p>';
    }

    /* ────────────────────────────────────────────────────────────
       Pediatric weight-based dose & equipment reference.
       Doses follow AHA 2025 PALS; each row is {label, perKg (mg or J or mL
       per kg), unit, max, note}. Computed live from the entered weight so the
       resident gets a real number, not just a formula. Educational reference.
    ──────────────────────────────────────────────────────────── */
    const MIN_PEDS_WEIGHT = 0.5;
    const MAX_PEDS_WEIGHT = 200;
    const NEONATAL_AGE_LIMIT = 1 / 12;
    const MAX_PEDS_AGE = 18;
    const validPedsWeight = value => value >= MIN_PEDS_WEIGHT && value <= MAX_PEDS_WEIGHT;
    const validPedsAge = value => value >= 0 && value < MAX_PEDS_AGE;
    const PEDS_DOSES = [
        { key: 'epi-arrest', label: 'Epinephrine (cardiac arrest)', perKg: 0.01, unit: 'mg', route: 'IV/IO', max: 1, concentration: '0.1 mg/mL', note: 'AHA/AAP PALS cardiac arrest. Repeat every 3–5 minutes.' },
        { key: 'epi-anaph', label: 'Epinephrine (anaphylaxis IM)', perKg: 0.01, unit: 'mg', route: 'IM', max: 0.3, concentration: '1 mg/mL', note: 'Pediatric weight-based regimen shown. RCUK uses separate age bands.' },
        { key: 'defib', label: 'Defibrillation (VF / pulseless VT)', perKg: 2, unit: 'J', route: 'unsynchronised', max: 200, note: 'First shock 2 J/kg; subsequent 4 J/kg (max 10 J/kg or adult dose).' },
        { key: 'cardio', label: 'Synchronised cardioversion (tachyarrhythmia with a pulse)', perKg: 0.5, upperPerKg: 1, repeatPerKg: 2, unit: 'J', route: 'synchronised', note: 'AHA/AAP PALS. Sedate if needed without delaying cardioversion.' },
        { key: 'amio', label: 'Amiodarone', perKg: 5, unit: 'mg', route: 'IV/IO', max: 300, note: 'For refractory VF/pulseless VT. PALS permits up to 3 total doses, with a 150 mg cap on subsequent doses.' },
        { key: 'lido', label: 'Lidocaine', perKg: 1, unit: 'mg', route: 'IV/IO', max: 100, note: 'Alternative to amiodarone.' },
        { key: 'mgso4', label: 'Magnesium sulfate (torsades)', perKg: 40, unit: 'mg', route: 'IV/IO', max: 2000, note: '25–50 mg/kg for torsades de pointes.' },
        { key: 'atropine', label: 'Atropine (vagal bradycardia or primary AV block)', perKg: 0.02, unit: 'mg', route: 'IV/IO', min: 0.1, max: 0.5, note: 'PALS bradycardia with compromise. This 0.1 mg minimum applies to this indication. Intubation premedication has separate dosing.' },
        { key: 'adenosine', label: 'Adenosine (SVT)', perKg: 0.1, unit: 'mg', route: 'IV/IO rapid', max: 6, note: 'First 0.1 mg/kg (max 6 mg); second 0.2 mg/kg (max 12 mg).' },
        { key: 'fluid', label: 'Initial crystalloid aliquot (septic shock)', perKg: 10, unit: 'mL', route: 'IV/IO', note: 'Use balanced isotonic crystalloid when available. Reassess perfusion and signs of fluid overload after each aliquot. Adjust to the clinical setting and shock cause.' },
        { key: 'd10', label: 'Glucose 10% (severe hypoglycemia in children)', perKg: 2, unit: 'mL of D10W', route: 'IV', minAge: NEONATAL_AGE_LIMIT, note: 'RCH pediatric regimen. Recheck glucose and provide ongoing carbohydrate or glucose infusion as indicated. Use a neonatal pathway for newborns.' },
        { key: 'ceftriaxone', label: 'Ceftriaxone (suspected meningitis, age ≥2 months)', perKg: 100, unit: 'mg', route: 'IV', max: 4000, minAge: 2 / 12, note: 'RCH initial regimen for this age group. Follow local resistance guidance and age-specific antibiotic coverage.' },
        { key: 'dex-croup', label: 'Dexamethasone (severe croup)', perKg: 0.6, unit: 'mg', route: 'PO/IM/IV', max: 12, note: 'RCH severe croup single dose. Give indicated nebulized epinephrine and reassess the airway. Follow the separate mild or moderate croup regimen.' }
    ];

    /* Age is in years. Apply row-specific eligibility before doing any arithmetic. */
    function pedsDoses(weightKg, ageYears) {
        const w = num(weightKg);
        const age = num(ageYears);
        const ageProvided = ageYears !== undefined && ageYears !== '';
        if (!validPedsWeight(w) || (ageProvided && (!validPedsAge(age) || age < NEONATAL_AGE_LIMIT))) return [];
        return PEDS_DOSES.filter(d => d.minAge === undefined || age >= d.minAge).map(function (d) {
            const raw = w * d.perKg;
            const capped = Math.min(raw, d.max ?? Infinity);
            const value = Math.max(capped, d.min ?? 0);
            return {
                key: d.key, label: d.label, route: d.route, unit: d.unit, note: d.note,
                value, capped: capped < raw, floored: value > capped, max: d.max, min: d.min,
                concentration: d.concentration,
                upper: d.upperPerKg && w * d.upperPerKg, repeat: d.repeatPerKg && w * d.repeatPerKg
            };
        });
    }

    // ANZCOR 12.2 age bands and oral depth measured at the teeth/gums.
    function pedsAirway(ageYears) {
        const age = num(ageYears);
        if (!validPedsAge(age) || age < NEONATAL_AGE_LIMIT) return [];
        const cuffed = age < 1 ? 3 : age <= 2 ? 3.5 : age / 4 + 3.5;
        const uncuffed = age < 7 / 12 ? 3.5 : age <= 1 ? 4 : age / 4 + 4;
        const rows = [
            { label: 'ETT (cuffed)', unit: 'mm ID', value: Math.round(cuffed * 2) / 2 },
            { label: 'ETT (uncuffed)', unit: 'mm ID', value: Math.round(uncuffed * 2) / 2 }
        ];
        if (age > 1) rows.push({ label: 'Oral ETT depth (age >1 year)', unit: 'cm at teeth/gums', value: age / 2 + 12 });
        return rows;
    }

    function fmtValue(v) {
        if (v >= 100) return String(Math.round(v));
        if (v >= 10) return (Math.round(v * 10) / 10).toString();
        return Number(v.toPrecision(3)).toString();
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
            if (!validPedsWeight(weight)) continue;
            return {
                weight: weight,
                text: parts.filter(function (_, j) { return j < i || j > last; }).join(' ')
            };
        }
        return null;
    }

    const pedsState = { weight: '', age: '', ageUnit: 'years' };

    function pedsCardHtml() {
        return '<section class="st-score st-peds" data-st-peds>' +
            '<div class="st-score-head"><div><h2>Pediatric weight-based doses</h2><p class="st-score-topic">Resuscitation &amp; common drugs</p></div>' +
            '<button type="button" class="st-reset" data-st-peds-reset>Reset</button></div>' +
            '<p class="st-score-summary">Enter a weight to see calculated PALS and common emergency doses. Age gives airway device sizes. Check the indication, concentration and source for each row.</p>' +
            '<div class="st-inputs"><div class="st-peds-inputs">' +
            '<label class="st-field"><span>Measured weight (kg)</span><input type="number" inputmode="decimal" step="any" min="' + MIN_PEDS_WEIGHT + '" max="' + MAX_PEDS_WEIGHT + '" data-st-peds-weight value="' + esc(pedsState.weight) + '" placeholder="e.g. 12"></label>' +
            '<label class="st-field"><span>Age</span><input type="number" inputmode="decimal" step="any" min="0" data-st-peds-age value="' + esc(pedsState.age) + '" placeholder="e.g. 3"></label>' +
            '<label class="st-field"><span>Age unit</span><select data-st-peds-age-unit><option value="years">Years</option><option value="months"' + (pedsState.ageUnit === 'months' ? ' selected' : '') + '>Months</option></select></label>' +
            '</div></div>' +
            '<output class="st-result" data-st-peds-result aria-live="polite"></output>' +
            '<p class="st-caveat"><strong>Use with care:</strong> Doses follow AHA 2025 PALS for resuscitation and common references for the others; always confirm weight, indication and local protocol. This is an educational aid, not an order set.</p>' +
            '</section>';
    }

    function renderPeds(root) {
        const out = root.querySelector('[data-st-peds-result]');
        if (!out) return;
        const w = num(pedsState.weight);
        const age = num(pedsState.age) / (pedsState.ageUnit === 'months' ? 12 : 1);
        const ageEntered = pedsState.age !== '';
        if (ageEntered && !validPedsAge(age)) {
            out.innerHTML = '<p class="st-advice">Check the age and unit. This calculator is for children younger than 18 years.</p>';
            return;
        }
        if (ageEntered && age < NEONATAL_AGE_LIMIT) {
            out.innerHTML = '<p class="st-advice">Use a neonatal protocol for this age. <a href="#pediatric-fever">Young infant assessment</a> · <a href="https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation">Newborn resuscitation guidance for birth transition</a>.</p>';
            return;
        }
        const rows = pedsDoses(w, ageEntered ? age : undefined);
        const dsRows = rows.map(function (r) {
            const amount = r.upper === undefined ? fmtValue(r.value) : 'First ' + fmtValue(r.value) + '–' + fmtValue(r.upper);
            const repeat = r.repeat === undefined ? '' : '<small>Then ' + esc(fmtValue(r.repeat)) + ' J if ineffective</small>';
            const limits = [r.min == null ? '' : 'Min ' + r.min + ' ' + r.unit, r.max == null ? '' : 'Max ' + r.max + ' ' + r.unit].filter(Boolean).join(' · ');
            return '<tr><th scope="row">' + esc(r.label) + '<span class="route-badge ' + routeClass(r.route) + '">' + esc(r.route) + '</span>' +
                (r.concentration ? '<small>Use ' + esc(r.concentration) + '</small>' : '') + '</th>' +
                '<td><span class="dose-amount">' + esc(amount + ' ' + r.unit) + '</span>' + repeat +
                (limits ? '<small class="st-peds-max">' + esc(limits) + '</small>' : '') + '</td></tr>';
        }).join('');
        let airwayHtml = '';
        if (ageEntered) {
            const air = pedsAirway(age);
            airwayHtml = '<h3 class="st-peds-sub">Airway equipment (by age)</h3><p class="st-advice">Starting estimates. Prepare adjacent tube sizes. Confirm placement with waveform capnography and assess depth separately. <a href="https://www.anzcor.org/assets/anzcor-guidelines/guideline-12-2-paediatric-advanced-life-support-pals-255.pdf">ANZCOR 12.2</a>.</p><table class="st-peds-table"><tbody>' +
                air.map(function (r) {
                    return '<tr><th scope="row">' + esc(r.label) + '</th><td>' + esc(fmtValue(r.value)) + ' ' + esc(r.unit) + '</td></tr>';
                }).join('') + '</tbody></table>';
        }
        if (!validPedsWeight(w)) {
            out.innerHTML = '<p class="st-advice">Enter a measured weight in kilograms (' + MIN_PEDS_WEIGHT + '–' + MAX_PEDS_WEIGHT + ') to calculate doses.</p>' + airwayHtml;
            return;
        }
        const ageNotice = !ageEntered ? 'Enter age to check age-restricted rows and airway sizes. Use the neonatal pathway for newborns.' :
            age < 2 / 12 ? 'The ceftriaxone regimen shown for age ≥2 months does not apply. Follow your young-infant meningitis pathway.' : '';
        out.innerHTML = '<p class="st-advice"><strong>Weight ' + esc(String(w)) + ' kg</strong> — calculated doses:</p>' +
            (ageNotice ? '<p class="st-advice">' + esc(ageNotice) + '</p>' : '') +
            '<table class="st-peds-table"><tbody>' + dsRows + '</tbody></table>' + airwayHtml +
            '<details class="st-peds-notes"><summary>Notes, maxima and sources</summary><ul>' +
            rows.map(function (r) { return '<li><strong>' + esc(r.label) + ':</strong> ' + (r.max === undefined ? '' : esc(r.max + ' ' + r.unit + ' max. ')) + esc(r.note) + '</li>'; }).join('') +
            '</ul><p>Sources: <a href="https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/pediatric-advanced-life-support">AHA/AAP PALS</a>, <a href="https://www.rch.org.au/clinicalguide/guideline_index/Hypoglycaemia/">RCH hypoglycemia</a>, <a href="https://www.rch.org.au/clinicalguide/guideline_index/Meningitis_encephalitis/">RCH meningitis</a>, <a href="https://pubmed.ncbi.nlm.nih.gov/38108678/">JTFPP anaphylaxis</a> <a href="https://www.rch.org.au/clinicalguide/guideline_index/Croup_Laryngotracheobronchitis/">RCH croup</a> and <a href="https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-the-management-of-sepsis-and-septic-shock-in">SSC pediatric sepsis (2026)</a>. Confirm against your local formulary.</p></details>';
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
        if (parsedWeight && num(pedsState.weight) !== parsedWeight.weight) {
            pedsState.weight = String(parsedWeight.weight);
            pedsState.age = '';
            pedsState.ageUnit = 'years';
        }
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
                else s[el.dataset.stKey] = el.value;
                renderResult(score);
            };
            el.addEventListener('change', apply);
            if (el.type !== 'checkbox') el.addEventListener('input', apply);
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
        const ageUnit = root.querySelector('[data-st-peds-age-unit]');
        if (wInput) wInput.addEventListener('input', function () {
            const ageInput = root.querySelector('[data-st-peds-age]');
            if (pedsState.weight && num(this.value) !== num(pedsState.weight)) {
                pedsState.age = '';
                if (ageInput) ageInput.value = '';
            }
            pedsState.weight = this.validity.badInput ? 'invalid' : this.value;
            renderPeds(root);
        });
        if (aInput) aInput.addEventListener('input', function () {
            pedsState.age = this.validity.badInput ? 'invalid' : this.value;
            renderPeds(root);
        });
        if (ageUnit) ageUnit.addEventListener('change', function () {
            pedsState.ageUnit = this.value;
            renderPeds(root);
        });
        const pedsReset = root.querySelector('[data-st-peds-reset]');
        if (pedsReset) pedsReset.addEventListener('click', function () {
            pedsState.weight = '';
            pedsState.age = '';
            pedsState.ageUnit = 'years';
            const filterText = filterInput ? filterInput.value : '';
            calculatorsScreen(root, parseWeightFilter(filterText)?.text ?? filterText, facetKey);
        });
        if (wInput) renderPeds(root);
        mountCprCard(root);
        SCORES.forEach(renderResult);
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

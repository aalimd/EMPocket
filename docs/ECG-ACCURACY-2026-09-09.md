# ECG accuracy and waveform review — 9 September 2026

The runtime contains **47 teaching examples and 143 guided findings**: eight full 12-leads, 32 calibrated focused strips, six calibrated focused panels, and one paper-scaled voltage comparison. All are synthetic. Numerical calibration and software checks do not constitute independent clinical validation or turn these into patient recordings.

## Corrections

- Replaced nine uncalibrated diagnosis sketches with continuous calibrated waveforms: diffuse ST depression/aVR elevation, hypokalemia, hypothermia, Brugada type 1, RV strain, pericarditis, sodium-channel blockade, sinus pre-excitation and electrical alternans. The guide and its enlarged viewer use the same new drawings and finding coordinates as Explorer.
- Added pre-excited AF, early repolarization, hypocalcemia and hypercalcemia. Pre-excited AF has irregular 220–390 ms intervals, variable QRS width and no organized P train. Sinus WPW remains a separate example.
- Replaced the Sgarbossa model's stretched narrow QRS with broad notched lateral LBBB morphology; preserved concordant and proportional discordant J-point criteria.
- Added V7 and V9 to the posterior panel alongside V8. Displayed posterior elevations are 1.0, 0.8 and 0.6 mm. The finding explanation distinguishes the usual 0.5 mm posterior threshold and greater specificity of 1 mm in men under 40.
- Made focused-strip and focused-panel highlights follow the actual voltage extrema within each time window. Narrow findings now show the relevant segment rather than the full height of a lead lane. Rhythm findings deliberately span a longer recording.
- Explicitly distinguished QT from QU, TP baseline from displaced PR, Brugada pattern from syndrome, sinus pre-excitation from pre-excited AF, and electrical capture from mechanical circulation. Retained clinical context for PEA and the limits of classifying 2:1 AV block.
- Corrected categorical wording suggesting alternans proves tamponade or that early-repolarization features exclude ACS. Sustained polymorphic VT wording specifies unsynchronized shock. Existing pre-excited AF drug cautions remain explicit.
- Every Explorer example now has an evidence link. Updated the offline release to `20260909-ecg2`, cache `v151`.

## Waveform measurements checked

| Pattern | Signal-level checks |
|---|---|
| Brugada | V1/V2 J height 0.30/0.25 mV; coved decline into negative T |
| Hypokalemia | ST depression, small T; T end at 380 ms, separate U peak at 500 ms and end at 620 ms |
| Pericarditis | PR −0.04 mV in positive leads and +0.04 mV in aVR against the TP baseline; opposite ST direction |
| WPW | PR 100 ms to delta onset; slurred first 40 ms; full QRS 140 ms |
| Sodium-channel blockade | QRS 160 ms; aVR terminal R 0.4 mV following S −0.5 mV, R/S 0.8 |
| Hypothermia | Sinus rate 40/min, PR 240 ms, QRS 120 ms, QT 560 ms, rounded post-QRS J hump |
| Calcium examples | At 60/min, QT/QTc 540 ms versus 280 ms, with different ST duration |
| Electrical alternans | Regular 110/min timing with alternating QRS and P/T amplitude |
| Diffuse ischemia and RV strain | Displayed simultaneous frontal leads preserve their voltage identities throughout the signal |
| Sgarbossa and posterior | Notched lateral depolarization, retained criterion polarity/proportion, complete V7–V9 distribution |

These values describe the authored examples; they are not universal diagnostic values or estimates of a patient's electrolyte concentration.

## Evidence

Targeted source review covered the clinical distinctions and measurements above. Sources support teaching concepts, not certification of the generated waveforms.

- [AHA 2025 adult ALS](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support): rhythm and arrest context, including sustained polymorphic VT.
- [2023 ACC/AHA/ACCP/HRS AF guideline](https://www.jacc.org/doi/10.1016/j.jacc.2023.08.017): pre-excited AF and contraindicated AV-nodal blockers.
- [AHA/ACCF/HRS repolarization recommendations](https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191096): ST, T, U and QT interpretation; [chamber hypertrophy recommendations](https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191097): voltage/chamber limitations.
- [ESC Brugada review](https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-19/brugada-syndrome-and-sports-activity-from-history-to-risk-stratification/): type 1 morphology and right-precordial lead placement.
- [ESC pericarditis review](https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-15/Diagnosis-of-acute-pericarditis/): widespread ST/PR findings in clinical context.
- [Early repolarization consensus](https://www.jacc.org/doi/10.1016/j.jacc.2015.05.033): inferolateral J-notch/slur interpretation.
- [Prospective hypothermia study](https://pubmed.ncbi.nlm.nih.gov/10569384/): J-wave and temperature associations; [calcium ECG case report](https://pmc.ncbi.nlm.nih.gov/articles/PMC3951043/): ST/QT changes.
- [AHA 2025 special circumstances](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation) and [Liebelt et al., prospective TCA ECG study](https://pubmed.ncbi.nlm.nih.gov/7618783/): toxic ECG interpretation and aVR risk markers.
- [ESC PE guideline](https://academic.oup.com/eurheartj/article/41/4/543/5556136): RV-strain features and limits; [tamponade ECG cohort](https://pubmed.ncbi.nlm.nih.gov/31881163/): limitations of alternans/voltage as diagnostic tests.
- [Fifth Universal Definition of MI (2026)](https://www.jacc.org/doi/10.1016/j.jacc.2026.07.025) and [ESC ACS guideline](https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/): retained ischemia framework and the need to combine ECG with clinical evidence.

## Verification

- `node --test tests/*.test.js`: **58 test groups passed**. New regression coverage tests measured morphology, all-case source coverage, guide/Explorer consistency, lead identities and highlight bounds. Existing tests cover the remaining rhythms, intervals, ischemia models, finding targets and offline asset inventory.
- Browser Explorer fixture: **3,078 assertions, zero failures at both 320 and 1280 px**.
- Guide viewer fixture: **9,445 assertions; all 27 figures passed**, including each selectable finding and enlarged-view controls.
- App browser fixture: **230 checks, zero failures**, including routes at 320, 390, 768 and 1280 px and SVG text bounds.
- The general audit fixture uses a temporary loopback-only static server because its function-extraction harness requires evaluation that the normal Apache CSP correctly blocks. Production CSP was not changed.

## Coverage inventory

This inventories every currently offered example and its selectable findings. It is not a claim that every possible ECG diagnosis is covered.

| Example | Display format | Findings |
|---|---|---:|
| Normal sinus rhythm | Full 12-lead ECG | 11 |
| Atrial fibrillation | Full 12-lead ECG | 3 |
| Sinus bradycardia | Focused rhythm strip | 3 |
| Sinus tachycardia | Focused rhythm strip | 3 |
| Atrial flutter · 2:1 conduction | Focused rhythm strip | 3 |
| Regular narrow-complex SVT | Focused rhythm strip | 3 |
| Junctional escape rhythm | Focused rhythm strip | 2 |
| Monomorphic ventricular tachycardia | Focused ECG panel | 2 |
| Pre-excited atrial fibrillation | Focused rhythm strip | 3 |
| Inferior STEMI pattern | Full 12-lead ECG | 3 |
| Wellens pattern · Type A | Full 12-lead ECG | 3 |
| Wellens pattern · Type B | Full 12-lead ECG | 3 |
| de Winter pattern | Full 12-lead ECG | 3 |
| Anterior STEMI pattern | Full 12-lead ECG | 3 |
| Lateral STEMI pattern | Full 12-lead ECG | 3 |
| Hyperacute T-wave comparison | Focused ECG panel | 3 |
| Modified Sgarbossa patterns | Focused ECG panel | 3 |
| Posterior occlusion pattern | Focused ECG panel | 3 |
| Diffuse ST depression with aVR elevation | Focused rhythm strip | 3 |
| First-degree AV block | Focused rhythm strip | 2 |
| Mobitz I · Wenckebach | Focused rhythm strip | 3 |
| Mobitz II AV block | Focused rhythm strip | 3 |
| 2:1 AV block | Focused rhythm strip | 3 |
| Right bundle branch block | Focused rhythm strip | 3 |
| Left bundle branch block | Focused rhythm strip | 3 |
| Ventricular paced rhythm | Focused rhythm strip | 3 |
| Complete AV block | Focused ECG panel | 2 |
| Ventricular pre-excitation · WPW pattern | Focused rhythm strip | 3 |
| Prolonged QT | Focused rhythm strip | 3 |
| Premature ventricular complex | Focused rhythm strip | 3 |
| Premature atrial complex | Focused rhythm strip | 3 |
| Ventricular fibrillation | Focused rhythm strip | 3 |
| Torsades de pointes pattern | Focused rhythm strip | 3 |
| Asystole · verify the recording | Focused rhythm strip | 3 |
| Pulseless electrical activity · clinical case | Focused rhythm strip | 3 |
| Hyperkalemia · three appearances | Focused ECG panel | 3 |
| Hypokalemia pattern | Focused rhythm strip | 3 |
| Hypothermia · J wave | Focused rhythm strip | 3 |
| Sodium-channel blockade pattern | Focused rhythm strip | 3 |
| Hypocalcemia · prolonged ST/QT | Focused rhythm strip | 2 |
| Hypercalcemia · short ST/QT | Focused rhythm strip | 2 |
| Brugada type 1 pattern | Focused rhythm strip | 3 |
| Right ventricular strain pattern | Focused rhythm strip | 3 |
| Pericarditis pattern | Focused rhythm strip | 3 |
| Electrical alternans | Focused rhythm strip | 3 |
| LVH voltage and low-voltage comparison | Paper-scaled teaching diagram | 3 |
| Early repolarization pattern | Focused rhythm strip | 3 |

## Remaining limits

The improvements close the identified numerical, explanatory and high-priority coverage gaps in the current curriculum. Synthetic waveforms still simplify biological variation and recording artifacts. Full diagnostic lead sets are explicitly distinguished from selected-lead teaching examples; the LVH/low-voltage comparison remains a measurement diagram. Hyperkalemia's severe sine pattern and polymorphic arrest strips remain idealized illustrations, not realistic models of all presentations or predictable disease progression. The atlas is not exhaustive (for example fascicular blocks, multifocal atrial tachycardia and device malfunction require further authored cases).

No patient ECGs were imported. Independent review by an ECG specialist and licensed, de-identified patient recordings remain necessary before describing this library as clinically validated. Physical-device printing, production deployment and device-level offline upgrades were not performed in this review.

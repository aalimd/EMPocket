# Seven-step ECG teaching review — 10 October 2026

Scope: the seven `ECG_DATA.steps`, their seven displayed figure entries (plus the normal 12-lead companion), all 28 selectable wave explanations, and the linked focused viewer lessons. This is an educational content review against published sources, not independent clinical certification or validation against patient ECGs. The drawings remain teaching simulations/schematics.

| Step | Findings and changes |
| --- | --- |
| 1: Calibration, leads, rate | Added the TP/PR distinction, J-point measurement, voltage units and unreliable-baseline handling. Expanded chest electrode positions and 50 mm/s rate calculation. Removed the implication that every compensatory sinus tachycardia needs cardioversion. |
| 2: Rhythm and axis | Added P–P/R–R/conduction inspection and hidden 2:1 flutter. Explained net QRS polarity and the limitation of near-equiphasic leads. Retained lead-II confirmation in the leftward quadrant. |
| 3: Intervals | Added exact PR/QRS/QT endpoints, simultaneous-lead QRS duration, T-end tangent method, U-wave handling and a QTc calculation with units. Distinguished AV dissociation from proof of complete AV block. |
| 4: Voltage | Distinguished baseline-to-peak R/S measurement from peak-to-peak low voltage. Clarified half gain and choice of V5/V6. Removed categorical claims that changing strain proves ACS or absence of reciprocal depression excludes occlusion. |
| 5: Ischemia map | Retained verified Fifth UDMI Table 5 cutoffs, including its Q-wave definition. Added same-lead reference, J-point depression, lead/measurement reporting and a single-lead counterexample. Clarified that Q waves do not date infarction. |
| 6: High-risk patterns | Defined concordance/discordance and gave the same-lead STE/S calculation. Clarified that hyperacute T waves need no universal height or T>R cutoff. Retained urgent escalation for compatible de Winter, Wellens and posterior presentations, with the distinction between reperfusion and ongoing occlusion. |
| 7: Mimics | Explained whole-tracing/context assessment, ECG limitations, the historical PR-referenced V6 ST/T adjunct, TCA-specific risk thresholds, and echo assessment for suspected tamponade. Scooped digoxin ST alone does not justify Fab. |

Source links are now displayed within each step. The baseline lesson also appears directly in the Step 1 ST inspector and the inferior STEMI viewer; learners do not need to find Step 5 to learn how to measure it.

## Source checks

- [AHA/ACCF/HRS Part III](https://doi.org/10.1161/CIRCULATIONAHA.108.191095): conduction and axis.
- [AHA/ACCF/HRS Part IV](https://doi.org/10.1161/CIRCULATIONAHA.108.191096): ST/T reference and QT measurement.
- [AHA/ACCF/HRS Part V](https://doi.org/10.1161/CIRCULATIONAHA.108.191097): chamber-pattern criteria and limitations.
- [Fourth UDMI](https://doi.org/10.1161/CIR.0000000000000617): TP comparison when PR is displaced; supplemental leads.
- [Fifth UDMI, Table 5 and section 13](https://doi.org/10.1093/eurheartj/ehag101): current ischemic/Q-wave criteria. Its Q-wave definition was checked in the publisher text and retained, rather than replaced with an older definition.
- [2025 ACS guideline](https://doi.org/10.1016/j.jacc.2024.11.009), [2023 ESC ACS guideline](https://academic.oup.com/eurheartj/article/44/38/3720/7243210): ischemia assessment and reperfusion context.
- [Modified Sgarbossa original study](https://pubmed.ncbi.nlm.nih.gov/22939607/): proportional discordance.
- [ESC pericarditis assessment](https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-15/Diagnosis-of-acute-pericarditis/): supportive ECG clues and differential diagnosis.
- [2025 AHA special circumstances](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-and-pediatric-special-circumstances-of-resuscitation/): electrolyte/toxicology/temperature context.

## Local verification

Browser checks used local Apache at `http://localhost/EM-CPs/#ecg`, with Chromium viewports of 1280, 390 and 320 px. All seven sections opened, all 28 wave selectors displayed explanations, each step displayed source links, all seven enlarged viewers opened and displayed their finding explanations, the Step 1 ST inspector and QRS/ST viewer finding displayed the TP/PR lesson, and no page-level horizontal overflow or JavaScript exceptions occurred. The mobile ST explanation was visually inspected. Service workers were blocked in these isolated UI checks; they are not evidence of offline browser operation or physical-device testing. Cache/relative URL isolation is covered by the repository tests.

`node --test tests/*.test.js`: final run passed all 220 tests (no skips). An earlier run had a transient print-color assertion; the focused recheck and final full run passed. A separate local comparison of HEAD and the working tree produced identical expected print colors; no print styling was changed. `git diff --check` passed.

Release token: `20261010-ecg-teaching-v43`; scoped worker cache: `v241`. Free progress and preference keys are unchanged.

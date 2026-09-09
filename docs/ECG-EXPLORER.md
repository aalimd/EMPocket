> Current waveform review: [9 September accuracy update](ECG-ACCURACY-2026-09-09.md) — 47 examples, 143 findings, nine calibrated replacements. Counts and limitations below describe the earlier snapshot.

# ECG Explorer — 7 September 2026

The main navigation and sidebar now open `#ecg-explorer`. The existing ECG guide and Step 1 full-paper reference remain available.

## Expanded curriculum

The Explorer now contains **43 examples and 125 selectable findings**, grouped in the case selector. Previous/next controls follow that same group order.

| Group | Examples |
|---|---|
| Rhythms (8) | Normal sinus, AF, sinus bradycardia, sinus tachycardia, 2:1 flutter, regular narrow-complex SVT, junctional escape, monomorphic VT |
| Ischemia (10) | Inferior, anterior and lateral STEMI patterns; Wellens A/B; de Winter; hyperacute T comparison; modified Sgarbossa; posterior occlusion; diffuse depression with aVR elevation |
| Conduction (9) | First-degree AV block, Mobitz I, Mobitz II, 2:1 block, complete AV block, RBBB, LBBB, ventricular pacing, WPW pre-excitation |
| Intervals and ectopy (3) | Prolonged QT, PVC, PAC |
| Arrest rhythms (4) | VF, torsades, asystole, PEA clinical scenario |
| Metabolic and toxic (4) | Hyperkalemia, hypokalemia, hypothermia, sodium-channel blockade |
| Other important patterns (5) | Brugada type 1, RV strain, pericarditis, electrical alternans, LVH/low-voltage comparison |

Eight examples use full twelve-lead paper. Nineteen new rhythm/conduction examples use calibrated selected-lead strips; sixteen reuse the existing reviewed focused panels or explicitly labeled schematics. Format and calibration are displayed beside each example. These are teaching examples, not an exhaustive diagnostic atlas or patient recordings.

Every new strip is sampled from its own timing and morphology specification. P/QRS timing produces the displayed AV relationships; highlights use the same millisecond coordinates. The anterior/lateral full-paper models preserve limb-lead voltage identities. PEA includes an absent-pulse clinical stem even in practice mode because the waveform alone cannot diagnose it. A 2:1 block is not assigned a Mobitz subtype; a torsades example includes prolonged QT before the ventricular run.

`assets/ecg-curriculum.js` contains the expanded case content and focused renderers. `assets/ecg-explorer.js` retains the original examples, navigation, practice state and view handling. Each SVG instance receives independent IDs, including reused panels. Practice mode retains anatomical lead labels and removes diagnostic labels and captions from the new drawings until reveal.

### Evidence checked for the expansion

- [AHA 2025 adult advanced life support](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support): arrest and peri-arrest rhythm context; polymorphic VT and shock synchronization.
- [ESC acute coronary syndromes guideline](https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/): ischemic distributions and interpretation context.
- [AV block reference](https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrioventricular-block): PR behavior, dropped beats and 2:1 classification limits.
- [Bundle-branch block reference](https://www.msdmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/bundle-branch-block-and-fascicular-block): focused V1/V6 morphology.
- [Atrial flutter reference](https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-flutter) and [torsades reference](https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/torsades-de-pointes-ventricular-tachycardia): atrial activity and QT association.

Existing library examples retain their previously reviewed explanations and guide links. Sources support the teaching concepts; the synthetic drawings are not independently clinically certified.

### Expansion verification

- 43 automated test groups passed, including all 43 cases, 125 finding sets, waveform bounds, AV timing, ectopy timing, full-paper limb identities and offline assets.
- 2,702 interaction assertions passed at both 320 px and 1280 px. Every case was exercised through selection, each finding, focus, highlights, enlarged view, practice reveal, previous/next and answer reset.
- New rhythm strips and the two new full-paper examples were visually reviewed.
- 230 application route/layout checks and 7,084 existing viewer assertions passed (27/27 existing figures).

## Original teaching experience (preserved)

- Six synthetic full-paper examples: normal sinus rhythm, atrial fibrillation, inferior STEMI pattern, Wellens A, Wellens B and de Winter pattern. Each uses its matching existing waveform model, with twelve leads and a long lead-II rhythm strip.
- A current diagnosis panel pairs each selectable finding with an explanation and red highlights on the corresponding waveform. There are 26 findings across the six examples. The normal reference retains its original four findings and adds seven, for eleven total.
- Fit, 150%, 200% and 300% zoom, a focus-finding action, scrolling and an enlarged dialog support detailed inspection.
- Practice mode hides diagnosis labels, interpretations and highlights until reveal. The learner's answer stays in memory only. Changing examples resets the answer and conceals the next diagnosis.

All 27 existing library ECGs use pale pink ECG paper. Calibrated figures retain their original waveform-to-grid geometry. The nine uncalibrated schematics explicitly label their new grid as decorative: their boxes must not be used for measurements.

## Implementation

`assets/ecg-explorer.js` owns the section and its state. It reuses the engine's full-paper renderer and existing diagnosis models without adding or replacing ECG library entries. Focus targets are derived from actual lead segments in the sequential three-by-four layout. SVG IDs are unique across inline and enlarged views. Mount cleanup prevents duplicated event handlers; dialog closure restores focus and route changes close the dialog.

The full-paper renderer rejects models that only support focused leads rather than fabricating a twelve-lead presentation. VT and complete AV block remain in their existing focused viewers. The examples are modeled teaching tracings, not patient recordings; no treatment recommendations were added by this feature.

## Verification

- `node --test tests/*.test.js`: 39 test groups passed, including paper backgrounds, unchanged normal waveforms/findings, distinct diagnosis traces, waveform lane bounds, concealed practice SVGs and offline asset coverage.
- `dev/explorer.html`: 420 browser interaction assertions passed at both 320 px and 1280 px widths.
- `dev/audit.html`: 230 route, layout and existing browser checks passed.
- Existing ECG viewers: 7,084 interaction assertions passed across all 27 figures, including guided findings and red circles.
- All six full-paper examples were visually inspected, along with the actual application on desktop and mobile.

Local fixtures omit onboarding only in their isolated test DOM; they do not accept or persist an agreement. Keep `dev/`, `tests/` and audit documents out of production uploads.

The September learning update adds persistent case completion and finding-level review, keyboard/touch location practice, and synchronized normal comparison for all 47 cases. See [the implementation and verification notes](ECG-LEARNING-2026-09-09.md).

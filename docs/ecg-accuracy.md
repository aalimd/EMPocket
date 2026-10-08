# ECG accuracy and curriculum update — 7 October 2026

The free app now includes 69 synthetic teaching examples: 22 standard full
12-lead pages, one full 12-lead page with supplemental V3R/V4R, 39 focused
rhythm strips, six focused panels and one paper-scaled teaching diagram.
The clinical recording library is separate: 12 original PTB-XL recordings.

## Signal changes

- de Winter ST/T limb components now obey Einthoven and Goldberger identities
  throughout the signal, including the illustrated aVR elevation.
- Hypokalemia, hypothermia, WPW, alternans and early repolarization now use
  independent selected chest-lead morphologies with shared beat timing.
- Full models derive four limb leads from two independent frontal signals.
  Arm-electrode reversal transforms the electrode views rather than assigning
  unrelated lead shapes.
- Printed gain, calibration pulses, waveform height, finding regions and the
  normal comparator agree. The full LVH example uses 5 mm/mV.
- The normal reference distinguishes its nominal Gaussian timing parameter
  from the visible T endpoint measured by the tangent method. This demonstration
  is restricted to the normal reference; it is not a clinical QT detector.

## Added coverage

| Area | New examples |
|---|---|
| Axis/conduction | Left, right and extreme axis; LAFB; LPFB |
| Rhythms | Respiratory sinus arrhythmia; sinus pause; MAT; variable-conduction flutter |
| Ischemia | Inferior/right ventricular pattern with right-sided leads; regional ST depression/T inversion; inferior Q-wave pattern |
| Technical pitfalls | Arm-electrode reversal; illustrative high V1/V2 placement; motion artifact with a simultaneous clean lead |
| Pacing | Failure to capture; undersensing |
| Voltage/chambers | Full LVH, low voltage, RVH, left/right atrial abnormality patterns |

All new examples resolve to existing seven-step guide sections. Existing case
IDs and free progress/preference keys are retained.

## Clinical recordings and provenance

The original four records (3, 7, 4117, 4401) remain. Added records:
172 (CRBBB with LAFB), 256 (CLBBB with PVC), 41 (LAFB), 102 (first-degree
AV block with an additional lower-likelihood statement), 30 (LVH),
257 (inferior infarction pattern with coexisting statements), 177
(anteroseptal infarction pattern), and 144 (pacemaker rhythm).

Source: [PTB-XL 1.0.3](https://physionet.org/content/ptb-xl/1.0.3/),
CC BY 4.0; attribution and licence are available in the app.
Original 500 Hz, 10-second, 12-lead samples are retained without filtering or
resampling. WFDB headers were checked for format, sample count and gain;
each local array reconstructs the source binary SHA-256 stored with the record.
No patient demographics are shipped.

The viewer offers a standard sequential 3×4 page and continuous 10-second
lead-II strip, or a selected 4-second lead window. It uses 25 mm/s and selectable
10/5 mm/mV gain, with both small and large grid boxes and a calibrated pulse.
The full page remains readable by scrolling inside its frame on narrow screens.

All coexisting source statements are revealed together. A zero source likelihood
is stored as unspecified, not as absence. Dataset infarction labels do not
establish acute infarction or timing.

## Validation and limits

Signal tests cover limb identities, lead independence, conduction/atrial timing,
visible pacing stimuli and missed capture, voltage thresholds, supplemental J
amplitudes, measured finding regions, gain and QT endpoint behavior. Recording
tests reconstruct all source hashes and check rendered sample times/voltages.

The complete suite passed 175 tests during implementation. Subsequent targeted
checks were repeated after refinements, including a new guide-link regression.
Local browser review covered all 22 added examples, real recordings, the full/
single-lead controls, gain, comparison, enlargement and a 390-pixel viewport.
There was no live deployment or physical-device test.

Synthetic figures remain explanatory models, not patient recordings or clinically
certified tracings. Independent clinician review of the complete curriculum
remains appropriate before describing it as clinically validated. Further
breadth can include AIVR, polymorphic VT with normal QT, pediatric ECGs and
well-documented serial patient recordings.

## References

- [AHA/ACC/HRS diagnostic statements](https://www.jacc.org/doi/10.1016/j.jacc.2007.01.025)
- [Intraventricular conduction](https://www.jacc.org/doi/10.1016/j.jacc.2008.12.013)
- [Chamber hypertrophy](https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191097)
- [ESC supraventricular tachycardia](https://academic.oup.com/eurheartj/article/41/5/655/5556821)
- [ESC pacing](https://academic.oup.com/eurheartj/article/42/35/3427/6358547)
- [ESC QT measurement](https://www.escardio.org/communities/councils/genomics/scientific-documents-and-publications/cardiogenomics-insights/volume-9/how-to-measure-the-qt-interval/)

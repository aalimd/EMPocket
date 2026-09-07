# ECG interaction audit — 7 September 2026

## Findings and fixes

The earlier rendering audit did not exercise every interactive control. Only ten modeled diagnoses had guided findings in the enlarged viewer. The other figures often provided zoom/labels only. Several existing SVG hotspots used translated coordinates, and selected findings could disappear when lead or duration settings excluded them.

This update gives all 27 library entries their own guided viewer, with 76 selectable explanations. Every ECG card has **Explain this ECG** alongside Enlarge. Both open the ECG's own title, explanation buttons, and visible red outlines for the selected feature. Highlights can be hidden and restored.

- Added guided targets to the method diagrams, nine morphology schematics, criteria map and full normal 12-lead.
- Made the step-seven toxic/metabolic panel use the complete hyperkalemia workbench, including its modeled normal reference.
- Aligned static targets with SVG translations; compute inline wave circles in the root SVG coordinate system so focus crops and scaling stay aligned.
- Changed dynamic findings from whole-height dashed rectangles to red outlines around representative waveform segments. Long strips mark representative examples, not every beat.
- Preserved matching explanations when selecting a lead. Selecting VT capture/fusion opens the necessary ten-second window; shortening it selects a finding actually present in the shorter strip.
- Prevented the normal-comparison state from suppressing highlights when moving to a static diagram.
- Put explanations above the ECG paper and kept scrolling confined to the paper when locating a finding.
- Added keyboard-operable static targets, restored focus after selection/close, removed inactive legacy hotspots from enlarged figures and included the settings disclosure in the modal focus loop.
- Restored red circles for inline wave buttons, including diagrams whose old hotspot outline was intentionally invisible.

## Verification

`node --test tests/*.test.js`: 34 passing test groups. The local browser audit exercises all 27 figures and 76 explanations, every offered lead, speed/gain/window combination, zoom, normal/reference toggles, labels, artifact, numeric calipers and tap-coordinate conversion, static keyboard targets, Escape/focus restoration, ECG switching, actual application entry buttons and inline wave-circle toggles.

The final interaction run has 7,084 assertions at both 320-pixel phone width and desktop width. Earlier iterations also ran at 390 pixels. Visual contact sheets were inspected for every library entry; offset method-diagram targets were corrected and inspected again. The baseline browser layout/sanitizer audit remains available separately.

These checks verify application behavior and alignment in the tested browser. They do not certify clinical validity, every browser/device combination, or physical touch-device drag behavior. Schematics intentionally offer guided highlights and zoom rather than unsupported measurement or speed/gain controls.

## Inventory

| ECG ID | Explanations | Viewer |
|---|---:|---|
| `rate-calibration` | 5 | Guided SVG + zoom |
| `rhythm-axis` | 4 | Guided SVG + zoom |
| `intervals` | 4 | Guided SVG + zoom |
| `hypertrophy` | 3 | Guided SVG + zoom |
| `omi-equivalents` | 4 | Guided SVG + zoom |
| `toxic-metabolic-mimics` | 3 | Modeled tracing + measurement tools |
| `stemi-criteria` | 2 | Modeled tracing + measurement tools |
| `hyperacute-t` | 3 | Modeled tracing + measurement tools |
| `wellens` | 2 | Modeled tracing + measurement tools |
| `dewinter` | 3 | Modeled tracing + measurement tools |
| `sgarbossa` | 3 | Modeled tracing + measurement tools |
| `posterior-omi` | 3 | Modeled tracing + measurement tools |
| `avr-lmca` | 2 | Guided SVG + zoom |
| `hyperkalemia` | 3 | Modeled tracing + measurement tools |
| `hypokalemia` | 2 | Guided SVG + zoom |
| `hypothermia` | 2 | Guided SVG + zoom |
| `brugada` | 2 | Guided SVG + zoom |
| `pe-strain` | 3 | Guided SVG + zoom |
| `pericarditis-ber` | 2 | Guided SVG + zoom |
| `tca-toxicity` | 2 | Guided SVG + zoom |
| `wpw` | 2 | Guided SVG + zoom |
| `vt-vs-svt` | 2 | Modeled tracing + measurement tools |
| `complete-heart-block` | 2 | Modeled tracing + measurement tools |
| `electrical-alternans` | 2 | Guided SVG + zoom |
| `ischemia-map` | 5 | Guided SVG + zoom |
| `atrial-fibrillation` | 2 | Modeled tracing + measurement tools |
| `normal-12lead` | 4 | Guided SVG + zoom |

## Reproduce

Serve the repository locally and open `dev/audit.html`. Choose **Run all ECG interactions**. `dev/ecg-highlight-gallery.html?page=0` through `page=8` shows combined highlight targets for visual QA; the actual viewer shows one selected explanation at a time. Keep `dev/` and `tests/` out of production uploads.

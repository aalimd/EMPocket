# ECG marker placement audit — 9 September 2026

Scope: all 27 guide figures and all 47 Explorer cases (143 findings), including static region targets, modeled signal targets and inline wave selectors. This is a software geometry and interaction audit; it is not independent clinical certification of the synthetic ECGs.

## Corrections

- Normal 12-lead R-wave progression previously marked V1 and V4 only despite asking the learner to compare V1–V6. It now marks all six precordial cells, in their actual row/column positions.
- The calibration PR selector previously circled only the gap after P. Its visible region now includes P onset through QRS onset. The original small invisible hit area is preserved so it does not intercept the neighboring P and QRS controls.
- The interval-method QT target started below the R peak. Both inline and enlarged targets now include the QRS peak through the T endpoint.
- Dynamic viewer and Explorer regions now share one signal-derived placement function, eliminating separate calculations and their inconsistent horizontal padding.
- The visual QA gallery now shows one selected finding per panel and loads the current curriculum, rather than superimposing every finding's circles onto one obsolete drawing.

## Verification

- `node --test tests/*.test.js`: 64 passing tests, zero failures or skips.
- Exhaustive Explorer target checks: every one of 143 findings has nonempty, finite, positive, unique regions inside its drawing.
- Dynamic marker checks cover 25/50 mm/s, 5/10/20 mm/mV and 1/3/10-second windows. Markers stay in the named lead rows; unrelated rows receive no markers. Short windows may have no complete example of a requested segment; the existing capture/fusion control selects the required long strip.
- Cross-view tests compare every shared dynamic finding's exact target coordinates.
- Browser guide audit: 10,987 assertions, all 27 figures pass at desktop and mobile widths. Checks include each finding, inline coordinate transforms, crop selection, hide/restore, keyboard use, zoom, lead selection, gain/speed, measurement controls and closing/reopening.
- Browser Explorer audit: 3,078 assertions with zero failures at each of 1280 and 320 pixels, covering every case and finding, detail focus, practice/reveal and enlargement.

Circles indicate teaching regions. Interval brackets indicate measurement spans; the A/B calipers perform measurements. Separate circles for distinct leads or separate diagnostic features are intentional, while duplicate outlines over the same selected inline region remain removed.

Runtime asset token: `20260909-ecg-markers1`; offline cache: `v153`.

## Calibration QT follow-up

The user's screenshot exposed a semantic miss in the earlier audit: calibration QT still circled its measurement label. Corrected it to one QRS–T ellipse in both inline and enlarged views; tagged the missing QRS-onset boundary as QT so both ends remain visible when selected. The invisible label hit target remains usable. Added an actual ellipse-containment regression for QRS onset, R/S extrema, T peak and T end, plus checks for both boundary lines and exclusion of the text label. Visually verified in the local application preview. Follow-up release: `20260909-ecg-qt1`, cache `v154`.

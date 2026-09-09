# ECG selection and control consolidation — 9 September 2026

The overlapping rectangle and ellipse were two visual treatments of one selected region. The rectangle was the SVG hotspot's hover/focus/selected styling; the ellipse was the app's selection marker. The hotspot still supplies the click target, keyboard focus and accessible name, but is now transparent in every state. The ellipse is the only visible selection outline. Separate findings in separate leads can still have separate circles, and A/B measurement calipers remain available because they measure the distance between two points.

## Changes

- One visible marker per selected inline region for hover, click and keyboard selection. Enlarged-view keyboard focus uses the same finding ellipse instead of adding a rectangular outline. Forced-colors mode retains a visible selection marker.
- Replaced the identical “Explain this ECG” and “Enlarge” actions with one **Explore ECG** action on each figure. It opens the existing complete viewer with findings, zoom, normal comparison and measurement tools where supported.
- Preserve the selected wave when opening its matching viewer finding. Closing restores focus to the originating button.
- Clear previous marker, hotspot state and button state together, including when moving to an explanation without a corresponding hotspot.
- Use all four transformed hotspot corners when calculating a marker's SVG bounds.
- Preserve labels, focus/crop, waveform explanations, normal comparison, speed/gain/duration, zoom, calipers and practice controls. These have distinct functions and are not redundant actions.
- Release: `20260909-ecg-controls1`, service-worker cache `v152`.

## Verification

- `node --test tests/*.test.js`: 59 groups passed, including a renderer regression that requires exactly one viewer entry point per ECG.
- Extended the browser interaction audit to check transparent hit targets, a single ellipse, accessibility state, mouse/keyboard activation, deselection, selected-finding handoff and focus restoration.
- Desktop and mobile (1280 and 320 px): 10,339 interaction assertions each; all 27 ECGs passed, zero failures.
- Application routes and SVG layout: 230 checks passed at the fixture's 320, 390, 768 and 1280 px widths.
- Visually reproduced the supplied calibration selection: one red ellipse, no rectangle, and one Explore ECG action.

The review changes ECG interaction behavior and presentation; it does not change ECG waveform or clinical content.

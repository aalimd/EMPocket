# ECG learning experience — 9 September 2026

## Delivered changes

1. **More room for the ECG.** Reduced Explorer heading and page padding, simplified the control bar, and widened the workspace. Explanations remain beside the paper on larger screens and flow below it on phones. The guide's figure borders and spacing are lighter.
2. **Connected finding selection.** Existing single-region highlights and detail previews remain linked to the finding list. Desktop explanations stay visible within the findings panel; selections have a short fade, and scrolling honors reduced-motion preferences.
3. **Practice with actionable feedback.** Interpretation practice retains the learner's answer until they change cases and explicitly asks them to compare it with the authored explanation. It does not pretend to grade free text. “Practice locating this finding” hides the circles and detail answer, asks the learner to tap a region, and provides correct/outside-region feedback. Arrow keys move a visible cursor; Shift makes smaller movements; Enter checks it. Revealing the location restores the explanation, circles and keyboard focus.
4. **Normal comparison for all 47 cases.** “Compare normal” opens a normal sinus model using the same lead arrangement, dimensions and scale. Zoom and scrolling are linked. The voltage diagram preserves 5 mm/mV for V1/V5 and 10 mm/mV for II. The model is labeled as a normal reference, with differing beat timing; it is not a prior patient ECG. Comparison is hidden during unrevealed interpretation and location exercises.
5. **Persistent learning progress.** Mark a case complete, save individual findings for review, continue to an unfinished case, or resume the last case and finding after reopening Explorer. The review queue restores the exact saved finding. Progress stays in local browser storage; written interpretations are not persisted. Existing student confidence ratings remain available. The former session-only Explorer selection store was replaced rather than maintained as a second source of truth.
6. **Visual polish.** Consistent controls, compact progress display, responsive comparison columns, calmer borders, clearer type hierarchy, keyboard focus states, and reduced-motion support. ECG paper retains its established colors and signal scale.

## Verification

- `node --test tests/*.test.js`: 68 tests pass, zero failures/skips.
- New learning acceptance checks cover every case and every finding, correct and incorrect location attempts, keyboard cursor and focus restoration, comparison dimensions, linked zoom/scroll, answer concealment, and persisted progress/review navigation: 1,429 assertions at each of 1280 and 320 pixels.
- Existing Explorer checks: 3,360 assertions per viewport, covering all 47 cases, findings, practice, enlargement and navigation.
- Guide regression: 10,981 interaction assertions across all 27 guide figures, zero failures.
- General application layout/route fixture: 230 checks pass.
- Theme/icon audit: 47,148 checks with no failures or contrast candidates.
- Visual inspection included the integrated desktop workspace, normal comparison, location exercise and 320-pixel mobile layout.

Runtime assets: `20260909-ecg-learning4`; offline cache: `v157`.

These checks validate software behavior and model geometry; they do not constitute independent clinical validation or establish learner mastery.

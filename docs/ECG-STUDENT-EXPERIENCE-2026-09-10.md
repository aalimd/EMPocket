# Student experience improvements — 10 September 2026

## Reassessment and scope

Implemented the learning and navigation improvements that reuse the existing reviewed teaching content. An optional sequence avoids forcing experienced users through beginner lessons. Long lists collapse rather than adding another scrolling panel. Attempt tracking is separate from existing completion and self-confidence records; it does not imply diagnostic accuracy or proficiency.

New waveform variants, measurement calipers and differential-diagnosis comparison lessons are deferred. They need waveform/calibration validation and clinical content review. Mixed practice uses existing library cases with no recorded interpretation attempt first; it does not claim to generate new patient tracings or prove transfer to unseen examples.

## Student workflow

- Five optional stages cover all 47 cases once: normal, common rhythms, conduction/intervals, ST–T patterns, and remaining patterns. Each includes an objective, suggested preparation and the existing studied count. Previous/next stay within the chosen stage; Continue learning advances through the learning sequence. Browse all cases exits the sequence.
- Findings precede the detail preview. Lists with more than four findings collapse behind a chooser. Previous/next finding controls sit beside the explanation. The desktop panel uses the page scroll instead of nested scrolling and a sticky explanation.
- Tapping a marked region opens its corresponding crop. The active region has a stronger red outline. Tab plus Enter/Space offers the equivalent keyboard action. The detail image does not duplicate interactive SVG controls. Whole ECG restores fit from a zoomed view.
- Practice adds an optional six-part reading checklist and a general reading hint without revealing the diagnosis. Written observations survive zoom, hints and enlarged-view changes, then reset on the next case or mode change. Notes remain in memory only.
- Mixed practice prioritizes library cases without a recorded attempt and avoids immediately repeating the current case. Reveal records an attempt only when the learner has written an interpretation or checklist observation. Blank reveals do not count. Written answers are not automatically graded.

## Storage and release

Existing free completion, review, preference and confidence keys remain intact. The new `em-ecg-practice-v1` key contains only validated case IDs with an attempt, not written answers. Storage failure leaves the in-memory session usable and displays the limitation. The app remains self-contained with no account or paid dependency.

Release token: `20260910-learning-r3`; installation-scoped service worker cache: `v162`.

## Verification

`node --test tests/*.test.js`: 82 tests passed. Added tests verify learning-stage coverage, practice selection, and validation/isolation of attempt history.

`dev/explorer-student-audit.js` checks stage navigation, finding order/navigation, touch-coordinate and keyboard region selection, fit reset, concealed hints, blank-reveal behavior, checklist synchronization, attempt persistence, reset behavior and unavailable storage. Existing Explorer and learning audits exercise every case/finding, practice reveal/reset, enlarged view, comparison and location practice. Browser runs use local Chrome at 1280, 390 and 320 px; reduced motion avoids overlapping scripted scroll animations in exhaustive runs. A separate run exercised normal-motion mobile interactions.

Full application previews were checked for horizontal overflow at all three widths, with screenshots reviewed for the reading, path and practice layouts. These are browser/mobile-emulation checks, not physical-device or live deployment tests. The local preview omits onboarding without recording an agreement.

Final exact-width results at each of 1280, 390 and 320 px: 35 student-workflow assertions, 3,622 Explorer assertions and 1,429 learning assertions, all with zero failures.

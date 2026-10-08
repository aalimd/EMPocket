# Design, UI and UX follow-up — 8 October 2026

Release: `20261008-ux-polish-v34`. Installation-scoped worker cache: `v229`.

This pass builds on the uncommitted redesign already in the workspace. It preserves that work, the free application's storage keys, local content and installation boundaries.

## Gaps closed

| Area | Finding | Result |
| --- | --- | --- |
| Library | Saved topics required a detour through Learn on phones; the sidebar link selected Learn. | A direct Saved topics link with a count is available in the library on every screen size. Both library entry points retain the Library destination. |
| Draft notes | Selecting severity changed the active chip before asking about an unsaved note. Canceling kept the new chip against the old content. | Filter changes wait for the note decision; Keep editing preserves both the draft and the original filter. |
| Filter dismissal | Escape and outside-click dismissal only covered library filters. | Reader severity menus use the same dismissal behavior, and selecting severity returns focus to its trigger. |
| Filter placement | A long patient menu could extend below the bottom navigation on short screens. | Menus measure the space above and below their trigger, flip upward when useful, and scroll within the available space. |
| Filter visibility | Closed menus obscured the selected patient context or severity. | Trigger labels name the selected values. |
| Search | Enter during input composition could open a topic prematurely. Search suggestions could remain open after keyboard focus moved away. | Composing input is ignored by navigation; leaving search cancels pending suggestions and closes the popup. |
| Search pagination | Showing more results did not announce how many were now visible. | The live result count reports the displayed and total matches. |
| Reading preferences | Size controls still appeared actionable at the smallest and largest settings. | The appropriate control is disabled at each limit; size changes have a live status label. |
| Destination names | Quick was still called Shift view; Preparation displayed Procedures; recorded ECGs displayed Visuals with duplicate section navigation. | Labels, headings, document title and section navigation now identify the destination consistently. |
| Printing | Dark-mode tokens left pale headings and dark clinical backgrounds in printed output. | Print uses a light palette with dark text and distinct, light severity surfaces regardless of the chosen screen theme. |
| Keyboard visibility | Bottom navigation had no corresponding scroll padding. | Mobile scrolling reserves space above the fixed navigation for focused content. |

## Verification

The baseline full suite passed all 192 tests. Eight browser regression tests were added for saved navigation, destination headings, canceled filter changes, search composition/focus, preference limits, short-screen filter placement, dark printing and enlarged-text flows.

Browser coverage includes the existing four-size layout matrix (320, 390, 768 and 1280 pixels), twelve reading/learning routes at 320 pixels with 140% bold text, and a 390 × 568 short-screen menu check. Existing checks cover both themes and all six accents, route recovery, notes, recall cases, ECG findings, learning progress and installation isolation.

Manual local browser inspection covered the phone library, Learn/practice, a presentation, settings, desktop ECG Explorer and recorded ECGs. Light and dark appearance were checked; the original reading preferences and browser viewport were restored. No browser error messages were reported during the inspected flows.

Final command: `node --test tests/*.test.js`. All **200 tests passed**, with zero failures, skips or cancellations (89.65 seconds). Syntax checks and `git diff --check` also passed.

This is local browser and automated verification. Live deployment, physical-device installation, physical-device keyboard behavior and physical printing were not tested.

## Visual evidence

- [Phone library](ux-audit-2026-10-08/library-phone.jpg)
- [Short-screen dark filter menu](ux-audit-2026-10-08/filter-dark-short.jpg)
- [Desktop recorded ECGs](ux-audit-2026-10-08/ecg-desktop.jpg)

The screenshots use the local app. The library and desktop captures retain the user's bold-text preference.

## Naming release — v35

The application is now **The EM Pocket**, including its installed-app name, shell, navigation brand, document titles, settings, accessibility labels and user-facing messages. Release references are `20261008-the-em-pocket-v35`; worker cache revision is `v230`.

The established free storage keys, installation URLs and `EM Pocket free` backup-format identifier are preserved so existing preferences, progress and backup files continue to work. The production target remains the existing `empocket` Cloudflare Pages project at `https://empocket.pages.dev/`.

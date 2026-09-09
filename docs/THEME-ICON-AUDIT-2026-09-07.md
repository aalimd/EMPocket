# Theme and icon verification — 7 September 2026

Release: `20260907-theme2`, offline cache v145.

## Changes

- Topic emoji use explicit Apple Color Emoji / Segoe UI Emoji / Noto Color Emoji fallbacks, a nonshrinking box, normal weight and enough line height. Original topic identities and decorative accessibility semantics remain intact; navigation controls retain SVG icons and accessible names.
- Light mode explicitly requests light native controls. Dark mode retains its existing explicit dark color scheme.
- Explorer primary, enlarge and selected buttons use the theme's matching foreground token.
- Selected ECG category chips now have a filled background instead of white text on a transparent surface.
- Diagnosis severity tags no longer inherit a colored background underneath muted text. Diagnosis headings use the main text color; severity words remain visible.
- Light-mode disposition headings and answer feedback use darker red, orange and green text; count badges use the main text color.
- Practice fieldsets, option grids and the case selector can shrink to fit a narrow viewport. The selector previously extended outside the screen at 320 and 390 pixels.
- ECG paper retains its calibrated pink surface, dark tracing and red finding marks in both themes.

## Verification

`dev/audit.html` → **Run themes and icons** runs the local-only `dev/theme-audit.js` fixture. It removes the onboarding notice from an isolated document without accepting an agreement. It does not write theme preferences and restores the Explorer session view afterward.

- 94 routes × 4 widths (320, 390, 768, 1280) × 2 themes = **752 route/viewport/theme combinations**. Includes all 45 presentations, ECG Guide, Study, clinical practice, Reference, library and all 43 Explorer diagnoses.
- Section cards expanded before inspection.
- **43,450 assertions, zero failures**, including 42,698 visible icon instances checked for nonzero size and replacement characters.
- No page-level horizontal overflow.
- No remaining contrast candidates in the scanned stage text and controls after excluding gradients and disabling transitions in the test document. Small text checked against 4.5:1; large text against 3:1.
- Visual inspection of mobile practice and topic pages and desktop Explorer in both themes; topic emoji, navigation SVGs, ECG paper and red finding circles visible.
- `node --test tests/*.test.js`: **46 passed, zero failed**.
- `node --check dev/theme-audit.js` and `git diff --check`: passed.

## Limits

Responsive browser verification is not a physical iOS/Android device matrix. Native emoji artwork and availability depend on the installed OS fonts. Contrast scanning is a regression aid, not complete WCAG certification: it excludes gradient backgrounds, SVG text, translucent compositing and interaction states not rendered in the route scan. Existing ECG interaction audits remain available separately. No clinical content changed in this update.

## Header follow-up — 8 September 2026

Release `20260907-header2`, cache v149. Phone navigation now uses equal buttons with enough height for an icon plus two label lines, a 12 px gap below search, and rows that can grow with their content. Explicit destination selectors override older fixed-height ID rules that clipped the first four buttons. Between 921 and 1160 px, search and navigation occupy separate rows to prevent the Explorer button overflowing.

`dev/audit.html` → **Check header visibility**: 1,100 geometry assertions passed with zero failures, covering 11 widths from 320 to 1280 px, both themes, bold text, and text scales 1 and 1.3. Checks require every icon and label to fit its button, every button to fit the header, and no overlap with search or adjacent buttons. Visually checked the 400 × 675 layout matching the supplied screenshot. Syntax and diff checks passed.

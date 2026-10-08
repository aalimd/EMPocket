# The EM Pocket icon refresh

Release: `20261008-clear-icons-v36` · Service worker: `v231`.

Replaced the custom UI drawings with locally embedded **Material Symbols Rounded**,
using Google's 24 px optical designs. This covers desktop and phone navigation,
search, settings, filters, all 45 presentation cards, clinical framework sections,
patient contexts, ECG guide steps, ECG Explorer controls, bookmarks and theme states.
The launcher, favicon, Apple touch icon and maskable icon now share a simpler
medical handbook and ECG mark drawn in the editable `assets/icon.svg`.

Clinical symbols identify a familiar body system or context; the adjacent text
identifies the presentation. Related presentations deliberately share a meaningful
system symbol instead of inventing tiny variations. The comparison review replaced
ambiguous specialty symbols with a familiar eye, child face, blood drop and head
where those communicate more clearly. Labels and accessible button names remain
in place. Decorative SVGs are hidden from assistive technology and cannot take focus.
Card symbols are 28 px, phone navigation symbols 26 px and reader badges 24 px.

The symbols require no icon font, remote script or CDN. The original upstream paths
are embedded in existing runtime files with an explicit coordinate transform.
The Apache-2.0 license is shipped and cached locally. Free progress and preference
keys are unchanged, and the paid sibling is untouched.

## Source and maintenance

- [Google Material Symbols repository](https://github.com/google/material-design-icons),
  pinned to `737e3324305806514d7909874fa1818ae1808232`.
- [Google's Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols).
- Run `python3 dev/refresh-icons.py` to refresh the embedded symbols from the pinned
  source. Running it twice produces identical runtime files.
- Export launcher PNGs with `dev/render-app-icons.cjs`, supplying the optional
  `@resvg/resvg-js` build tool through `RESVG_MODULE`. It is not a runtime dependency.
- `dev/icon-review.html` records the comparison against commit `35b998c`.

## Visual checks

Checked in the local browser at desktop width and at 390 and 320 px phone widths.
Reviewed the library, pediatric reader, patient filters, settings, dark mode and
ECG Explorer. The checked layouts had no document overflow or unlabeled visible
icon buttons; the browser reported no console errors on the checked ECG route.
This is browser testing, not physical-device testing.

- [Desktop library](icon-refresh-2026-10-08/desktop.jpg)
- [Phone reader](icon-refresh-2026-10-08/phone-reader.jpg)
- [Phone dark mode](icon-refresh-2026-10-08/phone-dark.jpg)
- [All presentation icons compared](icon-refresh-2026-10-08/comparison.jpg)

Validation: `node --test tests/*.test.js` — **200 passed**, zero failures or skips;
`git diff --check` passed.

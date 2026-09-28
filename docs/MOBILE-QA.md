# EM-CPs mobile release checklist

Run this before every Hostinger push. ~15 minutes once routine.
Test on the live HTTPS URL, not localhost (real service worker, real install).

## Widths (DevTools responsive mode + one real phone if possible)
- [ ] 360px: no page-level horizontal scroll; ECG figures pan inside their cards
- [ ] 360px: ECG annotation text readable (~9px effective, never below ~8px)
- [ ] 390px and 768px: same checks
- [ ] 320px: topbar fits without overflow
- [ ] Landscape: cards and figures usable

## Bottom tab bar (≤920px)
- [ ] Exactly 5 tabs; all labels on one line and inside the glass bar at 320px
- [ ] Tab bar never floats over the first-run disclaimer: with it open, tapping
      the bar area must hit the dialog, not a tab
- [ ] Tab bar never floats over the navigation drawer or its backdrop
- [ ] Opening the drawer and tapping any tab closes the drawer and unlocks scroll
- [ ] Reading a topic keeps the Presentations tab lit
- [ ] `#learn~progress`, `#learn~skills`, `#learn~visuals` keep the Practice tab lit
- [ ] `#ecg-explorer`, `#ecg`, `#shift`, `#learn~practice` light their own tab
- [ ] Toasts appear above the tab bar and never overlap it
- [ ] Print preview (or print to PDF): the tab bar is absent and no blank space
      is left at the bottom of the last page

## Overlay behaviour
- [ ] ECG workbench traps focus; the tab bar is inert while it is open and the
      workbench Close button is the way out
- [ ] Breadcrumb reads `Group › Topic`, never a trailing separator
- [ ] Shift view: "Copy handover" copies on success; with the clipboard blocked it
      says so and shows a selectable manual-copy field — never "Handover ready."

## Symptom triggers
- [ ] `#ecg`: all 7 step headers show a distinct emoji (none is the generic 📋)
- [ ] `#ecg-explorer`: every category in the case picker has an emoji
- [ ] Explorer diagnosis header shows the badge beside the heading, not stacked
- [ ] Read a topic, scroll to a middle section, then change the severity filter:
      the "On this page" marker must still follow the section you are reading

## Browsers
- [ ] iOS Safari, Android Chrome, Samsung Internet (font boosting!)

## PWA
- [ ] Install prompt appears; app installs and launches standalone
- [ ] Airplane mode after first load: full app works offline
- [ ] After deploy: phone picks up the new version on next visit (no manual cache clear)

## Touch and readability
- [ ] All tap targets comfortable (ECG hotspots ≥ ~130×36px, buttons ≥44px)
- [ ] ECG hotspots respond to tap; wave buttons + inspector correct per card
- [ ] Annotations toggle hides/shows figure labels; print shows them
- [ ] Pinch-zoom still allowed; light/dark themes; larger system font sizes

## Content
- [ ] `#ecg`, `#ecg~stemi-criteria`, `#ecg~wellens` render with figures, no console errors

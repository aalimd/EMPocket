# EM-CPs mobile release checklist

Run this before every Hostinger push. ~15 minutes once routine.
Test on the live HTTPS URL, not localhost (real service worker, real install).

## Widths (DevTools responsive mode + one real phone if possible)
- [ ] 360px: no page-level horizontal scroll; ECG figures pan inside their cards
- [ ] 360px: ECG annotation text readable (~9px effective, never below ~8px)
- [ ] 390px and 768px: same checks
- [ ] 320px: topbar fits without overflow
- [ ] Landscape: cards and figures usable

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

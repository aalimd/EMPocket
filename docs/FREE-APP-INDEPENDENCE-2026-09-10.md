# Free EM-CPs independence

EM-CPs is the free static application. EM-P is a separate paid application. This repair changes only EM-CPs; it does not deploy either application.

## Runtime boundaries

- All free clinical data, ECG models and application scripts ship inside EM-CPs. No account, subscription API, paid content loader or EM-P asset is required.
- Existing free storage keys remain unchanged so users keep their progress: `em-cps-prefs`, `em-cps-learning`, `em-cps-disclaimer-agreed`, `em-ecg-learning-v1`, `em-student-progress`. The paid application uses separate `em-p-` keys. Do not read, migrate, clear or write paid keys here.
- Manifest start URL and scope stay relative to this folder. The free service worker now ignores requests outside its registration directory, including EM-P requests, even offline. Activation only removes obsolete caches with this installation's cache prefix.
- No global storage clearing or service-worker unregistering is performed.

## Reliability changes

Saved Explorer reviews are validated from finding metadata without rendering full SVGs during startup; duplicates are removed before validation. All 47 case types retain their existing findings. Startup exceptions now show reload and library controls instead of an empty Explorer page.

Release assets use `20260910-free-r1`; service-worker cache revision is `v159`. Upload the free release together to the EM-CPs deployment only. Keep `dev/` and `tests/` local.

## Boundary limitation

Separate paths on one domain share a browser origin. These changes provide application-level separation, not an origin-level security boundary. Strong browser-enforced separation would require distinct origins, such as separate subdomains; no hosting or domain changes were made.

## Verification

- Automated suite: 72 tests passed, including paid/sibling request exclusion, scoped cache cleanup, independent bundled runtime, and restoration of every saved ECG finding without SVG rendering.
- Mobile Explorer fixture at 390px: 3,360 interaction assertions and 1,429 learning assertions, zero failures.
- Full free-app Explorer preview at 390px: rendered correctly; no browser console errors.
- The older broad `dev/audit.html` audit cannot initialize under the current CSP because it uses `new Function`. Its full-route results are not counted; production CSP was not weakened to run it.
- Tests ran locally with desktop browser mobile-width simulation. No physical phone or production deployment was verified.

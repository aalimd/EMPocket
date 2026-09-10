# Code and dual-host verification — 10 September 2026

Scope: the free EM-CPs application, including the student-flow changes. No paid sibling, account, DNS, live deployment or production storage changes.

## Issues found and fixed

1. A service worker installed at `/` previously intercepted unrelated same-origin paths. Fetch interception now permits only the application entry points (`./` and `./index.html`) and the bundled asset paths. Hash routing remains compatible with both hosts.
2. Cache names previously collapsed case, punctuation and path separators. Distinct installations could collide, and parent-prefix cleanup could remove a child installation's cache. The new namespace encodes the exact installation path. Regression tests cover root, nested, case-sensitive and punctuation-separated installations. Ambiguous legacy namespaces are left untouched; saved learning keys are unchanged.
3. When storage writes failed, the new practice-attempt history survived rerenders but was lost when Explorer was remounted. It now retains a validated session snapshot across navigation and can save successfully when storage becomes available again. Written answers are still never saved.
4. Cloudflare's default SPA fallback can return HTML with HTTP 200 for a missing JavaScript asset. Required offline assets now undergo MIME validation before the worker activates. This protects against an incomplete upload appearing to install successfully offline.
5. The older route, student and header browser fixtures used short fixed delays. They sometimes checked the previous route or viewport. They now wait for actual hash-change processing and frame layout. Production CSP was not weakened to run these fixtures.

## Evidence

- All runtime, development and test JavaScript files plus inline scripts were parsed: 41 files/blocks.
- Node test suite: 86 tests passed, including host rules, local references, content structure, SVG/model behavior, saved-data validation and the new worker/session regressions.
- Apache 2.4.67: isolated configuration accepted by `httpd -t`; real `.htaccess` responses tested at both `/` and `/nested/`.
- Cloudflare Wrangler 4.130.0, installed only in a temporary test directory: `pages dev` accepted all 15 `_headers` rules against the runtime-only upload folder. No deployment or account connection was used.
- HTTP checks: 19 entry-point/asset responses at each of Apache root, Apache nested and Pages root (57 total) passed status, MIME, cache and security-header checks.
- Real-browser production-policy checks: 52 routes at 1280, 390 and 320 px, plus search, clinical practice, red flags, learning progress and four offline navigations, on each of the three local hosting configurations. Each configuration passed 163 checks, with no JavaScript or CSP errors or horizontal page overflow.
- Existing broad browser audit: 230 route/content/layout checks passed. Student journey audit: 152 assertions passed. Header geometry: 1,100 checks passed. Existing ECG viewer audit: all 27 figures passed 10,981 interaction assertions.
- Explorer student workflow: desktop/mobile regression confirmed the lost-session-attempt bug before its fix, then passed with the fix, including storage recovery/isolation.
- Final Explorer runs at 1280, 390 and 320 px each passed 36 student workflow, 3,622 interaction and 1,429 learning assertions: 15,261 assertions total, zero failures.
- A real browser upgrade from the previous committed release to the new worker loaded the student UI, preserved saved progress and notes, preserved an unrelated installation's cache, and supported three subsequent offline reloads. The old ambiguous cache remained untouched, as intended.

The broad browser fixture intentionally has no production CSP because it extracts renderer functions with `new Function`. Separate direct application tests used the actual production response policies on both local hosting runtimes.

## Release

Asset token: `20260910-verified-r4`. Service-worker cache revision: `v163`.

Upload only `index.html`, `manifest.json`, `sw.js`, `.htaccess`, `_headers` and the `assets/` directory. Keep the existing Hostinger origin/path if existing installed-app identity and local progress must be preserved. The same runtime files support Cloudflare Pages at the site root; Hostinger also supports the verified subdirectory layout.

## Limits

These results establish local code/runtime compatibility, not a guarantee of zero defects or live-host configuration. Public deployment URLs were requested but were not supplied during verification. Hostinger SSL/CDN settings, Cloudflare production custom-domain/edge behavior and actual uploaded file versions therefore remain unverified. Physical Android/iOS installation, Safari-specific native picker behavior and print-dialog/device behavior were not tested in this run.

## Official hosting references checked

- [Cloudflare static HTML settings](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Cloudflare header syntax, matching and limits](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare canonical HTML URLs, SPA fallback and caching](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare local Pages runtime](https://developers.cloudflare.com/pages/functions/local-development/)
- [Hostinger upload layout and index-file checks](https://www.hostinger.com/support/how-to-upload-a-website-from-backups/)

## Upload-failure and bundle checks

An intentionally incomplete runtime was served by a second local Pages instance. The missing `assets/ecg-explorer.js` returned the real Pages HTML fallback with HTTP 200. A browser installation attempt reached `redundant`, with no controlling worker: the new MIME validation prevented activation of that broken bundle.

The upload archive contains 22 files, including both host configurations, and every archived byte was compared with the current working runtime. It excludes development tools, tests, reports and Git files.

Archive: `EM-Pocket-20260910-verified-r4.zip`.
SHA-256: `859d75d0e2127e34e4ef39da077b808f76fbba0acac7240fade9c450ac70a7fb`.

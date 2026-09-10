# Dual-host deployment verification — 10 September 2026

Scope: free EM Pocket / EM-CPs repository. Local work only; no deployment, push, DNS, domain or paid EM-P changes.

## Architecture and minimal changes

The application is static HTML/CSS/JavaScript with bundled medical content, local progress, hash navigation and a service worker. No build/runtime dependencies or server endpoints are required.

- `_headers`: supplies Pages security headers matching Apache, disjoint browser-cache rules and the manifest MIME type. Pages combines repeated headers, so cache rules deliberately do not overlap. No routing/Worker configuration is necessary for existing hash routes.
- `.htaccess`: only adds CSS to the existing revalidation rule; all existing Apache directives and security values are retained.
- `sw.js`: caches and falls back to `./` rather than `index.html`, avoiding Pages' canonical HTML redirect during offline fallback. Required assets, optional icons, scope boundaries, update notification and stored learning progress behavior remain intact. Cache revision increments to `v160`.
- `index.html`, `manifest.json`, `assets/app.js`, `dev/audit.html`, `dev/audit.js`, `dev/ecg-highlight-gallery.html`, `dev/explorer-contact.html`, `dev/explorer.html`: release references only, synchronized to `20260910-hosts-r1`.
- `tests/app-sw.test.js`, `tests/deployment.test.js`: cover root/subdirectory offline fallback, canonical-shell installation, core/optional asset failures, scoped cleanup, release references, manifest dimensions and host header parity.
- `README.md`: exact hosting settings, runtime upload inventory, update instructions and manual verification checklist. This report records evidence and limits.

Medical content, ECG models, styles, controls, icons and saved-data keys were not edited. Final diff review found no unrelated runtime changes. No new framework, dependency, build system, database, environment variable or Worker was introduced.

## Results

| Check | Result |
| --- | --- |
| `node --test tests/*.test.js` | 79 passed, 0 failed |
| Standalone JS plus inline script parsing | 40 files/blocks passed |
| Static HTML paths, including local previews | 59 references resolved |
| Runtime/precache paths at site root and nested path | Automated checks passed |
| Manifest URLs, shortcuts and actual PNG dimensions | Passed |
| Release tokens and relative worker registration | Passed |
| Worker offline cache miss/hit, storage failure, scope isolation and installation failure handling | Passed in VM tests |
| Apache configuration check | `httpd -t`: Syntax OK |
| Running local Apache responses | 20 requests passed status, MIME, cache and security-header checks |
| Real browser direct `#ecg-explorer~normal` route | Rendered; no console errors; worker update notification observed |
| Pages header parity, line/rule limits and cache-rule overlap | Passed local configuration tests |
| Final whitespace/diff review | Passed |

Apache requests covered the root, direct hash URLs (fragments are not sent in HTTP), HTML, all entry-point scripts/styles/icons, the manifest and service worker. HTTP checks do not by themselves prove client route rendering. The browser directly verified the Explorer route; existing automated tests cover content/routes and ECG behavior.

## Explicit limits and manual verification

- Actual Cloudflare Pages upload acceptance, production header evaluation, HTML redirects and edge/CDN caching were not tested. `_headers` was checked against current official documentation and a local rule model; Wrangler or an edge emulator was not installed.
- Local Apache compatibility was verified. Hostinger's live SSL, LiteSpeed/CDN overrides and account-specific configuration were not changed or remotely verified.
- Offline behavior was verified logically and through automated worker tests. No physical device airplane-mode test, Android/iOS installation test or full old-to-new installed-PWA upgrade was performed. A real local browser worker update notification was observed.
- The older broad `dev/audit.html` harness uses `new Function`, which production CSP blocks. No claim is made that this audit passed, and CSP was not weakened. UI and clinical code are unchanged by this patch.
- Root output Git deployments can publish tracked dev/tests/docs alongside the app. Runtime-only Direct Upload avoids this without adding a build system. Never include the paid sibling or credentials.
- Pages root hosting and Hostinger root/subdirectory hosting are covered by configuration/path checks. Moving between origins does not migrate local storage or an installed PWA's identity.

After a future authorized deployment, inspect response headers/MIME types on both hosts, install on Android/iOS, open direct hash links, test an offline cold reopen and verify an update from the prior installed release. Confirm existing proxy/cache rules do not override revalidation or `sw.js` no-store.

## Exact Pages settings

Framework: **None**. Production branch: **main**. Root directory: **blank** (repository root). Build command: **exit 0** (no-op). Build output directory: **.**. Environment variables/bindings: **none**. No Pages Functions or Worker.

Alternatively, Pages Direct Upload needs no build settings: upload the runtime folder listed in README with `index.html` directly at its root.

Official references: [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Headers](https://developers.cloudflare.com/pages/configuration/headers/), [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

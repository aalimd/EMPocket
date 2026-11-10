# First-load performance budget (Phase 3)

Historical size estimate: 9 Nov 2026. Rechecked 10 Nov 2026 for `20261110-ux-v70`: 20 startup scripts, 1,298,474 raw bytes and 391,799 bytes summed per-file gzip; recordings 2,748,789 raw bytes. These are payload sizes, not render-time measurements. Gzip on the host may differ.

## The two tiers

| Tier | What | Raw | Gzipped |
|---|---|---:|---:|
| Eager (startup scripts) | 20 modules in `index.html` | ~1.27 MB | ~382 KB |
| Lazy — recorded-ECG library | `ecg-recordings.js` | 2.6 MB | ~712 KB |
| Candidate for lazy — ECG stack (6 modules) | `ecg-svg`, `ecg-engine`, `ecg-case-tracings`, `ecg-interactive`, `ecg-curriculum`, `ecg-explorer` | ~380 KB | ~90 KB |

**The startup execution tier excludes recording evaluation.** Module scripts do not block HTML parsing, but execution can affect interactivity; payload size alone does not measure first paint. The recordings library imports when
the recordings visual lesson mounts (`loadRecordings` in
`assets/em-learning.js`). It stays in the service-worker precache, so after
the first install it resolves from cache and costs no extra network time.

## Future: lazy ECG stack (not yet done)

The six ECG modules (~90 KB gzipped) are a candidate for deferred evaluation.
Audit their search-index, learning-comparison and route consumers before changing
startup order; an ECG screen is not necessarily their only consumer. A trial implementation introduced a
regression: an async `ensureEcgStack().then(render)` let a late ECG render
fire after the user had navigated elsewhere, overwriting the current page
and failing the browser audit. The ECG stack stays eager until a separate
experiment proves all of the following:

- A monotonic navigation/request generation rejects stale completion, including
  A → B → A navigation; matching the hash alone is insufficient.
- Loading, failure, retry and offline states preserve the current route and
  unsaved-note decisions. Related views must share a single loading promise.
- Tests wait for explicit ready/error states instead of extending fixed sleeps.
- A comparison on a documented slow network and CPU profile demonstrates a
  useful improvement in startup responsiveness without making first ECG use worse.
- Precaching and update-from-previous-release checks still pass. Lazy evaluation
  does not reduce the full offline-install download while the files remain precached.

The browser audit now reports an unthrottled local startup baseline and checks
that the library renders and recordings remain unevaluated. This is a smoke
measurement, not evidence of physical-device performance or a reason to change
loading architecture.

## Eager modules (first load)

| Module | Raw | Gzipped | Reason it must be eager |
|---|---:|---:|---|
| `data.js` | 340 KB | 113 KB | `CP_DATA` drives the library, search index, saved/reviewed state |
| `app.js` | 308 KB | 77 KB | the application shell itself |
| `ecg-svg`, `ecg-engine`, `ecg-case-tracings`, `ecg-interactive`, `ecg-curriculum`, `ecg-explorer` | ~380 KB | ~90 KB | ECG views only, but currently eager — lazy candidate (see above) |
| `design.js` | 24 KB | — | shell chrome, nav, search/settings renderers |
| `student-learning.js` | 44 KB | — | study route data |
| `em-learning.js` + `em-learning-data.js` | 92 KB | — | learn route (workspace, cases) |
| `evidence.js` | 12 KB | — | evidence links in presentations |
| `shift-tools.js` | 64 KB | — | Quick hub calculators |
| `search-core.js`, `search-index.js` | 24 KB | — | search is a header affordance |
| 5 extracted stores | ~28 KB | — | learning, prefs, agreement, navigation, search index builder |

## Reading the numbers

- **1.27 MB raw / 382 KB gzipped** is the first-load JavaScript budget.
  CSS adds ~500 KB raw (mostly minified-in-source cascade layers).
- `data.js` is the single largest eager file. It is mostly clinical *content*,
  not code; splitting it per-topic would save little on a cached repeat
  visit and would multiply cache entries. Revisit only if it grows beyond
  ~500 KB raw.
- If the ECG stack goes lazy safely, first load would drop by ~90 KB
  gzipped (~24% of the JS budget) — a candidate saving, not a proven user-facing improvement.

## Rules for future modules

1. A module used on the library/search home screens stays eager.
2. A module used only inside one route family goes lazy via dynamic
   `import()` with a loading state, a failure fallback that never breaks
   the shell, and a precache entry so offline still works.
3. `assets/app.js` is the composition root: it keeps renderers, the
   router and the UI shell. Anything fetchable, storable or stateful
   belongs in an extracted store (see Phase 2) so it can be unit-tested
   without a DOM.

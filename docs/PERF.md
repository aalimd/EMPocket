# First-load performance budget (Phase 3)

Measured 9 Nov 2026 against the release token `20261108-coordination-v67`.

## The two tiers

| Tier | What | Raw | Gzipped |
|---|---|---:|---:|
| Eager (startup scripts) | 20 modules in `index.html` | ~1.27 MB | ~382 KB |
| Lazy — recorded-ECG library | `ecg-recordings.js` | 2.6 MB | ~712 KB |
| Candidate for lazy — ECG stack (6 modules) | `ecg-svg`, `ecg-engine`, `ecg-case-tracings`, `ecg-interactive`, `ecg-curriculum`, `ecg-explorer` | ~380 KB | ~90 KB |

**First paint pays only the eager tier.** The recordings library imports when
the recordings visual lesson mounts (`loadRecordings` in
`assets/em-learning.js`). It stays in the service-worker precache, so after
the first install it resolves from cache and costs no extra network time.

## Future: lazy ECG stack (not yet done)

The six ECG modules (~90 KB gzipped) are only used inside ECG views, so
they are the natural next lazy candidate. A trial implementation introduced a
regression: an async `ensureEcgStack().then(render)` let a late ECG render
fire after the user had navigated elsewhere, overwriting the current page
and failing the browser audit. Any retry must (a) guard the late render with
the requested hash (`if (location.hash !== requested) return;`), and (b)
allow the browser audit's 450 ms settle window to absorb the import. Until
both are proven, the ECG stack stays eager.

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
  gzipped (~24% of the JS budget) — the cheapest remaining win.

## Rules for future modules

1. A module used on the library/search home screens stays eager.
2. A module used only inside one route family goes lazy via dynamic
   `import()` with a loading state, a failure fallback that never breaks
   the shell, and a precache entry so offline still works.
3. `assets/app.js` is the composition root: it keeps renderers, the
   router and the UI shell. Anything fetchable, storable or stateful
   belongs in an extracted store (see Phase 2) so it can be unit-tested
   without a DOM.

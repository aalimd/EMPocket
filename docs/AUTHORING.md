# Authoring guide (Phase 6)

How to add content to The EM Pocket safely.

## Add a presentation

1. Add one entry to `CP_DATA` in `assets/data.js` with the fields:

   ```js
   {
     id: 'new-topic',            // lowercase, single hyphens, unique
     name: 'New Topic',
     icon: '🧑‍⚕️',                // any emoji; the category badge comes from the id
     tag: 'One-line tagline.',
     overview: '...',
     approach: ['...'],
     dontMiss: [['Title', 'critical' | 'emergent' | 'common', 'action']],
     history: ['...'],
     exam: ['...'],
     workup: [['Group title', ['...']]],
     redFlags: ['...'],
     disposition: [['Decision', 'rationale']],
     pitfalls: ['...'],
     pearls: ['...'],
     doses: [['Title', ['...']]],
     refs: ['Free-text references']
   }
   ```

2. Add the id to `assets/evidence.js` `topics` with at least one source key,
   and add the source itself (`title` + `https:` URL) to `sources` —
   the clinical-safety test requires every topic to have an explicit,
   traceable source. **Never invent a dose, threshold or link.**
3. Bump the release token and `CACHE_VERSION` together (README
   "Release and offline updates").
4. Run `node --test tests/*.test.js`.

## Add an ECG pattern or step

Edit `ECG_DATA` in `assets/data.js` (steps, patterns, evidence refs, related).
The ECG-accuracy and ECG-clinical test suites pin waveform claims and
isolated-disease teaching points. ECG figure work goes in
`assets/ecg-svg.js` and `assets/ecg-curriculum.js`.

## Add a Quick card

Quick drug/decision-rule cards live in `assets/search-index.js`
(`QUICK_SEARCH_CARDS`) for search indexing, and in three places for
rendering: the Quick hub `<details>` sections in `assets/app.js`
(`renderShift`), the `med-` blocks, and this index. Keep the two in sync —
the boot-registry test pins the card titles.

## Add a lazy route module

If a new module is only used inside one route family, load it lazily like
the recorded-ECG library: keep it out of `index.html` startup tags, keep it
in the service-worker precache (for offline), import it dynamically on
first use with a loading state, a failure fallback, and a guard so a late
import never overwrites a page the user already navigated to (see
[docs/PERF.md](PERF.md)), and add a test in `tests/module-loading.test.js`.

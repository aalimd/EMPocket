# Content governance (Phase 5)

How clinical content in The EM Pocket is reviewed, sourced and changed.

## Content inventory

| File | Content |
|---|---|
| `assets/data.js` | 83 clinical topics (`CP_DATA`), including 25 diagnosis guides + ECG guide data (`ECG_DATA`: steps, 18 patterns) |
| `assets/em-learning-data.js` | learning tracks, cases, short cases |
| `assets/student-learning.js` | short-case library |
| `assets/evidence.js` | selected primary-guidance links per topic |
| `assets/shift-tools.js` | bedside calculators, decision-rule cards |
| `assets/ecg-curriculum.js` | ECG curriculum panels, guided findings |
| `assets/ecg-explorer.js` | ECG Explorer teaching examples |

## Review cadence

- **Full clinical audit** every 6 months, or sooner when a major guideline
  changes (the last full audit: 8 Oct 2026, see
  [docs/CLINICAL-AUDIT-2026-10-08.md](CLINICAL-AUDIT-2026-10-08.md)).
- **Targeted review** whenever a drug dose, decision rule or threshold is
  touched — doses and antidotes must be re-verified against the source
  listed for that topic in `assets/evidence.js`.
- **ECG content** follows the ECG accuracy review trail (`docs/ECG-ACCURACY-*`,
  `docs/ECG-SEVEN-STEPS-REVIEW-2026-10-10.md`).

## Authoritative sources (in order of preference)

1. The primary guideline or society statement linked from
   `assets/evidence.js` for that topic.
2. Rosen's Emergency Medicine (framework reference for presentation
   structure; the app is not affiliated with or endorsed by Elsevier).
3. For recorded ECGs: PhysioNet PTB-XL 1.0.3 (CC BY 4.0), attributed in the
   recordings lesson.

Never invent a dose, threshold or link. If a claim cannot be traced to an
explicit title/URL in `assets/evidence.js`, it stays out of the app.

## Change control

1. Edit the data file and the header comment (date + scope).
2. Add the source to `assets/evidence.js` if the statement is new.
3. Run `node --test tests/*.test.js` — clinical-safety, search and
   ECG-accuracy tests pin doses, antidotes and waveform claims.
4. Bump the release token and `CACHE_VERSION` together (see README
   "Release and offline updates"), and record the audit trail in `docs/`.

## What is NOT governed as clinical content

- `assets/agreement-store.js` (educational-notice agreement), prefs and
  learning stores, service-worker code, and build-time tooling.
- Style-only changes (CSS, layout) do not need a clinical review but do
  need the browser checks in `tests/style-audit.test.js`.

# The EM Pocket delivery plan — 10 November 2026

## Scope and architecture

The independent free app remains self-contained with existing free storage keys.
EM-P, paid keys, other service workers and other installations' caches are excluded.
Startup scripts already use `type="module"`; their internal IIFEs still publish
explicit `window.*` contracts. Native module loading and imported module APIs are
different concepts. No module-system migration is planned for this release.
Keep app.js as the composition root. Extract a responsibility only when it changes
and can be tested independently; do not split files solely to reduce line counts.
Source-pattern tests must not dictate architecture: add behavioral coverage when
changing a responsibility.

## Completed locally

- Existing contract registry, extracted stores, source governance and authoring docs retained.
- Search pagination focuses the first newly revealed result.
- Back restores position zero and discards obsolete opening-card focus context.
- Learning resume uses one validated session owner and survives blocked storage in memory.
- Opening a case records its initial resume state, before the first answer.
- Recording views display loading and ignore completion after their body is detached.
- Library and Settings distinguish browser-reported connection from offline setup status;
  connectivity events update only connection text. Installed does not imply cached.
- Existing free preference/progress keys are preserved.
- Release assets and scope-specific cache updated together to v70 / v269.

## Validation and limits

Verified locally: `node --test tests/*.test.js` passed 271 tests, with zero failures
and zero skips. Changed JavaScript passed syntax checks; `git diff --check` passed.
Browser regressions cover session validation, blocked session storage, reload resume,
search focus, connection events, responsive layouts and existing reader/ECG flows.
The startup smoke test reports local timings and checks that the 52 presentations
render without evaluating the recordings library. These checks do not establish
live deployment, actual phone behavior, real network reachability, or exhaustive
clinical validity. A browser's online flag is not an internet probe.

## Remaining gates, in order

1. The reviewed UX corrections and regression tests are packaged together in this
   release commit. Push/publication remains a separate step.
2. Before publication, verify an installed previous version updates without losing
   notes, progress or preferences. Verify the published root and direct hash links.
3. On actual iOS/Android devices, verify touch, keyboard viewport, installation,
   offline reopening and back navigation. This has not been performed here.
4. Run repeatable network/CPU-constrained startup and first-ECG measurements with
   a named browser/profile, multiple runs and medians. Only then consider lazy ECG.
   A separate branch/commit must pass the generation-token and readiness gates in PERF.md.
5. Expand clinical content only after an actual gap assessment and source review.
   Edema, cyanosis, diplopia and limb ischemia already exist; do not duplicate them.

Payload size alone is not a performance result. Do not raise fixed test delays to
conceal a loading race. Keep user-facing UX fixes separate from loading experiments.

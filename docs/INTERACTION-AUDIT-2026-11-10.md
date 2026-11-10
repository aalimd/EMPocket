# Interaction and search audit — v73

## Confirmed defects and corrections

The hero Don't miss `More` button had a data-jump target but no click listener.
The presentation renderer now binds all data-jump controls, like the ECG renderer,
instead of enumerating CSS classes. A new all-topic browser regression failed
against the previous code and now verifies More plus section shortcuts, accordion
state, recall reveal buttons and learning-depth selectors across all 52 topics.
A separate touch-event test verifies More opens the collapsed section.

The journey addition placed another guided-reasoning element before the depth
selector. Enhancement bound the depth listener to that earlier element, leaving
Core/Applied/Advanced inert. The listener now selects the actual depth panel.

## Search

A prepared index normalizes documents once and maps words to result IDs. Queries
intersect postings instead of repeatedly scanning every paragraph. Literal title
and presentation matches precede supporting prose. Dose intent includes metadata.
Last-token prefix matching supports typing; spelling approximation is used only
when the exact/synonym/prefix pass is empty and is labelled in the UI. Approximation
never changes numerical tokens or maps hyper-prefixed words to hypo-prefixed words.
These restrictions are search behavior, not a claim of diagnostic equivalence.

Tests cover query-array cache isolation/eviction, literal titles, full-query
synonyms, multiword AND matching, partial typing, spelling errors, opposite-state
words, numerical doses, and actual pathway ranking against the clinical index.
A local 2,428-entry measurement took roughly 15 ms to prepare; common queries took
0–1 ms and a spelling-fallback example about 7 ms. These single-machine timings are
not physical-phone or production-network benchmarks.

## Clinical presentation context

Visual inspection found that Chest Pain's dose section presented aortic-specific
anti-impulse guidance under a generic heading. It now explicitly limits that
block to acute aortic syndrome/dissection, identifies perfusion-limited SBP and
60–80 bpm heart-rate targets, and labels vasodilators as following rate control.
The antithrombotic caution explicitly applies to suspected aortic disease, not
all chest pain. Source: 2022 ACC/AHA Aortic Disease Guideline, section 7.3.1:
https://www.jacc.org/doi/10.1016/j.jacc.2022.08.004
The explicit source is linked from the topic's evidence panel. This is a targeted
correction; no exhaustive new clinical audit is claimed.

## Verification scope and limits

The browser sweep includes the main destinations, all authored preparation modules
and evolving-case detail pages, plus existing visual lessons. Existing tests cover
ECG findings/viewers, storage failures, backups, unsaved notes, navigation, printed
appearance, contrast and responsive layouts. These are behavior-specific checks;
not a proof that every possible state is error-free. Actual iOS/Android hardware,
real learners and every guideline statement have not been revalidated here.

Final local verification: 290 tests passed, zero failures and zero skips; all 22
shipped JavaScript files passed syntax checks. The new browser sweeps exercised
52 topics and 31 main/learning detail routes. Release token: 20261110-search-v73;
service-worker cache revision v272.

## Coverage follow-up — v74 / v273

Regression tests first reproduced four additional defects: missing dose-line and
ECG-detail search entries, comparison text lost by an overly broad HTML-removal
expression, and ASCII/subscript notation mismatch. The index now includes authored
dose lines with their group, presentation and explicit clinical scope; ECG details
and action/caution/significance lines retain their actual section targets. Overview
text is also indexed. Search does not invent or modify dose content.

Tag removal now recognizes tag-shaped markup rather than treating numeric `<…>`
comparisons as HTML. ASCII `SpO2`, `PaCO2` and `HCO3` queries match subscripted
notation; highlighting preserves the original displayed characters and escapes
markup. Additional browser tests open a dose result at its actual section and
verify its aortic-specific scope stays visible in the search context.

The home review list previously dereferenced the optional ECG module without a
check and counted unknown activity IDs as visible items. It now reuses the focused
review's validated activity list, omitting unavailable entries and counting only
rendered activities. A missing-module browser regression covers that path.

No clinical data, free storage keys, paid-app state, or other installations' cache
names were modified in this follow-up. Physical-device checks remain outstanding.

Weight-bearing header queries could produce 13 preview options (the twelve normal
hits plus a calculator suggestion), followed by a View all option hard-coded to
ID search-result-12. The View all ID now derives from the actual preview length.
A browser test with `5 kg` verifies the calculator and View all coexist with unique
option IDs, preserving aria-activedescendant targeting.

Final v74 verification: 298 tests passed with zero failures and zero skips,
including all-topic interaction sweeps and the new coverage, notation, optional-
module and weighted-query regressions. All shipped JavaScript syntax and whitespace
checks passed. Local browser inspection opened a newly indexed dose result in its
correct expanded section.

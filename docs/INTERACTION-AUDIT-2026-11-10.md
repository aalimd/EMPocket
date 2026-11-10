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

# Learning and search usability verification — 10 November 2026

## Implemented

Topic Recall & notes sections now offer a step-by-step journey through existing
content: approach, a genuinely related authored case where available, a curated
ECG example where available, then recall and review. A missing related activity is
omitted rather than replaced with an unrelated generic case. Reading links never
mark completion. ECG examples are comparisons, not diagnostic labels for a topic.

Learn → Review your decisions combines two separately labelled signals:
self-rated uncertainty and incorrect first choices in the latest completed evolving
case. It reads existing progress owners and writes no new storage keys. It does
not claim to know individual incorrect questions after reload, since those are not
retained in the existing aggregate result. Scheduled topic reviews remain separate.

Header search retains input focus during pointer activation, hides stale matches
when the query changes, and caches twelve query results. Fuzzy word comparisons
and word-boundary expressions have bounded caches. Ranking and matching rules are
unchanged. A local five-run comparison over 2,428 index entries and three queries
(chest pain, dyspnea, headache) measured approximately 220 ms before and 100 ms
after for the three searches combined. This is a Node/local measurement, not a
physical-phone, network or production benchmark.

## Human usability sessions — prepared, not performed

Recruit students, interns and emergency medicine residents. Ask them to narrate
what they expect; do not teach the interface during each task. Use fictional
cases and personal study notes only, never patient information. No account or
analytics service is required; record observations manually with consent.

Tasks:

1. Search for chest pain, select a result, and identify which section opened.
2. Change the query rapidly, then select the intended new result. Repeat using
   touch, keyboard arrows/Enter, and the on-screen keyboard on actual phones.
3. From a presentation, find its related case and ECG comparison, then return to
   the topic. Identify what opening a step does and does not record.
4. Complete a case with a deliberately incorrect decision; find it from Learn's
   focused review. Explain the difference between its result and self-confidence.
5. Open a case without answering, leave and resume. Repeat after reload and
   with browser storage blocked; clarify the session-only limit.
6. Disconnect, find the connection/readiness labels, and open downloaded content.
   Verify that an external reference is understood to need internet access.

For each task, note completion without help, time to completion, wrong turns,
failed taps, accessibility barriers and whether the participant understood the
feedback. Separate findings by participant level and device/browser. These are
usability observations, not measures of clinical competence. Set improvement
priorities from observed failures, fix them, and repeat the same tasks.

## Publication gates

Automated regressions supplement these sessions; they do not replace them.
Actual iOS/Android use, prior-install update, deployed caching and real learner
sessions remain unverified until evidence is recorded. Keep content additions and
lazy-loading architecture experiments separate from this UX release.

Local release verification: 282 tests passed, zero failures and zero skips.
Header-result navigation passed a Chromium touch-event test and local browser
inspection; this does not establish physical iPhone/Safari behavior. All shipped
JavaScript passed syntax checks and git diff whitespace checks passed.
Release: 20261110-learning-v72 / cache v271.

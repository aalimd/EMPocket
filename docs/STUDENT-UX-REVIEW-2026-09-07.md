# Student UI/UX walkthrough — 7 September 2026

> These findings have been addressed. See [implementation and verification](STUDENT-UX-IMPLEMENTATION-2026-09-07.md) for the resulting behavior and checks. The observations below record the reviewed earlier state.

## Scope

Reviewed the actual first-run notice and the main student journeys at desktop 1440 × 1000 and mobile 390 × 844: Library → Chest Pain → recall/notes → Study queue → practice case → Shift → search → ECG guide → ECG Explorer → select a finding. Read the relevant implementation to distinguish reproducible behavior from subjective design impressions. This is an expert walkthrough, not a usability study with recruited students, and it does not claim individual review of all 45 presentation pages or every assistive technology.

The first-run agreement was inspected without accepting it. Subsequent exploration used the existing local preview fixture, which omits the notice in an isolated DOM without recording agreement. No application code or clinical content was changed during this review.

## Overall assessment

The consistent palette, clear topic headings, system grouping, first-action summaries, visible calibration and guided ECG explanations provide a good foundation. The main problem is the transition from reference reading to purposeful learning: the student is often choosing among tools without a clear next task, and some practice interactions provide weaker learning feedback than their presentation suggests.

## Highest-priority findings

### 1. Practice cases do not reliably test clinical reasoning

**Observed:** The Cyanosis handoff reads “A patient presents with Blue from lung, heart, or the blood itself?” It supplies no patient history, observations or vitals. The teaching point is already rendered before answering. Source inspection confirms all three questions pass correct index `0`, so the first option is always correct. Some alternatives are obvious fillers such as “Wait for a final diagnosis.”

**Impact:** A learner can succeed by recognizing option position, reading the teaching point, or rejecting an implausible option. The page promises a clinical reasoning case but functions more like a topic-summary quiz.

**Recommended change:** Author short, specific patient vignettes with information sufficient for each question. Use plausible distractors, shuffle choices while retaining stable answer IDs, and reveal explanations after committing. Explain both why the chosen answer fits and why alternatives do not. Keep completion and confidence separate.

**Evidence:** `assets/app.js`, `caseHtml()` around lines 610–634.

**Acceptance:** No answer is exposed before an attempt; correct positions vary; each clinical decision is supported by facts in its stem; keyboard and repeat attempts preserve consistent feedback.

### 2. Mobile ECG explanations and their highlights are disconnected

**Observed:** In Explorer at 390 px, selecting “P wave: atrial activity” leaves the explanation visible while the ECG is above the viewport. The focus action scrolls the inner paper only. The findings list has its own 150 px scrolling area, adding another scroll surface.

**Impact:** The student has to remember the explanation while searching for the circled feature elsewhere. The interactive connection is weakened even though the red circle itself works.

**Recommended change:** On mobile, show the selected explanation with a cropped/zoomed view of the target, or use a single ECG-focused panel with a compact explanation sheet. “Focus this finding” should bring the tracing into the outer viewport too. Keep the active finding visible when the list updates.

**Evidence:** `assets/ecg-explorer.js`, `locate()` and render/focus handling; `assets/app.css`, `.explorer-finding-list` mobile rule.

**Acceptance:** Tapping any finding shows both its explanation and marked region without manual searching or multiple independent scrolling gestures.

### 3. “Fit paper” does not fit the paper on a phone

**Observed:** At 390 px, the fit setting still displays a 720 px minimum-width canvas. Only part of the lead layout is visible. The first trace begins roughly 650 px down the initial screen because the heading and toolbar precede it.

**Impact:** The label promises a whole-paper overview, but the student sees a cropped tracing. Several controls dominate the first screen before the learning material appears.

**Recommended change:** Provide a genuine whole-paper overview with tap-to-inspect, retain a readable detail view, and label these modes explicitly. Compact the heading and put less-used controls in an options menu. Keep case selection and a single primary inspection action visible.

**Evidence:** `assets/app.css:4805`, `.explorer-canvas { min-width: 720px; }`; mobile screenshot walkthrough.

**Acceptance:** Overview shows all leads without horizontal scrolling; detail mode makes individual waves readable; the initial mobile viewport contains a useful tracing preview.

### 4. Explorer cases are absent from global search and cannot be resumed individually

**Observed:** Searching “Mobitz” returns the existing high-grade-block guide and red-flag text, not the dedicated Mobitz I/II Explorer cases. `buildSearchIndex()` indexes the guide but not the Explorer catalog. Explorer mount starts with normal sinus rhythm and the route identifies the section, not an individual case.

**Impact:** The student cannot go directly from a diagnosis query to its interactive tracing, bookmark that case, or reliably return to the case after reading the linked guide.

**Recommended change:** Index all Explorer case names and common aliases, label results “Interactive ECG,” and deep-link to the selected case. Restore the last case and finding on return. Keep practice answers out of URLs and persistent history.

**Evidence:** `assets/app.js`, `buildSearchIndex()` around line 1449; `assets/ecg-explorer.js:118`.

**Acceptance:** Searching Mobitz I, RBBB or torsades opens the corresponding Explorer case; Back returns to the same case and finding.

## Next-priority learning improvements

### 5. The new-student queue is a dead end

The empty Review queue explains scheduling but offers no suggested lesson or direct start action within the empty state. The home page emphasizes zero due and zero saved counts before the student has established a routine.

Offer “Start your first 10-minute session,” a small suggested foundational sequence, and “Continue where you left off.” Replace empty counters with useful first actions until the student has activity. Preserve the existing review scheduling once it is relevant.

### 6. Student and quick-reference priorities are mixed

Chest Pain opens with urgent summaries and expanded dangerous diagnoses/workup, while “How to think” is collapsed. This is useful for rapid reference but less helpful to a beginner trying to understand the approach. The ECG guide similarly begins with a shift-first summary before the seven-step teaching method.

Make the learning intent explicit. In Learn mode, start with a short objective and the reasoning approach, then reveal detail in a manageable sequence. Keep the existing Shift view available for concise reference. Do not hide clinically important warnings merely to reduce page density.

### 7. Navigation names and routes need a clearer relationship

The top navigation says “ECG” and “Explorer”; the sidebar says “ECG from scratch” and “ECG Explorer”; the guide also offers “Pattern library” and “Dynamic ECG.” Study contains another “Practice case,” while Explorer has “Practice mode.”

Use a consistent map: **ECG Guide** for learning the method, **ECG Explorer** for studying tracings, and **ECG Practice** for attempting cases. Keep these experiences linked, with a brief purpose statement and an obvious next step. Label Shift as a quick-reference view where space allows.

### 8. Review completion says little about understanding

“Mark reviewed” is available before recall attempts, and Explorer practice has reveal but no confidence rating, missed-case queue or per-case progress. This is not a software failure, but it limits the value of the study experience.

Add a simple self-assessment after reveal—“Got it,” “Partly,” “Review again”—with an explanation that it is self-rated. Track weak cases and offer a focused follow-up session. Do not label self-report as objectively demonstrated mastery.

## Smaller distractions and polish

- **Repeated urgency decoration:** Red dots, red borders and CRITICAL pills repeat across many cards. Retain text severity and necessary warnings, but reduce redundant decoration so the highest-priority information is easier to find.
- **Abbreviations before explanation:** Chest Pain introduces several abbreviations in the first screen. Add optional inline definitions or a glossary rather than expanding every paragraph permanently.
- **Mixed controls menu:** Severity filtering, text size, boldness, dark mode and six color themes share one icon-only menu. Separate contextual filters from reading settings; place decorative theme choices lower in settings.
- **Small secondary text and dense columns:** Metadata and descriptions look subdued, and three-column diagnosis cards encourage scanning rather than sustained reading. Verify contrast numerically before claiming conformance, and test a larger reading preset with a comfortable line length. This walkthrough is not a WCAG contrast certification.
- **Inconsistent action styling:** “Save note” appears with a red outline even though it is a normal positive action. Use a stable primary/secondary/destructive button system.
- **First-run notice:** On a 390 × 844 screen, the notice takes almost the entire viewport and the bottom action is partly below the visible area. Preserve the substantive notice and consent requirement; improve its scrolling/CTA visibility and distinguish the short purpose statement from supporting detail.

## Suggested implementation order

1. Repair practice validity and answer reveal.
2. Keep mobile ECG targets and explanations together; make overview/fit behavior truthful.
3. Add Explorer search results, case deep links and return-state restoration.
4. Add a beginner start path, meaningful empty states and session continuation.
5. Clarify Learn/Reference/Practice navigation and progress.
6. Refine text hierarchy, button semantics, settings and decorative density.

Verify changes using real student tasks: start a first lesson; find and explain Mobitz I; leave for the guide and return; answer a case without seeing the answer; review a missed case on a phone. Measure whether the student completes the task and understands the feedback, not merely whether each button responds.

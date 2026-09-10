# Complete learning experience — 10 September 2026

Release: `20260910-complete-r7`; service-worker cache revision: `v166`.

## What changed

| Area | Implemented experience |
| --- | --- |
| Navigation | Learn / Practice / Reference entry cards on the home page; Practice opens the new workspace. ECG Guide and Explorer remain direct destinations. Search includes all new cases, modules and backup tools. Existing URLs and study queues continue to work. |
| Evolving cases | Six fictional cases across resuscitation, trauma, pediatrics, early pregnancy, toxicology and behavioral emergencies. Each has three sequential decisions, shuffled options, explanations for every choice, a debrief and a linked presentation/source. Subsequent updates describe the teaching team's actions independently of the learner's answer. |
| Continuity | An unfinished evolving case can be resumed during the same page session. Completed attempts save latest first-choice accuracy and run count. Session-only state is clearly distinguished from stored state. |
| Reassessment | All 45 presentation disposition sections have a consistent reassessment, reconsideration, escalation and transition checklist. These are learning prompts, not discharge rules. Red-flag counts no longer act as severity thresholds. |
| Learning depth | The first update's optional Core / Applied / Advanced panel remains available, now under Recall & notes instead of above clinical content. It changes prompts, never access to safety information. |
| Visual learning | Four lessons: two arterial blood-gas examples, schematic lung-ultrasound artifacts, schematic chest markings, and three selectable pairs of existing ECG examples. Static/synthetic limitations are explicit. No patient recordings were added. |
| Procedures | Three preparation modules: procedural sedation, cardioversion team preparation and chest emergencies. These cover preparation, team roles and reassessment rather than claiming technical skill certification. |
| Team skills | Three exercises: SBAR handover, resuscitation huddle/debrief and teaching a difficult decision. Each includes a discussion question and a model explanation. |
| Evidence | New modules link supporting sources and identify the check date and scope. Six presentations include contextual guidance on applying sources. Existing source checks retain their actual date; topics without a mapped check say so. |
| Progress | Latest scored case attempts and reading activity are displayed separately. Incorrect first choices suggest cases to revisit. Existing confidence ratings, topic review queues, saved topics and ECG progress stay separate and accessible. |
| Backup | Export saved free learning data, notes and preferences to JSON. Import validates the file, previews the operation and adds missing records while preserving existing values on conflicts. Failed writes attempt restoration of original values and report failure. |

The original 12 short clinical cases, 47 ECG Explorer examples, notes, favorites and spaced-review queues remain available. This is a practical starter library across the requested areas, not a claim of complete coverage of every EM competency.

## Data and safeguards

New case results and read markers use only `em-workspace-progress-v1`. Backups use an explicit seven-key free-app allowlist; they do not enumerate origin storage, touch another application's data or transfer a clinical agreement. Imported objects are bounded in size/depth and checked for unsafe properties and invalid state. Existing notes win conflicts. Backups include saved data only and may contain personal study notes; no free-text patient records or evolving-case narrative responses are collected by the new workflow.

All runtime assets remain local and precached. New scripts are covered by the same relative release URLs, installation-scoped worker and MIME validation as existing scripts. No accounts, network services, new package dependencies or paid content were introduced.

## Clinical scope

These are original educational scenarios and preparation exercises. Supporting guidance was checked against AHA resuscitation guidance, NICE major trauma/bronchiolitis/early pregnancy/self-harm recommendations, ACEP ultrasound/sedation guidance, AHRQ TeamSTEPPS, ESC ACS guidance, Radiology Assistant teaching and the French expert-panel metabolic-acidosis guidance. Exact links are carried by each module in `assets/em-learning-data.js`.

They have not received independent clinician sign-off. Source checks are not represented as peer review, procedural credentialing or validated assessment. Procedural execution requires supervised practical training. Real radiographs, ultrasound clips, additional patient ECG datasets and physical-device validation are not part of this release. Schematic examples are explicitly labeled and existing calibrated ECG models are reused without changing their waveforms.

## Verification

- 94 Node tests passed. New coverage checks case structure, scoring records, storage failure, backup allowlisting, conflict preservation, rollback after failed multi-key import, hostile input rejection and search metadata.
- New browser audit passed at 1280, 390 and 320 px: all six cases with both correct and incorrect choices; disclosure gating; same-session resume; all six preparation/team modules; all four visual lessons and three ECG pairs; search; backup download/preview/merge; offline reopening and storage failure. No JavaScript errors or horizontal page overflow.
- Existing broad audit: 230 route/layout checks and 152 student-journey assertions passed.
- Local Apache root, Apache subfolder and official Cloudflare Pages runtime: 21 URL status/MIME/cache/security-header checks each (63 total). Pages parsed all 15 header rules. Full new workflows/offline checks also passed on Apache subfolder at 390 px and Pages root at 320 px.
- A real local-browser upgrade from r6/v165 to r7/v166 preserved saved notes, ECG learning and attempts, and an unrelated installation's cache, then reopened four routes offline.
- Header audit exposed hidden labels at the 921 px breakpoint; the responsive CSS was corrected; all 1,100 header checks then passed.

Mobile checks use browser emulation. Live Hostinger/Cloudflare domains, physical iOS/Android devices and a complete screen-reader audit remain unverified. No deployment was performed.

## Safe reversal

Two reverse patches are supplied. They were generated against the actual working snapshots, including earlier uncommitted changes, rather than against an unrelated Git commit.

Undo only the larger workspace update, retaining the first guided panel update:

```sh
git apply --check docs/rollback-complete-workspace.patch
git apply docs/rollback-complete-workspace.patch
```

Undo both learning updates, returning to the state before the first guided panel:

```sh
git apply --check docs/rollback-all-learning-changes.patch
git apply docs/rollback-all-learning-changes.patch
```

Choose one, not both. If a check reports conflicts after further edits, stop and reconcile them; do not force a reset. The patches restore the runtime/test files and leave audit reports and patches for reference. They do not alter browser storage. A new preference or progress key simply becomes unused after rollback.

For a deployed rollback, publish the restored runtime with fresh asset tokens and a higher worker revision, then verify the PWA update. The reverse patches restore source; uploading an old cache revision is not a reliable installed-app rollback strategy.

## Upload artifact

`/tmp/EM-Pocket-20260910-complete-r7.zip` contains 24 runtime files, with every archived byte checked against the working files. Development files, tests, reports and rollback patches are excluded.

SHA-256: `7a8b8944fb29ea537fb88117ca44df321a0fcbd6d90eec161872cce9f33343d6`.

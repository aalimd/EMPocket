# Seven-area UI/UX completion review

Final release: `20260910-complete-r10`, service-worker cache `v169`.

This pass starts from the user's r8 edits. The medical SVG icons, presentation/search layout and badge shapes are preserved. No paid application or paid storage keys are accessed.

| Area | Implemented experience | Scope |
| --- | --- | --- |
| 1. Learning depth | Optional Core / Applied / Advanced prompts now include presentation-specific approach, disposition or pitfalls to compare against. Case objectives follow the selected depth. | All 45 presentation pathways remain accessible; level selection does not hide safety content or certify competence. |
| 2. Evolving decisions | Six three-stage cases, explained alternatives, debrief and latest-attempt results; unfinished choices survive reload within the browser tab. Filters expose unfinished, new and incorrect cases. | Six domains plus the existing 12 short cases and ECG practice; this is not a complete EM curriculum. |
| 3. Reassessment / disposition | Consistent reassessment and handover prompts now include each presentation's own warning signs and links to its disposition pathway. | Prompts supplement the complete pathway; they are not stand-alone discharge criteria. |
| 4. Visual interpretation | Five lessons: gases, lung ultrasound schematic, chest schematic, synthetic ECG comparisons, and four real anonymized ECG recordings. Recorded ECGs expose all 12 leads and three overlapping time windows, with source labels hidden until revealed. | Lung/chest material remains schematic. Recorded ECGs are not accompanied by acute clinical scenarios. |
| 5. Procedures / teams | Six preparation modules covering sedation, cardioversion, thoracic procedures, handover, leadership and teaching. Each has a rehearsal checklist, explanation exercise and source. | Checkboxes are temporary preparation rehearsal, not skill sign-off or a bedside procedural checklist. |
| 6. Evidence / progress | Sources disclose scope and review limitations; reading and scored decisions stay separate. Progress links to an incorrect case. Validated backup preview/import preserves current values on conflicts. | Backup covers saved free-app data; temporary case sessions are excluded. No independent clinician review is claimed. |
| 7. UI / continuity | Compact detail headers, correct Learn/Practice active navigation, review filter empty state, feedback focus for keyboard users, readable count badges and calibrated horizontally scrollable ECG plots. Offline bundle includes recordings and licence. | Browser-emulated mobile checks do not replace physical-device or assistive-technology testing. |

## Recorded ECG provenance

Four PTB-XL 1.0.3 records: 00003, 00007, 04117 and 04401. Original WFDB 500 Hz, 12-lead, 10-second integer samples were converted to local JavaScript microvolt arrays without filtering or resampling. Every lead's initial value and WFDB checksum was checked against the downloaded header. An automated test reconstructs all four original binary files and verifies SHA-256 hashes stored with the records. No demographics are shipped.

The first two records carry source normal/sinus labels, the latter two an atrial-fibrillation label. Source labels are not independent clinical adjudications by this project. The complete CC BY 4.0 licence is shipped at `assets/ptb-xl-LICENSE.txt`; attribution, dataset DOI, original publication and PhysioNet citation appear in the lesson.

Source: https://physionet.org/content/ptb-xl/1.0.3/

## Recovery

`rollback-ui-completion.patch` reverses this pass to the user's exact r8 source state. It preserves the user's preceding icon/search edits. Run a dry check first:

```sh
git apply --check docs/rollback-ui-completion.patch
git apply docs/rollback-ui-completion.patch
```

Do not force the patch if later edits conflict. The full pre-pass snapshot also exists at `/tmp/EM-Pocket-before-ui-completion.zip`. Older rollback patches in this directory describe earlier releases and must not be blindly applied to this release. Source rollback does not delete study progress. If publishing a rollback, assign a fresh release token and worker revision together so installed clients update safely.

## Verification

Verification results and the final runtime package checksum are recorded below after the final checks. Local Apache and Cloudflare Pages emulation are compatibility tests, not evidence of a live deployment. Live deployment URLs, physical iOS/Android checks and independent clinical sign-off remain outside the verified scope.

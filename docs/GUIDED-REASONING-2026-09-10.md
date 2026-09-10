This first-update report is historical. For the current combined changes and working rollback options, see [the complete experience report](COMPLETE-LEARNING-EXPERIENCE-2026-09-10.md).

# Optional guided reasoning

Added an optional, initially collapsed learning panel to all 45 presentation pages. Core prompts support a structured assessment; Applied prompts cover decisions, reassessment and disposition; Advanced prompts support uncertainty, evidence appraisal and teaching. Links open the corresponding existing topic section. No new clinical recommendations, doses, cases or claims of advanced competency were introduced.

The selected depth uses a separate free preference, `em-learning-focus-v1`. Existing notes, progress and ECG state are unchanged. A failed storage write retains the selection during navigation for the session. All clinical sections remain available regardless of depth. ECG retains its existing dedicated curriculum.

Release: `20260910-guided-r6`, service-worker revision `v165`. Hosting architecture is unchanged.

## Reversal

The snapshot was taken from the actual working files before this change, including earlier uncommitted work. Do not use a broad Git reset to undo this feature.

From this repository, verify the reverse patch first:

```sh
git apply --check docs/rollback-guided-reasoning.patch
```

If the check succeeds, apply it to undo only this update:

```sh
git apply docs/rollback-guided-reasoning.patch
```

The patch restores modified implementation, release references and the added unit test to their pre-feature state. It leaves this report and the reverse patch for reference. It does not remove browser storage or saved progress. The extra preference is harmless when unused. If later edits cause a conflict, stop and reconcile the patch rather than forcing it.

This is a source rollback. If this release has already been deployed, publish the restored runtime as a new coordinated release with fresh asset tokens and a higher worker revision, then verify the installed-app update. Do not rely on overwriting a live deployment with stale cached assets.

A second backup of the pre-change files is available at `/tmp/EM-Pocket-before-guided-reasoning.zip`; copy it somewhere durable if desired. The repository reverse patch is the durable undo record.

## Verification

- 87 Node tests passed, including learning-depth validation, escaping and storage-failure behavior.
- Reverse patch passes `git apply --check`; working diff passes `git diff --check`.
- Browser checks cover all 45 topic pages at 1280, 390 and 320 px, all three depth controls, linked section opening, reload persistence, keyboard activation, dark mode, storage failures and absence of the panel on the ECG guide.
- Browser onboarding was omitted only in an isolated test DOM; no agreement was accepted or saved. Mobile checks use Chrome emulation, not physical devices.
- This change has not been deployed or checked on public hosting.

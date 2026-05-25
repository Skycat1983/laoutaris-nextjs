# T-262 Reconcile Recalibration Trackers

Status: Completed

Workstreams:

- [All workstreams](../workstreams/README.md)

## Goal

Reconcile the shared documentation trackers after A-026, A-028, A-030, A-031,
A-032, and A-033 so orchestration no longer points agents at completed,
superseded, or stale work.

## Context

- A-026 found the current orchestration state still recommends A-026 and T-261
  even though A-026 is now completed and T-261 is already completed.
- A-026 also found task-index drift for T-220 through T-229, including two
  distinct T-221 task files, workstream index status drift, audit status
  vocabulary drift, and findings-register status taxonomy drift.
- A-027 is still not completed; do not mark it completed.
- A-029 is superseded and replaced by A-030 through A-033.

## Scope

In scope:

- Update `docs/audits/goals.md` and `docs/audits/results/README.md` statuses for
  the completed/superseded recalibration audits.
- Update `docs/orchestration/state.md` so the next action no longer assigns
  A-026, A-029, or T-261 as new work.
- Update `docs/tasks/README.md` for T-220 through T-229 if those task briefs are
  canonical; resolve or explicitly document the duplicate T-221 task ID.
- Update `docs/workstreams/README.md` so status values match the individual
  workstream briefs.
- Normalize obvious status vocabulary drift when it is low-risk and
  documentation-only.
- Leave clear candidate rows for findings/risk updates if full reconciliation
  would be larger than this task.

Out of scope:

- Runtime code changes.
- Implementing findings from A-028/A-030/A-031/A-032/A-033.
- Changing owner-blocked monitoring, incident, smoke-account, or legal policy.

## Concurrency

This docs-only tracker task should run before broad implementation waves. It can
run in parallel with T-263 because they touch different files. Avoid running it
with any other task that edits shared tracker indexes, orchestration state, or
workstream status sections.

This task owns the shared tracker edits named in Scope.

## Files Likely Touched

- `docs/audits/goals.md`
- `docs/audits/results/README.md`
- `docs/orchestration/state.md`
- `docs/tasks/README.md`
- `docs/workstreams/README.md`
- Possibly old task/result files with status-only normalization

## Completion Contract

- Mark this task `Status: Completed` only after shared trackers are internally
  consistent enough for the next orchestrator action.
- Add dated handoff notes with exact tracker changes and any intentionally
  deferred reconciliation.
- Update `docs/tasks/README.md` for this task.
- Leave unrelated dirty files alone.

## Acceptance Criteria

- A-026, A-028, A-030, A-031, A-032, and A-033 are marked completed in shared
  audit trackers; A-025 and A-029 remain superseded; A-027 remains not completed.
- `docs/orchestration/state.md` points to current next tasks instead of A-026,
  A-029, or T-261 implementation.
- Workstream index statuses match their individual briefs.
- T-220 through T-229 task-index drift and the duplicate T-221 ID are either
  corrected or explicitly documented as deferred with the exact blocker.

## Verification

```bash
git diff --check
rg -n "details: docs/audits/goals.md#a-026|details: docs/audits/goals.md#a-029|details: docs/tasks/T-261" docs/orchestration/state.md docs/audits/goals.md docs/tasks/README.md
```

## Handoff Notes

- Planned after A-026 found shared tracker drift during recalibration.
- Completed on 2026-05-25.
- Synced shared audit trackers:
  - `docs/audits/goals.md` now marks A-026, A-028, A-030, A-031, A-032, and
    A-033 `Completed`, keeps A-025 and A-029 `Superseded`, and leaves A-027 as
    `Not started`.
  - `docs/audits/results/README.md` now matches those statuses.
- Updated `docs/orchestration/state.md` so the next action no longer assigns
  A-026, A-029, T-261, T-262, or already-completed T-263 as new work. It now
  points to A-027 for a fresh verification-gate audit or T-264 through T-266
  for implementation work.
- Updated `docs/tasks/README.md` to add the canonical T-220 through T-229 rows
  and explicitly document the two historical T-221 briefs by title/path without
  renaming either file.
- Updated `docs/workstreams/README.md` so every listed workstream status matches
  its individual brief: all active.
- Normalized low-risk status vocabulary drift in older audit/task briefs and
  added explicit findings-register status values so `Partially mitigated` is a
  documented status instead of an implicit one.
- Deferred full findings/risk/workstream reconciliation for A-028, A-030,
  A-031, A-032, and A-033 candidate rows. The result files keep those candidate
  rows, and the current task track contains the agent-actionable follow-ups:
  T-263 is already completed, while T-264 through T-266 remain planned.
- Verification:
  - `git diff --check` passed.
  - `rg -n "details: docs/audits/goals.md#a-026|details: docs/audits/goals.md#a-029|details: docs/tasks/T-261" docs/orchestration/state.md docs/audits/goals.md docs/tasks/README.md`
    returned no matches.
  - `rg -n "^Status: (Complete$|Complete\\.|Completed\\.|Completed [0-9]|Done$|Ready$)" docs/tasks docs/audits/results docs/audits/goals.md`
    returned no matches.

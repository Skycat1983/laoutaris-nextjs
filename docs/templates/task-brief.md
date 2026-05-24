# Task Brief

Status: Planned

Workstream: link to workstream brief.

## Goal

One concrete outcome.

## Context

- Facts needed before editing.

## Scope

- In scope.
- Out of scope.

## Concurrency

- State whether this task can run in parallel with other active tasks.
- If assigned in parallel, name the files this task owns and list shared
  trackers that must be left to orchestrator reconciliation.
- Shared trackers include `docs/orchestration/state.md`,
  `docs/audits/findings-register.md`, `docs/risks/production-readiness.md`,
  `docs/workstreams/*`, and index files unless explicitly assigned.

## Files Likely Touched

- `path/to/file`

## Completion Contract

- Mark this task `Status: Completed` only after implementation, docs, and
  verification are done.
- Add dated completion notes under `Handoff Notes` with what changed, what
  remained intentionally out of scope, and exact verification results.
- Update `docs/tasks/README.md` if task status, purpose, or follow-up task
  links changed.
- Update the relevant workstream `Progress` and `Next Agent Action` sections
  only when this task explicitly owns those shared edits.
- Update architecture, runbook, decision, risk, or findings-register docs only
  when behavior changed or the task explicitly assigns those tracker edits.
- If shared trackers are not owned by this task, list the tracker updates the
  orchestrator should make in `Handoff Notes` instead of editing them.
- Leave unrelated dirty files alone and mention any pre-existing dirty or
  untracked files that affected the task.

## Acceptance Criteria

- Expected behavior.

## Verification

```bash
npm test
```

## Handoff Notes

- What changed.
- What remains.

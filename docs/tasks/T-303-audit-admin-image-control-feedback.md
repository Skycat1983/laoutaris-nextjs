# T-303 Audit Admin Image Control Feedback

Status: Completed

Workstreams:

- [Content Assets And Admin Ops](../workstreams/content-assets-and-admin-ops.md)

## Goal

Scope the remaining A-031 blog and collection image-control feedback gap.

## What This Does

This task audits the current blog and collection admin image URL controls,
including create/update forms, shared validation, preview behavior, error
surfaces, and Cloudinary/allowed-host policy touchpoints. It should produce a
small implementation recommendation for pre-submit image feedback or explain
why a full media picker should remain deferred.

## Why This Exists

F-137 remains converted but unimplemented: blog and collection image controls
still rely on URL paste with submit-time allowlist validation. T-271 added
artwork replacement-image upload, and T-272 improved relationship feedback, so
the next admin-control candidate is a focused audit of blog/collection image
feedback rather than another broad admin media task.

## Parallel Assignment Rules

This task is safe to run in parallel with T-301 and T-302 because it should not
edit runtime code or shared trackers. During the parallel run, update only this
task file and the new result artifact. List candidate shared tracker updates in
the handoff notes for orchestrator reconciliation.

## Scope

In scope:

- Inspect current admin blog and collection create/update image fields,
  validation schemas, route validation, allowed-host feedback, and any preview
  behavior.
- Compare those controls with the completed artwork replacement-image workflow
  only enough to identify reusable patterns.
- Create `docs/audits/results/T-303-admin-image-control-feedback.md` with:
  - current form/control behavior;
  - operator failure modes;
  - recommended narrow implementation slice;
  - whether a media picker, Cloudinary upload reuse, or pre-submit URL feedback
    should come first;
  - verification requirements for a future task.

Out of scope:

- Do not edit admin forms, routes, schemas, Cloudinary upload behavior,
  validation logic, runtime source, tests, assets, or product data.
- Do not implement a media picker, signed upload changes, Cloudinary deletion,
  image migration, or broader admin relationship search.
- Do not touch comment/user search filters unless only noting why they remain
  separate under F-138.

## Concurrency

This task owns only:

- `docs/tasks/T-303-audit-admin-image-control-feedback.md`
- `docs/audits/results/T-303-admin-image-control-feedback.md`

Do not edit shared trackers or indexes during the parallel run.

## Completion Contract

- Mark this task `Status: Completed` only after the result artifact is written
  and verification passes.
- Record exact files inspected and source-search commands.
- Include candidate tracker/workstream updates and any implementation brief
  proposal in handoff notes.

## Acceptance Criteria

- The audit identifies current blog and collection image control behavior with
  file references.
- It recommends one narrow next implementation slice or explains why the work
  should remain deferred.
- It keeps comment/user search, Cloudinary lifecycle policy, and full media
  picker work separate unless specifically recommended as a later task.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 as one of three parallel-safe scoping tasks after
  T-300 completed the A-014 source-pruning sequence.
- Completed on 2026-05-26 with result artifact
  [T-303-admin-image-control-feedback.md](../audits/results/T-303-admin-image-control-feedback.md).
- The audit found persistence validation is already protected by the shared
  content image URL schemas and admin route validation. The remaining gap is
  operator-facing pre-submit feedback and preview gating for blog/collection
  image URL inputs.
- Recommended next implementation brief: add a shared client-side content image
  URL feedback/preview guard to blog create/update and collection create/update
  forms, reusing the existing allowed-host policy helper. Defer full media
  picker and generic Cloudinary upload reuse.
- Candidate shared tracker updates for orchestrator reconciliation: keep F-137
  converted with T-303 as the scoping artifact, add the narrow pre-submit
  feedback implementation slice to the content/admin workstream backlog, and do
  not update production risks because persistence is already protected.
- Verification: `git diff --check` passed. Because both owned T-303 files are
  untracked in the current dirty worktree, direct
  `git diff --no-index --check /dev/null ...` checks were also run for the task
  file and result artifact; they produced no whitespace errors and exited `1`
  only because the files differ from `/dev/null`.

# T-184 Audit TypeScript noEmit Test Errors

Status: Completed

Workstream:
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Produce a concise audit of the existing TypeScript `noEmit` failures so future
cleanup can be split safely instead of guessing from a large error dump.

## Context

- T-182 noted that `npx tsc --noEmit --pretty false --skipLibCheck` fails on
  existing unrelated test type errors.
- Normal task verification still uses focused Jest tests, lint, and build. This
  audit does not make strict `noEmit` checking a release gate.
- Before assigning fixes, the project needs to know whether the failures are
  isolated test mock typing issues, outdated helper contracts, real source
  typing drift, or a mix of those categories.

## Scope

In scope:

- Run `npx tsc --noEmit --pretty false --skipLibCheck` and capture only the
  concise error categories, representative file paths, and counts needed for
  follow-up planning.
- Identify which failures appear test-only and which, if any, point to runtime
  source contract drift.
- Recommend a small follow-up sequence for fixes if the failures are too broad
  for one safe task.
- Update this task handoff with the audit summary and candidate tracker updates.

Out of scope:

- Do not fix TypeScript errors in this task unless the failure is a single
  obvious typo in this task brief.
- Do not change `tsconfig`, Jest config, Next config, package versions, or CI
  gates.
- Do not edit shared trackers while running in parallel.
- Do not paste full compiler output into docs.

## Concurrency

This task can run in parallel with owner-review or design-decision work because
it is read-only for code and owns only this task brief handoff. If an audit
result file is useful, create it under:

- `docs/audits/results/T-184-typescript-noemit-test-errors.md`

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `docs/tasks/T-184-audit-typescript-noemit-test-errors.md`
- optional `docs/audits/results/T-184-typescript-noemit-test-errors.md`

## Acceptance Criteria

- The task records whether the current TypeScript `noEmit` failure set is
  test-only, runtime-source related, or mixed.
- The summary includes representative files, error categories, and enough counts
  to split follow-up work.
- The task recommends the next smallest safe implementation task, or states that
  no cleanup is currently worth assigning.
- No runtime code, tests, configuration, package metadata, or CI behavior is
  changed.

## Verification

```bash
npx tsc --noEmit --pretty false --skipLibCheck
git diff --check
```

## Agent Prompt

You are working on T-184. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the T-182/T-183 handoffs. Run `npx tsc --noEmit --pretty false
--skipLibCheck`, then summarize the existing TypeScript failures into concise
categories with representative files and counts. Do not fix the errors, change
TypeScript/Jest/Next/package configuration, or edit shared trackers. Avoid
pasting the full compiler output into docs. Update only this task handoff, and
optionally add `docs/audits/results/T-184-typescript-noemit-test-errors.md` if
that makes the audit easier to read. Finish with a recommended next small task
or state that no cleanup should be assigned yet.

## Handoff Notes

- Planned after T-183 completed the admin read pagination-control extraction.
- Completed on 2026-05-20.
- Ran `npx tsc --noEmit --pretty false --skipLibCheck`; it failed with 46
  top-level diagnostics across 18 files.
- The current failure set is test-only. Every top-level diagnostic path is under
  `__tests__/`; no `src/` runtime source file appeared in the compiler error
  list.
- Added the concise audit result at
  `docs/audits/results/T-184-typescript-noemit-test-errors.md`.
- Main categories:
  - 20 stale navigation DTO fixture errors: article mocks still include stale
    `linkTo` fields, and collection mocks omit current `_id`/`artworks`
    fields.
  - 13 over-narrow fixture typing errors from test objects cast to `never` and
    later spread or accessed for `shopifyProducts`.
  - 8 admin read-route test handler cast errors where the shared test `Handler`
    type does not model required detail route params.
  - 5 isolated test-helper typing issues covering readonly `NODE_ENV` mutation,
    a `dbConnect` mock return type, a partial Cloudinary widget mock, and
    `Set` iteration in the import-boundary test.
- Recommended next small task: fix the navigation DTO test fixtures first. That
  is the largest coherent group, appears stale-test-data-only, and should not
  require runtime behavior, config, package, or CI changes.
- Candidate tracker update: add a testing-quality cleanup task for the
  remaining `noEmit` test typing debt after the navigation DTO fixture task is
  complete; keep `noEmit` out of the release gate until the test-only backlog is
  cleared.

# T-277 Stabilize Admin Jest Full-Run Timeouts

Status: Planned

Workstream: [Testing and quality](../workstreams/testing-and-quality.md).

## Goal

Stabilize the admin pagination/form suites that pass in-band but time out during
the full concurrent Jest run.

## Context

A-034 found four suites that passed in-band but timed out in full `npm test`:

- `__tests__/unit/adminCollectionReadPagination.test.tsx`
- `__tests__/unit/adminArticleReadPagination.test.tsx`
- `__tests__/unit/adminBlogReadPagination.test.tsx`
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`

The in-band rerun passed 26 tests in about 69 seconds, so this is likely
full-run contention, slow async setup, or test worker pressure rather than
assertion drift.

## Scope

In scope:

- Profile the scoped suites under default and in-band Jest execution.
- Reduce unnecessary async work, improve mocks/waits, or add deliberate suite
  timeout/worker policy only where justified.
- Preserve admin read pagination and article/blog form behavior.

Out of scope:

- Fixing the deterministic A-034 assertion drift covered by T-276.
- Public smoke socket handling covered by T-280.
- Broad Jest or CI redesign unless the evidence shows a small config change is
  the safest fix.

## Concurrency

Can begin in parallel for profiling, but final full-suite verification should
wait until T-276 has landed so deterministic failures do not mask timeout
progress. Coordinate with agents editing the scoped admin tests.

## Files Likely Touched

- `__tests__/unit/adminCollectionReadPagination.test.tsx`
- `__tests__/unit/adminArticleReadPagination.test.tsx`
- `__tests__/unit/adminBlogReadPagination.test.tsx`
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- Jest config or setup files only if evidence supports it
- `docs/tasks/T-277-stabilize-admin-jest-full-run-timeouts.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the scoped suites are stable
  under the selected Jest execution mode and the full-run impact is recorded.
- Update `docs/tasks/README.md`.
- Record any remaining full-suite failures separately instead of widening this
  task.

## Acceptance Criteria

- The four scoped admin/form suites no longer hit the 5s timeout failure class
  in the relevant full-run or equivalent contention check.
- Any timeout or worker-policy change is explained with evidence.
- Admin behavior assertions remain meaningful and are not weakened to hide slow
  failures.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/adminCollectionReadPagination.test.tsx __tests__/unit/adminArticleReadPagination.test.tsx __tests__/unit/adminBlogReadPagination.test.tsx __tests__/unit/forms/adminArticleBlogForms.test.tsx
npm test -- --runInBand --runTestsByPath __tests__/unit/adminCollectionReadPagination.test.tsx __tests__/unit/adminArticleReadPagination.test.tsx __tests__/unit/adminBlogReadPagination.test.tsx __tests__/unit/forms/adminArticleBlogForms.test.tsx
npm test
git diff --check
```

If full `npm test` cannot be run in the agent environment, record the exact
constraint and the strongest completed substitute.

## Handoff Notes

- Planned from A-034 admin/form timeout class.

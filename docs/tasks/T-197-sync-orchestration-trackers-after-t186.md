# T-197 Sync Orchestration Trackers After T-186

Status: Completed

Workstream:
[Testing And Quality](../workstreams/testing-and-quality.md),
[Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Bring shared orchestration trackers back into agreement after T-186 completed
and after framed-print preview work advanced through T-193, without changing
runtime source.

## Context

- `docs/tasks/T-186-fix-never-typed-test-fixtures.md` is completed and records
  that the over-narrow `never` fixture group is gone.
- `docs/tasks/README.md`, `docs/orchestration/state.md`, and
  `docs/workstreams/testing-and-quality.md` still describe T-186 as planned or
  next.
- The next assignable work should not point agents back at T-186. It should
  distinguish owner/design work from owner-independent quality cleanup.
- The framed-print preview implementation plan reserves T-194 through T-196 for
  framed-preview review, Shopify option mapping, and physical-dimension work.

## Scope

In scope:

- Update the T-186 row in `docs/tasks/README.md` from planned to completed with
  a concise outcome.
- Update `docs/orchestration/state.md` so the current and next-action sections
  no longer describe T-186 as the next runnable task.
- Update `docs/workstreams/testing-and-quality.md` so its next action reflects
  that T-186 is complete and routes the next noEmit cleanup to T-198.
- Preserve the existing owner-blocked statuses for T-139, T-143, homepage
  production migration, monitoring-provider implementation, and Shopify option
  mapping.
- Mention T-194 as the next framed-preview review task only if the framed
  preview track is being continued.

Out of scope:

- Do not edit runtime source, tests, package configuration, or generated assets.
- Do not perform the T-198 TypeScript cleanup.
- Do not create or run T-194 visual QA.
- Do not resolve owner decisions for monitoring, public search scope, homepage
  migration, Shopify checkout, or frame commerce mapping.
- Do not change finding or risk statuses unless the docs already contain direct
  evidence that a status is wrong.

## Concurrency

Run this task alone for shared tracker edits. It can run in parallel with a code
task only if that task does not edit:

- `docs/orchestration/state.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Files Likely Touched

- `docs/orchestration/state.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`
- this task brief handoff section

## Acceptance Criteria

- Shared trackers no longer say T-186 is planned or next.
- T-186 remains recorded as completed with its strict TypeScript follow-up
  summary.
- The next owner-independent quality cleanup points to T-198.
- Owner-decision-gated work remains blocked rather than guessed.
- No runtime files are changed.

## Verification

```bash
rg -n "T-186 is the next|next runnable task is:|\\| \\[T-186.*\\| Planned \\|" docs/orchestration/state.md docs/workstreams/testing-and-quality.md docs/tasks/README.md
rg -n "T-186.*Completed|T-198|noEmit" docs/orchestration/state.md docs/workstreams/testing-and-quality.md docs/tasks/README.md
git diff --check
```

The first `rg` command should return no stale planned/next references. The
second should show the intended completed/follow-up references.

## Agent Prompt

You are working on T-197. Read `AGENTS.md`, `docs/README.md`,
`docs/orchestration/orchestrator-guide.md`, this task brief, T-186, and the
current task index. Update only the shared tracker docs needed to stop agents
from reassigning T-186 and to point the next owner-independent noEmit cleanup at
T-198. Preserve owner-blocked decisions. Do not edit runtime source, tests,
package configuration, risk/finding statuses, or framed-preview implementation.
Run the verification commands and update this handoff.

## Handoff Notes

- Prepared after orchestration review found stale T-186 references in the task
  index, orchestration state, and testing workstream.
- Completed on 2026-05-22. Updated `docs/tasks/README.md`,
  `docs/orchestration/state.md`, and
  `docs/workstreams/testing-and-quality.md` so T-186 is completed rather than
  planned or next, and T-198 is the next owner-independent strict TypeScript
  `noEmit` cleanup.
- Preserved owner-blocked decision gates for T-139, T-143, homepage production
  migration/semantic style adoption, monitoring-provider implementation, and
  Shopify option mapping. Framed-preview continuation remains T-194 visual QA
  and owner review before Shopify option mapping, checkout/cart work, enquiry
  mutation, or physical-dimension migration.
- Verification:
  - `rg -n "T-186 is the next|next runnable task is:|\\| \\[T-186.*\\| Planned \\|" docs/orchestration/state.md docs/workstreams/testing-and-quality.md docs/tasks/README.md`
    returned no matches.
  - `rg -n "T-186.*Completed|T-198|noEmit" docs/orchestration/state.md docs/workstreams/testing-and-quality.md docs/tasks/README.md`
    showed the expected completed T-186 row and T-198/noEmit follow-up
    references.
  - `git diff --check` passed.

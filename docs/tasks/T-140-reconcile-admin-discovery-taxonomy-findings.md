# T-140 Reconcile Admin Discovery Taxonomy Findings

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Reconcile the remaining A-011, A-017, and A-018 candidate findings into shared
trackers and prepare the next implementation task briefs from the highest-priority
reconciled gaps.

## Context

- A-011, A-017, and A-018 are complete, but their result files still contain
  candidate findings that have not been fully promoted into the findings
  register, production risks, and workstream backlogs.
- T-134 through T-138 completed selected high-confidence follow-ups from those
  audits.
- T-139 remains blocked until an owner/platform monitoring provider decision or
  explicit no-provider interim policy exists.
- The next high-confidence implementation slice is likely admin user deletion
  protection for current-admin and last-admin lockout, but it should be
  assigned only after the shared trackers reflect the full A-011/A-017/A-018
  backlog.

## Scope

In scope:

- Read and reconcile candidate findings from:
  - `docs/audits/results/A-011-admin-content-operations.md`;
  - `docs/audits/results/A-017-search-navigation-discovery.md`;
  - `docs/audits/results/A-018-translations-content-taxonomy.md`.
- Update `docs/audits/findings-register.md` with deduped findings and statuses,
  reusing existing findings where appropriate.
- Update `docs/risks/production-readiness.md` for confirmed production risks,
  especially R-002, R-005, R-006, R-007/R-008, R-016, and R-018 where relevant.
- Update relevant workstream backlogs and next-agent actions.
- Create the next focused task briefs for ready implementation slices.
- Update `docs/tasks/README.md` and `docs/orchestration/state.md`.

Out of scope:

- Do not change runtime source code.
- Do not resolve owner/legal/product decisions by assumption.
- Do not assign or implement T-139 unless the monitoring decision is available.
- Do not rewrite prior audit result files except for tiny status/link
  corrections needed by reconciliation.

## Concurrency

Do not run this in parallel with other shared-tracker edits. This task owns the
shared coordination files for its duration:

- `docs/audits/findings-register.md`;
- `docs/risks/production-readiness.md`;
- `docs/workstreams/*`;
- `docs/tasks/*` for new task briefs;
- `docs/tasks/README.md`;
- `docs/orchestration/state.md`.

Other implementation agents should wait or keep strictly to task-owned source
files and put candidate tracker updates in handoff notes until T-140 completes.

## Files Likely Touched

- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/tasks/README.md`
- `docs/tasks/T-14*.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- A-011, A-017, and A-018 candidate findings are deduped and visible in the
  canonical findings/risk/workstream trackers.
- Completed follow-ups T-134 through T-138 are not reopened.
- Owner/legal/product decisions are clearly marked as blocked decisions, not
  implementation guesses.
- At least one next implementation task brief is ready to assign.
- The orchestration state names the next safe assignment pattern and whether any
  tasks can run concurrently.

## Verification

```bash
rg -n "Candidate findings|candidate findings|Next Action" docs/audits/results/A-011-admin-content-operations.md docs/audits/results/A-017-search-navigation-discovery.md docs/audits/results/A-018-translations-content-taxonomy.md docs/orchestration/state.md
rg -n "A-011|A-017|A-018|T-140|current admin|last admin|public search|language UI|taxonomy" docs/audits/findings-register.md docs/risks/production-readiness.md docs/workstreams docs/tasks docs/orchestration/state.md
git diff --check
```

Record if any audit-result candidate text intentionally remains historical.

## Handoff Notes

- Prepared after T-136 and T-138 completed.
- Completed by reconciling A-011, A-017, and A-018 into the findings register,
  production risks, workstream backlogs, tasks index, and orchestration state.
- Added new findings F-091 through F-104 and updated existing F-013, F-023,
  F-033, and F-049 where the audits added evidence to already-known gaps.
- Prepared T-141, T-142, and T-143. Start with T-141 admin user deletion
  protection as the highest-confidence runtime safety slice.
- T-139 remains blocked until owner/platform monitoring-provider approval or an
  explicit no-provider interim policy exists.
- The original candidate-finding and next-action text remains in the A-011,
  A-017, and A-018 result files as historical audit output; the reconciled
  state now lives in the shared trackers and task briefs.
- Verification run:
  - `rg -n "Candidate findings|candidate findings|Next Action" docs/audits/results/A-011-admin-content-operations.md docs/audits/results/A-017-search-navigation-discovery.md docs/audits/results/A-018-translations-content-taxonomy.md docs/orchestration/state.md`
  - `rg -n "A-011|A-017|A-018|T-140|current admin|last admin|public search|language UI|taxonomy" docs/audits/findings-register.md docs/risks/production-readiness.md docs/workstreams docs/tasks docs/orchestration/state.md`
  - `git diff --check`

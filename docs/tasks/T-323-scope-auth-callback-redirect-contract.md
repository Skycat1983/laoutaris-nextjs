# T-323 Scope Auth Callback Redirect Contract

Status: Completed

Workstreams:

- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope the intended NextAuth redirect callback contract before any task changes
`/api/auth/signin`, `/api/auth/signout`, same-origin callback pass-through,
off-origin fallback, or the current `/dashboard` sign-in destination.

## Context

T-321 found that `src/lib/config/authCallbacks.ts` owns auth redirect semantics,
not ordinary route-builder cleanup. The current sign-in callback branch returns
`${baseUrl}/dashboard`, which does not obviously match the active account/admin
route surfaces. Changing that literal without a decision and focused coverage
could silently alter sign-in/sign-out behavior.

## Scope

In scope:

- Read
  [T-321 release fixture and auth callback route ownership scope](../audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md).
- Inventory current redirect callback behavior in `src/lib/config/authCallbacks.ts`.
- Inspect existing auth/session tests that use `authCallbacks`.
- Recommend the next implementation slice, which may be coverage-only if the
  intended destination is not yet decided.
- Write findings to
  `docs/audits/results/T-323-auth-callback-redirect-contract-scope.md`.

The result must address:

- `/api/auth/signin` current destination.
- `/api/auth/signout` base URL destination.
- Same-origin callback pass-through.
- Off-origin fallback to `baseUrl`.
- Whether `/dashboard` should remain explicit, become an account route, become
  role-aware admin/account routing, or stay owner/orchestrator blocked pending a
  product decision.

Out of scope:

- Do not edit runtime source, tests, auth callbacks, route builders, middleware,
  session callbacks, OAuth/provider behavior, smoke scripts, sitemap/robots,
  saved-item revalidation, or Shopify behavior.
- Do not run browser automation, credentialed smoke, public production smoke, or
  Vercel log inspection.
- Do not update shared trackers. Candidate tracker updates belong in the result
  file.

## Concurrency

Can run in parallel with T-322 because this is docs-only and writes only its
assigned result file plus this task brief. Do not run in parallel with another
task editing `authCallbacks.ts` or the same result file.

## Files Likely Touched

- `docs/audits/results/T-323-auth-callback-redirect-contract-scope.md`
- `docs/tasks/T-323-scope-auth-callback-redirect-contract.md`

## Acceptance Criteria

- The result documents current redirect callback behavior and existing coverage.
- The result identifies the behavioral risk of changing `/dashboard`.
- The result recommends one next implementation task or explicitly blocks it on
  an owner/orchestrator decision.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, verification
results, and the assigned result file. Do not edit `docs/tasks/README.md`,
workstream briefs, `docs/orchestration/state.md`,
`docs/audits/findings-register.md`, or `docs/risks/production-readiness.md`;
list candidate tracker updates in the result file for orchestrator
reconciliation.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after T-321 completed.
- This is docs-only and does not require Shopify dashboard work, privileged
  Vercel access, network access, browser automation, or credentialed smoke.
- Completed on 2026-05-28 in
  [T-323 auth callback redirect contract scope](../audits/results/T-323-auth-callback-redirect-contract-scope.md).
  Runtime source, tests, auth callbacks, route builders, middleware, smoke
  scripts, shared trackers, and production checks were not changed.
- Recommended next slice is coverage-only unless the owner/orchestrator first
  decides the intended post-sign-in destination: add focused
  `authCallbacks.redirect()` tests for `/api/auth/signin` -> `/dashboard`,
  `/api/auth/signout` -> `baseUrl`, same-origin pass-through, and off-origin
  fallback.
- The result includes owner/orchestrator decision steps for whether
  `/dashboard` should remain intentional or be replaced by an account,
  admin/account role-aware, or other explicit destination.
- Verification: `git diff --check` passed on 2026-05-28.

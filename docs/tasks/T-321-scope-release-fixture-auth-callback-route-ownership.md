# T-321 Scope Release Fixture And Auth Callback Route Ownership

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Deployment Security And Observability](../workstreams/deployment-security-and-observability.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Scope the remaining route-ownership surfaces that are too risky to centralize
without an explicit plan: public smoke fixtures, sitemap/robots release
contracts, auth callback paths, and saved-item revalidation paths.

## Context

T-302, T-315, T-316, and T-319 reduced route duplication across public UI,
account UI, and admin dashboard UI routes. The remaining hard-coded route lists
include public release-contract fixtures and callback/cache paths where a helper
change could accidentally alter deployment smoke evidence, crawler output,
sign-in/sign-out redirects, or cache invalidation.

## Scope

In scope:

- Read [T-302 route-builder centralization scope](../audits/results/T-302-route-builder-centralization-scope.md).
- Read [T-315 account/admin route-builder ownership scope](../audits/results/T-315-account-admin-route-builder-ownership-scope.md).
- Inventory current route ownership in:
  - `scripts/smoke-public-routes.mjs`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/lib/metadata/publicDynamicSitemap.ts`
  - `src/lib/config/authCallbacks.ts`
  - `src/lib/actions/updateUserFavourites.ts`
  - `src/lib/actions/updateUserWatchlist.ts`
  - focused tests that assert those contracts
- Recommend one next implementation slice, or recommend that a surface remain
  deliberately explicit.
- Explain practical behavior impact for the recommended slice.
- Write findings and recommendation to
  `docs/audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md`.

Out of scope:

- Do not edit source files, runtime tests, smoke scripts, route builders,
  callback behavior, cache revalidation behavior, sitemap/robots behavior, or
  Shopify dashboard behavior.
- Do not run browser automation, public smoke against production, Vercel log
  inspection, or network-dependent checks.
- Do not update shared trackers. Candidate tracker updates belong in the result
  file.

## Concurrency

Can run in parallel with T-320 because this is docs-only and writes only its
assigned result file plus this task brief. Do not run in parallel with another
task editing the same result file.

## Files Likely Touched

- `docs/audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md`
- `docs/tasks/T-321-scope-release-fixture-auth-callback-route-ownership.md`

## Acceptance Criteria

- The result file inventories each scoped route surface and its current owner.
- The result separates safe centralization candidates from explicit
  release-contract fixtures that should remain duplicated.
- The result recommends one next implementation task with practical app-impact
  explanation.
- The result lists candidate updates for F-030/R-010/workstreams if needed.
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

- Prepared by the orchestrator on 2026-05-27 after T-318 and T-319 completed.
- This is docs-only and does not require Shopify dashboard work, privileged
  Vercel access, network access, or browser automation.
- Completed on 2026-05-27 with findings in
  [T-321 release fixture and auth callback route ownership scope](../audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md).
- Inventoried current ownership for public smoke route fixtures,
  sitemap/robots output, dynamic sitemap private filtering, NextAuth redirect
  callback paths, and saved-item cache revalidation paths.
- Recommendation: keep public smoke, sitemap/robots, and auth callback paths
  explicit for now; use a future narrow saved-item revalidation slice to reuse
  existing account/public route builders while preserving current
  `revalidatePath()` order and failure behavior.
- No runtime source, tests, smoke scripts, route builders, callback behavior,
  cache behavior, sitemap/robots output, Shopify dashboard behavior, or shared
  trackers were changed.
- Verification passed: `git diff --check`.

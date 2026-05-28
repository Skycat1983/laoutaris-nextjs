# T-327 Scope Public And User API Route Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope the next safe route-builder implementation slice after the completed
admin API, account UI, saved-item revalidation, and auth callback route work.

## Context

T-321 concluded that release-contract fixtures such as public smoke,
sitemap/robots, and auth callback behavior should remain explicit unless a
separate task proves otherwise. T-322 completed saved-item revalidation path
builders. T-323/T-324 scoped and covered auth callback behavior. T-325 aligned
public smoke with the live product not-found contract.

The remaining route-builder work is broader and touches public/user API
fetchers. That surface should be scoped before implementation so the next
source task centralizes only safe client fetcher URLs and does not hide
request-context route IDs, physical route files, release fixtures, or runtime
behavior changes.

## Scope

In scope:

- Read:
  - [T-321 release fixture and auth callback route ownership scope](../audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md)
  - `src/lib/api/public/*/fetchers.ts`
  - `src/lib/api/user/*/fetchers.ts`
  - `src/lib/api/public/clientPublicApi.ts`
  - `src/lib/api/user/clientUserApi.ts`
  - `__tests__/unit/api/routeFetcherParity.test.ts`
  - existing route-builder modules under `src/lib/routes/`
- Inventory hard-coded public/user API client fetcher paths.
- Identify which path family is safest for the next implementation task.
- Recommend exactly one implementation slice, with files, acceptance criteria,
  and focused verification commands.
- Write findings to
  `docs/audits/results/T-327-public-user-api-route-builder-scope.md`.

Candidate families to compare:

- Public content fetchers: article, blog, collection, artwork.
- Public navigation fetchers.
- Public search/shop/enquiry fetchers.
- User fetchers: navigation, profile, comments, favourites, watchlist.

Out of scope:

- Do not edit runtime source or tests.
- Do not centralize request-context route IDs inside route handlers.
- Do not touch physical App Router route files.
- Do not touch public smoke, sitemap, robots, auth callback redirects,
  saved-item revalidation, middleware, session/auth policy, Shopify dashboard
  data, or production smoke values.
- Do not run browser automation, production smoke, credentialed/admin smoke,
  Vercel log inspection, or broad test suites.

## Concurrency

Can run in parallel with T-326 because this writes a distinct result file and
should not touch monitoring/runbook docs. Do not run in parallel with another
task editing public/user API fetchers or the same result file.

## Files Likely Touched

- `docs/audits/results/T-327-public-user-api-route-builder-scope.md`
- `docs/tasks/T-327-scope-public-user-api-route-builders.md`

## Acceptance Criteria

- The result lists current public/user API fetcher URL ownership.
- The result names unsafe surfaces that must remain explicit.
- The result recommends one small source implementation task and focused tests.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use no broader verification unless runtime source changes unexpectedly, which
should be treated as out of scope.

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, verification
results, and the assigned result file. Do not edit `docs/tasks/README.md`,
workstream briefs, `docs/orchestration/state.md`,
`docs/audits/findings-register.md`, or `docs/risks/production-readiness.md`;
list candidate tracker updates in the result file for orchestrator
reconciliation.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after T-322 through T-325
  completed.
- This is a controlled scoping task: no source edits, no production checks, no
  browser automation, and no Shopify dashboard dependency.
- Completed on 2026-05-28 in
  [T-327 public/user API route-builder scope](../audits/results/T-327-public-user-api-route-builder-scope.md).
  Recommended next source-only slice: public navigation API client path
  builders in `src/lib/api/public/navigation/paths.ts`, consumed only by
  `src/lib/api/public/navigation/fetchers.ts`, with focused navigation fetcher,
  navigation route, route/fetcher parity, import-boundary, and diff-check
  verification.
- Verification: `git diff --check` passed.

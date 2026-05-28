# T-322 Add Saved-Item Revalidation Route Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reuse existing client-safe route builders for the successful favourite/watchlist
`revalidatePath()` calls without changing saved-item mutation behavior.

## Context

T-321 scoped the remaining release-fixture, crawler, auth callback, and
saved-item route ownership surfaces. It recommended saved-item revalidation as
the safest next implementation slice because the paths are narrow, already have
exact-order tests, and can reuse existing route builders.

## Scope

In scope:

- Read
  [T-321 release fixture and auth callback route ownership scope](../audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md).
- Update `src/lib/actions/updateUserFavourites.ts` to call:
  - `accountFavouritesPath()`
  - `accountFavouritesPath(artworkId)`
  - `artworkDetailPath(artworkId)`
- Update `src/lib/actions/updateUserWatchlist.ts` to call:
  - `accountWatchlistPath()`
  - `accountWatchlistPath(artworkId)`
  - `artworkDetailPath(artworkId)`
- Preserve the current successful revalidation order:
  list path, account detail path, public artwork detail path.
- Preserve the current no-revalidation-on-failure behavior.
- Keep or update focused tests so expected revalidation paths still match the
  current route output.

Out of scope:

- Do not change mutation logic, auth/session checks, DB ownership, model writes,
  logging, action return values, or user-facing messages.
- Do not change account/public route-builder output.
- Do not change route handlers, API fetchers, smoke scripts, sitemap/robots,
  auth callback redirects, cache policy, Shopify behavior, or admin behavior.
- Do not add new route builders unless the existing account/public builders are
  insufficient.

## Concurrency

Can run in parallel with T-323 because this task owns saved-item action source
and focused tests only. Do not run in parallel with another task touching
`updateUserFavourites.ts`, `updateUserWatchlist.ts`, saved-item action tests, or
account/public route builder output.

## Files Likely Touched

- `src/lib/actions/updateUserFavourites.ts`
- `src/lib/actions/updateUserWatchlist.ts`
- `__tests__/unit/actions/savedItemActions.test.ts`
- `docs/tasks/T-322-add-saved-item-revalidation-route-builders.md`

## Acceptance Criteria

- Favourite and watchlist actions use existing route builders for all three
  successful `revalidatePath()` calls.
- Exact revalidation order is unchanged for both actions.
- Failed or incomplete mutations still do not revalidate any path.
- Saved-item action return values and persistence behavior are unchanged.
- Route-builder tests remain green.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/routes/accountRoutes.test.ts __tests__/unit/routes/publicAppRoutes.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Run `npm run lint` if any import ordering or lint-sensitive source changes are
made beyond the two action files.

Results on 2026-05-28:

- `npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/routes/accountRoutes.test.ts __tests__/unit/routes/publicAppRoutes.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts` passed with 4 suites and 24 tests.
- `git diff --check` passed.
- `npm run lint` passed with no ESLint warnings or errors.

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, and verification
results. Do not edit `docs/tasks/README.md`, workstream briefs,
`docs/orchestration/state.md`, `docs/audits/findings-register.md`, or
`docs/risks/production-readiness.md`; list candidate tracker updates in this
brief for orchestrator reconciliation.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after T-320 and T-321 completed.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, network access, or browser automation.
- Completed on 2026-05-28 by replacing saved-item revalidation literals with
  `accountFavouritesPath()`, `accountFavouritesPath(artworkId)`,
  `accountWatchlistPath()`, `accountWatchlistPath(artworkId)`, and
  `artworkDetailPath(artworkId)` while preserving successful revalidation order
  and no-revalidation-on-failure behavior.
- Focused saved-item tests now derive expected revalidation paths from the
  client-safe route builders and still assert exact call order.
- Candidate tracker update for orchestrator reconciliation: mark the saved-item
  revalidation slice complete in the architecture, auth/admin, and testing
  workstreams if those shared trackers are not already updated by another
  agent.

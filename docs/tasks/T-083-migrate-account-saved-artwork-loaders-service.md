# T-083 Migrate Account Saved Artwork Loaders Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move the authenticated favourites/watchlist account loaders off same-app HTTP by
sharing server-only saved-artwork service logic with the existing user
favourite/watchlist read routes.

## Context

- [ADR 0004](../decisions/0004-server-data-access-ownership.md) chooses direct
  server-only data services over server-side same-app HTTP.
- T-081 completed the account navigation slice by sharing
  `getOwnUserNavigation` between `AccountSubnavLoader` and
  `GET /api/v2/user/navigation`.
- Remaining account saved-artwork loaders still import `serverApi`:
  `FavouritesPaginationLoader`, `WatchlistPaginationLoader`,
  `FavouritedArtworkLoader`, and `WatchlistedArtworkLoader`.
- Existing user routes already use `requireApiUser()`, shared response helpers,
  and route-local DB ownership:
  `GET /api/v2/user/favourite`,
  `GET /api/v2/user/favourite/[artworkId]`,
  `GET /api/v2/user/watchlist`, and
  `GET /api/v2/user/watchlist/[artworkId]`.

## Scope

In scope:

- Add shared server-only service functions for:
  - current user's favourite artwork list,
  - one current user's favourite artwork by artwork ID,
  - current user's watchlist artwork list,
  - one current user's watchlist artwork by artwork ID.
- Reuse those services from the four existing user favourite/watchlist read
  routes after `requireApiUser()` succeeds.
- Update `FavouritesPaginationLoader`, `WatchlistPaginationLoader`,
  `FavouritedArtworkLoader`, and `WatchlistedArtworkLoader` to read the current
  user ID from the existing server session helper and call the shared services
  directly instead of `serverApi`.
- Preserve existing route envelopes, HTTP statuses, list metadata, transformed
  `ArtworkFrontend` DTOs, and "not in favourites/watchlist" behavior.
- Preserve current account UI behavior: pagination headings, account saved-item
  links, `ArtworkView` props, and loader failure behavior unless a focused test
  demonstrates the current behavior is already broken.
- Add focused service, route-adapter, and loader tests proving no same-app HTTP
  dependency remains for these loaders.
- Update the affected workstreams, findings, risks, and orchestration state
  after completion.

Out of scope:

- Do not change favourite/watchlist server actions or mutation behavior.
- Do not change account navigation; T-081 already owns that path.
- Do not migrate user comments, account settings, or shop product loaders.
- Do not redesign root-layout session ownership, cache policy, route URL/base
  URL construction, middleware/global auth policy, or production logging policy.
- Do not change checkout/cart, Shopify linking, or saved-item UI flows.

## Files Likely Touched

- `src/lib/data/services/` saved-artwork service file(s)
- `src/app/api/v2/user/favourite/route.ts`
- `src/app/api/v2/user/favourite/[artworkId]/route.ts`
- `src/app/api/v2/user/watchlist/route.ts`
- `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
- `src/components/loaders/componentLoaders/FavouritesPaginationLoader.tsx`
- `src/components/loaders/componentLoaders/WatchlistPaginationLoader.tsx`
- `src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx`
- `src/components/loaders/viewLoaders/WatclistedArtworkLoader.tsx`
- Focused tests under `__tests__/unit/data/`, `__tests__/unit/api/`, and
  `__tests__/unit/loaders/`
- `docs/orchestration/state.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The four account saved-artwork loaders no longer import `serverApi`,
  `serverUserApi`, or fetch same-app user favourite/watchlist routes.
- The four user favourite/watchlist read routes still guard with
  `requireApiUser()` before service work.
- The routes preserve their existing success/error envelopes and statuses.
- The loaders preserve existing rendered output and failure behavior.
- Focused tests cover service success/missing/failure behavior, route adapter
  guard/envelope behavior, and loader no-self-fetch behavior.
- The route/fetcher parity and protected API guard inventories remain passing.

## Verification

Run focused tests first, then broaden:

```bash
npm test -- --runTestsByPath <focused saved-artwork service/route/loader tests>
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-082 completed.
- Keep this as the account saved-artwork read migration only. If implementation
  reveals user comments/settings or shop product loader issues, report them as
  follow-up task candidates instead of widening this task.
- Completed on 2026-05-17.
- Added `getOwnSavedArtwork` service functions for current-user favourites and
  watchlist list/detail reads, and reused them from the four protected user
  read routes after `requireApiUser()` succeeds.
- `FavouritesPaginationLoader`, `WatchlistPaginationLoader`,
  `FavouritedArtworkLoader`, and `WatchlistedArtworkLoader` now read the
  session user ID with `getUserIdFromSession()` and call server-only services
  directly. They no longer import `serverApi`/`serverUserApi` or self-fetch the
  same app for saved artwork reads.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/data/getOwnSavedArtwork.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/loaders/SavedArtworkLoaders.test.tsx __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- `npm run build` passed but retained existing unrelated static-generation DB,
  branch-verification, `Subnav`, and `ArticleView` debug output.

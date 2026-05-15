# T-031 Prune Unused Saved Item Write Fetchers

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the four remaining favourite/watchlist F-037 route/fetcher parity gaps by
pruning unused API write fetchers instead of adding new unused user write routes.

## Why Now

T-030 reduced the F-037 allowlist to five user-surface mismatches. Static search
shows the favourite/watchlist POST and DELETE fetchers are not called by active
code; the active saved-item mutation path is the server-action flow hardened by
T-028. Removing these unsupported fetcher methods keeps the API surface smaller
and avoids introducing duplicate write contracts before the product needs them.

This task addresses:

- [F-037](../audits/findings-register.md): API client fetchers expose
  unsupported route paths and methods.
- [R-006](../risks/production-readiness.md): route/fetcher parity drift remains
  open.
- [R-005](../risks/production-readiness.md): route/fetcher contract coverage
  should stay current.

## Read First

- [T-028 Saved item actions DB ownership and revalidation](T-028-saved-item-actions-db-revalidation.md)
- [T-029 Add route fetcher parity inventory](T-029-route-fetcher-parity-inventory.md)
- [T-030 Admin user/comment detail read routes](T-030-admin-user-comment-detail-read-routes.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- `src/lib/api/user/favorites/fetchers.ts`
- `src/lib/api/user/watchlist/fetchers.ts`
- `src/lib/actions/updateUserFavourites.ts`
- `src/lib/actions/updateUserWatchlist.ts`
- `__tests__/unit/actions/savedItemActions.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Confirm no active source consumer calls these fetcher methods:
  - `clientApi.user.favourites.addToFavourites`
  - `clientApi.user.favourites.removeFromFavourites`
  - `clientApi.user.watchlist.addToWatchlist`
  - `clientApi.user.watchlist.removeFromWatchlist`
- Remove those unused methods and any now-unused exported write result types
  from the user saved-item fetcher modules.
- Remove the four corresponding operations from `FETCHER_OPERATIONS` and
  `KNOWN_ROUTE_FETCHER_GAP_IDS` in
  `__tests__/unit/api/routeFetcherParity.test.ts`.
- Keep the active server-action saved-item behavior from T-028 unchanged.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not add `POST` or `DELETE` route handlers to
  `/api/v2/user/favourite/[artworkId]` or
  `/api/v2/user/watchlist/[artworkId]`.
- Do not change `updateUserFavourites` or `updateUserWatchlist`.
- Do not change favourite/watchlist UI behavior.
- Do not change the profile `PATCH` parity gap; T-032 owns that separately.
- Do not broaden into list/detail saved-item route response semantics.

## Acceptance Criteria

- The saved-item API fetcher modules expose only the backed `GET` list/detail
  methods.
- There are no active source references to the removed saved-item write fetcher
  names outside historical docs, task docs, or the completed diff.
- T-029's parity test passes with the four saved-item write operations removed
  from the inventory and allowlist.
- The remaining F-037 allowlist entry is only `user.profile.update`.
- Existing saved-item server-action tests still pass.

## Verification

Run the focused action and parity tests:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/api/routeFetcherParity.test.ts
```

Then run:

```bash
npm run lint
npm run build
```

Also run a reference check:

```bash
rg -n "addToFavourites|removeFromFavourites|addToWatchlist|removeFromWatchlist|clientApi\\.user\\.favourites|clientApi\\.user\\.watchlist" src __tests__
```

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
rg -n "addToFavourites|removeFromFavourites|addToWatchlist|removeFromWatchlist|clientApi\\.user\\.favourites|clientApi\\.user\\.watchlist" src __tests__
```

Notes: focused Jest passed with 2 suites and 17 tests. Lint passed with no
warnings. Build passed; existing MongoDB connection logs, branch verification
logs, route fetcher debug output, and static-generation noise appeared during
page-data collection. The reference check returned no active `src` or
`__tests__` matches.

## Completion

Completed on 2026-05-15.

- Removed `addToFavourites` and `removeFromFavourites` from
  `src/lib/api/user/favorites/fetchers.ts`.
- Removed `addToWatchlist` and `removeFromWatchlist` from
  `src/lib/api/user/watchlist/fetchers.ts`.
- Removed the now-unused saved-item write result types from both fetcher
  modules.
- Removed the four saved-item write operations from `FETCHER_OPERATIONS` and
  `KNOWN_ROUTE_FETCHER_GAP_IDS` in
  `__tests__/unit/api/routeFetcherParity.test.ts`.
- Confirmed there are no active source or test references to the removed
  saved-item write fetcher names or direct `clientApi.user` saved-item fetcher
  calls.
- Remaining F-037 allowlist entry: `user.profile.update` for `PATCH
  /api/v2/user/profile`, owned by T-032.

## Escalate

Escalate to the orchestrator if:

- An active consumer calls any saved-item write fetcher.
- Product direction requires an API write contract in addition to the existing
  server actions.
- Removing the fetcher methods exposes broader API client type coupling.

# T-029 Add Route Fetcher Parity Inventory

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make F-037 route/fetcher drift measurable with a focused parity test before
changing unsupported client methods or adding missing route handlers.

## Why Now

T-027 and T-028 completed the saved-route guard and saved-item action hardening
slices, but they intentionally left unsupported favourite/watchlist API methods
alone. A-002 also found profile and admin read fetcher mismatches. Before
changing those contracts, the repo needs a small automated inventory that says
which fetcher methods are backed by real App Router route handlers and which
known gaps are being carried intentionally.

This task addresses:

- [F-037](../audits/findings-register.md): API client fetchers expose
  unsupported route paths and methods.
- [R-006](../risks/production-readiness.md): route/fetcher parity remains
  inconsistent across route groups.
- [R-005](../risks/production-readiness.md): route contract gaps need focused
  tests.

## Read First

- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/core/createFetcher.ts`
- `src/lib/api/user/favorites/fetchers.ts`
- `src/lib/api/user/watchlist/fetchers.ts`
- `src/lib/api/user/profile/fetchers.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `src/app/api/v2/`

## Scope

In scope:

- Add a focused unit test, suggested path:
  `__tests__/unit/api/routeFetcherParity.test.ts`.
- Build a route manifest from `src/app/api/v2/**/route.ts` that records the
  supported HTTP methods for each route path. Convert App Router dynamic
  segments such as `[id]` and `[artworkId]` into a stable placeholder form so
  fetcher paths can be compared to route files.
- Add an explicit fetcher-operation inventory for the API clients under
  `src/lib/api/**/fetchers.ts`. Keep it in the test unless a small helper makes
  the test clearer.
- Assert every non-allowlisted fetcher operation has a matching route path and
  HTTP method.
- Add an explicit known-gap allowlist for the currently documented F-037
  mismatches. At minimum include:
  - favourite detail `POST` and `DELETE` fetchers for
    `/api/v2/user/favourite/[artworkId]`.
  - watchlist detail `POST` and `DELETE` fetchers for
    `/api/v2/user/watchlist/[artworkId]`.
  - profile `PATCH` fetcher for `/api/v2/user/profile`.
  - admin user detail `GET` fetcher for `/api/v2/admin/user/read/[id]`.
  - admin comment detail `GET` fetcher for `/api/v2/admin/comment/read/[id]`.
- Make the allowlist self-checking: if an allowlisted gap becomes backed by a
  route/method, the test should fail with a clear message so the allowlist is
  removed in the same fix.
- If the inventory discovers additional route/fetcher mismatches, document them
  in this task completion and either include them in the allowlist with evidence
  or escalate if they look like regressions.

Out of scope:

- Do not remove or rename fetcher methods in this task.
- Do not add missing favourite/watchlist/profile/admin route handlers.
- Do not change public API response envelopes, DTOs, or fetcher return types.
- Do not migrate same-app server fetch usage or ADR 0004 data services.
- Do not broaden into endpoint behavior tests; this is a static contract
  inventory.

## Acceptance Criteria

- The route/fetcher parity test passes while explicitly carrying the known
  F-037 gaps.
- New unsupported fetcher paths or methods fail the focused test unless they are
  intentionally added to the documented allowlist.
- Known allowlist entries fail the test once the matching route/method exists,
  forcing cleanup of stale exceptions.
- The task completion records the exact current mismatch list and the next
  implementation slice to remove one group of mismatches.

## Verification

Run the focused parity test:

```bash
npm test -- --runTestsByPath __tests__/unit/api/routeFetcherParity.test.ts
```

Then run:

```bash
npm run lint
npm run build
```

## Completion

- Added `__tests__/unit/api/routeFetcherParity.test.ts`.
- The test builds a route manifest by recursively scanning the 52 current
  `src/app/api/v2/**/route.ts` files, extracting exported HTTP methods, and
  normalizing all App Router dynamic segments to `[param]` so `[id]`,
  `[slug]`, `[artworkId]`, and similar fetcher placeholders compare to route
  files without depending on parameter names.
- The explicit fetcher-operation inventory covers the 16 current
  `src/lib/api/**/fetchers.ts` modules and 59 active fetcher calls. The test
  also self-checks that every fetcher module is represented, that inventoried
  call counts match source call counts, and that operation IDs are unique.
- Exact known-gap allowlist after implementation:
  - `user.favorites.addToFavourites`: `POST`
    `/api/v2/user/favourite/[artworkId]`.
  - `user.favorites.removeFromFavourites`: `DELETE`
    `/api/v2/user/favourite/[artworkId]`.
  - `user.watchlist.addToWatchlist`: `POST`
    `/api/v2/user/watchlist/[artworkId]`.
  - `user.watchlist.removeFromWatchlist`: `DELETE`
    `/api/v2/user/watchlist/[artworkId]`.
  - `user.profile.update`: `PATCH` `/api/v2/user/profile`.
  - `admin.read.user`: `GET` `/api/v2/admin/user/read/[id]`.
  - `admin.read.comment`: `GET` `/api/v2/admin/comment/read/[id]`.
- No additional route/fetcher mismatches were discovered beyond the documented
  F-037 set.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/api/routeFetcherParity.test.ts`
    passed.
  - `npm run lint` passed.
  - `npm run build` passed with existing MongoDB/fetcher/static-generation log
    noise.
- Recommended next task: implement or remove the active admin detail read
  mismatches for `clientApi.admin.read.user(id)` and
  `clientApi.admin.read.comment(id)`, because the admin dashboard operation
  tabs call those fetchers but no matching detail route files exist.

## Escalate

Escalate to the orchestrator if:

- Parsing route files requires a broad framework-specific parser or fragile
  source-code transformation.
- The inventory finds mismatches beyond the documented F-037 set that affect
  active public or admin workflows.
- A green test would require changing runtime fetcher or route behavior.

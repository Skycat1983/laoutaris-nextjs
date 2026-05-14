# T-027 Migrate User Saved Routes To Shared Guard

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-026 `requireApiUser()` guard to the remaining user account read
routes for navigation, favourites, and watchlist so unauthenticated API callers
receive real JSON `401` responses and model access stays behind a stable
session user ID.

## Why Now

T-026 introduced the shared route-local guard pattern and migrated user profile.
The adjacent account read routes still call `getUserIdFromSession()` directly
and often return body-only auth failures with HTTP `200`. The favourites and
watchlist routes are also high-use account surfaces and include known route/API
contract drift that should be hardened in small slices.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses do not
  consistently return real HTTP status codes.
- [R-002](../risks/production-readiness.md): broader protected API migration
  remains open.
- [R-006](../risks/production-readiness.md): API HTTP statuses and envelopes are
  inconsistent across route groups.
- [R-026](../risks/production-readiness.md): MongoDB-backed account routes need
  explicit connection ownership.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [A-004 Auth/admin result](../audits/results/A-004-auth-admin-permissions.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/api/requireApiUser.ts`
- `src/app/api/v2/user/profile/route.ts`
- `src/app/api/v2/user/navigation/route.ts`
- `src/app/api/v2/user/favourite/route.ts`
- `src/app/api/v2/user/favourite/[artworkId]/route.ts`
- `src/app/api/v2/user/watchlist/route.ts`
- `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
- `__tests__/unit/api/userProfileRoute.test.ts`
- `__tests__/unit/api/apiRouteGuards.test.ts`

## Scope

In scope:

- Migrate these GET handlers to `requireApiUser()`:
  - `src/app/api/v2/user/navigation/route.ts`
  - `src/app/api/v2/user/favourite/route.ts`
  - `src/app/api/v2/user/favourite/[artworkId]/route.ts`
  - `src/app/api/v2/user/watchlist/route.ts`
  - `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
- Return the shared guard response for unauthenticated callers before DB/model
  work. The expected unauthenticated body is
  `{ success: false, message: "Unauthorized", error: "Unauthorized" }` with
  HTTP `401`.
- Preserve existing success DTOs and route semantics for authenticated callers.
- Add explicit `dbConnect()` ownership before model reads where it is missing,
  especially watchlist list/detail.
- Keep public-safe `500` responses; do not expose raw exception messages.
- Add focused route tests for:
  - unauthenticated `401` with no DB/model read.
  - authenticated success for navigation, favourites list, watchlist list, and
    one dynamic favourite/watchlist route.
  - not-found/not-in-list branches keep their existing behavior unless a real
    status bug is fixed locally with tests.
- Update this task, auth/data/testing workstreams, findings, risks, and
  orchestration state after completion.

Out of scope:

- Do not implement missing POST/DELETE favourite/watchlist handlers.
- Do not remove unsupported fetcher methods; F-037 owns route/fetcher parity.
- Do not redesign favourite/watchlist transforms or response DTOs.
- Do not migrate user comment routes; they were already hardened separately and
  should be handled only if a local helper extraction requires it.
- Do not change middleware redirect behavior.
- Do not migrate admin routes in this task.

## Acceptance Criteria

- The five scoped user account read routes use `requireApiUser()`.
- Unauthenticated calls to the scoped routes return real JSON `401` responses.
- Scoped routes do not read request bodies, connect to MongoDB, or query models
  before the user guard succeeds.
- Watchlist routes explicitly own `dbConnect()` before model reads.
- Focused tests cover the migrated auth-status behavior and representative
  authenticated success paths.

## Verification

Run the narrow relevant tests:

```bash
npm test -- --runTestsByPath __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/userSavedRoutes.test.ts
```

If the new saved-route tests use a different filename, include that file in the
focused command.

Then run:

```bash
npm run lint
npm run build
```

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/userSavedRoutes.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 3 suites and 19 tests. Lint passed with no
warnings. Build passed; existing MongoDB connection logs, branch verification
logs, and fetcher debug output appeared during page-data collection/static
generation.

## Completion

Completed on 2026-05-14.

- Migrated user navigation, favourite list/detail, and watchlist list/detail
  GET handlers to call `requireApiUser()` before DB/model work.
- Preserved existing authenticated success DTOs and not-found/not-in-list
  response semantics while changing unauthenticated callers to the shared JSON
  `401` body.
- Added explicit `dbConnect()` ownership before watchlist list/detail model
  reads.
- Added `__tests__/unit/api/userSavedRoutes.test.ts` covering unauthenticated
  `401` with no DB/model/transform work for all five scoped routes, plus
  authenticated success for navigation, favourite list/detail, and watchlist
  list/detail.

Remaining work: this did not implement unsupported favourite/watchlist
POST/DELETE handlers, change fetcher parity, redesign saved-item DTOs, migrate
middleware API redirects, or change favourite/watchlist server actions. Continue
those as separate scoped tasks.

## Escalate

Escalate to the orchestrator if:

- The saved-route migration requires changing unsupported fetcher methods.
- A route success response must change DTO shape to make the guard migration
  work.
- Favourite/watchlist DB ownership or transform behavior exposes a broader
  data-contract problem outside this route-auth slice.

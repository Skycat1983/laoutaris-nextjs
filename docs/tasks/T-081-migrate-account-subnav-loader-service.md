# T-081 Migrate Account Subnav Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `AccountSubnavLoader` off same-app HTTP by sharing server-only account
navigation service logic with `GET /api/v2/user/navigation`.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-027 moved the user navigation route to `requireApiUser()` before DB/model
  work.
- T-044 migrated the user navigation route to shared response helpers.
- T-080 completed the last public section-loader same-app HTTP migration.
- `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx` still calls
  `serverApi.user.navigation.fetchUserNavigation()`.
- `GET /api/v2/user/navigation` currently owns auth guarding, MongoDB
  connection setup, user lookup, `favourites`/`watchlist`/`comments` field
  selection, `transformAccountNav.toFrontend`, the success envelope,
  user-missing `404`, and internal-failure `500`.

## Scope

In scope:

- Add a shared server-only account navigation service, for example
  `src/lib/data/services/getOwnUserNavigation.ts`, or an equivalent strongly
  typed service shape.
- Move the DB-backed account navigation read into the service: connect to
  MongoDB, find the current user by ID, select `favourites`, `watchlist`, and
  `comments`, transform with `transformAccountNav.toFrontend`, and return the
  transformed navigation data or a missing-user result.
- Keep `requireApiUser()` in `GET /api/v2/user/navigation`; the shared service
  should receive the already-authenticated user ID rather than owning API auth.
- Refactor `GET /api/v2/user/navigation` to call the shared service while
  preserving the current `401`, success envelope, user-missing `404`, and
  internal-failure `500` bodies.
- Refactor `AccountSubnavLoader` to read the current user ID with the existing
  session helper and call the shared service directly.
- Preserve the current subnav links, disabled states, first favourite/watchlist
  segment behavior, cart/orders disabled behavior, and thrown loader errors for
  unauthenticated or missing-user failures.
- Remove direct same-app HTTP imports and calls from `AccountSubnavLoader`.
- Add or update focused tests for the service, API route, and
  `AccountSubnavLoader` no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate favourites/watchlist detail loaders, favourites/watchlist
  pagination loaders, user comments loader, user settings loader, shop products
  loader, saved-item server actions, middleware, global auth/session policy,
  route URL/base URL policy, cache policy, root layout ownership, or global
  logging/redaction policy.
- Do not change the account subnav UI, link labels, link order, disabled-state
  rules, or route paths.
- Do not change user navigation response contracts beyond preserving the
  existing route behavior through a shared service.
- Do not remove `serverApi`, `serverUserApi`, user navigation fetchers, or
  shared fetcher modules globally.

## Files Likely Touched

- `src/lib/data/services/getOwnUserNavigation.ts` or equivalent
- `src/app/api/v2/user/navigation/route.ts`
- `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx`
- `__tests__/unit/data/getOwnUserNavigation.test.ts` or equivalent
- `__tests__/unit/api/userNavigationRoute.test.ts` or equivalent
- `__tests__/unit/loaders/AccountSubnavLoader.test.tsx` or equivalent
- `docs/tasks/T-081-migrate-account-subnav-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `AccountSubnavLoader` no longer imports `serverApi`, `serverUserApi`, or
  fetcher-backed user navigation methods.
- `AccountSubnavLoader` no longer calls
  `serverApi.user.navigation.fetchUserNavigation`, `fetch`, or another
  same-app HTTP wrapper.
- `GET /api/v2/user/navigation` and `AccountSubnavLoader` share the same
  server-only account navigation service for account navigation reads.
- `GET /api/v2/user/navigation` keeps `requireApiUser()` as the API auth guard
  and preserves its current `401`, success, user-missing `404`, and
  internal-failure `500` response bodies.
- `AccountSubnavLoader` preserves link labels, order, paths, disabled states,
  first favourite/watchlist segment behavior, cart/orders disabled behavior,
  and thrown error behavior for unauthenticated or missing-user failures.
- Focused tests cover service success/missing-user/failure behavior, route
  guard/envelope preservation, loader no-self-fetch behavior, unauthenticated
  loader behavior, and subnav link construction.

## Verification

Completed:

```bash
rg -n "serverUserApi|serverApi|fetchUserNavigation|fetch\\(" src/components/loaders/componentLoaders/AccountSubnavLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/data/getOwnUserNavigation.test.ts __tests__/unit/loaders/AccountSubnavLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command returned no matches as expected. Route coverage was updated in
the existing `__tests__/unit/api/userSavedRoutes.test.ts` saved-route suite
instead of a separate `userNavigationRoute` file. Build passed with existing
MongoDB/static-generation and `Subnav` debug-log noise from unrelated paths.

## Handoff Notes

- Prepared 2026-05-17.
- Completed 2026-05-17: added `getOwnUserNavigation`, refactored
  `GET /api/v2/user/navigation` and `AccountSubnavLoader` to share it, removed
  the loader's same-app user navigation fetch, and added focused service,
  route, and loader coverage.
- Keep favourites/watchlist detail loaders, favourites/watchlist pagination
  loaders, user comments loader, user settings loader, shop products loader,
  saved-item server actions, middleware, global auth/session policy, root
  layout ownership, cache policy, route URL/base URL policy, and global
  logging/redaction policy separate.

## Escalate

Escalate to the orchestrator if:

- Sharing user navigation behavior requires changing current route response
  contracts, account subnav link behavior, or auth semantics.
- The loader needs broader account layout/session ownership changes to preserve
  behavior.
- The fix requires touching favourites/watchlist pagination/detail reads, user
  comments, user settings, shop products, middleware, or global API/fetcher
  architecture.

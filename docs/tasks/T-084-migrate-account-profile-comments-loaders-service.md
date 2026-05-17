# T-084 Migrate Account Profile Comments Loaders Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move the authenticated account settings and user-comments loaders off same-app
HTTP by sharing server-only account profile and user-comment read services with
the existing protected user routes.

## Context

- [ADR 0004](../decisions/0004-server-data-access-ownership.md) chooses direct
  server-only data services over server-side same-app HTTP.
- T-081 completed account navigation by sharing `getOwnUserNavigation`.
- T-083 completed account saved-artwork reads by sharing `getOwnSavedArtwork`.
- Remaining account read loaders still importing `serverApi` are:
  `UserSettingsLoader` and `UserCommentsLoader`.
- Existing protected routes already guard these reads with `requireApiUser()`:
  `GET /api/v2/user/profile` and `GET /api/v2/user/comment`.

## Scope

In scope:

- Add shared server-only services for:
  - current user's profile/settings read data,
  - current user's populated comment list.
- Reuse those services from `GET /api/v2/user/profile` and
  `GET /api/v2/user/comment` after `requireApiUser()` succeeds.
- Update `UserSettingsLoader` and `UserCommentsLoader` to read the current user
  ID with the existing server session helper and call the shared services
  directly instead of `serverApi`.
- Preserve existing route envelopes, HTTP statuses, list metadata, transformed
  comment DTOs, and public-safe failure bodies.
- Preserve existing account UI behavior: `AccountSettings` props,
  `UserCommentsView` props, and loader failure behavior unless focused tests
  demonstrate the current behavior is already broken.
- Add focused service, route-adapter, and loader tests proving these loaders no
  longer depend on same-app HTTP.
- Keep route/fetcher parity and protected API guard inventory tests passing.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change comment create/update/delete behavior or transactions.
- Do not add profile editing, password setup, account linking, or settings
  mutation behavior.
- Do not change account navigation or favourite/watchlist loaders; T-081 and
  T-083 own those paths.
- Do not migrate `ShopProductsLoader`, app base URL construction, or
  `NEXT_PUBLIC_BASE_URL`.
- Do not redesign root-layout session ownership, cache policy, middleware,
  global auth policy, or production logging/redaction policy.

## Files Likely Touched

- `src/lib/data/services/` account profile/comment service file(s)
- `src/app/api/v2/user/profile/route.ts`
- `src/app/api/v2/user/comment/route.ts`
- `src/components/loaders/componentLoaders/UserSettingsLoader.tsx`
- `src/components/loaders/viewLoaders/UserCommentsLoader.tsx`
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

- `UserSettingsLoader` and `UserCommentsLoader` no longer import `serverApi`,
  `serverUserApi`, or fetch same-app user profile/comment routes.
- The protected user profile and comment read routes still call
  `requireApiUser()` before service work.
- The routes preserve existing success/error envelopes, statuses, profile DTOs,
  comment DTOs, and comment list metadata.
- The loaders preserve existing rendered output and failure behavior.
- Focused tests cover service success/missing/failure behavior, route adapter
  guard/envelope behavior, and loader no-self-fetch behavior.
- Route/fetcher parity and protected API guard inventories remain passing.

## Verification

Run focused tests first, then broaden:

```bash
npm test -- --runTestsByPath <focused account profile/comment service/route/loader tests>
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-083 completed.
- Keep this as the account profile/comment read migration only. If
  implementation reveals profile mutation, comment mutation, shop-loader,
  base-URL, or logging-policy issues, report them as follow-up task candidates
  instead of widening this task.
- Completed on 2026-05-17.
- Added `getOwnUserProfile` and `getOwnUserComments` server-only services for
  authenticated profile/settings and populated user-comment reads.
- `GET /api/v2/user/profile` and `GET /api/v2/user/comment` still call
  `requireApiUser()` before service work and preserve their success/error
  envelopes, statuses, comment DTO transforms, and comment list metadata.
- `UserSettingsLoader` and `UserCommentsLoader` now read the current session
  user ID and call those services directly. They no longer import
  `serverApi`/`serverUserApi` or self-fetch the user profile/comment routes.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/data/getOwnUserProfile.test.ts __tests__/unit/data/getOwnUserComments.test.ts __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/userCommentRoute.test.ts __tests__/unit/loaders/UserProfileCommentsLoaders.test.tsx __tests__/unit/api/routeFetcherParity.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check` passed. Build
  retained existing unrelated static-generation MongoDB, branch-verification,
  navigation-link, and `ArticleView` debug output.

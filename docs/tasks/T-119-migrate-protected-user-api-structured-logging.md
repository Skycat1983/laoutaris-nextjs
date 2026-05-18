# T-119 Migrate Protected User API Structured Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Migrate protected user API route internal-failure paths that still use direct
route-level `console.error()` to the T-099 request-context and structured
redacted logger pattern, preserving shared guard behavior, ownership checks, and
existing response contracts.

## Context

- T-099 introduced provider-neutral request IDs, request-context creation,
  structured redacted API logging, and optional `requestId` plus `X-Request-Id`
  response helper support.
- T-117 and T-118 migrated public content, discovery, navigation, search, and
  shop route slices.
- Protected user API routes still have direct route-level `console.error()` in
  favourite, watchlist, and comment handlers.
- `GET /api/v2/user/profile` was already migrated as the representative user
  route in T-099; avoid reworking it unless tests need shared setup updates.

## Scope

In scope:

- Migrate these protected user route files:
  - `src/app/api/v2/user/favourite/route.ts`
  - `src/app/api/v2/user/favourite/[artworkId]/route.ts`
  - `src/app/api/v2/user/watchlist/route.ts`
  - `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
  - `src/app/api/v2/user/comment/route.ts`
  - `src/app/api/v2/user/comment/[commentId]/route.ts`
- For internal failures, create request context from the incoming request, log
  through the structured logger with safe route, method, operation, and error
  context, and return `requestId` plus `X-Request-Id` on server-error
  responses.
- Preserve `requireApiUser()` guard ordering and JSON `401` behavior.
- Preserve validation `400`s, missing-resource `404`s, forbidden `403`s,
  ownership checks, transaction behavior, success DTOs, and existing action/
  loader contracts.
- Keep expected validation, unauthenticated, not-found, and forbidden paths out
  of error-level logging unless they are already internal failures.
- Add or extend focused tests for representative saved-item and comment
  internal-failure paths, including propagated and generated request IDs.
- Add source hygiene assertions that the migrated protected user route files no
  longer use direct route-level `console.error()`.
- Update this task brief and related workstream docs after completion.

Out of scope:

- Do not migrate admin routes; keep them for a separate task.
- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, CI smoke, or scheduled smoke.
- Do not change middleware, NextAuth config, guard utilities, ownership helper
  semantics, saved-item server actions, account loaders, or account UI.
- Do not change validation schemas, DTO transforms, DB queries, cascade/
  transaction semantics, route cache policy, or public API routes.
- Do not remove lower-level service/client `console.error()` calls outside the
  scoped route files.

## Likely Files

- `src/app/api/v2/user/favourite/route.ts`
- `src/app/api/v2/user/favourite/[artworkId]/route.ts`
- `src/app/api/v2/user/watchlist/route.ts`
- `src/app/api/v2/user/watchlist/[artworkId]/route.ts`
- `src/app/api/v2/user/comment/route.ts`
- `src/app/api/v2/user/comment/[commentId]/route.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `__tests__/unit/api/userSavedRoutes.test.ts`
- `__tests__/unit/api/userCommentRoute.test.ts`
- `__tests__/unit/api/userProfileRoute.test.ts`

## Acceptance Criteria

- Scoped protected user route internal failures use the T-099 request-context
  and structured logger pattern instead of direct route-level `console.error()`.
- Scoped server-error responses include a safe `requestId` and `X-Request-Id`.
- Existing guard, validation, ownership, not-found, forbidden, transaction, and
  success behavior is preserved.
- Focused tests cover representative saved-item and comment failure paths,
  propagated/generated request IDs, `X-Request-Id`, private-message redaction
  where applicable, and source hygiene.
- Workstream/task documentation records completion, verification, and remaining
  observability follow-ups.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/api/userCommentRoute.test.ts __tests__/unit/api/userProfileRoute.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(" src/app/api/v2/user
git diff --check
```

## Completion Notes

- 2026-05-18: Migrated the scoped protected user favourite, watchlist, and
  comment route internal-failure paths to request-context structured logging.
  Server-error responses now include `requestId` plus `X-Request-Id`, while
  shared `requireApiUser()` guard behavior, validation `400`s, not-found
  `404`s, forbidden `403`s, ownership checks, transaction behavior, success
  DTOs, and loader/action contracts were preserved.
- Extended focused saved-item, comment, and observability route tests for
  propagated and generated request IDs, response headers, structured log
  context, private exception text staying out of public bodies, and source
  hygiene proving the migrated route files no longer call route-level
  `console.error()`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/api/userCommentRoute.test.ts __tests__/unit/api/userProfileRoute.test.ts`,
  `rg -n "console\\.error\\(" src/app/api/v2/user`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- Remaining observability follow-ups: admin route-level logging migration,
  monitoring provider selection/instrumentation, alert or scheduled-smoke
  automation, and owner-approved completion of incident-response owner matrix
  placeholders.

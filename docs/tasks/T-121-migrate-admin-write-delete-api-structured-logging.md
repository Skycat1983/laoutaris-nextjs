# T-121 Migrate Admin Write Delete API Structured Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Migrate admin create, update, and delete API route internal-failure paths that
still use direct route-level `console.error()` to the T-099 request-context and
structured redacted logger pattern, preserving shared admin guard behavior,
validation, write allowlists, cascade, and transaction contracts.

## Context

- T-099 introduced provider-neutral request IDs, request-context creation,
  structured redacted API logging, and optional `requestId` plus `X-Request-Id`
  response helper support.
- T-117 through T-120 migrated public, protected user, and admin read route
  slices.
- The remaining admin route-level `console.error()` calls are in admin create,
  update, and delete routes.
- These routes are mutation-heavy, so this task must be narrow about logging
  only and must not alter persistence semantics.

## Scope

In scope:

- Migrate these admin mutation route files:
  - `src/app/api/v2/admin/article/create/route.ts`
  - `src/app/api/v2/admin/article/update/[id]/route.ts`
  - `src/app/api/v2/admin/article/delete/[id]/route.ts`
  - `src/app/api/v2/admin/artwork/create/route.ts`
  - `src/app/api/v2/admin/artwork/update/[id]/route.ts`
  - `src/app/api/v2/admin/artwork/delete/[id]/route.ts`
  - `src/app/api/v2/admin/blog/create/route.ts`
  - `src/app/api/v2/admin/blog/update/[id]/route.ts`
  - `src/app/api/v2/admin/blog/delete/[id]/route.ts`
  - `src/app/api/v2/admin/collection/create/route.ts`
  - `src/app/api/v2/admin/collection/update/[id]/route.ts`
  - `src/app/api/v2/admin/collection/delete/[id]/route.ts`
  - `src/app/api/v2/admin/comment/delete/[id]/route.ts`
  - `src/app/api/v2/admin/user/delete/[id]/route.ts`
- For internal failures, create request context from the incoming request, log
  through the structured logger with safe route, method, operation, and error
  context, and return `requestId` plus `X-Request-Id` on server-error
  responses.
- Preserve `requireApiAdmin()` guard ordering and JSON `401`/`403` behavior.
- Preserve validation `400`s, invalid-ID `400`s, missing-resource `404`s,
  conflict `409`s, create/update/delete success contracts, parsed allowlisted
  persistence, cascade behavior, transaction abort/commit/end behavior, and
  DB-before-model ordering.
- Keep expected validation, unauthenticated, forbidden, invalid-ID, not-found,
  and conflict paths out of error-level logging unless they are internal
  failures.
- Add or extend focused tests for representative create, update, and delete
  internal-failure paths, including propagated and generated request IDs.
- Add source hygiene assertions that the migrated admin mutation route files no
  longer use direct route-level `console.error()`.
- Update this task brief and related workstream docs after completion.

Out of scope:

- Do not change admin guard utilities, middleware, admin dashboard UI, DTO
  transforms, DB queries, cascade semantics, transaction semantics, validation
  schemas, Shopify product-link validation behavior, or route cache policy.
- Do not migrate non-admin routes; public, protected user, and admin read
  routes are already separate completed slices.
- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, CI smoke, or scheduled smoke.
- Do not remove lower-level service/client `console.error()` calls outside the
  scoped route files.

## Likely Files

- `src/app/api/v2/admin/article/create/route.ts`
- `src/app/api/v2/admin/article/update/[id]/route.ts`
- `src/app/api/v2/admin/article/delete/[id]/route.ts`
- `src/app/api/v2/admin/artwork/create/route.ts`
- `src/app/api/v2/admin/artwork/update/[id]/route.ts`
- `src/app/api/v2/admin/artwork/delete/[id]/route.ts`
- `src/app/api/v2/admin/blog/create/route.ts`
- `src/app/api/v2/admin/blog/update/[id]/route.ts`
- `src/app/api/v2/admin/blog/delete/[id]/route.ts`
- `src/app/api/v2/admin/collection/create/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- `src/app/api/v2/admin/collection/delete/[id]/route.ts`
- `src/app/api/v2/admin/comment/delete/[id]/route.ts`
- `src/app/api/v2/admin/user/delete/[id]/route.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `__tests__/unit/api/adminArticleRoute.test.ts`
- `__tests__/unit/api/adminArtworkRoute.test.ts`
- `__tests__/unit/api/adminBlogRoute.test.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`
- `__tests__/unit/api/adminDeleteRouteGuard.test.ts`

## Acceptance Criteria

- Scoped admin mutation route internal failures use the T-099 request-context
  and structured logger pattern instead of direct route-level `console.error()`.
- Scoped server-error responses include a safe `requestId` and `X-Request-Id`.
- Existing guard, validation, invalid-ID, not-found, conflict, success,
  cascade, transaction, and persistence allowlist behavior is preserved.
- Focused tests cover representative create/update/delete failure paths,
  propagated/generated request IDs, `X-Request-Id`, private-message redaction
  where applicable, and source hygiene.
- Workstream/task documentation records completion, verification, and remaining
  observability follow-ups.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(" src/app/api/v2/admin
git diff --check
```

## Completion Notes

- Completed on 2026-05-18 by migrating the scoped admin article, artwork,
  blog, collection, comment, and user create/update/delete internal-failure
  paths from direct route-level `console.error()` calls to request-context
  structured logging.
- Server-error responses now include `requestId` and `X-Request-Id`, while
  shared admin guard behavior, validation `400`s, invalid-ID handling,
  missing-resource `404`s, conflict `409`s, mutation success contracts,
  allowlisted persistence, cascade behavior, and transaction abort/commit/end
  behavior are preserved.
- Focused tests now cover representative create/update/delete failure paths,
  propagated and generated request IDs, response headers, structured log
  context, public-body redaction of private failure details, and source hygiene
  across the migrated admin mutation route files.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts`,
  `npm run lint`, `npm run build`,
  `rg -n "console\\.error\\(" src/app/api/v2/admin`, and
  `git diff --check`.

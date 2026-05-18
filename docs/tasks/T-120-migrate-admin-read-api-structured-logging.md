# T-120 Migrate Admin Read API Structured Logging

Status: Planned

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Migrate admin read API route internal-failure paths that still use direct
route-level `console.error()` to the T-099 request-context and structured
redacted logger pattern, preserving shared admin guard behavior and existing
read response contracts.

## Context

- T-099 introduced provider-neutral request IDs, request-context creation,
  structured redacted API logging, and optional `requestId` plus `X-Request-Id`
  response helper support.
- T-117 through T-119 migrated public content/discovery/shop and protected user
  route slices.
- Admin read routes still have direct route-level `console.error()` calls.
- Admin write and delete routes also still need migration, but should remain a
  separate slice because they carry broader mutation and transaction risk.

## Scope

In scope:

- Migrate these admin read route files:
  - `src/app/api/v2/admin/article/read/route.ts`
  - `src/app/api/v2/admin/article/read/[id]/route.ts`
  - `src/app/api/v2/admin/artwork/read/route.ts`
  - `src/app/api/v2/admin/artwork/read/[id]/route.ts`
  - `src/app/api/v2/admin/blog/read/route.ts`
  - `src/app/api/v2/admin/blog/read/[id]/route.ts`
  - `src/app/api/v2/admin/collection/read/[id]/route.ts`
  - `src/app/api/v2/admin/comment/read/route.ts`
  - `src/app/api/v2/admin/comment/read/[id]/route.ts`
  - `src/app/api/v2/admin/user/read/route.ts`
  - `src/app/api/v2/admin/user/read/[id]/route.ts`
- Preserve the existing T-099 migrated behavior in
  `src/app/api/v2/admin/collection/read/route.ts`; update shared tests if
  needed but do not rework that route unnecessarily.
- For internal failures, create request context from the incoming request, log
  through the structured logger with safe route, method, operation, and error
  context, and return `requestId` plus `X-Request-Id` on server-error
  responses.
- Preserve `requireApiAdmin()` guard ordering and JSON `401`/`403` behavior.
- Preserve invalid-ID `400`s, empty-list/missing-resource `404`s, success DTOs,
  pagination metadata, transform behavior, DB-before-model ordering, and
  route/fetcher contracts.
- Keep expected validation, unauthenticated, forbidden, empty-list, and
  not-found paths out of error-level logging unless they are internal failures.
- Add or extend focused tests for representative list and detail internal
  failure paths, including propagated and generated request IDs.
- Add source hygiene assertions that the migrated admin read route files no
  longer use direct route-level `console.error()`.
- Update this task brief and related workstream docs after completion.

Out of scope:

- Do not migrate admin create, update, or delete routes.
- Do not change admin guard utilities, middleware, admin dashboard UI, DTO
  transforms, DB queries, pagination behavior, validation contracts, route
  cache policy, or public/protected user API routes.
- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, CI smoke, or scheduled smoke.
- Do not remove lower-level service/client `console.error()` calls outside the
  scoped route files.

## Likely Files

- `src/app/api/v2/admin/article/read/route.ts`
- `src/app/api/v2/admin/article/read/[id]/route.ts`
- `src/app/api/v2/admin/artwork/read/route.ts`
- `src/app/api/v2/admin/artwork/read/[id]/route.ts`
- `src/app/api/v2/admin/blog/read/route.ts`
- `src/app/api/v2/admin/blog/read/[id]/route.ts`
- `src/app/api/v2/admin/collection/read/[id]/route.ts`
- `src/app/api/v2/admin/comment/read/route.ts`
- `src/app/api/v2/admin/comment/read/[id]/route.ts`
- `src/app/api/v2/admin/user/read/route.ts`
- `src/app/api/v2/admin/user/read/[id]/route.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `__tests__/unit/api/adminReadRouteGuard.test.ts`
- `__tests__/unit/api/adminUserCommentReadRoute.test.ts`

## Acceptance Criteria

- Scoped admin read route internal failures use the T-099 request-context and
  structured logger pattern instead of direct route-level `console.error()`.
- Scoped server-error responses include a safe `requestId` and `X-Request-Id`.
- Existing guard, invalid-ID, empty-list, not-found, pagination, success, and
  transform behavior is preserved.
- Focused tests cover representative admin read list/detail failure paths,
  propagated/generated request IDs, `X-Request-Id`, private-message redaction
  where applicable, and source hygiene.
- Workstream/task documentation records completion, verification, and remaining
  observability follow-ups.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminUserCommentReadRoute.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(" src/app/api/v2/admin/article/read src/app/api/v2/admin/artwork/read src/app/api/v2/admin/blog/read src/app/api/v2/admin/collection/read src/app/api/v2/admin/comment/read src/app/api/v2/admin/user/read
git diff --check
```

## Completion Notes

- Pending.

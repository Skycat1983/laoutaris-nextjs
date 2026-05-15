# T-039 Migrate Admin Read Routes To Shared Guard

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move the remaining admin read routes that still use `isAdmin()` onto the shared
`requireApiAdmin()` guard and add focused route coverage for the migrated slice.

## Why Now

T-026 introduced shared route-local API guards, T-030 added the missing admin
user/comment detail read routes behind `requireApiAdmin()`, and T-034/T-037/T-038
put admin create/update routes on the same guard pattern. F-036 remains open
because many admin read routes still use `isAdmin()`, collapse unauthenticated
and non-admin callers into `401`, and do not consistently own route-local target
read DB setup.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses do not
  consistently return real HTTP status codes.
- [R-002](../risks/production-readiness.md): broader admin guard migration
  remains open.
- [R-006](../risks/production-readiness.md): route status and response behavior
  remain inconsistent across API groups.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-030 Implement admin user and comment detail read routes](T-030-admin-user-comment-detail-read-routes.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/api/requireApiAdmin.ts`
- `src/app/api/v2/admin/article/read/route.ts`
- `src/app/api/v2/admin/article/read/[id]/route.ts`
- `src/app/api/v2/admin/artwork/read/route.ts`
- `src/app/api/v2/admin/artwork/read/[id]/route.ts`
- `src/app/api/v2/admin/blog/read/route.ts`
- `src/app/api/v2/admin/blog/read/[id]/route.ts`
- `src/app/api/v2/admin/collection/read/route.ts`
- `src/app/api/v2/admin/collection/read/[id]/route.ts`
- `src/app/api/v2/admin/comment/read/route.ts`
- `src/app/api/v2/admin/user/read/route.ts`
- `__tests__/unit/api/adminUserCommentReadRoute.test.ts`

## Scope

In scope:

- Replace `isAdmin()` with `requireApiAdmin()` in the remaining admin read
  routes that still use the legacy guard:
  - article list/detail,
  - artwork list/detail,
  - blog list/detail,
  - collection list/detail,
  - comment list,
  - user list.
- Preserve the existing transformed success DTOs and list metadata shapes.
- Preserve current empty-list and not-found response semantics.
- Return the shared guard's real JSON `401` for unauthenticated callers and
  `403` for authenticated non-admin callers.
- Add explicit target-read `dbConnect()` ownership before model reads where the
  route currently relies on implicit connection state.
- Validate detail-route ObjectId params before target model reads and return a
  structured JSON `400` for invalid IDs.
- Keep already-migrated admin user/comment detail read routes unchanged unless a
  test needs a small consistency fix.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminReadRouteGuard.test.ts`, covering
  unauthenticated/non-admin short-circuiting, invalid detail IDs, representative
  success/not-found/list metadata paths, and public-safe target-read failures.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin create/update routes.
- Do not change admin delete routes; T-040 owns that follow-up.
- Do not redesign admin list pagination, filtering, empty-list semantics, or
  action-segment route conventions.
- Do not change response DTO transforms beyond preserving current behavior.
- Do not add broad shared API response helpers.

## Acceptance Criteria

- All in-scope admin read routes use `requireApiAdmin()` instead of `isAdmin()`.
- Unauthenticated callers receive JSON `401` and non-admin callers receive JSON
  `403` before target model reads.
- Invalid detail IDs return JSON `400` before target model reads.
- Existing success, not-found, and empty-list behavior is preserved.
- Focused admin read route tests, lint, and build pass.

## Verification

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadRouteGuard.test.ts __tests__/unit/api/adminUserCommentReadRoute.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 2 suites and 40 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation and fetcher debug log
noise appeared during page generation.

## Completion

Completed on 2026-05-15.

- Migrated admin article, artwork, blog, collection, comment, and user read
  routes from `isAdmin()` to `requireApiAdmin()`, preserving the existing
  success DTOs, metadata, empty-list, not-found, and public-safe `500`
  responses.
- Added explicit target-read `dbConnect()` ownership before each migrated
  route's own model reads. The shared guard still owns persisted admin-role
  verification separately.
- Added structured JSON `400` invalid-ID handling for admin read detail routes
  before target model reads, including the already-migrated user/comment detail
  routes as a small consistency fix.
- Added `__tests__/unit/api/adminReadRouteGuard.test.ts` for the migrated read
  routes and extended `adminUserCommentReadRoute` coverage for invalid detail
  IDs.
- Remaining work: T-040 owns admin delete route guard migration and destructive
  ID validation. Middleware API redirect cleanup and broader response helper
  standardization remain separate follow-ups.

## Escalate

Escalate to the orchestrator if:

- Admin read list pagination or filter validation must be changed to make guard
  migration pass.
- Existing admin clients rely on non-admin requests receiving `401` instead of
  `403`.
- DTO transform mismatches require a broader F-038/F-040 contract task.

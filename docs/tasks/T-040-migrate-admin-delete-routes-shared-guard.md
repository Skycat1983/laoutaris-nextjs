# T-040 Migrate Admin Delete Routes To Shared Guard

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move admin delete routes onto the shared `requireApiAdmin()` guard, validate
route IDs before destructive work, and preserve existing cascade/delete
semantics.

## Why Now

After T-039 migrates admin read routes, the remaining high-risk admin API guard
gap is destructive delete behavior. Current admin delete routes still use
`isAdmin()`, return only `401` for all auth failures, often start transaction
sessions before ID validation, and rely on implicit DB connection state before
destructive model work.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses do not
  consistently return real HTTP status codes.
- [R-002](../risks/production-readiness.md): broader admin guard migration
  remains open.
- [R-006](../risks/production-readiness.md): route status and response behavior
  remain inconsistent across API groups.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-033 Harden user comment delete route](T-033-harden-user-comment-delete-route.md)
- [T-039 Migrate admin read routes to shared guard](T-039-migrate-admin-read-routes-shared-guard.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Content/admin workstream](../workstreams/content-assets-and-admin-ops.md)
- `src/lib/api/requireApiAdmin.ts`
- `src/app/api/v2/admin/article/delete/[id]/route.ts`
- `src/app/api/v2/admin/artwork/delete/[id]/route.ts`
- `src/app/api/v2/admin/blog/delete/[id]/route.ts`
- `src/app/api/v2/admin/collection/delete/[id]/route.ts`
- `src/app/api/v2/admin/comment/delete/[id]/route.ts`
- `src/app/api/v2/admin/user/delete/[id]/route.ts`
- `src/lib/api/admin/delete/fetchers.ts`

## Scope

In scope:

- Replace `isAdmin()` with `requireApiAdmin()` in admin delete routes for:
  article, artwork, blog, collection, comment, and user.
- Return the shared guard's real JSON `401` for unauthenticated callers and
  `403` for authenticated non-admin callers before destructive work.
- Validate route ObjectId params before target model reads/writes and before
  starting transaction sessions where feasible.
- Add explicit route-local `dbConnect()` ownership before destructive model
  work.
- Preserve existing successful `DeleteDocumentResult` response shape:
  `{ success: true, data: null, message }`.
- Preserve current cascade semantics:
  - artwork delete blocks if an article references the artwork and removes the
    artwork from collections,
  - blog delete removes associated comments and user comment references,
  - comment delete removes the comment from related user/blog records,
  - user delete removes user comments and saved-item references.
- Preserve existing conflict/not-found behavior.
- Return public-safe `500` responses for persistence/transaction failures.
- Add focused route tests, suggested path:
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts`, covering
  unauthenticated/non-admin short-circuiting, invalid IDs before sessions/model
  work, representative not-found/conflict/success paths, transaction abort on
  failure, and public-safe internal failures.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change admin read routes; T-039 owns that slice.
- Do not redesign destructive UX, confirmation modals, or admin operation tabs.
- Do not change cascade semantics beyond preserving and testing existing
  behavior.
- Do not add audit logs or soft-delete behavior.
- Do not settle whether admin action-segment routes are canonical.

## Acceptance Criteria

- All admin delete routes use `requireApiAdmin()` instead of `isAdmin()`.
- Unauthenticated callers receive JSON `401` and non-admin callers receive JSON
  `403` before destructive work.
- Invalid IDs return JSON `400` before target model work and before transaction
  sessions where feasible.
- Existing success, not-found, conflict, and cascade behavior is preserved.
- Focused admin delete route tests, lint, and build pass.

## Verification

Completed verification on 2026-05-15:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 1 suite and 27 tests. Lint passed with no
warnings. Build passed; existing MongoDB/static-generation, branch-verification,
link, and fetcher debug log noise appeared during page generation.

## Completion

Completed on 2026-05-15.

- Migrated admin article, artwork, blog, collection, comment, and user delete
  routes from `isAdmin()` to `requireApiAdmin()`, preserving the shared guard's
  JSON `401` and `403` responses before route-local destructive work.
- Added delete-route ObjectId validation before target model reads/writes and
  before transaction session startup for artwork, blog, comment, and user
  deletes.
- Added explicit route-local `dbConnect()` calls before destructive model work
  while leaving the shared guard's persisted admin-role verification ownership
  intact.
- Preserved existing `DeleteDocumentResult` success envelopes, not-found and
  artwork conflict responses, and cascade behavior for artwork, blog, comment,
  and user deletes.
- Added `__tests__/unit/api/adminDeleteRouteGuard.test.ts` covering shared
  guard short-circuiting, invalid IDs before sessions/model work, representative
  not-found/conflict/success paths, cascade behavior, transaction abort on
  failure, and public-safe `500` responses.
- Remaining protected API work includes middleware API redirect behavior,
  broader response-helper standardization, and any additional protected route
  inventory outside this delete slice.

## Escalate

Escalate to the orchestrator if:

- A current delete cascade is unsafe or appears to delete more data than the
  existing behavior documents.
- Invalid-ID handling cannot be moved before transaction setup without changing
  observable behavior.
- Admin delete responses need a broader shared API response-helper decision.

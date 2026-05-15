# T-043 Add Protected API Guard Inventory

Status: Ready

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Add a focused static regression test that proves protected user/admin API route
files use the shared route-local guards and do not fall back to direct session
or legacy admin helper checks.

## Why Now

T-026 introduced `requireApiUser()` and `requireApiAdmin()`. T-027, T-033,
T-039, T-040, and T-042 migrated the protected user/admin route groups, and
T-041 fixed middleware API auth responses above them. A current source scan
shows protected `/api/v2/user` and `/api/v2/admin` route files now use the
shared guards. Before moving to broader response-helper or logging work, the
repo needs a cheap guardrail so new protected routes cannot quietly reintroduce
`getServerSession()`, `getUserIdFromSession()`, or `isAdmin()` at route
boundaries.

This task addresses:

- [F-036](../audits/findings-register.md): protected API auth responses and
  failure statuses were inconsistent.
- [F-016](../audits/findings-register.md): production-critical auth/admin API
  flows need reliable tests.
- [R-002](../risks/production-readiness.md): broader protected API migration
  remains open until the invariant is guarded.
- [R-005](../risks/production-readiness.md): auth/admin API coverage remains
  narrow.
- [R-006](../risks/production-readiness.md): API statuses and response
  behavior need regression coverage.

## Read First

- [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md)
- [T-027 Migrate user saved routes to shared guard](T-027-user-saved-routes-shared-guard.md)
- [T-033 Harden user comment delete route](T-033-harden-user-comment-delete-route.md)
- [T-039 Migrate admin read routes to shared guard](T-039-migrate-admin-read-routes-shared-guard.md)
- [T-040 Migrate admin delete routes to shared guard](T-040-migrate-admin-delete-routes-shared-guard.md)
- [T-041 Harden middleware API auth responses](T-041-harden-middleware-api-auth-responses.md)
- [T-042 Migrate user comment read/write routes to shared guard](T-042-migrate-user-comment-read-write-shared-guard.md)
- [Auth/admin workstream](../workstreams/auth-admin-and-permissions.md)
- [Testing workstream](../workstreams/testing-and-quality.md)
- `src/lib/api/requireApiUser.ts`
- `src/lib/api/requireApiAdmin.ts`
- `src/app/api/v2/user/`
- `src/app/api/v2/admin/`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Add a focused static test, suggested path:
  `__tests__/unit/api/protectedApiGuardInventory.test.ts`.
- Recursively inventory `route.ts` files under:
  - `src/app/api/v2/user`,
  - `src/app/api/v2/admin`.
- Assert every protected user route file imports and calls
  `requireApiUser()`.
- Assert every protected admin route file imports and calls
  `requireApiAdmin()`.
- Assert protected route files do not import or call direct route-boundary auth
  helpers:
  - `getServerSession`,
  - `getUserIdFromSession`,
  - `isAdmin`.
- Assert, where practical, that each exported HTTP method handler has a guard
  call before request body reads, `dbConnect()`, model reads/writes, or
  transaction setup. If a route needs an explicit exception, document the
  exception in the test with the route path and reason.
- Keep public optional-session routes such as public artwork/article ownership
  display outside this protected-route inventory.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change route runtime behavior unless the inventory exposes a simple
  missed protected-route guard.
- Do not include `/api/v2/public` routes; their optional session reads are a
  separate policy.
- Do not standardize API response helpers or DTO envelopes in this task.
- Do not change middleware behavior; T-041 owns that slice.
- Do not broaden into production logging policy.

## Acceptance Criteria

- A new focused static test fails if a protected user/admin API route omits the
  expected shared guard.
- The test fails if protected route files use direct session/admin helper checks
  at the route boundary.
- Existing protected route files pass without runtime behavior changes, unless
  the test identifies a real missed guard that is fixed in scope.
- The task updates F-036/R-002/R-006 notes to separate completed protected
  route guard coverage from remaining response-helper/logging work.
- Focused inventory test, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/protectedApiGuardInventory.test.ts
npm run lint
npm run build
```

## Completion

Pending.

## Escalate

Escalate to the orchestrator if:

- The inventory finds a protected route that cannot safely call the shared guard
  before DB/body work.
- Static ordering checks become too brittle for the current route structure.
- A route under `src/app/api/v2/user` or `src/app/api/v2/admin` is intentionally
  public and needs an explicit architecture decision.

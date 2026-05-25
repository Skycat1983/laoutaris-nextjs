# T-273 Add Admin Frontend Persisted Role Guard

Status: Completed

Workstreams:

- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Close the A-032 admin frontend boundary gap by verifying persisted admin role
before rendering the admin shell, while preserving existing API guard behavior.

## Context

- A-032 found admin APIs verify both session role and persisted MongoDB role via
  `requireApiAdmin()`.
- Admin frontend routes currently rely on middleware JWT role only, so a
  demoted admin with an existing JWT can pass the admin shell until sign-out or
  token invalidation, even though guarded admin APIs should deny data/mutation.

## Scope

In scope:

- Add a server-side admin frontend guard or helper for admin layout/page
  rendering that checks persisted role without pulling server-only code into
  client components.
- Preserve existing middleware behavior and admin API guards.
- Add focused tests for allowed admin, demoted/stale-JWT admin, non-admin, and
  unauthenticated behavior where practical.
- Update auth runbook if the accepted frontend boundary changes.

Out of scope:

- Changing NextAuth session strategy.
- Credential rotation or smoke accounts.
- Broad auth helper pruning.

## Concurrency

Do not run in parallel with another task editing admin layouts/pages,
auth/session helper boundaries, or auth import-boundary tests.

## Files Likely Touched

- `src/app/admin/**`
- `src/lib/session/**` or a new server-only admin frontend guard helper
- Auth/admin tests
- `docs/runbooks/auth.md`
- This task and `docs/tasks/README.md`

## Completion Contract

- Update this task and task index.
- Record exact verification and any client/server import-boundary checks run.

## Acceptance Criteria

- Admin frontend shell rendering verifies persisted admin role.
- Demoted/stale-JWT admin sessions cannot render admin dashboard content.
- API guard behavior remains unchanged.
- Client/server import-boundary tests remain green.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts <focused admin frontend guard tests>
git diff --check
```

## Handoff Notes

- Completed from A-032 F-A032-001.
- Added `src/lib/session/requireAdminFrontendAccess.ts` as a server-only
  frontend guard that reads the NextAuth session, checks the JWT/session role,
  connects to MongoDB, and verifies the persisted `UserModel.role` before the
  admin dashboard layout renders.
- `src/app/admin/dashboard/layout.tsx` now awaits the guard before returning
  the admin sidebar, main slot, feed slot, or child content.
- Unauthenticated frontend access redirects to `/sign-in`; session non-admins
  and stale admin JWTs whose persisted role is no longer `admin` redirect to
  `/`; persistence verification failures fail closed with
  `Unable to verify admin access`.
- Existing middleware and `requireApiAdmin()` API guard behavior was preserved.
- Added `__tests__/unit/auth/adminFrontendGuard.test.tsx` covering allowed
  admin rendering, unauthenticated redirect, non-admin redirect,
  demoted/stale-JWT redirect, and persistence-verification failure.
- While running the required client/server import-boundary check, an already
  dirty shop-gallery WIP had introduced a runtime import from
  `src/lib/data/types/shopTypes.ts`. The check was restored by keeping
  `ShopProductGallery`'s `shopTypes` import type-only and moving its
  `isShopSortOption` helper local to the client component.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/auth/adminFrontendGuard.test.tsx
npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx
npm test -- --runTestsByPath __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/shopUnsupportedControls.test.tsx
git diff --check
```

All listed tests passed. Jest emitted the existing Node `punycode`
deprecation warning during these runs.

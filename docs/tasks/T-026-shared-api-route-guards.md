# T-026 Introduce Shared API Route Guards

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Introduce shared route-local API guards for authenticated user and admin
requests, then migrate a small representative route slice so protected API
failures return real JSON `401`/`403` statuses consistently.

## Why Now

A-004 and A-002 found that protected API auth responses are inconsistent:
middleware may redirect API callers, route-local branches often return body-only
errors with HTTP `200`, and admin routes use ad hoc `isAdmin()` checks. T-005
proved a route-local admin guard on the Cloudinary signing endpoint. T-026 should
turn that into a reusable user/admin guard pattern without trying to migrate the
entire admin and user API surface in one pass.

This task addresses:

- [F-036](../audits/findings-register.md): API failures and protected API auth
  responses do not consistently return real HTTP status codes.
- [R-002](../risks/production-readiness.md): broader admin guard migration
  remains open.
- [R-006](../risks/production-readiness.md): API response envelopes and HTTP
  statuses are inconsistent.
- [R-005](../risks/production-readiness.md): route-guard coverage is still
  narrow.

## Read First

- [A-004 Auth/admin result](../audits/results/A-004-auth-admin-permissions.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- `src/lib/api/requireApiAdmin.ts`
- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `src/app/api/v2/admin/collection/create/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- `src/app/api/v2/user/profile/route.ts`
- `__tests__/unit/api/cloudinarySigningRoute.test.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`

## Scope

In scope:

- Keep route-local protection; do not rely on middleware as the only API guard.
- Add or refactor shared guard helpers under `src/lib/api/` so routes can call:
  - a user guard that returns stable `session.user.id` or a JSON `401`
    response.
  - an admin guard that preserves the existing `requireApiAdmin()` behavior:
    require `session.user.id`, require `session.user.role === "admin"`, verify
    the persisted DB role by stable ID, and return JSON `401`/`403`/public-safe
    `500` responses.
- Preserve the current error envelope shape used by `requireApiAdmin()` unless
  tests reveal a local contract reason to tighten it:
  `{ success: false, message?: string, error: string }`.
- Migrate only this representative slice:
  - `src/app/api/v2/admin/collection/create/route.ts`
  - `src/app/api/v2/admin/collection/update/[id]/route.ts`
  - `src/app/api/v2/user/profile/route.ts`
- For admin collection create/update, replace the `isAdmin()` plus
  `getUserIdFromSession()` pairing with the shared admin guard and continue to
  use the returned `userId` as the author.
- For user profile, replace body-only unauthenticated failure with the shared
  user guard's real HTTP `401`. Do not change the profile DTO/raw-document shape
  in this task.
- Add focused tests for the shared guards and migrated routes:
  unauthenticated `401`, authenticated non-admin `403` for admin routes, no body
  read before auth failure where applicable, successful admin author ownership,
  and user profile `401`/success behavior.
- Update this task, auth/data/testing workstreams, findings, risks, and
  orchestration state after completion.

Out of scope:

- Do not migrate all admin routes or all user routes.
- Do not change middleware redirect behavior in this task.
- Do not change user profile response DTO shape, route/fetcher parity,
  favourite/watchlist semantics, or admin article/artwork/blog validation.
- Do not redesign root-layout session reads or NextAuth callback behavior.
- Do not add production smoke credentials or Vercel secrets.

## Acceptance Criteria

- Shared route-local user/admin guard helpers exist and are covered by focused
  unit tests.
- Admin collection create/update use the shared admin guard and keep the T-020
  validation/persistence behavior.
- User profile returns a real JSON `401` for unauthenticated API callers.
- Focused route tests cover `401` and `403` guard behavior without relying on
  middleware redirects.
- No broad route migration or unrelated DTO refactor is included.

## Verification

Run the narrow relevant tests:

```bash
npm test -- --runTestsByPath __tests__/unit/api/cloudinarySigningRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/userProfileRoute.test.ts
```

If the shared guard tests are placed in a separate file, include that file in
the focused command.

Then run:

```bash
npm run lint
npm run build
```

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/api/cloudinarySigningRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts __tests__/unit/api/userProfileRoute.test.ts
npm run lint
npm run build
```

Notes: focused Jest passed with 4 suites and 36 tests. Lint passed with no
warnings. Build passed; existing Google Fonts retry noise, Browserslist notice,
MongoDB connection logs, and fetcher debug output appeared during build.

## Completion

Completed on 2026-05-14.

- Added shared route-local user/admin guard support under `src/lib/api/`:
  `requireApiUser()` returns stable `session.user.id` or JSON `401`, and
  `requireApiAdmin()` now shares the same auth-error response helper while
  preserving its session role, persisted DB role, and public-safe `500`
  behavior.
- Migrated admin collection create/update to `requireApiAdmin()`; create
  continues to use the returned `userId` as the collection author.
- Migrated user profile to `requireApiUser()` so unauthenticated callers receive
  a real JSON `401`; the existing raw profile document response shape was left
  unchanged.
- Added focused guard and route tests covering user/admin guard failures,
  persisted admin role verification, admin route `401`/`403`, no body read
  before auth failure, admin author ownership, and user profile `401`/success.

Remaining work: this intentionally did not migrate the full admin/user API
surface, middleware redirect behavior, profile DTO shape, favourite/watchlist
semantics, or article/artwork/blog admin validation. Continue those as separate
scoped tasks.

## Escalate

Escalate to the orchestrator if:

- The shared guard shape would force a broad API response-helper redesign.
- User profile cannot be migrated without changing its response DTO contract.
- Admin collection tests expose unrelated validation/persistence regressions.
- Middleware changes appear necessary to complete this route-local guard slice.

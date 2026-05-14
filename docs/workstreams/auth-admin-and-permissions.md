# Auth, Admin, And Permissions Workstream

Status: Active

Goal: harden authentication, protected routes, admin access, and user-owned
features before production launch.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Auth runbook](../runbooks/auth.md)
- [Production-readiness risks](../risks/production-readiness.md)

## Blocks

- Safe admin CRUD usage.
- User account production readiness.
- Deployment security signoff.

## Related Code Areas

- `src/middleware.ts`
- `src/lib/config/authOptions.ts`
- `src/lib/session/`
- `src/lib/actions/`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/v2/admin/`
- `src/app/api/v2/user/`
- `src/app/admin/`
- `src/app/account/`

## Current Facts

- NextAuth uses JWT sessions.
- Providers include credentials, GitHub, and Google.
- Middleware checks protected and admin routes through route utilities.
- Admin role is read from the token.
- User features include favourites, watchlist, comments, and profile.
- A-014 found stale or unused auth/session pruning candidates and a likely stale
  `/protected` route that need A-004 confirmation before deletion.
- A-015 found favourite/watchlist server actions touch MongoDB without explicit
  connection setup or route revalidation.
- A-004 completed the auth/admin audit and found credentials admin role is not
  persisted into JWT/session state, ownership helpers resolve by
  `session.user.name`, protected API auth responses are inconsistent, Cloudinary
  signing lacks a route-local guard, `/protected` is stale/invalid, legacy
  session helpers compete with NextAuth, and admin bootstrap/recovery is missing.
- T-002 now persists credentials users' database role through authorize, JWT,
  and session state.
- T-003 now makes `session.user.id` the canonical protected-read ownership
  source and removes username lookup/user creation from the normal session user
  helpers.
- T-005 added a route-local API admin guard and JSON 401/403 behavior to the
  Cloudinary signing endpoint without broad admin route migration.

## Backlog

- Use the A-004 protected-route inventory when changing middleware or admin API
  guards.
- Introduce shared `requireUser` and `requireAdmin` route helpers with
  consistent JSON 401/403 behavior for API routes.
- Migrate additional admin API routes to the API admin guard only through
  separate scoped tasks with focused route tests.
- Confirm whether `/protected` is still intentional; if not, remove the route
  and protected-route constant in the same auth-reviewed change.
- Choose the current sign-in/session path, then remove the legacy
  `SignInFormBackup`, `processLogin`, and custom session chain only after tests.
- Delete unused auth/session helpers only after A-004 confirms no planned
  test-header or role-helper workflow depends on them.
- Add DB connection handling and route revalidation to favourite/watchlist
  server actions.
- Remove or gate noisy middleware logging before production.
- Confirm credential, OAuth, sign-in, sign-out, and redirect flows.
- Verify role persistence and role assignment behavior.
- Add tests for route protection utilities and high-risk auth helpers.
- Add tests for credentials admin, credentials non-admin, OAuth user, middleware
  admin decisions, shared route guards, and representative user/admin APIs.
- Document admin account bootstrap and recovery workflow, including promotion,
  audit ownership, and recovery if all admins are unavailable.

## Acceptance Criteria

- Admin routes reject unauthenticated and non-admin users consistently.
- User routes enforce ownership where applicable.
- Auth-related environment variables are documented.
- Middleware has production-safe logging behavior.
- Admin bootstrap process is documented and repeatable.

## Verification

```bash
npm test
npm run build
```

Add targeted tests for `routeUtils` and session helpers when changed.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-014 auth/session pruning findings and A-015 account
  action findings into `docs/audits/findings-register.md`, production risks, and
  this backlog.
- 2026-05-14: Reconciled A-004 into F-036, F-042 through F-045, updated F-032,
  production risks, and this backlog.
- 2026-05-14: Completed T-002/F-042 by returning the persisted credentials role,
  preserving it in JWT/session callbacks, and adding focused admin/non-admin
  credentials role tests.
- 2026-05-14: Completed T-003/F-043 by returning stable `session.user.id` from
  ownership helpers, removing normal username lookup/user creation side effects,
  and adding focused helper tests.
- 2026-05-14: Prepared T-005 to harden the Cloudinary signing admin endpoint as
  the first shared API guard slice.
- 2026-05-14: Completed T-005 by adding `requireApiAdmin()`, applying it to the
  Cloudinary signing route, preserving the top-level `signature` response, and
  covering unauthenticated, forbidden, invalid body, missing-secret, and success
  paths with focused tests.

## Next Agent Action

Decide whether to migrate other admin routes to `requireApiAdmin()` before
pruning `/protected` or legacy session code.

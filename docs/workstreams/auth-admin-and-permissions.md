# Auth, Admin, And Permissions Workstream

Status: Planned

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

## Backlog

- Audit protected route definitions and confirm every admin API route is covered.
- Remove or gate noisy middleware logging before production.
- Confirm credential, OAuth, sign-in, sign-out, and redirect flows.
- Verify role persistence and role assignment behavior.
- Add tests for route protection utilities and high-risk auth helpers.
- Document admin account bootstrap and recovery workflow.

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

## Next Agent Action

Audit `src/middleware.ts`, `src/lib/utils/routeUtils.ts`, and admin API routes
to confirm which paths are protected and which are exposed.

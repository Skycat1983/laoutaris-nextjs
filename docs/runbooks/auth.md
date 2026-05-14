# Auth Runbook

Authentication uses NextAuth with JWT sessions.

## Code Areas

- `src/lib/config/authOptions.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/middleware.ts`
- `src/lib/session/`
- `src/lib/actions/authenticateUser.ts`
- `src/lib/actions/registerUser.ts`

## Providers

- Credentials.
- GitHub OAuth.
- Google OAuth.

## Admin Access

Middleware checks route protection and admin access. Admin authorization depends
on the JWT role value being `admin`.

## Manual Verification

- Anonymous user can access public pages.
- Anonymous user is redirected away from protected account/admin pages.
- Signed-in non-admin user can access account pages.
- Signed-in non-admin user cannot access admin pages or admin APIs.
- Admin user can access dashboard and admin APIs.
- Sign-out returns the user to a public route.

## Open Work

- Document admin bootstrap and recovery process.
- Audit all protected routes against middleware matchers.
- Reduce production logging risk in middleware.
- Confirm OAuth redirect behavior for the production domain.

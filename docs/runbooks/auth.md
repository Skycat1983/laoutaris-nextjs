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

## Environment Configuration

Auth environment variables are inventoried in
[environment.md](environment.md). Current source requires `NEXTAUTH_SECRET` for
middleware token lookup, plus `GITHUB_ID`/`GITHUB_SECRET` and
`GOOGLE_ID`/`GOOGLE_SECRET` only when those OAuth providers are enabled.

`JWT_SECRET` and `AUTH_SECRET` are legacy or unused candidates, not current
runtime requirements. Do not keep them in managed environments unless the owner
documents a specific external reason.

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

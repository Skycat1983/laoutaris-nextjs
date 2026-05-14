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
- T-009 removed direct registration console logging that exposed raw password,
  hashed password, and saved user document data.
- T-016 upgraded credential hashing to `bcrypt@6.0.0`, verified new and
  existing bcrypt hashes, removed the remaining direct credential-value log in
  `src/lib/helpers/bcrypt.ts`, and made malformed hashes fail closed.
- A-016 found the current sign-in UI calls `signIn()` without field values,
  comment edit/create validation needs route-boundary fixes, and legacy
  auth/comment controls need accessible labels.
- T-013 now submits the active sign-in form through the username-based NextAuth
  credentials path with shared validation, generic auth errors, accessible
  fields, focused component tests, and `SignInFormBackup` removed.
- T-012 now hardens user comment create/update route validation while preserving
  user ownership checks and adding focused unauthenticated/forbidden route
  coverage.
- T-019 removed `LoginForm`, `processLogin`, the custom JWT cookie session
  helpers, unreferenced duplicate/test-header session helpers, and the stale
  `/protected` route/constant after the active NextAuth credentials path was
  tested.
- T-022 removed the now-unused direct `jose` dependency from `package.json`;
  remaining `jose` installs are transitive through NextAuth/auth packages.
- The 2026-05-14 Vercel bcrypt incident showed that the root layout imported the
  credentials authorize path through `authOptions`, causing public pages to load
  native bcrypt even outside credentials login/register flows.
- T-023 decoupled session/auth configuration imports from credentials password
  verification while preserving the active NextAuth credentials flow.
- T-024 exercised the deployed credentials callback with intentionally invalid
  values and received `401 CredentialsSignin`, not `500`. After T-023 reached
  `origin/main`, the owner confirmed the deployment no longer crashes.
- T-025 documented repeatable credentials smoke handling for production deploys:
  smoke accounts must be owner-approved, secrets must move through a private
  channel outside docs/logs/chat, and evidence records only account source,
  expected role, and outcome.
- T-026 introduced shared route-local user/admin API guards and migrated admin
  collection create/update plus user profile auth-status behavior to real JSON
  `401`/`403` responses for the representative slice.
- T-027 migrated user navigation, favourites, and watchlist read routes to
  `requireApiUser()` with real JSON `401` responses before DB/model work.
- T-028 added explicit DB connection ownership and route revalidation to
  favourite/watchlist server actions, with defensive invalid saved-item input
  handling and focused action tests.

## Backlog

- Use the A-004 protected-route inventory when changing middleware or admin API
  guards.
- Apply shared `requireApiUser()` and `requireApiAdmin()` to remaining
  protected API routes through separate scoped migrations with focused route
  tests.
- Migrate additional admin API routes to the API admin guard only through
  separate scoped tasks with focused route tests.
- Route legacy `JWT_SECRET` env remnants through deployment/auth docs. T-022
  completed the direct `jose` package cleanup; auth packages still own their
  transitive `jose` dependencies.
- Remove or gate noisy middleware logging before production.
- Confirm credential, OAuth, sign-in, sign-out, and redirect flows. For
  deployment smoke, use the T-025 owner-approved smoke-account handling and do
  not record usernames, passwords, cookies, or CSRF tokens.
- Verify role persistence and role assignment behavior.
- Add tests for route protection utilities and high-risk auth helpers.
- Add tests for credentials admin, credentials non-admin, OAuth user, middleware
  admin decisions, shared route guards, and representative user/admin APIs.
- Add tests for remaining representative user/admin APIs as shared route guards
  and ownership helpers are introduced.
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
- 2026-05-14: Reconciled A-008 registration logging into F-051 and T-009.
- 2026-05-14: Completed T-009 by removing direct registration console logging
  and adding focused source hygiene regression coverage.
- 2026-05-14: Reconciled A-016 sign-in, comment, and accessibility findings
  into F-056, F-058, F-061, and F-062.
- 2026-05-14: T-014 created T-016 for the focused `bcrypt@6.0.0` compatibility
  patch, credential hash verification, and removal of the remaining bcrypt
  helper credential log.
- 2026-05-14: Completed T-013 by routing `SignInForm` through shared
  username/password validation and `signIn("credentials", { redirect: false })`,
  adding accessible credential fields and focused tests, updating the sign-up
  modal switch, and removing `SignInFormBackup`.
- 2026-05-14: Completed T-012 by preserving comment ownership checks while
  adding route-safe create/update validation, real HTTP statuses, transformed
  DTO responses, and focused unauthenticated/forbidden route tests.
- 2026-05-14: Completed T-016 by upgrading to `bcrypt@6.0.0`, removing the
  helper credential-value log, making malformed hash verification fail closed,
  and adding focused helper tests for new hashes, existing bcrypt hashes, failed
  verification, and no console logging.
- 2026-05-14: Prepared T-019 to prune or explicitly retire the stale custom
  login/session path and `/protected` after the active NextAuth sign-in repair.
- 2026-05-14: Completed T-019 by removing `LoginForm`, `processLogin`, the
  custom JWT cookie session helpers, unreferenced duplicate/test-header session
  helpers, and `src/app/protected/page.tsx`, removing the stale protected-route
  constant, preserving the active NextAuth credentials path, and verifying
  focused sign-in/route utility tests plus lint.
- 2026-05-14: Prepared T-023 to lazy/decouple credentials bcrypt imports from
  root-layout public session reads after the Vercel native bcrypt incident.
- 2026-05-14: Completed T-023 by moving `authorizeUser` behind a dynamic import
  inside the credentials provider callback. Existing credentials authorize,
  JWT/session role propagation, sign-in form, and bcrypt tracing tests passed
  with the new auth import-boundary coverage.
- 2026-05-14: T-024 partial production smoke confirmed the deployed credentials
  callback returns a controlled `401 CredentialsSignin` for invalid credentials
  instead of a bcrypt native-load `500`. At that point a real credentials
  sign-in smoke remained blocked by missing smoke account credentials and a
  deployment containing T-023.
- 2026-05-14: Completed T-024 after T-023 reached `origin/main` and the owner
  confirmed the Vercel deployment no longer crashes. Repeatable sign-in smoke
  account handling is now a deployment-smoke process follow-up, not a bcrypt
  incident blocker.
- 2026-05-14: Completed T-025's auth-facing deployment process slice by
  documenting owner-approved admin and non-admin smoke accounts, secret-channel
  handoff rules, allowed evidence wording, sign-out verification, non-admin
  admin denial, and admin dashboard access expectations.
- 2026-05-14: Completed T-026 by adding shared route-local user/admin API
  guards, migrating admin collection create/update and user profile auth-status
  behavior, and verifying focused guard/route tests plus lint and build.
- 2026-05-14: Completed T-027 by migrating user navigation, favourites, and
  watchlist read routes to `requireApiUser()`, preserving authenticated DTOs,
  and verifying focused saved-route guard tests, lint, and build.
- 2026-05-14: Prepared T-028 for favourite/watchlist server-action
  `dbConnect()` ownership, affected-route revalidation, defensive saved-item
  input handling, and focused action tests.
- 2026-05-14: Completed T-028 by adding favourite/watchlist server-action
  `dbConnect()` ownership before model work, rejecting invalid `artworkId`
  values before DB/model access, revalidating affected account/artwork paths
  after successful toggles, and verifying focused action tests, lint, and
  build.

## Next Agent Action

After T-029 makes route/fetcher parity measurable, prepare the next scoped
protected API guard migration task from F-036/A-004. Keep admin
bootstrap/recovery documentation, production logging cleanup, F-037 runtime
fixes, and broader root-layout session redesign separate from that guard slice.

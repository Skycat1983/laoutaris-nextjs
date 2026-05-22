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
- T-066 preserved the Cloudinary signing endpoint's shared admin guard behavior
  while adding route-local signing-param allowlist validation before signing.
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
- T-031 pruned the unused unsupported favourite/watchlist write fetchers while
  preserving the active saved-item server-action flow.
- T-032 pruned the unused profile update fetcher while preserving current
  profile read behavior and resolving the remaining F-037 user fetcher drift.
- T-033 migrated user comment delete to `requireApiUser()` before
  DB/transaction work, validates the comment ID before persistence work, and
  returns the typed delete envelope.
- T-039 migrated remaining admin read routes from `isAdmin()` to
  `requireApiAdmin()`, with real JSON `401`/`403` guard responses, target-read
  DB ownership, detail ID validation, and focused route coverage.
- T-040 migrated admin article, artwork, blog, collection, comment, and user
  delete routes to `requireApiAdmin()`, added destructive ID validation before
  target/session work, added route-local DB ownership, and preserved cascade
  behavior with focused route coverage.
- T-041 hardened middleware API auth responses so unauthenticated protected API
  callers receive JSON `401` responses instead of NextAuth redirects, while
  protected frontend routes keep browser redirects.
- T-042 migrated the remaining user comment GET/POST/PATCH handlers from
  `getUserIdFromSession()` to `requireApiUser()`, so the user comment route
  group now uses the shared route-local user guard.
- T-043 added a protected API guard inventory test for all `/api/v2/user` and
  `/api/v2/admin` route files so new protected routes cannot reintroduce direct
  session/admin helper checks at route boundaries.
- T-044 standardized response helpers and real failure statuses for protected
  user profile, navigation, favourite, and watchlist read routes without
  changing the shared guard invariant.
- T-081 moved `AccountSubnavLoader` off same-app HTTP by sharing account
  navigation service logic with `GET /api/v2/user/navigation` while preserving
  the route's `requireApiUser()` guard.
- A-005 later found the account layout still comments out the
  `AccountSubnavLoader` Suspense block despite that loader/test contract.
  T-206 is prepared to restore the existing mount without changing account
  navigation semantics, auth policy, cart/orders behavior, or saved-item
  redirects.
- T-083 moved account favourites/watchlist read loaders off same-app HTTP by
  sharing saved-artwork service logic with the protected user saved-artwork
  read routes while preserving their `requireApiUser()` guards.
- T-084 moved account settings/comments read loaders off same-app HTTP by
  sharing profile/comment service logic with the protected user profile/comment
  read routes while preserving their `requireApiUser()` guards.
- T-048 applied shared response helpers to admin read list/detail routes while
  preserving `requireApiAdmin()` guard behavior, invalid-ID `400`
  short-circuiting, and DB-before-model ordering.
- T-049 applied shared response helpers to admin delete routes while preserving
  the shared admin guard invariant, invalid-ID `400` short-circuiting,
  destructive DB-before-model ordering, cascade behavior, and transaction
  cleanup semantics.
- T-088 removed direct OAuth profile and created-user logging from
  `CustomMongoDBAdapter.createUser()` while preserving adapter-created
  `username`, `role`, `watchlist`, `favourites`, `createdAt`, and `updatedAt`
  defaults.
- T-094 removed the remaining active direct `console.log()` output from
  `getUserFromSession` development test-header paths while preserving
  `X-Test-User-Id`, `X-Test-Admin-Id`, normal NextAuth session lookup,
  delegated helper behavior, and lookup failure `console.error()` handling.
- T-095 removed stale commented `console.log()` snippets from auth callback and
  credentials auth source without changing auth runtime behavior. Full-source
  source-hygiene coverage now keeps `src` free of direct or commented
  `console.log()` calls.
- A-020 found account privacy gaps: credentials signup and OAuth entry do not
  capture terms/privacy acknowledgement, account privacy self-service is not
  implemented, and the visible delete-account button is inert while deletion is
  admin-only.
- T-138 documented the admin bootstrap, promotion, lockout recovery,
  verification, rollback, and secret-handling workflow in the auth runbook.

## Backlog

- Use the A-004 protected-route inventory when changing middleware or admin API
  guards.
- Keep protected API route files on shared `requireApiUser()` and
  `requireApiAdmin()` guards; T-043 now guards this invariant with static
  inventory coverage.
- Migrate any future admin API routes to the API admin guard only through
  separate scoped tasks with focused route tests.
- Keep auth environment variables documented in the environment and auth
  runbooks. T-065 records `JWT_SECRET` and `AUTH_SECRET` as legacy/unused
  candidates; owner cleanup remains separate from runtime auth behavior.
- Remove or gate remaining noisy auth/admin logs before production.
- Confirm credential, OAuth, sign-in, sign-out, and redirect flows. For
  deployment smoke, use the T-025 owner-approved smoke-account handling and do
  not record usernames, passwords, cookies, or CSRF tokens.
- Verify role persistence and role assignment behavior.
- Add tests for route protection utilities and high-risk auth helpers.
- Add tests for credentials admin, credentials non-admin, OAuth user, middleware
  admin decisions, shared route guards, and representative user/admin APIs.
- Add tests for remaining representative user/admin APIs as shared route guards
  and ownership helpers are introduced.
- Define account privacy acceptance, self-service delete/export request
  handling, OAuth data handling, and retention behavior after owner/legal
  requirements are accepted.

## Acceptance Criteria

- Admin routes reject unauthenticated and non-admin users consistently.
- User routes enforce ownership where applicable.
- Auth-related environment variables are documented.
- Middleware has production-safe logging behavior.
- Admin bootstrap and recovery process is documented and repeatable.

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
- 2026-05-15: Prepared T-031 to remove unused favourite/watchlist API write
  fetchers without changing the T-028 server-action mutation path, and T-032 to
  remove the unused profile update fetcher without adding profile editing scope.
- 2026-05-15: Completed T-031 by removing the unused favourite/watchlist API
  write fetchers and their route/fetcher parity known-gap entries without
  changing the T-028 server-action saved-item mutation path.
- 2026-05-15: Completed T-032 by removing the unused profile update fetcher and
  emptying the route/fetcher parity known-gap allowlist without adding profile
  editing scope.
- 2026-05-15: Prepared T-033 to harden `DELETE
  /api/v2/user/comment/[commentId]` with the shared user guard, route-param
  validation before DB work, preserved transaction behavior, and focused delete
  tests.
- 2026-05-15: Completed T-033 by moving user comment delete behind
  `requireApiUser()`, preserving transactional ownership/delete/user/blog
  updates, returning real `401`/`400`/`403`/`404`/`500` statuses, and verifying
  focused route tests, lint, and build.
- 2026-05-15: Completed T-034 by moving admin article create/update behind
  `requireApiAdmin()` before body reads while preserving session-owned create
  authorship and adding focused unauthenticated/non-admin route coverage.
- 2026-05-15: Prepared T-039 and T-040 as the next F-036 protected admin API
  guard migration queue. T-039 owns remaining admin read routes still using
  `isAdmin()`; T-040 owns admin delete routes and destructive ID validation
  after T-039 is reconciled.
- 2026-05-15: Completed T-039 by migrating admin article, artwork, blog,
  collection, comment, and user read routes to `requireApiAdmin()`, adding
  detail read ID validation before target reads, preserving existing read
  response semantics, and verifying focused route tests, lint, and build.
- 2026-05-15: Completed T-040 by migrating admin article, artwork, blog,
  collection, comment, and user delete routes to `requireApiAdmin()`, validating
  delete IDs before route-local destructive work and transaction sessions,
  preserving cascade/delete semantics, and verifying focused route tests, lint,
  and build.
- 2026-05-15: Prepared T-041 to harden middleware API auth responses, preserve
  frontend redirect behavior, keep admin API `403` behavior, and remove
  always-on middleware debug logs with focused middleware/route utility tests.
- 2026-05-15: Completed T-041 by returning shared JSON `401` middleware
  responses for unauthenticated protected API requests, preserving protected
  frontend redirects and admin API/frontend denial behavior, removing direct
  middleware debug logs, and verifying focused middleware/route utility tests,
  lint, and build.
- 2026-05-15: Prepared T-042 to move user comment GET/POST/PATCH handlers to
  `requireApiUser()` while preserving T-012 validation behavior and T-033 delete
  behavior.
- 2026-05-15: Completed T-042 by moving user comment GET/POST/PATCH handlers to
  `requireApiUser()`, returning shared JSON `401` guard responses before body,
  DB, model, or transaction work, preserving comment create/update/delete
  behavior, and verifying focused route tests, lint, and build.
- 2026-05-15: Prepared T-043 to add static protected-route guard inventory
  coverage so user/admin API route files keep using `requireApiUser()` and
  `requireApiAdmin()` instead of direct session/admin helper checks.
- 2026-05-15: Completed T-043 by adding
  `__tests__/unit/api/protectedApiGuardInventory.test.ts`, which inventories
  protected user/admin route files, requires the shared guard imports/calls,
  rejects direct `getServerSession()`, `getUserIdFromSession()`, or `isAdmin()`
  route-boundary checks, and verifies exported handlers call the guard before
  body, DB, model, or transaction work.
- 2026-05-15: Prepared T-044 to apply shared API response helpers to protected
  user profile/navigation/favourite/watchlist read routes while preserving
  `requireApiUser()` ordering and leaving comments/admin/bootstrap work
  separate.
- 2026-05-15: Completed T-044 by applying shared API response helpers to
  protected user profile/navigation/favourite/watchlist read routes. The routes
  still call `requireApiUser()` before DB/model/transform work, preserve shared
  JSON `401` guard behavior, and now return real `404`/`500` envelopes for
  missing-resource and internal-failure paths.
- 2026-05-15: Prepared T-048 for admin read route response-helper cleanup. It
  must preserve the T-039/T-043 `requireApiAdmin()` guard invariant, invalid-ID
  `400` short-circuiting, and DB-before-model ordering while migrating admin
  read success/error envelopes to shared helpers.
- 2026-05-15: Completed T-048 without changing the shared admin guard
  invariant: admin article/artwork/blog/collection/comment/user read list/detail
  routes now use shared response helpers for success, list, empty-list,
  not-found, and internal-failure envelopes while preserving invalid-ID and
  auth short-circuit behavior.
- 2026-05-15: Prepared T-049 for admin delete route response-helper cleanup. It
  must preserve the T-040/T-043 `requireApiAdmin()` guard invariant, invalid-ID
  `400` short-circuiting, destructive DB-before-model ordering, cascade
  behavior, and transaction abort/commit/end semantics.
- 2026-05-15: Completed T-049 without changing the shared admin guard
  invariant: admin article/artwork/blog/collection/comment/user delete routes
  now use shared response helpers for success, not-found, conflict, and
  internal-failure envelopes while preserving invalid-ID, auth short-circuit,
  cascade, DB-ordering, and transaction behavior.
- 2026-05-15: Completed T-050 without changing the shared admin guard
  invariant: admin article/artwork/blog/collection create/update routes now use
  shared response helpers for success, not-found, conflict, and internal
  failure envelopes while preserving auth-before-body-read ordering, structured
  validation `400`s, route-local DB ownership, and allowlisted persistence.
- 2026-05-15: Prepared T-056 for the user `password` credentials/OAuth field
  contract slice. It should keep credentials registration/login password
  requirements, treat OAuth users without stored password hashes as invalid
  credentials login targets, and avoid changing account-linking or password
  setup workflows.
- 2026-05-15: Completed T-056 by treating OAuth-style users without stored
  password hashes as invalid credentials login targets before bcrypt
  verification while preserving credentials registration password hashing,
  hashed-user role propagation, and account-linking/password-setup scope
  boundaries.
- 2026-05-16: Prepared T-065 for the environment inventory slice. It should
  document active auth/OAuth variables and legacy/deprecated candidates such as
  `JWT_SECRET` and `AUTH_SECRET` from source-search evidence without changing
  auth runtime behavior or provider settings.
- 2026-05-16: Completed T-065 by documenting `NEXTAUTH_SECRET`, OAuth provider
  variables, and the current non-required status of `JWT_SECRET` and
  `AUTH_SECRET` in the environment/auth runbooks without changing auth runtime
  behavior or provider settings.
- 2026-05-16: Prepared T-066 for the Cloudinary signing parameter slice. It
  should preserve the T-005/T-043 shared admin guard behavior while tightening
  allowed upload params.
- 2026-05-16: Completed T-066 for the Cloudinary signing parameter slice. The
  route still uses `requireApiAdmin()` for JSON `401`/`403` responses and now
  rejects unknown or malformed signing params before calling Cloudinary.
- 2026-05-17: Prepared T-081 for the authenticated account navigation loader
  slice. It should keep `GET /api/v2/user/navigation` on `requireApiUser()`,
  share only the post-auth account navigation read with `AccountSubnavLoader`,
  and leave favourites/watchlist loaders, user comments/settings loaders,
  middleware, and global auth/session policy separate.
- 2026-05-17: Completed T-081; `GET /api/v2/user/navigation` still uses
  `requireApiUser()` as the route guard, and `AccountSubnavLoader` reads the
  authenticated user ID with the existing session helper before calling the
  shared post-auth account navigation service.
- 2026-05-17: Completed T-083; the user favourite/watchlist read routes still
  use `requireApiUser()` before service work, and the account saved-artwork
  loaders read the authenticated user ID with the existing session helper
  before calling shared post-auth saved-artwork services.
- 2026-05-17: Completed T-084; the user profile/comment read routes still use
  `requireApiUser()` before service work, and the account settings/comments
  loaders read the authenticated user ID with the existing session helper
  before calling shared post-auth profile/comment services.
- 2026-05-17: Prepared T-088 to remove direct debug logging from
  `CustomMongoDBAdapter.createUser()` while preserving OAuth adapter-created
  user defaults and leaving auth provider/callback behavior unchanged.
- 2026-05-17: Completed T-088 for the auth adapter slice: direct profile/user
  logging is removed from `CustomMongoDBAdapter.createUser()`, behavior tests
  cover the adapter-created user defaults/delegation/null result/error path,
  and OAuth provider/callback behavior remains unchanged.
- 2026-05-17: Prepared T-094 to remove the remaining active direct
  `console.log()` output from `getUserFromSession` development test-header
  paths while preserving `X-Test-User-Id`, `X-Test-Admin-Id`, normal NextAuth
  session lookup, and delegated helper behavior.
- 2026-05-17: Completed T-094 by removing the active direct
  `getUserFromSession` test-header `console.log()` calls and adding focused
  session helper coverage for persisted test-user lookup, fallback behavior,
  test-admin override, normal NextAuth fallback, delegated helper behavior, and
  source hygiene.
- 2026-05-17: Prepared T-095 to remove stale commented `console.log()` snippets
  from auth callback and credentials auth source without changing auth runtime
  behavior.
- 2026-05-17: Completed T-095 by removing stale commented `console.log()`
  snippets from auth callback and credentials auth source without changing auth
  runtime behavior. Full-source source-hygiene coverage now keeps `src` free of
  direct or commented `console.log()` calls.
- 2026-05-18: Reconciled A-020 account privacy findings into F-074. Account
  privacy actions should wait for owner/legal-approved requirements and remain
  separate from admin bootstrap/recovery.
- 2026-05-18: Prepared T-119 as the protected user API structured logging
  migration slice for favourite, watchlist, and comment routes. It should keep
  `requireApiUser()` guard ordering, ownership checks, validation statuses, and
  transaction behavior unchanged while replacing direct route-level
  `console.error()` internal-failure logging.
- 2026-05-18: Completed T-119 for protected user favourite, watchlist, and
  comment API routes. The routes still use `requireApiUser()` before protected
  service/body/DB work and preserve validation, not-found, forbidden,
  ownership, transaction, and success behavior while internal failures now use
  request-context structured logging and public request IDs.
- 2026-05-18: Prepared T-120 as the admin read API structured logging migration
  slice for read list/detail routes. It should preserve `requireApiAdmin()`
  guard ordering, invalid-ID `400`s, empty-list/missing-resource `404`s,
  pagination, success DTOs, and transform behavior while replacing direct
  route-level `console.error()` internal-failure logging.
- 2026-05-18: Completed T-120 for admin read list/detail API routes. The
  routes still use `requireApiAdmin()` before protected read work and preserve
  invalid-ID `400`s, empty-list/missing-resource `404`s, pagination, success
  DTOs, and transform behavior while internal failures now use request-context
  structured logging and public request IDs.
- 2026-05-18: Prepared T-121 as the admin create/update/delete API structured
  logging migration slice. It should preserve `requireApiAdmin()` guard
  ordering, validation statuses, invalid-ID handling, conflict behavior,
  cascade/transaction behavior, and mutation success contracts while replacing
  direct route-level `console.error()` internal-failure logging.
- 2026-05-18: Completed T-121 for admin create/update/delete API routes. The
  routes still use `requireApiAdmin()` before protected mutation work and
  preserve validation statuses, invalid-ID handling, conflict behavior,
  cascade/transaction behavior, and mutation success contracts while internal
  failures now use request-context structured logging and public request IDs.
- 2026-05-18: Prepared T-122 to lock the completed route-level API logging
  invariant with recursive source-hygiene coverage under `src/app/api/v2`.
  This is a guardrail task only and should not change admin guard behavior.
- 2026-05-18: Completed T-122 as a guardrail-only task. Recursive API-v2 route
  handler source-hygiene coverage now rejects direct route-level
  `console.error()` and `console.warn()` calls without changing admin guard
  behavior or protected route contracts.
- 2026-05-19: Completed T-138 by documenting admin bootstrap, promotion,
  lockout recovery, rollback, verification, MongoDB role-change evidence, and
  credential/OAuth smoke handling in the auth runbook. Runtime current-admin
  and last-admin deletion protections remain separate implementation work.
- 2026-05-19: T-140 reconciled A-011's runtime admin deletion finding as
  F-091 and prepared T-141. Admin bootstrap/recovery documentation remains
  complete under T-138; runtime current-admin and last-admin deletion guards are
  the next auth/admin implementation gap.
- 2026-05-19: Completed T-141 by adding current-admin self-delete and
  last-admin deletion protections to the admin user delete route with focused
  guard-order and cascade-preservation coverage.
- 2026-05-22: Prepared T-206 to restore the existing tested account subnav
  mount in `src/app/account/layout.tsx` with layout-level coverage. It should
  preserve the T-081 loader/service contract and avoid broader account
  navigation, auth/session, cart/orders, and saved-item redirect changes.

## Next Agent Action

If account UX hardening is prioritized, assign
[T-206 Restore account subnav mount](../tasks/T-206-restore-account-subnav-mount.md)
as the next bounded slice.

Do not reassign T-081, T-082, T-083, T-084, or T-088 unless a regression is
opened. Do not reassign T-094, T-095, T-119, T-120, or T-121 unless a
regression is opened. Do not reassign T-122 unless the API-v2 route
source-hygiene guard regresses.

Keep broader production logging policy, root-layout session redesign,
favourite/watchlist server actions, account navigation, comment mutations,
profile editing, middleware, OAuth provider configuration, and future
protected-route migrations separate. Preserve the T-043 shared guard invariant
and add focused route coverage before changing protected user/admin route
behavior.

T-141 is complete; do not reassign it unless current-admin or last-admin
deletion protection regresses. Keep account privacy self-service, owner/legal
retention decisions, and broader destructive admin cascade previews separate.

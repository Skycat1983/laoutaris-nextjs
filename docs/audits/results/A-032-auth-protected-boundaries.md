# A-032 Auth And Protected Boundary Snapshot

Status: Completed

Audit goal:
[A-032 Auth and protected boundary snapshot](../goals.md#a-032-auth-and-protected-boundary-snapshot).

Workstreams:
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md).

## Assignment Summary

Inspect auth/session, middleware, protected API/admin route guards, role
boundaries, and client/server import-boundary checks to identify focused
security or architecture gaps.

## Summary

The current protected API boundary is substantially stronger than the A-004
baseline: all 43 protected `/api/v2/user` and `/api/v2/admin` route files are
covered by a static guard inventory test, user routes use `requireApiUser()`,
admin routes use `requireApiAdmin()`, and the admin API guard verifies both the
session role and the persisted MongoDB role before allowing admin work.

The top gaps are now narrower and mostly architectural/test-boundary gaps:
admin frontend pages rely on middleware's JWT role check and do not repeat the
persisted-role verification used by admin APIs, OAuth role/session behavior is
covered indirectly rather than by a provider-specific role test, and one auth
import-boundary test is stale after the public shell was moved away from global
DB/session work.

No new auth runbook gap was confirmed. The runbook already documents stale JWT
behavior after role changes and admin bootstrap/recovery; if the admin frontend
continues to rely on JWT-only middleware gating, that policy should be recorded
as an explicit accepted boundary.

## Scope Inspected

- Documentation:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md`
  - `docs/audits/results/A-004-auth-admin-permissions.md`
  - `docs/audits/results/A-029-admin-auth-ops-hotspots.md`
  - `docs/workstreams/auth-admin-and-permissions.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
  - `docs/runbooks/auth.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/architecture/rendering-and-data-fetching.md`
  - `docs/risks/production-readiness.md`
- Auth/session and middleware:
  - `src/lib/config/authOptions.ts`
  - `src/lib/config/authCallbacks.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/lib/actions/authenticateUser.ts`
  - `src/lib/db/adapter.ts`
  - `src/lib/session/`
  - `src/lib/api/requireApiUser.ts`
  - `src/lib/api/requireApiAdmin.ts`
  - `src/lib/api/apiAuthError.ts`
  - `src/middleware.ts`
  - `src/lib/constants/routeConstants.ts`
  - `src/lib/utils/routeUtils.ts`
- Protected route surfaces:
  - 8 user route files under `src/app/api/v2/user/`
  - 35 admin route files under `src/app/api/v2/admin/`
  - `src/app/account/`
  - `src/app/admin/`
  - account loaders that call `getUserIdFromSession()`
  - admin dashboard pages/layouts and admin dashboard component imports
- Tests:
  - `__tests__/unit/middleware.test.ts`
  - `__tests__/unit/utils/routeUtils.test.ts`
  - `__tests__/unit/api/protectedApiGuardInventory.test.ts`
  - `__tests__/unit/api/apiRouteGuards.test.ts`
  - `__tests__/unit/auth/credentialsRoleSession.test.ts`
  - `__tests__/unit/auth/authOptionsImportBoundary.test.tsx`
  - `__tests__/unit/security/clientServerImportBoundary.test.ts`
  - `__tests__/unit/security/publicShellAuthBoundaries.test.ts`
  - `__tests__/unit/db/dbHelpers.test.ts`

## Commands Run

- `sed -n '1,220p' AGENTS.md`: inspected agent operating guide.
- `sed -n '1,260p' docs/README.md`: inspected canonical docs index.
- `sed -n '1,260p' docs/audits/goals.md`: inspected audit index and nearby goals.
- `sed -n '700,785p' docs/audits/goals.md`: inspected A-032 goal, scope, and completion expectations.
- `sed -n '1,240p' docs/audits/README.md`: inspected audit workflow and shared-file ownership.
- `sed -n '1,260p' docs/audits/results/A-032-auth-protected-boundaries.md`: inspected assigned result stub.
- `sed -n '1,280p' docs/workstreams/auth-admin-and-permissions.md`: inspected auth workstream.
- `sed -n '1,260p' docs/workstreams/architecture-refactor-and-code-health.md`: inspected architecture workstream.
- `git status --short`: found unrelated dirty worktree changes; this audit edit stays scoped to this result file.
- `sed -n '1,320p' docs/runbooks/auth.md`: inspected auth runbook.
- `sed -n '1,320p' docs/architecture/routes-and-api.md`: inspected route/API map.
- `sed -n '1,320p' docs/risks/production-readiness.md`: inspected current risks.
- `rg -n "authOptions|NextAuth|CredentialsProvider|requireApi(User|Admin)|isAdmin|getServerSession|getToken|protected|adminRoute|middleware|matcher|use client|server-only" src __tests__ docs/architecture docs/runbooks docs/workstreams docs/audits/results/A-032-auth-protected-boundaries.md`: mapped auth/boundary references; output included expected broad matches.
- `rg --files src/app/api/v2 src/app/account src/app/admin src/lib/session src/lib/config src/lib/auth src/lib/actions __tests__ | sort`: mapped route/test files; returned an expected `src/lib/auth` missing-path warning because that directory does not exist.
- `find src/app/api/v2/user src/app/api/v2/admin -name route.ts -print | sort`: listed 43 protected API route files: 8 user and 35 admin.
- `rg -n "requireApiUser|requireApiAdmin|isAdmin|getServerSession|getUserIdFromSession|getUserFromSession|authOptions" src/app/api/v2/user src/app/api/v2/admin src/lib src/app/account src/app/admin __tests__`: confirmed protected API routes use shared guards and identified remaining session helper use outside route boundaries.
- `nl -ba src/lib/config/authOptions.ts | sed -n '1,260p'`: inspected NextAuth providers/session config.
- `nl -ba src/lib/config/authCallbacks.ts | sed -n '1,220p'`: inspected role and ID propagation callbacks.
- `nl -ba src/lib/actions/authenticateUser.ts | sed -n '1,220p'`: inspected credentials authorization and role return.
- `nl -ba 'src/app/api/auth/[...nextauth]/route.ts' | sed -n '1,100p'`: inspected NextAuth route handler. An initial unquoted bracket path failed under zsh glob expansion and was rerun quoted.
- `nl -ba src/middleware.ts | sed -n '1,240p'`: inspected middleware auth/role behavior and matcher.
- `nl -ba src/lib/utils/routeUtils.ts | sed -n '1,220p'`: inspected protected/admin route prefix utilities.
- `nl -ba src/lib/constants/routeConstants.ts | sed -n '1,220p'`: inspected protected route constants.
- `nl -ba src/lib/api/requireApiUser.ts | sed -n '1,180p'`: inspected shared user API guard.
- `nl -ba src/lib/api/requireApiAdmin.ts | sed -n '1,200p'`: inspected shared admin API guard.
- `nl -ba src/lib/api/apiAuthError.ts | sed -n '1,120p'`: inspected auth error helper.
- `nl -ba src/lib/session/getUserIdFromSession.ts | sed -n '1,160p'`: inspected active stable user ID helper.
- `nl -ba src/lib/session/getUserFromSession.ts | sed -n '1,220p'`: inspected legacy/development session helper.
- `nl -ba src/lib/session/isAdmin.ts | sed -n '1,80p'`: inspected legacy admin helper.
- `nl -ba src/app/account/layout.tsx | sed -n '1,220p'`: inspected account layout protection assumptions.
- `nl -ba src/app/account/page.tsx | sed -n '1,160p'`: inspected account redirect.
- `nl -ba src/app/account/settings/page.tsx | sed -n '1,200p'`: inspected account settings page.
- `nl -ba src/app/admin/page.tsx | sed -n '1,160p'`: inspected admin redirect.
- `nl -ba src/app/admin/dashboard/layout.tsx | sed -n '1,220p'`: inspected admin dashboard layout.
- `nl -ba 'src/app/admin/dashboard/@main/[segment]/page.tsx' | sed -n '1,220p'`: inspected admin segment page. An initial unquoted bracket path failed under zsh glob expansion and was rerun quoted.
- `nl -ba src/app/admin/dashboard/@feed/page.tsx | sed -n '1,220p'`: inspected admin feed page.
- `rg -n "getServerSession|authOptions|requireApiAdmin|isAdmin|redirect\\(" src/app/admin src/components/layouts/admin src/components/features/adminDashboard -S`: confirmed admin frontend pages/components do not perform route-local server admin checks.
- `rg -n "getServerSession|authOptions|requireApiUser|redirect\\(" src/app/account src/components/loaders/componentLoaders/AccountSubnavLoader.tsx src/components/loaders/componentLoaders/UserSettingsLoader.tsx src/components/loaders/viewLoaders/UserCommentsLoader.tsx src/components/loaders/viewLoaders/FavouritedArtworkLoader.tsx src/components/loaders/viewLoaders/WatclistedArtworkLoader.tsx -S`: mapped account frontend redirects and loader session checks.
- `nl -ba __tests__/unit/api/protectedApiGuardInventory.test.ts | sed -n '1,420p'`: inspected static protected API guard invariant.
- `nl -ba __tests__/unit/api/apiRouteGuards.test.ts | sed -n '1,260p'`: inspected guard behavior coverage.
- `nl -ba __tests__/unit/middleware.test.ts | sed -n '1,300p'`: inspected middleware coverage.
- `nl -ba __tests__/unit/utils/routeUtils.test.ts | sed -n '1,260p'`: inspected route utility coverage.
- `nl -ba __tests__/unit/auth/credentialsRoleSession.test.ts | sed -n '1,280p'`: inspected credentials role/session and stable user ID coverage.
- `nl -ba __tests__/unit/auth/authOptionsImportBoundary.test.tsx | sed -n '1,260p'`: inspected auth import-boundary coverage.
- `nl -ba __tests__/unit/security/clientServerImportBoundary.test.ts | sed -n '1,320p'`: inspected recursive client/server import graph guard.
- `nl -ba __tests__/unit/security/publicShellAuthBoundaries.test.ts | sed -n '1,160p'`: inspected public shell boundary guard.
- `nl -ba src/app/layout.tsx | sed -n '1,220p'`: confirmed root layout currently has no direct `authOptions`, `getServerSession`, or `dbConnect` import.
- `git diff -- __tests__/unit/auth/authOptionsImportBoundary.test.tsx src/app/layout.tsx | sed -n '1,260p'`: confirmed current dirty diff only adjusts font imports/mocks, while the stale auth test assertion is pre-existing current source.
- `rg -n "getServerSession|authOptions|dbConnect" src/app/layout.tsx src/components/modules/navigation/header/Header.tsx src/components/loaders/componentLoaders/HeaderMainNavLoader.tsx src/components/loaders/componentLoaders/MainNavLoader.tsx src/contexts -S`: no matches.
- `nl -ba src/lib/db/adapter.ts | sed -n '1,260p'`: inspected OAuth adapter defaults.
- `rg -n "OAuth|oauth|GitHub|Google|CustomMongoDBAdapter|createUser\\(|accountPrivacyAcknowledgement|role: \\\"user\\\"" __tests__ src/lib/db/adapter.ts src/lib/config/authOptions.ts docs/runbooks/auth.md docs/workstreams/auth-admin-and-permissions.md`: mapped OAuth role/default coverage.
- `nl -ba __tests__/unit/db/dbHelpers.test.ts | sed -n '1,130p'`: inspected OAuth adapter default tests.
- `rg -n "isAdmin|isUserAdmin|createUserFromSession|getUserFromSession" src __tests__ docs/workstreams/auth-admin-and-permissions.md docs/risks/production-readiness.md`: confirmed legacy helpers are not active route-boundary callers.
- `npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/utils/routeUtils.test.ts __tests__/unit/api/protectedApiGuardInventory.test.ts __tests__/unit/api/apiRouteGuards.test.ts __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/security/publicShellAuthBoundaries.test.ts`: failed with 1 failing suite, 7 passing suites. Passed 63 tests; failed 1 stale assertion in `authOptionsImportBoundary.test.tsx` expecting root layout to call `dbConnect()` once. The current root layout no longer performs global DB/session work, and `publicShellAuthBoundaries.test.ts` passed.
- `git diff --no-index --check /dev/null docs/audits/results/A-032-auth-protected-boundaries.md`: exited 1 because the file differs from `/dev/null`; no whitespace errors were printed.
- `git status --short docs/audits/results/A-032-auth-protected-boundaries.md`: confirmed the assigned result file is untracked in the current worktree.

## Boundary Matrix

| Boundary | Current behavior | Gap or confidence note | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- |
| NextAuth/session | JWT sessions; credentials authorize dynamically imports `authenticateUser`; credentials users return persisted `role`; JWT callback copies `user.id`/`user.role`; session callback exposes `session.user.id`/`session.user.role`. OAuth adapter-created users default to `role: "user"`. | Credentials role propagation is covered. OAuth default creation is covered at adapter level, but there is no provider-specific role/session test proving OAuth-created or OAuth-returned adapter users preserve expected session role through NextAuth callbacks. | `src/lib/config/authOptions.ts:33-72`; `src/lib/actions/authenticateUser.ts:72-104`; `src/lib/config/authCallbacks.ts:46-75`; `src/lib/db/adapter.ts:11-24`; `__tests__/unit/auth/credentialsRoleSession.test.ts:66-171`; `__tests__/unit/db/dbHelpers.test.ts:56-86`. | Add a focused OAuth/default-user role/session test or document why adapter-default plus generic callback coverage is sufficient. |
| Middleware matcher | Middleware is narrowed to `/account/:path*`, `/admin/:path*`, `/api/v2/admin/:path*`, and `/api/v2/user/:path*`; it bypasses `/api/auth`, skips token parsing for public routes, returns JSON `401`/`403` for protected API failures, redirects unauthenticated frontend callers to `/sign-in`, and redirects non-admin admin frontend callers to `/`. | Matcher behavior is well covered. Middleware admin decisions use JWT role only, so a demoted admin's still-valid JWT can pass the admin frontend middleware until sign-out or token invalidation. Admin APIs add a persisted-role guard. | `src/middleware.ts:10-55`; `src/lib/utils/routeUtils.ts:14-35`; `__tests__/unit/middleware.test.ts:68-204`; `docs/runbooks/auth.md:37-41`. | Decide whether admin frontend rendering also needs a persisted-role server guard, or explicitly accept middleware-only frontend gating with API-level persisted-role enforcement. |
| Admin API guards | All 35 admin route files import/call `requireApiAdmin()`. The guard returns JSON `401` without DB work for missing session, JSON `403` without DB work for non-admin session role, verifies persisted MongoDB role for session admins, and returns public-safe JSON `500` if admin verification fails. Static inventory enforces guard import/call and guard-before-body/DB/model/transaction ordering. | High confidence for route-boundary drift. Remaining risk is frontend admin shell visibility, not API authorization. | `src/lib/api/requireApiAdmin.ts:19-57`; `__tests__/unit/api/apiRouteGuards.test.ts:96-186`; `__tests__/unit/api/protectedApiGuardInventory.test.ts:40-53` and `272-358`; `find src/app/api/v2/user src/app/api/v2/admin -name route.ts -print | sort`. | Keep future admin API routes covered by the static inventory before adding new route families. |
| User API guards | All 8 user route files import/call `requireApiUser()`. The guard returns JSON `401` when there is no stable session user ID and returns that ID for authenticated callers without DB/model work. Static inventory enforces guard import/call and guard-before-body/DB/model/transaction ordering. | High confidence for user API route-boundary drift. Ownership still depends on downstream services using the guard-returned user ID correctly, which was outside this focused guard snapshot except for scoped reads. | `src/lib/api/requireApiUser.ts:17-31`; `__tests__/unit/api/apiRouteGuards.test.ts:59-94`; `__tests__/unit/api/protectedApiGuardInventory.test.ts:40-53` and `272-358`; `src/app/api/v2/user/*/route.ts` search results. | Preserve the static inventory and keep route-specific ownership tests with each user feature change. |
| Frontend protected routes | `/account` and `/admin` are covered by middleware matchers. Account loaders call `getUserIdFromSession()` and throw on missing user ID before own-account data reads. Admin dashboard pages/layouts do not perform their own server-side admin check; admin data/mutations go through guarded admin APIs. | Account routes have route-loader backup checks for account data. Admin frontend routes rely on middleware JWT role only, so persisted-role demotion is not enforced at the admin shell/render boundary. | `src/middleware.ts:48-55`; `src/app/account/layout.tsx:6-20`; `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:13-30`; `src/components/loaders/componentLoaders/UserSettingsLoader.tsx:6-25`; `src/app/admin/dashboard/layout.tsx:3-26`; `src/app/admin/dashboard/@main/[segment]/page.tsx:8-30`; `rg -n "getServerSession|authOptions|requireApiAdmin|isAdmin|redirect\\(" src/app/admin src/components/layouts/admin src/components/features/adminDashboard -S`. | Add an admin layout/page server guard that reuses persisted admin verification, or document middleware-only admin shell policy as accepted because guarded APIs protect data and mutation. |
| Client/server imports | Recursive static test discovers all `"use client"` entries, walks runtime imports/re-exports, stops at explicit server-action boundaries, and fails if client runtime reaches server-only modules, DB/model/services/types, auth/session config, protected API guards, known mixed barrels, or server loaders. Current run passed. | Import graph guard is strong. The stale `authOptionsImportBoundary` root-layout assertion creates noisy verification failure even though the newer public shell boundary passes. | `__tests__/unit/security/clientServerImportBoundary.test.ts:136-310`; `__tests__/unit/security/publicShellAuthBoundaries.test.ts:7-14`; `src/app/layout.tsx:1-62`; failing targeted test command above. | Repair `authOptionsImportBoundary.test.tsx` so it asserts root layout does not require bcrypt and does not require global DB/session work. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| Medium | Admin frontend access is gated only by middleware JWT role, while admin APIs verify the persisted MongoDB role. A demoted admin with an existing JWT can pass the admin frontend middleware until sign-out or session invalidation, although guarded admin APIs should deny data/mutation work once the persisted role is no longer admin. | Middleware checks `token.role` and redirects non-admin admin frontend callers, but it does not query persisted role (`src/middleware.ts:21-42`). `requireApiAdmin()` checks both session role and `UserModel.findById(session.user.id)` persisted role (`src/lib/api/requireApiAdmin.ts:19-57`). Admin pages/layouts contain no route-local server admin guard (`src/app/admin/dashboard/layout.tsx:3-26`; `src/app/admin/dashboard/@main/[segment]/page.tsx:8-30`). The auth runbook documents that role changes do not update already-issued JWTs (`docs/runbooks/auth.md:37-41`). | Agent-actionable: add an admin layout/page server guard that verifies persisted role before rendering the admin shell, or document an accepted policy that frontend admin visibility is JWT-bound while APIs enforce persisted role. |
| Medium | The auth boundary verification suite currently fails because `authOptionsImportBoundary.test.tsx` still expects root layout to perform global DB/session work. This conflicts with the current public-shell boundary and can hide real auth import-boundary regressions behind a stale test failure. | Targeted command failed: `npm test -- --runTestsByPath ... __tests__/unit/auth/authOptionsImportBoundary.test.tsx ...` with `Expected number of calls: 1; Received number of calls: 0` for `mockDbConnect` at `__tests__/unit/auth/authOptionsImportBoundary.test.tsx:218`. `src/app/layout.tsx` has no `authOptions`, `getServerSession`, or `dbConnect` imports, and `__tests__/unit/security/publicShellAuthBoundaries.test.ts` passed. | Agent-actionable: update the test to assert the current invariant: root layout renders without loading bcrypt and without requiring global DB/session work. |
| Low | OAuth role/session behavior is only indirectly covered. Adapter-created OAuth users default to `role: "user"` and callbacks generically copy `user.role`, but there is no provider-specific test that an OAuth-created or OAuth-returned adapter user produces the expected JWT/session role. | OAuth providers are configured in `src/lib/config/authOptions.ts:63-70`; adapter-created users default to `role: "user"` in `src/lib/db/adapter.ts:11-24` and are tested in `__tests__/unit/db/dbHelpers.test.ts:56-86`; callbacks copy role in `src/lib/config/authCallbacks.ts:46-75`; `credentialsRoleSession.test.ts` covers credentials admin/user role propagation but no OAuth provider/session path. The auth workstream backlog still calls for OAuth user tests. | Agent-actionable: add a focused OAuth adapter/callback role test, or explicitly mark current adapter/default plus generic callback coverage as sufficient. |
| Low | Legacy session/admin helpers remain in source, though current route-boundary callers no longer use them. The static protected API inventory bans direct `getServerSession()`, `getUserIdFromSession()`, and `isAdmin()` at protected API boundaries, but stale helpers can still confuse future work. | `src/lib/session/isAdmin.ts` still performs a standalone admin check; `src/lib/session/getUserFromSession.ts` keeps development test-header paths and helper exports; `src/lib/session/createUserFromSession.ts` remains in source. `rg -n "isAdmin|isUserAdmin|createUserFromSession|getUserFromSession" src __tests__ ...` found no active route-boundary caller outside tests and middleware's unrelated `isAdminRoute` utility. | Agent-actionable but low priority: route through source-pruning/code-health reconciliation before deleting, because current protected API inventory already prevents route-boundary drift. |

## Actionability Assessment

No A-032 finding is fully owner/platform-blocked. The only policy-sensitive
item is the admin frontend boundary: an implementation agent can add a persisted
admin-role guard, but the orchestrator/owner may instead explicitly accept the
current JWT-only frontend shell policy because admin APIs already enforce the
persisted role.

| Gap | Actionability |
| --- | --- |
| Admin frontend persisted-role gap | Agent-actionable implementation, or owner/orchestrator acceptance if the JWT-only frontend shell boundary is intentional. |
| Stale auth import-boundary test | Agent-actionable. |
| OAuth role/session coverage gap | Agent-actionable. |
| Legacy session/admin helper pruning | Agent-actionable after reconciliation/source-pruning ownership is assigned. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| F-A032-001 | Medium | Candidate | Admin frontend pages rely on middleware JWT role only and do not repeat the persisted admin-role verification used by admin APIs. | Auth, admin, and permissions; Architecture refactor and code health. |
| F-A032-002 | Medium | Candidate | `authOptionsImportBoundary.test.tsx` is stale and fails because it expects root layout global DB/session work that the current public-shell boundary intentionally forbids. | Architecture refactor and code health; Testing and quality. |
| F-A032-003 | Low | Candidate | OAuth role/session behavior lacks a provider-specific role propagation test. | Auth, admin, and permissions; Testing and quality. |
| F-A032-004 | Low | Candidate | Legacy session/admin helper files remain unused by active route boundaries and should be reconciled before pruning. | Architecture refactor and code health; Auth, admin, and permissions. |

## Risks Updated

- Candidate only:
  - Consider updating R-002 if the orchestrator accepts the admin frontend
    persisted-role guard gap as a production auth/admin risk.
  - Consider updating R-005/R-013 if the stale auth import-boundary test failure
    should be tracked as a verification reliability risk.

## Workstream Updates

- Candidate only:
  - Auth/admin backlog: decide whether admin frontend rendering needs
    persisted-role verification in addition to middleware JWT gating.
  - Auth/admin backlog: add or explicitly decline focused OAuth role/session
    coverage.
  - Architecture/testing backlog: repair `authOptionsImportBoundary.test.tsx`
    to align with the current root-layout public-shell boundary.
  - Architecture/code-health backlog: reconcile unused legacy session/admin
    helpers before pruning.

## Next Action

Repair the stale `authOptionsImportBoundary.test.tsx` root-layout assertion
first so the auth/import-boundary verification gate is trustworthy again, then
decide whether admin frontend pages should add persisted-role verification or
whether JWT-only frontend gating with guarded APIs is an accepted boundary.

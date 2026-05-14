# A-004 Auth, Admin, And Permission Boundaries Result

Status: Completed

Audit goal: [A-004 Auth, admin, and permission boundaries](../goals.md#a-004-auth-admin-and-permission-boundaries)

Workstream: [Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md)

## Summary

Middleware currently protects `/account`, `/admin`, `/protected`,
`/api/v2/user`, and `/api/v2/admin` through route utility prefixes, and the
existing route utility test suite passes. The highest-risk gaps are in role and
identity ownership: credentials sign-in does not put the database role into the
JWT/session, the primary user ID helper resolves users by `session.user.name`
instead of the stable session ID, API auth responses are inconsistent, and the
Cloudinary signing endpoint relies only on middleware for admin protection.

## Scope Inspected

- Documentation:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md`
  - `docs/audits/results/README.md`
  - `docs/workstreams/auth-admin-and-permissions.md`
  - `docs/runbooks/auth.md`
  - `docs/architecture/system-overview.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/risks/production-readiness.md`
- Route protection:
  - `src/middleware.ts`
  - `src/lib/constants/routeConstants.ts`
  - `src/lib/utils/routeUtils.ts`
  - `__tests__/unit/utils/routeUtils.test.ts`
- NextAuth and session identity:
  - `src/lib/config/authOptions.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/lib/db/adapter.ts`
  - `src/lib/session/`
  - `src/lib/actions/authenticateUser.ts`
  - `src/lib/actions/processLogin.ts`
  - `src/lib/actions/registerUser.ts`
  - `src/components/modules/forms/user/SignInForm.tsx`
  - `src/components/modules/forms/user/SignInFormBackup.tsx`
  - `src/components/modules/forms/user/SignUpForm.tsx`
- Admin and account surfaces:
  - 25 admin API route files under `src/app/api/v2/admin/`
  - 8 user API route files under `src/app/api/v2/user/`
  - `src/app/admin/`
  - `src/app/account/`
  - `src/app/protected/page.tsx`

## Commands Run

- `sed -n '1,260p' docs/workstreams/auth-admin-and-permissions.md`: inspected
  assigned workstream.
- `sed -n '1,260p' docs/runbooks/auth.md`: inspected auth runbook.
- `sed -n '1,260p' docs/audits/results/A-004-auth-admin-permissions.md`:
  inspected existing result stub.
- `sed -n '1,280p' docs/architecture/system-overview.md`: inspected linked
  architecture context.
- `sed -n '1,320p' docs/architecture/routes-and-api.md`: inspected route and
  API map.
- `sed -n '1,300p' docs/risks/production-readiness.md`: inspected current risk
  tracker for auth/admin risk context.
- `git status --short`: confirmed there are unrelated dirty docs already in the
  worktree; this audit edit stays scoped to this result file.
- `rg --files src | rg '(^src/middleware\.ts$|auth|admin|account|user|session|routeUtils|protected|actions)'`:
  mapped auth, admin, account, user, and session files.
- `find src/app/api/v2/admin -name route.ts -print | sort`: listed admin route
  handlers.
- `find src/app/api/v2/user -name route.ts -print | sort`: listed user route
  handlers.
- `find src/app/api/v2/admin -name route.ts -print | wc -l`: counted 25 admin
  route files.
- `find src/app/api/v2/user -name route.ts -print | wc -l`: counted 8 user
  route files.
- `rg --files-without-match "isAdmin|getRoleFromSession|getServerSession|getToken|getUserIdFromSession" src/app/api/v2/admin -g route.ts`:
  found `src/app/api/v2/admin/sign-cloudinary-params/route.ts` as the only
  admin route without any route-local auth/session helper.
- `rg --files-without-match "getUserIdFromSession|getServerSession|getToken|getAuthUser|getUserFromSession" src/app/api/v2/user -g route.ts`:
  returned no user route files, confirming each user API route has some
  route-local session helper.
- `rg -n "processLogin|authenticateUser|authorizeUser|registerUser|SignInFormBackup|SignInForm" src`:
  mapped active and legacy auth form/action references.
- `rg -n "getServerSession|getSession|getToken|authOptions|role|session\.user|userId|owner|createdBy|author|status:\s*(401|403)" src/app/api/v2/admin src/app/api/v2/user src/app/admin src/app/account src/lib/session src/lib/actions src/lib/api/user src/lib/api/admin`:
  inspected auth, role, and ownership checks.
- `npm test -- --runTestsByPath __tests__/unit/utils/routeUtils.test.ts`:
  passed, 1 suite and 17 tests.
- `git diff --check -- docs/audits/results/A-004-auth-admin-permissions.md`:
  passed with no whitespace errors.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Credentials admin sessions do not persist the database role into the JWT/session, so an admin signing in through credentials will be treated as non-admin by middleware and route handlers. | `authorizeUser` returns only `id`, `email`, and `name` (`src/lib/actions/authenticateUser.ts:121-126`). The JWT callback copies only `user.role` (`src/lib/config/authOptions.ts:125-128`), middleware checks `token.role` (`src/middleware.ts:31-42`), and `isAdmin()` returns false before its DB role check when `session.user.role !== "admin"` (`src/lib/session/isAdmin.ts:6-14`). | Return role from credentials auth or load the persisted role in the JWT callback by stable user ID. Add tests for credentials admin, credentials non-admin, OAuth user, admin page middleware, and a representative admin API route. |
| High | User ownership depends on `session.user.name` rather than the stable session user ID, and the helper can create users during protected reads. This weakens account ownership guarantees and can break or misattribute user data when names change or collide. | `getUserIdFromSession()` ignores `session.user.id`, looks up `UserModel.findOne({ username })`, and creates a user from `username`/`email` when no match exists (`src/lib/session/getUserIdFromSession.ts:12-31`). User APIs use that helper for profile, navigation, comments, favourites, and watchlist. `getUserFromSession()` has a parallel implementation and returns `user.id.toString()` after selecting only `role` from a lean result (`src/lib/session/getUserFromSession.ts:64-83`). | Make `session.user.id` the canonical user ID for route-local ownership checks, verify the DB user/role against that ID, and move OAuth user provisioning to an explicit sign-in/account-bootstrap path. Remove or merge duplicate helpers after tests. |
| High | The Cloudinary signing admin endpoint has no route-local admin guard and signs caller-supplied params. It is protected by the `/api/v2/admin` middleware prefix today, but it is the only admin route without a local auth/session check. | `src/app/api/v2/admin/sign-cloudinary-params/route.ts:14-23` parses request JSON and returns a Cloudinary signature without calling `isAdmin()` or validating `paramsToSign`. `rg --files-without-match "isAdmin|getRoleFromSession|getServerSession|getToken|getUserIdFromSession" src/app/api/v2/admin -g route.ts` returned only this file. | Add a shared `requireAdmin` route helper and use it in every admin handler, including signing. Validate allowed signing params, folder/preset, and upload intent. Add route tests for anonymous, non-admin, and admin signing requests. |
| Medium | API auth responses are inconsistent and middleware redirects unauthenticated API requests to the NextAuth sign-in page instead of returning JSON 401. Route-local user APIs often encode `statusCode` in the body or omit HTTP status entirely. | Middleware redirects any protected unauthenticated path before checking whether it is an API route (`src/middleware.ts:23-29`), while only non-admin admin API access gets JSON 403 (`src/middleware.ts:35-40`). User profile returns `NextResponse.json({ success: false, error: "User not found" })` without status when unauthenticated (`src/app/api/v2/user/profile/route.ts:17-23`), and comment creation puts `statusCode: 401` in the body without setting response status (`src/app/api/v2/user/comment/route.ts:100-105`). | Define one auth response contract: API routes should return JSON 401 for unauthenticated and 403 for authenticated-but-forbidden, both in middleware and route-local guards. Use shared helpers and cover representative user/admin routes. |
| Medium | The stale `/protected` route is still in the protected route constants and uses a Pages Router redirect shape that is invalid for App Router pages. | `PROTECTED_FRONTEND_ROUTES.PROTECTED` includes `/protected` (`src/lib/constants/routeConstants.ts:2-6`), but `routes-and-api.md` does not list the route. `src/app/protected/page.tsx:1-17` imports `redirect` from `next/dist/server/api-utils`, then returns a `{ redirect: ... }` object instead of calling App Router `redirect()`. A-014 also found no documented navigation to this route. | Confirm `/protected` is a test route. If yes, delete `src/app/protected/page.tsx` and remove the route constant in the same auth-reviewed change. If not, replace it with a valid App Router redirect and test it. |
| Medium | Legacy custom session/login code and unused test-header auth helpers create competing auth paths that are not covered by tests. | `src/lib/session/session.ts:1-62` implements a separate `jose` JWT cookie using `JWT_SECRET` and stores email/password in the payload for a short-lived session. `SignUpForm` imports `SignInFormBackup` (`src/components/modules/forms/user/SignUpForm.tsx:1-7`), and `SignInFormBackup` imports `processLogin` (`src/components/modules/forms/user/SignInFormBackup.tsx:1-8`), while `processLogin` calls the custom `createSession()` path (`src/lib/actions/processLogin.ts:61-68`). `getAuthUser()` grants development-only `X-Test-Admin-Id` admin identity and logs request headers but is marked unused (`src/lib/session/getAuthUser.ts:31-68`). | Choose the NextAuth-only sign-in/session path, then remove or isolate the custom session chain, backup form, duplicate session helpers, and dev test-header auth code. Add tests before deleting anything that might support local auth workflows. |
| Medium | Admin bootstrap and recovery are not documented or implemented as repeatable operations. | The auth runbook lists "Document admin bootstrap and recovery process" as open work. The OAuth adapter creates new users with `role: "user"` (`src/lib/db/adapter.ts:13-17`), and no admin promotion, seed, or recovery script was found in the inspected auth/admin code. | Document a production-safe admin bootstrap and recovery workflow, including who can promote an admin, how it is audited, and how to recover access if all admin accounts are unavailable. |

## Findings Register Updates

- No shared findings register edits were made because this was an audit-result
  assignment and shared docs are already dirty from other work.
- Candidate rows for orchestrator review:

| Candidate ID | Source Audit | Severity | Finding | Destination |
| --- | --- | --- | --- | --- |
| A004-C1 | A-004 | High | Credentials admin sign-in does not persist DB role into JWT/session, so credentials admins fail admin middleware and `isAdmin()` checks. | Auth workstream, production risk R-002, testing workstream |
| A004-C2 | A-004 | High | User ownership helpers resolve by `session.user.name` and can create users during protected reads instead of using stable `session.user.id`. | Auth workstream, data/API workstream |
| A004-C3 | A-004 | High | Cloudinary signing endpoint lacks route-local admin guard and request validation. | Auth workstream, content/assets workstream, A-009 |
| A004-C4 | A-004 | Medium | Protected API auth responses mix redirects, JSON 403, missing HTTP status, and body-only `statusCode` fields. | Data/API workstream, auth workstream |
| A004-C5 | A-004 | Medium | `/protected` remains as a stale protected route and uses invalid App Router redirect behavior. | Auth workstream, architecture cleanup |
| A004-C6 | A-004 | Medium | Legacy custom session/login helpers and unused dev test-header auth helpers need a NextAuth-only cleanup decision. | Auth workstream, architecture cleanup |
| A004-C7 | A-004 | Medium | Admin bootstrap and recovery workflow is missing. | Auth runbook, auth workstream |

## Risks Updated

- No shared risk file edits were made.
- Candidate risk updates:
  - Update R-002 to replace "not fully audited" with the concrete A-004 gaps:
    credentials role persistence, unstable user identity helper, stale
    `/protected`, Cloudinary signing guard, and legacy session cleanup.
  - Consider adding or updating an auth/testing risk under R-005/R-013 for
    missing middleware, session-helper, and route-handler tests.

## Workstream Updates

- No shared workstream edits were made.
- Candidate backlog updates for
  [Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md):
  - Fix credentials role persistence into JWT/session.
  - Introduce shared `requireUser` and `requireAdmin` route helpers with
    consistent JSON 401/403 behavior.
  - Refactor ownership helpers to use stable `session.user.id`.
  - Add a route-local admin guard and signing-param validation to
    `sign-cloudinary-params`.
  - Confirm and remove or fix `/protected`.
  - Remove or isolate the legacy custom session/login chain after tests.
  - Document admin bootstrap and recovery.
  - Add tests for route utilities, middleware decisions, session helpers, and
    representative user/admin APIs.

## Next Action

Reconcile these candidate findings into the register and auth workstream, then
start with the credentials role/JWT fix and shared route auth helpers before
pruning stale session files or `/protected`.

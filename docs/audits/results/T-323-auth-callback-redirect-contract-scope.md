# T-323 Auth Callback Redirect Contract Scope

Status: Completed
Date: 2026-05-28

Task: [T-323 scope auth callback redirect contract](../../tasks/T-323-scope-auth-callback-redirect-contract.md)

Workstreams:
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Scope the intended NextAuth redirect callback contract before any task changes
`/api/auth/signin`, `/api/auth/signout`, same-origin callback pass-through,
off-origin fallback, or the current `/dashboard` sign-in destination.

This was docs-only. Runtime source, tests, auth callbacks, route builders,
middleware, smoke scripts, sitemap/robots, saved-item revalidation, Shopify
behavior, browser automation, credentialed smoke, shared trackers, and
production checks were not changed.

## Commands Run

- `sed -n '1,220p' AGENTS.md`
- `sed -n '1,220p' docs/README.md`
- `sed -n '1,240p' docs/tasks/T-323-scope-auth-callback-redirect-contract.md`
- `sed -n` reads for the three linked workstream briefs.
- `sed -n '1,260p' docs/audits/results/T-321-release-fixture-auth-callback-route-ownership-scope.md`
- `sed -n '1,220p' src/lib/config/authCallbacks.ts`
- `rg -n "authCallbacks|redirect\\(|/api/auth/signin|/api/auth/signout|/dashboard" __tests__ src docs/tasks docs/audits/results -g '!node_modules'`
- `rg --files __tests__ src | rg 'auth|session|callback|nextauth|sign'`
- `sed -n '1,260p' __tests__/unit/auth/credentialsRoleSession.test.ts`
- `sed -n '1,140p' src/lib/routes/authProtectedRoutes.ts`
- `sed -n '1,140p' src/lib/config/authOptions.ts`
- `git status --short`
- `git diff --check`

## Current Redirect Callback Inventory

| Input to `authCallbacks.redirect()` | Current behavior | Source | Current coverage |
| --- | --- | --- | --- |
| URL whose parsed pathname is `/api/auth/signin` | Returns `${baseUrl}/dashboard`. | `src/lib/config/authCallbacks.ts:26-34` | No focused redirect callback test covers this branch or the `/dashboard` literal. |
| URL whose parsed pathname is `/api/auth/signout` | Returns `${baseUrl}`, equivalent to the site origin/base URL without an extra path. | `src/lib/config/authCallbacks.ts:36-39` | No focused redirect callback test covers this branch. Public smoke checks the sign-out endpoint shell, not the callback function contract. |
| URL that starts with `baseUrl` and is not one of the above paths | Passes the input URL through unchanged. | `src/lib/config/authCallbacks.ts:40-41` | No focused redirect callback test covers same-origin pass-through. |
| URL that does not start with `baseUrl` and is not one of the above paths | Falls back to `baseUrl`. | `src/lib/config/authCallbacks.ts:40-41` | No focused redirect callback test covers off-origin fallback. |

The callback first constructs `new URL(url, baseUrl)` and compares the parsed
pathname. That means relative callback values such as `/api/auth/signin` and
absolute same-origin values with that pathname reach the same sign-in branch.
The final pass-through guard, however, uses the original `url.startsWith(baseUrl)`
string check rather than the parsed URL origin.

## Existing Auth/Session Coverage

Existing tests use `authCallbacks` for JWT and session role propagation only:

- `__tests__/unit/auth/credentialsRoleSession.test.ts:133-164` verifies
  credentials admin/user roles are copied from `user` into JWT and session.
- `__tests__/unit/auth/credentialsRoleSession.test.ts:166-206` verifies an
  OAuth-shaped user with default `role: "user"` is copied through JWT and
  session.

Those tests prove role/session propagation but do not call
`authCallbacks.redirect()`. No current test owns `/api/auth/signin`,
`/api/auth/signout`, `/dashboard`, same-origin callback pass-through, or
off-origin fallback.

## Contract Risk

Changing `/dashboard` is not a route-builder cleanup. It would change the
post-sign-in destination for a NextAuth redirect callback branch.

The current app has explicit protected route constants for `/account`,
`/account/settings`, `/admin`, and `/admin/dashboard/articles` in
`src/lib/routes/authProtectedRoutes.ts`, and `authOptions.pages.signIn` points
at `/sign-in`. There is no matching active protected route constant for
`/dashboard`. Prior route ownership scopes therefore correctly treated
`authCallbacks.ts` as auth semantics, not ordinary account/admin navigation.

Potential destination choices have different product meaning:

- Keep `/dashboard` explicit: preserves current behavior, but documents that
  this is intentional even though it does not align with current account/admin
  route constants.
- Change to an account route such as `/account/settings`: aligns with current
  provider sign-in fallback behavior, but changes sign-in redirect semantics for
  users who currently hit the callback branch.
- Make it role-aware: could send admins toward `/admin/dashboard/articles` and
  non-admin users toward account settings, but the redirect callback currently
  receives only `url` and `baseUrl`; a role-aware implementation would need a
  separate design and focused auth coverage.
- Block on owner/orchestrator decision: safest before runtime changes because
  `/dashboard` may be historical, accidental, or an unimplemented product
  destination.

## Recommendation

Next implementation should be coverage-first unless the owner/orchestrator
first decides the intended post-sign-in destination.

Recommended next task:

1. Add a focused unit test file for `authCallbacks.redirect()`.
2. Assert the current behavior exactly:
   - `/api/auth/signin` returns `${baseUrl}/dashboard`.
   - `/api/auth/signout` returns `baseUrl`.
   - a same-origin non-auth callback URL passes through unchanged.
   - an off-origin URL falls back to `baseUrl`.
3. Do not change runtime behavior in that coverage task.
4. After coverage lands, ask the owner/orchestrator whether `/dashboard` is the
   accepted destination. Only then create a separate runtime task if the target
   should become `/account/settings`, admin/account role-aware routing, or
   another route.

This keeps the current production behavior visible and prevents an incidental
route-builder or auth-constant cleanup from silently changing sign-in/sign-out
flows.

## Owner / Orchestrator Decision Needed

No Shopify, Vercel, Sentry, credential, or dashboard access is needed for the
next slice. The only product decision is whether the current `/dashboard`
post-sign-in destination is intentional.

Recommended owner/orchestrator steps:

1. Decide whether `/api/auth/signin` should continue redirecting to
   `${baseUrl}/dashboard` for now.
2. If yes, assign a coverage-only task that locks the current redirect callback
   behavior without changing runtime source.
3. If no, pick the intended destination before assigning runtime work:
   `/account/settings`, `/admin/dashboard/articles` for admins only plus an
   account route for non-admins, or another explicit route.
4. If role-aware routing is desired, scope it as a separate auth design task
   because the current NextAuth redirect callback only receives `url` and
   `baseUrl`, not the user role.

## Candidate Shared Tracker Updates

For orchestrator reconciliation only; this task did not edit shared trackers.

- Auth/admin workstream: note that T-323 found no focused redirect callback
  coverage and recommends a coverage-only auth callback redirect test before
  changing `/dashboard`.
- Architecture workstream: keep `authCallbacks.ts` outside ordinary route
  builder centralization until callback destination semantics are decided.
- Testing workstream: add focused `authCallbacks.redirect()` coverage to the
  next auth test slice.
- Findings/risk trackers: if `/dashboard` is not an accepted destination,
  record the post-sign-in redirect as an owner/orchestrator decision blocker
  rather than an implementation-ready route-builder cleanup.

# T-308 Auth Protected Route Constants Scope

Status: Completed
Date: 2026-05-27

Task: [T-308 Scope auth protected route constants](../../tasks/T-308-scope-auth-protected-route-constants.md)

Workstreams:
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Scope a safe implementation slice for centralizing auth and protected route
constants. This was a docs-only task. Runtime source, tests, middleware,
NextAuth config, route constants, admin guards, redirects, and shared trackers
were not changed.

## Summary

Auth/protected route ownership is already partially centralized:
`src/lib/constants/routeConstants.ts` owns `/account`, `/admin`,
`/api/v2/admin`, `/api/v2/user`, and `/api/auth`; `routeUtils.ts` consumes those
constants for exact-or-nested protected/admin route checks.

The remaining drift-prone literals are concentrated in middleware and frontend
auth/admin navigation:

- `src/middleware.ts` still owns the `/api/auth` bypass literal, `/sign-in` and
  `/` redirects, and the matcher strings for `/account/:path*`, `/admin/:path*`,
  `/api/v2/admin/:path*`, and `/api/v2/user/:path*`.
- `authOptions.ts` owns the NextAuth custom sign-in page `/sign-in`.
- `authCallbacks.ts` owns NextAuth callback paths `/api/auth/signin` and
  `/api/auth/signout`, plus base-URL redirect behavior.
- `requireAdminFrontendAccess.ts` owns persisted-role guard redirects to
  `/sign-in` and `/`.
- Account/admin entry pages, account dropdown, mobile drawer, provider sign-in
  buttons, admin sidebar, saved-item revalidation actions, smoke checks, sitemap
  private-prefix checks, and tests encode related protected or auth paths.

Recommended next slice: centralize only stable auth/protected roots, auth page
paths, redirect destinations, and middleware matcher derivation in a
client-safe value-only route module or a narrowed auth-route module with no
server-only imports. Update `routeConstants.ts`, `routeUtils.ts`,
`middleware.ts`, `authOptions.ts`, `requireAdminFrontendAccess.ts`, and the
focused tests in one task. Defer NextAuth callback-path changes, account/admin
UI navigation, saved-item revalidation paths, smoke/sitemap private-prefix
fixtures, and protected API action route builders to later tasks.

## Commands Run

- `sed -n '1,220p' docs/README.md`
- `sed -n '1,240p' docs/tasks/T-308-scope-auth-protected-route-constants.md`
- `sed -n '1,260p' docs/audits/results/T-302-route-builder-centralization-scope.md`
- `sed -n '1,260p' docs/workstreams/auth-admin-and-permissions.md`
- `sed -n '1,260p' docs/workstreams/architecture-refactor-and-code-health.md`
- `sed -n '1,220p' docs/workstreams/testing-and-quality.md`
- `sed -n '1,260p' docs/architecture/routes-and-api.md`
- `sed -n '1,240p' docs/runbooks/auth.md`
- `git status --short`
- `sed -n` source reads for the files listed below.
- `rg` search for hard-coded auth/protected string literals across `src`,
  `__tests__`, and `scripts`.
- `rg` search for hard-coded auth/protected redirects, router pushes, and link
  hrefs across `src` and `__tests__`.
- `rg -n 'matcher|PROTECTED_FRONTEND_ROUTES|PROTECTED_API_ROUTES|PUBLIC_ROUTES|isProtectedRoute|isAdminRoute|isApiRoute' src __tests__ --glob '!**/*.json'`

## Files Inspected

- `docs/tasks/T-308-scope-auth-protected-route-constants.md`
- `docs/audits/results/T-302-route-builder-centralization-scope.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/architecture/routes-and-api.md`
- `docs/runbooks/auth.md`
- `src/lib/constants/routeConstants.ts`
- `src/lib/utils/routeUtils.ts`
- `src/lib/routes/publicAppRoutes.ts`
- `src/middleware.ts`
- `src/lib/config/authOptions.ts`
- `src/lib/config/authCallbacks.ts`
- `src/lib/session/requireAdminFrontendAccess.ts`
- `src/app/account/page.tsx`
- `src/app/account/favourites/page.tsx`
- `src/app/account/watchlist/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx`
- `src/components/modules/forms/user/AuthProviderSignInButtons.tsx`
- `src/components/layouts/admin/AdminSidebar.tsx`
- `src/lib/actions/updateUserFavourites.ts`
- `src/lib/actions/updateUserWatchlist.ts`
- `src/app/robots.ts`
- `src/lib/metadata/publicDynamicSitemap.ts`
- `scripts/smoke-public-routes.mjs`
- `__tests__/unit/middleware.test.ts`
- `__tests__/unit/utils/routeUtils.test.ts`
- `__tests__/unit/auth/adminFrontendGuard.test.tsx`
- `__tests__/unit/routes/publicAppRoutes.test.ts`
- `__tests__/unit/forms/AuthProviderSignInButtons.test.tsx`
- `__tests__/unit/navigationRelativeUrls.test.tsx`
- `__tests__/unit/accountUserClientErrorStates.test.tsx`
- `__tests__/unit/actions/savedItemActions.test.ts`
- `__tests__/unit/deployment/publicMetadataDiscovery.test.ts`
- `__tests__/unit/deployment/publicDynamicSitemap.test.ts`
- `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`

## Current Inventory

| Route or behavior | Current owner(s) | Current behavior | Test coverage / contract |
| --- | --- | --- | --- |
| `/account` protected frontend root | `routeConstants.ts`, `routeUtils.ts`, `middleware.ts` matcher | Exact, trailing-slash, and nested account paths are protected. Middleware matcher includes `/account/:path*`. | `routeUtils.test.ts` covers exact/nested/trailing slash and `/accounting` false positive. `middleware.test.ts` covers matcher membership. |
| `/admin` protected frontend root | `routeConstants.ts`, `routeUtils.ts`, `middleware.ts` matcher | Exact, trailing-slash, and nested admin paths are protected and treated as admin routes. Middleware matcher includes `/admin/:path*`. | `routeUtils.test.ts` covers exact/nested/admin-like false positives. `middleware.test.ts` covers admin frontend redirect behavior and matcher membership. |
| `/api/v2/admin` protected API root | `routeConstants.ts`, `routeUtils.ts`, `middleware.ts` matcher | Exact and nested admin API paths are protected and admin-only. Middleware returns JSON `401`/`403` for protected API auth failures. | `routeUtils.test.ts`, `middleware.test.ts`, protected API guard inventory tests, route-family tests, route/fetcher parity tests. |
| `/api/v2/user` protected API root | `routeConstants.ts`, `routeUtils.ts`, `middleware.ts` matcher | Exact and nested user API paths are protected. Middleware returns JSON `401` for unauthenticated protected API callers. | `routeUtils.test.ts`, `middleware.test.ts`, protected API guard inventory tests, route-family tests, route/fetcher parity tests. |
| `/api/auth` NextAuth API root | `routeConstants.ts`, `middleware.ts`, `authCallbacks.ts`, smoke script | Middleware bypasses paths starting with `/api/auth`. Auth callback checks `/api/auth/signin` and `/api/auth/signout`. Smoke script checks `/api/auth/signout`. | `routeUtils.test.ts` asserts `/api/auth/signin` is an API route but not protected. `middleware.test.ts` asserts bypass without token parsing. Smoke discovery tests fixture sign-out route. |
| `/sign-in` auth page | `publicAppRoutes.ts`, `authOptions.ts`, `middleware.ts`, `requireAdminFrontendAccess.ts`, account/mobile nav, sign-in metadata, smoke/tests | NextAuth custom sign-in page. Unauthenticated protected frontend requests redirect here. Account/mobile nav links here. Smoke treats it as public. | `middleware.test.ts`, `adminFrontendGuard.test.tsx`, `publicAppRoutes.test.ts`, account/nav/error-state tests, smoke discovery tests. |
| `/sign-in?mode=signup` signup mode link | Account dropdown, mobile drawer, account error-state tests | UI link toggles sign-up mode on the sign-in page. It is not a protected-route boundary. | Account user client error-state and navigation relative URL tests cover the literal shape. |
| `/` fallback redirect | `middleware.ts`, `requireAdminFrontendAccess.ts`, account nav logout, auth callbacks | Non-admin admin frontend callers redirect home. Persisted-role guard redirects forbidden users home. Logout from an account path pushes home. Auth sign-out callback returns base URL. | `middleware.test.ts`, `adminFrontendGuard.test.tsx`, account nav behavior tests, callback tests where present. |
| `/account/settings` account landing | Account entry pages, auth provider sign-in buttons, account dropdown, account loader fixtures | `/account`, `/account/favourites`, and `/account/watchlist` redirect to account settings in current source. OAuth/provider sign-in defaults to account settings. | Provider sign-in button tests, account loader tests, saved-artwork loader tests. |
| `/admin/dashboard/articles` admin landing | `src/app/admin/page.tsx`, `src/app/admin/dashboard/page.tsx`, `AdminSidebar.tsx`, smoke/tests | `/admin` and `/admin/dashboard` redirect to the articles dashboard segment. Admin sidebar owns dashboard segment links. | Smoke discovery tests assert anonymous admin dashboard redirects to sign-in. Admin/sidebar tests may cover links if present. |
| `/admin`, `/account`, `/api` private sitemap prefixes | `robots.ts`, `publicDynamicSitemap.ts`, smoke script, metadata discovery tests | Private prefixes are excluded/disallowed from sitemap/robots public discovery. | `publicMetadataDiscovery.test.ts`, `publicDynamicSitemap.test.ts`, smoke discovery endpoint tests. |
| Account saved-item revalidation paths | `updateUserFavourites.ts`, `updateUserWatchlist.ts`, action tests | Server actions revalidate `/account/favourites`, `/account/favourites/[id]`, `/account/watchlist`, and `/account/watchlist/[id]`. | `savedItemActions.test.ts` asserts list/detail revalidation paths. |
| Protected API action routes | API fetchers, route handlers, route/fetcher parity tests | `/api/v2/admin/*` and `/api/v2/user/*` action/detail routes are built or identified locally; route handler request-context IDs use `[param]` placeholders. | Route/fetcher parity, admin/user route tests, observability request-ID tests. |

## Risk Boundaries

- Middleware behavior is high blast radius. A route constant change must preserve
  exact-or-nested matching, avoid matching `/accounting`, `/administrator`,
  `/api/v2/administer`, or `/api/v2/userland`, and keep `/api/auth` out of the
  protected route set.
- Middleware matcher strings are part of Next.js routing config. Derive them
  only from static string constants at module initialization; do not build them
  from runtime data or helpers that could pull server-only dependencies.
- Keep `/api/auth` distinct from protected API prefixes. It is an API route for
  `isApiRoute()`, but it is intentionally bypassed by middleware auth checks.
- Do not mix protected API prefix constants with full admin/user action-route
  builders in this slice. Those paths have separate route/fetcher parity and
  request-context ID concerns.
- Do not move smoke, sitemap, or robots private-prefix fixtures first. They are
  external contract checks and should remain explicit until central constants
  have their own tests.
- Do not migrate admin dashboard segment links in the first protected-constant
  slice. They are UI navigation routes, not the core auth boundary.
- Keep the route module client-safe and value-only. Auth routes are consumed by
  middleware and client navigation, so broad barrels or imports from auth,
  session, data, model, metadata, or server-only modules would increase
  import-boundary risk.

## Recommended Implementation Slice

Implement one narrow runtime task:

1. Add or refine a value-only route constants module that exports:
   `home`, `signIn`, `account`, `accountSettings`, `admin`,
   `adminDashboardArticles`, `api`, `nextAuthApi`, `adminApi`, `userApi`, and a
   static protected matcher list derived from the protected roots.
2. Keep `routeConstants.ts` as the compatibility surface for existing imports,
   either by moving these constants there or by re-exporting from the new module.
3. Update `routeUtils.ts` to consume the same protected root list used by the
   matcher derivation. Preserve current exact-or-nested behavior.
4. Update `middleware.ts` to use constants for the `/api/auth` bypass, frontend
   redirects, admin redirects, and matcher strings.
5. Update `authOptions.ts` to use the shared sign-in route for `pages.signIn`.
6. Update `requireAdminFrontendAccess.ts` to use shared `signIn` and `home`
   redirect constants.
7. Update focused tests only for the touched ownership:
   `routeUtils.test.ts`, `middleware.test.ts`, and
   `adminFrontendGuard.test.tsx`.

This slice is small enough for one agent because it changes one auth/protected
boundary and its direct tests. It should not touch account dropdown links,
mobile drawer links, provider callback defaults, admin sidebar links,
saved-item revalidation paths, smoke scripts, robots/sitemap private prefixes,
or API fetcher/action-route builders.

## Deferred Areas

- `authCallbacks.ts`: defer `/api/auth/signin` and `/api/auth/signout`
  constants unless a focused callback behavior test is added in the same task.
  Current redirect behavior includes a surprising `/dashboard` sign-in callback
  target that should not be normalized incidentally.
- Account and mobile navigation: defer `/account`, `/sign-in`, and
  `/sign-in?mode=signup` UI link updates until the public/account route builder
  consumer task owns client navigation links.
- Admin sidebar and dashboard segment links: defer to an admin route-builder or
  admin navigation task, because those are CRUD UI segment routes rather than
  auth boundary prefixes.
- Saved-item revalidation paths: defer to an account route-builder slice so
  cache invalidation and detail path builders are tested together.
- Smoke, robots, and sitemap private prefixes: defer until route constants are
  stable and parity tests prove external release-contract checks still assert
  the intended public/private boundary.
- API action route builders and request-context route IDs: defer to the API
  route-builder ownership task. Do not blend literal external paths, encoded
  client fetcher builders, and bracket-placeholder route IDs here.

## Future Verification Requirements

For the implementation slice, run:

```bash
npm test -- --runTestsByPath __tests__/unit/utils/routeUtils.test.ts __tests__/unit/middleware.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

If `authCallbacks.ts` is included despite the deferred recommendation, also add
or run focused callback redirect coverage.

## Candidate Shared Tracker Updates

For orchestrator reconciliation only; this task did not edit shared trackers.

- `docs/workstreams/architecture-refactor-and-code-health.md`: note that T-308
  scoped the auth/protected route constant slice and that the first runtime task
  should avoid API action builders and smoke/sitemap fixture rewrites.
- `docs/workstreams/auth-admin-and-permissions.md`: add a next action for
  centralizing middleware/auth redirect constants while preserving matcher,
  `/api/auth` bypass, JSON protected API failures, and admin redirect behavior.
- `docs/workstreams/testing-and-quality.md`: note the focused verification set:
  route utils, middleware, admin frontend guard, and client/server import
  boundary tests.
- `docs/tasks/README.md`: add the future implementation task after the
  orchestrator prepares it.

## Handoff Notes

- No runtime behavior was changed.
- The current worktree already had unrelated dirty docs and untracked task
  briefs before this result file was added; this task did not edit those shared
  files.
- Recommended implementation owner should inspect the current public route
  builder work before choosing whether auth page paths live in that module or a
  separate auth/protected route module. The key invariant is value-only,
  client-safe constants with no server-only import chain.

# T-315 Account/Admin Route Builder Ownership Scope

Status: Completed
Date: 2026-05-27

Task: [T-315 scope account/admin route-builder ownership](../../tasks/T-315-scope-account-admin-route-builder-ownership.md)

Workstreams:
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
[Frontend routes and components](../../workstreams/frontend-routes-and-components.md),
[Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Scope the next account/admin route-builder slice after T-311 centralized the
stable auth/protected route boundary. This task was docs-only. Runtime source,
tests, route constants, middleware, NextAuth callbacks, account/admin UI,
saved-item actions, smoke scripts, sitemap, robots, shared trackers, and
commerce behavior were not changed.

## Summary

T-311 completed the stable protected boundary constants in
`src/lib/routes/authProtectedRoutes.ts`. Those constants now own `home`,
`signIn`, `account`, `accountSettings`, `admin`, `adminDashboardArticles`,
`api`, `nextAuthApi`, `adminApi`, `userApi`, protected route roots, admin route
roots, and middleware matchers. Middleware, route utilities, NextAuth
`pages.signIn`, and the admin frontend guard already consume that boundary.

The remaining deferred literals are not one ownership group. They split into
account UI routes, admin dashboard UI segment routes, protected/auth boundary
routes, smoke/sitemap public-contract fixtures, cache revalidation paths, and
NextAuth callback paths. The next implementation should centralize only account
UI route values used by client navigation and OAuth callback defaults. That
slice can reuse existing `authProtectedRoutes` and `publicAppRoutes` values
without changing auth policy, admin dashboard behavior, cache invalidation,
release-contract smoke fixtures, or callback redirect semantics.

## Commands Run

- `sed -n '1,220p' AGENTS.md`
- `sed -n '1,220p' docs/README.md`
- `sed -n '1,260p' docs/tasks/T-315-scope-account-admin-route-builder-ownership.md`
- `sed -n` reads for the four linked workstream briefs.
- `sed -n '1,280p' docs/audits/results/T-308-auth-protected-route-constants-scope.md`
- `sed -n '1,260p' docs/tasks/T-311-centralize-auth-protected-route-constants.md`
- `sed -n '1,260p' docs/audits/results/T-302-route-builder-centralization-scope.md`
- `sed -n '1,260p' docs/audits/results/T-309-api-route-builder-ownership-scope.md`
- `git status --short`
- Targeted `sed -n` reads of current account/admin navigation, callback,
  redirect, revalidation, sitemap, robots, smoke, and focused test files.
- `rg` searches for `/account`, `/admin`, `/sign-in`, `/api/auth`,
  `/api/v2/user`, `/api/v2/admin`, `revalidatePath`, `redirect(`,
  `router.push`, `callbackUrl`, `signIn(`, `href=`, `matcher`, `private`,
  `sitemap`, and `robots` across `src`, `__tests__`, and `scripts`.

## Files Inspected

- `src/lib/routes/authProtectedRoutes.ts`
- `src/lib/constants/routeConstants.ts`
- `src/lib/routes/publicAppRoutes.ts`
- `src/lib/config/authCallbacks.ts`
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
- `src/lib/metadata/publicDynamicSitemap.ts`
- `src/app/robots.ts`
- `scripts/smoke-public-routes.mjs`
- `__tests__/unit/forms/AuthProviderSignInButtons.test.tsx`
- `__tests__/unit/navigationRelativeUrls.test.tsx`
- `__tests__/unit/actions/savedItemActions.test.ts`
- `__tests__/unit/deployment/publicMetadataDiscovery.test.ts`
- `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
- `__tests__/unit/utils/routeUtils.test.ts`
- `__tests__/unit/middleware.test.ts`

## Current Ownership Inventory

| Route or behavior | Current owner(s) | Current behavior | Coverage / contract |
| --- | --- | --- | --- |
| Protected/auth boundary roots | `authProtectedRoutes.ts`, `routeConstants.ts`, `routeUtils.ts`, `middleware.ts` | `/account`, `/admin`, `/api/v2/admin`, and `/api/v2/user` are protected exact-or-nested roots. `/api/auth` is an API route but is bypassed by middleware. | `routeUtils.test.ts` and `middleware.test.ts` assert constants, matcher derivation, bypass behavior, and false-positive exclusions. |
| Account entry redirects | `src/app/account/page.tsx`, `src/app/account/favourites/page.tsx`, `src/app/account/watchlist/page.tsx` | `/account`, `/account/favourites`, and `/account/watchlist` redirect to `/account/settings`. | Account loader and saved-artwork loader tests assert downstream account links; no focused redirect test currently owns these three page redirects. |
| Account dropdown links | `AccountNavDropdown.tsx` | Profile links to `/account/settings`; sign-in links to `/sign-in`; sign-up links to `/sign-in?mode=signup`; logout from an account path pushes `/`. | Account/client error-state and navigation source-hygiene tests cover related behavior; direct link assertions are limited. |
| Mobile drawer account links | `MobileNavDrawerBody.tsx` | Auth-sensitive drawer entries use `/account`, `/sign-in?mode=signup`, `/sign-in`, and `/sign-out`. | `navigationRelativeUrls.test.tsx` currently asserts this touched file remains free of hard-coded same-app origins and still contains `path: "/sign-in"`. |
| Provider sign-in defaults | `AuthProviderSignInButtons.tsx` | OAuth buttons sanitize `callbackUrl`; unsafe or missing values fall back to `/account/settings`. Privacy/terms links remain public legal routes. | `AuthProviderSignInButtons.test.tsx` covers privacy/terms links, sanitized callback pass-through, and `/account/settings` fallback. |
| Admin dashboard entry redirects | `src/app/admin/page.tsx`, `src/app/admin/dashboard/page.tsx` | `/admin` and `/admin/dashboard` redirect to `/admin/dashboard/articles`. | Middleware/smoke tests cover unauthenticated denial for the dashboard articles route, not the page redirect pair directly. |
| Admin sidebar/dashboard segment links | `AdminSidebar.tsx`, `src/app/admin/dashboard/@main/[segment]/page.tsx`, admin segment config consumers | Sidebar links point at `/admin/dashboard/articles`, `/artwork`, `/blogs`, `/collections`, `/comments`, and `/users`; active state uses `pathname.startsWith(item.href)`. | Admin read pagination and dashboard tests cover segment content behavior. No dedicated sidebar route-builder test owns this route list. |
| Saved-item revalidation paths | `updateUserFavourites.ts`, `updateUserWatchlist.ts` | Favourites revalidate `/account/favourites`, `/account/favourites/[artworkId]`, and `/artwork/[artworkId]`; watchlist revalidates `/account/watchlist`, `/account/watchlist/[artworkId]`, and `/artwork/[artworkId]`. | `savedItemActions.test.ts` asserts exact list/detail/artwork revalidation order and no revalidation on persistence failure. |
| Smoke/sitemap private-prefix fixtures | `scripts/smoke-public-routes.mjs`, `src/lib/metadata/publicDynamicSitemap.ts`, `src/app/robots.ts` | Public discovery excludes or disallows `/admin`, `/account`, and `/api`; smoke also probes `/sign-in`, `/api/auth/signout`, and unauthenticated `/admin/dashboard/articles` redirect. | `publicMetadataDiscovery.test.ts`, `publicDynamicSitemap.test.ts`, and `publicSmokeDiscoveryEndpoints.test.ts` assert explicit public/private release-contract fixtures. |
| NextAuth callback paths | `authCallbacks.ts` | Redirect callback compares `/api/auth/signin` and `/api/auth/signout`; sign-in currently returns `${baseUrl}/dashboard`, sign-out returns base URL, other same-origin URLs pass through. | T-308 noted callback redirect behavior is surprising and should not be normalized without focused callback tests. |

## Ownership Distinctions

### Account Routes

Account UI routes are client-safe app paths for account entry and account
navigation. Current consumers are account entry pages, account dropdown, mobile
drawer, and provider sign-in defaults. These can safely share value-only
builders such as:

- `accountRootPath`
- `accountSettingsPath`
- `accountSignInPath`
- `accountSignUpPath`
- `accountFavouritesPath(artworkId?)`
- `accountWatchlistPath(artworkId?)`

This group should not own middleware protection, API auth, sitemap fixtures, or
server-action cache behavior in the first implementation. It may consume
`authProtectedRoutes.account`, `authProtectedRoutes.accountSettings`,
`authProtectedRoutes.signIn`, `authProtectedRoutes.home`, and
`publicAppRoutes.privacy`/`terms` without changing their source of truth.

### Admin Dashboard UI Routes

Admin dashboard segment routes are UI shell paths, not the auth boundary. They
are coupled to dashboard segment names, sidebar active-state matching, and
admin CRUD tab content. Although `authProtectedRoutes.adminDashboardArticles`
exists as the landing route, the broader sidebar list should be a separate
admin-dashboard route-builder task with its own sidebar and page redirect
coverage.

Do not fold admin CRUD API paths into this group. T-309 split API fetcher paths,
physical route files, and request-context route IDs into separate ownership
boundaries.

### Protected/Auth Boundary Routes

T-311 already owns this layer. The stable protected roots, protected API roots,
admin roots, sign-in/home redirect destinations, and middleware matcher
derivation live in `authProtectedRoutes.ts` and are covered by route utils,
middleware, admin frontend guard, and import-boundary tests. Future account UI
route builders should reuse those constants instead of re-opening middleware or
auth config.

### Smoke/Sitemap Public-Contract Fixtures

Smoke and discovery fixtures intentionally duplicate public/private route
expectations. They prove the deployed public contract independently of runtime
helpers. Do not migrate `PRIVATE_SITEMAP_PREFIXES`, robots disallow paths,
required stable sitemap paths, `/api/auth/signout`, or unauthenticated admin
denial fixtures in the account UI slice.

### Cache Revalidation Paths

Saved-item revalidation paths are cache-invalidation behavior. They are coupled
to the mutation result, the saved artwork list/detail route, and the public
artwork detail route. Centralize these only in a later saved-item route-builder
slice that preserves `savedItemActions.test.ts` order and no-revalidation
failure behavior.

### NextAuth Callback Paths

`authCallbacks.ts` owns NextAuth callback endpoint comparisons and redirect
semantics. Its `/api/auth/signin` branch currently points to `/dashboard`, which
is not the account settings fallback used by provider buttons. Do not touch
callback paths until a focused callback redirect task decides whether that
behavior is intentional and adds coverage.

## Recommended Implementation Slice

Implement one narrow account UI route-builder task:

1. Add a client-safe value-only account route module, for example
   `src/lib/routes/accountRoutes.ts`.
2. Export values/builders for current account UI paths only:
   `accountRootPath`, `accountSettingsPath`, `accountSignInPath`,
   `accountSignUpPath`, `accountFavouritesPath(artworkId?)`, and
   `accountWatchlistPath(artworkId?)`.
3. Build `accountSignUpPath` through `URLSearchParams` or an equivalent
   deterministic query builder so `/sign-in?mode=signup` remains unchanged.
4. Reuse existing route constants from `authProtectedRoutes` and
   `publicAppRoutes`; keep the new module value-only and safe for client
   imports.
5. Update only these consumers:
   - `src/app/account/page.tsx`
   - `src/app/account/favourites/page.tsx`
   - `src/app/account/watchlist/page.tsx`
   - `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
   - `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx`
   - `src/components/modules/forms/user/AuthProviderSignInButtons.tsx`
6. Add focused route-builder tests and update existing focused consumer tests
   for account dropdown/mobile/provider defaults as needed.

This slice is small enough for one agent because it changes client-safe account
UI path construction and page redirects only. It avoids admin CRUD route
segments, middleware/auth boundaries, callback redirects, cache invalidation,
smoke/sitemap fixtures, and API route builders.

## Explicitly Deferred

- Admin sidebar/dashboard segment links and `/admin` dashboard redirects:
  separate admin dashboard route-builder slice with sidebar active-state and
  redirect coverage.
- `authCallbacks.ts`: separate callback redirect task with focused tests before
  changing `/api/auth/signin`, `/api/auth/signout`, or the current `/dashboard`
  branch.
- Saved-item revalidation paths: separate saved-item route/cache slice that
  preserves exact `revalidatePath()` calls and order.
- Smoke, robots, sitemap, and public discovery fixtures: keep explicit release
  contracts until route constants are stable and parity tests prove these
  checks still assert independent public/private output.
- API route builders and request-context route IDs: covered by T-309 and later
  API-family implementation tasks.
- Shopify dashboard data, commerce links, checkout/cart behavior, and public
  shop route policy.

## Risk Boundaries

- Do not change visible auth state behavior. Disabled account/mobile links must
  remain disabled for the same session states.
- Do not change OAuth callback sanitization. Unsafe or missing callback URLs
  must continue to fall back to `/account/settings`.
- Do not use broad barrels from client components. The new account route module
  must not import server-only, auth config, session, data, metadata, model, or
  API modules.
- Preserve exact path strings: `/account`, `/account/settings`,
  `/sign-in`, `/sign-in?mode=signup`, `/account/favourites`,
  `/account/favourites/[artworkId]`, `/account/watchlist`, and
  `/account/watchlist/[artworkId]`.
- Keep `/sign-out` local to the mobile drawer unless a separate task decides
  whether that route is real, retired, or should become a logout action.

## Future Verification Requirements

For the recommended implementation slice, run:

```bash
npm test -- --runTestsByPath __tests__/unit/forms/AuthProviderSignInButtons.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Also add a focused `accountRoutes` unit test for the new builders. If page
redirect tests are added, include their path in the focused Jest command.

Do not run broad smoke or browser automation for this docs-scoped ownership
slice.

## Candidate Shared Tracker Updates

For orchestrator reconciliation only; this task did not edit shared trackers.

- `docs/workstreams/architecture-refactor-and-code-health.md`: note that T-315
  scoped the next route-builder task to account UI paths only and kept
  callbacks, admin dashboard segments, cache revalidation, smoke/sitemap, and
  API builders separate.
- `docs/workstreams/auth-admin-and-permissions.md`: add a next action for
  account route builders that reuse T-311 constants without touching auth
  policy or callback redirect behavior.
- `docs/workstreams/frontend-routes-and-components.md`: track the future
  account dropdown/mobile/provider default migration as a client-safe route
  builder slice.
- `docs/workstreams/testing-and-quality.md`: note the focused verification set
  and the need for route-builder unit coverage plus existing provider/mobile
  navigation tests.
- `docs/tasks/README.md`: add a future implementation task such as
  `T-316 Add account UI route builders`.

## Handoff Notes

- Runtime behavior was not changed.
- The recommended next owner should inspect whether T-314 or other concurrent
  public route-builder work added route modules before choosing the final file
  name. The invariant is a client-safe value-only account route surface.
- `git diff --check` is the only verification required for this docs-only task.

# T-316 Add Account UI Route Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe account UI route builders for the implementation slice scoped
by T-315.

## Context

T-315 distinguished account UI routes from admin dashboard segment routes,
protected/auth boundary routes, smoke/sitemap fixtures, cache revalidation
paths, and NextAuth callback paths. It recommended centralizing only account
entry redirects, account dropdown links, mobile drawer account links, and
provider sign-in callback defaults.

## Scope

In scope:

- Read [T-315 account/admin route-builder ownership scope](../audits/results/T-315-account-admin-route-builder-ownership-scope.md).
- Add a client-safe value-only account route module, for example
  `src/lib/routes/accountRoutes.ts`.
- Export values/builders for current account UI paths only:
  `accountRootPath`, `accountSettingsPath`, `accountSignInPath`,
  `accountSignUpPath`, `accountFavouritesPath(artworkId?)`, and
  `accountWatchlistPath(artworkId?)`.
- Build the sign-up path deterministically so the rendered URL remains
  `/sign-in?mode=signup`.
- Reuse existing `authProtectedRoutes` and `publicAppRoutes` values where
  appropriate without importing server-only modules.
- Update only these consumers:
  - `src/app/account/page.tsx`
  - `src/app/account/favourites/page.tsx`
  - `src/app/account/watchlist/page.tsx`
  - `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
  - `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx`
  - `src/components/modules/forms/user/AuthProviderSignInButtons.tsx`
- Add focused route-builder coverage and update existing focused consumer tests
  as needed.

Out of scope:

- Do not change auth policy, session handling, OAuth behavior, admin role
  checks, admin dashboard access, or redirect destinations.
- Do not edit `authCallbacks.ts`, admin dashboard segment links, admin sidebar
  routes, saved-item revalidation paths, smoke scripts, robots/sitemap
  fixtures, API route builders, route handlers, cache policy, or route segment
  config.
- Do not touch Shopify dashboard data, product metadata, checkout/cart, policy
  URLs, or commerce behavior.

## Concurrency

Can run in parallel with T-317 because this task owns account UI route builders
and focused tests only. Do not run in parallel with another task editing
account route modules, account dropdown/mobile drawer account links, provider
sign-in defaults, or account redirect pages.

## Files Likely Touched

- `src/lib/routes/accountRoutes.ts`
- `src/app/account/page.tsx`
- `src/app/account/favourites/page.tsx`
- `src/app/account/watchlist/page.tsx`
- `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx`
- `src/components/modules/forms/user/AuthProviderSignInButtons.tsx`
- `__tests__/unit/forms/AuthProviderSignInButtons.test.tsx`
- `__tests__/unit/navigationRelativeUrls.test.tsx`
- `__tests__/unit/security/clientServerImportBoundary.test.ts`
- A focused account route-builder test
- `docs/tasks/T-316-add-account-ui-route-builders.md`

## Acceptance Criteria

- Account UI consumers use the account route-builder surface instead of
  duplicating account/sign-in route literals.
- `/account`, `/account/settings`, `/sign-in`, `/sign-in?mode=signup`,
  `/account/favourites`, `/account/favourites/[artworkId]`,
  `/account/watchlist`, and `/account/watchlist/[artworkId]` remain unchanged.
- Unsafe or missing provider callback URLs still fall back to
  `/account/settings`.
- The new route module is client-safe and does not import server-only, auth
  config, session, data, metadata, model, or API modules.
- Deferred admin dashboard, callback, revalidation, smoke/sitemap, API, cache,
  and Shopify behavior is unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/AuthProviderSignInButtons.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Add the focused account route-builder test path to the Jest command. Run
`npm run lint` if imports or formatting change.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-315 completed.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
- Completed on 2026-05-27 by adding
  `src/lib/routes/accountRoutes.ts`, moving scoped account redirects,
  dropdown links, mobile drawer links, and provider sign-in fallback defaults
  to the new route-builder surface.
- Added focused route-builder coverage in
  `__tests__/unit/routes/accountRoutes.test.ts` and extended provider-button
  fallback coverage for missing callback URLs.
- Left auth policy, admin dashboard routes, NextAuth callback redirects,
  saved-item revalidation paths, smoke/sitemap fixtures, API builders, cache
  policy, and Shopify behavior unchanged.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/AuthProviderSignInButtons.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/routes/accountRoutes.test.ts`,
  `git diff --check`, and `npm run lint`.

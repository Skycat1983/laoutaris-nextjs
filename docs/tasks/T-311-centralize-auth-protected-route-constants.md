# T-311 Centralize Auth Protected Route Constants

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the first auth/protected route constant slice scoped by T-308 without
changing auth behavior.

## Context

T-308 found that protected route roots are partly centralized, but middleware,
NextAuth sign-in page config, and admin frontend redirects still duplicate
stable route literals. This task should centralize only the stable auth boundary
paths and the direct tests that prove current behavior.

## Scope

In scope:

- Read [T-308 auth protected route constants scope](../audits/results/T-308-auth-protected-route-constants-scope.md).
- Add or refine a client-safe value-only route constants surface for `home`,
  `signIn`, `account`, `accountSettings`, `admin`,
  `adminDashboardArticles`, `api`, `nextAuthApi`, `adminApi`, `userApi`, and a
  static protected matcher list derived from protected roots.
- Keep `src/lib/constants/routeConstants.ts` as the compatibility surface for
  current imports, either by owning the constants there or by re-exporting from
  a narrowed value-only module.
- Update `src/lib/utils/routeUtils.ts` to consume the same protected root list
  used by middleware matcher derivation.
- Update `src/middleware.ts` to use constants for the `/api/auth` bypass,
  frontend redirects, admin redirects, and matcher strings.
- Update `src/lib/config/authOptions.ts` to use the shared sign-in route for
  `pages.signIn`.
- Update `src/lib/session/requireAdminFrontendAccess.ts` to use shared
  `signIn` and `home` redirect constants.
- Update focused tests for the touched behavior.

Out of scope:

- Do not change session handling, OAuth behavior, persisted role checks,
  admin dashboard access rules, JSON protected API failure behavior, or
  redirect destinations.
- Do not edit `authCallbacks.ts`, account/mobile navigation links, provider
  callback defaults, admin sidebar links, saved-item revalidation paths,
  smoke scripts, robots/sitemap private-prefix fixtures, API fetchers, API
  action route builders, route handlers, or request-context route IDs.
- Do not touch Shopify dashboard data, Shopify metadata, product options,
  checkout/cart, or commerce policy work.

## Concurrency

Can run in parallel with T-312 if this task owns only auth/protected route
constants, middleware/auth config, admin frontend guard redirects, and focused
tests. Do not run in parallel with another task editing middleware, auth route
constants, route utils, or auth/admin guard tests.

## Files Likely Touched

- `src/lib/constants/routeConstants.ts`
- Optional value-only route module under `src/lib/routes/`
- `src/lib/utils/routeUtils.ts`
- `src/middleware.ts`
- `src/lib/config/authOptions.ts`
- `src/lib/session/requireAdminFrontendAccess.ts`
- `__tests__/unit/utils/routeUtils.test.ts`
- `__tests__/unit/middleware.test.ts`
- `__tests__/unit/auth/adminFrontendGuard.test.tsx`
- `docs/tasks/T-311-centralize-auth-protected-route-constants.md`

## Acceptance Criteria

- Stable auth/protected roots, sign-in/home redirects, and middleware matcher
  strings are derived from one client-safe value-only route constants surface.
- `/api/auth` remains an API route but is still bypassed by protected middleware
  checks.
- Exact-or-nested route matching remains unchanged and false positives such as
  `/accounting`, `/administrator`, `/api/v2/administer`, and `/api/v2/userland`
  remain unprotected.
- Unauthenticated protected frontend redirects, admin forbidden redirects, and
  protected API JSON `401`/`403` behavior are unchanged.
- No deferred auth callback, UI navigation, saved-item, smoke, sitemap, API
  action, or Shopify behavior is changed.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/utils/routeUtils.test.ts __tests__/unit/middleware.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Run `npm run lint` if source changes touch import ordering or shared modules
with existing lint coverage.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-308 completed.
- This is source-only and does not require Shopify dashboard work or privileged
  Vercel access.
- Completed on 2026-05-27. Added client-safe
  `src/lib/routes/authProtectedRoutes.ts` for stable auth/protected route
  values, protected route roots, admin roots, and middleware matcher strings.
- `src/lib/constants/routeConstants.ts` remains the compatibility surface for
  current imports while re-exporting the narrowed route module.
- Middleware, route utilities, NextAuth `pages.signIn`, and the admin frontend
  guard now consume the shared constants. Auth callback paths, UI navigation,
  saved-item revalidation, smoke/sitemap fixtures, API action builders, and
  Shopify behavior were left unchanged.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/utils/routeUtils.test.ts __tests__/unit/middleware.test.ts __tests__/unit/auth/adminFrontendGuard.test.tsx`,
  `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `git diff --check`, and `npm run lint`.

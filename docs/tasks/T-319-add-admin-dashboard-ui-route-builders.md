# T-319 Add Admin Dashboard UI Route Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe admin dashboard UI route builders for admin entry redirects and
sidebar segment links.

## Context

T-315 deferred admin dashboard segment routes from the account UI route-builder
slice because they are UI shell routes, not the auth/protected boundary. The
current admin entry pages and `AdminSidebar` still duplicate dashboard segment
paths such as `/admin/dashboard/articles`.

## Scope

In scope:

- Read [T-315 account/admin route-builder ownership scope](../audits/results/T-315-account-admin-route-builder-ownership-scope.md).
- Add a client-safe value-only admin dashboard route module, for example
  `src/lib/routes/adminDashboardRoutes.ts`.
- Export the current admin dashboard root/articles route and segment builders
  needed by admin entry redirects and sidebar links.
- Update only:
  - `src/app/admin/page.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/components/layouts/admin/AdminSidebar.tsx`
- Preserve current sidebar labels, active-state behavior, and destinations.
- Add focused route-builder/sidebar coverage or source-hygiene coverage for
  the touched admin dashboard UI route list.

Out of scope:

- Do not change auth policy, middleware, admin frontend guard behavior,
  persisted role checks, dashboard layout behavior, dashboard segment content,
  admin CRUD forms, API routes, request-context route IDs, smoke scripts,
  sitemap/robots fixtures, cache policy, or route segment config.
- Do not touch Shopify dashboard data, product metadata, checkout/cart, policy
  URLs, or commerce behavior.

## Concurrency

Can run in parallel with T-318 because this task owns admin dashboard UI route
builders and focused tests only. Do not run in parallel with another task
editing admin dashboard route modules, `AdminSidebar`, or admin entry redirect
pages.

## Files Likely Touched

- `src/lib/routes/adminDashboardRoutes.ts`
- `src/app/admin/page.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/components/layouts/admin/AdminSidebar.tsx`
- Focused admin dashboard route/sidebar test
- `__tests__/unit/security/clientServerImportBoundary.test.ts`
- `docs/tasks/T-319-add-admin-dashboard-ui-route-builders.md`

## Acceptance Criteria

- Admin entry redirects and sidebar links use a client-safe admin dashboard
  route-builder surface instead of duplicating route literals.
- `/admin/dashboard/articles`, `/admin/dashboard/artwork`,
  `/admin/dashboard/blogs`, `/admin/dashboard/collections`,
  `/admin/dashboard/comments`, and `/admin/dashboard/users` remain unchanged.
- Sidebar active-state behavior still uses the same route prefix semantics.
- Auth, admin guard, API, smoke/sitemap, cache, route segment config, and
  Shopify behavior are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Add focused route-builder/sidebar test paths to the Jest command. Run
`npm run lint` if imports or formatting change.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-316 and T-317 completed.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
- Completed on 2026-05-27.
- Added `src/lib/routes/adminDashboardRoutes.ts` as a client-safe value-only
  route surface for the admin dashboard root, default articles route, supported
  segment names, segment builder, and current sidebar segment paths.
- Updated `/admin`, `/admin/dashboard`, and `AdminSidebar` to consume the
  route surface while preserving current destinations and prefix active-state
  behavior.
- Added `__tests__/unit/routes/adminDashboardRoutes.test.tsx` for exact route
  strings, segment builder parity, admin entry redirects, sidebar links, and
  nested-prefix active behavior.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/routes/adminDashboardRoutes.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `git diff --check`, and `npm run lint`.

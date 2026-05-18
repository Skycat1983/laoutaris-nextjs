# T-102 Split Public Shell From Auth Work

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove global request-time database/session work from the public app shell and
avoid parsing auth tokens for unprotected public routes, so public route
cacheability can be improved and remaining dynamic blockers are route-local and
explicit.

## Context

- A-010 found all public routes build as dynamic.
- `src/app/layout.tsx` currently calls `dbConnect()` and
  `getServerSession(authOptions)` before rendering every route.
- `src/middleware.ts` currently calls `getToken()` before checking whether the
  path is protected.
- T-023 already removed credentials password verification/native bcrypt from
  the normal public-page import path, but root layout still performs session
  work globally.
- This task should not promise every public route becomes static; public route
  loaders may still have route-local DB/data dependencies. It should remove the
  global blockers and record remaining route-local blockers.

## Scope

- In scope:
  - Refactor `src/middleware.ts` so public, unprotected routes return
    `NextResponse.next()` before `getToken()` is called.
  - Refactor the root public shell so `src/app/layout.tsx` no longer calls
    `dbConnect()` or `getServerSession(authOptions)` for every route.
  - Preserve current public header, footer, modal, and client context behavior.
  - Preserve protected account/admin behavior and authenticated UI behavior, or
    document any route-specific follow-up if a narrow behavior cannot be
    preserved without broader layout work.
  - Add focused tests or static source checks proving middleware does not parse
    tokens for public paths and root layout no longer imports/calls global DB or
    session helpers.
  - Run `npm run build` and record whether public routes remain dynamic because
    of route-local data work.
  - Update this task brief and the relevant workstreams after completion.
- Out of scope:
  - Full static/ISR conversion for every public route.
  - Route-specific cache policy or `revalidate` design.
  - Production metadata, sitemap, robots, canonical/social previews, or JSON-LD.
  - Search/navigation accessibility fixes.
  - Image preload/sizing tuning.
  - Checkout/cart, account data behavior, admin bootstrap, or auth provider
    configuration changes.

## Files Likely Touched

- `src/app/layout.tsx`
- `src/middleware.ts`
- `src/contexts/ClientContextBoundary.tsx`
- `src/components/elements/buttons/NavItem.tsx`
- `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-102-split-public-shell-auth-work.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Public, unprotected paths do not call `getToken()` in middleware.
- Root layout no longer performs global `dbConnect()` or
  `getServerSession(authOptions)` work before rendering public routes.
- Existing public shell UI still renders with header, modal support, footer, and
  client providers.
- Protected account/admin paths still enforce auth/role behavior.
- Verification records whether public route build output remains dynamic and
  names any remaining route-local blockers.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/security/publicShellAuthBoundaries.test.ts __tests__/unit/security/renderSourceHygiene.test.ts
npm run lint
npm run build
rg -n "getServerSession|dbConnect|authOptions" src/app/layout.tsx
git diff --check
```

The final `rg` should show no root-layout import or call for those global auth/
DB helpers.

Completed verification:

- `npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/security/publicShellAuthBoundaries.test.ts`
  passed.
- `npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/security/publicShellAuthBoundaries.test.ts __tests__/unit/security/renderSourceHygiene.test.ts`
  passed.
- `npm run lint` passed.
- `npm run build` passed after adding route-local Suspense boundaries around
  the shared navigation components that call `useSearchParams()`.
- `rg -n "getServerSession|dbConnect|authOptions" src/app/layout.tsx` returned
  no matches.
- `git diff --check` passed.

Build output after this slice:

- Static public routes now include `/biography`, `/collections`, `/project`,
  `/project/about`, `/project/aims`, `/project/film`, and `/shop`.
- Public routes still dynamic include `/`, `/artwork`, `/artwork/[artworkId]`,
  `/biography/[slug]`, `/blog`, `/blog/[slug]`, `/collections/[slug]`,
  `/collections/[slug]/[artworkId]`, `/project/contact`, `/search`,
  `/shop/products`, and `/shop/products/[productHandle]`.
- Remaining route-local blockers observed in source are page/search-param
  ownership plus route-local MongoDB, Shopify, or session-aware loaders:
  `SubscribeSectionLoader` still reads server session state on `/`,
  artwork detail still reads user/session context for favourite/watchlist UI,
  artwork/blog/search/shop/contact list pages read `searchParams` and call
  route-local data services, collection slug routes use collection navigation
  and pagination DB services, and article/blog/collection/detail loaders still
  use server-only data services that own `dbConnect()`.

## Handoff Notes

- Prepared from A-010/F-084 as the first public route performance/cacheability
  implementation slice.
- Keep metadata/discovery files, accessibility controls, image tuning,
  route-local ISR/cache policy, and artwork-to-shop SSR discovery separate.
- Completed on 2026-05-18 by removing root-layout `dbConnect()`,
  `getServerSession(authOptions)`, and related imports; making
  `ClientContextBoundary` accept an optional initial session; short-circuiting
  public middleware paths before `getToken()`; adding focused middleware and
  root-layout source checks; and adding narrow Suspense boundaries for shared
  navigation `useSearchParams()` callers exposed by the static build.

# T-238 Pilot Collections Redirect Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the next narrow F-111/R-012 public cache proof for the collections
default redirect and route-local collection navigation reads, without changing
collection detail rendering, generated params, root provider ownership, or
global navigation cache behavior.

## Context

- T-233 proved the first route-family cache pattern on biography with
  10-minute cached non-`fetch` service wrappers and route-level ISR only for
  the default `/biography` redirect.
- T-237 selected collections as the next safe slice because the rendering
  architecture already accepts short ISR for the default collections redirect
  after the biography proof.
- Current build output keeps `/collections` static and deploy-bound, while
  `/collections/[slug]` and `/collections/[slug]/[artworkId]` are explicitly
  dynamic.
- `src/app/collections/page.tsx` and
  `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx` now
  read collection navigation through the cached
  `getCachedCollectionNavigationList()` wrapper.
- `src/app/collections/[slug]/page.tsx` reads slug-specific redirect data
  through `getCollectionNavigationItem(slug)` and must remain dynamic.

## Scope

In scope:

- Add narrow cached non-`fetch` service wrapper(s) for collection navigation
  reads that derive redirect targets from collection ordering and first artwork
  membership.
- Target the same 10-minute stale window used by the biography proof unless the
  rendering architecture is updated first with a different accepted value.
- Use the cached collection navigation wrapper from `/collections` and
  route-local collections subnav call sites where the accepted default redirect
  policy applies.
- Add route-level `revalidate` only to `src/app/collections/page.tsx`.
- Keep `/collections/[slug]` and `/collections/[slug]/[artworkId]` explicitly
  dynamic and free of `generateStaticParams()`.
- Keep `MainNavLoader` on the direct collection navigation service unless build
  evidence proves a cached root-header read does not make unrelated static
  shells inherit the collections cache window.
- Update focused tests and rendering architecture notes so the public route
  cache policy permits only the biography and collections redirect proofs.
- Record build output and prerender manifest evidence.

Out of scope:

- Do not add `generateStaticParams()` for any collection route.
- Do not add route-level `revalidate` to `/collections/[slug]`,
  `/collections/[slug]/[artworkId]`, artwork, blog, search, shop, account, or
  admin routes.
- Do not cache collection artwork detail, pagination, Shopify product links, or
  user/session-derived data in this task.
- Do not move `SessionProvider`, `GlobalFeaturesProvider`, modal providers, or
  root layout ownership.
- Do not change sitemap freshness, blog cache behavior, Shopify freshness, or
  monitoring/instrumentation.

## Concurrency

Run after T-237. Do not run in parallel with route-family cache work,
collections route/layout/loader edits, root header navigation edits, provider
moves, or public route cache policy test edits.

Owned files:

- `src/app/collections/page.tsx`
- `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx`
- `src/lib/data/services/getCollectionNavigationList.ts`
- new narrow cached collection navigation service wrapper module(s), if used
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `__tests__/unit/data/getCollectionNavigationList.test.ts`
- `__tests__/unit/loaders/CollectionsSubnavLoader.test.tsx`
- `__tests__/unit/pages/CollectionsPage.test.tsx`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- `/collections` adopts the approved short-ISR default redirect behavior.
- Route-local collection navigation reads use the cached wrapper where scoped.
- `/collections/[slug]` and `/collections/[slug]/[artworkId]` remain dynamic
  and do not define `generateStaticParams()`.
- No root-header collection navigation cache propagates into unrelated static
  shells unless explicitly proven and recorded.
- Focused tests guard the allowed collections proof and prevent broad static/ISR
  drift.
- Build output and prerender manifest evidence are recorded in this handoff.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/data/getCollectionNavigationList.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx __tests__/unit/pages/CollectionsPage.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx
npm run build
git diff --check
```

Add a focused cached-wrapper unit test if the implementation creates a new
module that is not covered by the listed suites.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-237.
- Selected by T-237 as the next safe Next.js efficiency slice after the T-233
  biography proof and T-236 lazy drawer proof.
- Implemented `getCachedCollectionNavigationData.ts` with a 10-minute
  `unstable_cache` wrapper around the direct collection navigation service.
- `/collections` now exports the matching 600-second `revalidate`; the route
  still redirects to the first collection and first artwork when available, and
  keeps the existing no-collection failure behavior.
- `CollectionsSubnavLoader` uses the cached wrapper for route-local navigation.
  `MainNavLoader`, `/collections/[slug]`, and
  `/collections/[slug]/[artworkId]` remain on direct/dynamic paths with no
  `generateStaticParams()`.
- Build and prerender manifest evidence:
  - `npm run build` passed.
  - Build route output still marks `/collections` as prerendered static content
    (`○ /collections`) and keeps `/collections/[slug]` and
    `/collections/[slug]/[artworkId]` dynamic (`ƒ`).
  - `.next/prerender-manifest.json` records `/collections`
    `initialRevalidateSeconds: 600`, matching `/biography`; collection detail
    routes are absent from `routes`/`dynamicRoutes`.
- Verification run:
  - `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/data/getCollectionNavigationList.test.ts __tests__/unit/data/getCachedCollectionNavigationData.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx __tests__/unit/pages/CollectionsPage.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx`
    passed with the existing `punycode` deprecation warning.
  - `npm run build` passed.
  - `git diff --check` passed.
- Orchestrator verification repeated 2026-05-24 with the same focused Jest
  command, `npm run build`, prerender-manifest checks for `/collections`, and
  `git diff --check`; all passed. The same build also showed `/sitemap.xml`
  already records `initialRevalidateSeconds: 3600` through indirect fetch
  revalidation, which is now scoped for T-239.
- Keep F-115 provider/modal work separate unless this task is completed and a
  new provider ownership task is scoped.

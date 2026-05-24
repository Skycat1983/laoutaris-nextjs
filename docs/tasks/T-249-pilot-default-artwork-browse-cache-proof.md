# T-249 Pilot Default Artwork Browse Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the T-248 selected F-111/R-012 cache proof by caching only the
server-rendered default `/artwork` browse list read, while keeping filtered
artwork browsing, artwork detail, public APIs, browser follow-up fetches,
Shopify product-link reads, and user/session state direct.

## Context

- T-233 proved the biography cached-service and default redirect ISR pattern.
- T-238 proved the collections default redirect and route-local navigation
  cache pattern.
- T-239 made `/sitemap.xml` own one-hour ISR freshness.
- T-241 through T-247 completed the staged blog cache proof sequence.
- T-248 compared `/artwork`, `/search`, shop routes, product detail, and
  pausing for F-115 provider/client-island work. It selected the default
  `/artwork` browse list because it is a high-impact MongoDB-backed public
  route read with a safe fixed default shape and no selected-branch session or
  Shopify coupling.

## Scope

In scope:

- Add a cached non-`fetch` service wrapper for only the default artwork browse
  list:
  - `sortBy: "mostRecent"`
  - `page: 1`
  - `limit: 10`
  - `filterMode: "ALL"`
  - no taxonomy filters
  - no `sortColor`
- Use a 10-minute stale window, matching the existing MongoDB public cache
  proofs.
- Prefer one fixed no-argument wrapper and cache key over a broad parameterized
  cache. The key should encode the bounded route shape, for example
  `public-artwork-default-list-page-1-limit-10-most-recent`.
- Update `ArtworkListLoader` so only the exact default list shape uses the
  cached wrapper.
- Keep all non-default `/artwork` initial renders on direct `getArtworkList()`
  reads, including filtered variants, page 2-plus, non-default limits,
  `mostPopular`, `mostFeatured`, and `colorProximity`.
- Keep `GET /api/v2/public/artwork`, public artwork fetchers, browser
  follow-up loading, artwork detail routes, collection-scoped artwork routes,
  artwork metadata/JSON-LD detail reads, saved-item actions, and Shopify
  product-link reads direct.
- Update focused wrapper, loader, and public route-cache policy tests.
- Update rendering architecture notes and this task brief after completion.

Out of scope:

- Do not cache filtered artwork list variants, page 2-plus, non-default limits,
  `mostPopular`, `mostFeatured`, or `colorProximity`.
- Do not cache arbitrary `sortColor` values.
- Do not cache artwork detail route output, collection-scoped artwork route
  output, metadata/JSON-LD detail reads, saved-item/session-aware artwork reads,
  optional Shopify product-link reads, public artwork API routes, public
  fetchers, browser follow-up fetches, account/admin routes, comments, search,
  or shop routes.
- Do not add route-level `/artwork` ISR, `generateStaticParams()`, cache tags,
  `revalidatePath()`, `revalidateTag()`, mutation revalidation, provider moves,
  Shopify fetch changes, or public API caching.
- Do not change query parsing, filter semantics, pagination UI, sorting
  behavior, gallery behavior, public API behavior, saved-item behavior, or
  artwork detail not-found/error behavior.

## Concurrency

Run after T-248. Do not run in parallel with public artwork browse/detail,
public artwork API/fetcher, cached artwork service wrapper, route-cache policy,
saved-item action, provider, Shopify product-link, or related test runtime
edits.

Owned files:

- `src/components/loaders/viewLoaders/ArtworkListLoader.tsx`
- new cached artwork list service file under `src/lib/data/services/`, if
  needed
- `__tests__/unit/loaders/ArtworkListLoader.test.tsx`
- new cached artwork list service test under `__tests__/unit/data/`, if
  needed
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Default `/artwork` server rendering uses the cached wrapper only for
  `mostRecent` page 1 limit 10 with no filters and no `sortColor`.
- Filtered `/artwork` variants, page 2-plus, non-default limits, `mostPopular`,
  `mostFeatured`, and `colorProximity` still call direct `getArtworkList()`.
- Public artwork API routes, public artwork fetchers, browser follow-up
  loading, artwork detail routes, metadata/JSON-LD detail reads, session-aware
  saved-item reads, optional Shopify product-link reads, and saved-item
  mutations remain direct/dynamic.
- `/artwork` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Focused tests guard the fixed cache key, stale window, default cached loader
  branch, direct non-default loader branches, public API/fetcher exclusion, and
  route-cache policy invariants.
- Rendering architecture notes document the new default artwork browse cache
  boundary and exclusions.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedArtworkListData.test.ts __tests__/unit/loaders/ArtworkListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
git diff --check
npm run build
```

- 2026-05-24: Passed focused Jest with 3 suites and 24 tests.
- 2026-05-24: Passed `git diff --check`.
- 2026-05-24: Passed `npm run build`; build output kept `/artwork`,
  `/artwork/[artworkId]`, public artwork APIs, collection-scoped artwork
  detail, `/shop/products`, and `/shop/products/[productHandle]` dynamic.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-248.
- Selected by T-248 because the default `/artwork` browse list is the safest
  next public cache proof: it is MongoDB-backed, high-impact, fixed-shape, and
  avoids search query cardinality, commerce freshness, session personalization,
  and Shopify product-link coupling.
- Implemented a single fixed no-argument cached wrapper with key
  `public-artwork-default-list-page-1-limit-10-most-recent` and a 10-minute
  stale window.
- `ArtworkListLoader` uses that wrapper only for `mostRecent` page 1 limit 10,
  `filterMode: "ALL"`, empty taxonomy filters, and no `sortColor`; every
  other initial browse shape stays on direct `getArtworkList()`.
- Public artwork APIs/fetchers, browser follow-up fetches, artwork detail,
  collection-scoped artwork detail, metadata/JSON-LD detail reads,
  saved-item/session-aware reads, and Shopify product-link reads remain direct.

# T-251 Pilot Bounded Artwork Browse Cache Expansion

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the T-250 selected F-111/R-012 runtime proof by expanding the
existing default `/artwork` browse cache to only unfiltered `mostRecent` pages
2-5, while keeping broader artwork browse variants, detail routes, public APIs,
browser follow-up fetches, search, shop, and user/session state direct.

## Context

- T-249 proved the fixed default `/artwork` browse list cache for
  `mostRecent` page 1, limit 10, `filterMode: "ALL"`, no taxonomy filters, and
  no `sortColor`.
- T-250 compared the remaining artwork detail, collection-scoped detail,
  additional browse, public search, shop, and F-115 provider/client-island
  options. It selected a bounded browse expansion because it reuses the proven
  MongoDB-only route family and avoids detail personalization, arbitrary search
  terms, and commerce freshness.

## Scope

In scope:

- Add fixed cached non-`fetch` service wrappers, or a fixed dispatcher, for
  only these additional `/artwork` browse shapes:
  - `sortBy: "mostRecent"`
  - `page: 2`, `3`, `4`, and `5`
  - `limit: 10`
  - `filterMode: "ALL"`
  - no taxonomy filters
  - no `sortColor`
- Keep the same 10-minute stale window used by T-249 and other MongoDB public
  cache proofs.
- Keep cache keys fixed and route-shaped, for example
  `public-artwork-default-list-page-2-limit-10-most-recent` through
  `public-artwork-default-list-page-5-limit-10-most-recent`.
- Update `ArtworkListLoader` so the exact unfiltered `mostRecent` page 1-5
  limit-10 set uses the cached path, with page 1 still using the T-249 wrapper.
- Keep all other initial `/artwork` render shapes on direct `getArtworkList()`.
- Update focused wrapper, loader, and public route-cache policy tests.
- Update rendering architecture notes and this task brief after completion.

Out of scope:

- Do not cache page 6-plus, non-default limits, taxonomy-filtered variants,
  `filterMode: "ANY"`, `mostPopular`, `mostFeatured`, or `colorProximity`.
- Do not cache arbitrary `sortColor` values.
- Do not cache public artwork API routes, public artwork fetchers, browser
  follow-up/load-more fetches, artwork detail routes, collection-scoped artwork
  detail routes, metadata/JSON-LD detail reads, saved-item/session-aware reads,
  optional Shopify product-link reads, search, shop routes, account/admin
  routes, comments, or mutation responses.
- Do not add route-level `/artwork` ISR, `generateStaticParams()`, cache tags,
  `revalidatePath()`, `revalidateTag()`, mutation revalidation, provider
  moves, Shopify fetch changes, public API caching, query parser changes,
  filter/sort semantics changes, pagination UI changes, gallery behavior
  changes, saved-item behavior changes, or artwork detail not-found/error
  behavior changes.

## Concurrency

Run after T-250. Do not run in parallel with public artwork browse/detail,
public artwork API/fetcher, cached artwork service wrapper, route-cache policy,
saved-item action, provider/client-island, Shopify product-link, search, shop,
or related test runtime edits.

Owned files:

- `src/lib/data/services/getCachedArtworkListData.ts`
- `src/components/loaders/viewLoaders/ArtworkListLoader.tsx`
- `__tests__/unit/data/getCachedArtworkListData.test.ts`
- `__tests__/unit/loaders/ArtworkListLoader.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Unfiltered `mostRecent` `/artwork` server rendering uses cached wrappers for
  pages 1-5 only when limit is 10, `filterMode` is `ALL`, taxonomy filters are
  empty, and `sortColor` is absent.
- Page 1 remains on the existing T-249 default cached wrapper.
- Page 6-plus, non-default limits, taxonomy filters, `filterMode: "ANY"`,
  `mostPopular`, `mostFeatured`, and `colorProximity` still call direct
  `getArtworkList()`.
- Public artwork API routes, public artwork fetchers, browser follow-up
  loading, artwork detail routes, metadata/JSON-LD detail reads,
  session-aware saved-item reads, optional Shopify product-link reads, search,
  shop routes, and saved-item mutations remain direct/dynamic.
- `/artwork` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Focused tests guard fixed cache keys, stale window, page 2-5 cached loader
  branches, direct fallback branches, public API/fetcher/detail exclusions, and
  route-cache policy invariants.
- Rendering architecture notes document the bounded artwork browse cache
  expansion and exclusions.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedArtworkListData.test.ts __tests__/unit/loaders/ArtworkListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
git diff --check
npm run build
```

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-250.
- Completed on 2026-05-24. `getCachedArtworkListData` now keeps the T-249
  page 1 wrapper and adds fixed 10-minute wrappers for unfiltered `mostRecent`
  pages 2-5 with limit 10. `ArtworkListLoader` uses the bounded cached
  dispatcher only for pages 1-5 when `filterMode` is `ALL`, taxonomy filters
  are empty, and `sortColor` is absent.
- Verification passed with the focused Jest command in this task, `git diff
  --check`, and `npm run build`. The first non-escalated build attempt failed
  on restricted Google Font downloads; the escalated rerun passed.
- Selected by T-250 because fixed unfiltered `mostRecent` `/artwork` pages 2-5
  are the remaining lower-risk cache expansion after T-249: MongoDB-backed,
  finite-key, non-personalized, and not coupled to Shopify.
- Keep search, shop, artwork detail, collection-scoped detail, public APIs,
  browser follow-up fetches, saved-item/session state, route-level ISR, static
  params, cache tags, and mutation revalidation out of this runtime proof.

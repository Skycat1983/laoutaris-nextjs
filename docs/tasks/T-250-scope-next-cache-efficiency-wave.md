# T-250 Scope Next Cache Efficiency Wave

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide the next safe A-022/F-111/R-012 cache-efficiency slice after T-249
proved the fixed default `/artwork` browse list cache, without making runtime
changes.

## Context

- T-233 proved cached biography article/navigation reads plus `/biography`
  redirect ISR.
- T-238 proved cached collections navigation plus `/collections` redirect ISR.
- T-239 made `/sitemap.xml` own one-hour ISR freshness.
- T-241 through T-247 completed the staged blog cache proof sequence.
- T-248 selected the default `/artwork` browse list as the next safe public
  cache target.
- T-249 completed that default `/artwork` browse cache proof while keeping
  filtered artwork variants, artwork detail, public artwork APIs, search, shop,
  session state, Shopify product-link reads, cache tags, mutation revalidation,
  generated params, and route-level artwork ISR out of scope.

## Scope

In scope:

- Review source, tests, and docs for the next candidate targets:
  - artwork detail metadata/JSON-LD or primary-detail read splitting
  - collection-scoped artwork detail read splitting
  - additional bounded artwork browse variants
  - public search caching or explicit rejection of search caching
  - shop listing/detail cache policy or explicit rejection of commerce caching
  - pausing F-111 route-cache work for a separately scoped F-115
    provider/client-island task
- Compare candidates by impact, current route cache policy, data freshness,
  personalization risk, query/key cardinality, Shopify/external-service
  coupling, cache invalidation needs, testability, and blast radius.
- Identify whether any candidate is safe enough for a next runtime proof.
- If a runtime proof is selected, define the included reads, excluded reads,
  stale window, cache key or route policy shape, direct/dynamic fallbacks, and
  focused tests.
- Prepare exactly one follow-up task brief if a safe implementation boundary is
  clear.
- Update this task brief with the decision, rejected candidates, and next
  assignment pointer.

Out of scope:

- Do not edit runtime source, tests, route segment config, cache wrappers,
  query parsers, data services, providers, package files, or Playwright setup.
- Do not add `unstable_cache`, route-level ISR, `generateStaticParams()`,
  cache tags, `revalidatePath()`, `revalidateTag()`, provider moves, Shopify
  fetch changes, public API caching, or mutation revalidation in this task.
- Do not cache user/session state, saved-item ownership, admin/account routes,
  comments, public browser follow-up fetches, arbitrary search terms, checkout
  or cart behavior, or mutation responses.
- Do not broaden `/artwork` browse caching beyond T-249 unless this scoping
  pass creates a separate bounded follow-up task.

## Concurrency

Run after T-249. Do not run in parallel with public artwork browse/detail,
public search, shop routes, cached service wrappers, provider/client-island,
route-cache policy, saved-item action, Shopify product-link, or related test
runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally one new follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if the selected next action
  changes

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass compares artwork detail, collection-scoped artwork detail,
  additional artwork browse variants, public search, shop listing/detail, and
  pausing F-111 work for F-115 provider/client-island work.
- The decision identifies one recommended next assignment or explicitly says to
  pause implementation.
- Any selected implementation plan defines route family, included reads,
  excluded reads, stale window, cache key or route policy shape, direct/dynamic
  fallbacks, and required tests.
- The decision explicitly addresses saved-item/session personalization,
  Shopify freshness, query-cardinality risk, and mutation revalidation where
  relevant.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source/test reads, `rg` searches, and current architecture
documentation. Run `npm run build` only if fresh route-output evidence is
needed to make the decision.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Related finding: F-115 if the decision is to pause route-cache work for a
  provider/client-island follow-up.
- Depends on: T-249.
- This task is intentionally docs-only because the remaining F-111 targets have
  higher personalization, query-cardinality, or commerce-freshness risk than
  the completed default browse/list proofs.

## Source And Test Review

- `/artwork` remains `dynamic = "force-dynamic"` and parses page, limit,
  filters, filter mode, sort mode, and `sortColor` through
  `parseArtworkListQuery()` before rendering `ArtworkListLoader`.
- T-249 added `getCachedDefaultArtworkList()` for only the exact default
  server-rendered browse shape: `mostRecent` page 1, limit 10,
  `filterMode: "ALL"`, no taxonomy filters, and no `sortColor`.
- `getArtworkList()` still supports a much broader key space: page 1-1000,
  limit 1-50, multi-select taxonomy filters, `filterMode: "ALL" | "ANY"`,
  `mostRecent`, `mostPopular`, `mostFeatured`, and arbitrary hex
  `colorProximity` sorting.
- Standalone artwork detail metadata and JSON-LD call `getArtworkById(id)`
  without a user ID, but visible detail rendering calls
  `getUserIdFromSession()` and then `getArtworkById(id, userId)` so
  saved-item ownership stays request-time. Detail rendering also resolves
  optional Shopify product links through `getArtworkShopProducts()`.
- Collection-scoped artwork detail metadata, JSON-LD, and visible rendering use
  `getCollectionArtwork(slug, artworkId)`. Visible rendering then resolves
  optional Shopify product links. Collection membership and selected artwork
  status are part of primary route content.
- `/search` remains explicitly dynamic. Query text is length-bounded but
  arbitrary, page can reach 1000, and results span MongoDB-backed articles,
  blogs, collections, artworks, plus Shopify products through
  `getShopProductList()`.
- `/shop/products` and `/shop/products/[productHandle]` remain explicitly
  dynamic. Shop list reads MongoDB artwork product-link state, fans out to
  Shopify by ID, and applies commerce filters. Product detail reads Shopify by
  handle, availability, hosted purchase URL, variant/product metadata, and
  optional MongoDB linked artwork/book artwork context.
- Shopify Storefront `fetch()` already uses `next: { revalidate: 3600 }`
  outside development. A separate non-`fetch` service cache around shop routes
  would need a commerce-specific decision for availability, hosted purchase URL
  fallback, unavailable products, and linked-artwork degradation.
- Existing coverage already proves the relevant boundaries:
  `getCachedArtworkListData.test.ts`, `ArtworkListLoader.test.tsx`,
  `publicRouteCachePolicy.test.ts`, `ArtworkDetailNotFoundContract.test.tsx`,
  `publicArtworkProductMetadataStructuredData.test.tsx`,
  `CollectionArtworkLoader.test.tsx`, `getCollectionArtwork.test.ts`,
  `searchPage.test.tsx`, `getPublicSearchResults.test.ts`,
  `ShopProductsLoader.test.tsx`, `getShopProductList.test.ts`,
  `shopProductDetailPage.test.tsx`, and `shopifyClientTransform.test.ts`.

## Candidate Comparison

| Candidate | Impact | Cache/freshness and key risk | Personalization, mutation, or external coupling | Decision |
| --- | --- | --- | --- | --- |
| Artwork detail metadata/JSON-LD or primary-detail read splitting | Medium. It would reduce repeated primary detail reads for detail pages. | Medium. ObjectId keys are route-shaped and validated, but detail caches would need a clear policy for missing artwork, owner edits, and avoiding accidental use in visible personalized rendering. | Visible standalone detail is session-aware through saved-item state and also resolves optional Shopify product links. Saved-item mutations must not require detail cache revalidation. | Defer. It is plausible, but the visible/detail split is easier to blur than a fixed browse-list expansion. |
| Collection-scoped artwork detail read splitting | Medium. It would reduce repeated collection/artwork membership reads. | Medium-high. Keys include slug plus artwork ID, and cached collection membership could hide recent collection composition edits for detail URLs. | Optional Shopify product-link reads remain dynamic, and collection membership is primary route content rather than only related data. | Defer until standalone detail splitting is proven or a collection-detail freshness policy is accepted. |
| Additional bounded artwork browse variants | Medium. Direct `/artwork?page=2` through `/artwork?page=5` visits are still public archive browsing and reuse the proven T-249 route family. | Low-medium if limited to fixed no-argument wrappers for `mostRecent`, pages 2-5, limit 10, `filterMode: "ALL"`, no taxonomy filters, and no `sortColor`. This avoids arbitrary filter/color/page cardinality. | No selected-branch session state or Shopify reads. Saved-item mutations do not affect `mostRecent` ordering, and owner-controlled artwork edits can tolerate the existing 10-minute stale window. | Select next. Create T-251. |
| Public search caching | Medium. Search can be expensive and now spans five result types. | High. `q` is arbitrary, page/type variants multiply keys, and stale search results are harder to explain. | Shop-product results depend on Shopify freshness through `getShopProductList()`. | Reject for now; keep search request-time. |
| Shop listing/detail caching | Medium. Public commerce pages can repeat reads. | High. Product availability, hosted Shopify URLs, price/variant data, unavailable-product behavior, and MongoDB-linked artwork context are commerce-sensitive. | Shopify already has a one-hour Storefront `fetch()` revalidate policy outside development; layering another service cache needs a commerce decision. | Reject for this wave; keep shop routes dynamic. |
| Pause F-111 for F-115 provider/client-island work | Medium. T-236 reduced drawer bundle cost, but broader provider/modal movement remains useful. | No cache risk, but the next provider move is cross-cutting across session, modal, saved-item, account, and admin behavior. | Provider/client-island work has different blast radius and should have its own focused scoping pass. | Do not pause yet because one lower-risk F-111 browse expansion remains available. |

## Recommendation

Create
[T-251 Pilot bounded artwork browse cache expansion](T-251-pilot-bounded-artwork-browse-cache-expansion.md)
as the next runtime implementation slice.

The selected boundary is intentionally narrow:

- Route family: `/artwork` browse list only.
- Included reads: server-rendered unfiltered `mostRecent` `/artwork` pages 2-5
  with limit 10, `filterMode: "ALL"`, no taxonomy filters, and no
  `sortColor`. Page 1 remains on the T-249 cached wrapper.
- Excluded reads: page 6-plus, non-default limits, all taxonomy-filtered
  variants, `filterMode: "ANY"`, `mostPopular`, `mostFeatured`,
  `colorProximity`, public artwork API routes, public artwork fetchers,
  browser follow-up/load-more fetches, artwork detail routes,
  collection-scoped artwork detail routes, metadata/JSON-LD detail reads,
  Shopify product-link reads, saved-item/session-aware reads, saved-item
  mutations, search, shop routes, and account/admin routes.
- Stale window: 10 minutes, matching the existing MongoDB-backed public cache
  proofs.
- Cache key shape: fixed no-argument wrappers or a fixed dispatcher over pages
  2-5 whose keys encode `public-artwork-default-list-page-{page}-limit-10-
  most-recent`. Do not use an arbitrary parameterized cache.
- Route policy: keep `/artwork` as `dynamic = "force-dynamic"` with no
  route-level `revalidate`, no `generateStaticParams()`, no cache tags, and no
  mutation revalidation.
- Direct/dynamic fallback: any browse shape outside the fixed page 1-5
  unfiltered `mostRecent` limit-10 set must continue to call direct
  `getArtworkList()`.
- Required tests: cached wrapper/dispatcher registration for pages 2-5,
  `ArtworkListLoader` cached branch coverage for unfiltered pages 2-5, direct
  fallback coverage for page 6, non-default limit, taxonomy filters,
  `filterMode: "ANY"`, `mostPopular`, `mostFeatured`, and `sortColor`,
  public artwork API/fetcher/detail exclusion, and `publicRouteCachePolicy`
  invariants that `/artwork` remains route-dynamic.

This advances F-111 without introducing arbitrary query-term caches, commerce
freshness coupling, per-detail saved-item personalization risk, cache tags, or
mutation revalidation.

## Rejected Or Deferred Work

- Artwork detail caching should wait for a task that explicitly separates
  cacheable primary metadata/structured-data reads from visible detail
  rendering that reads saved-item state and optional Shopify product links.
- Collection-scoped artwork detail caching should wait because collection
  membership is primary content and needs a separate freshness decision.
- Broader artwork browse caching remains deferred. Filtered variants,
  `colorProximity`, page 6-plus, non-default limits, `mostPopular`, and
  `mostFeatured` have higher key-cardinality or mutation-sensitivity than the
  selected fixed `mostRecent` page expansion.
- Search should remain request-time because arbitrary terms, type filters,
  page variants, and mixed MongoDB/Shopify freshness make stale behavior hard
  to explain.
- Shop listing/detail caching should wait for a commerce cache policy that
  addresses Shopify's existing Storefront fetch revalidate, availability,
  hosted purchase URL fallback, unavailable products, prices/variants, and
  linked artwork degradation.
- F-115 provider/client-island work remains valuable, but it should be scoped
  separately after the available low-risk F-111 browse expansion.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source, tests, route segment config, cache wrappers, query
  parsers, provider code, package files, or Playwright setup were changed.
- Created T-251 for the selected bounded `/artwork` browse cache expansion.
- Updated the task index and relevant workstream next-agent-action sections to
  route the next F-111 runtime work through T-251.
- Verification passed: `git diff --check`.

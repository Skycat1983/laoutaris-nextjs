# T-248 Scope Next Public Cache Target

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide the next safe A-022/F-111/R-012 public route-family cache or ISR target
after the completed biography, collections, sitemap, and blog cache proofs,
without making runtime changes.

## Context

- T-233 proved the biography cached-service and default redirect ISR pattern.
- T-238 proved the collections default redirect and route-local navigation
  cache pattern.
- T-239 made `/sitemap.xml` own one-hour ISR freshness.
- T-241 through T-247 completed the blog cache proof sequence for primary blog
  detail, default grouped list reads, sorted page 1 reads, and bounded
  `latest`/`oldest`/`featured` pages 2-5.
- Remaining F-111 surfaces include public artwork browse/detail, public search,
  shop product listing/detail, dynamic metadata reads, and possible later
  static params/cache-tag policies.
- F-115 provider/modal ownership remains separate and should be compared only
  as a possible reason to pause F-111 route-cache work, not implemented here.

## Scope

In scope:

- Review source, tests, and docs for these candidate next targets:
  - `/artwork` browse list and artwork detail metadata/detail reads
  - `/search` public search results, including artwork and Shopify product
    result paths
  - `/shop/products` product list and `/shop/products/[productHandle]` product
    detail metadata/detail reads
  - a pause on F-111 route-cache work in favor of a separately scoped F-115
    provider/client-island task
- Compare candidates by public impact, current route cache policy, data
  freshness, query cardinality, external service coupling, mutation
  revalidation requirements, cache key shape, testability, and blast radius.
- Identify which reads are stable enough for short-stale cached non-`fetch`
  wrappers and which must remain direct/request-time.
- Decide whether the next runtime task should use fixed no-argument cached
  wrappers, bounded dispatcher wrappers, route-level `revalidate`,
  `generateStaticParams()`, cache tags/revalidation, or no runtime cache change
  yet.
- Prepare exactly one follow-up task brief if a safe next implementation slice
  is clear.
- Update this task brief with the decision, rejected candidates, and next
  assignment pointer.

Out of scope:

- Do not edit runtime source, tests, route segment config, cache wrappers,
  query parsers, data services, providers, or package files.
- Do not add `unstable_cache`, route-level ISR, `generateStaticParams()`,
  cache tags, `revalidatePath()`, `revalidateTag()`, provider moves, Shopify
  fetch changes, admin/account cache behavior, or public API caching in this
  task.
- Do not cache user/session state, admin/account routes, comments, public
  browser follow-up fetches, or mutation responses.
- Do not resume blog cache expansion unless a new, explicitly bounded task is
  created after this scoping pass.

## Concurrency

Run after T-247. Do not run in parallel with public artwork, public search,
shop product list/detail, cached service wrapper, route-cache policy, provider,
or related test runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally one new follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if the selected next action
  changes

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass compares `/artwork`, `/search`, `/shop/products`, product
  detail, and pausing route-cache work for F-115 provider/client-island work.
- The decision identifies one recommended next assignment or explicitly says to
  pause implementation.
- Any selected implementation plan defines route family, included reads,
  excluded reads, stale window, cache key or route policy shape, direct/dynamic
  fallbacks, and required tests.
- The decision explicitly addresses Shopify/external-service freshness and
  query-cardinality risk where relevant.
- The plan keeps account/admin routes, user/session state, browser follow-up
  fetches, public APIs, comments, cache tags, and mutation revalidation out of
  scope unless a later task separately justifies them.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted `rg`, source reads, existing test reads, and build-output evidence
already recorded in task handoffs where possible. Run `npm run build` only if
fresh route-output evidence is needed to make the decision.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Related finding: F-115 if the decision is to pause route-cache work for a
  provider/client-island follow-up.
- Depends on: T-247.
- This task is intentionally docs-only because `/artwork`, `/search`, and shop
  routes have higher query-cardinality and freshness risk than the completed
  biography, collections, sitemap, and blog proofs.

## Source And Test Review

- `/artwork` remains `dynamic = "force-dynamic"` and parses query params with
  `parseArtworkListQuery()` before rendering `ArtworkListLoader`.
  `ArtworkListLoader` calls `getArtworkList()` directly with page, limit,
  filter, sort, and color options. The public artwork API and browser follow-up
  fetchers also remain direct.
- `getArtworkList()` is MongoDB-backed, defaults to `sortBy: "mostRecent"`,
  `page: 1`, `limit: 10`, and no filters, and supports high-cardinality
  variants through finite page/limit bounds, multi-select taxonomy filters,
  `mostPopular`, `mostFeatured`, and arbitrary hex `colorProximity`.
- `/artwork/[artworkId]` and `/collections/[slug]/[artworkId]` remain
  explicitly dynamic. Metadata and JSON-LD read primary artwork data without a
  user ID, but visible detail rendering calls `getUserIdFromSession()` and then
  `getArtworkById(id, userId)` so saved-item personalization stays
  request-time. Standalone artwork detail also resolves optional Shopify product
  links through `getArtworkShopProducts()` and degrades failures.
- `/search` remains explicitly dynamic and query-driven. Search inputs are
  bounded for length, page, and limit, but `q` itself is arbitrary. Search now
  spans MongoDB-backed articles, blogs, collections, artworks, and Shopify
  products; shop-product search calls `getShopProductList()` then filters
  products in memory.
- `/shop/products` and `/shop/products/[productHandle]` remain explicitly
  dynamic. The shop list derives candidate product IDs from MongoDB artwork
  links and fans out to Shopify by ID. Product detail reads Shopify by handle,
  resolves hosted purchase URL/availability, and optionally resolves linked
  MongoDB artwork context.
- Shopify Storefront `fetch()` calls already use `next: { revalidate: 3600 }`
  outside development, but route rendering and MongoDB link discovery remain
  request-time. Adding another non-`fetch` wrapper around shop routes would need
  a commerce-specific freshness decision for availability, hosted product URLs,
  unavailable products, and linked artwork fallback.
- Existing tests cover the relevant seams:
  `ArtworkListLoader.test.tsx`, `getArtworkList.test.ts`,
  `ArtworkPage.test.tsx`, `ArtworkDetailNotFoundContract.test.tsx`,
  `getArtworkById.test.ts`, `getArtworkShopProducts.test.ts`,
  `searchPage.test.tsx`, `getPublicSearchResults.test.ts`,
  `getShopProductList.test.ts`, `ShopProductsLoader.test.tsx`,
  `shopProductDetailPage.test.tsx`, `shopifyClientTransform.test.ts`, and
  `publicRouteCachePolicy.test.ts`.

## Candidate Comparison

| Candidate | Public impact | Cache key/freshness risk | External/session coupling | Testability | Decision |
| --- | --- | --- | --- | --- | --- |
| Cache default `/artwork` browse list page 1 only | High. The archive browse entry point is a primary public route, and its default first page is likely repeated. | Low-medium if restricted to a fixed no-argument wrapper for `mostRecent`, page 1, limit 10, no filters, no color sort. Owner-controlled artwork creates/updates can tolerate the same 10-minute stale window used by the other MongoDB public proofs. | Low for the selected branch. The browse loader does not pass user/session state, and the default list does not call Shopify. | Strong. Existing service/loader/page policy tests can be extended and a cached-wrapper test can mirror the blog and biography proofs. | Select next. Create T-249. |
| Cache broader `/artwork` browse variants | Medium-high. It would cover filtered archive browsing. | High. Filter combinations, page values up to 1000, limit values up to 50, `mostPopular`, `mostFeatured`, and arbitrary `sortColor` create a large key space; `mostPopular` can shift with saved-item mutations. | Mostly MongoDB-backed, but favorite-derived ordering is user-mutation-sensitive. | Good, but the policy would need a larger dispatcher and more source invariants. | Reject for now. Start with the default list only. |
| Cache artwork detail metadata/JSON-LD or primary detail reads | Medium. Detail metadata and structured data duplicate primary reads. | Medium. ObjectId keys are stable, but catalog coverage and not-found behavior need a detail-specific policy. | Visible standalone detail rendering is session-aware through saved-item state, and optional Shopify product links are resolved for the page body. Collection-scoped detail also depends on collection membership semantics. | Good, but the split between cacheable metadata/JSON-LD and direct visible detail rendering is easy to blur. | Defer. Keep detail pages dynamic until a separate task splits public primary data from personalized/Shopify-related reads. |
| Cache `/search` route or service reads | Medium. Search can be expensive and now spans more content types. | High. `q` is arbitrary, `type` and page variants multiply keys, and stale search results are harder for users to reason about. | High. Shop-product search depends on the shop product-list path and Shopify product freshness. | Good for parser/page behavior, but cache policy would be complex. | Reject. Search should remain request-time. |
| Cache `/shop/products` list reads | Medium. The shop listing is public and repeated. | Medium-high. Filter combinations are finite, but product availability, hosted purchase URLs, and unavailable-product handling are commerce-sensitive. | High. MongoDB product-link discovery fans out to Shopify, whose `fetch()` already has a one-hour production revalidate policy. | Good for service/loader tests, but commerce freshness needs a dedicated decision. | Defer. Do not layer service caching over Shopify list behavior yet. |
| Cache `/shop/products/[productHandle]` detail reads | Medium. Product detail reads hit Shopify by handle and metadata/JSON-LD repeats that read. | High. Product availability, price, hosted URL fallback, variant data, not-found behavior, and linked-artwork degradation are commerce-sensitive. | High. Detail combines Shopify primary content with optional MongoDB archive context. | Good, but blast radius is commerce-facing. | Defer until a commerce cache policy is accepted. |
| Pause F-111 and resume F-115 provider/client-island work | Medium. T-236 reduced root layout chunk size but first-load route totals stayed flat. | Low cache risk because no route cache changes would be made. | Medium. Root provider/modal moves remain cross-cutting across auth, modals, saved items, forms, account, and admin behavior. | Good with build evidence and client-boundary tests, but the next provider move needs its own scoping pass. | Do not pause yet. A narrower F-111 artwork default-list proof is available. |

## Recommendation

Create [T-249 Pilot default artwork browse cache proof](T-249-pilot-default-artwork-browse-cache-proof.md)
as the next runtime implementation slice.

The selected plan is intentionally narrow:

- Route family: `/artwork` browse list only.
- Included read: the server-rendered default browse list for `sortBy:
  "mostRecent"`, page 1, limit 10, `filterMode: "ALL"`, no taxonomy filters,
  and no `sortColor`.
- Excluded reads: `/artwork` filtered variants, page 2-plus, non-default
  limits, `mostPopular`, `mostFeatured`, `colorProximity`, public artwork API
  routes, browser follow-up fetches, artwork detail routes, collection-scoped
  artwork routes, metadata/JSON-LD detail reads, Shopify product-link reads,
  account/admin routes, user/session state, and saved-item mutations.
- Stale window: 10 minutes, matching the existing MongoDB public cache proofs.
- Cache key shape: one fixed no-argument cached wrapper with a key that encodes
  the route shape, for example
  `public-artwork-default-list-page-1-limit-10-most-recent`.
- Route policy: keep `/artwork` as `dynamic = "force-dynamic"` with no
  route-level `revalidate`, no `generateStaticParams()`, no cache tags, and no
  mutation revalidation.
- Required tests: cached wrapper registration, `ArtworkListLoader` default
  cached branch versus direct non-default branches, public artwork API/direct
  fetcher exclusion, and `publicRouteCachePolicy` invariants.

This choice advances F-111 without taking on search's arbitrary query
cardinality or shop/product detail commerce freshness. It also avoids detail
page personalization risk by leaving saved-item/session-aware artwork detail
rendering direct.

## Rejected Or Deferred Work

- Broader artwork browse caching should wait until there is evidence that
  filtered or deep archive pages are hot enough to justify fixed bounded
  dispatchers. `colorProximity` should not enter cache keys in the next slice
  because arbitrary hex values create unbounded practical cardinality.
- Artwork detail caching should wait for a task that splits cacheable primary
  metadata/structured-data reads from visible detail rendering that depends on
  saved-item state and optional Shopify product links.
- Search should remain request-time because arbitrary terms, pagination, and
  mixed MongoDB/Shopify result freshness make cache behavior hard to explain.
- Shop listing/detail caching should wait for a commerce-specific policy that
  addresses Shopify's existing one-hour Storefront fetch revalidate,
  availability, hosted purchase URL fallback, unavailable products, and linked
  artwork degradation.
- F-115 provider/client-island work remains valuable, but the next provider
  move after T-236 is cross-cutting enough to deserve separate scoping instead
  of pausing the available low-risk F-111 default artwork list proof.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source files were changed.
- Created T-249 for the selected default `/artwork` browse cache proof.
- Updated task and workstream next-agent-action pointers to route the next
  F-111 implementation through T-249.
- Verification passed: `git diff --check`.

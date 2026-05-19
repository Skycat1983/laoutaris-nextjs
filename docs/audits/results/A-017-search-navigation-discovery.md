# A-017 Search, Navigation, And Content Discovery Result

Status: Completed

Audit goal: [A-017 Search, navigation, and content discovery](../goals.md#a-017-search-navigation-and-content-discovery)

Workstream: [Frontend routes and components](../../workstreams/frontend-routes-and-components.md)

## Summary

The app has a solid public discovery base: top-level navigation reaches artwork,
biography, collections, blog, project, and shop; home sections link into
collections, biography, and blog; collection and biography subnavs are loaded
server-side; detail pages now emit breadcrumb structured data; the sitemap
includes stable and dynamic public detail routes; and artwork/product detail
pages have server-rendered related-commerce links.

The remaining production discovery gaps are concentrated around reliability and
scope. Global search is labelled as general site search, but it only searches
articles, blogs, and collections, not artworks or shop products. Search results
also have no visible no-results state or pagination controls. Some browsable
routes still parse URL filters differently from their API contracts. Blog sorted
views compute pagination links but do not render them, and their infinite loader
drops the active sort. The visible breadcrumb UI is path-segment based rather
than content-aware, even though JSON-LD breadcrumbs are content-aware.

## Scope Inspected

- Required docs: `AGENTS.md`, `docs/README.md`,
  `docs/audits/goals.md#a-017-search-navigation-and-content-discovery`,
  `docs/audits/README.md`, `docs/audits/results/README.md`,
  `docs/workstreams/frontend-routes-and-components.md`, and
  `docs/architecture/routes-and-api.md`.
- Public search: `src/components/elements/inputs/Searchbar.tsx`,
  `src/components/modules/search/SearchDrawer.tsx`,
  `src/app/search/page.tsx`,
  `src/components/modules/search/SearchResultsSection.tsx`,
  `src/app/api/v2/public/search/route.ts`,
  `src/lib/data/schemas/searchSchema.ts`,
  `src/lib/data/services/getPublicSearchResults.ts`,
  `src/lib/data/types/searchTypes.ts`, and search route/page/service tests.
- Main navigation and subnavigation:
  `src/components/loaders/componentLoaders/MainNavLoader.tsx`,
  `src/components/modules/navigation/mainNav/*`,
  `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`,
  `src/components/loaders/componentLoaders/BiographySubnavLoader.tsx`,
  `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx`,
  `src/components/modules/navigation/subnav/Subnav.tsx`,
  `src/app/biography/layout.tsx`, `src/app/collections/layout.tsx`, and
  related loader tests.
- Breadcrumbs and metadata discovery:
  `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx`,
  `src/components/metadata/PublicDetailJsonLd.tsx`,
  `src/lib/metadata/publicDetailMetadata.ts`,
  `src/app/sitemap.ts`, `src/lib/metadata/publicDynamicSitemap.ts`, and
  metadata/sitemap tests.
- Artwork and collection discovery:
  `src/app/artwork/page.tsx`, `src/components/loaders/viewLoaders/ArtworkListLoader.tsx`,
  `src/components/artwork/ArtworkGallery.tsx`,
  `src/components/artwork/filters/ArtworkSortAndFilter.tsx`,
  `src/lib/data/schemas/artworkListQuerySchema.ts`,
  `src/lib/data/services/getArtworkList.ts`,
  `src/app/api/v2/public/artwork/route.ts`,
  `src/app/collections/page.tsx`,
  `src/app/collections/[slug]/page.tsx`,
  `src/app/collections/[slug]/[artworkId]/page.tsx`,
  `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`,
  and `src/components/modules/pagination/ScrollableArtworkPagination.tsx`.
- Biography and blog discovery:
  `src/app/biography/page.tsx`, `src/app/biography/[slug]/page.tsx`,
  `src/components/loaders/viewLoaders/ArticleLoader.tsx`,
  `src/app/blog/page.tsx`, `src/components/loaders/viewLoaders/BlogListLoader.tsx`,
  `src/components/views/BlogListView.tsx`,
  `src/components/sections/BlogSectionContinuous.tsx`,
  `src/lib/data/services/getBlogList.ts`, and
  `src/app/api/v2/public/blog/route.ts`.
- Shop/product discovery:
  `src/app/shop/page.tsx`, `src/app/shop/products/page.tsx`,
  `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`,
  `src/components/compositions/ShopProductGallery.tsx`,
  `src/components/modules/filters/ShopFilters.tsx`,
  `src/app/shop/products/[productHandle]/page.tsx`,
  `src/components/modules/cards/ProductCard.tsx`,
  `src/components/modules/cards/ArtworkShopSection.tsx`,
  `src/lib/data/schemas/shopProductListQuerySchema.ts`, and
  `src/lib/data/services/getShopProductList.ts`.
- Home discovery surfaces:
  `src/components/views/Home.tsx`, `src/components/sections/CollectionSection.tsx`,
  `src/components/sections/BiographySection.tsx`,
  `src/components/sections/BlogSectionSplitScreen.tsx`, and
  `src/components/sections/BlogsSectionFeatured.tsx`.
- Existing relevant tests under `__tests__/unit`.

## Commands Run

- `git status --short`: showed many pre-existing dirty source, test, and docs
  files from other workstreams. This audit kept edits scoped to
  `docs/audits/results/A-017-search-navigation-discovery.md`.
- `sed -n` reads for required docs, the A-017 result file, frontend workstream,
  and routes/API architecture.
- `rg -n "A-017|Search Navigation|content discovery|search" docs/audits/goals.md docs/audits/results docs/workstreams docs/architecture docs/runbooks docs/risks docs/orchestration/state.md`:
  found the A-017 goal, current result file, workstream links, and R-016.
- `rg --files src/app src/components src/lib __tests__ | rg 'search|navigation|nav|breadcrumb|artwork|collection|blog|article|shop|product|sitemap|metadata|loader|filter'`:
  inventoried relevant discovery files.
- `rg -n "breadcrumb|Breadcrumb|related|Related|previous|next|Previous|Next|Subnav|MainNav|search|Search|filter|sort|pagination|href=|generateMetadata|sitemap|robots" src/app src/components src/lib __tests__`:
  located navigation, breadcrumb, related-content, and discovery surfaces.
- `rg -n "Breadcrumbs|breadcrumb|components/shadcn/breadcrumb|PublicDetailJsonLd|BreadcrumbJsonLd" src __tests__`:
  compared visible breadcrumb usage with structured-data breadcrumb coverage.
- `rg -n "Searchbar|SearchDrawer|Open search|Submit search|Search Results|No results|SEARCH_CONTENT_TYPES|artwork|products" __tests__/unit src/components/modules/search src/components/elements/inputs src/lib/data/schemas/searchSchema.ts`:
  checked search UI/tests and confirmed unsupported artwork/product search
  types.
- `rg -n "artwork.*query|parseArtworkListQuery|ArtworkList|No artworks|loadMore|filter" __tests__/unit __tests__/integration`:
  located artwork filter, API, service, and test coverage.
- `rg -n "BlogListView|BlogsViewPagination|blog page|sortby|BlogSectionContinuous" __tests__/unit`:
  located blog sort/pagination coverage and missing view-level pagination
  coverage.
- Targeted `nl -ba ... | sed -n ...` reads on files listed in Scope Inspected
  for line-level evidence.
- No runtime tests were run because this task only updates an audit report and
  does not change application behavior.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Global public search does not search artworks or shop products even though those are core discovery goals. | `SEARCH_CONTENT_TYPES` only allows `articles`, `blogs`, and `collections` (`src/lib/data/schemas/searchSchema.ts:4-8`). The search service imports and queries `ArticleModel`, `BlogModel`, and `CollectionModel`, then returns only `articles`, `blogs`, and `collections` (`src/lib/data/services/getPublicSearchResults.ts:3-5`, `src/lib/data/services/getPublicSearchResults.ts:103-130`). The API test explicitly treats `type=artwork` as unsupported (`__tests__/unit/api/publicSearchRoute.test.ts:105-123`). Shop products are discoverable through `/shop/products`, but not through `/search`. | Decide whether `/search` is a true site-wide search. If yes, extend the schema, service, result types, result rendering, and tests to cover artworks and shop products. If not, rename/copy the UI so users know it searches only articles, blogs, and collections, and provide clear links to artwork/shop discovery. |
| Medium | Search results lack an explicit no-results state and expose page/limit parameters without UI pagination or response metadata. | The search page renders sections only when each returned array has length (`src/app/search/page.tsx:107-127`), and `SearchResultsSection` returns `null` for empty `items` (`src/components/modules/search/SearchResultsSection.tsx:19`). The schema accepts `page` and `limit` (`src/lib/data/schemas/searchSchema.ts:71-80`) and the service applies `skip`/`limit` (`src/lib/data/services/getPublicSearchResults.ts:98-110`), but the service returns only `success` and `data` with no metadata (`src/lib/data/services/getPublicSearchResults.ts:133-136`) and the page renders no previous/next controls. | Add a visible empty state for valid zero-result searches. Either remove public pagination params from search until they are surfaced, or return per-type metadata and render pagination controls for filtered and all-type search. |
| Medium | The `/artwork` server-rendered browse page bypasses the shared artwork query schema and disagrees with API defaults. | The page directly parses and casts route `searchParams`, including `parseInt(searchParams.page || "1")` and `searchParams.sortBy as SortOption`, before passing values to the server loader (`src/app/artwork/page.tsx:18-53`). The API route validates the same query through `parseArtworkListQuery` before service work (`src/app/api/v2/public/artwork/route.ts:39-46`). The page default sort is `colorProximity` with a blue color (`src/app/artwork/page.tsx:20-23`), while the shared schema defaults `sortBy` to `mostRecent` (`src/lib/data/schemas/artworkListQuerySchema.ts:78-82`). | Make the `/artwork` page use `parseArtworkListQuery` or a shared route/page adapter so SSR, client fetches, and API requests accept the same filter values, bounds, defaults, and error/empty semantics. |
| Medium | Blog sorted discovery pages compute pagination links but do not render them, and infinite loading drops the active sort. | `BlogListLoader` computes `prev` and `next` links and passes them to `BlogListView` (`src/components/loaders/viewLoaders/BlogListLoader.tsx:95-105`). In the sorted-list branch, `BlogListView` renders only `BlogSectionContinuous` and ignores `next`/`prev` (`src/components/views/BlogListView.tsx:20-27`). `BlogSectionContinuous` loads more pages through `clientApi.public.blog.multiple({ page, limit })` without forwarding the active `sortby`, so a `/blog?sortby=featured` view can append default latest entries (`src/components/sections/BlogSectionContinuous.tsx:23-40`). | Pass the active `sortby` and current page into `BlogSectionContinuous`, or render `BlogsViewPagination` for sorted pages. Add a test that starts from each sorted blog view and verifies follow-up loading/pagination preserves the selected sort. |
| Medium | Main navigation fails closed when biography or collection navigation data is unavailable. | `MainNavLoader` builds the top nav from the first biography article and first collection (`src/components/loaders/componentLoaders/MainNavLoader.tsx:22-57`). If either service returns `null`, it throws and the catch path logs but returns `undefined`, so no `MainNav` renders (`src/components/loaders/componentLoaders/MainNavLoader.tsx:27-33`, `src/components/loaders/componentLoaders/MainNavLoader.tsx:61-67`). The current test preserves this behavior by expecting `MainNav` not to be called when article navigation is empty (`__tests__/unit/loaders/MainNavLoader.test.tsx:133-150`). | Render stable fallback links for durable route roots such as `/artwork`, `/biography`, `/collections`, `/blog`, `/project/about`, and `/shop/products` when dynamic nav data is missing, then enhance biography/collection targets when data is present. |
| Medium | Visible breadcrumbs are mechanical path segments, while content-aware breadcrumbs exist only as JSON-LD. | The header renders `Breadcrumbs` globally (`src/components/modules/navigation/header/Header.tsx:17-23`). The visible breadcrumb component maps URL segments directly, displays any 24-character hex segment as `artworkId`, and only adds `sortby` from query params (`src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx:33-79`). Structured data tests prove detail pages can build named breadcrumb lists for article, blog, artwork, collection artwork, and product pages (`__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx:184-277`), but those labels are not used in the visible UI. | Reuse route/detail metadata or lightweight label resolvers so visible breadcrumbs show human-readable artwork, collection, article, blog, and product labels. Keep JSON-LD coverage, but do not rely on it as the only content-aware breadcrumb path for users. |
| Low | Shop product sorting is client-only and not deep-linkable, while the API schema accepts a `sortBy` parameter that the service does not use. | `ShopResultsBar` exposes sort options (`src/components/modules/filters/ShopResultsBar.tsx:34-47`) and `ShopProductGallery` sorts the current client array in memory (`src/components/compositions/ShopProductGallery.tsx:55-77`). Filter changes build URL/API params for filters and product-type booleans, but not `sortBy` (`src/components/compositions/ShopProductGallery.tsx:90-115`). The product-list schema accepts `sortBy` (`src/lib/data/schemas/shopProductListQuerySchema.ts:45-56`), but `getShopProductList` params do not include sorting and return products in service fan-out order (`src/lib/data/services/getShopProductList.ts:30-38`, `src/lib/data/services/getShopProductList.ts:112-144`). | Either make shop sorting intentionally local-only and remove route/API `sortBy`, or persist sort in URL and apply the same ordering in SSR/API output so filtered shop states are shareable and crawlable. |

## Findings Register Updates

Shared trackers are orchestrator-owned in concurrent audit mode, so this audit
does not edit `docs/audits/findings-register.md` directly.

Candidate findings for reconciliation:

| Source | Severity | Suggested finding | Evidence | Suggested routing |
| --- | --- | --- | --- | --- |
| A-017 | High | Public search excludes artworks and shop products. | `src/lib/data/schemas/searchSchema.ts:4-8`; `src/lib/data/services/getPublicSearchResults.ts:3-5`; `__tests__/unit/api/publicSearchRoute.test.ts:105-123`. | Frontend routes/components; Data/API; R-016. |
| A-017 | Medium | Search needs zero-result and pagination semantics. | `src/app/search/page.tsx:107-127`; `src/components/modules/search/SearchResultsSection.tsx:19`; `src/lib/data/services/getPublicSearchResults.ts:98-136`. | Frontend routes/components; Data/API; R-005/R-016. |
| A-017 | Medium | `/artwork` page query parsing diverges from the validated public artwork API. | `src/app/artwork/page.tsx:18-53`; `src/app/api/v2/public/artwork/route.ts:39-46`; `src/lib/data/schemas/artworkListQuerySchema.ts:78-82`. | Frontend routes/components; Data/API; R-006/R-016. |
| A-017 | Medium | Sorted blog pagination/infinite loading does not preserve sort. | `src/components/loaders/viewLoaders/BlogListLoader.tsx:95-105`; `src/components/views/BlogListView.tsx:20-27`; `src/components/sections/BlogSectionContinuous.tsx:23-40`. | Frontend routes/components; Testing/quality; R-005/R-016. |
| A-017 | Medium | Main navigation disappears when dynamic biography or collection nav data is missing. | `src/components/loaders/componentLoaders/MainNavLoader.tsx:22-67`; `__tests__/unit/loaders/MainNavLoader.test.tsx:133-150`. | Frontend routes/components; R-016. |
| A-017 | Medium | Visible breadcrumbs are URL-segment based and not content-aware. | `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx:33-79`; `__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx:184-277`. | Frontend routes/components; R-016. |
| A-017 | Low | Shop sorting is client-only despite accepted route/API sort params. | `src/components/modules/filters/ShopResultsBar.tsx:34-47`; `src/components/compositions/ShopProductGallery.tsx:55-115`; `src/lib/data/schemas/shopProductListQuerySchema.ts:45-56`; `src/lib/data/services/getShopProductList.ts:30-144`. | Frontend routes/components; Shopify commerce; Data/API. |

## Risks Updated

None directly. Candidate risk updates for reconciliation:

- Update R-016 from "Search, navigation, taxonomy, and content discovery are not
  yet audited as a full user journey" to confirmed A-017 gaps around search
  scope, search empty/pagination states, artwork/blog/shop query-state
  consistency, dynamic main-nav fallback behavior, and visible breadcrumb labels.
- Cross-link R-005 for the missing tests around sorted blog follow-up loading,
  visible breadcrumb labels, and full-search scope.
- Cross-link R-006 for route/page/API query parsing drift on artwork and shop
  discovery states.

## Workstream Updates

None directly. Candidate workstream updates for reconciliation:

- Audit tracker updates: mark A-017 as `Completed` in
  `docs/audits/goals.md` and `docs/audits/results/README.md` when the
  orchestrator reconciles this result.
- Frontend routes/components backlog: extend or relabel public search; add
  zero-result search UI; preserve blog sort through pagination/infinite load;
  add resilient main-nav fallbacks; make visible breadcrumbs content-aware.
- Data/API backlog: align public search metadata/pagination semantics and
  reconcile page/API query parsing for artwork and shop browse states.
- Shopify commerce backlog: decide whether shop sorting is local-only or
  durable/deep-linkable before expanding product discovery controls.
- Testing/quality backlog: add focused tests for search no-results/pagination,
  sorted blog load-more behavior, resilient main-nav fallback rendering, and
  visible breadcrumb label behavior.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read canonical instructions and docs before audit. | Read `AGENTS.md` instructions from the prompt, `docs/README.md`, `docs/audits/README.md`, A-017 goal, frontend workstream, and routes/API architecture. | Complete |
| Audit whether users can find artworks. | Inspected `/artwork` page, artwork loader/gallery/filter UI, artwork API/schema/service/tests, artwork detail, collection artwork detail, sitemap entries, and artwork-to-shop related links. Findings cover global search omission and `/artwork` query drift. | Complete |
| Audit whether users can find collections. | Inspected collections redirects, collection subnav, collection cards, collection artwork pagination, collection search results, sitemap entries, and structured breadcrumbs. | Complete |
| Audit whether users can find blog content. | Inspected blog page, blog loader/view, sorted sections, blog infinite loading, blog API/service/tests, home blog sections, search results, sitemap entries, and structured breadcrumbs. Finding covers sorted pagination/load-more drift. | Complete |
| Audit whether users can find biography pages. | Inspected biography redirect, biography subnav, article loader previous/next navigation, search results, home biography section, sitemap entries, and structured breadcrumbs. | Complete |
| Audit whether users can find shop products. | Inspected shop redirect/listing/product detail, shop loader/gallery/filters/sort UI, shop API/schema/service/tests, product cards, artwork shop section, product-to-artwork links, and product sitemap entries. Findings cover global search omission and local-only sort state. | Complete |
| Audit search behavior. | Inspected search UI, drawer, page, result section, API, schema, service, types, and tests. Findings cover scope, empty state, and pagination metadata/UI. | Complete |
| Audit navigation and subnavs. | Inspected header, main nav loader/layouts, mobile drawer, biography and collection subnav loaders, subnav component, and tests. Finding covers fail-closed main nav behavior. | Complete |
| Audit breadcrumbs. | Inspected visible breadcrumb component, JSON-LD breadcrumb builders/renderers, detail pages, and structured-data tests. Finding covers visible label weakness while noting JSON-LD coverage. | Complete |
| Audit filters and browse query states. | Inspected artwork, blog, and shop filters/sorts plus their API schemas/services. Findings cover `/artwork` page/API drift, sorted blog load-more drift, and shop local-only sorting. | Complete |
| Audit related-content paths. | Inspected article previous/next, collection "More from this collection" pagination, artwork-to-product section, product-to-artwork links, and home section links. | Complete |
| Produce expected result file. | This file is the expected output: `docs/audits/results/A-017-search-navigation-discovery.md`. | Complete |
| Preserve shared-file ownership. | Shared findings, risk, workstream, goal, and result-index updates are listed as candidates only. | Complete |
| Note verification. | Audit used source/doc searches and targeted file reads; no runtime tests were run because no app behavior changed. | Complete |

## Next Action

Reconcile the candidate A-017 findings into the findings register and R-016,
then start with the public search scope decision because it affects artworks,
collections, blog, biography, and shop product discovery from the same entry
point.

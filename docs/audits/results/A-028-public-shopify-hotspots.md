# A-028 Public Archive And Shopify Runtime Hotspot Scan

Status: Completed

Audit goal:
[A-028 Public archive and Shopify runtime hotspot scan](../goals.md#a-028-public-archive-and-shopify-runtime-hotspot-scan).

Workstreams:
[Frontend routes and components](../../workstreams/frontend-routes-and-components.md),
[Shopify commerce](../../workstreams/shopify-commerce.md).

## Assignment Summary

Inspect the current public archive, search/browse, shop listing, Shopify product
detail, product enquiry, and product-detail mockup trajectory to identify the
most important owner-facing runtime gaps.

## Summary

A-028 found that the T-261 sale-gallery implementation has landed and is covered
by focused tests, but the next product-detail work should be owner review and
decision scoping rather than more implementation inside T-261. The highest
current runtime hotspots are elsewhere in the public archive/shop path:
deep-linked artwork browse pages do not seed the client gallery with the
server-rendered pagination state, all-type public search now calls the Shopify
product-list fan-out for every query, and shop sorting remains client-only
despite URL/API vocabulary that implies it can be deep-linked.

## Scope Inspected

- Public archive browse/detail source:
  `src/app/artwork/page.tsx`,
  `src/components/loaders/viewLoaders/ArtworkListLoader.tsx`,
  `src/components/artwork/ArtworkGallery.tsx`,
  `src/components/layouts/public/MasonryLayout.tsx`,
  `src/app/artwork/[artworkId]/page.tsx`,
  `src/app/collections/[slug]/page.tsx`,
  `src/app/collections/[slug]/layout.tsx`,
  `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`,
  `src/app/blog/page.tsx`,
  `src/components/loaders/viewLoaders/BlogListLoader.tsx`,
  `src/lib/data/schemas/blogListQuerySchema.ts`.
- Public search source and tests:
  `src/app/search/page.tsx`,
  `src/lib/data/services/getPublicSearchResults.ts`,
  `src/components/modules/search/SearchResultsSection.tsx`,
  `src/app/api/v2/public/search/route.ts`,
  `__tests__/unit/data/getPublicSearchResults.test.ts`.
- Public shop listing source and tests:
  `src/app/shop/products/page.tsx`,
  `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`,
  `src/components/compositions/ShopProductGallery.tsx`,
  `src/components/modules/filters/ShopFilters.tsx`,
  `src/components/modules/filters/ShopResultsBar.tsx`,
  `src/lib/data/schemas/shopProductListQuerySchema.ts`,
  `src/lib/data/services/getShopProductList.ts`,
  `__tests__/unit/shopProductGallerySorting.test.tsx`.
- Product detail, enquiry, and T-261 trajectory:
  `src/app/shop/products/[productHandle]/page.tsx`,
  `src/components/shop/product-detail/ShopProductSaleGallery.tsx`,
  `src/lib/framePreview/productEligibility.ts`,
  `src/lib/framePreview/roomScenes.ts`,
  `src/lib/shop/productClassification.ts`,
  `src/lib/shop/productDisplay.ts`,
  `src/app/project/contact/page.tsx`,
  `src/components/modules/forms/user/ContactForm.tsx`,
  `src/lib/data/schemas/enquirySchema.ts`,
  `__tests__/unit/shopProductDetailPage.test.tsx`,
  `__tests__/unit/forms/contactFormProductContext.test.tsx`.
- Linked docs:
  `docs/workstreams/frontend-routes-and-components.md`,
  `docs/workstreams/shopify-commerce.md`,
  `docs/architecture/shopify-commerce.md`,
  `docs/architecture/rendering-and-data-fetching.md`,
  `docs/risks/production-readiness.md`,
  `docs/tasks/T-261-build-shop-product-sale-gallery-mockup.md`.

## Commands Run

- `git status --short` - showed a dirty concurrent worktree, including this
  untracked A-028 result file and unrelated prototype/nav/test/doc edits.
- `rg --files src/app src/components src/lib __tests__ | rg '(^src/app/(artwork|search|shop|blog|collections)|shop|Shop|Search|Artwork|framePreview|product-detail|public/search|public/shop)'`
  - inventoried public archive/search/shop source and test candidates.
- `find src/app -maxdepth 5 -type f | sort | rg '/(artwork|search|shop|blog|collections|project/contact)'`
  - confirmed the public route files in scope.
- Targeted `sed`, `nl -ba`, and `rg -n` reads of the files listed above.
- `npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkListLoader.test.tsx __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx`
  - passed: 4 suites, 41 tests. Node emitted the existing `punycode`
  deprecation warning.

## Runtime Hotspots

| Priority | Surface | Why it matters | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- |
| P1 | `/artwork` browse deep links and infinite scroll | Direct links such as `/artwork?page=3` can render the correct server page, then the client gallery starts its internal page counter at `1` and `hasMore` at `true`; the next infinite-scroll request can fetch page `2` instead of page `4`, append older results, and keep loading even when the server-rendered page is terminal. | `ArtworkListLoader` destructures only `{ data: artworks }` and passes no metadata to `ArtworkGallery` (`src/components/loaders/viewLoaders/ArtworkListLoader.tsx:51-65`). `ArtworkGallery` initializes `hasMore` to `true` and `page` to `1` regardless of `filterDefaults.page`, then computes `nextPage = page + 1` for load more (`src/components/artwork/ArtworkGallery.tsx:29-32`, `src/components/artwork/ArtworkGallery.tsx:144-155`). Existing loader tests prove cached pages 2-5 are fetched server-side but only assert the artwork array and filter props are passed (`__tests__/unit/loaders/ArtworkListLoader.test.tsx:118-132`). | Pass list metadata from `ArtworkListLoader` into `ArtworkGallery`; initialize `page` and `hasMore` from server metadata; add a focused component test that a page-3 initial render requests page 4 on load more and that a terminal page does not observe again. |
| P1 | All-type `/search` with Shopify products | Search is now broader, but every untyped public search calls `getShopProductList()`, which reads all linked artwork product IDs and fans out to Shopify before filtering products in memory. This makes ordinary archive search latency and failure posture depend on the full shop listing path. | `getPublicSearchResults` searches every type when `type` is absent (`shouldSearch` at `src/lib/data/services/getPublicSearchResults.ts:262-264`) and calls `getShopProductList()` whenever `shop-products` is in that all-type set (`src/lib/data/services/getPublicSearchResults.ts:293-295`). `getShopProductList` reads all matching artwork product links and calls `getProductById` for every unique ID (`src/lib/data/services/getShopProductList.ts:92-130`). The current test intentionally asserts that all-type search includes `shop-products` and calls the full list service (`__tests__/unit/data/getPublicSearchResults.test.ts:485-502`), but there is no degradation or fan-out budget coverage. | Decide whether all-type search should include Shopify products by default. If yes, make the shop search path bounded and query-aware, and degrade shop-product failures without hiding MongoDB-backed results. If no, keep product search behind `type=shop-products` and make the UI copy explicit. |
| P2 | `/shop/products` sorting | The route schema accepts `sortBy`, and the UI offers sort modes, but the server listing service has no sort parameter, the page omits `searchParams.sortBy`, filter fetches do not send sort, and sorting is only local client state. A shared product URL cannot preserve owner-selected sort order. | `shopProductListQuerySchema` validates `sortBy` (`src/lib/data/schemas/shopProductListQuerySchema.ts:45-56`), but `GetShopProductListParams` has only taxonomy/type filters (`src/lib/data/services/getShopProductList.ts:30-38`). The page builds `filters` without `sortBy` (`src/app/shop/products/page.tsx:12-20`). `ShopProductGallery` initializes local `sortBy`, performs `useMemo` client sorting, and fetches filters without adding `sortBy` to query params (`src/components/compositions/ShopProductGallery.tsx:40-42`, `src/components/compositions/ShopProductGallery.tsx:57-85`, `src/components/compositions/ShopProductGallery.tsx:100-126`). | Either remove `sortBy` from URL/API contracts until backed, or implement a coherent server/deep-linkable sorting contract and update client sort changes into the route query. |
| P2 | Shop taxonomy filters | Public shop filters are hand-maintained and still omit canonical values the API accepts, so owners can have linked products for values users cannot select in the shop UI. | Canonical constants include `2020s`, `paint`, and `pastel` (`src/lib/constants/artworkConstants.ts:1-25`). `ShopFilters` stops at `2010s` and omits `paint`/`pastel` (`src/components/modules/filters/ShopFilters.tsx:52-61`, `src/components/modules/filters/ShopFilters.tsx:90-98`). | Derive shop filter options from the canonical artwork constants or a shared labeled option module; add source/component coverage so public shop filters stay in parity with accepted API values. |
| P2 | T-261 product-detail option trajectory | The new sale gallery now looks like a sale surface, but frame/mat/gallery selections are intentionally local preview state and are not represented in hosted purchase, price, availability, variants, enquiry submissions, or persisted data. More implementation without owner decisions risks making the UI imply commerce behavior the app does not own. | Shopify commerce architecture explicitly says print controls are preview-only and do not select variants, alter price/availability, persist, create cart lines, or change enquiries (`docs/architecture/shopify-commerce.md:98-109`). The gallery keeps selected frame/mat/gallery state locally (`src/components/shop/product-detail/ShopProductSaleGallery.tsx:272-283`). The route builds only `/project/contact?product=[handle]` (`src/app/shop/products/[productHandle]/page.tsx:237-265`), and the contact form defaults/submits only `productHandle` plus user-edited text (`src/components/modules/forms/user/ContactForm.tsx:34-65`). | Do not expand T-261 directly. Run a narrow owner-review/visual-QA task with one unlinked print, one original, and one book handle, then separately decide whether selected frame/mat should remain visual only, be included in enquiry text, or map to Shopify variants/options. |
| P3 | Product detail description rendering | Product detail currently injects `product.description` as HTML, even though the architecture keeps rich Shopify `descriptionHtml` rendering behind a separate sanitization/design decision. If Shopify/plain description ever contains markup-like text, the page treats it as HTML rather than text. | `ShopProductSaleGallery` renders `dangerouslySetInnerHTML={{ __html: product.description }}` (`src/components/shop/product-detail/ShopProductSaleGallery.tsx:609-613`). The Shopify architecture notes that `descriptionHtml` is preserved but rich description rendering requires a separate sanitization/design decision (`docs/architecture/shopify-commerce.md:122-129`). No inspected product-detail test covers escaping/sanitization of description output. | Render `product.description` as text, or create a separate sanitized rich-description task that intentionally uses `descriptionHtml` with an allowlist and regression coverage. |
| P3 | Collection slug redirects | A stale `/collections/[slug]` URL is a public archive discovery path, but missing collection navigation data is converted into a generic route error instead of a public not-found state. | The redirect page throws `new Error("Collection not found")` when `getCollectionNavigationItem()` returns no collection, logs it, and rethrows through the error boundary (`src/app/collections/[slug]/page.tsx:20-43`). | Add route-local not-found handling for missing collection redirect targets and keep true service failures on the error path. |

## T-261 Assessment

T-261 is no longer the right next implementation target because it is already
marked `Completed` (`docs/tasks/T-261-build-shop-product-sale-gallery-mockup.md:1-4`)
and its handoff notes show the sale gallery was expanded to prints, originals,
books, unlinked products, and invalid image-metric fallbacks
(`docs/tasks/T-261-build-shop-product-sale-gallery-mockup.md:180-226`). The
current Shopify workstream next action correctly narrows this path to
owner-review/visual QA using one unlinked print handle, one original artwork
handle, and one book handle, while keeping app-owned cart/checkout, Shopify
option mapping, selected frame/mat persistence, sale-policy copy, and physical
dimension migration out of scope until separate decisions exist
(`docs/workstreams/shopify-commerce.md:601-609`).

Recommendation: treat the T-261 implementation as complete but unreviewed in
live owner-facing conditions. The next T-261-adjacent task should be a visual
QA/owner decision task, not another implementation slice.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Deep-linked `/artwork` browse pages lose server pagination state before client load-more behavior. | `ArtworkListLoader` drops metadata and passes only the list data; `ArtworkGallery` starts `page` at `1` and `hasMore` at `true` regardless of route query (`src/components/loaders/viewLoaders/ArtworkListLoader.tsx:51-65`, `src/components/artwork/ArtworkGallery.tsx:29-32`, `src/components/artwork/ArtworkGallery.tsx:144-155`). | Create a focused frontend task to pass list metadata into `ArtworkGallery`, initialize state from it, and cover non-page-1 deep links plus terminal-page behavior. |
| High | Untyped public search is coupled to the full Shopify product-list fan-out. | All-type search includes `shop-products` and calls `getShopProductList()`, which reads linked artwork IDs and fans out through `getProductById` for unique product IDs before in-memory filtering (`src/lib/data/services/getPublicSearchResults.ts:262-295`, `src/lib/data/services/getShopProductList.ts:92-130`). | Scope a search-commerce task to decide default product inclusion, bounded product search behavior, and degradation when Shopify product reads are slow or unavailable. |
| Medium | Shop sorting is not deep-linkable or API-backed despite accepted `sortBy` query parsing. | The schema accepts `sortBy`, but the page omits it, the service has no sort param, and the gallery keeps sorting in local state only (`src/lib/data/schemas/shopProductListQuerySchema.ts:45-56`, `src/app/shop/products/page.tsx:12-20`, `src/lib/data/services/getShopProductList.ts:30-38`, `src/components/compositions/ShopProductGallery.tsx:40-126`). | Decide whether to remove the URL/API sort contract for now or implement server/deep-linkable sort with client query updates. |
| Medium | Public shop taxonomy controls drift from canonical accepted values. | Canonical constants include `2020s`, `paint`, and `pastel`, but `ShopFilters` omits those options (`src/lib/constants/artworkConstants.ts:1-25`, `src/components/modules/filters/ShopFilters.tsx:52-61`, `src/components/modules/filters/ShopFilters.tsx:90-98`). | Derive public shop filter options from canonical constants or shared option definitions. |
| Medium | Product-detail frame/mat controls need owner decision before they influence purchase or enquiry behavior. | Architecture records the controls as preview-only; implementation keeps state local and enquiry carries only product handle context (`docs/architecture/shopify-commerce.md:98-109`, `src/components/shop/product-detail/ShopProductSaleGallery.tsx:272-283`, `src/app/shop/products/[productHandle]/page.tsx:237-265`, `src/components/modules/forms/user/ContactForm.tsx:34-65`). | Run owner visual QA first, then separately decide whether selection state remains presentational, is appended to enquiries, or maps to Shopify product options. |
| Medium | Product detail description rendering uses `dangerouslySetInnerHTML` on the plain Shopify description. | `ShopProductSaleGallery` injects `product.description` as HTML while rich description rendering is still documented as requiring a sanitization/design decision (`src/components/shop/product-detail/ShopProductSaleGallery.tsx:609-613`, `docs/architecture/shopify-commerce.md:122-129`). | Render plain descriptions as text or open a sanitizer-backed rich-description task with focused coverage. |
| Medium | Missing `/collections/[slug]` redirect targets use the public error path instead of not-found behavior. | The redirect page throws and rethrows a generic error when collection navigation returns no item (`src/app/collections/[slug]/page.tsx:20-43`). | Add route-local missing-collection handling and focused coverage for stale collection slugs. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A-028-C01 | High | Candidate | Deep-linked `/artwork` browse pages lose server pagination metadata before client load-more state. | Frontend routes/components; testing and quality. |
| A-028-C02 | High | Candidate | All-type public search calls the full Shopify product-list fan-out and filters products in memory. | Frontend routes/components; Shopify commerce; testing and quality. |
| A-028-C03 | Medium | Candidate | Shop `sortBy` is accepted at the query layer but not honored by initial route state, API/service behavior, or URL updates. | Shopify commerce; frontend routes/components. |
| A-028-C04 | Medium | Candidate | Public shop taxonomy filters omit canonical accepted values such as `2020s`, `paint`, and `pastel`. | Shopify commerce; frontend routes/components. |
| A-028-C05 | Medium | Candidate | T-261 sale-gallery controls are preview-only and need owner decision before any purchase/enquiry/variant behavior is implied. | Shopify commerce; frontend routes/components; owner review. |
| A-028-C06 | Medium | Candidate | Product detail injects plain Shopify descriptions as HTML without a sanitizer-backed rich-description decision. | Shopify commerce; frontend routes/components; security/compliance review if rich HTML is desired. |
| A-028-C07 | Medium | Candidate | Missing `/collections/[slug]` redirect targets rethrow a generic error instead of rendering public not-found UI. | Frontend routes/components; testing and quality. |

## Risks Updated

- Candidate update for R-016/R-005: add the `/artwork` deep-link pagination
  state bug and missing non-page-1 load-more coverage.
- Candidate update for R-016/R-001: add the all-type public search Shopify
  fan-out and shop sort deep-link/API drift as remaining discovery/commerce
  runtime risks.
- Candidate update for R-018 only if owner wants frame/mat choices to affect
  sales enquiries or purchases; otherwise keep the current preview-only boundary
  documented.
- Candidate update for R-004/R-018 if rich Shopify descriptions are desired on
  product pages; otherwise render plain descriptions as text and avoid expanding
  the risk.
- Candidate update for R-016/R-032: add missing collection slug redirect
  targets using the public error path instead of route-local not-found behavior.

## Workstream Updates

- Frontend routes/components candidate backlog: pass public artwork list
  metadata through `ArtworkListLoader` into `ArtworkGallery` and initialize
  client pagination state from the server-rendered page.
- Shopify commerce candidate backlog: decide whether `/search` includes shop
  products by default, and if it does, implement bounded/query-aware product
  search with graceful degradation.
- Shopify commerce candidate backlog: either remove unsupported shop sort
  query vocabulary or implement server/deep-linkable sorting.
- Shopify commerce/frontend candidate backlog: derive public shop taxonomy
  filters from canonical constants.
- Shopify commerce candidate next action: keep T-261 implementation complete;
  prepare owner-review/visual-QA task before variant/enquiry/option mapping.
- Shopify commerce/frontend candidate backlog: render plain product
  descriptions as text or scope sanitized rich-description rendering.
- Frontend routes/components candidate backlog: map missing
  `/collections/[slug]` redirect targets to public not-found UI while preserving
  true service failures as route errors.

## Next Action

Prepare a narrow implementation task for the `/artwork` browse pagination state
bug first: thread list metadata from the server loader into the client gallery,
initialize `page`/`hasMore` from that metadata, and add focused coverage for
direct page-3 and terminal-page behavior. Then schedule the already-documented
T-261 visual-QA/owner-review task before any further product-detail commerce
behavior changes.

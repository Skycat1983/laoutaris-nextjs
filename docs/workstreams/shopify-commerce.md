# Shopify Commerce Workstream

Status: Active

Goal: make Shopify-backed artwork, print, and book sales reliable enough for
production while preserving MongoDB as the archive source of truth.

## Depends On

- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Shopify operations runbook](../runbooks/shopify-operations.md)
- [Production-readiness risks](../risks/production-readiness.md)
- Historical notes in [archive](../archive/README.md)

## Blocks

- Public shop launch.
- Product detail purchase flow.

## Related Code Areas

- `src/app/shop/page.tsx`
- `src/app/shop/products/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/app/api/v2/public/shop/products/route.ts`
- `src/app/api/v2/public/shop/products/[productId]/route.ts`
- `src/lib/api/shopify/`
- `src/lib/data/types/shopTypes.ts`
- `src/lib/data/types/shopifyTypes.ts`
- `src/components/compositions/ShopProductGallery.tsx`
- `src/components/modules/filters/ShopFilters.tsx`
- `src/components/modules/cards/ProductCard.tsx`

## Current Facts

- Product listing and product detail routes already exist under `/shop`.
- Shopify is accessed through the Storefront GraphQL API.
- MongoDB artwork documents store minimal Shopify references via
  `shopifyProducts`.
- Admin artwork create/update forms now expose a visible workflow for adding,
  editing, and removing canonical `shopifyProducts` links.
- The current canonical product link shape stores numeric Shopify product IDs,
  not full Shopify GIDs.
- Historical docs describe prior shop crashes caused by barrel imports from
  client components.
- Product route URLs should use Shopify handles:
  `/shop/products/[productHandle]`.
- A planned framed print preview feature is documented in
  [framed-print-preview.md](../architecture/framed-print-preview.md),
  [framed-print-preview-implementation-plan.md](../tasks/framed-print-preview-implementation-plan.md),
  and
  [framed-print-preview-owner-review-plan.md](../prototypes/framed-print-preview-owner-review-plan.md).
  It should start as a pixel-based, preview-only modal on eligible print product
  pages and remain separate from checkout/cart work until Shopify option
  ownership is decided.
- A-001 found product detail linked artwork fetching, checkout scope, admin
  linking, credential hygiene, product ID validation, filters, pagination,
  sorting, transform coverage, and API envelope consistency are not
  production-ready.
- A-015 independently confirmed the product-detail linked artwork fetch uses a
  non-existent `/api/artworks/:id` path.
- A-002 confirmed the single-product shop API returns raw product/error bodies
  and accepts arbitrary path segments; A-003 confirmed artwork schemas still
  omit Shopify product-link validation; A-007 confirmed the credential-like
  source comment remains.
- T-004 standardized the public single-product shop API envelope and numeric
  product ID validation, and updated `ArtworkShopSection` to unwrap the new
  contract.
- T-007 fixed product detail linked artwork fetching by resolving Shopify
  metafield artwork IDs through a server-only MongoDB artwork data service
  instead of the non-existent `/api/artworks/:id` route.
- T-008 replaced the misleading nonfunctional product detail `Add to Cart`
  affordance with an enquiry link to `/project/contact?product=...` for
  products Shopify marks available for sale.
- Unavailable product detail pages now show non-purchase status copy instead of
  a cart, checkout, or enquiry completion affordance.
- T-009 removed the token-shaped Shopify config source comment; owner
  verification/rotation for the removed value remains open.
- T-036 validates public shop listing query params before MongoDB query
  construction or Shopify product fan-out, while leaving checkout, product ID
  migration, admin linking, sorting, and pagination separate.
- T-058 adds a read-only MongoDB audit command for existing artwork
  `shopifyProducts` links. It reports invalid IDs, unknown product types,
  within-artwork duplicates, and cross-artwork duplicates without mutating data
  or calling Shopify.
- T-059 completed the live read-only product-link audit against the
  owner-approved MongoDB Atlas `laoutarisDB` target. It scanned 215 artworks,
  found 92 artworks with Shopify links and 99 total Shopify links, and reported
  0 invalid IDs, 0 unknown types, 0 within-artwork duplicates, and 1
  review-only cross-artwork book duplicate group.
- T-060 removed unsupported colour/dimension public shop filters and fake
  pagination controls while preserving backed listing filters, product-type
  checkboxes, result count, and client-side sort controls.
- T-061 carries Shopify `productType` and `tags` through public product DTOs
  and uses `productType` metadata, not title keywords, for the default client
  shop type sort.
- T-062 carries queried Shopify variant IDs, titles, availability, price money,
  compare-at price money, and optional variant image URL/alt text through
  `SimpleProduct.variants` for list, handle, and ID reads without changing
  checkout/cart, product-detail CTA, or visible variant-selection behavior.
- T-063 carries queried Shopify `descriptionHtml` through `SimpleProduct` for
  list, handle, and ID reads while keeping product detail rendering on the
  existing plain `description`.
- T-068 removed always-on public shop `console.log` output from the product
  listing route, gallery, and loader while preserving current filtering,
  sorting, malformed ID skipping, deduplication, response envelope, and
  metadata behavior.
- T-082 recorded the shared book-link policy and added strict admin artwork
  create/update validation for Shopify product links: numeric product IDs,
  known types, and no within-artwork duplicate product IDs.
- T-085 moved the initial public shop product list onto shared server-only
  `getShopProductList` service logic. The public route preserves query
  validation, stored ID skipping, deduplication, Shopify fan-out, success
  metadata, validation `400`s, and public-safe `500`s; `ShopProductsLoader` no
  longer depends on `NEXT_PUBLIC_BASE_URL`, localhost, or same-app `fetch()`.
- T-097 completed the visible admin artwork form workflow for creating,
  editing, and removing canonical `shopifyProducts` links while preserving
  T-082 server-side validation.
- T-098 added explicit product-existence verification controls to the admin
  linking UI without making Shopify availability a persistence dependency.
- A-020 found commerce compliance and handoff gaps: product enquiry links pass
  a product handle in the URL but the contact form does not persist that
  context, and current payment/shipping/buyer-protection copy is ahead of the
  implemented enquiry-only checkout state and public policy pages.
- T-100 preserves available product enquiry context by passing normalized
  Shopify handles from `/project/contact?product=...` into contact submissions.
  The stale Shopify credential TODO in `src/app/shop/products/page.tsx` is
  removed.
- A-010 found artwork-to-shop product discovery is still client-side on artwork
  detail pages: `ArtworkShopSection` fetches linked products in `useEffect`, so
  product links and prices are not present in initial server HTML.
- T-107 added conservative route-specific metadata and product detail JSON-LD
  for `/shop/products/[productHandle]` without adding checkout, offer, sale,
  shipping, refund, payment, guarantee, or availability claims to structured
  data.
- T-111 renders artwork-to-shop product summaries from the server-side artwork
  detail path instead of client-side `ArtworkShopSection` fetches.
- T-115 cleaned up Shopify Storefront fetch options so development reads use
  only `cache: "no-store"` and non-development reads use only
  `next.revalidate: 3600`; product transforms, request bodies, checkout, and
  product detail UI were not changed.
- T-127 migrated scoped Shopify provider/data service failure logging to
  structured redacted server events without changing Shopify product DTOs,
  Storefront cache policy, linked-product fallback behavior, product-list
  metadata, filters, checkout behavior, or product detail UI.
- A-017 confirmed Shopify products are not included in global public search
  and shop sorting remains client-only despite an accepted `sortBy` query
  parameter.
- A-018 confirmed public shop taxonomy filters drift from canonical artwork
  constants, including missing selectable `paint`, `pastel`, and `2020s`
  values that the API schema accepts.

## Backlog

- Decide the full checkout handoff: Shopify-hosted product/checkout link or
  Shopify cart/checkout with variant selection.
- Align commerce assurance copy with implemented checkout/cart behavior and
  owner/legal-approved sale, payment, shipping, refund, and buyer-protection
  policies.
- Verify whether the removed Shopify credential-like source comment represented
  a real value and rotate it if needed.
- Standardize remaining shop product API envelopes, define checkout line-item
  requirements, and decide rich-description rendering/sanitization before
  using `descriptionHtml` in product-detail UI.
- Define the real public shop pagination contract before rendering pagination
  controls again.
- Define any future server-side shop sorting contract before moving current
  client-side sorting into the API.
- Decide whether global public search should include Shopify products; if yes,
  extend the search service/result rendering without adding checkout claims.
- Derive shop taxonomy filter options from canonical artwork constants instead
  of hand-maintained option arrays.
- Implement the framed print preview plan in separate slices: frame profile and
  geometry contracts, standalone preview component, modal controls,
  `/prototype/frame`, product-page launcher wiring, targeted owner review,
  Shopify option mapping, and physical dimension migration.
- Add focused tests for product transformation, link helpers, API behavior,
  product detail artwork context, filters, sorting, and pagination.
- Move useful root shop notes into architecture and runbook docs, then archive
  or remove the root notes.

## Acceptance Criteria

- `/shop/products` renders without runtime crashes.
- Product listing filters and sorting have tested behavior.
- `/shop/products/[productHandle]` handles not found, unavailable, and partially
  linked products gracefully.
- Artwork pages can show sale links without fetching stale product data from
  MongoDB.
- Shopify secrets are documented as environment variables only.
- Historical shop implementation notes are no longer required for onboarding.

## Verification

```bash
npm test
npm run build
```

Add targeted tests as shop behavior is hardened.

## Progress

- Documentation scaffold created.
- Historical shop notes identified and indexed in `docs/archive/README.md`.
- 2026-05-14: A-001 and overlapping A-015 findings reconciled into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled overlapping A-002, A-003, and A-007 Shopify findings
  into existing F-010, F-011, F-012, and F-015.
- 2026-05-14: Prepared T-004 as the first Shopify/API contract implementation
  slice.
- 2026-05-14: Completed T-004; the single-product route validates numeric IDs
  before Shopify calls, returns success/error envelopes with real 400/404/502
  statuses, and the artwork-page shop section reads `result.data`.
- 2026-05-14: Prepared T-007 to replace product-detail linked artwork
  self-fetching with a server-only data path.
- 2026-05-14: Completed T-007; `/shop/products/[productHandle]` now resolves
  linked original/print artwork and book artwork through `getArtworkById`,
  gracefully ignores invalid or missing linked artwork IDs, and no longer
  depends on `/api/artworks/:id`, `NEXT_PUBLIC_BASE_URL`, or a localhost
  fallback for linked artwork context.
- 2026-05-14: Prepared T-008 to replace the nonfunctional product detail
  `Add to Cart` affordance with a safe first-release handoff.
- 2026-05-14: Completed T-008; available product detail pages now link to the
  project contact page for enquiry, unavailable products show non-purchase
  status, and focused tests cover both CTA states.
- 2026-05-14: Completed T-009 for the Shopify source cleanup slice by removing
  the token-shaped config comment and adding a focused regression check. Owner
  verification or rotation for the removed value remains open.
- 2026-05-15: Prepared T-036 to close the remaining F-060 public shop browse
  query-bounds slice. It scopes repeated artwork-derived shop filters,
  product-type boolean parsing, optional `sortBy` validation, and focused route
  tests before DB/Shopify work.
- 2026-05-15: Completed T-036; the public shop listing route now rejects
  invalid repeated filters, product-type boolean strings, and optional `sortBy`
  values before `dbConnect()`, MongoDB query construction, or Shopify product
  fan-out while preserving existing valid listing behavior and response shape.
- 2026-05-15: Prepared T-057 as the next focused F-012 Shopify product ID slice.
  It centralizes numeric Shopify product ID validation/GID construction and
  applies it to public single-product and product-listing reads while leaving
  admin linking, data migration, checkout/cart, product transforms, sorting, and
  pagination separate.
- 2026-05-15: Completed T-057; public Shopify product reads now share numeric
  product ID normalization and GID construction, the single-product route keeps
  invalid path IDs at `400` before Shopify work, and the listing route skips
  malformed stored IDs before Shopify fan-out while deduplicating after
  normalization.
- 2026-05-15: Prepared T-058 as the next F-012 existing-data step. It adds a
  read-only audit for artwork `shopifyProducts` links so invalid IDs,
  duplicates, and migration needs are visible before any mutation or admin
  linking task.
- 2026-05-15: Completed T-058; `npm run audit:shopify-products` now reads
  artwork Shopify links from MongoDB, reports invalid IDs, unknown product
  types, within-artwork duplicates, and cross-artwork duplicates, and exits
  non-zero for invalid IDs or unknown types while remaining read-only.
- 2026-05-15: Prepared T-059 to run the T-058 audit against the owner-approved
  MongoDB environment, record the report in the Shopify audit evidence, and
  scope the next cleanup or admin-link validation task from actual data.
- 2026-05-15: T-059 attempted `npm run audit:shopify-products`, but the command
  exited `1` before connecting because `MONGO_URI` was not set. No artwork data
  was scanned, no Shopify API was called, and cleanup/migration planning
  remained blocked on an owner-approved MongoDB target.
- 2026-05-17: Completed T-059 against the owner-approved MongoDB Atlas
  `laoutarisDB` target. The audit exited `0` with 215 artworks scanned, 92
  artworks with Shopify links, 99 total Shopify links, 0 invalid IDs, 0 unknown
  types, 0 within-artwork duplicates, and 1 review-only cross-artwork duplicate
  book group for product `10538937319688` across 92 artworks.
- 2026-05-16: Prepared T-060 as a runnable F-013 shop UI cleanup while T-059 is
  blocked on database environment input. It removes unsupported colour/dimension
  filters and fake pagination while preserving backed listing filters and sort
  controls.
- 2026-05-16: Completed T-060; the public shop no longer renders unsupported
  colour/dimension filters or placeholder pagination, stale client-only
  colour/dimension filter state was removed, and focused component tests cover
  the absence of unsupported controls plus preservation of backed controls.
- 2026-05-16: Prepared T-061 as the next focused F-013/F-014 shop slice. It
  carries Shopify `productType` and `tags` through product DTOs and replaces
  title-keyword default type sorting with metadata-based sorting.
- 2026-05-16: Completed T-061; `SimpleProduct` now preserves Shopify
  `productType` and `tags` for list, handle, and ID reads, and the public shop
  default type sort uses normalized product metadata without title fallback.
- 2026-05-19: T-140 reconciled A-017/A-018 Shopify-facing discovery and
  taxonomy findings into updated F-013/F-023 and new F-098. Shop product
  inclusion in public search, server/deep-linkable shop sorting, and canonical
  taxonomy option parity remain separate from checkout/cart and product-link
  validation work.
- 2026-05-16: Prepared T-062 as the next focused F-014 transform slice. It
  carries queried Shopify variant metadata through product DTOs without
  implementing checkout/cart, product-detail CTA changes, or visible
  variant-selection UI.
- 2026-05-16: Completed T-062; `SimpleProduct` now exposes a stable `variants`
  array with queried Shopify variant IDs, titles, availability, price money,
  compare-at price money, and optional variant image URL/alt text while keeping
  existing top-level product price/image/availability behavior unchanged.
- 2026-05-16: Prepared T-063 as the next focused F-014 transform slice. It
  carries queried Shopify `descriptionHtml` through product DTOs without
  rendering rich HTML or changing product-detail UI, checkout/cart, or variant
  selection behavior.
- 2026-05-16: Completed T-063; `SimpleProduct` now preserves Shopify
  `descriptionHtml` for list, handle, and ID reads while existing plain
  `description`, product metadata, variant metadata, product-detail UI,
  checkout/cart, and variant-selection behavior remain unchanged.
- 2026-05-16: Prepared T-068 as a focused public shop debug-log cleanup. It
  should remove always-on console output from the product listing route,
  gallery, and loader while preserving current filtering, sorting, product
  response metadata, malformed ID skipping, and deduplication behavior.
- 2026-05-16: Completed T-068; the public shop product listing route, gallery,
  and loader no longer emit direct `console.log` debug output on normal
  requests/interactions, the loader error hint no longer directs public users
  to the console, and focused source/API/component tests preserve the current
  public shop contracts.
- 2026-05-17: Completed T-082; the shared book-link policy is recorded, admin
  artwork create/update writes now accept only canonical Shopify product links
  with trimmed numeric IDs and known types, and within-artwork duplicate product
  IDs are rejected before persistence. Cross-artwork book duplicates remain
  allowed when they represent a legitimate shared publication.
- 2026-05-17: Completed T-085; `getShopProductList` now owns the public shop
  product listing read path shared by `GET /api/v2/public/shop/products` and
  `ShopProductsLoader`, preserving current filtering, malformed ID skipping,
  product ID deduplication, Shopify fan-out, and metadata semantics while
  removing the loader's same-app HTTP dependency.
- 2026-05-17: Prepared T-097 as a higher-throughput F-010/R-021 slice that
  bundles admin artwork form UI, shared form-schema wiring, focused tests, and
  operator docs for Shopify product-link management.
- 2026-05-17: Completed T-097; admin artwork create/update forms now manage
  canonical Shopify product links with add/remove controls, numeric ID/type
  validation, duplicate prevention, existing-link initialization, and empty
  array submission for clearing links.
- 2026-05-17: Prepared T-098 to add admin product-link verification controls
  so operators can confirm Shopify product IDs exist before saving, while
  keeping persistence-time Shopify validation and data mutation separate.
- 2026-05-17: Completed T-098; admin product-link rows now verify Shopify
  product IDs through the existing public single-product route on operator
  action, display returned product context on success, show invalid/not-found/
  upstream states on failure, clear stale verification when rows change, and
  keep artwork save governed by local and route validation.
- 2026-05-18: Reconciled A-020 Shopify findings into F-076, F-078, and F-079.
  Product enquiry context persistence and stale credential TODO cleanup were
  assigned to T-100; commerce assurance copy alignment remains separate.
- 2026-05-18: Prepared T-100 to preserve Shopify product context in enquiry
  submissions and remove the stale Shopify credential TODO without changing
  checkout/cart or policy-page scope.
- 2026-05-18: Completed T-100; valid product enquiry links now preserve a
  normalized Shopify handle through `/project/contact` and the public enquiry
  payload, invalid product context is not persisted silently, and the stale shop
  credential TODO was removed. The orchestrator reran `npm run build` after
  T-099 completed and build passed.
- 2026-05-18: Reconciled A-010 Shopify-facing discovery finding into F-090.
  Artwork detail pages should eventually render linked product summaries in
  initial server HTML; keep that separate from checkout/cart and product
  pagination/sorting work.
- 2026-05-18: Prepared T-107 to add conservative product detail metadata and
  JSON-LD while keeping checkout/cart, commerce assurance copy, and
  artwork-to-shop SSR discovery separate.
- 2026-05-18: Completed T-107; `/shop/products/[productHandle]` now builds
  title, description, canonical, Open Graph, and Twitter metadata from
  `getProductByHandle` and renders conservative `Product` JSON-LD limited to
  identity and descriptive fields. Checkout/cart, commerce assurance copy, and
  artwork-to-shop SSR discovery remain separate.
- 2026-05-18: Prepared T-111 to move artwork-to-shop product summary
  resolution into the server-rendered artwork detail path while keeping
  checkout/cart and commerce claims separate.
- 2026-05-18: Completed T-111; artwork and collection-scoped artwork detail
  loaders now resolve linked Shopify product summaries server-side and pass
  grouped original/print/book products into `ArtworkShopSection`, which no
  longer performs browser product fetches.
- 2026-05-18: Prepared T-115 to remove the Shopify Storefront fetch
  `cache`/`next.revalidate` option conflict that build reports during
  `/sitemap.xml` generation, without changing product transforms, checkout,
  product detail UI, or Shopify freshness intent.
- 2026-05-18: Completed T-115; Shopify Storefront fetches no longer combine
  `cache` and `next.revalidate`, focused request-option coverage was added for
  development and production modes, and build passed without the prior
  `/sitemap.xml` Shopify fetch warning.
- 2026-05-18: Prepared T-118 to migrate public shop product API route failure
  logging onto request IDs and structured redacted logging alongside the
  remaining public search/navigation route slice. Checkout, product detail UI,
  pagination, sorting, and Shopify validation behavior remain separate.
- 2026-05-18: Completed the T-118 Shopify route slice: public shop product list
  `500` failures and single-product upstream `502` failures now use
  request-context structured logging and return public request IDs plus
  `X-Request-Id`, while success, validation `400`, missing-resource `404`,
  Shopify ID normalization, fetch behavior, client fetcher contracts, checkout,
  product detail UI, pagination, sorting, and Shopify validation behavior were
  preserved.
- 2026-05-18: Prepared T-127 as the Shopify provider/data service logging
  migration. It should replace scoped direct `console.error()` calls in the
  Storefront client and product resolver services with structured redacted
  server events while preserving product DTOs, cache policy, linked product
  fallback behavior, and public shop contracts.
- 2026-05-18: Completed T-127; scoped Shopify provider/data service failures
  now use structured redacted server events for Storefront HTTP/GraphQL/fetch
  failures, malformed featured-artwork metafields, and linked product fan-out
  failures. The slice preserved product DTOs, Storefront cache policy,
  public-safe wrapper errors, linked product skip/null behavior, product-list
  metadata, filters, checkout behavior, and product detail UI.
- 2026-05-20: Prepared T-160 for an enquiry-safe homepage shop teaser
  prototype using `to_prototype/shop.png` and existing shop/product data. It
  must not add checkout/cart/payment/shipping/refund claims or alter live shop
  pages.
- 2026-05-20: Completed T-160. `/prototype/home` now has an enquiry-safe shop
  teaser backed by `getShopProductList`, limited to prototype rendering and
  leaving live shop pages, checkout/cart behavior, Shopify DTOs, and commerce
  claims unchanged.
- 2026-05-21: Planned the framed print preview feature for print product detail
  pages. The plan documents a preview-only modal using linked artwork pixel
  dimensions first, a data-driven frame/mat profile model, future physical
  dimension support, targeted owner review, and a later Shopify option-mapping
  phase that stays separate from checkout/cart work.
- 2026-05-21: Reviewed and tightened the framed print preview plan. The
  implementation should not start with product-page modal wiring; start with
  frame profile and pure geometry contracts, then standalone preview rendering,
  then modal controls, then an isolated `/prototype/frame` workshop, then
  eligible product-page launcher wiring.
- 2026-05-21: Completed T-187, the first framed print preview implementation
  slice. Added pure frame/mat profile catalogs, display/geometry contracts, a
  relative pixel-based geometry helper with future physical print scaling
  support, and focused unit coverage. No product pages, modal UI, Shopify
  contracts, MongoDB schemas, admin forms, checkout, or enquiry behavior
  changed.
- 2026-05-21: Completed T-188, the standalone framed artwork preview component.
  It renders the geometry helper output with selected/default frame and mat
  profiles while remaining isolated from modal state, product-page eligibility,
  Shopify clients, checkout, and enquiry behavior. No visible route exists yet.
- 2026-05-21: Completed T-189, the framed print preview modal shell. Added
  controlled modal open/close behavior, Escape/backdrop close handling,
  previous/next material cycling, and direct frame swatches around the standalone
  preview while keeping product pages, Shopify contracts, checkout, and enquiry
  behavior unchanged. No visible route exists yet.

## Next Agent Action

Choose the next Shopify backlog slice from checkout handoff, commerce assurance
copy alignment, remaining product-detail contract coverage, product pagination,
server-side sorting, framed print preview implementation, or prototype-shop
visual refinement after owner review. Keep those separate unless explicitly
assigned.

Keep checkout handoff, real pagination, server-side sorting, product-detail UI,
product-link data migration, automatic mutation, and persistence-time Shopify
API validation separate. No product-ID cleanup or migration is indicated by
T-059 or T-082.

If framed print preview implementation continues, start with the `/prototype/frame`
workshop route slice from
[framed-print-preview-implementation-plan.md](../tasks/framed-print-preview-implementation-plan.md).
Use the completed T-187 geometry helper, T-188 standalone preview component, and
T-189 modal shell. This should be the first user-visible framed preview route.
Do not wire live product pages, begin Shopify option mapping, or start physical
dimension migration in the same task.

Owner confirmation on the removed Shopify value remains a separate commerce
blocker.

Product breadcrumb structured data for `/shop/products/[productHandle]` is
prepared under T-112. Keep that separate from checkout handoff, offers,
availability, payment, shipping, refund, and guarantee claims.

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
- Admin workflow for linking artworks to Shopify products.

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
- The current canonical product link shape stores numeric Shopify product IDs,
  not full Shopify GIDs.
- Historical docs describe prior shop crashes caused by barrel imports from
  client components.
- Product route URLs should use Shopify handles:
  `/shop/products/[productHandle]`.
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
- T-059 attempted to run the live read-only product-link audit, but no
  owner-approved `MONGO_URI` was configured in the task shell, so no MongoDB
  data was scanned.
- T-060 removed unsupported colour/dimension public shop filters and fake
  pagination controls while preserving backed listing filters, product-type
  checkboxes, result count, and client-side sort controls.
- T-061 carries Shopify `productType` and `tags` through public product DTOs
  and uses `productType` metadata, not title keywords, for the default client
  shop type sort.

## Backlog

- Decide the full checkout handoff: Shopify-hosted product/checkout link or
  Shopify cart/checkout with variant selection.
- Define the admin linking workflow for original, print, and book product links,
  including numeric ID/type validation and duplicate prevention.
- Verify whether the removed Shopify credential-like source comment represented
  a real value and rotate it if needed.
- Obtain the owner-approved MongoDB target/environment label, configure
  `MONGO_URI`, rerun the read-only Shopify product-link audit, then plan any
  owner-approved cleanup or migration for reported invalid values.
- Standardize remaining shop product API envelopes and carry any remaining
  variant IDs, availability, and description fields needed by product detail.
- Define the real public shop pagination contract before rendering pagination
  controls again.
- Define any future server-side shop sorting contract before moving current
  client-side sorting into the API.
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
  was scanned, no Shopify API was called, and cleanup/migration planning remains
  blocked on an owner-approved MongoDB target.
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
- 2026-05-16: Prepared T-062 as the next focused F-014 transform slice. It
  carries queried Shopify variant metadata through product DTOs without
  implementing checkout/cart, product-detail CTA changes, or visible
  variant-selection UI.

## Next Agent Action

Assign T-062:
`/task effort: high details: docs/tasks/T-062-preserve-shopify-variant-metadata.md`

T-059 remains blocked until an owner-approved MongoDB target and `MONGO_URI` are
available.

Owner confirmation on the removed Shopify value, checkout handoff, admin
linking workflow, data migration, and server-side sorting/pagination remain
separate commerce blockers.

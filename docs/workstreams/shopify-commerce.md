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

## Backlog

- Decide the full checkout handoff: Shopify-hosted product/checkout link or
  Shopify cart/checkout with variant selection.
- Define the admin linking workflow for original, print, and book product links,
  including numeric ID/type validation and duplicate prevention.
- Verify whether the removed Shopify credential-like source comment represented
  a real value and rotate it if needed.
- Add shared Shopify product ID normalization and audit existing data for legacy
  GID-style values.
- Standardize shop product API envelopes and carry product type, tags, variant
  IDs, availability, and description fields needed by product detail.
- Remove or implement visible color/dimension filters and placeholder
  pagination.
- Sort shop products on explicit product/link metadata instead of title
  keywords.
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

## Next Agent Action

Get owner confirmation on whether the removed Shopify value was real and needs
rotation; keep checkout handoff and admin linking workflow decisions as the next
commerce implementation blockers.

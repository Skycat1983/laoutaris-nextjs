# T-340 Add Shopify Product Link Public Listing Flag

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Separate per-artwork Shopify product linkage from broad public shop listing so
generated original and print links can later be stored without automatically
appearing in `/shop/products`, public search, homepage shop sections, or the
product sitemap.

## Context

- T-338 created 430 generated Shopify products as drafts.
- T-339 excluded Shopify products that Storefront reports as unavailable for
  sale from broad public listing surfaces.
- The owner confirmed on 2026-05-29 that generated original/print product
  links should be written for all 215 artworks with public listing disabled by
  default.
- Existing manual links must preserve current behavior unless explicitly marked
  non-public.

## Scope

In scope:

- Extend `ShopifyProductLink` with optional `publicListing`.
- Treat absent legacy `publicListing` values as public/listable.
- Validate and persist `publicListing` through artwork form and admin API
  schemas.
- Preserve `publicListing: false` on admin artwork updates even though there is
  no visible owner-facing toggle yet.
- Make broad public shop listing require `publicListing !== false` before
  Shopify fan-out, while still requiring `availableForSale: true` after
  Storefront resolution.
- Add focused tests for schema defaults, non-public preservation, admin route
  persistence, and public listing exclusion.

Out of scope:

- Do not write generated MongoDB links in this task.
- Do not publish Shopify products or change Shopify sales-channel publication.
- Do not add a visible admin toggle for public listing.
- Do not change direct product-detail behavior for known handles.
- Do not mutate Cloudinary, orders, customers, collections, publications,
  domains, aliases, Vercel state, checkout/cart behavior, or generated Shopify
  product data.

## Concurrency

Do not run alongside another task editing artwork schemas, admin artwork forms,
or Shopify product-list services. Can run in parallel with unrelated visual QA
or route-builder work.

## Files Likely Touched

- `src/lib/data/types/shopifyTypes.ts`
- `src/lib/data/schemas/artworkSchema.ts`
- `src/lib/data/models/artworkModel.ts`
- `src/lib/data/services/getShopProductList.ts`
- `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArtworkForm.tsx`
- `__tests__/unit/data/getShopProductList.test.ts`
- `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`
- `__tests__/unit/api/adminArtworkRoute.test.ts`

## Acceptance Criteria

- `shopifyProducts` links can carry `publicListing: false`.
- Missing `publicListing` on legacy/manual links defaults to public/listable.
- Public shop listing does not call Shopify for links marked
  `publicListing: false`.
- Admin update forms preserve existing non-public links.
- Admin create/update routes persist explicit non-public links.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
git diff --check
```

## Handoff Notes

- 2026-05-29: Added optional `publicListing` to the Shopify product-link model,
  route/form schema, and Mongoose schema. Missing values default to public for
  backward compatibility.
- 2026-05-29: Updated public shop listing to skip `publicListing: false` links
  before Shopify fan-out, then keep the existing `availableForSale` return
  guard from T-339.
- 2026-05-29: Updated admin artwork forms to preserve the hidden
  `publicListing` value through create/update submissions without exposing a
  visible toggle yet.
- 2026-05-29: Added focused tests for defaulting, explicit non-public
  preservation, admin route persistence, and listing exclusion.
- Still out of scope: the live MongoDB link-write command. The next task should
  generate a read-only link plan from the T-338 post-create reconciliation
  report, then gate the actual MongoDB update behind exact owner confirmation.
- Verification run on 2026-05-29:
  `npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts`
  passed with 59 tests; `npm run lint` passed; `npm run typecheck` passed;
  `git diff --check` passed.

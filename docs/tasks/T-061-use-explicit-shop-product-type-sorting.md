# T-061 Use Explicit Shop Product Type Sorting

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the next focused F-013/F-014 shop slice by carrying explicit Shopify
product metadata through `SimpleProduct` and making default shop type sorting
use product metadata instead of product title keywords.

## Context

- F-013 tracks shop filters, pagination, and sorting UI that expose behavior not
  backed by canonical API data.
- F-014 tracks that Shopify product transformation drops fields already queried
  from Storefront, including `productType` and `tags`.
- `src/lib/api/shopify/queries.ts` already requests `productType` and `tags`.
- `src/lib/api/shopify/shopifyClient.ts` currently drops those fields from
  `SimpleProduct`.
- `ShopProductGallery` currently implements default `"type"` sorting by checking
  whether `product.title` contains `book`, `original`, or `print`.
- T-060 removed unsupported colour/dimension filters and fake pagination; this
  task should not reintroduce hidden or placeholder controls.

## Scope

In scope:

- Add explicit `productType` and `tags` fields to `SimpleProduct`.
- Preserve these fields in the Shopify product transform for products fetched
  by list, handle, and ID.
- Replace title-keyword default type sorting in `ShopProductGallery` with a
  metadata-based sort helper.
- Keep the existing default display order intent: books first, originals
  second, prints third, unknown product types last.
- Normalize expected Shopify product type strings conservatively, for example
  lowercasing/trimming and matching obvious values such as `book`, `original`,
  `original artwork`, `print`, or `limited edition print`.
- Add focused tests proving:
  - transformed products include `productType` and `tags`,
  - default type sorting uses `productType` metadata rather than title text,
  - unknown product types sort after known book/original/print products,
  - existing price/title sort modes still work.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not expose variant IDs, variant titles, description HTML, or checkout line
  item data.
- Do not implement checkout/cart or product availability policy changes.
- Do not implement pagination.
- Do not add admin product-linking UI or persistence.
- Do not mutate MongoDB data or run the blocked T-059 audit.
- Do not change public shop API envelope shape except for adding fields to each
  product DTO.
- Do not use title text as a fallback for product type sorting.

## Files Likely Touched

- `src/lib/data/types/shopify.ts`
- `src/lib/api/shopify/shopifyClient.ts`
- `src/components/compositions/ShopProductGallery.tsx`
- Focused Shopify transform and/or gallery component tests under `__tests__/unit/`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `SimpleProduct` includes Shopify `productType` and `tags`.
- Public shop product list/detail data preserves `productType` and `tags` from
  Shopify.
- Default `"type"` sorting does not inspect product titles.
- Book, original, and print product types sort in the current intended order.
- Unknown product types remain visible and sort after known types.
- Existing price and title sort behavior is preserved.
- No pagination, checkout/cart, admin linking, or data migration behavior is
  changed.

## Verification

Run:

```bash
npm test -- --runTestsByPath <focused Shopify transform/gallery sort tests>
npm run lint
npm run build
```

Record the exact focused test path or paths in the handoff notes.

## Handoff Notes

- Completed 2026-05-16.
- `SimpleProduct` now includes explicit Shopify `productType` and `tags`.
- Shopify list, handle, and ID product transforms preserve `productType` and
  `tags`.
- `ShopProductGallery` default `"type"` sorting now uses normalized
  `productType` metadata only, with books first, originals second, prints
  third, and unknown types last.
- Title, price-low, and price-high sort modes are unchanged.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/shopifyClientTransform.test.ts __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/shopProductsRoute.test.ts`
  passed.
- `npm run lint` passed.
- `npm run build` passed with the existing MongoDB/fetcher/static-generation
  log noise documented in the testing workstream.

## Escalate

Escalate to the orchestrator if:

- Shopify `productType` values in real data are not sufficient to distinguish
  books, originals, and prints.
- The implementation needs MongoDB link-type metadata in the product DTO to sort
  correctly.
- Checkout, variant, pagination, or admin-linking behavior becomes necessary to
  complete the sorting fix.

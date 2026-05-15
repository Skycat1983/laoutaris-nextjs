# T-036 Bound Public Shop Browse Query

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Add route-bound validation and bounds for public shop product listing query
parameters before they reach MongoDB query construction or Shopify product
fan-out.

## Why Now

T-021 hardened public search query parsing, and T-035 hardened public artwork
browse query parsing. F-060 still remains open for
`GET /api/v2/public/shop/products`, which accepts raw repeated filter values and
product-type booleans before building MongoDB conditions and fetching Shopify
products.

This is the final narrow F-060 public query-bounds slice. Keep it separate from
Shopify checkout, admin product-link validation, product ID migration, listing
pagination, and server-side sorting decisions.

This task addresses:

- [F-060](../audits/findings-register.md): shop browse query parsing and bounds
  remain incomplete.
- [R-006](../risks/production-readiness.md): API validation contracts remain
  inconsistent.
- [R-015](../risks/production-readiness.md): public input flows still have
  validation gaps.

## Read First

- [T-021 Harden public search query service](T-021-public-search-query-service.md)
- [T-035 Bound public artwork browse query](T-035-bound-public-artwork-browse-query.md)
- [A-016 Forms, validation, and input result](../audits/results/A-016-forms-validation-inputs.md)
- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Frontend routes and components workstream](../workstreams/frontend-routes-and-components.md)
- `src/app/api/v2/public/shop/products/route.ts`
- `src/lib/data/schemas/artworkListQuerySchema.ts`
- `src/lib/constants/artworkConstants.ts`
- `src/lib/data/types/shopTypes.ts`
- `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
- `src/components/compositions/ShopProductGallery.tsx`

## Scope

In scope:

- Add a route-safe parser/schema for shop product listing search params that:
  - validates repeated `decade`, `artstyle`, `medium`, and `surface` values
    against the canonical artwork constants,
  - validates `showOriginals`, `showPrints`, and `showBooks` as optional
    boolean query strings where absent values default to `true`,
  - accepts only `true` and `false` boolean strings,
  - validates optional `sortBy` against the current `ShopSortOption` values,
    while preserving client-side sorting behavior.
- Return structured JSON `400` validation errors before `dbConnect()`,
  `ArtworkModel.find()`, or `getProductById()` when query params are invalid.
- Preserve the successful response shape:
  `{ success: true, data, metadata: { totalArtworks, totalProducts } }`.
- Preserve current valid MongoDB filter behavior for `decade`, `artstyle`,
  `medium`, and `surface`.
- Preserve current product-type filtering behavior for valid boolean params.
- Add focused route tests covering defaults, valid filters, invalid filters,
  invalid booleans, valid `false` product-type filters, invalid-query
  short-circuiting before DB/Shopify calls, and public-safe internal failure
  behavior.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not add server-side sorting or pagination to the shop listing route.
- Do not change shop filter UI behavior unless a current valid value is
  discovered to be incompatible with the canonical constants.
- Do not normalize, migrate, or validate stored Shopify product IDs beyond
  preserving existing listing behavior.
- Do not change checkout/cart/enquiry handoff behavior.
- Do not standardize Shopify listing envelope semantics beyond preserving the
  existing success response and returning real `400` validation errors.
- Do not change per-product Shopify fan-out failure semantics.
- Do not perform broad log cleanup unless a focused test requires removing a
  direct input log.

## Acceptance Criteria

- Invalid public shop listing query params return real JSON `400` responses and
  do not call `dbConnect()`, `ArtworkModel.find()`, or `getProductById()`.
- Valid query params are normalized before MongoDB conditions and product-type
  filtering are built.
- Existing default shop listing behavior is preserved when no query params are
  provided.
- Valid `showOriginals=false`, `showPrints=false`, and `showBooks=false` values
  continue to hide those product link types.
- Focused shop route tests, lint, and build pass.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/shopProductsRoute.test.ts
npm run lint
npm run build
```

## Completion

Completed on 2026-05-15:

- Added `src/lib/data/schemas/shopProductListQuerySchema.ts` for route-safe
  public shop listing query parsing. It validates repeated
  `decade`/`artstyle`/`medium`/`surface` filters against the canonical artwork
  constants, accepts only `true` and `false` product-type boolean strings, and
  validates optional `sortBy` against the current `ShopSortOption` values.
- Updated `GET /api/v2/public/shop/products` to return structured JSON `400`
  validation responses before `dbConnect()`, `ArtworkModel.find()`, or
  `getProductById()` can run on invalid query input.
- Preserved the existing valid MongoDB filter shape, product-type filtering,
  Shopify product de-duplication/fan-out behavior, per-product Shopify failure
  handling, and success response shape:
  `{ success: true, data, metadata: { totalArtworks, totalProducts } }`.
- Added `SHOP_SORT_OPTIONS` beside `ShopSortOption` so the route parser can use
  the same sort values at runtime without changing client-side sorting
  behavior.
- Added `__tests__/unit/api/shopProductsRoute.test.ts` for defaults, valid
  filters, valid `false` product-type filters, invalid repeated filters,
  invalid booleans/sort options, invalid-query short-circuiting before
  DB/Shopify work, and public-safe internal failures.

Verification completed:

```bash
npm test -- --runTestsByPath __tests__/unit/api/shopProductsRoute.test.ts
npm run lint
npm run build
```

All commands passed. Build retained the existing MongoDB/fetcher/static
generation log noise documented by prior tasks.

## Escalate

Escalate to the orchestrator if:

- Current frontend shop filters submit values outside the canonical artwork
  constants.
- The route needs server-side sorting or pagination to satisfy existing UI
  expectations.
- Stored Shopify product IDs include non-numeric values that break existing
  listing behavior; product ID migration is a separate F-012 follow-up.

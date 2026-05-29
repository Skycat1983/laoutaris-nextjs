# T-339 Guard Public Shop Listing From Drafts

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Prevent generated Shopify draft or otherwise unavailable products from being
returned automatically by public product listing surfaces.

## Context

- T-338 created 430 Shopify products as `DRAFT` and intentionally did not write
  MongoDB `shopifyProducts` links.
- The owner confirmed on 2026-05-29 that draft products should not be returned
  automatically.
- The public shop page, public shop API, homepage/prototype shop sections,
  product sitemap, and explicit `type=shop-products` search all use
  `getShopProductList`.
- Artwork detail linked-product rendering already skips products that Shopify
  marks unavailable for sale.

## Scope

In scope:

- Update the shared public product-list service to return only Shopify products
  with `availableForSale: true`.
- Add focused unit coverage proving unavailable products are fetched safely but
  excluded from the returned list and metadata.
- Document that broad public list/search/sitemap surfaces must not expose
  unavailable generated drafts automatically.

Out of scope:

- Do not publish Shopify products.
- Do not write MongoDB `shopifyProducts` links.
- Do not change direct product-detail behavior for known handles.
- Do not change Storefront/Admin tokens, sales-channel publication, cart,
  checkout, Cloudinary, orders, customers, collections, publications, domains,
  aliases, Vercel state, or generated product data.
- Do not decide the long-term generated-product link model. T-340 later
  selected an explicit `publicListing` link flag.

## Concurrency

Do not run alongside another task editing
`src/lib/data/services/getShopProductList.ts` or the Shopify commerce trackers.
Can run in parallel with unrelated UI or route-builder work.

## Files Likely Touched

- `src/lib/data/services/getShopProductList.ts`
- `__tests__/unit/data/getShopProductList.test.ts`
- `docs/architecture/shopify-commerce.md`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-339-guard-public-shop-listing-from-drafts.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation, docs, and
  verification are done.
- Add dated completion notes under `Handoff Notes` with what changed, what
  remained intentionally out of scope, and exact verification results.
- Update `docs/tasks/README.md`, Shopify commerce workstream, architecture,
  runbook, and orchestration state because this task changes public listing
  behavior.

## Acceptance Criteria

- Public product listing data excludes Shopify products where
  `availableForSale` is false.
- Public listing metadata counts only returned listable products.
- Existing product-type filters, deduplication, malformed ID skipping, Shopify
  fan-out error handling, and sorting remain unchanged.
- The owner can still reach direct product-detail URLs by handle where the
  product route resolves them; this task only guards broad automatic listing
  surfaces.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts
npm run lint
git diff --check
```

## Handoff Notes

- 2026-05-29: Updated `getShopProductList` to filter Shopify fan-out results
  through `availableForSale` before sorting and metadata calculation. This
  guards `/shop/products`, `/api/v2/public/shop/products`, homepage/prototype
  shop sections, dynamic product sitemap generation, and explicit
  `type=shop-products` public search because they share this service.
- 2026-05-29: Added unit coverage for an unavailable linked product being
  excluded from returned data and `totalProducts`.
- Still out of scope: publishing, MongoDB link writes, direct product-detail
  route policy, checkout/cart, and Shopify dashboard changes. T-340 later added
  the generated-product `publicListing` policy.
- Verification run on 2026-05-29:
  `npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts`
  passed with 7 tests; `npm run lint` passed; `git diff --check` passed.

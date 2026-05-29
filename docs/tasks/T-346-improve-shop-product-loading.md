# T-346 Improve Shop Product Loading

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce noisy Shopify product-list loading behavior and improve the public shop
grid loading experience after the pre-launch sale sample was activated.

## Context

- After T-345, the owner saw repeated Storefront product-fetch failures in the
  dev server logs and only the book appeared in the shop.
- The root cause was twofold:
  - all 215 generated print links were still app-listable even though only 25
    selected prints were active/published;
  - the selected products were first published to `Online Store`, but the app's
    Storefront API token needed the separate `Laoutaris Headless` publication.
- Once the data gates were corrected, the public API returned 36 products:
  1 book, 10 originals, and 25 prints.

## Completed Work

- Reset all print link `publicListing` values to `false`.
- Reapplied the T-345 sale sample so only 10 original links and 25 print links
  are public-listed.
- Published the 35 selected sale-sample products to `Laoutaris Headless`.
- Bounded public shop Storefront product fanout concurrency in
  `getShopProductList` to reduce transient `fetch failed` drops.
- Updated the shop grid to render the first 12 products initially and reveal
  more in batches of 12.
- Replaced the visible filter-update spinner overlay with product-card
  skeletons.
- Added `page`/`limit` validation to `/api/v2/public/shop/products` and
  `getShopProductList`, returning `page`, `limit`, `total`, and `totalPages`
  metadata alongside the existing shop counts.
- Replaced the temporary client-side "Show more" batcher with `useInfiniteScroll`
  loading against the paginated public API, including product-card skeletons and
  retry state for next-page failures.
- Kept filters, sort, `publicListing`, and `availableForSale` behavior backed by
  the shared service. The current service still fetches/sorts eligible Shopify
  products before slicing so availability and route-backed sort metadata remain
  authoritative.

## Verification

```bash
curl -sS http://localhost:3000/api/v2/public/shop/products
npm test -- --runTestsByPath __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/data/getShopProductList.test.ts
npm test -- --runTestsByPath __tests__/unit/data/getShopProductList.test.ts __tests__/unit/api/shopProductsRoute.test.ts __tests__/unit/loaders/ShopProductsLoader.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/loaders/ShopPrototypeLoader.test.tsx __tests__/unit/loaders/ShopSectionLoader.test.tsx
npm run lint
npm run typecheck
git diff --check
```

## Handoff Notes

- The public product API returned 36 products: 1 book, 10 originals, and
  25 prints, with 0 selected sale-sample products missing.
- Public shop pagination is now API-backed offset pagination for returned
  products. A future larger-catalog task can replace the current full
  Shopify-resolution-before-slice implementation with cursor-backed Shopify
  reads if the catalog size makes full fanout too expensive.

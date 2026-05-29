# T-343 Verify Generated Shopify Runtime Exposure

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Verify that generated Shopify draft links written to MongoDB do not expose the
generated catalog through broad public shop surfaces or artwork sale affordances.

## Context

- T-342 wrote generated original and print links to all 215 artworks with
  `publicListing: false`.
- Generated Shopify products remain `DRAFT`.
- Broad shop listing and public shop search should not expose generated draft
  products.
- Artwork detail should not show purchase affordances when all linked generated
  products are unavailable.

## Scope

In scope:

- Run the local Next app with current `.env`.
- Check `/api/v2/public/shop/products`.
- Check `/shop/products`.
- Check explicit shop search for a generated product title.
- Check an artwork with only generated original/print links.
- Check a direct generated product detail route.
- Fix narrow runtime issues found by this verification.

Out of scope:

- Do not publish Shopify products.
- Do not mutate Shopify, MongoDB, Cloudinary, orders, customers, collections,
  publications, domains, aliases, Vercel state, checkout/cart behavior, or
  generated Shopify product data.
- Do not perform broad browser automation, screenshots, traces, or visual QA.

## Acceptance Criteria

- Public shop API/listing does not include generated original/print handles.
- Explicit `type=shop-products` search does not include generated original/
  print handles.
- Artwork detail for an artwork with only generated unavailable links renders no
  purchase section.
- Direct generated product route is non-purchase.
- Focused tests cover the artwork purchase-section behavior.

## Verification

```bash
set -a; source .env; set +a; npm run dev -- -p 3020
curl -sS http://localhost:3020/api/v2/public/shop/products
curl -sS http://localhost:3020/shop/products
curl -sS 'http://localhost:3020/search?q=No.003&type=shop-products'
curl -sS http://localhost:3020/artwork/68f89a8ae81cb7291cef5e33
curl -sS -o /tmp/generated-product.html -w '%{http_code}' http://localhost:3020/shop/products/joseph-laoutaris-print-no003-1cef5e33
npm test -- --runTestsByPath __tests__/unit/artworkShopSectionServerProducts.test.tsx __tests__/unit/scripts/linkShopifyCatalogProductsHelpers.test.js __tests__/unit/data/getShopProductList.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts
npm run lint
npm run typecheck
git diff --check
```

## Handoff Notes

- 2026-05-29: Runtime verification found `/api/v2/public/shop/products`
  returns 1 product, the preserved book
  `the-complete-artwork-of-joseph-laoutaris`, and does not return generated
  original/print handles.
- 2026-05-29: `/shop/products` contained the preserved book and did not contain
  generated No.003 original/print handles.
- 2026-05-29: Explicit shop search
  `/search?q=No.003&type=shop-products` rendered the no-match state and did
  not contain generated No.003 original/print handles.
- 2026-05-29: Direct generated print route
  `/shop/products/joseph-laoutaris-print-no003-1cef5e33` returned the
  route-local not-found/non-purchase surface with no Shopify purchase or cart
  affordance.
- 2026-05-29: Verification surfaced one narrow runtime issue: artwork detail
  rendered the `Available for Purchase` shell when an artwork had
  `shopifyProducts` links but all linked products were skipped server-side as
  unavailable. `ArtworkShopSection` now returns `null` unless at least one
  resolved original, print, or book product is present.
- 2026-05-29: After the fix, `/artwork/68f89a8ae81cb7291cef5e33` contained no
  `Available for Purchase`, generated product handle, Shopify purchase, or
  `Add to Cart` text.
- Verification passed with 69 focused tests, lint, typecheck, and whitespace.

# T-111 Render Artwork Shop Links Server Side

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Render linked Shopify product summaries for artwork detail pages in initial
server HTML instead of relying on `ArtworkShopSection` client-side product
fetches after mount.

## Context

- F-090 found artwork-to-shop discovery is client-side: `ArtworkShopSection`
  reads `artwork.shopifyProducts` and fetches each linked product from
  `/api/v2/public/shop/products/[productId]` in `useEffect`.
- T-085 established `getShopProductList` as the server-only pattern for shop
  listing reads, and T-110 codified `/artwork/[artworkId]` and
  `/collections/[slug]/[artworkId]` as explicitly dynamic route-local pages.
- Product detail pages already server-render linked archive context. This task
  should make the reverse archive-to-product relationship discoverable in the
  initial artwork detail response.
- Commerce remains enquiry-only. Do not add checkout/cart, offer JSON-LD,
  shipping/refund/payment claims, or variant-selection UI.

## Scope

- In scope:
  - Add a server-only helper/service that resolves an artwork's
    `shopifyProducts` links into grouped `SimpleProduct` summaries using
    existing Shopify product ID normalization and `getProductById`.
  - Preserve existing malformed/missing product behavior by skipping invalid,
    unavailable, or failed Shopify products without failing the artwork page.
  - Pass resolved product summaries from `ArtworkLoader` and
    `CollectionArtworkLoader` into the artwork view path.
  - Refactor `ArtworkShopSection` so it renders from server-provided product
    summaries and no longer performs client-side product fetches in
    `useEffect`.
  - Keep the current visible section text, product links, prices, badges, and
    empty/no-product behavior unless a tiny copy adjustment is necessary to
    remove loading-only language.
  - Add focused tests proving linked products are resolved server-side, client
    fetches are removed from `ArtworkShopSection`, grouped original/print/book
    rendering is preserved, and invalid/failed product links are skipped.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Checkout/cart, variant selection, Shopify hosted checkout, or purchase
    policy changes.
  - Product structured-data `Offer`, availability, shipping, refund, payment,
    guarantee, or legal claims.
  - Public shop pagination, server-side sorting, or rich `descriptionHtml`
    rendering.
  - Admin Shopify product-link validation or verification workflows.
  - Route cache/ISR policy, metadata/sitemap expansion, or Cloudinary delivery
    transformations.

## Files Likely Touched

- `src/lib/data/services/` for a new artwork-linked product service/helper
- `src/components/loaders/viewLoaders/ArtworkLoader.tsx`
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
- `src/components/views/ArtworkView.tsx`
- `src/components/modules/cards/ArtworkShopSection.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-111-render-artwork-shop-links-server-side.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Artwork detail pages can render linked product summaries from server-provided
  data in the initial route render.
- `ArtworkShopSection` no longer imports `useEffect`, performs browser
  `fetch()`, or calls `/api/v2/public/shop/products/[productId]`.
- Original, print, and book groups preserve current link targets, labels,
  prices, and no-product empty behavior.
- Failed, missing, or malformed linked Shopify product IDs are skipped without
  breaking the artwork page.
- Focused tests cover the server resolver and the refactored section behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getArtworkShopProducts.test.ts __tests__/unit/artworkShopSectionServerProducts.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx
npm run lint
npm run build
git diff --check
```

Completed verification:

- `npm test -- --runTestsByPath __tests__/unit/data/getArtworkShopProducts.test.ts __tests__/unit/artworkShopSectionServerProducts.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx`
- `npm run lint`
- `npm run build`
- `git diff --check`

## Handoff Notes

- Prepared after T-110 completed public route cache policy.
- Completed 2026-05-18: `getArtworkShopProducts` now resolves artwork-linked
  Shopify summaries server-side, `ArtworkLoader` and
  `CollectionArtworkLoader` pass grouped summaries into `ArtworkView`, and
  `ArtworkShopSection` renders those summaries without browser product fetches.
- Keep checkout/cart, commerce legal/policy copy, product `Offer` structured
  data, route cache/ISR migration, Cloudinary delivery transformations, and
  dynamic sitemap/discovery smoke work separate.

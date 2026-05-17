# T-098 Add Admin Shopify Product-Link Verification

Status: Completed

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Content, Assets, And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Let admin operators verify linked Shopify product IDs from the artwork
create/update workflow before saving, without making product existence checks a
hard persistence dependency.

## Context

- T-097 added the visible admin form workflow for adding, editing, removing,
  and clearing canonical `shopifyProducts` links.
- T-082 and T-097 validate link shape, product type, trimming, and duplicate
  prevention, but they still do not tell an operator whether a numeric product
  ID actually exists in Shopify.
- `GET /api/v2/public/shop/products/[productId]` already validates numeric
  product IDs, converts them to Shopify GIDs, and fetches the current Shopify
  product summary.
- Product existence verification can improve operator confidence without
  coupling artwork persistence to Shopify availability, Storefront latency, or
  transient upstream failures.

## Scope

- In scope:
  - Add a typed client fetcher for the existing public single-product-by-ID
    route, or a small admin wrapper only if existing admin conventions clearly
    require it.
  - Extend `ShopifyProductLinksInput` with explicit verification controls for
    one link and, if practical, all current links.
  - Only run verification on operator action; do not call Shopify on every
    keystroke.
  - Show clear per-link states for unchecked, checking, verified, not found,
    invalid local input, and upstream/error cases.
  - On success, show useful Shopify context such as title, handle,
    availability, product type, and/or price when returned by the existing
    product DTO.
  - Reset stale verification state when a link's product ID or product type is
    edited.
  - Keep create/update submission governed by the local schema and T-082 route
    validation. Verification failures should warn operators, not block saving
    unless a focused implementation reason is documented.
  - Add focused tests for the client fetcher and admin input verification
    behavior.
  - Keep T-097 form tests and T-082 admin artwork route tests passing.
  - Update this task brief, Shopify architecture/runbook notes if needed, and
    Shopify/content/testing workstreams after completion.
- Out of scope:
  - Automatic product-link data migration or mutation of existing MongoDB
    artwork records.
  - Calling Shopify from admin artwork create/update route handlers before
    persistence.
  - Checkout/cart implementation or product-detail CTA changes.
  - Public shop pagination, server-side sorting, or richer product-detail UI.
  - Cloudinary upload policy, route-level API logging, or global logging
    policy.

## Files Likely Touched

- `src/lib/api/public/clientPublicApi.ts`
- `src/lib/api/public/shop/fetchers.ts`
- `src/components/features/adminDashboard/inputs/ShopifyProductLinksInput.tsx`
- `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx`
- `__tests__/unit/api/publicShopFetchers.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`
- `__tests__/unit/api/shopSingleProductRoute.test.ts`
- `docs/architecture/shopify-commerce.md`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-098-add-admin-shopify-product-link-verification.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/content-assets-and-admin-ops.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Admin artwork create/update product-link rows expose an explicit product
  verification action.
- Empty, non-numeric, or locally invalid IDs do not trigger a network request
  and show a local validation/verification message.
- A successful check displays returned Shopify product context for that row.
- Missing products and upstream failures display public-safe operator messages.
- Editing a checked row clears stale verification status for that row.
- Save behavior remains governed by the form schema and route validation; the
  task does not make Shopify availability a required persistence dependency.
- Focused tests cover fetcher URL/response behavior, successful verification,
  local invalid input, missing/upstream failures, and stale-state reset.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/publicShopFetchers.test.ts __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
npm run build
rg -n "shopifyProducts|verify|verification" src/components/features/adminDashboard/inputs src/lib/api/public __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx
git diff --check
```

## Handoff Notes

- Completed after T-097 closed the visible admin product-link add/edit/remove
  workflow.
- Added `clientPublicApi.shop.productById()` for the existing public
  single-product route and wired per-row verification in
  `ShopifyProductLinksInput`.
- Verification remains operator-triggered and advisory. Missing or upstream
  failures warn but do not block artwork create/update save.
- Stale verification is cleared when a row's product ID or type changes.
- Verification passed with the focused T-098/T-097/T-082 Jest set,
  `npm run lint`, `npm run build`, the scoped verification reference search,
  and the diff check. Build emitted the existing Browserslist caniuse-lite
  notice.
- Persistence-time Shopify validation, migration, checkout/cart, pagination,
  Cloudinary policy, and logging policy remain out of scope.

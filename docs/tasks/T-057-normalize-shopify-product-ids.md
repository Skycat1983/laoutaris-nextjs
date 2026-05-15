# T-057 Normalize Shopify Product IDs

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Centralize numeric Shopify product ID validation/GID construction and apply it
to public Shopify product reads so malformed stored product links cannot produce
malformed Shopify API requests.

## Context

- F-012 tracks that Shopify product IDs are documented as numeric but are not
  consistently validated or normalized.
- T-004 made the public single-product route reject non-numeric path IDs, but
  that route owns its own regex and GID construction.
- The public shop listing route still blindly builds
  `gid://shopify/Product/${productId}` from stored `artwork.shopifyProducts`
  values, so legacy GID-style or non-numeric stored values can be sent upstream.
- `docs/architecture/shopify-commerce.md` and
  `docs/runbooks/shopify-operations.md` define MongoDB `productId` values as
  numeric Shopify product IDs, with full GIDs constructed only at Shopify API
  call boundaries.

## Scope

In scope:

- Add a small shared Shopify product ID helper for numeric product ID
  validation, path-param decoding/normalization where useful, and GID
  construction.
- Reuse the helper in
  `GET /api/v2/public/shop/products/[productId]` without changing its public
  success/error envelope.
- Reuse the helper in `GET /api/v2/public/shop/products` so invalid stored
  product links are ignored before `getProductById()` is called.
- Deduplicate listing product fetches after normalization.
- Add focused tests covering:
  - valid numeric IDs still construct the same Shopify GIDs,
  - invalid path IDs still return `400` before Shopify work,
  - invalid stored listing IDs are skipped without calling Shopify,
  - duplicate IDs dedupe after normalization.
- Update Shopify architecture/runbook notes only if the implementation changes
  or clarifies the operating rule.
- Update this task, linked workstreams, findings, risks, and orchestration state
  after completion.

Out of scope:

- Do not add admin Shopify product-linking UI or admin product-link persistence.
- Do not migrate or mutate existing MongoDB data.
- Do not implement checkout/cart, variant selection, product availability
  policy, or Shopify admin workflows.
- Do not change the public shop listing success envelope, sorting,
  pagination, product transform, or filter UI.
- Do not add global production logging/redaction policy changes beyond any
  route-local test stubbing needed for the touched code.

## Files Likely Touched

- `src/lib/data/types/shopifyTypes.ts` or a focused helper near
  `src/lib/api/shopify/`
- `src/app/api/v2/public/shop/products/[productId]/route.ts`
- `src/app/api/v2/public/shop/products/route.ts`
- `__tests__/unit/api/shopSingleProductRoute.test.ts`
- `__tests__/unit/api/shopProductsRoute.test.ts`
- Optional focused helper test if the helper is not covered through route tests
- `docs/architecture/shopify-commerce.md`
- `docs/runbooks/shopify-operations.md`

## Acceptance Criteria

- Shopify numeric product ID validation and GID construction are not duplicated
  between the public single-product and listing routes.
- The single-product route still returns `400` for invalid path IDs and does not
  call Shopify for invalid input.
- The listing route never calls Shopify with a malformed GID derived from
  stored `shopifyProducts` values.
- Listing duplicates are removed after product ID normalization.
- Valid listing behavior and the existing success envelope are preserved.
- Admin linking, data migration, checkout/cart, and visible shop UI remain
  unchanged.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/shopProductsRoute.test.ts
npm run lint
npm run build
```

If a separate helper test is added, include it in the focused Jest command and
record the final command in the handoff notes.

## Handoff Notes

- Completed on 2026-05-15.
- Added `src/lib/api/shopify/productIds.ts` to centralize numeric Shopify
  product ID normalization, route-param decoding, and Shopify product GID
  construction.
- Updated `GET /api/v2/public/shop/products/[productId]` to use the shared
  helper while preserving the existing success and error envelopes.
- Updated `GET /api/v2/public/shop/products` to normalize stored
  `shopifyProducts.productId` values before deduplication and to skip invalid
  stored IDs before any Shopify `getProductById()` call.
- GID-style, empty, and non-numeric stored values are ignored by public listing
  reads rather than being interpolated into malformed Shopify GIDs. No MongoDB
  data migration or admin linking behavior was added.
- Added focused route coverage for malformed decoded path IDs, invalid stored
  listing IDs skipped before Shopify calls, and post-normalization
  deduplication.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/api/shopProductsRoute.test.ts`,
  `npm run lint`, and `npm run build`. Build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug log
  noise.

## Escalate

Escalate to the orchestrator if:

- Stored Shopify IDs need an automatic MongoDB migration to complete the runtime
  behavior.
- The task requires deciding admin product-linking workflow, checkout/cart
  ownership, or product listing source of truth.
- Shopify GID values must be accepted as persisted `productId` values instead
  of rejected/ignored as legacy invalid data.

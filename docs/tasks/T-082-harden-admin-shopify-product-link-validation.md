# T-082 Harden Admin Shopify Product Link Validation

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Use the completed T-059 data audit to confirm the shared book-link policy, then
harden the admin-side Shopify product-link validation boundary so future writes
preserve numeric product IDs, known product types, and no within-artwork
duplicates.

## Context

- T-059 ran `npm run audit:shopify-products` against the owner-approved MongoDB
  Atlas `laoutarisDB` target and exited `0`.
- The audit scanned 215 artworks, found 92 artworks with Shopify links and 99
  total Shopify links, and reported 0 invalid product IDs, 0 unknown product
  types, and 0 within-artwork duplicates.
- The only reportable duplicate was one review-only cross-artwork duplicate:
  `type=book`, `productId=10538937319688`, `artworkCount=92`, and
  `linkCount=92`.
- The Shopify architecture and runbook allow books to appear on multiple
  artworks when the book legitimately features those artworks.
- F-010/R-021 still track that the admin Shopify product-link workflow and
  validation are missing.
- F-012/R-023 remain partially mitigated until future admin writes cannot
  reintroduce malformed product IDs, unknown types, or duplicate links.

## Scope

In scope:

- Confirm with the owner whether the shared book product link reported by T-059
  is intentional.
- If the owner confirms the shared book link is intentional, document that
  cross-artwork duplicates are allowed for `type: "book"` when they represent a
  legitimate shared publication.
- Add or update the admin product-link validation boundary for artwork writes so
  persisted `shopifyProducts` links use numeric `productId` values, one of the
  known types (`original`, `print`, `book`), and no duplicate product IDs within
  one artwork.
- Preserve the existing public-read behavior that skips malformed stored IDs
  before Shopify fan-out.
- Add focused validation tests for valid links, non-numeric IDs, GID-style IDs,
  unknown or missing types, and within-artwork duplicates.
- Update the affected workstreams, findings, risks, and Shopify runbook based
  on the final validation behavior.

Out of scope:

- Do not mutate existing MongoDB data.
- Do not remove the shared book link unless the owner explicitly rejects it and
  a separate cleanup task is prepared.
- Do not call Shopify APIs to validate product existence or availability.
- Do not implement checkout/cart or variant-selection UI.
- Do not add a full admin product-linking UI unless the existing admin artwork
  workflow already has a scoped input path for these links.

## Files Likely Touched

- `src/lib/data/schemas/artworkSchema.ts`
- `src/app/api/v2/admin/artwork/create/route.ts`
- `src/app/api/v2/admin/artwork/update/[id]/route.ts`
- Focused admin artwork route/schema tests under `__tests__/unit/`
- `docs/runbooks/shopify-operations.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- Owner policy for the T-059 shared book duplicate is recorded without changing
  data.
- Admin artwork writes reject malformed Shopify product links before
  persistence.
- Numeric product IDs and known product types remain the canonical persisted
  contract.
- Within-artwork duplicate product IDs are rejected.
- Shared book links across multiple artworks are not globally rejected when the
  owner confirms the book policy.
- No MongoDB data migration or Shopify API validation is performed.

## Verification

Run the narrowest focused tests first, then broaden:

```bash
npm test -- --runTestsByPath <focused admin product-link validation tests>
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared from T-059 evidence on 2026-05-17.
- If the owner rejects the shared book link, prepare a separate cleanup task
  with the exact owner-approved desired MongoDB changes before any mutation.

## Completion

Completed on 2026-05-17.

- Recorded the shared book-link policy without mutating MongoDB: book products
  may be linked from multiple artworks when the book legitimately features
  those artworks. The T-059 duplicate group for
  `type=book`, `productId=10538937319688` remains a valid review-only
  cross-artwork duplicate under that policy.
- Added strict admin artwork create/update validation for `shopifyProducts`.
  Submitted links must use trimmed numeric `productId` values, known product
  types (`original`, `print`, `book`), and no duplicate product IDs within the
  submitted artwork.
- Kept public-read behavior unchanged: malformed stored IDs are still skipped
  before public Shopify fan-out by the existing public shop product ID
  normalization.
- Updated focused admin artwork route coverage for valid links, non-numeric
  IDs, GID-style IDs, missing/unknown types, and within-artwork duplicate
  product IDs.
- No MongoDB data migration, Shopify API validation, checkout/cart work, or
  full visible admin product-linking UI was performed.

Verification run on 2026-05-17:

- `npm test -- --runTestsByPath __tests__/unit/api/adminArtworkRoute.test.ts`
  passed with 29 tests.
- `npm run lint` passed.
- `npm run build` passed. Existing build-time MongoDB/static-generation and
  `links` debug output remains unrelated known noise.
- `git diff --check` passed.

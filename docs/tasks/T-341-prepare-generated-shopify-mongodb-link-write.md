# T-341 Prepare Generated Shopify MongoDB Link Write

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Prepare the confirmation-gated MongoDB link phase for generated Shopify
original and print products, and produce the read-only owner-review plan before
any live MongoDB write.

## Context

- T-338 created 430 generated Shopify products as `DRAFT`.
- T-339 and T-340 prevent generated products from appearing in broad public shop
  listing surfaces automatically.
- The owner approved writing generated original/print links for all 215
  artworks with `publicListing: false` by default.
- The live write must preserve existing book links and replace existing
  original/print links with the generated products.

## Scope

In scope:

- Add a command for generated Shopify product linking:
  `npm run link:shopify-catalog-products`.
- Plan mode reads the post-create reconciliation report and MongoDB artworks,
  then writes a local report without mutating MongoDB, Shopify, or Cloudinary.
- Write mode is available only with exact
  `LINK_GENERATED_SHOPIFY_PRODUCTS` confirmation.
- The desired link set per artwork contains generated original and print links
  with `publicListing: false`, plus preserved existing book links.
- Add focused helper tests for confirmation gating, exact-match validation,
  non-public generated links, book preservation, duplicate rejection, and dirty
  reconciliation refusal.
- Run the read-only plan against the current MongoDB target and record evidence.

Out of scope:

- Do not run write mode without the exact confirmation.
- Do not publish Shopify products or write Shopify sales-channel publications.
- Do not mutate Cloudinary, orders, customers, collections, publications,
  domains, aliases, Vercel state, checkout/cart behavior, or generated Shopify
  product data.
- Do not add visible admin public-listing toggles.
- Do not change direct product-detail route behavior.

## Concurrency

Do not run alongside another task writing MongoDB artwork `shopifyProducts` or
editing the Shopify catalog scripts. Can run in parallel with unrelated visual
QA or route-builder work.

## Files Likely Touched

- `package.json`
- `scripts/link-shopify-catalog-products.mjs`
- `scripts/link-shopify-catalog-products-helpers.cjs`
- `__tests__/unit/scripts/linkShopifyCatalogProductsHelpers.test.js`
- `docs/tasks/T-341-prepare-generated-shopify-mongodb-link-write.md`
- `docs/tasks/README.md`
- `docs/runbooks/shopify-operations.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/orchestration/state.md`

Generated reports under `reports/` are local evidence and should remain
uncommitted unless the owner explicitly asks for a committed artifact.

## Acceptance Criteria

- Plan mode writes a local report and performs no MongoDB writes.
- Write mode refuses to run without exact confirmation.
- Every planned artwork has exactly one generated original link and one
  generated print link with `publicListing: false`.
- Existing book links are preserved.
- Existing original/print links are reported as replaced.
- Dirty reconciliation reports, missing artworks, invalid IDs, duplicate
  desired product IDs, and non-exact matches block the plan before writes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/linkShopifyCatalogProductsHelpers.test.js
npm run lint
npm run typecheck
git diff --check
```

## Handoff Notes

- 2026-05-29: Added `npm run link:shopify-catalog-products` with plan and
  write modes. Plan mode is read-only. Write mode updates MongoDB
  `artworks.shopifyProducts` only after
  `--confirm=LINK_GENERATED_SHOPIFY_PRODUCTS`.
- 2026-05-29: Added helper coverage for argument/confirmation gates, exact
  generated link extraction, `publicListing: false` defaults, existing book-link
  preservation, already-linked detection, duplicate product rejection, and dirty
  reconciliation refusal.
- 2026-05-29: Ran read-only plan mode against the current MongoDB target using
  `reports/shopify-catalog-post-draft-create-reconciliation-report.json`.
  Output: `reports/shopify-catalog-mongodb-link-plan.json`. Result:
  215 artworks scanned, 215 artworks to update, 430 generated links planned,
  0 public generated links planned, 92 existing book links preserved, and
  7 existing original/print links scheduled for replacement.
- Live MongoDB write remains blocked until the owner provides the exact
  confirmation string `LINK_GENERATED_SHOPIFY_PRODUCTS`.
- The owner later provided the exact confirmation and the live write was run
  under [T-342](T-342-run-generated-shopify-mongodb-link-write.md).
- Verification run on 2026-05-29:
  `npm test -- --runTestsByPath __tests__/unit/scripts/linkShopifyCatalogProductsHelpers.test.js __tests__/unit/data/getShopProductList.test.ts __tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx __tests__/unit/api/adminArtworkRoute.test.ts`
  passed with 65 tests; `npm run lint` passed; `npm run typecheck` passed;
  `git diff --check` passed.

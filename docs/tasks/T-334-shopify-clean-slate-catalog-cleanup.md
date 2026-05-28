# T-334 Shopify Clean-Slate Catalog Cleanup

Status: Completed

Workstream: [Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Add a guarded Shopify Admin cleanup command that reports every Shopify product,
keeps book/publication products, classifies all other valid products as delete
candidates, and permits live deletion only after owner approval of the dry-run
report plus the exact confirmation string.

## Context

- The live T-330 pilot created 10 draft Shopify products.
- The owner wants a clean-slate catalog cleanup before continuing generated
  catalog work.
- Books/publications must be preserved.
- MongoDB artwork data and Cloudinary assets are explicitly out of scope.

## Scope

- Add a read path that paginates all Shopify Admin products.
- Classify book/publication products from product type, tags, handle/title
  markers, or `custom.featured_artwork_ids`.
- Classify all valid non-book products as delete candidates, including old
  manual originals/prints and the 10 pilot products.
- Write a local dry-run report by default.
- Add focused unit tests for classification and deletion safety.
- Gate live `productDelete` behind
  `DELETE_ALL_NON_BOOK_SHOPIFY_PRODUCTS`.

Out of scope:

- Running live deletion.
- Mutating MongoDB or Cloudinary.
- Editing Shopify books/publications, orders, customers, collections,
  publications, domains, checkout, cart, or runtime UI.

## Files Touched

- `package.json`
- `scripts/cleanup-shopify-clean-slate-catalog.mjs`
- `scripts/cleanup-shopify-clean-slate-catalog-helpers.cjs`
- `__tests__/unit/scripts/cleanupShopifyCleanSlateCatalogHelpers.test.js`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/tasks/T-334-shopify-clean-slate-catalog-cleanup.md`

## Acceptance Criteria

- `npm run cleanup:shopify-clean-slate-catalog` defaults to dry-run mode and
  writes `reports/shopify-clean-slate-catalog-cleanup-report.json`.
- The report includes every fetched Shopify product, its classification,
  action, safety flags, and summary counts.
- Book/publication products are kept and never receive a delete action.
- Valid non-book products receive `would_delete_product` in dry-run and
  `delete_product` only in guarded delete mode.
- Delete mode refuses to run unless
  `--confirm=DELETE_ALL_NON_BOOK_SHOPIFY_PRODUCTS` is present exactly.
- The command never reads or writes MongoDB or Cloudinary.

## Verification

```bash
node --check scripts/cleanup-shopify-clean-slate-catalog.mjs
node --check scripts/cleanup-shopify-clean-slate-catalog-helpers.cjs
npm test -- --runTestsByPath __tests__/unit/scripts/cleanupShopifyCleanSlateCatalogHelpers.test.js __tests__/unit/scripts/cleanupShopifyManualCatalogHelpers.test.js
git diff --check
```

## Handoff Notes

- Completed on 2026-05-28.
- Added `npm run cleanup:shopify-clean-slate-catalog`.
- Did not run the Shopify live deletion mode.
- Did not mutate MongoDB or Cloudinary.
- Did not generate the Shopify dry-run report in this shell because
  `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_VERSION`, and
  `SHOPIFY_ADMIN_ACCESS_TOKEN` were not exported.
- Focused Jest verification passed: 2 suites, 10 tests.
- `node --check` passed for the new CLI and helper files.
- `git diff --check` passed.
- The dry-run command requires owner-approved Shopify Admin `read_products`
  credentials. Delete mode additionally requires an owner-approved
  `write_products` token and the exact confirmation string after the owner
  approves the dry-run report.

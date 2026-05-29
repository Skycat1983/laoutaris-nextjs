# T-342 Run Generated Shopify MongoDB Link Write

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Run the confirmed MongoDB write that links generated Shopify original and print
products to every artwork with `publicListing: false`, while preserving existing
book links.

## Context

- T-338 created 430 generated Shopify products as `DRAFT`.
- T-340 added `publicListing` support so generated links can exist without
  broad public shop exposure.
- T-341 added the guarded link command and produced the read-only plan:
  215 artworks to update, 430 generated non-public links, 92 preserved book
  links, 7 existing original/print links replaced.
- The owner provided the exact confirmation string:
  `LINK_GENERATED_SHOPIFY_PRODUCTS`.

## Scope

In scope:

- Run `npm run link:shopify-catalog-products` in write mode with the exact
  confirmation.
- Write only MongoDB `artworks.shopifyProducts`.
- Preserve existing book links.
- Write generated original and print links with `publicListing: false`.
- Run read-only post-write plan verification.
- Run the existing Shopify product-link audit.

Out of scope:

- Do not publish Shopify products.
- Do not mutate Shopify products, sales-channel publications, Cloudinary,
  orders, customers, collections, publications, domains, aliases, Vercel state,
  checkout/cart behavior, or generated Shopify product data.
- Do not add visible admin public-listing toggles.
- Do not change direct product-detail route behavior.

## Acceptance Criteria

- Live write updates all planned artworks without failures.
- Post-write plan reports zero artworks still needing update.
- Generated original/print links remain `publicListing: false`.
- Existing book links remain preserved.
- Product-link audit reports zero invalid product IDs, zero unknown product
  types, and zero within-artwork duplicates.

## Verification

```bash
set -a; source .env; set +a; npm run link:shopify-catalog-products -- --mode=write --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json --output=reports/shopify-catalog-mongodb-link-write-report.json --confirm=LINK_GENERATED_SHOPIFY_PRODUCTS
set -a; source .env; set +a; npm run link:shopify-catalog-products -- --mode=plan --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json --output=reports/shopify-catalog-mongodb-link-post-write-check.json
set -a; source .env; set +a; npm run audit:shopify-products
git diff --check
```

## Handoff Notes

- 2026-05-29: Live MongoDB write completed with
  `LINK_GENERATED_SHOPIFY_PRODUCTS`. Report:
  `reports/shopify-catalog-mongodb-link-write-report.json`.
- Write result: 215 artworks scanned, 215 artworks updated, 430 generated links
  planned, 0 public generated links planned, and 92 existing book links
  preserved.
- Post-write read-only verification report:
  `reports/shopify-catalog-mongodb-link-post-write-check.json`. Result:
  215 artworks scanned, 0 artworks to update, 0 public generated links planned,
  and 92 book links preserved.
- Shopify product-link audit after the write exited `0`: 215 artworks scanned,
  215 artworks with Shopify links, 522 total links, 0 invalid product IDs,
  0 unknown product types, 0 within-artwork duplicates, and 1 expected
  cross-artwork duplicate group for the preserved shared book product
  `10538937319688` across 92 artworks.
- No Shopify products were published or mutated. No Cloudinary, order, customer,
  collection, publication, domain, alias, Vercel, checkout/cart, or generated
  product data mutation was performed.

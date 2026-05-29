# T-344 Set Generated Print Links Public Listed

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make all generated print links eligible for broad app listing by setting their
MongoDB `publicListing` flag to `true`, while leaving generated originals hidden
by default and leaving Shopify product status/publication untouched.

## Context

- T-342 linked generated originals and prints to all artworks with
  `publicListing: false`.
- The owner clarified that all prints should be app-listed, and day-to-day
  on/off control can happen through Shopify product status/publication.
- Shopify `Draft`/`Active` remains separate from the app-side
  `publicListing` flag.

## Scope

In scope:

- Add a reusable guarded script for setting `publicListing` by link type.
- Run a read-only plan for print links.
- Run confirmed write mode for print links after exact owner confirmation.
- Run post-write read-only verification.
- Run the existing Shopify product-link audit.

Out of scope:

- Do not activate or publish Shopify products.
- Do not change original or book link listing flags.
- Do not mutate Cloudinary, orders, customers, collections, publications,
  domains, aliases, Vercel state, checkout/cart behavior, or generated Shopify
  product data.
- Do not add an admin UI toggle.

## Acceptance Criteria

- Every print link has `publicListing: true`.
- Generated original links remain hidden unless separately changed.
- Existing book links remain unchanged.
- Product-link audit reports zero invalid product IDs, zero unknown product
  types, and zero within-artwork duplicates.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/setShopifyProductLinkListingHelpers.test.js
set -a; source .env; set +a; npm run set:shopify-link-listing -- --mode=plan --type=print --public-listing=true --output=reports/shopify-print-public-listing-plan.json
set -a; source .env; set +a; npm run set:shopify-link-listing -- --mode=write --type=print --public-listing=true --output=reports/shopify-print-public-listing-write-report.json --confirm=SET_SHOPIFY_PRODUCT_LINK_PUBLIC_LISTING
set -a; source .env; set +a; npm run set:shopify-link-listing -- --mode=plan --type=print --public-listing=true --output=reports/shopify-print-public-listing-post-write-check.json
set -a; source .env; set +a; npm run audit:shopify-products
```

## Handoff Notes

- 2026-05-29: Added `npm run set:shopify-link-listing`, which can plan or
  write `publicListing` changes for one Shopify link type. Write mode requires
  exact `SET_SHOPIFY_PRODUCT_LINK_PUBLIC_LISTING` confirmation.
- 2026-05-29: Read-only print plan found 215 print links, 215 links to change,
  and 215 artworks to update.
- 2026-05-29: After owner confirmation, write mode updated 215 artworks and
  changed 215 print links to `publicListing: true`.
- 2026-05-29: Post-write plan found 215 print links scanned and 0 links left to
  change.
- 2026-05-29: Product-link audit exited `0`: 215 artworks scanned, 522 total
  links, 0 invalid product IDs, 0 unknown product types, 0 within-artwork
  duplicates, and the expected shared book cross-artwork duplicate group.
- Shopify products were not activated or published. Generated print products
  still require Shopify `Active`/Storefront availability before broad app
  listing will show them.

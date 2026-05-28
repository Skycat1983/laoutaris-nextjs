# T-331 Shopify Manual Product Cleanup Plan

Status: Complete

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Prepare a guarded cleanup step for manually created Shopify original/print
products before programmatic catalog generation creates replacement draft
products from MongoDB.

The cleanup must only target existing Shopify products identified by the
read-only reconciliation report as manually created artwork originals or prints.
It must not touch MongoDB artworks, Cloudinary assets, book products, orders,
customers, collections, publications, domains, aliases, or Vercel state.

## Context

- T-328 planned one original and one print product for each MongoDB artwork.
- T-329 reconciled that plan against Shopify Admin in read-only mode.
- The live T-329 report generated on 2026-05-28 found 11 manual Shopify
  original/print products:
  - 10 clean manual matches that would otherwise be preserved;
  - 1 conflicted manual product, `no-214-original-artwork`, whose handle signals
    No.214 while its title says `No.104, Original Artwork`.
- The owner decided the hand-created original/print products are not necessary
  if the catalog can be generated programmatically.
- The owner also confirmed MongoDB artworks must never be deleted.

## Recommended Cleanup Policy

Use Shopify administrative containment before permanent deletion:

1. Archive or draft/unpublish the targeted manual original/print products.
2. Re-run read-only reconciliation and confirm those rows no longer block
   generation.
3. Create replacement generated products as `DRAFT`.
4. Permanently delete the old manual products only after the generated
   replacements are verified.

If the owner explicitly approves immediate deletion, the cleanup command may
delete only the allowlisted product IDs from the reconciliation report and must
write a local cleanup result report.

## Candidate Manual Products From The Latest Report

These are original/print candidates only. Book products are excluded.

| Shopify product ID | Handle | Title | Status |
| --- | --- | --- | --- |
| `10538862346504` | `joseph-laoutaris-fine-art-print-no-026` | `No.026, Limited Edition Print` | `ACTIVE` |
| `10538864476424` | `joseph-laoutaris-fine-art-print-no-034` | `No.034, Limited Edition Print` | `ACTIVE` |
| `10538865787144` | `joseph-laoutaris-fine-art-print-no-035` | `No.035, Limited Edition Print` | `ACTIVE` |
| `10538865983752` | `joseph-laoutaris-fine-art-print-no-040` | `No.040, Limited Edition Print` | `ACTIVE` |
| `10538863591688` | `joseph-laoutaris-fine-art-print-no-066` | `No.066, Limited Edition Print` | `ACTIVE` |
| `10538889052424` | `joseph-laoutaris-original-artwork-no-043` | `No.043, Original Artwork` | `ACTIVE` |
| `10538894098696` | `joseph-laoutaris-original-artwork-no-090` | `No.090, Original Artwork` | `ACTIVE` |
| `10538904518920` | `joseph-laoutaris-original-artwork-no-127` | `No.127, Original Artwork` | `ACTIVE` |
| `10538902159624` | `joseph-laoutaris-original-artwork-no-129` | `No.129, Original Artwork` | `ACTIVE` |
| `10538899177736` | `joseph-laoutaris-original-artwork-no-195` | `No.195, Original Artwork` | `ACTIVE` |
| `10548307624200` | `no-214-original-artwork` | `No.104, Original Artwork` | `DRAFT` |

## Implementation Shape

Add a narrowly scoped command such as:

```bash
npm run cleanup:shopify-manual-catalog -- \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --output=reports/shopify-manual-product-cleanup-report.json \
  --mode=archive \
  --confirm=ARCHIVE_MANUAL_ORIGINAL_PRINT_PRODUCTS
```

Optional destructive delete mode must require a different exact confirmation:

```bash
--mode=delete --confirm=DELETE_MANUAL_ORIGINAL_PRINT_PRODUCTS
```

Required environment:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_API_VERSION`
- `SHOPIFY_ADMIN_ACCESS_TOKEN` with the minimal Shopify Admin scope needed for
  the selected operation.

## Safety Requirements

- Default mode must be dry-run or archive, not delete.
- Reject execution unless the exact confirmation string is present.
- Read the product IDs only from the reconciliation report; do not discover a
  broader product set by title search during the write step.
- Reject products that look like books or lack original/print family evidence.
- Reject products not present in `manualNumberMatches` or conflict rows from
  the reconciliation report.
- Write a local result report with every attempted product ID, handle, previous
  status, action, Shopify response, and error.
- Do not persist, print, snapshot, or commit Admin API tokens.
- Do not mutate MongoDB or Cloudinary.

## Verification

Before live cleanup:

```bash
npm test -- --runTestsByPath <new-focused-test-file>
git diff --check
npm run lint
```

After live cleanup:

- Re-run `npm run reconcile:shopify-catalog`.
- Confirm the cleaned manual products no longer appear as manual matches or
  conflicts.
- Confirm book products remain untouched.
- Confirm generated replacement products are not created by this cleanup task.

## Next Agent Action

Implementation is complete. Review the dry-run cleanup report, then run archive
mode only with explicit owner approval for the exact candidate set and
`--confirm=ARCHIVE_MANUAL_ORIGINAL_PRINT_PRODUCTS`. Do not run permanent
deletion without a separate owner-approved task.

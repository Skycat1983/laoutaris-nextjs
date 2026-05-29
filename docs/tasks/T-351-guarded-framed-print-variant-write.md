# T-351 Guarded Framed Print Variant Write

Status: Completed preparation; live write not run

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Related docs:

- [T-350 Read-only framed print variant plan](T-350-read-only-framed-print-variant-plan.md)
- [T-349 Formula-Based Framed Print Pricing Proposal](T-349-formula-based-framed-print-pricing.md)
- [Framed print pricing owner approval packet](../prototypes/framed-print-pricing-owner-approval-packet.md)
- [Shopify Operations Runbook](../runbooks/shopify-operations.md)

## Goal

Prepare a guarded Shopify write command for the first framed-print variant
matrix, without running the live write. The command should consume the clean
T-350 variant plan, create a local write plan by default, and require exact
confirmation before any Shopify mutation.

## Owner Approval Boundary

The owner approved preparing the guarded write command on 2026-05-29. This is
not approval to run the live write.

Still blocked until a separate explicit owner approval:

- Running write mode.
- Creating Shopify variants.
- Writing Shopify prices.
- Mutating Shopify product options.
- Treating pixel-derived placeholder prices as launch-ready prices.

Always out of scope for this command:

- Shopify product status or publication changes.
- MongoDB mutation.
- Cloudinary mutation.
- Checkout/cart behavior.
- Orders or customers.

## Implementation

Added command:

```bash
npm run apply:framed-print-variants
```

Default mode is local plan mode:

```bash
npm run apply:framed-print-variants
```

Write mode exists but was not run:

```bash
npm run apply:framed-print-variants -- \
  --mode=write \
  --confirm=CREATE_FRAMED_PRINT_VARIANTS
```

Files added:

- `scripts/apply-framed-print-variants.mjs`
- `scripts/apply-framed-print-variants-helpers.cjs`
- `__tests__/unit/scripts/applyFramedPrintVariantsHelpers.test.js`

The command reads:

- `reports/framed-print-variant-plan.json`

The command writes:

- `reports/framed-print-variant-write-report.json`

## Current Plan Report

Plan mode was run on 2026-05-29 and wrote
`reports/framed-print-variant-write-report.json`.

Summary:

- Products planned: 25.
- Existing variants preserved: 25.
- Missing variants to create in future write: 100.
- Product option mutations planned: 25.
- Variant create mutations planned: 25.
- Write failures: 0.

The planned write flow per product is:

1. Create the `Mat` option with values `No mat` and `White mat` using
   `productOptionsCreate` and `LEAVE_AS_IS`.
2. Create the four missing variants using `productVariantsBulkCreate`.
3. Preserve the existing `Unframed / No mat` variant.

## Safety Gates

Write mode requires:

- `--mode=write`
- `--confirm=CREATE_FRAMED_PRINT_VARIANTS`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ADMIN_API_VERSION`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- a clean T-350 variant plan with:
  - 0 manual-review rows;
  - 0 Shopify read errors;
  - 0 missing formula rows;
  - 0 missing Shopify product IDs;
  - at least one missing variant to create.

Write mode stops after the first Shopify user error or request failure and
records a failed result row.

## Tests

Focused tests cover:

- plan-mode defaults;
- write-mode exact confirmation gate;
- local write-plan generation;
- creating the `Mat` option before missing variants;
- using an existing `Mat` option when present;
- rejecting variant plans with manual-review blockers;
- mutation-capable safety flags only in confirmed write mode.

## Verification

Commands run:

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/applyFramedPrintVariantsHelpers.test.js
npm run apply:framed-print-variants
```

Live write mode was not run.

## Next Agent Action

Review `reports/framed-print-variant-write-report.json` with the owner. If the
owner explicitly accepts the risk of creating visible/buyable placeholder-priced
variants on active Shopify products, run a separate live execution task with
the exact confirmation. Otherwise, wait for real framemaker prices or convert
the selected products back to a non-public/non-purchase state before running
write mode.

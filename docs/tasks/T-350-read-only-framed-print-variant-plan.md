# T-350 Read-Only Framed Print Variant Plan

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Related docs:

- [T-349 Formula-Based Framed Print Pricing Proposal](T-349-formula-based-framed-print-pricing.md)
- [Framed print pricing owner approval packet](../prototypes/framed-print-pricing-owner-approval-packet.md)
- [T-332 Frame option commerce model](T-332-frame-option-commerce-model.md)
- [Shopify Commerce Workstream](../workstreams/shopify-commerce.md)

## Goal

Create a read-only Shopify variant plan for the current 25 sale-sample print
products using the owner-approved first-pass frame/mat matrix and the T-349
formula audit. The output should show exactly which Shopify variants would be
created or preserved before any live Shopify write task exists.

## Owner Approval Source

The owner approved proceeding in chat on 2026-05-29 with a read-only variant
plan only.

Approved planning inputs:

- Frame packages: `Unframed`, `Black wood`, `Oak`.
- Held back: `White wood`.
- Mat profiles: `No mat`, `White mat`.
- Held back: `Wide white mat`.
- Invalid combination: `Unframed / White mat`.
- Rounding for planning: `none`.
- Formula rates: placeholder planning rates only.
- Scope: current 25 sale-sample prints.

Still blocked:

- Shopify variant creation or update.
- Shopify price writes.
- Shopify product status or publication changes.
- MongoDB or Cloudinary mutation.
- App-owned checkout/cart behavior.
- Treating pixel-derived prices as launch-approved live prices.

## Proposed Implementation

Add a read-only command, suggested name:

```bash
npm run plan:framed-print-variants
```

Inputs:

- `reports/framed-print-commerce-formula-audit.json`
- `reports/shopify-sale-sample-selection.json`
- Existing Shopify Admin credentials for read-only product/variant inspection.

Output:

- `reports/framed-print-variant-plan.json`

The command should:

1. Read the T-349 formula audit.
2. Filter to sale-sample print rows only.
3. Fetch current Shopify product option/variant state for those 25 print
   products.
4. Compare current Shopify variants with the approved matrix:
   - `Unframed / No mat`
   - `Black wood / No mat`
   - `Black wood / White mat`
   - `Oak / No mat`
   - `Oak / White mat`
5. Report preserve/create/update/manual-review actions.
6. Refuse to recommend live writes when product options are unexpected,
   variants are ambiguous, or existing variant prices conflict with the formula
   report.

## Required Report Shape

The report should include:

- generated timestamp;
- input paths;
- safety flags showing no mutation;
- owner approval snapshot;
- summary counts;
- one row per sale-sample print product;
- current Shopify product status and publication-relevant identifiers where
  available;
- current product options;
- current variant list with option values and prices;
- approved target variant rows from the T-349 formula audit;
- recommended action for each target variant:
  - `preserve_existing_variant`
  - `create_missing_variant`
  - `update_price_in_future_write`
  - `manual_review`
- warnings for:
  - missing Shopify product ID;
  - missing formula row;
  - unsupported option names;
  - unexpected existing frame/mat values;
  - duplicate variants;
  - price mismatch;
  - unavailable product state if relevant.

## Safety Requirements

- The command must not call Shopify mutations.
- The command must not write MongoDB.
- The command must not write Cloudinary.
- The command must not publish/unpublish products.
- The command must not change product status.
- The command must not create checkout/cart behavior.
- The command must redact tokens in errors and reports.
- A future write command must require a separate task, explicit owner approval,
  and exact confirmation.

## Testing Requirements

Focused unit tests should cover:

- selection is limited to sale-sample prints;
- target variant matrix comes from approved formula rows;
- existing `Unframed / No mat` variant is preserved;
- missing framed variants are planned as `create_missing_variant`;
- price mismatch is reported but not written;
- unexpected Shopify option names force `manual_review`;
- duplicate current variant combinations force `manual_review`;
- missing Shopify product IDs or formula rows produce warnings;
- report safety flags reject any mutation implication.

## Verification

Expected commands after implementation:

```bash
npm test -- --runTestsByPath <focused framed print variant plan tests>
npm run plan:framed-print-variants
npm run lint
npm run typecheck
git diff --check
```

If live Shopify read access is unavailable, the command should fail clearly
before any mutation and the handoff should record which credential/scope is
missing.

## Completed Implementation

Completed on 2026-05-29.

- Added `npm run plan:framed-print-variants`.
- Added `scripts/plan-framed-print-variants.mjs` and focused pure helpers in
  `scripts/plan-framed-print-variants-helpers.cjs`.
- The command reads `reports/framed-print-commerce-formula-audit.json` and
  `reports/shopify-sale-sample-selection.json`, fetches current Shopify Admin
  product option/variant state for the selected print product GIDs, and writes
  `reports/framed-print-variant-plan.json`.
- The report keeps read-only safety flags explicit: no Shopify mutations, no
  variant creation, no price writes, no publication/status changes, no MongoDB
  writes, no Cloudinary writes, and no checkout/cart behavior.
- Focused tests cover sale-sample print scoping, approved matrix filtering,
  `Unframed / No mat` preservation, missing framed variant planning, price
  mismatch reporting, unexpected option-name manual review, duplicate variant
  manual review, missing Shopify/formula warnings, and mutation-negative safety
  flags.

Latest generated report:

- Sale-sample print products: `25`.
- Products fetched from Shopify Admin: `25`.
- Target variant rows: `125`.
- `preserve_existing_variant`: `25`.
- `create_missing_variant`: `100`.
- `update_price_in_future_write`: `0`.
- `manual_review`: `0`.
- Shopify read errors: `0`.
- Missing formula rows: `0`.
- Missing Shopify product IDs: `0`.

The first sandboxed run wrote a report with 25 read failures because network
access was blocked. The approved network rerun succeeded and replaced the
report with the successful read-only plan above.

Verification run:

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/planFramedPrintVariantsHelpers.test.js
set -a; source .env; set +a; npm run plan:framed-print-variants
```

## Next Agent Action

Review `reports/framed-print-variant-plan.json` with the owner. Any future
Shopify variant creation or price write requires a separate task, explicit
owner approval, and an exact confirmation gate.

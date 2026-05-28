# T-329 Read-Only Shopify Catalog Reconciliation

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build Phase 2 of Shopify catalog generation: a read-only Shopify Admin
reconciliation command that compares the Phase 1 dry-run product plan with
existing Shopify products by proposed handle and by
`custom.mongodb_artwork_id`, plus manually created products by normalized
artwork number, then writes a local report for owner review before any product
creation, update, publish, delete, archive, or MongoDB linking work.

## Context

- Read [Shopify catalog generation](../architecture/shopify-catalog-generation.md),
  [Shopify operations runbook](../runbooks/shopify-operations.md), and
  [Shopify Commerce](../workstreams/shopify-commerce.md) before editing.
- T-328 completed Phase 1 as `npm run plan:shopify-catalog`.
- The current dry-run report at `reports/shopify-catalog-dry-run-plan.json`
  scanned 215 artworks, planned 215 original products and 215 print products,
  and reported 0 missing titles, 0 missing images, 0 duplicate generated
  handles, and 0 unsupported required data warnings.
- The Phase 1 report is local evidence only. Do not commit generated report
  files unless the owner explicitly asks for an evidence artifact.
- Shopify Admin GraphQL supports product lookup by handle via `productByHandle`
  and product search by metafield value via `products(query:
  "metafields.custom.mongodb_artwork_id:<value>")`.
- Shopify access scopes list `read_products` for Product/ProductVariant access.
  This task must not request or require `write_products`.
- A live read-only run on 2026-05-28 against `laoutaris.myshopify.com` wrote
  `reports/shopify-catalog-reconciliation-report.json` locally. The report
  scanned 215 artworks and 430 planned products, found 10 manual product
  matches to preserve, 416 no-match rows, 4 conflicts, and 0 query errors. The
  conflicts all trace to Shopify product `no-214-original-artwork`, whose
  handle signals No.214 while its title says `No.104, Original Artwork`.

## Scope

In scope:

- Add a read-only script, recommended npm command
  `npm run reconcile:shopify-catalog`, that accepts:
  - `--input=reports/shopify-catalog-dry-run-plan.json`
  - `--output=reports/shopify-catalog-reconciliation-report.json`
- Read only the Phase 1 plan file and Shopify Admin GraphQL product data.
- Query Shopify by both:
  - each planned product handle;
  - each artwork's `custom.mongodb_artwork_id` value.
- Query Shopify read-only by normalized artwork number from MongoDB titles such
  as `No.026` so manually created products with owner-preferred handles can be
  preserved before any generated-product creation task.
- Deduplicate Shopify products returned by both lookup paths.
- Produce a local JSON report that classifies existing-product matches,
  non-matches, conflicts, warnings, and owner/manual-review decisions.
- Add focused tests for input validation, query construction, match merging,
  conflict classification, token redaction, report shape, and no-mutation
  safety.
- Document the command in the Shopify operations runbook only if the source
  implementation is completed in this task.

Out of scope:

- Do not create, update, publish, delete, archive, or restore Shopify products.
- Do not write `shopifyProducts` links back to MongoDB.
- Do not mutate MongoDB, Cloudinary, Shopify Storefront data, Shopify Admin
  data, product status, prices, inventory, variants, images, metafields, tags,
  collections, publications, or sales-channel availability.
- Do not implement CSV import, `productSet`, bulk operations, pilot creation,
  pricing rules, fulfilment rules, listing rules, app-owned checkout/cart,
  variant option mapping, or dashboard automation.
- Do not use browser automation, production smoke, credentialed/admin smoke, or
  Vercel log inspection.
- Do not require `read_product_listings`, `read_inventory`, `write_products`,
  or any order/customer scopes for this reconciliation pass.

## Required Shopify Access

Required Shopify Admin API scope:

- `read_products`

Required environment variables:

- `SHOPIFY_STORE_DOMAIN`: the `.myshopify.com` store domain, without protocol.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: Admin API access token from an owner-approved
  custom app with `read_products` only.
- `SHOPIFY_ADMIN_API_VERSION`: pinned Admin GraphQL version. Use `2026-04`
  unless the implementation deliberately chooses a different currently
  supported version and records why.

Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this task. Do not print,
persist, snapshot, or commit `SHOPIFY_ADMIN_ACCESS_TOKEN`.

## Report Input Shape

The command should read the T-328 report shape:

```json
{
  "generatedAt": "2026-05-28T13:17:36.469Z",
  "mode": "dry_run",
  "summary": {
    "totalArtworksScanned": 215,
    "originalProductsPlanned": 215,
    "printProductsPlanned": 215
  },
  "artworks": [
    {
      "artworkId": "661fc617648efb163cffacee",
      "title": "No.002",
      "imageUrlPresent": true,
      "proposedOriginalHandle": "joseph-laoutaris-original-no002-3cffacee",
      "proposedPrintHandle": "joseph-laoutaris-print-no002-3cffacee",
      "customMongodbArtworkId": "661fc617648efb163cffacee",
      "warnings": [],
      "products": [
        {
          "productFamily": "original",
          "proposedHandle": "joseph-laoutaris-original-no002-3cffacee",
          "productType": "Original Artwork",
          "tags": ["original", "painting", "archive-artwork"],
          "inventoryQuantity": 1,
          "inventoryPolicy": "deny",
          "status": "draft_or_unpublished",
          "metafields": [
            {
              "namespace": "custom",
              "key": "mongodb_artwork_id",
              "value": "661fc617648efb163cffacee"
            }
          ],
          "warnings": []
        }
      ]
    }
  ]
}
```

Reject input that lacks `artworks`, lacks per-artwork `products`, lacks
`customMongodbArtworkId`, or contains products without `proposedHandle` and
`productFamily`.

## Report Output Shape

Write a JSON report with this shape:

```json
{
  "generatedAt": "2026-05-28T00:00:00.000Z",
  "mode": "read_only_shopify_reconciliation",
  "source": {
    "planInputPath": "reports/shopify-catalog-dry-run-plan.json",
    "shopDomain": "example.myshopify.com",
    "adminApiVersion": "2026-04"
  },
  "safety": {
    "readOnly": true,
    "shopifyMutationsAllowed": false,
    "mongoWritesAllowed": false,
    "cloudinaryWritesAllowed": false,
    "tokensPersisted": false
  },
  "summary": {
    "artworksScanned": 215,
    "plannedProductsScanned": 430,
    "plannedProductsWithExactMatch": 0,
    "plannedProductsWithHandleOnlyMatch": 0,
    "plannedProductsWithMetafieldOnlyMatch": 0,
    "plannedProductsWithManualProductMatch": 0,
    "plannedProductsWithNoMatch": 430,
    "plannedProductsWithConflict": 0,
    "shopifyProductsMatched": 0,
    "duplicateShopifyProductsByArtworkId": 0,
    "queryErrorCount": 0,
    "manualReviewCount": 0
  },
  "artworks": [
    {
      "artworkId": "661fc617648efb163cffacee",
      "title": "No.002",
      "customMongodbArtworkId": "661fc617648efb163cffacee",
      "artworkNumber": "002",
      "matchesByArtworkMetafield": [],
      "matchesByManualArtworkNumber": [],
      "products": [
        {
          "productFamily": "original",
          "proposedHandle": "joseph-laoutaris-original-no002-3cffacee",
          "matchStatus": "no_match",
          "recommendedAction": "safe_to_create_later",
          "handleMatch": null,
          "metafieldMatches": [],
          "manualNumberMatches": [],
          "conflicts": [],
          "warnings": []
        }
      ],
      "conflicts": [],
      "warnings": []
    }
  ],
  "queryErrors": []
}
```

Each Shopify product summary included in `handleMatch`, `metafieldMatches`,
`manualNumberMatches`, `matchesByArtworkMetafield`, or
`matchesByManualArtworkNumber` should include only non-secret fields needed for
review:

- `id` as Shopify GID;
- `legacyResourceId` as the numeric product ID when available;
- `handle`;
- `title`;
- `productType`;
- `status`;
- `tags`;
- `customMongodbArtworkId`;
- `totalInventory` only if available under `read_products`;
- `adminUrl` derived from the numeric product ID or omitted if not available.

## Conflict Handling

Classify each planned product with one of:

- `exact_match`: the same Shopify product is found by proposed handle and by
  matching `custom.mongodb_artwork_id`.
- `handle_only_match`: proposed handle exists, but the Shopify product has no
  `custom.mongodb_artwork_id`.
- `metafield_only_match`: a Shopify product has the artwork metafield but uses
  a different handle; preserve the Shopify handle in the report and do not
  propose a duplicate.
- `manual_product_match`: a manually created Shopify product has no matching
  MongoDB metafield yet, but cleanly matches the MongoDB artwork number and
  planned product family from handle, title, tags, or `productType`.
- `no_match`: no handle, exact metafield, or manual artwork-number lookup path
  finds a Shopify product for the planned product family.
- `conflict`: manual review is required before any later write task.
- `query_error`: Shopify lookup failed or returned GraphQL/user errors for this
  product or artwork.

Treat these as conflicts:

- Proposed handle exists on a Shopify product with a different
  `custom.mongodb_artwork_id`.
- More than one Shopify product has the same `custom.mongodb_artwork_id`.
- A Shopify product matched by metafield appears to represent both original and
  print, or cannot be assigned to the planned product family from handle,
  product type, or tags.
- More than one Shopify product matches the same artwork number and planned
  product family.
- A Shopify product matched by artwork number cannot be assigned to original or
  print from handle, title, tags, or `productType`.
- A handle match and metafield match return different Shopify products.
- Shopify returns malformed product IDs, missing handles, or invalid metafield
  values.

Recommended actions must stay non-mutating:

- `preserve_existing_product`
- `preserve_existing_manual_handle`
- `preserve_existing_manual_product`
- `safe_to_create_later`
- `manual_review_required`
- `retry_query_before_decision`

Products returned by the Shopify metafield search with null or non-matching
`custom.mongodb_artwork_id` are reported as ignored lookup results, not as
metafield matches.

## Safety Rules

- Default to read-only mode and require no flag that enables writes.
- The script must not contain Shopify GraphQL mutations.
- The script must fail fast if `SHOPIFY_ADMIN_ACCESS_TOKEN` is missing, but the
  token value must never appear in logs, errors, snapshots, reports, or tests.
- Redact `X-Shopify-Access-Token` and any access-token-like value from caught
  request errors before printing.
- Do not store raw GraphQL request headers in the report.
- Do not retry indefinitely. Use bounded retries only for transient Shopify
  responses if implemented, and report final failures as `query_error`.
- If any conflict or query error exists, exit non-zero after writing the report
  so automation cannot treat the reconciliation as clean.
- If all planned products are classified without conflicts or query errors,
  exit `0`.

## Concurrency

This task can run in parallel with non-Shopify source or docs tasks only if
write scopes stay separate.

This task owns:

- `scripts/reconcile-shopify-catalog-plan.mjs`
- `scripts/reconcile-shopify-catalog-plan-helpers.cjs`
- focused tests under `__tests__/unit/scripts/`
- `package.json` only for the new npm script
- `docs/runbooks/shopify-operations.md` only for the completed command note
- this task brief and `docs/tasks/README.md`

Leave shared tracker updates to the orchestrator unless the assignment
explicitly grants ownership of `docs/workstreams/*`,
`docs/orchestration/state.md`, `docs/audits/findings-register.md`, or
`docs/risks/production-readiness.md`.

## Files Likely Touched

- `scripts/reconcile-shopify-catalog-plan.mjs`
- `scripts/reconcile-shopify-catalog-plan-helpers.cjs`
- `__tests__/unit/scripts/reconcileShopifyCatalogPlanHelpers.test.js`
- `package.json`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-329-read-only-shopify-catalog-reconciliation.md`
- `docs/tasks/README.md`

## Acceptance Criteria

- The command reads the Phase 1 plan and Shopify Admin products without
  mutating Shopify, MongoDB, or Cloudinary.
- It queries existing Shopify products by proposed handle and by
  `custom.mongodb_artwork_id`.
- It preserves manually created Shopify products by reporting
  `metafield_only_match` or `manual_product_match` instead of proposing
  duplicate creation.
- It ignores Shopify metafield lookup products whose
  `custom.mongodb_artwork_id` is null or does not exactly match the MongoDB
  artwork ID being reconciled.
- It preserves clean manual original/print matches by normalized artwork number
  from MongoDB titles such as `No.026` against Shopify handle/title patterns
  such as `joseph-laoutaris-fine-art-print-no-026` and
  `joseph-laoutaris-original-artwork-no-043`.
- It reports handle/metafield mismatches, duplicate metafield matches, family
  ambiguity, ambiguous or multiple manual number matches, malformed Shopify
  data, and query errors as manual-review blockers.
- It produces a deterministic JSON report shape suitable for owner review and
  the later Phase 3 pilot-creation task.
- Tests prove the reconciliation logic without live Shopify or MongoDB access.

## Verification

Use focused local checks first:

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/reconcileShopifyCatalogPlanHelpers.test.js
git diff --check
```

If the implementation adds a CLI wrapper or package script, also run:

```bash
npm run lint
```

Run the live read-only command only with owner-approved Shopify Admin
credentials:

```bash
SHOPIFY_STORE_DOMAIN=<store>.myshopify.com \
SHOPIFY_ADMIN_API_VERSION=2026-04 \
SHOPIFY_ADMIN_ACCESS_TOKEN=<read-products-token> \
npm run reconcile:shopify-catalog -- \
  --input=reports/shopify-catalog-dry-run-plan.json \
  --output=reports/shopify-catalog-reconciliation-report.json
```

Do not paste token values into the task handoff. Summarize only the report path,
counts, conflicts, query errors, and exit code.

## Exact Next Implementation Prompt

```text
Read AGENTS.md, docs/README.md, docs/architecture/shopify-catalog-generation.md, docs/runbooks/shopify-operations.md, docs/workstreams/shopify-commerce.md, docs/tasks/T-328-build-shopify-catalog-dry-run-plan.md, and docs/tasks/T-329-read-only-shopify-catalog-reconciliation.md. Implement T-329 only: add a read-only Shopify Admin reconciliation command for the Phase 1 Shopify catalog dry-run report. It must read reports/shopify-catalog-dry-run-plan.json by default, query Shopify Admin GraphQL by proposed handle and custom.mongodb_artwork_id using only read_products credentials from SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_VERSION, and SHOPIFY_ADMIN_ACCESS_TOKEN, write reports/shopify-catalog-reconciliation-report.json, classify exact/handle-only/metafield-only/no-match/conflict/query-error outcomes, redact tokens, include focused unit tests, and update the Shopify operations runbook plus task brief handoff. Do not mutate Shopify, MongoDB, Cloudinary, runtime commerce UI, checkout/cart, prices, inventory, product publication state, or MongoDB shopifyProducts links. Do not request write_products. Verify with the focused Jest test, git diff --check, and lint if source changes require it.
```

## References

- <https://shopify.dev/docs/api/admin-graphql/latest/queries/productbyhandle>
- <https://shopify.dev/docs/api/admin-graphql/latest/queries/products>
- <https://shopify.dev/docs/api/usage/access-scopes>

## Handoff Notes

- Prepared on 2026-05-28 as a docs-only Phase 2 brief after T-328 completed
  the dry-run planner and the local dry-run report showed no missing-data or
  duplicate-handle warnings.
- Completed on 2026-05-28 with `npm run reconcile:shopify-catalog`, which
  reads the Phase 1 plan from
  `reports/shopify-catalog-dry-run-plan.json` by default, queries Shopify Admin
  by proposed handle and `custom.mongodb_artwork_id`, and writes
  `reports/shopify-catalog-reconciliation-report.json` by default.
- The command requires `SHOPIFY_STORE_DOMAIN`,
  `SHOPIFY_ADMIN_API_VERSION`, and `SHOPIFY_ADMIN_ACCESS_TOKEN` with
  `read_products` scope. It fails before Shopify lookup when required env vars
  are missing and redacts token-shaped values from caught errors.
- The report records read-only safety flags and never includes request headers
  or token values. The implementation has no Shopify GraphQL mutations and does
  not mutate Shopify, MongoDB, Cloudinary, publication state, prices,
  inventory, images, variants, tags, collections, or `shopifyProducts` links.
- Focused helper tests cover input validation, query construction,
  exact/handle-only/metafield-only/no-match classification, conflict and
  query-error classification, token redaction, report shape, and safety flags.
  Live Shopify execution was not run because this task was verified with
  network-free tests only.
- Corrected on 2026-05-28 so Shopify metafield search responses with null or
  different `custom.mongodb_artwork_id` values are ignored as metafield
  matches, and clean owner-created original/print products can be preserved by
  normalized artwork number without requiring Shopify write scopes.

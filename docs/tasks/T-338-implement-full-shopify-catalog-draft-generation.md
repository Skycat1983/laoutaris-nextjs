# T-338 Implement Full Shopify Catalog Draft Generation

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the guarded full-catalog Shopify draft-generation command after the
clean T-337 reconciliation, without running a live write unless the owner
explicitly approves the exact confirmation and approval input.

## Context

- T-334 reset Shopify to the two book/publication products.
- T-335 defined the generated original/print metadata mapping.
- T-336 applied that mapping to the dry-run planner.
- T-337 regenerated the expanded dry-run plan and read-only reconciliation:
  215 artworks, 430 planned products, 430 no-match rows, 0 conflicts, and
  0 query errors.
- Full-catalog creation must be idempotent, resumable, and gated separately
  from report generation.

## Scope

In scope:

- Add a command such as `npm run create:shopify-catalog-drafts`.
- Read the current dry-run plan:
  `reports/shopify-catalog-dry-run-plan.json`.
- Read the clean T-337 reconciliation report:
  `reports/shopify-catalog-reconciliation-report.json`.
- Require an owner approval input for global/default prices, product status,
  print quantity, inventory location, and MongoDB-linking policy.
- Refuse to run unless every selected original/print row is
  `matchStatus: "no_match"` with no conflicts, query errors, or manual-review
  blockers.
- Create only `DRAFT` Shopify products through Admin GraphQL when live mode is
  explicitly confirmed.
- Preserve one original product with inventory `1` and one print product with
  one `Frame package = Unframed` variant per artwork.
- Use existing archive image URLs as product media; do not upload or mutate
  Cloudinary.
- Write a local result report with created/skipped/failed counts, Shopify user
  errors, and enough product identity to resume or audit without storing tokens.
- Add focused helper/unit tests for input validation, confirmation gating,
  conflict refusal, mutation payload shape, token redaction, report shape, and
  no-more-than-planned product selection.
- Update the Shopify operations runbook and this task brief with command usage
  and handoff evidence.

Out of scope:

- Do not run the live command unless the owner explicitly approves the exact
  confirmation after reviewing the implementation.
- Do not publish products or assign sales-channel publication.
- Do not write MongoDB `shopifyProducts` links.
- Do not mutate Cloudinary, MongoDB, orders, customers, collections,
  publications, domains, aliases, Vercel state, checkout/cart behavior, or
  runtime UI.
- Do not create framed, material, or mat variants beyond
  `Frame package = Unframed`.
- Do not delete, archive, restore, or update the two book/publication products.
- Do not add collection joins, collection metadata, price rules, or browser
  automation.

## Concurrency

Do not run alongside another Shopify catalog-generation or Shopify write task.
Can run in parallel with unrelated route-builder or visual QA work only if
shared docs are not edited by both agents.

## Files Likely Touched

- `package.json`
- `scripts/create-shopify-catalog-drafts.mjs`
- `scripts/create-shopify-catalog-drafts-helpers.cjs`
- `__tests__/unit/scripts/createShopifyCatalogDrafts.test.ts`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-338-implement-full-shopify-catalog-draft-generation.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/orchestration/state.md` only if assigned by the orchestrator

Generated reports under `reports/` are local evidence and should remain
uncommitted unless the owner explicitly asks for a committed artifact.

## Acceptance Criteria

- The command exists and defaults to no mutation unless the exact confirmation
  is supplied.
- The command validates the plan, reconciliation report, approval input,
  Shopify Admin environment, selected products, DRAFT status, prices, inventory
  location, inventory quantities, variant policy, and output path before any
  mutation.
- The command refuses stale or dirty reconciliation input, conflicts, query
  errors, manual-review blockers, existing product matches, malformed image
  URLs, missing prices, non-DRAFT status, MongoDB-link writes, and any product
  count outside the plan.
- Focused tests cover guardrails and payload/report shape.
- Documentation records live-run prerequisites and explicitly blocks publishing,
  MongoDB linking, Cloudinary mutation, framed/material/mat variants, checkout,
  and browser automation.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/createShopifyCatalogDraftsHelpers.test.js __tests__/unit/scripts/reconcileShopifyCatalogPlanHelpers.test.js
npm run lint
git diff --check
```

Run broader verification only if the implementation touches shared runtime
source outside the command/helpers/tests/docs.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-29 after T-337 completed with clean
  read-only reconciliation evidence.
- Implemented `npm run create:shopify-catalog-drafts` with the exact
  `CREATE_FULL_CATALOG_DRAFT_PRODUCTS` confirmation gate, full-catalog approval
  input validation, clean-reconciliation checks, DRAFT-only `productSet`
  payloads, expanded T-336 metafields, one original plus one unframed print per
  artwork, token redaction, and local result reporting.
- Created local approval evidence at
  `reports/shopify-catalog-full-owner-approval.json` after owner approval in
  chat. It uses DRAFT status, original price `1000.00`, print price `100.00`,
  print quantity `50`, inventory location
  `gid://shopify/Location/112925409544`, and MongoDB linking disabled.
- Live run completed on 2026-05-29:
  `npm run create:shopify-catalog-drafts -- --plan=reports/shopify-catalog-dry-run-plan.json --reconciliation=reports/shopify-catalog-reconciliation-report.json --approval=reports/shopify-catalog-full-owner-approval.json --output=reports/shopify-catalog-draft-create-report.json --confirm=CREATE_FULL_CATALOG_DRAFT_PRODUCTS`.
  Result: 430 products created, 0 failed, 0 skipped.
- Post-create read-only verification report:
  `reports/shopify-catalog-post-draft-create-reconciliation-report.json`.
  Result after reconciling the expected original/print pair and duplicate title
  number heuristics: 215 artworks scanned, 430 planned products scanned, 430
  exact matches, 0 handle-only matches, 0 metafield-only matches, 0 manual
  matches, 0 no-match rows, 0 conflicts, and 0 query errors.
- No products were published. No MongoDB `shopifyProducts` links were written.
  No MongoDB, Cloudinary, book/publication, collection, checkout/cart, Vercel,
  order, customer, domain, alias, framed/material/mat variant, or runtime UI
  mutation was performed.
- Verification run:
  `npm test -- --runTestsByPath __tests__/unit/scripts/createShopifyCatalogDraftsHelpers.test.js __tests__/unit/scripts/reconcileShopifyCatalogPlanHelpers.test.js`
  passed with 17 tests. Earlier focused draft-helper test passed with 6 tests.
  `npm run lint` passed. `git diff --check` passed after final docs updates.
- Next step: scope a separate MongoDB linking and public listing policy task.
  The generated Shopify products are DRAFT and not connected to public archive
  listing behavior until that policy decides whether to link all generated
  products, only owner-selected products, or a staged subset.

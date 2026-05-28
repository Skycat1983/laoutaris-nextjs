# T-336 Expand Shopify Catalog Dry-Run Metadata

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-335 MongoDB-to-Shopify metadata mapping to the Phase 1 dry-run
planner so the next owner-reviewed catalog plan contains product fields, tags,
metafields, and exclusions needed for safe full-catalog draft generation.

## Context

- T-335 defines the accepted mapping in
  [Shopify catalog generation](../architecture/shopify-catalog-generation.md#catalog-metadata-mapping).
- The current dry-run planner projects only MongoDB `_id`, `title`, and
  `image`.
- Shopify was reset to the two book/publication products by T-334, so the next
  generated original/print catalog should be planned from the expanded metadata
  contract before any live write task runs.

## Scope

In scope:

- Update `npm run plan:shopify-catalog` to project MongoDB `_id`, `title`,
  `decade`, `artstyle`, `medium`, `surface`, `featured`, and selected
  `image` fields.
- Extend the report shape with generated product title, vendor, status,
  family/taxonomy tags, `custom` metafields from T-335, selected archive image
  metadata, and print-only edition quantity.
- Preserve original inventory `1`, print default/override quantity, inventory
  policy `deny`, existing handle policy, and one print variant
  `Frame package = Unframed`.
- Add warnings for missing or unsupported required metadata instead of
  inventing values.
- Add focused helper tests for taxonomy tag generation, metafield shape,
  optional artwork-number extraction, featured false/true behavior, print
  edition quantity, selected image metadata, and explicit exclusions.
- Update runbook text only if command behavior or report shape changes beyond
  the T-335 docs.

Out of scope:

- Do not call Shopify Admin API or Storefront API.
- Do not create, update, publish, delete, archive, or restore Shopify products.
- Do not mutate MongoDB or write `shopifyProducts` links.
- Do not upload, delete, transform, copy, rename, or otherwise mutate
  Cloudinary images.
- Do not add collection joins or collection metadata.
- Do not implement CSV import, Admin GraphQL writes, bulk operations, product
  publishing, active listing decisions, price rules, checkout/cart, framed/
  material/mat purchasable variants, browser automation, or live report
  approval.

## Concurrency

This task owns the dry-run planner implementation, focused tests, this task
brief, and any direct command/report-shape runbook updates. Do not edit T-335's
mapping decision except to fix factual drift discovered during implementation.

## Files Likely Touched

- `scripts/build-shopify-catalog-plan.mjs`
- `scripts/build-shopify-catalog-plan-helpers.cjs`
- `__tests__/unit/scripts/buildShopifyCatalogPlanHelpers.test.js`
- `docs/tasks/T-336-expand-shopify-catalog-dry-run-metadata.md`
- `docs/tasks/README.md`
- `docs/runbooks/shopify-operations.md` only if report details change

## Acceptance Criteria

- The dry-run report includes the T-335 product fields, tags, and metafields
  without requiring Shopify credentials.
- The planner explicitly omits `shopifyProducts`, user saved-item state,
  collection metadata, Cloudinary color analysis, and framed/material/mat
  variants.
- Generated print products still contain exactly one
  `Frame package = Unframed` variant.
- Tests prove the expanded mapping from pure helpers without requiring MongoDB,
  Shopify, or Cloudinary network access.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/buildShopifyCatalogPlanHelpers.test.js
git diff --check
```

Run `npm run lint` if implementation changes touch lint-covered JavaScript in a
way the focused tests do not parse.

## Handoff Notes

- Prepared on 2026-05-28 as the implementation follow-up to T-335. Keep the
  task dry-run only and source/report based.
- Completed on 2026-05-28. `npm run plan:shopify-catalog` now projects only
  the T-335 approved artwork identity, taxonomy, featured, and selected image
  fields; it does not project `shopifyProducts`, collection joins, user state,
  Cloudinary color/byte metadata, or other excluded fields.
- The dry-run report now includes generated product titles, vendor
  `Joseph Laoutaris`, `DRAFT` status, family and taxonomy tags, typed
  `custom` metafields, selected archive image metadata, explicit exclusions,
  print-only edition quantity, and exactly one print variant:
  `Frame package = Unframed`.
- Missing title, image URL, and required taxonomy metadata become warnings.
  Unsupported required metadata is also reported instead of being replaced with
  invented values.
- No Shopify Admin/Storefront command, MongoDB mutation, Cloudinary mutation,
  browser automation, live report approval, CSV import, or bulk write path was
  added or run.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/scripts/buildShopifyCatalogPlanHelpers.test.js`
    passed on 2026-05-28.
  - `npm run lint` passed on 2026-05-28.
  - `git diff --check` passed on 2026-05-28.

# T-328 Build Shopify Catalog Dry-Run Plan

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build the first phase of Shopify catalog generation: a dry-run script that
reads MongoDB artworks and writes a local product-plan report for original and
print Shopify products without contacting Shopify or mutating any data.

## Context

The owner confirmed on 2026-05-28:

- every MongoDB artwork can eventually have one original painting product;
- every MongoDB artwork can eventually have one print product;
- original inventory is `1`;
- print inventory defaults to `50`, but the number may change;
- not all generated products should be listed at the same time.

The phased strategy is documented in
[Shopify catalog generation](../architecture/shopify-catalog-generation.md).

## Scope

In scope:

- Read:
  - [Shopify catalog generation](../architecture/shopify-catalog-generation.md)
  - [Shopify commerce architecture](../architecture/shopify-commerce.md)
  - [Shopify operations runbook](../runbooks/shopify-operations.md)
  - current artwork model/type definitions.
- Add a dry-run script that reads artwork records from MongoDB using the
  existing project database connection pattern.
- Generate a local report with one proposed original product and one proposed
  print product per artwork.
- Include, at minimum:
  - MongoDB artwork ID;
  - artwork title;
  - proposed original handle;
  - proposed print handle;
  - product family;
  - proposed product type and tags;
  - proposed inventory quantity (`1` for original, configurable default `50`
    for print);
  - proposed `custom.mongodb_artwork_id` metafield value;
  - image URL presence;
  - warnings for missing title, missing image, duplicate generated handle, or
    unsupported required data.
- Support a CLI option or environment variable for print quantity default, with
  `50` as the default.
- Add focused tests for handle generation, inventory defaults, configurable
  print quantity, duplicate warning behavior, and report shape.
- Document the command in the Shopify operations runbook.

Out of scope:

- Do not call Shopify Admin API or Storefront API.
- Do not create, update, publish, delete, or archive Shopify products.
- Do not mutate MongoDB.
- Do not upload, delete, transform, or copy Cloudinary images.
- Do not write `shopifyProducts` links back to artwork records.
- Do not implement existing-product reconciliation, CSV import, GraphQL
  `productSet`, bulk operations, pricing rules, fulfilment rules, app-owned
  checkout/cart, variant option mapping, or product publishing.
- Do not run browser automation, production smoke, credentialed/admin smoke, or
  Vercel log inspection.

## Concurrency

Can run in parallel with T-326 and T-327 only if write scopes stay separate.
This task owns the dry-run script, its tests, this task brief, and the Shopify
operations runbook command note. Do not edit live Shopify dashboard state.

## Files Likely Touched

- `scripts/`
- `__tests__/unit/`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/T-328-build-shopify-catalog-dry-run-plan.md`
- `docs/tasks/README.md`
- relevant package script only if a new npm command is added

## Acceptance Criteria

- The script can produce a dry-run product plan without Shopify credentials.
- Original products use inventory quantity `1`.
- Print products use default quantity `50`, with an override path.
- The report is explicit enough for owner review before any Shopify write task.
- Tests prove the planner behavior without requiring MongoDB or Shopify network
  access.

## Verification

Use the narrowest focused checks:

```bash
npm test -- --runTestsByPath <new-focused-test-file>
git diff --check
```

Run `npm run lint` if the implementation adds or changes TypeScript/JavaScript
source that lint covers.

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, verification
results, `docs/tasks/README.md`, and direct runbook notes for the new command.
List candidate risk/workstream changes in the handoff if broader tracker edits
are needed.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after the owner confirmed original
  and print generation rules.
- This task must remain dry-run only. Live Shopify write tasks must be
  separately scoped after the owner reviews the generated product plan.
- Completed on 2026-05-28 with `npm run plan:shopify-catalog`, which reads
  MongoDB artworks and writes a local JSON dry-run report without Shopify
  credentials or MongoDB/Shopify/Cloudinary mutation.
- Added pure planner coverage for handle generation, original inventory `1`,
  default print inventory `50`, CLI/env print quantity parsing, duplicate
  generated handle warnings, safety flags, metafield shape, missing title
  warnings, and missing image warnings.
- The default output path is `reports/shopify-catalog-dry-run-plan.json`, and
  `/reports` is gitignored to reduce accidental report commits.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/scripts/buildShopifyCatalogPlanHelpers.test.js`
    passed on 2026-05-28.
  - `git diff --check` passed on 2026-05-28.
  - `npm run lint` passed on 2026-05-28.
- Out of scope remains unchanged: no Shopify Admin/Storefront calls, no live
  product writes, no MongoDB link writes, no existing-product reconciliation,
  no pricing rules, and no publishing/listing behavior.

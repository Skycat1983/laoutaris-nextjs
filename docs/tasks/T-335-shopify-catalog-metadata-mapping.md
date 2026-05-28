# T-335 Shopify Catalog Metadata Mapping

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)

## Goal

Define the metadata contract for generated Shopify original and print products
before the full MongoDB artwork catalog is uploaded again.

## Context

- T-334 reset Shopify to a clean catalog state except for the two
  book/publication products.
- The current dry-run planner mostly projects MongoDB `_id`, `title`, and
  `image`.
- MongoDB remains the archive source of truth; Shopify should receive only
  commerce-safe artwork metadata needed for product identity, filtering,
  reconciliation, and future operation.
- Every MongoDB artwork should eventually be able to create one original
  product with inventory `1` and one print product with default quantity `50`.
- Generated products should remain `DRAFT` until the owner chooses which items
  are actively listed.

## Scope

In scope:

- Read:
  - [Shopify catalog generation](../architecture/shopify-catalog-generation.md)
  - [Shopify commerce architecture](../architecture/shopify-commerce.md)
  - [Shopify operations runbook](../runbooks/shopify-operations.md)
  - current artwork model/schema/constants.
- Decide which MongoDB artwork fields are safe and useful to include in the
  generated catalog plan.
- Split selected fields into:
  - Shopify product fields;
  - Shopify tags;
  - Shopify metafields;
  - fields intentionally excluded.
- Include clear recommendations for `decade`, `artstyle`, `medium`, `surface`,
  `featured`, archive image metadata, artwork number/title, print edition
  quantity, and frame variant policy.
- Decide whether collection metadata should be included immediately or scoped
  as a later collection-join task.
- Update durable docs with the accepted mapping and any follow-up tasks.

Out of scope:

- Do not run Shopify Admin or Storefront API commands.
- Do not create, update, publish, delete, archive, or restore Shopify products.
- Do not mutate MongoDB.
- Do not upload, delete, transform, copy, or rename Cloudinary images.
- Do not write `shopifyProducts` links back to MongoDB.
- Do not implement planner code changes, bulk creation, collection joins,
  CSV import, GraphQL writes, product publishing, checkout/cart, framed/material
  variants, or browser automation.

## Concurrency

Can run in parallel only with unrelated source or audit tasks that do not edit
Shopify catalog generation docs. This task owns:

- `docs/tasks/T-335-shopify-catalog-metadata-mapping.md`
- `docs/architecture/shopify-catalog-generation.md`
- `docs/runbooks/shopify-operations.md`

The assigned agent may update `docs/tasks/README.md` and
`docs/workstreams/shopify-commerce.md` if it creates the follow-up T-336 brief.
Leave `docs/orchestration/state.md` to orchestrator reconciliation unless
explicitly assigned.

## Files Likely Touched

- `docs/tasks/T-335-shopify-catalog-metadata-mapping.md`
- `docs/architecture/shopify-catalog-generation.md`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`

## Completion Contract

- Mark this task `Status: Completed` only after the metadata mapping is
  recorded in durable docs and any follow-up implementation task is clearly
  scoped.
- Add dated completion notes under `Handoff Notes`.
- If creating T-336, keep it implementation-only and dependent on this mapping.
- List any unresolved owner decisions separately from implementable defaults.
- Leave unrelated dirty files alone.

## Acceptance Criteria

- The accepted mapping identifies which MongoDB fields become Shopify product
  fields, tags, and metafields.
- The mapping explicitly excludes user-specific/private fields such as
  favourites, watcher lists, and existing MongoDB `shopifyProducts` links.
- The mapping keeps generated print products to the current
  `Frame package = Unframed` policy and does not introduce framed/material/mat
  variants.
- The mapping records whether collection metadata is included now or deferred.
- The next implementation task can update the dry-run planner without guessing
  field ownership.

## Verification

```bash
git diff --check
```

No runtime test is required for this docs-only task.

## Accepted Mapping Summary

The durable mapping is recorded in
[Shopify catalog generation](../architecture/shopify-catalog-generation.md#catalog-metadata-mapping).

Implementable defaults:

- Project MongoDB `_id`, `title`, `decade`, `artstyle`, `medium`, `surface`,
  `featured`, and selected archive image metadata
  (`secure_url`, `public_id`, `pixelWidth`, `pixelHeight`, `format`).
- Generate family-specific Shopify product titles from the MongoDB artwork
  title: `<title> - Original Artwork` and `<title> - Fine Art Print`.
- Set Shopify product fields for handle, title, vendor `Joseph Laoutaris`,
  product type, `DRAFT` status, product media from the existing archive image
  URL, inventory policy `deny`, original inventory `1`, print default quantity
  `50`, and one print variant `Frame package = Unframed`.
- Add family/taxonomy tags: `archive-artwork`, family tags,
  `decade-<decade>`, `artstyle-<artstyle>`, `medium-<medium>`,
  `surface-<surface>`, and `featured-artwork` only when `featured` is true.
- Add `custom` metafields for MongoDB artwork ID, exact artwork title,
  optional normalized artwork number, taxonomy values, `featured`, selected
  archive image metadata, and print-only edition quantity.
- Exclude `shopifyProducts`, watcher/favourited/user saved-item state,
  collection metadata, Cloudinary color/byte metadata, framed/material/mat
  purchasable options, generated MongoDB link writes, sale copy, price rules,
  publishing, checkout/cart, and owner listing decisions.

Collection metadata is deferred to a later collection-join task because it
requires joining collection documents and deciding how multi-collection
artworks should map to Shopify taxonomy.

## Follow-Up Task

- [T-336 Expand Shopify catalog dry-run metadata](T-336-expand-shopify-catalog-dry-run-metadata.md)
  is scoped as the implementation-only planner update that applies this
  mapping without Shopify, MongoDB, or Cloudinary mutations.

## Owner Decisions Still Open

- Final prices and any price rule source.
- Which generated draft products become actively listed or published.
- Whether collection title/slug/section metadata should become Shopify tags,
  metafields, collections, or remain archive-only.
- Future framed/material/mat purchasable option labels, prices, fulfilment
  handling, and app-to-Shopify mappings.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-28 after the owner accepted the
  recommendation to map MongoDB metadata before bulk draft upload.
- Completed on 2026-05-28 as docs-only metadata mapping. Updated catalog
  generation architecture, Shopify commerce architecture, and the Shopify
  operations runbook. Created T-336 for the implementation-only dry-run planner
  expansion.
- No Shopify Admin/Storefront commands, MongoDB mutations, Cloudinary
  operations, browser automation, or runtime source changes were run.
- Verification:
  - `git diff --check` passed on 2026-05-28.

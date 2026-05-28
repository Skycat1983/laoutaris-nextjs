# T-330 Shopify Catalog Pilot Creation Plan

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Prepare the docs-only Phase 3 plan for creating a small Shopify catalog pilot:
five owner-approved artworks, each with one draft/unpublished original product
and one draft/unpublished print product.

The future live-write implementation must create at most:

- 5 original products;
- 5 print products;
- 10 Shopify products total.

## Context

- [Shopify catalog generation](../architecture/shopify-catalog-generation.md)
  defines Phase 3 as a small owner-approved pilot before bulk draft generation.
- [Shopify operations](../runbooks/shopify-operations.md) requires numeric
  product IDs in MongoDB links and keeps Shopify as the commerce source of
  truth for status, price, inventory, availability, checkout URL, and
  fulfilment settings.
- T-328 completed the dry-run planner. The local dry-run report generated on
  2026-05-28 scanned 215 artworks, planned 215 original products and 215 print
  products, and reported 0 missing titles, 0 missing images, 0 duplicate
  generated handles, and 0 unsupported required data warnings.
- T-329 completed the read-only reconciliation command. A live read-only run on
  2026-05-28 found 10 existing manual products to preserve, 416 planned
  products with no match, 4 conflicts, and 0 query errors. Before any Phase 3
  write, confirm that the selected pilot rows have no conflicts or query
  errors and are not part of the `no-214-original-artwork` manual conflict.

## Owner Approval Gate

The live-write pilot must not run until the owner provides a written pilot
approval record with these fields for exactly five artworks:

| Artwork | Required owner decision |
| --- | --- |
| MongoDB artwork ID | Exact `_id` from the dry-run plan. |
| Artwork title | Human-readable confirmation for owner review. |
| Original price | Final or placeholder owner-approved price in the store currency. |
| Print price | Final or placeholder owner-approved price in the store currency. |
| Product status | Recommended value: Shopify `DRAFT`. Any active/unpublished alternative needs a separate approval note. |
| MongoDB linking | Recommended value: no MongoDB `shopifyProducts` writes in Phase 3. If owner wants links now, record that as a separate linking task after product creation. |
| Print edition quantity | Default `50` unless the owner provides a per-artwork override. |
| Print variant matrix | Exactly one `Frame package = Unframed` variant per print product. Framed, material, and mat variants require a later owner-approved option-mapping task. |
| Inventory location | Shopify inventory location GID/name to receive the original and print inventory quantities. |
| Existing-product handling | Confirm every pilot product is `no_match` with `recommendedAction: "safe_to_create_later"` in the reconciliation report. Existing-product preservation or update work is a separate task. The global report may contain unrelated manual-review conflicts, but the selected pilot rows must not. |

Blank approvals, title-only approvals, or chat statements that omit prices,
status, linking, and inventory location are not sufficient.

## Pilot Selection Rules

- Select only artworks present in the Phase 1 dry-run report.
- Select only artworks whose original and print planned products are clean in
  the Phase 2 reconciliation report.
- Prefer rows with `matchStatus: "no_match"` and
  `recommendedAction: "safe_to_create_later"` for both original and print.
- Do not create a product for any row with `conflict`, `query_error`, duplicate
  Shopify product matches, missing/mismatched `custom.mongodb_artwork_id`, or
  an unapproved existing manual product.
- Do not substitute a sixth artwork during execution. If one pilot row is
  blocked, stop and produce a failed pilot report for owner review.

## Product Creation Rules

Create one product per planned product row using the dry-run handle policy:

```text
joseph-laoutaris-original-<artwork-slug>-<short-artwork-id>
joseph-laoutaris-print-<artwork-slug>-<short-artwork-id>
```

Original product defaults:

- Product type: `Original Artwork`.
- Tags: `original`, `painting`, `archive-artwork`.
- Status: Shopify `DRAFT`.
- Sales-channel publications: none.
- Inventory quantity: `1`.
- Inventory policy: deny purchase when sold out.
- Price: owner-approved original price.
- Metafield: `custom.mongodb_artwork_id = <MongoDB artwork _id>`.

Print product defaults:

- Product type: `Fine Art Print`.
- Tags: `print`, `fine-art-print`, `archive-artwork`.
- Variants: exactly one `Frame package = Unframed` variant.
- Status: Shopify `DRAFT`.
- Sales-channel publications: none.
- Inventory quantity: owner-approved override or default `50`.
- Inventory policy: deny purchase when sold out.
- Price: owner-approved print price.
- Metafield: `custom.mongodb_artwork_id = <MongoDB artwork _id>`.

## Media Rules

- Use the existing archive image URL from the dry-run plan as the Shopify
  product image source.
- Use the same source image for the original and print unless the owner supplies
  a separate approved print image.
- Do not mutate, upload, delete, rename, or transform Cloudinary assets.
- Do not generate new room-context, frame, or mockup media for this pilot.
- If Shopify rejects an image source, stop that product and include the rejected
  image URL, product family, and Shopify user error in the pilot report.

## Metafield And Linking Rules

- Every created product must include `custom.mongodb_artwork_id`.
- Do not invent additional required app metafields in this task.
- Use Shopify product type and tags to distinguish original and print family.
- Do not write MongoDB `shopifyProducts` links by default.
- If the owner explicitly approves MongoDB linking for the pilot, implement it
  as a separate, post-creation task that stores only numeric Shopify product
  IDs with `type` values of `original` or `print`.

## Implementation Shape

The future implementation should add a narrowly scoped command, for example:

```bash
npm run create:shopify-catalog-pilot -- \
  --plan=reports/shopify-catalog-dry-run-plan.json \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --approval=reports/shopify-catalog-pilot-owner-approval.json \
  --output=reports/shopify-catalog-pilot-create-report.json \
  --confirm=CREATE_DRAFT_PILOT_PRODUCTS
```

Required environment:

- `SHOPIFY_STORE_DOMAIN`: the `.myshopify.com` store domain without protocol.
- `SHOPIFY_ADMIN_API_VERSION`: pinned Admin GraphQL API version, currently
  `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: owner-approved Admin API token with
  `write_products`.

The command must fail before any Shopify mutation unless:

- `--confirm=CREATE_DRAFT_PILOT_PRODUCTS` is present exactly;
- the approval file contains exactly five artwork IDs;
- every approved artwork has original and print prices;
- every approved artwork has an explicit status decision of `DRAFT`;
- the inventory location is present;
- the reconciliation report has no conflicts or query errors for the selected
  ten planned products;
- no selected product already exists;
- the command can write a local result report path.

## Result Report

The live-write implementation must write a local report with:

- generated timestamp;
- input plan path, reconciliation path, approval path, and shop domain;
- safety flags;
- selected artwork IDs and titles;
- per-product proposed handle and product family;
- owner-approved prices and inventory quantities;
- Shopify mutation result, product GID, numeric product ID, handle, status, and
  admin URL;
- image attachment result;
- metafield result;
- inventory result;
- user errors and skipped rows;
- explicit statement that MongoDB and Cloudinary were not mutated.

Do not commit generated report files unless an owner-reviewed evidence artifact
is explicitly requested.

## Verification Plan

Local verification before any live write:

```bash
npm test -- --runTestsByPath <new-focused-test-file>
git diff --check
npm run lint
```

Live pilot verification after creation:

- Re-run the command in a no-op/read-back mode or run a separate read-only
  Admin verification against the ten created product handles.
- Confirm every created product is Shopify `DRAFT`.
- Confirm no selected product is published to Online Store or another sales
  channel.
- Confirm original inventory is `1`.
- Confirm print inventory is the owner-approved quantity or default `50`.
- Confirm inventory policy denies overselling.
- Confirm prices match the owner approval record.
- Confirm `custom.mongodb_artwork_id` matches the MongoDB artwork ID.
- Confirm images are present or the report records the exact Shopify image
  error.
- Confirm the public Storefront/API path does not expose the draft/unpublished
  pilot products.
- Confirm MongoDB `shopifyProducts` links were not changed unless a separately
  approved linking task ran.

Browser automation is not required for the write task. If a visual check is
approved later, keep it targeted to specific handles and avoid broad traces,
videos, full DOM dumps, or large screenshot sets.

## Rollback Expectations

Because the pilot creates draft/unpublished products, the default rollback is
administrative containment, not automatic deletion:

- created products remain `DRAFT`;
- no sales-channel publications should exist;
- failed or partial rows are recorded in the result report;
- reruns must detect already-created pilot products and avoid duplicates;
- MongoDB links should not exist unless a separate linking task was approved;
- if MongoDB links were separately created, rollback requires a separate
  owner-approved MongoDB unlink task;
- archiving or deleting Shopify products is a separate owner-approved operation
  and must not be part of the pilot creation command.

If any product is accidentally created as active or published, stop further
writes, set the product back to `DRAFT` or remove publications in Shopify Admin,
record the product IDs and timestamps in the pilot report, and do not continue
without owner review.

## Out Of Scope

- Bulk creation beyond the 10 pilot products.
- Public product publishing.
- Shopify sales-channel publication writes.
- MongoDB `shopifyProducts` link writes.
- Cloudinary mutations.
- Product deletion or archival.
- Checkout/cart implementation.
- Variant option mapping beyond the single `Frame package = Unframed` print
  variant needed for price and inventory.
- Framed print preview option persistence.
- Product page UI or public search/listing changes.
- Browser automation unless separately approved.

## Acceptance Criteria

- The future task can create exactly 10 draft/unpublished Shopify products for
  five owner-approved artworks.
- The command is blocked without explicit owner approval and exact confirmation.
- Product status, price, media, metafield, inventory, and idempotency behavior
  are testable before live Shopify writes.
- The result report is sufficient to verify the pilot and support rollback
  decisions.
- MongoDB and Cloudinary remain untouched by the pilot creation task.

## Exact Gated Live-Write Implementation Prompt

```text
Read AGENTS.md, docs/README.md, docs/architecture/shopify-catalog-generation.md, docs/runbooks/shopify-operations.md, docs/workstreams/shopify-commerce.md, docs/tasks/T-328-build-shopify-catalog-dry-run-plan.md, docs/tasks/T-329-read-only-shopify-catalog-reconciliation.md, and docs/tasks/T-330-shopify-catalog-pilot-creation-plan.md. Implement T-330 only as the Phase 3 Shopify catalog pilot creation command. Before writing code, confirm the task remains gated on an owner approval file for exactly five MongoDB artwork IDs, original and print prices, Shopify DRAFT status, no MongoDB linking by default, print quantities, one `Frame package = Unframed` print variant, and inventory location. Add a command such as npm run create:shopify-catalog-pilot that reads the Phase 1 plan, the Phase 2 reconciliation report, and the owner approval file; fails unless --confirm=CREATE_DRAFT_PILOT_PRODUCTS is present exactly; requires SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_VERSION=2026-04, and SHOPIFY_ADMIN_ACCESS_TOKEN with write_products; creates at most five draft/unpublished original products and five draft/unpublished print products; sets handles, product types, tags, owner-approved prices, inventory policy deny, original inventory 1, approved/default print inventory 50, exactly one `Frame package = Unframed` variant for each print product, product image from the existing archive URL, and custom.mongodb_artwork_id; writes a local pilot result report; redacts tokens; includes focused unit tests for gating, input validation, idempotency/conflict refusal, mutation payload shape, token redaction, and report shape. Do not publish products, write MongoDB shopifyProducts links, mutate Cloudinary, create more than ten products, create framed/material/mat variants, delete/archive products, change runtime commerce UI, implement checkout/cart, use browser automation, or continue after any selected product reports a conflict/query error/user error. Verify with the focused Jest test, git diff --check, and npm run lint. Run the live command only after the owner supplies the approval file and explicitly authorizes the write_products token use.
```

## Handoff Notes

- Prepared on 2026-05-28 as a docs-only Phase 3 plan.
- No runtime source, Shopify dashboard state, MongoDB data, or Cloudinary assets
  were changed by this planning task.
- The plan intentionally keeps MongoDB linking separate so draft/unpublished
  pilot products cannot accidentally broaden the public shop listing path.
- Completed on 2026-05-28 with `npm run create:shopify-catalog-pilot`, a
  guarded Shopify Admin GraphQL `productSet` command that reads the dry-run
  plan, reconciliation report, and owner approval file before any live write.
- The command requires `--confirm=CREATE_DRAFT_PILOT_PRODUCTS`,
  `SHOPIFY_ADMIN_API_VERSION=2026-04`, and a `write_products` Admin token. It
  refuses approval files that do not contain exactly five unique artworks with
  original and print prices, explicit `DRAFT` status, MongoDB linking disabled,
  and a Shopify inventory location GID.
- Selected rows must be clean reconciliation `no_match` /
  `safe_to_create_later` rows for both original and print. The command stops
  after the first Shopify mutation failure or user error, writes a local result
  report, never publishes products, and never writes MongoDB or Cloudinary.
- Future dry-run reports now include `imageUrl`; the pilot command rejects
  selected artworks whose plan lacks a usable image URL rather than creating
  products without approved media evidence.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/scripts/createShopifyCatalogPilotHelpers.test.js __tests__/unit/scripts/buildShopifyCatalogPlanHelpers.test.js`
    passed on 2026-05-28.
  - `git diff --check` passed on 2026-05-28.
  - `npm run lint` passed on 2026-05-28.

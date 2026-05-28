# Shopify Operations Runbook

This runbook describes operating expectations for Shopify-backed commerce.
Implementation details live in [../architecture/shopify-commerce.md](../architecture/shopify-commerce.md).

## Product Setup

For an original or print:

1. Create the Shopify product.
2. Set the product handle.
3. Add product price, images, variants, and availability in Shopify.
4. Add metafield `mongodb_artwork_id` with the MongoDB artwork ID.
5. Add a matching `shopifyProducts` entry to the MongoDB artwork.

For generated draft print products in the pilot catalog, the variant matrix is
intentionally one variant: `Frame package = Unframed`. Do not create framed,
material, or mat variants until the owner approves the exact option labels,
prices, inventory/fulfilment handling, and app-to-Shopify mappings. Current
product-page frame and mat controls remain preview-only and do not submit or
select Shopify variants.

For a book:

1. Create the Shopify product.
2. Add product price, images, variants, and availability in Shopify.
3. Set durable book-identifying metadata before visual owner review. Use at
   least one of:
   - Shopify `productType` with a clear book/publication value such as `Book`,
     `Catalog`, `Catalogue`, or `Publication`;
   - a durable Shopify tag such as `book`, `catalog`, `catalogue`, or
     `publication`;
   - metafield `custom.featured_artwork_ids` when the book should also connect
     to featured archive artworks.
4. Add metafield `custom.featured_artwork_ids` with a JSON array of MongoDB
   artwork IDs when the product detail page should render featured artwork
   sections for the book.
5. Add the book product link to each related MongoDB artwork when the artwork
   should surface that book.

Books may appear on multiple artwork records when the publication legitimately
features those artworks. Cross-artwork duplicate product IDs are expected for
that book case and should be reviewed for intent, not rejected globally.

## Book Sale-Gallery Readiness

Before assigning or repeating a book sale-gallery owner-review pass, verify
that Shopify Storefront reads expose durable book metadata for the candidate
product. A book product is ready for meaningful sale-gallery review when:

- Storefront product data includes a clear book/publication marker in
  `productType`, Shopify `tags`, or `custom.featured_artwork_ids`.
- Shopify product images are ordered as the intended cover/page gallery slots.
  A book can render this ordered image gallery without `featured_artwork_ids`
  when `productType` or tags classify it as a book.
- `custom.featured_artwork_ids` is present and contains the intended MongoDB
  artwork IDs when the product page should render featured artwork sections.
- The verification note records the product handle, the observed
  `productType`, relevant tags, whether `custom.featured_artwork_ids` was
  present, and whether ordered Shopify images were present.

The current book candidate
`/shop/products/the-complete-artwork-of-joseph-laoutaris` must not be treated
as book owner-review-ready until Shopify data is updated and a Storefront read
confirms one of the durable book markers above. Do not add hard-coded handles,
title heuristics, or source-side overrides to make this product appear as a
book; fix the Shopify metadata instead.

## MongoDB Link Shape

```json
{
  "shopifyProducts": [
    { "productId": "10538938761480", "type": "book" },
    { "productId": "11122233344", "type": "original" }
  ]
}
```

## Product ID Rule

Store the numeric Shopify product ID in MongoDB. Construct the full Shopify GID
only when calling Shopify APIs.

Public product reads normalize IDs at the Shopify API boundary. Malformed
stored values, including full `gid://shopify/Product/...` strings, are ignored
by the public product listing until the MongoDB link is corrected.

## Admin Link Validation

Admin artwork create/update writes that include `shopifyProducts` must preserve
the canonical link shape before persistence:

- `productId` must be a string containing only the numeric Shopify product ID;
  full Shopify GID values are rejected.
- `type` must be one of `original`, `print`, or `book`.
- One artwork cannot contain duplicate `productId` values, even if the duplicate
  entries use different types.
- Cross-artwork duplicates are not globally rejected because shared book links
  can be legitimate.

This validation does not call Shopify and does not verify product existence or
availability.

## Admin Product Link Workflow

Use the admin artwork create or update form to manage MongoDB
`shopifyProducts` links.

1. Add a Shopify product link row.
2. Enter the numeric Shopify product ID only.
3. Choose `original`, `print`, or `book`.
4. Use the row's verify action when you want to confirm the product currently
   exists in Shopify before saving.
5. Add additional rows when an artwork should surface multiple products.
6. Remove a row to delete one link, or remove every row on the update form to
   clear all Shopify product links from the artwork.
7. Submit the artwork form.

The form trims product IDs and rejects non-numeric IDs, unsupported types, and
duplicate product IDs within the same artwork before it sends the API request.
The admin API repeats those checks before persistence. Cross-artwork duplicates
remain allowed for legitimate shared book links.

Verification calls the public single-product-by-ID route only when the row
verify action is used. Empty or non-numeric IDs show a local invalid state
without a Shopify request. Existing products show returned context such as
title, handle, availability, product type, and price; missing products and
upstream failures show warnings. These warnings do not block save. Admin
create/update persistence still relies on the form schema and admin route
validation, and the write routes do not call Shopify.

## Shopify Catalog Dry-Run Plan

Run the MongoDB-to-Shopify catalog dry-run before any live Shopify product
creation task:

```bash
npm run plan:shopify-catalog -- --output=reports/shopify-catalog-dry-run-plan.json
```

Optional print edition quantity override:

```bash
npm run plan:shopify-catalog -- --print-quantity=25 --output=reports/shopify-catalog-dry-run-plan.json
```

Alternatively set `SHOPIFY_PRINT_QUANTITY`; the CLI option wins when both are
present. If neither is set, print quantity defaults to `50`.

Required environment:

- `MONGO_URI` must point to the MongoDB database to plan from.
- Shopify credentials are not required because the dry-run does not call
  Shopify.

The dry-run reads only the `artworks` collection with `_id`, `title`, and
`image` projected. It writes a local JSON report with one proposed original
product and one proposed print product per artwork, including generated
handles, product type, tags, inventory quantity, `custom.mongodb_artwork_id`,
archive image URL, image URL presence, and warnings for missing titles,
missing images,
duplicate generated handles, or unsupported required data.

Safety rules:

- Do not treat the report as owner approval to create products.
- Do not publish, create, update, delete, or archive Shopify products from this
  dry-run.
- Do not write generated `shopifyProducts` links back to MongoDB from this
  dry-run.
- Do not commit generated reports unless an owner-reviewed evidence artifact is
  explicitly requested.

## Read-Only Product Link Audit

Run the MongoDB product-link audit before planning a data cleanup or admin
linking workflow:

```bash
npm run audit:shopify-products
```

Required environment:

- `MONGO_URI` must point to the MongoDB database to audit.
- Shopify credentials are not required because the audit does not call Shopify.

The audit reads only the `artworks` collection with `_id`, `title`, and
`shopifyProducts` projected. It does not mutate MongoDB data and does not verify
whether Shopify products exist.

The report includes:

- total artworks scanned,
- artworks with Shopify links,
- total Shopify links,
- invalid product IDs, including empty, whitespace-only, non-numeric, and
  `gid://shopify/Product/...` values,
- duplicate product IDs within one artwork,
- duplicate product IDs across artworks grouped by product type,
- unknown product `type` values.

Exit behavior:

- `0`: no invalid product IDs or unknown product types were found. Duplicate
  reports may still require owner review.
- `1`: invalid product IDs, unknown product types, missing `MONGO_URI`, or an
  audit runtime failure occurred.

## Shopify Catalog Reconciliation

Run the read-only Shopify Admin reconciliation after the catalog dry-run report
exists and before any Shopify product creation task:

```bash
npm run reconcile:shopify-catalog -- \
  --input=reports/shopify-catalog-dry-run-plan.json \
  --output=reports/shopify-catalog-reconciliation-report.json
```

Required environment:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be the pinned Admin GraphQL API version,
  currently `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  `read_products` scope.

The reconciliation reads only the Phase 1 local plan file and Shopify Admin
product data. It queries by proposed handle and by
`custom.mongodb_artwork_id`, and it also does read-only manual-product
preservation matching by normalized artwork numbers from MongoDB titles such as
`No.026`. Manual matches compare the artwork number against Shopify product
handle/title patterns such as `joseph-laoutaris-fine-art-print-no-026` and
`joseph-laoutaris-original-artwork-no-043`, then classify the product family
from handle, title, tags, and `productType`. The command writes a local JSON
report at `reports/shopify-catalog-reconciliation-report.json` by default.

Metafield lookup results are only valid matches when the returned Shopify
product's `custom.mongodb_artwork_id` exactly equals the MongoDB artwork ID
being reconciled. Products returned with a null or different
`custom.mongodb_artwork_id` are ignored as metafield matches and reported as
ignored lookup results, so broad Shopify search responses cannot block every
planned product.

Clean manual original/print matches are classified with
`recommendedAction: "preserve_existing_manual_product"`. Ambiguous manual
number matches, multiple same-family number matches, or manual number matches
with conflicting MongoDB metafields are classified as
`manual_review_required`.

Safety rules:

- Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this command.
- Do not grant or require `write_products`.
- Do not print, persist, commit, or paste `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- Do not treat `no_match` rows as approval to create products.
- Do not publish, create, update, delete, archive, or restore Shopify products
  from this reconciliation.
- Do not write generated `shopifyProducts` links back to MongoDB.
- Do not mutate MongoDB or Cloudinary assets.

Exit behavior:

- `0`: all planned products were classified without conflicts or query errors.
- `1`: required Shopify Admin environment is missing, input validation failed,
  Shopify lookups produced query errors, or the report contains manual-review
  conflicts.

## Shopify Catalog Pilot Creation

Run the guarded Phase 3 pilot command only after the owner supplies an approval
file for exactly five artworks and explicitly authorizes the `write_products`
Admin token use:

```bash
npm run create:shopify-catalog-pilot -- \
  --plan=reports/shopify-catalog-dry-run-plan.json \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --approval=reports/shopify-catalog-pilot-owner-approval.json \
  --output=reports/shopify-catalog-pilot-create-report.json \
  --confirm=CREATE_DRAFT_PILOT_PRODUCTS
```

Required environment:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  `write_products` scope.

Approval requirements:

- exactly five unique MongoDB artwork IDs;
- original and print prices for each approved artwork;
- explicit `DRAFT` product status for each approved artwork;
- MongoDB linking explicitly disabled for each approved artwork;
- a Shopify inventory location GID;
- optional print quantity override per artwork, otherwise default `50`.

The command refuses to run unless the selected original and print rows are
`matchStatus: "no_match"` with
`recommendedAction: "safe_to_create_later"` in the reconciliation report. It
creates at most five original products and five print products, all through
Shopify Admin GraphQL `productSet` with status `DRAFT`. Originals use inventory
`1`. Prints use exactly one `Frame package = Unframed` variant and default
inventory `50` unless the approval file provides an override.

The dry-run plan must include a usable archive image URL for every selected
artwork. The pilot command passes that URL to Shopify as product media and does
not upload, transform, delete, or rename any Cloudinary asset.

Safety rules:

- Do not run without the exact `CREATE_DRAFT_PILOT_PRODUCTS` confirmation.
- Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this command.
- Do not print, persist, commit, or paste `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- Do not publish products or write sales-channel publications.
- Do not create more than ten pilot products.
- Do not create framed, material, or mat variants beyond
  `Frame package = Unframed`.
- Do not write MongoDB `shopifyProducts` links.
- Do not mutate MongoDB, Cloudinary, books, orders, customers, collections,
  domains, aliases, Vercel state, checkout/cart behavior, or runtime UI.
- Stop after the first Shopify mutation failure or user error and write the
  local result report.

Exit behavior:

- `0`: all ten draft pilot products were created and the local result report
  was written.
- `1`: confirmation, environment, approval, plan, reconciliation, output-path,
  Shopify user-error, or mutation validation failed.

## Manual Original/Print Cleanup

Run the guarded cleanup command only after the read-only reconciliation report
exists and the owner has approved containing the manual original/print products.
The default mode is a local dry-run and does not require Shopify credentials:

```bash
npm run cleanup:shopify-manual-catalog -- \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --output=reports/shopify-manual-product-cleanup-report.json
```

Archive mode is the first allowed live cleanup mode:

```bash
npm run cleanup:shopify-manual-catalog -- \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --output=reports/shopify-manual-product-cleanup-report.json \
  --mode=archive \
  --confirm=ARCHIVE_MANUAL_ORIGINAL_PRINT_PRODUCTS
```

Required environment for archive mode:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be the pinned Admin GraphQL API version,
  currently `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  `write_products` scope.

The command reads product IDs only from reconciliation `manualNumberMatches`
and conflict rows. It does not search Shopify for a broader product set during
cleanup. Each candidate must have a valid Shopify Product GID, a handle, a
previous status, and original/print family evidence. Book, catalog, catalogue,
or publication-like candidates are rejected before any archive attempt.

Archive mode uses Shopify Admin GraphQL `productUpdate` to set candidate
product status to `ARCHIVED`. Delete mode is intentionally not implemented in
this task. Permanent product deletion remains blocked until separate explicit
owner approval and a new implementation task.

Safety rules:

- Run dry-run first and review the local result report.
- Do not run archive mode without the exact confirmation string.
- Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this command.
- Do not print, persist, commit, or paste `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- Do not delete Shopify products.
- Do not touch book products, orders, customers, collections, publications,
  domains, aliases, MongoDB, Cloudinary, or Vercel state.
- Do not create generated replacement products from this cleanup command.

Exit behavior:

- `0`: dry-run report was written, or archive mode completed without Shopify
  archive failures.
- `1`: confirmation or environment validation failed, the reconciliation report
  was invalid or had query errors, a candidate was rejected by cleanup
  validation, or Shopify returned an archive failure.

## Purchase Handoff

Product detail pages use Shopify-hosted product links when Shopify provides
them. When a Shopify product is available for sale and the Storefront API
returns a valid `onlineStoreUrl`, the public product detail page links users to
that hosted Shopify URL in a new tab. Checkout is completed on Shopify.

When a Shopify product is available for sale but does not expose a valid hosted
URL, the product detail page falls back to
`/project/contact?product=[handle]`. When a product is not available for sale,
the page shows that it cannot currently be purchased and does not render a
purchase or enquiry completion CTA.

Before enabling app-owned checkout or cart controls, define the Shopify
checkout owner, variant ID handling, line-item construction, and
unavailable-product behavior.

## Manual Verification

- `/shop/products` shows the expected product set.
- Product filters do not duplicate book products.
- Product detail loads from `/shop/products/[productHandle]`.
- Product detail shows an external Shopify purchase link for available products
  with a valid `onlineStoreUrl` and no `Add to Cart` control.
- Product detail shows an enquiry fallback for available products without a
  valid `onlineStoreUrl`.
- Product detail shows non-purchase status for unavailable products.
- Product detail links back to archive artwork where linked.
- Artwork detail shows sale affordances only when `shopifyProducts` exists.

## Open Work

- Define and implement the full cart or checkout handoff.
- Decide whether persistence-time Shopify validation or product-link caching is
  ever needed.
- Add tests for product transformation.

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

The dry-run reads only the `artworks` collection with the T-335 approved
projection: `_id`, `title`, `decade`, `artstyle`, `medium`, `surface`,
`featured`, and selected archive image fields (`secure_url`, `public_id`,
`pixelWidth`, `pixelHeight`, `format`). It writes a local JSON report with one
proposed original product and one proposed print product per artwork. Generated
products include:

- Shopify product fields: generated handle, family-specific product title,
  vendor `Joseph Laoutaris`, `productType`, `DRAFT` status, existing
  `image.secure_url` as product media, inventory policy `deny`, original
  inventory `1`, print inventory default/override, and one print variant
  `Frame package = Unframed`.
- Shopify tags: the family tags already used by the planner plus
  `decade-<decade>`, `artstyle-<artstyle>`, `medium-<medium>`,
  `surface-<surface>`, and `featured-artwork` only when MongoDB `featured` is
  true.
- Shopify metafields in the `custom` namespace:
  `mongodb_artwork_id`, `artwork_title`, optional `artwork_number`,
  `artwork_decade`, `artwork_artstyle`, `artwork_medium`, `artwork_surface`,
  `artwork_featured`, `archive_image_url`, `archive_image_public_id`,
  `archive_image_width`, `archive_image_height`, `archive_image_format`, and
  print-only `print_edition_quantity`.

The report also records selected archive image metadata, explicit field/value
exclusions, image URL presence, generated handle duplication, and warnings for
missing titles, missing images, missing required taxonomy metadata, or
unsupported required metadata.

Do not include `shopifyProducts`, user favourite/watchlist state, watcher or
favourited arrays, collection metadata, Cloudinary color analysis, image byte
size, generated frame/material/mat options, sale copy, publishing state, or
MongoDB link writes in the planner expansion. Collection metadata is deferred
to a separate collection-join task.

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

## Shopify Catalog Pilot Owner Approval Template

Before running the guarded pilot creation command, prepare an owner approval
file from the local source-only example:

```text
reports/shopify-catalog-pilot-owner-approval.example.json
```

The T-333 example selects five reconciliation-clean artworks whose original and
print rows are both `matchStatus: "no_match"` with
`recommendedAction: "safe_to_create_later"`, no manual product matches, and no
product conflicts. The selected artworks are:

| Artwork ID | Title |
| --- | --- |
| `661fc617648efb163cffacee` | `No.002` |
| `661fc784648efb163cffacf6` | `No.075` |
| `661fc7b7648efb163cffacff` | `No.008` |
| `661fcae840f59e26cc761dd5` | `No.033` |
| `661fccea40f59e26cc761e0f` | `No.041` |

To turn the example into a real approval file, the owner must create the
command input file at:

```text
reports/shopify-catalog-pilot-owner-approval.json
```

Then replace every placeholder:

- `inventoryLocationId` must be a real Shopify location GID such as
  `gid://shopify/Location/1234567890`.
- `inventoryLocationName` should name the same Shopify location for human
  review.
- `originalPrice` must be the owner-approved original artwork price in the
  store currency.
- `printPrice` must be the owner-approved unframed print price in the store
  currency.
- `productStatus` must remain `DRAFT`.
- `mongoDbLinking` must remain `none` for this pilot.
- `printEditionQuantity` may remain `50` unless the owner approves a
  per-artwork override.

The example file is not sufficient approval while any placeholder remains.
Do not add a sixth artwork, replace one selected artwork with a manual/conflict
row, or use an artwork whose original or print reconciliation row is not clean
`no_match` / `safe_to_create_later`. Preparing this approval file is source-only
work: do not mutate Shopify, MongoDB, or Cloudinary, and do not run the live
pilot command until the owner has approved the completed JSON and explicitly
authorized `write_products` token use.

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

## Shopify Full Catalog Draft Creation

Run the guarded full-catalog draft command only after the expanded dry-run plan
and read-only reconciliation are clean and the owner has approved the full
draft creation input:

```bash
npm run create:shopify-catalog-drafts -- \
  --plan=reports/shopify-catalog-dry-run-plan.json \
  --reconciliation=reports/shopify-catalog-reconciliation-report.json \
  --approval=reports/shopify-catalog-full-owner-approval.json \
  --output=reports/shopify-catalog-draft-create-report.json \
  --confirm=CREATE_FULL_CATALOG_DRAFT_PRODUCTS
```

Required environment:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  product write scope.

Approval requirements:

- explicit full-catalog approval for `all_planned_no_match_products`;
- explicit `DRAFT` product status;
- global original and print prices;
- MongoDB linking explicitly disabled;
- a Shopify inventory location GID;
- optional print quantity override, otherwise default `50`;
- optional expected artwork/product counts to catch stale plan inputs.

The command refuses to run unless every planned original and print row is
`matchStatus: "no_match"` with
`recommendedAction: "safe_to_create_later"` in the reconciliation report, and
the report has no conflicts, query errors, or manual-review blockers. It
creates draft products through Shopify Admin GraphQL `productSet`. Originals
use inventory `1`. Prints use exactly one `Frame package = Unframed` variant
and default inventory `50` unless the approval file provides an override.

Safety rules:

- Do not run without the exact `CREATE_FULL_CATALOG_DRAFT_PRODUCTS`
  confirmation.
- Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this command.
- Do not print, persist, commit, or paste `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- Do not publish products or write sales-channel publications.
- Do not create framed, material, or mat variants beyond
  `Frame package = Unframed`.
- Do not write MongoDB `shopifyProducts` links.
- Do not mutate MongoDB, Cloudinary, books, orders, customers, collections,
  publications, domains, aliases, Vercel state, checkout/cart behavior, or
  runtime UI.
- Stop after the first Shopify mutation failure or user error and write the
  local result report.

Exit behavior:

- `0`: all approved draft products were created and the local result report was
  written.
- `1`: confirmation, environment, approval, plan, reconciliation, output-path,
  Shopify user-error, or mutation validation failed.

## Generated Shopify Product MongoDB Linking

Run the read-only link plan after the post-create reconciliation report shows
exact matches for all generated originals and prints:

```bash
npm run link:shopify-catalog-products -- \
  --mode=plan \
  --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json \
  --output=reports/shopify-catalog-mongodb-link-plan.json
```

Required environment:

- `MONGO_URI` must point at the owner-approved MongoDB target.

Plan mode reads MongoDB artwork `_id`, title, and existing `shopifyProducts`.
It writes a local report with the desired link state per artwork and performs
no MongoDB, Shopify, or Cloudinary writes.

The desired generated links use:

```json
{ "type": "original", "productId": "11991754408200", "publicListing": false }
{ "type": "print", "productId": "11991754473736", "publicListing": false }
```

Existing book links are preserved. Existing original and print links are
reported as replaced by generated original/print links. This initial generated
link write keeps generated originals and prints hidden from broad app listing;
use the link-listing command below to intentionally promote one family after
the owner decides the public-listing policy.

Live write mode is allowed only after owner review of the local plan report and
the exact confirmation:

```bash
npm run link:shopify-catalog-products -- \
  --mode=write \
  --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json \
  --output=reports/shopify-catalog-mongodb-link-write-report.json \
  --confirm=LINK_GENERATED_SHOPIFY_PRODUCTS
```

Safety rules:

- Run plan mode first and review the local report.
- Do not run write mode without the exact confirmation string.
- Do not publish Shopify products or write Shopify sales-channel publications.
- Do not mutate Cloudinary, orders, customers, collections, publications,
  domains, aliases, Vercel state, checkout/cart behavior, or generated Shopify
  product data.
- Generated links must stay `publicListing: false` until the owner explicitly
  promotes one product family or selected links into broad public shop listing.

Exit behavior:

- `0`: plan report was written, or write mode completed without MongoDB update
  failures.
- `1`: confirmation, environment, reconciliation, MongoDB read/write, or
  output-path validation failed.

## Shopify Product Link Public Listing

Use the guarded link-listing command when the app-side listing gate needs to be
changed for one link type without changing Shopify product status or sales
channel publication.

Plan mode:

```bash
npm run set:shopify-link-listing -- \
  --mode=plan \
  --type=print \
  --public-listing=true \
  --output=reports/shopify-print-public-listing-plan.json
```

Write mode is allowed only after owner review of the local plan report and the
exact confirmation:

```bash
npm run set:shopify-link-listing -- \
  --mode=write \
  --type=print \
  --public-listing=true \
  --output=reports/shopify-print-public-listing-write-report.json \
  --confirm=SET_SHOPIFY_PRODUCT_LINK_PUBLIC_LISTING
```

Required environment:

- `MONGO_URI` must point at the owner-approved MongoDB target.

Current generated catalog policy:

- Only the pre-launch sale sample generated links are app-listable:
  10 originals and 25 prints.
- Unselected generated original and print links remain hidden by default:
  `publicListing: false`.
- Existing book links remain governed by their stored link values; missing
  `publicListing` is treated as public/listable for legacy manual links.

This command does not activate, draft, publish, unpublish, delete, or update
Shopify products. A print only appears in broad public shop surfaces when both
conditions are true: the MongoDB link is app-listable and Shopify Storefront
reports the product as available for sale.

Safety rules:

- Run plan mode first and review the local report.
- Do not run write mode without the exact confirmation string.
- Do not use this command to change Shopify Active/Draft status or sales
  channel publication.
- Do not mutate Cloudinary, orders, customers, collections, publications,
  domains, aliases, Vercel state, checkout/cart behavior, or generated Shopify
  product data.

Exit behavior:

- `0`: plan report was written, or write mode completed without MongoDB update
  failures.
- `1`: confirmation, environment, input validation, MongoDB read/write, or
  output-path validation failed.

## Shopify Pre-Launch Sale Sample

Use this workflow when a small mixed set of generated products should be made
sellable before the full catalog launch.

Prepare a reproducible random sample:

```bash
npm run prepare:shopify-sale-sample -- \
  --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json \
  --output=reports/shopify-sale-sample-selection.json \
  --original-count=10 \
  --print-count=25 \
  --overlap-count=7 \
  --seed=owner-sale-sample-2026-05-29
```

Plan the activation:

```bash
npm run apply:shopify-sale-sample -- \
  --mode=plan \
  --selection=reports/shopify-sale-sample-selection.json \
  --output=reports/shopify-sale-sample-activation-plan.json
```

Run the guarded live activation only after the owner approves the selected
sample and the Shopify Admin token has the needed product and publication
scopes:

```bash
npm run apply:shopify-sale-sample -- \
  --mode=write \
  --selection=reports/shopify-sale-sample-selection.json \
  --output=reports/shopify-sale-sample-activation-write-report.json \
  --confirm=ACTIVATE_SHOPIFY_SALE_SAMPLE
```

Required environment for write mode:

- `MONGO_URI` must point at the owner-approved MongoDB target.
- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  product write scope plus `read_publications` and `write_publications`.

The write command sets selected MongoDB product links to
`publicListing: true`, updates selected Shopify products to `ACTIVE`, and
publishes selected products to the resolved `Online Store` publication. It does
not change unselected products.

The current T-345 sample uses 7 overlap artworks, 3 original-only artworks, and
18 print-only artworks to make exactly 10 originals and 25 prints. The first
live attempt was blocked before mutation because the Admin token lacked
`read_publications`; the report recorded 0 MongoDB updates, 0 Shopify status
updates, and 0 Shopify publication writes. After publication scopes were added,
the sample was activated and published to `Online Store`. The sample then had
to be published to the separate `Laoutaris Headless` publication as well before
the Storefront API returned the selected products.

Safety rules:

- Run selection and activation plan mode first.
- Do not run write mode without exact owner approval of the selected sample.
- Do not activate, publish, draft, archive, or delete unselected generated
  products.
- Do not mutate Cloudinary, orders, customers, collections, domains, aliases,
  Vercel state, checkout/cart behavior, product prices, or framed/material/mat
  variants.

Exit behavior:

- `0`: selection/plan report was written, or write mode completed without
  MongoDB, Shopify status, or Shopify publication failures.
- `1`: confirmation, environment, selection validation, publication scope/
  resolution, MongoDB, Shopify status, Shopify publication, or output-path
  validation failed.

## Framed Print Variant Plan

Use this command only after the owner approves a read-only framed-print
planning pass. It compares the current 25 sale-sample print products with the
approved first matrix from the formula audit:

- `Unframed / No mat`
- `Black wood / No mat`
- `Black wood / White mat`
- `Oak / No mat`
- `Oak / White mat`

Run:

```bash
npm run plan:framed-print-variants
```

Optional paths:

```bash
npm run plan:framed-print-variants -- \
  --input=reports/framed-print-commerce-formula-audit.json \
  --selection=reports/shopify-sale-sample-selection.json \
  --output=reports/framed-print-variant-plan.json
```

Required environment:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be set for the Admin API endpoint.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  product read access.

Safety rules:

- This command reads Shopify Admin product option/variant state only.
- It writes a local report only.
- It must not create Shopify variants, write prices, publish/unpublish
  products, change product status, mutate MongoDB, mutate Cloudinary, or add
  checkout/cart behavior.
- Any future write command needs a separate task, explicit owner approval, and
  an exact confirmation gate.

Exit behavior:

- `0`: report was written and Shopify product reads completed without read
  errors.
- `1`: environment/input validation failed or one or more Shopify product reads
  failed. If a report is written with read failures, review
  `summary.queryErrorCount` and row warnings before retrying.

## Guarded Framed Print Variant Apply

The guarded apply command was prepared in T-351. Its default mode is a local
write plan and does not call Shopify:

```bash
npm run apply:framed-print-variants
```

Current local plan output:

- `reports/framed-print-variant-write-report.json`
- 25 planned `Mat` option mutations.
- 100 missing framed/matted variants to create in a future write.
- 25 existing `Unframed / No mat` variants preserved.
- 0 write failures.

Live write mode exists but must not be run without separate explicit owner
approval:

```bash
npm run apply:framed-print-variants -- \
  --mode=write \
  --confirm=CREATE_FRAMED_PRINT_VARIANTS
```

Required environment for write mode:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be set for the Admin API endpoint.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  product write access.

Safety rules:

- Run default plan mode first and review
  `reports/framed-print-variant-write-report.json`.
- Do not run write mode without the exact confirmation string and a separate
  owner approval for the live write.
- Live write mode may create visible/buyable placeholder-priced variants on
  active Shopify products. Either explicitly accept that exposure risk or make
  selected products non-public/non-purchase before running write mode.
- Do not publish/unpublish products, change product status, mutate MongoDB,
  mutate Cloudinary, touch orders/customers, or add checkout/cart behavior from
  this command.
- Do not treat pixel-derived prices as launch-approved real prices.

Exit behavior:

- `0`: plan report was written, or confirmed write completed without recorded
  write failures.
- `1`: input validation, confirmation, environment, Shopify request/user error,
  or output writing failed. Write mode stops after the first product failure.

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

## Clean-Slate Shopify Catalog Cleanup

Run the clean-slate dry-run when the owner wants Shopify reduced to
book/publication products before continuing generated catalog work:

```bash
npm run cleanup:shopify-clean-slate-catalog -- \
  --output=reports/shopify-clean-slate-catalog-cleanup-report.json
```

Required environment for dry-run:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be the pinned Admin GraphQL API version,
  currently `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  `read_products` scope.

The dry-run reads all Shopify Admin products through paginated product reads,
classifies book/publication products to keep, classifies every valid non-book
product as `would_delete_product`, and writes the local report. Book/publication
classification comes from durable Shopify product type, tags, handle/title
book/publication markers, or `custom.featured_artwork_ids`.
If an intended book/publication appears as a delete candidate, stop and fix its
Shopify metadata before approving delete mode.

Live deletion is allowed only after the owner reviews and approves the dry-run
report:

```bash
npm run cleanup:shopify-clean-slate-catalog -- \
  --output=reports/shopify-clean-slate-catalog-cleanup-report.json \
  --mode=delete \
  --confirm=DELETE_ALL_NON_BOOK_SHOPIFY_PRODUCTS
```

Required environment for delete mode:

- `SHOPIFY_STORE_DOMAIN` must be the `.myshopify.com` store domain without
  protocol.
- `SHOPIFY_ADMIN_API_VERSION` must be `2026-04`.
- `SHOPIFY_ADMIN_ACCESS_TOKEN` must be an owner-approved Admin API token with
  `write_products` scope.

Delete mode uses Shopify Admin GraphQL `productDelete` only for report entries
classified as non-book delete candidates. Products classified as
book/publication products are kept and never receive a delete action. Products
with invalid Shopify product IDs or missing handles block the run before any
delete attempt.

Safety rules:

- Run dry-run first and get owner approval for the local report.
- Do not run delete mode without the exact confirmation string.
- Do not use `SHOPIFY_STOREFRONT_ACCESS_TOKEN` for this command.
- Do not print, persist, commit, or paste `SHOPIFY_ADMIN_ACCESS_TOKEN`.
- Do not delete book/publication products.
- Do not mutate MongoDB, Cloudinary, orders, customers, collections,
  publications, domains, aliases, Vercel state, checkout/cart behavior, or
  runtime UI.

Exit behavior:

- `0`: dry-run report was written, or delete mode completed without Shopify
  delete failures.
- `1`: confirmation or environment validation failed, product validation
  blocked deletion, Shopify reads failed, or Shopify returned a delete failure.

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
- `/shop/products`, explicit `type=shop-products` search, homepage/prototype
  shop sections, public shop API responses, and product sitemap generation do
  not automatically include Shopify products that Storefront reports as
  `availableForSale: false`, including generated drafts.
- Broad public product listing surfaces also skip MongoDB links marked
  `publicListing: false`. Only the current pre-launch sale sample generated
  links are app-listable; unselected generated originals and prints remain
  hidden by default.
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

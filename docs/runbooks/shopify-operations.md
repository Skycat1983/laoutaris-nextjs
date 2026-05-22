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

For a book:

1. Create the Shopify product.
2. Add product price, images, variants, and availability in Shopify.
3. Add metafield `featured_artwork_ids` with a JSON array of MongoDB artwork
   IDs.
4. Add the book product link to each related MongoDB artwork when the artwork
   should surface that book.

Books may appear on multiple artwork records when the publication legitimately
features those artworks. Cross-artwork duplicate product IDs are expected for
that book case and should be reviewed for intent, not rejected globally.

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

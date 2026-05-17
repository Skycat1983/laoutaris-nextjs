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

## First-Release Purchase Handoff

Product detail pages currently use an enquiry handoff instead of cart or
checkout. When a Shopify product is available for sale, the public product
detail page links to `/project/contact?product=[handle]`. When a product is not
available for sale, the page shows that it cannot currently be purchased.

Before enabling checkout or cart controls, define the Shopify checkout owner,
variant ID handling, line-item construction, and unavailable-product behavior.

## Manual Verification

- `/shop/products` shows the expected product set.
- Product filters do not duplicate book products.
- Product detail loads from `/shop/products/[productHandle]`.
- Product detail shows an enquiry link for available products and no
  `Add to Cart` control.
- Product detail shows non-purchase status for unavailable products.
- Product detail links back to archive artwork where linked.
- Artwork detail shows sale affordances only when `shopifyProducts` exists.

## Open Work

- Define and implement the full cart or checkout handoff.
- Define the visible admin UI workflow for adding and removing Shopify links.
- Add tests for product transformation.

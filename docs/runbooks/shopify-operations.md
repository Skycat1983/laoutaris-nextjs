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
- Define admin UI workflow for adding and removing Shopify links.
- Add tests for link helpers and product transformation.

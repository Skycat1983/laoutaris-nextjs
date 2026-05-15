# Shopify Commerce Architecture

Shopify commerce is being added to an existing MongoDB-backed art archive.
MongoDB remains the archive source of truth; Shopify remains the commerce source
of truth.

## Canonical Product URL

Use Shopify product handles for product detail pages:

```text
/shop/products/[productHandle]
```

Do not use MongoDB artwork IDs as commerce URLs. Product handles support
originals, prints, books, SEO-friendly URLs, and Shopify-native product identity.

## Canonical Link Model

Artwork documents should store minimal Shopify references:

```ts
type ShopifyProductLink = {
  productId: string;
  type: "original" | "print" | "book";
};
```

Current code documents `productId` as the numeric Shopify product ID, for
example `"10538938761480"`. Code that calls Shopify can construct the full GID:

```text
gid://shopify/Product/10538938761480
```

## Shopify Metafields

Shopify products can link back to MongoDB archive data through metafields:

| Metafield | Purpose |
| --- | --- |
| `mongodb_artwork_id` | Links an original or print product to one artwork |
| `featured_artwork_ids` | Links a book product to multiple artworks |

## Data Flows

Artwork to shop:

1. Fetch artwork from MongoDB.
2. Inspect `artwork.shopifyProducts`.
3. Show lightweight sale affordances from link type.
4. Fetch Shopify product data when product price, availability, image, or handle
   is needed.
5. Link users to `/shop/products/[productHandle]`.

Shop product to artwork:

1. Fetch Shopify product by handle.
2. Read `mongodb_artwork_id` or `featured_artwork_ids` metafields.
3. Fetch related MongoDB artwork data when available.
4. Render product commerce information from Shopify and archive context from
   MongoDB.

Product listing:

1. Fetch or filter artwork records from MongoDB.
2. Extract linked Shopify product IDs.
3. Normalize linked product IDs to numeric Shopify product IDs.
4. Ignore malformed stored product IDs, including legacy full GID strings.
5. Deduplicate normalized product IDs.
6. Fetch product details from Shopify.
7. Render products and apply client-side sorting where appropriate.

## First-Release Purchase Handoff

Product detail pages do not implement Shopify cart or checkout yet. For the
first release, products that Shopify marks `availableForSale` link users to
`/project/contact?product=[handle]` with enquiry copy. Products that are not
available for sale show non-purchase status copy.

Do not render `Add to Cart`, checkout, or direct purchase controls until the
product contract exposes the required checkout data and ownership is decided.
A future cart/checkout implementation must define variant IDs, line items,
availability checks, and whether checkout is owned by a Shopify-hosted flow or
an app-managed cart flow.

## Product Types

| Type | Meaning |
| --- | --- |
| `original` | A one-off original artwork product |
| `print` | A print or edition derived from an artwork |
| `book` | A book or publication that may feature multiple artworks |

## Implementation Notes

- Product availability, price, variants, image, and handle should come from
  Shopify.
- Archive metadata, artwork history, collection context, and artist content
  should come from MongoDB.
- Books can appear on many artwork records, so product listing logic must
  deduplicate Shopify IDs.
- Client components should import product-specific components directly rather
  than through broad card barrels when server-only dependencies may be present.

## Open Decisions

- Full cart/checkout approach is not documented yet.
- Admin UI for creating and removing Shopify links is not documented yet.
- Product pagination and caching policy need verification against production
  needs.

Track these in [Shopify commerce workstream](../workstreams/shopify-commerce.md)
and [production risks](../risks/production-readiness.md).

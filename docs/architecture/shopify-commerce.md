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
3. For artwork detail pages, resolve linked product summaries server-side with
   Shopify product ID normalization and `getProductById`.
4. Skip malformed, missing, unavailable, or failed Shopify products without
   failing the artwork page.
5. Render available original, print, and book product links to
   `/shop/products/[productHandle]` in the initial route output.

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

## Purchase Handoff

Product detail pages do not implement an app-owned Shopify cart or checkout.
The public product DTO carries Shopify `onlineStoreUrl` when the Storefront API
returns a valid absolute HTTP(S) URL.

Products that Shopify marks `availableForSale` and that expose a valid
`onlineStoreUrl` render an external `Purchase on Shopify` link. The link opens
in a new tab with `target="_blank"` and `rel="noopener noreferrer"`, and the
page states only that checkout is completed on Shopify. The archive enquiry
link remains available as a secondary contact option.

Products that are available for sale but do not expose a valid hosted URL keep
the enquiry fallback at `/project/contact?product=[handle]`. Products that are
not available for sale show non-purchase status copy and do not render a
purchase or enquiry completion CTA.

Do not render `Add to Cart` or app-owned checkout controls until the product
contract and ownership model define variant IDs, line items, availability
checks, and whether checkout is owned by a Shopify-hosted flow or an app-managed
cart flow.

Product detail pages render the shop-specific sale gallery from
`src/components/shop/product-detail/ShopProductSaleGallery.tsx` as the common
layout for prints, original artwork, books, and generic products. That surface
uses the same hosted Shopify purchase URL or enquiry fallback described above.
Available prints can show frame and mat dropdowns plus room previews when a
linked archive artwork image or Shopify product image has usable dimensions.
Original artwork products can show generated room previews without print-only
frame/mat controls. Book products use ordered Shopify product images for cover
and page-gallery slots instead of generated room scenes. The print controls are
preview-only local controls: they do not select Shopify variants, alter price
or availability, persist to the database, create cart lines, or change enquiry
submissions.

## Product Types

| Type | Meaning |
| --- | --- |
| `original` | A one-off original artwork product |
| `print` | A print or edition derived from an artwork |
| `book` | A book or publication that may feature multiple artworks |

## Admin Product-Link Workflow

Admin artwork create and update forms expose `shopifyProducts` as repeatable
links using the canonical `{ productId, type }` shape. Admins can add multiple
links, choose `original`, `print`, or `book`, edit numeric Shopify product IDs,
remove individual links, and submit an empty array on update to clear all links
from an artwork.

The shared artwork form schema trims product IDs, rejects non-numeric values,
limits product types to the canonical set, and rejects duplicate product IDs
within one artwork before the API request. Admin create/update route validation
remains authoritative and applies the same rules before persistence.

Each product-link row has an explicit verification action that calls the
existing public `GET /api/v2/public/shop/products/[productId]` route through a
typed client fetcher. Verification only runs when an admin chooses it; the form
does not call Shopify on every keystroke or during save. Row verification can
show unchecked, checking, verified, not-found, invalid-local-input, and upstream
error states. Verified rows display returned Shopify context such as title,
handle, availability, product type, and price.

Verification is advisory. Editing a row's product ID or type clears stale
verification state, and create/update submission remains governed by the shared
form schema plus admin route validation. Product existence does not become a
persistence dependency, and the admin write routes do not call Shopify before
saving.

## Implementation Notes

- Product availability, price, variants, images, and handle should come from
  Shopify.
- Public product DTOs expose Shopify's hosted product URL only through
  `SimpleProduct.onlineStoreUrl` after URL validation. Missing, empty,
  relative, malformed, or non-HTTP(S) values become `null`; the app must not
  invent hosted product URLs from handles.
- Public product DTOs expose queried variant IDs, titles, availability, price
  money, compare-at price money, and optional variant image URL/alt text through
  `SimpleProduct.variants`. This is contract preparation only; it does not
  choose cart ownership, checkout line-item behavior, or visible variant
  selection.
- Public product DTOs preserve the ordered Shopify product image list in
  `SimpleProduct.images` with URL, alt text, width, and height. Product detail
  pages use this for book cover/page gallery slots and as a fallback preview
  source when no linked archive artwork image is available.
- Public product DTOs preserve Shopify `descriptionHtml`, but product detail
  pages still render the existing plain `description`. Rich description
  rendering requires a separate sanitization and design decision.
- Archive metadata, artwork history, collection context, and artist content
  should come from MongoDB.
- Books can appear on many artwork records, so product listing logic must
  deduplicate Shopify IDs.
- Client components should import product-specific components directly rather
  than through broad card barrels when server-only dependencies may be present.

## Open Decisions

- Full cart/checkout approach is not documented yet.
- Persistence-time Shopify validation, product-link caching, and automatic
  product-link data migration are not documented yet.
- Product pagination and caching policy need verification against production
  needs.

Track these in [Shopify commerce workstream](../workstreams/shopify-commerce.md)
and [production risks](../risks/production-readiness.md).

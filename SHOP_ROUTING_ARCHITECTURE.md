# Shop Routing Architecture

## Overview

This document explains the routing structure and data flow for displaying artworks and products across the site.

---

## URL Structure

### Artwork Routes (MongoDB-focused)

```
/artwork/[artworkId]                              - Standalone artwork view
/collections/[slug]/[artworkId]                   - Artwork within collection context
```

**Purpose:** Display comprehensive artwork information from MongoDB
**Data Source:** MongoDB (primary), Shopify (supplementary if linked)

### Shop Routes (Shopify-focused)

```
/shop                                              - Product listing page
/shop/products/[productHandle]                     - Individual product page
```

**Purpose:** E-commerce product display with buy functionality
**Data Source:** Shopify (primary), MongoDB (supplementary if linked)

---

## Why `/shop/products/[productHandle]` Instead of `/shop/[artworkId]`?

### The Decision

We use **Shopify product handles** (`/shop/products/abstract-composition-original`) instead of MongoDB artwork IDs (`/shop/67b0b8be257868a9e78c78d6`).

### Reasoning

#### ✅ **Handles All Product Types**

```typescript
// Works for all scenarios:
/shop/cdoprstu / abstract -
  composition -
  original / // Original artwork
    shop /
    products /
    abstract -
  composition -
  print / // Print of same artwork
    shop /
    products /
    abstract -
  composition -
  large / // Large print
    shop /
    products /
    collected -
  works -
  vol -
  1; // Book (multiple artworks)
```

Using artworkId wouldn't work for:

- Books (contain multiple artworks, no single ID)
- Distinguishing original vs print of same artwork

#### ✅ **SEO-Friendly**

Shopify handles are URL slugs designed for SEO:

```
Good:  /shop/products/seascape-1970-original
Bad:   /shop/67b0b8be257868a9e78c78d6
```

#### ✅ **Clear Separation of Concerns**

| Route Type                | Focus            | Primary Data | Use Case                           |
| ------------------------- | ---------------- | ------------ | ---------------------------------- |
| `/artwork/[id]`           | Art appreciation | MongoDB      | View details, collections, history |
| `/shop/products/[handle]` | Commerce         | Shopify      | Buy, compare prices, variants      |

#### ✅ **Shopify Native**

Product handles are Shopify's built-in identifier:

- Guaranteed unique
- Immutable once set
- Used in Shopify Admin UI
- Standardized format

---

## Data Flow

### 1. Shop Product Page → Artwork Details

```typescript
// /shop/products/[productHandle]/page.tsx

1. Fetch Shopify product by handle
2. Extract mongodbArtworkId from metafield (if exists)
3. Fetch MongoDB artwork (if linked)
4. Display:
   - Product info (price, buy button, availability)
   - Artwork details (from MongoDB)
   - Link to /artwork/[artworkId] for full details
```

**User Journey:**

```
Browse shop → Click product → See price & buy button
              ↓
              See artwork details (title, decade, style)
              ↓
              Click "View Full Artwork Details" → /artwork/[id]
```

### 2. Artwork Page → Shop Products

```typescript
// /artwork/[artworkId]/page.tsx
// Uses: ArtworkView.tsx + ArtworkShopSection.tsx

1. Fetch MongoDB artwork
2. Check if shopifyProducts exists
3. If yes, fetch Shopify products by ID
4. Display:
   - Full artwork information
   - "Available for Purchase" section (if linked)
   - Links to /shop/products/[handle]
```

**User Journey:**

```
Browse artworks → Click artwork → See full artwork details
                  ↓
                  See "Available for Purchase" section
                  ↓
                  Click "Buy Original" → /shop/products/[handle]
```

---

## Implementation Details

### Shopify Product Page

**File:** `/src/app/shop/products/[productHandle]/page.tsx`

```typescript
export default async function ProductPage({ params }) {
  const { productHandle } = params;

  // 1. Fetch Shopify product
  const product = await getProductByHandle(productHandle);

  // 2. Determine product type
  const isBook = product.featuredArtworkIds?.length > 0;

  // 3. Fetch related data
  if (isBook) {
    const artworks = await fetchArtworksInBook(product.featuredArtworkIds);
    // Display book with artwork grid
  } else if (product.mongodbArtworkId) {
    const artwork = await fetchArtwork(product.mongodbArtworkId);
    // Display product with artwork details
  }
}
```

**Features:**

- Buy button
- Price display with currency
- Variant selection (if applicable)
- Link to full artwork page
- Book: Grid of all featured artworks

### Artwork Shop Section

**File:** `/src/components/modules/cards/ArtworkShopSection.tsx`

```typescript
const ArtworkShopSection = ({ artwork }) => {
  // Quick check without fetching
  const hasOriginal = hasShopifyProductType(
    artwork.shopifyProducts,
    "original"
  );
  const hasPrints = hasShopifyProductType(artwork.shopifyProducts, "print");
  const hasBooks = hasShopifyProductType(artwork.shopifyProducts, "book");

  // Fetch full product data when needed
  useEffect(() => {
    const originals = getShopifyProductsByType(
      artwork.shopifyProducts,
      "original"
    );
    // Fetch and display...
  }, [artwork]);
};
```

**Features:**

- Shows if artwork is for sale (without API call)
- Lazy loads product details
- Separate sections for original, prints, books
- Links to shop product pages

---

## Example Scenarios

### Scenario 1: Original Artwork for Sale

**MongoDB:**

```json
{
  "_id": "67b0b8be257868a9e78c78d6",
  "title": "Seascape 1970",
  "shopifyProducts": [
    { "productId": "gid://shopify/Product/111", "type": "original" }
  ]
}
```

**Shopify Product:**

```json
{
  "id": "gid://shopify/Product/111",
  "handle": "seascape-1970-original",
  "title": "Seascape 1970 - Original Painting",
  "price": "2500.00",
  "metafields": [
    {
      "key": "mongodb_artwork_id",
      "value": "67b0b8be257868a9e78c78d6"
    }
  ]
}
```

**Routes:**

- `/artwork/67b0b8be257868a9e78c78d6` - Shows artwork + "Buy Original $2,500" button
- `/shop/products/seascape-1970-original` - Shows product + artwork details + buy button

### Scenario 2: Artwork with Multiple Products

**MongoDB:**

```json
{
  "_id": "artwork_id",
  "title": "Abstract 1965",
  "shopifyProducts": [
    { "productId": "gid://shopify/Product/222", "type": "original" },
    { "productId": "gid://shopify/Product/333", "type": "print" },
    { "productId": "gid://shopify/Product/444", "type": "book" }
  ]
}
```

**Shopify Products:**

```json
// Original
{ "handle": "abstract-1965-original", "price": "3500.00" }

// Print
{ "handle": "abstract-1965-limited-print", "price": "250.00" }

// Book
{
  "handle": "collected-works-vol-1",
  "price": "75.00",
  "metafields": [
    {
      "key": "featured_artwork_ids",
      "value": "[\"artwork_id\", \"other_id_1\", \"other_id_2\"]"
    }
  ]
}
```

**Routes:**

- `/artwork/artwork_id` - Shows all 3 purchasing options
- `/shop/products/abstract-1965-original` - Original
- `/shop/products/abstract-1965-limited-print` - Print
- `/shop/products/collected-works-vol-1` - Book with grid of all featured artworks

### Scenario 3: Artwork NOT for Sale

**MongoDB:**

```json
{
  "_id": "artwork_id",
  "title": "Private Collection Piece",
  "shopifyProducts": undefined
}
```

**Routes:**

- `/artwork/artwork_id` - Shows artwork, NO shop section
- No shop product page (doesn't exist in Shopify)

---

## Benefits Summary

| Benefit             | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| **Flexibility**     | Same artwork can have multiple products (original + print) |
| **Books Supported** | Books with multiple artworks fit naturally                 |
| **SEO**             | Product handles are search-engine friendly                 |
| **Clear UX**        | Users know `/shop` = buy, `/artwork` = view                |
| **Maintainable**    | Each route has single responsibility                       |
| **MongoDB Light**   | Only stores minimal Shopify references                     |
| **Fresh Data**      | Prices/availability always current from Shopify            |

---

## Migration Notes

### Existing Artworks

All existing artworks have `shopifyProducts: undefined` - they work exactly as before with no shop section displayed.

### Adding Products

1. Create product in Shopify with handle
2. Add `mongodb_artwork_id` metafield
3. Update MongoDB artwork with product link
4. Both directions now connected!

---

## API Endpoints

| Endpoint                                | Purpose                      |
| --------------------------------------- | ---------------------------- |
| `GET /api/shopify/products/[productId]` | Fetch product by Shopify GID |
| `GET /api/artworks/[artworkId]`         | Fetch artwork by MongoDB ID  |

Both can be called from client components for dynamic loading.

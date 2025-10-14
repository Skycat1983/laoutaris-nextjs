# Shopify-MongoDB Artwork Linking Guide

## Overview

We use a **minimal reference approach** - MongoDB stores only Shopify product IDs with type hints, then fetches full product data from Shopify when needed.

---

## Data Structure

### MongoDB Artwork

```typescript
{
  _id: "67b0b8be257868a9e78c78d6",
  title: "Abstract Composition",
  // ... all existing fields ...

  // NEW: Minimal Shopify references
  shopifyProducts: [
    { productId: "gid://shopify/Product/111", type: "original" },
    { productId: "gid://shopify/Product/222", type: "print" },
    { productId: "gid://shopify/Product/333", type: "book" }
  ]
}
```

### Shopify Product (Metafields)

```json
{
  "id": "gid://shopify/Product/111",
  "title": "Abstract Composition - Original",
  "metafields": [
    {
      "namespace": "custom",
      "key": "mongodb_artwork_id",
      "value": "67b0b8be257868a9e78c78d6"
    }
  ]
}
```

---

## Usage Examples

### 1. Display "For Sale" Badge on Artwork Page

```typescript
import {
  hasShopifyProductType,
  getShopifyProductsByType,
} from "@/lib/data/types/shopifyTypes";

const ArtworkPage = ({ artwork }: { artwork: ArtworkFrontend }) => {
  // Check if original is for sale (no fetch needed)
  const hasOriginal = hasShopifyProductType(
    artwork.shopifyProducts,
    "original"
  );
  const hasPrints = hasShopifyProductType(artwork.shopifyProducts, "print");

  return (
    <div>
      <h1>{artwork.title}</h1>

      {hasOriginal && <Badge>Original Available</Badge>}

      {hasPrints && <Badge>Prints Available</Badge>}
    </div>
  );
};
```

### 2. Fetch and Display Product Details

```typescript
import { getShopifyProductsByType } from "@/lib/data/types/shopifyTypes";
import { getProduct } from "@/lib/api/shopify/shopifyClient";

const ArtworkShopSection = ({ artwork }: { artwork: ArtworkFrontend }) => {
  const [originalProduct, setOriginalProduct] = useState<SimpleProduct | null>(
    null
  );
  const [printProducts, setPrintProducts] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    // Fetch original product if exists
    const originals = getShopifyProductsByType(
      artwork.shopifyProducts,
      "original"
    );
    if (originals.length > 0) {
      getProduct(originals[0].productId).then(setOriginalProduct);
    }

    // Fetch print products
    const prints = getShopifyProductsByType(artwork.shopifyProducts, "print");
    Promise.all(prints.map((p) => getProduct(p.productId))).then(
      setPrintProducts
    );
  }, [artwork]);

  return (
    <div>
      {originalProduct && (
        <div>
          <h3>Original Artwork</h3>
          <p>${originalProduct.price}</p>
          <Link href={`/shop/${originalProduct.handle}`}>Buy Now</Link>
        </div>
      )}

      {printProducts.map((print) => (
        <div key={print.id}>
          <h3>{print.title}</h3>
          <p>${print.price}</p>
          <Link href={`/shop/${print.handle}`}>Buy Print</Link>
        </div>
      ))}
    </div>
  );
};
```

### 3. Show Books Featuring This Artwork

```typescript
const BooksSection = ({ artwork }: { artwork: ArtworkFrontend }) => {
  const [books, setBooks] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    const bookLinks = getShopifyProductsByType(artwork.shopifyProducts, "book");
    if (bookLinks.length > 0) {
      Promise.all(bookLinks.map((link) => getProduct(link.productId))).then(
        setBooks
      );
    }
  }, [artwork]);

  if (books.length === 0) return null;

  return (
    <div>
      <h3>Featured in Books:</h3>
      {books.map((book) => (
        <Link key={book.id} href={`/shop/${book.handle}`}>
          {book.title}
        </Link>
      ))}
    </div>
  );
};
```

### 4. Navigate from Shop Product to Artwork

```typescript
const ShopProductPage = ({ product }: { product: SimpleProduct }) => {
  const [artwork, setArtwork] = useState<ArtworkFrontend | null>(null);

  useEffect(() => {
    if (product.mongodbArtworkId) {
      // Fetch artwork from your API
      fetch(`/api/artworks/${product.mongodbArtworkId}`)
        .then((res) => res.json())
        .then(setArtwork);
    }
  }, [product]);

  return (
    <div>
      <h1>{product.title}</h1>

      {artwork && (
        <Link href={`/artwork/${artwork._id}`}>View Full Artwork Details</Link>
      )}
    </div>
  );
};
```

### 5. Show Artworks in a Book

```typescript
const BookProductPage = ({ product }: { product: SimpleProduct }) => {
  const [artworks, setArtworks] = useState<ArtworkFrontend[]>([]);

  useEffect(() => {
    if (product.featuredArtworkIds && product.featuredArtworkIds.length > 0) {
      // Fetch all artworks in this book
      Promise.all(
        product.featuredArtworkIds.map((id) =>
          fetch(`/api/artworks/${id}`).then((res) => res.json())
        )
      ).then(setArtworks);
    }
  }, [product]);

  return (
    <div>
      <h1>{product.title}</h1>

      <h3>Features {artworks.length} artworks:</h3>
      <div className="grid grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork._id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};
```

---

## Admin: Linking Artwork to Shopify

### Add Shopify Product to Artwork

```typescript
const linkShopifyProduct = async (
  artworkId: string,
  shopifyProductId: string,
  type: "original" | "print" | "book"
) => {
  await fetch(`/api/artworks/${artworkId}/shopify`, {
    method: "POST",
    body: JSON.stringify({
      productId: shopifyProductId,
      type: type,
    }),
  });
};
```

### Remove Shopify Product from Artwork

```typescript
const unlinkShopifyProduct = async (
  artworkId: string,
  shopifyProductId: string
) => {
  await fetch(`/api/artworks/${artworkId}/shopify`, {
    method: "DELETE",
    body: JSON.stringify({ productId: shopifyProductId }),
  });
};
```

---

## Benefits of This Approach

✅ **MongoDB stays lean** - Only 2 fields per product link (ID + type)  
✅ **Always fresh data** - Price/availability fetched from Shopify when needed  
✅ **No sync issues** - No cached data to go stale  
✅ **Flexible** - Easy to add/remove products  
✅ **Type-safe** - TypeScript knows what to expect  
✅ **Backward compatible** - Existing artworks work without changes

---

## Performance Considerations

### Optimization Strategy

1. **Show basic info immediately** (from type field):

   ```typescript
   if (hasShopifyProductType(artwork.shopifyProducts, "original")) {
     return <Badge>For Sale</Badge>;
   }
   ```

2. **Lazy load full product data**:

   ```typescript
   const [expanded, setExpanded] = useState(false);

   const handleShowDetails = async () => {
     const products = await fetchShopifyProducts(artwork.shopifyProducts);
     setExpanded(true);
   };
   ```

3. **Cache on client** (React Query, SWR, etc.):
   ```typescript
   const { data: product } = useSWR(
     productId ? `/api/shopify/products/${productId}` : null,
     fetcher
   );
   ```

---

## Migration for Existing Artworks

All existing artworks will have `shopifyProducts: undefined` or `[]`.  
This is completely fine - they'll just not show any Shopify-related UI.

To add Shopify products:

1. Create product in Shopify with metafield `mongodb_artwork_id`
2. Update MongoDB artwork with the product ID and type
3. Both sides now linked!

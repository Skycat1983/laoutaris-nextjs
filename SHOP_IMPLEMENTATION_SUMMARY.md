# Shop Filtering Implementation Summary

## ✅ Completed Implementation

### 1. API Route: `/api/v2/shop/products`

**Location:** `src/app/api/v2/shop/products/route.ts`

**What it does:**

- Accepts filter params (decade, artstyle, medium, surface, product types)
- Queries MongoDB for artworks matching filters + has `shopifyProducts` array
- Extracts Shopify product IDs from results
- Deduplicates product IDs (important for books appearing in multiple artworks)
- Filters by product type checkboxes (originals, prints, books)
- Batch fetches products from Shopify by ID
- Returns SimpleProduct[] with metadata

**Query params:**

```
?decade=1970s&artstyle=abstract&showOriginals=true&showPrints=true&showBooks=false
```

---

### 2. Client Component: `FilterableProductGrid`

**Location:** `src/components/compositions/FilterableProductGrid.tsx`

**What it does:**

- Manages filter state
- Renders ShopFilters and ShopResultsBar
- Fetches from `/api/v2/shop/products` when filters change
- Shows loading state during fetch
- Handles errors with reload button
- Displays "Reset Filters" button when no results
- Renders product grid with ProductCard components

---

### 3. Updated: `ShopFilters` Component

**Location:** `src/components/modules/filters/ShopFilters.tsx`

**Changes:**

- Now accepts `filters` prop (current filter state)
- Accepts `onFilterChange` callback
- All Select components are controlled (value + onValueChange)
- All Checkbox components are controlled (checked + onCheckedChange)
- Emits filter changes to parent component

---

### 4. Updated: `ProductsPage`

**Location:** `src/app/shop/products/page.tsx`

**Changes:**

- Still fetches initial products server-side (for SSR)
- Now renders `FilterableProductGrid` instead of static grid
- Passes `initialProducts` for instant display
- Client hydrates and enables filtering

---

### 5. Updated: Type Documentation

**Location:** `src/lib/data/types/shopifyTypes.ts`

**Changes:**

- Clarified that `productId` stores numeric ID (e.g., "10538938761480")
- Not the full GID format (that's constructed in code)

---

## 🎯 How It Works

### Data Flow:

```
1. User adjusts filter → State updates in FilterableProductGrid
2. useEffect triggers → Builds query params
3. Fetches /api/v2/shop/products with params
4. API queries MongoDB artworks with filters + shopifyProducts exists
5. API extracts all productIds from matched artworks
6. API deduplicates IDs (books can appear multiple times)
7. API filters by product type checkboxes
8. API batch fetches from Shopify using GID format
9. API returns products to client
10. Client updates grid display
```

---

## 📋 What YOU Need To Do

### Step 1: Backup MongoDB (DONE if you followed earlier steps)

✅ Export artworks collection to JSON file

### Step 2: Add Book to All Artworks

In MongoDB Compass mongosh:

```javascript
db.artworks.updateMany(
  {},
  {
    $push: {
      shopifyProducts: {
        productId: "YOUR_BOOK_ID_HERE",
        type: "book",
      },
    },
  }
);
```

**Replace `YOUR_BOOK_ID_HERE`** with the numeric ID from Shopify URL.

Example:

- URL: `https://admin.shopify.com/store/laoutaris/products/10538938761480`
- Use: `"10538938761480"`

---

### Step 3: Add Individual Products

For artworks that have originals or prints for sale, add those product IDs:

**In MongoDB Compass:**

1. Find the artwork document
2. Edit document
3. Add to `shopifyProducts` array:

```json
{
  "shopifyProducts": [
    { "productId": "10538938761480", "type": "book" },
    { "productId": "11122233344", "type": "original" }
  ]
}
```

Or if it only has a print:

```json
{
  "shopifyProducts": [
    { "productId": "10538938761480", "type": "book" },
    { "productId": "55566677788", "type": "print" }
  ]
}
```

---

## 🧪 Testing

### Test 1: Books Only

1. Go to `/shop/products`
2. Uncheck "Original artworks" and "Limited edition"
3. Keep "Books" checked
4. **Expected:** Only see book products

### Test 2: Decade Filter

1. Select "1970s" from Decades dropdown
2. **Expected:** Only artworks from 1970s (that have shopifyProducts)

### Test 3: Multiple Filters

1. Select "Abstract" style + "Oil" medium
2. **Expected:** Only abstract oil paintings (that have shopifyProducts)

### Test 4: No Results

1. Select very specific filters (e.g., "1950s" + "Sand" + "Wood")
2. **Expected:** "No products match" message with "Reset Filters" button

---

## 🔧 Key Implementation Details

### Deduplication

- Books can appear in multiple artworks' `shopifyProducts` arrays
- API uses `Set` to deduplicate before fetching from Shopify
- Ensures each book only appears once in grid

### GID Construction

- MongoDB stores: `"10538938761480"`
- API constructs: `"gid://shopify/Product/10538938761480"`
- Sent to Shopify GraphQL API

### Filter Behavior

- "All" options (all-style, all-medium, etc.) = no filter applied
- Multiple filters = AND logic (artwork must match ALL selected filters)
- Books always respect ONLY the "Books" checkbox (not style/medium/etc.)

### Performance

- Initial load: Server-side (fast)
- Filter changes: Client-side fetch (smooth UX)
- Batch fetching: All products fetched in parallel
- Failed fetches: Logged but don't crash (returns null, filtered out)

---

## 🚀 Next Steps

1. ✅ **Add book ID to all artworks** (bulk update)
2. ✅ **Add 1-2 test artworks with individual products** (originals/prints)
3. ✅ **Test filtering in browser**
4. ✅ **Verify deduplication works** (book should appear once)
5. ✅ **Add remaining products** (once confirmed working)

---

## 📝 Notes

- **Colour filter:** Not implemented (MongoDB doesn't have "colour" field at artwork level)
- **Dimension filter:** Not implemented (MongoDB doesn't have "size" field)
- **These can be added later** if you add those fields to MongoDB schema

---

## 🐛 Troubleshooting

### "No products match your filters"

- Check MongoDB: Do artworks have `shopifyProducts` array?
- Check browser console: See query params being sent?
- Check server logs: See MongoDB query and results?

### Products not appearing

- Check Shopify product ID is correct (numeric only)
- Check product exists in Shopify
- Check browser Network tab: API returning data?

### Duplicate books

- Should NOT happen (API deduplicates)
- If it does, check API logs for duplicate IDs

---

## ✨ Features Implemented

✅ MongoDB-first filtering (reuses existing artwork filters)  
✅ Shopify product fetching by ID  
✅ Automatic deduplication  
✅ Product type checkboxes (originals, prints, books)  
✅ Loading states  
✅ Error handling  
✅ Empty state with reset button  
✅ Server-side rendering (initial load)  
✅ Client-side filtering (smooth UX)  
✅ No Shopify tag maintenance required

---

**Ready to test once you've added the book ID to MongoDB!**

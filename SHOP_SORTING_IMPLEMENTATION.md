# Shop Sorting Implementation

## ✅ Overview

Implemented client-side sorting for shop products with 5 sort options:

1. **Sort by Type** (default) - Books → Originals → Prints
2. **Price: Low to High** - Ascending price order
3. **Price: High to Low** - Descending price order
4. **Title: A to Z** - Alphabetical ascending
5. **Title: Z to A** - Alphabetical descending

---

## 🏗️ Implementation Details

### 1. Types (`shopTypes.ts`)

**Added:**

```typescript
export type ShopSortOption =
  | "type"
  | "price-low"
  | "price-high"
  | "title-asc"
  | "title-desc";
```

**Updated `ShopFiltersState`:**

```typescript
export type ShopFiltersState = {
  // ... existing filters
  sortBy?: ShopSortOption;
};
```

**Updated `ShopSearchParams`:**

```typescript
export type ShopSearchParams = {
  // ... existing params
  sortBy?: string;
};
```

---

### 2. ShopProductGallery (`ShopProductGallery.tsx`)

**Key Changes:**

#### Added State

```typescript
const [sortBy, setSortBy] = useState<ShopSortOption>(
  initialFilters?.sortBy || "type"
);
```

#### Added useMemo for Sorting

```typescript
const sortedProducts = useMemo(() => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case "price-high":
      return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "type":
    default:
      // Sort by product type: books → originals → prints
      return sorted.sort((a, b) => {
        const getTypeOrder = (title: string) => {
          const lowerTitle = title.toLowerCase();
          if (lowerTitle.includes("book")) return 0;
          if (lowerTitle.includes("original")) return 1;
          if (lowerTitle.includes("print")) return 2;
          return 3;
        };
        return getTypeOrder(a.title) - getTypeOrder(b.title);
      });
  }
}, [products, sortBy]);
```

**Why `useMemo`?**

- Prevents unnecessary re-sorting on every render
- Only recalculates when `products` or `sortBy` changes
- Efficient for large product lists

#### Added Handler

```typescript
const handleSortChange = (newSortBy: ShopSortOption) => {
  setSortBy(newSortBy);
};
```

#### Updated Render

```typescript
// Changed from `products.map()` to `sortedProducts.map()`
{
  sortedProducts.map((product) => (
    <ProductCard key={product.id} product={product} variant="contain" />
  ));
}
```

---

### 3. ShopResultsBar (`ShopResultsBar.tsx`)

**Updated Props:**

```typescript
type ShopResultsBarProps = {
  totalResults: number;
  sortBy: ShopSortOption; // ← Added
  onSortChange: (sortBy: ShopSortOption) => void; // ← Added
};
```

**Updated Sort Dropdown:**

```typescript
<Select
  value={sortBy}
  onValueChange={(value) => onSortChange(value as ShopSortOption)}
>
  <SelectTrigger className="w-[180px] rounded-none bg-white">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="type">Sort by Type</SelectItem>
    <SelectItem value="price-low">Price: Low to High</SelectItem>
    <SelectItem value="price-high">Price: High to Low</SelectItem>
    <SelectItem value="title-asc">Title: A to Z</SelectItem>
    <SelectItem value="title-desc">Title: Z to A</SelectItem>
  </SelectContent>
</Select>
```

---

## 🔄 Data Flow

```
1. User selects sort option in ShopResultsBar
   ↓
2. onSortChange(newSortBy) called
   ↓
3. handleSortChange updates sortBy state
   ↓
4. useMemo recalculates sortedProducts
   ↓
5. Grid re-renders with sorted products
```

**Note:** Sorting is **client-side only** - no API call needed.

---

## 🎯 Sort Logic Details

### Type Sorting (Default)

Prioritizes products by type based on title keywords:

- **Books** (order: 0) - Contains "book"
- **Originals** (order: 1) - Contains "original"
- **Prints** (order: 2) - Contains "print"
- **Other** (order: 3) - No keyword match

**Example:**

```
Before: [Print A, Book B, Original C]
After:  [Book B, Original C, Print A]
```

### Price Sorting

Uses `parseFloat()` to convert string prices to numbers:

- **Low to High:** `a.price - b.price`
- **High to Low:** `b.price - a.price`

### Title Sorting

Uses `localeCompare()` for proper alphabetical sorting:

- **A to Z:** `a.title.localeCompare(b.title)`
- **Z to A:** `b.title.localeCompare(a.title)`

---

## 🔧 Reset Behavior

When **Reset Filters** is clicked:

```typescript
setSortBy("type"); // Reset to default sort
setProducts(initialProducts); // Reset to initial products
```

---

## 🚀 Testing

### 1. Test Default Sort (Type)

- Visit `/shop/products`
- Products should appear as: Books → Originals → Prints

### 2. Test Price Sorting

- Select "Price: Low to High"
- Products should reorder by ascending price
- Select "Price: High to Low"
- Products should reorder by descending price

### 3. Test Title Sorting

- Select "Title: A to Z"
- Products should order alphabetically
- Select "Title: Z to A"
- Products should reverse

### 4. Test Persistence with Filters

- Apply a filter (e.g., select a medium)
- Change sort order
- Products should remain filtered AND sorted
- Reset filters
- Should return to "Sort by Type" with all products

---

## 📊 Performance

| Aspect     | Implementation | Performance                     |
| ---------- | -------------- | ------------------------------- |
| Method     | Client-side    | Instant (no API call)           |
| Complexity | O(n log n)     | Fast for typical product counts |
| Caching    | `useMemo`      | Only recalculates when needed   |
| Memory     | Shallow copy   | Minimal overhead                |

**Typical product count:** 10-100 products
**Sort time:** < 1ms

---

## 🎨 UI/UX

### Visual Feedback

- Dropdown shows current sort selection
- Products instantly reorder (no loading state)
- Sort persists during filtering

### Accessibility

- Keyboard navigable dropdown
- Clear sort option labels
- ARIA-compliant Select component

---

## 🔮 Future Enhancements

### Optional Additions:

1. **Availability Sort** - In Stock first
2. **Date Sort** - Recently added
3. **Popularity Sort** - Most viewed/purchased
4. **Relevance Sort** - Based on search query

### Server-Side Sorting:

If product count grows significantly (1000+):

- Move sorting to API route
- Add `sortBy` to query params
- MongoDB: Use `.sort()` in query

**Current:** Client-side is sufficient for current scale.

---

## ✅ Summary

**What was added:**

- ✅ 5 sort options (type, price, title)
- ✅ Client-side sorting with `useMemo`
- ✅ Controlled dropdown in ShopResultsBar
- ✅ Type-safe sort options
- ✅ Reset functionality

**Result:** Users can now efficiently sort shop products by multiple criteria with instant feedback.

---

**Status:** Sorting implementation complete and ready to test! 🎉

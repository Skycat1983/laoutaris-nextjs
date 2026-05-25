import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopSortOption } from "@/lib/data/types/shopTypes";

const PRODUCT_TYPE_SORT_ORDER: Record<string, number> = {
  book: 0,
  publication: 0,
  original: 1,
  "original artwork": 1,
  print: 2,
  "limited edition print": 2,
};

const normalizeProductType = (productType: string) =>
  productType.trim().toLowerCase().replace(/\s+/g, " ");

const productPrice = (product: SimpleProduct) => Number.parseFloat(product.price);

export const getShopProductTypeSortOrder = (product: SimpleProduct) => {
  const normalizedType = normalizeProductType(product.productType);

  return PRODUCT_TYPE_SORT_ORDER[normalizedType] ?? 3;
};

export const sortShopProducts = (
  products: readonly SimpleProduct[],
  sortBy: ShopSortOption = "type"
) => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => productPrice(a) - productPrice(b));
    case "price-high":
      return sorted.sort((a, b) => productPrice(b) - productPrice(a));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "type":
    default:
      return sorted.sort(
        (a, b) => getShopProductTypeSortOrder(a) - getShopProductTypeSortOrder(b)
      );
  }
};

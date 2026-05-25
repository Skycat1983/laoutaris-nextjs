export const SHOP_SORT_OPTIONS = [
  "type",
  "price-low",
  "price-high",
  "title-asc",
  "title-desc",
] as const;

export type ShopSortOption = (typeof SHOP_SORT_OPTIONS)[number];

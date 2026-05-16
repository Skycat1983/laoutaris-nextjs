export const SHOP_SORT_OPTIONS = [
  "type",
  "price-low",
  "price-high",
  "title-asc",
  "title-desc",
] as const;

export type ShopSortOption = (typeof SHOP_SORT_OPTIONS)[number];

export type ShopFiltersState = {
  artstyle?: string;
  medium?: string;
  surface?: string;
  decade?: string;
  showOriginals?: boolean;
  showPrints?: boolean;
  showBooks?: boolean;
  sortBy?: ShopSortOption;
};

export type ShopSearchParams = {
  artstyle?: string;
  medium?: string;
  surface?: string;
  decade?: string;
  showOriginals?: string;
  showPrints?: string;
  showBooks?: string;
  sortBy?: string;
};

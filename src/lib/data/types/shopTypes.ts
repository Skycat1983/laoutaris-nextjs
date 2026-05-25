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
  sortBy?: string;
};

export type ShopSearchParams = {
  artstyle?: string | string[];
  medium?: string | string[];
  surface?: string | string[];
  decade?: string | string[];
  showOriginals?: string | string[];
  showPrints?: string | string[];
  showBooks?: string | string[];
  sortBy?: string | string[];
};

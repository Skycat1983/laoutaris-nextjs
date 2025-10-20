export type ShopSortOption =
  | "type"
  | "price-low"
  | "price-high"
  | "title-asc"
  | "title-desc";

export type ShopFiltersState = {
  artstyle?: string;
  medium?: string;
  colour?: string;
  surface?: string;
  decade?: string;
  dimension?: string;
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

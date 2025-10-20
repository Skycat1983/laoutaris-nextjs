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
};

export type ShopSearchParams = {
  artstyle?: string;
  medium?: string;
  surface?: string;
  decade?: string;
  showOriginals?: string;
  showPrints?: string;
  showBooks?: string;
};

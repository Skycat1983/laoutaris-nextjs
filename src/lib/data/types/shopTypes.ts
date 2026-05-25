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

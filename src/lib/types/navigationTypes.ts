// Navigation item types
export interface ArticleNavItem {
  title: string;
  slug: string;
}

export interface CollectionNavItem {
  title: string;
  slug: string;
  artworkId: string;
}

// Valid sections
export const VALID_SECTIONS = [
  "biography",
  "artwork",
  "project",
  "collections",
] as const;
export type ValidSection = (typeof VALID_SECTIONS)[number];

// API response types
export type ArticleNavResponse = ApiResponse<ArticleNavItem[]>;
export type CollectionNavListResponse = ApiResponse<CollectionNavItem[]>;
export type CollectionNavItemResponse = ApiResponse<CollectionNavItem>;

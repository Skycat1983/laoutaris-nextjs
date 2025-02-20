import { FrontendArticle } from "./articleTypes";
import { FrontendArtwork } from "./artworkTypes";
import { FrontendCollection } from "./collectionTypes";
import { FrontendUser, FrontendUserUnpopulated } from "./userTypes";

// TypeFields = the properties that are used to generate the navigation items

// Article Navigation
export type ArticleNavFields = Pick<FrontendArticle, "title" | "slug">;
export type ArticleNavItem = ArticleNavFields;

// Collection Navigation
export type CollectionNavFields = Pick<
  FrontendCollection,
  "title" | "slug" | "artworks"
>;
export type CollectionNavItem = {
  title: string;
  slug: string;
  artworkId: string; // Transformed from artworks[0]
};

// Artwork Navigation (for collection pagination)
export type ArtworkNavFields = Pick<FrontendArtwork, "title" | "_id" | "image">;
export type CollectionArtworkNavList = {
  artworks: ArtworkNavFields[];
};

// User Account Navigation
export type UserNavFields = Pick<
  FrontendUserUnpopulated,
  "favourites" | "watchlist" | "comments"
>;
export type UserNavItem = UserNavFields;

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
export type CollectionArtworksNavResponse =
  ApiResponse<CollectionArtworkNavList>;
export type UserNavResponse = ApiResponse<UserNavItem>;

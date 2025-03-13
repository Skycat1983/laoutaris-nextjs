// TypeFields = the properties that are used to generate the navigation items
import { ApiSuccessResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import {
  ArtworkFrontend,
  CollectionFrontendPopulated,
  ArticleFrontend,
  OwnUserFrontendPopulated,
} from "@/lib/data/types";
// Article Navigation
export type ArticleNavFields = Pick<ArticleFrontend, "title" | "slug">;
export type ArticleNavItem = ArticleNavFields;

// Collection Navigation
export type CollectionNavFields = Pick<
  CollectionFrontendPopulated,
  "title" | "slug" | "artworks"
>;
export type CollectionNavItem = {
  title: string;
  slug: string;
  artworkId: string;
};

// Artwork Navigation (for collection pagination)
export type ArtworkNavFields = Pick<ArtworkFrontend, "title" | "_id" | "image">;
export type CollectionArtworkNavList = {
  artworks: ArtworkNavFields[];
};

// User Account Navigation
export type UserNavFields = Pick<
  OwnUserFrontendPopulated,
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
export type ArticleNavResponse = ApiSuccessResponse<ArticleNavItem[]>;
export type CollectionNavListResponse = ApiSuccessResponse<CollectionNavItem[]>;
export type CollectionNavItemResponse = ApiSuccessResponse<CollectionNavItem>;
export type CollectionArtworksNavResponse =
  ApiResponse<CollectionArtworkNavList>;
export type UserNavResponse = ApiResponse<UserNavItem>;

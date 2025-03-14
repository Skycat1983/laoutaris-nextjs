// TypeFields = the properties that are used to generate the navigation items
import { ApiSuccessResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import {
  ArtworkFrontend,
  CollectionFrontendPopulated,
  ArticleFrontend,
  OwnUserFrontendPopulated,
  LeanDocument,
} from "@/lib/data/types";
import { UserDB } from "../models";

// Article Navigation
export type ArticleNavFields = Pick<ArticleFrontend, "title" | "slug">;
export type ArticleNavItem = ArticleNavFields;

// Collection Navigation
export type CollectionNavFields = Pick<
  CollectionFrontendPopulated,
  "title" | "slug" | "artworks"
>;
export type CollectionNavItem = CollectionNavFields;

// Artwork Navigation (for collection pagination)
export type ArtworkNavFields = Pick<ArtworkFrontend, "title" | "_id" | "image">;
export type CollectionArtworkNavList = {
  artworks: ArtworkNavFields[];
};

// User Account Navigation
export type OwnUserNavFields = Pick<
  UserDB,
  "favourites" | "watchlist" | "comments"
>;
export type OwnUserNavDataLean = LeanDocument<OwnUserNavFields>;
export type OwnUserNavItem = OwnUserNavFields;

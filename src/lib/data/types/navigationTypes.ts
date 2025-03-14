import { LeanDocument, Prettify } from "@/lib/data/types";
import { ArticleDB, CollectionDB, UserDB } from "../models";
import {
  transformAccountNav,
  transformBiographyNav,
  transformCollectionNav,
} from "@/lib/transforms/transformNavData";

export type BaseSegment = "biography" | "collections" | "account";

export interface NavSegment {
  label: string;
  baseSegment: BaseSegment;
  slug: string;
  docId?: string;
  disabled?: boolean;
}

export interface NavTransformer<T> {
  toSegments: (doc: T) => NavSegment[];
}

//! ARTICLE NAVIGATION
export type ArticleSelectFields = Pick<ArticleDB, "title" | "slug">;
export type ArticleSelectFieldsLean = LeanDocument<ArticleSelectFields>;
export type BiographyNavDataFrontend = Prettify<
  ReturnType<typeof transformBiographyNav.toFrontend>
>;

//! COLLECTION NAVIGATION
export type CollectionSelectFields = Pick<
  CollectionDB,
  "title" | "slug" | "artworks"
>;
export type CollectionSelectFieldsLean = LeanDocument<CollectionSelectFields>;
export type CollectionNavDataFrontend = Prettify<
  ReturnType<typeof transformCollectionNav.toFrontend>
>;

//! USER ACCOUNT NAVIGATION
export type OwnUserSelectFields = Pick<
  UserDB,
  "favourites" | "watchlist" | "comments"
>;
export type OwnUserSelectFieldsLean = LeanDocument<OwnUserSelectFields>;
export type OwnUserNavDataFrontend = Prettify<
  ReturnType<typeof transformAccountNav.toFrontend>
>;

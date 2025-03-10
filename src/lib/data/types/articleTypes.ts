import { ArticleDB } from "../models";
import { PublicArtworkTransformations } from "./artworkTypes";
import { UserTransformations } from "./userTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";

export type ArticleLean = LeanDocument<ArticleDB>;
export type ArticleRaw = TransformedDocument<ArticleLean>;
export type ArticleExtended = Merge<ArticleRaw, { readTime?: number }>;
export type ArticleSanitized = Omit<
  ArticleExtended,
  "_id" | "createdAt" | "updatedAt"
>;

export interface PublicArticleFields {
  readTime?: number;
}

//! doc-specific transformation definitions
export type PublicArticleTransformations = {
  DB: ArticleDB;
  Lean: LeanDocument<PublicArticleTransformations["DB"]>;
  Raw: TransformedDocument<PublicArticleTransformations["Lean"]>;
  Extended: Merge<PublicArticleTransformations["Raw"], PublicArticleFields>;
  Sanitized: Omit<
    PublicArticleTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: PublicArticleTransformations["Sanitized"];
};

export type PublicArticleTransformationsPopulated = {
  Lean: WithPopulatedFields<
    PublicArticleTransformations["Lean"],
    {
      author: UserTransformations["Lean"];
      artwork: PublicArtworkTransformations["Lean"];
    }
  >;
  Raw: WithPopulatedFields<
    PublicArticleTransformations["Raw"],
    {
      author: UserTransformations["Raw"];
      artwork: PublicArtworkTransformations["Raw"];
    }
  >;
  Frontend: WithPopulatedFields<
    PublicArticleTransformations["Frontend"],
    {
      author: UserTransformations["Frontend"];
      artwork: PublicArtworkTransformations["Frontend"];
    }
  >;
};

//! Frontend-specific types
export type PublicArticle = PublicArticleTransformations["Frontend"];
export type PublicArticlePopulated =
  PublicArticleTransformationsPopulated["Frontend"];

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}

//! Article fields
export type Section = "artwork" | "biography" | "project" | "collections";
export type OverlayColour = "white" | "black";

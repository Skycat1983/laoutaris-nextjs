import { ArticleDB } from "../models";
import { ArtworkTransformations } from "./artworkTypes";
import { PublicArticlePopulated } from "./populatedTypes";
import { UserTransformations } from "./userTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulated,
  WithPopulatedFields,
} from "./utilTypes";

export type ArticleLean = LeanDocument<ArticleDB>;
export type ArticleRaw = TransformedDocument<ArticleLean>;
export type ArticleExtended = Merge<ArticleRaw, { readTime?: number }>;
export type ArticleSanitized = Omit<
  ArticleExtended,
  "_id" | "createdAt" | "updatedAt"
>;

//! doc-specific transformation definitions
export type ArticleTransformations = {
  DB: ArticleDB;
  Lean: LeanDocument<ArticleTransformations["DB"]>;
  Raw: TransformedDocument<ArticleTransformations["Lean"]>;
  Extended: Merge<ArticleTransformations["Raw"], { readTime?: number }>;
  Sanitized: Omit<
    ArticleTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: ArticleTransformations["Sanitized"];
  Populated: WithPopulatedFields<
    ArticleTransformations["Frontend"],
    {
      author: UserTransformations["Frontend"];
      artwork: ArtworkTransformations["Frontend"];
    }
  >;
};

//! Frontend-specific types
export type Article = ArticleTransformations["Frontend"];
export type ArticlePopulated = ArticleTransformations["Populated"];

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}

//! Article fields
export type Section = "artwork" | "biography" | "project" | "collections";
export type OverlayColour = "white" | "black";

// export type ArticleTransformations = {
//   DB: ArticleDB;
//   Lean: LeanDocument<ArticleTransformations["DB"]>;
//   Raw: TransformedDocument<ArticleTransformations["Lean"]>;
//   Extended: Merge<ArticleTransformations["Raw"], { readTime?: number }>;
//   Sanitized: Omit<
//     ArticleTransformations["Extended"],
//     "_id" | "createdAt" | "updatedAt"
//   >;
//   Frontend: ArticleTransformations["Sanitized"];
//   Populated: PublicArticlePopulated;
// };

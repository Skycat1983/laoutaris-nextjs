import { ArticleDB } from "../models";
import { ArticlePopulatedFrontend } from "./populatedTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulated,
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
  Lean: ArticleLean;
  Raw: ArticleRaw;
  Extended: ArticleExtended;
  Sanitized: ArticleSanitized;
  Frontend: ArticleSanitized;
};

//! Frontend-specific types (safe)
export type Article = ArticleTransformations["Frontend"];
export type ArticlePopulated = ArticlePopulatedFrontend;

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}

//! Article fields
export type Section = "artwork" | "biography" | "project" | "collections";
export type OverlayColour = "white" | "black";

// Request/Response types (if needed)
// export type ArticleCreateInput = Pick<Article, "title" | "text" | "slug">;
// export type ArticleUpdateInput = Partial<ArticleCreateInput>;

// ! Base Article Return
// the Article as it is retrieved from the DB, using 'lean()' to strip out the Mongoose metadata
// export type ArticleLean = MongoDocumentLean<ArticleDB> & {
//   author: string;
//   artwork: string;
// };
// // Convert to interface since it's a base contract
// export interface ArticleExtensionFields {
//   // Add any extension fields here
// }

// // the Article as it is retrieved from the DB, with the additional fields of interest to the frontend
// export type ArticleExtended = ArticleLean & ArticleExtensionFields;

// // the unpopulated Article as it is retrieved from the DB, with sensitive data removed
// export type ArticleSanitized = Omit<ArticleLean, "_id" | "author" | "artwork">;

// // the frontend Article as it is sent to the client
// export type ArticleFrontend = ArticleSanitized;

// // ! Populated Article Return
// // Base type for populated fields at each stage
// type PopulatedFields<TUser, TArtwork> = {
//   author: TUser;
//   artwork: TArtwork;
// };

// // Lean stage
// export type ArticleLeanPopulated = Omit<
//   MongoDocumentLean<ArticleDB>,
//   "author" | "artwork"
// > &
//   PopulatedFields<UserLean, ArtworkLean>;

// // Extended stage
// export type ArticleExtendedPopulated = Omit<
//   ArticleLeanPopulated,
//   "author" | "artwork"
// > &
//   PopulatedFields<UserExtended, ArtworkExtended>;

// // Sanitized stage
// export type ArticleSanitizedPopulated = Omit<
//   ArticleExtendedPopulated,
//   "author" | "artwork"
// > &
//   PopulatedFields<UserSanitized, ArtworkSanitized>;

// // Frontend stage
// export type ArticleFrontendPopulated = Omit<
//   ArticleSanitizedPopulated,
//   "author" | "artwork"
// > &
//   PopulatedFields<UserFrontend, ArtworkFrontend>;

// interface BaseFrontendArticle {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   imageUrl: string;
//   slug: string;
//   section: Section;
//   overlayColour: OverlayColour;
// }

// type PopulatedField<T> = string | T | Partial<T>;

// export interface FrontendArticle extends BaseFrontendArticle {
//   author: PopulatedField<FrontendUser>;
//   artwork: PopulatedField<FrontendArtwork>;
// }

// export interface FrontendArticleWithArtwork extends BaseFrontendArticle {
//   author: PopulatedField<FrontendUser>;
//   artwork: FrontendArtwork;
// }

// export interface FrontendArticleUnpopulated extends BaseFrontendArticle {
//   author: string;
//   artwork: string;
// }

// export interface FrontendArticleWithAuthor extends BaseFrontendArticle {
//   author: PopulatedField<FrontendUser>;
//   artwork: string;
// }

// export interface FrontendArticleWithArtworkAndAuthor
//   extends BaseFrontendArticle {
//   author: FrontendUser;
//   artwork: FrontendArtwork;
// }

// export type ArticleLean = Omit<ArticleDB, keyof Document> & {
//   _id: string;
//   author: string;
//   artwork: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

import { ArticleDB } from "../models";
import { MongoDocumentLean } from "./utilTypes";
import { ArtworkSanitized, FrontendArtwork } from "./artworkTypes";
import { FrontendUser, UserSanitized } from "./userTypes";
import { UserLean } from "./userTypes";
import { ArtworkLean } from "./artworkTypes";

// the Article as it is retrieved from the DB, using 'lean()' to strip out the Mongoose metadata
export type ArticleLean = MongoDocumentLean<ArticleDB> & {
  author: string;
  artwork: string;
};

// the Article as it is retrieved from the DB, using 'populate()' to add the author and artwork
export type ArticleLeanPopulated = ArticleLean & {
  author: UserLean;
  artwork: ArtworkLean;
};

// the unpopulated Article as it is retrieved from the DB, with sensitive data removed
export type ArticleSanitized = ArticleLean;

// the populated Article as it is retrieved from the DB, with sensitive data removed
export type ArticleSanitizedPopulated = Omit<
  ArticleLeanPopulated,
  "author" | "artwork"
> & {
  author: UserSanitized;
  artwork: ArtworkSanitized;
};

export type ArticlePublic = ArticleLeanPopulated;

interface BaseFrontendArticle {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: Section;
  overlayColour: OverlayColour;
}

type PopulatedField<T> = string | T | Partial<T>;

export interface FrontendArticle extends BaseFrontendArticle {
  author: PopulatedField<FrontendUser>;
  artwork: PopulatedField<FrontendArtwork>;
}

export interface FrontendArticleWithArtwork extends BaseFrontendArticle {
  author: PopulatedField<FrontendUser>;
  artwork: FrontendArtwork;
}

export interface FrontendArticleUnpopulated extends BaseFrontendArticle {
  author: string;
  artwork: string;
}

export interface FrontendArticleWithAuthor extends BaseFrontendArticle {
  author: PopulatedField<FrontendUser>;
  artwork: string;
}

export interface FrontendArticleWithArtworkAndAuthor
  extends BaseFrontendArticle {
  author: FrontendUser;
  artwork: FrontendArtwork;
}

export interface ArticleFilterParams {
  key: "section" | null;
  value: string | null;
}

export type Section = "artwork" | "biography" | "project" | "collections";
export type OverlayColour = "white" | "black";
// export type ArticleLean = Omit<ArticleDB, keyof Document> & {
//   _id: string;
//   author: string;
//   artwork: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

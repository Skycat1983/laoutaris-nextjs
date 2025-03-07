import { ArticleDB, LeanArticle } from "../models";
import { FrontendArtwork } from "./artworkTypes";
import { FrontendUser } from "./userTypes";

export type ArticleLean = Omit<ArticleDB, keyof Document> & {
  _id: string;
  author: string;
  artwork: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticlePublic = LeanArticle & {
  author: PopulatedField<FrontendUser>;
  artwork: PopulatedField<FrontendArtwork>;
};

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

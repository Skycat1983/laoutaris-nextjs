import { FrontendArtworkFull } from "./artworkTypes";
import { FrontendUserFull } from "./userTypes";

export type FrontendArticle =
  | FrontendArticleFull
  | FrontendArticleUnpopulated
  | FrontendArticleWithAuthor
  | FrontendArticleWithArtwork;

export interface FrontendArticleFull {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: FrontendArtworkFull;
}

export interface FrontendArticleUnpopulated {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: string;
}

export interface FrontendArticleWithAuthor {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: string;
}

export interface FrontendArticleWithArtwork {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  overlayColour: "white" | "black";
  artwork: FrontendArtworkFull;
}

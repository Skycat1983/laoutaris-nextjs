import { FrontendArtworkFull } from "./artworkTypes";
import { FrontendUser } from "./userTypes";

export type Section = "artwork" | "biography" | "project";
type OverlayColour = "white" | "black";
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

type PopulatedField<T> = string | T;

export interface FrontendArticle extends BaseFrontendArticle {
  author: PopulatedField<FrontendUser>;
  artwork: PopulatedField<FrontendArtworkFull>;
}

// export type FrontendArticle =
//   | FrontendArticleFull
//   | FrontendArticleUnpopulated
//   | FrontendArticleWithAuthor
//   | FrontendArticleWithArtwork;

// export interface FrontendArticleFull {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: FrontendUserFull;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   overlayColour: "white" | "black";
//   artwork: FrontendArtworkFull;
// }

// export interface FrontendArticleUnpopulated {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   overlayColour: "white" | "black";
//   artwork: string;
// }

// export interface FrontendArticleWithAuthor {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: FrontendUserFull;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   overlayColour: "white" | "black";
//   artwork: string;
// }

// export interface FrontendArticleWithArtwork {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   overlayColour: "white" | "black";
//   artwork: FrontendArtworkFull;
// }

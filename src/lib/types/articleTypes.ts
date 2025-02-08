import { FrontendArtwork } from "./artworkTypes";
import { FrontendUser } from "./userTypes";
import { z } from "zod";

export type Section = "artwork" | "biography" | "project" | "collections";
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

export const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Article text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  section: z.enum(["artwork", "biography", "project", "collections"] as const),
  overlayColour: z.enum(["white", "black"] as const),
  artwork: z.string(),
});

export type CreateArticleFormValues = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Article text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  section: z.enum(["artwork", "biography", "project", "collections"] as const),
  overlayColour: z.enum(["white", "black"] as const),
  artwork: z.string(),
});

export type UpdateArticleFormValues = z.infer<typeof updateArticleSchema>;

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

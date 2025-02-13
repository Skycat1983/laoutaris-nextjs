import { FrontendArtwork, FrontendArtworkFull } from "./artworkTypes";
import { z } from "zod";

interface BaseFrontendCollection {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project" | "collections";
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T;

export interface FrontendCollection extends BaseFrontendCollection {
  artworks: PopulatedField<FrontendArtwork>[];
}

export interface FrontendCollectionWithArtworks extends BaseFrontendCollection {
  artworks: FrontendArtwork[];
}

export interface FrontendCollectionUnpopulated extends BaseFrontendCollection {
  artworks: string[];
}

// shape and rules for the create collection form
export const createCollectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(1, "Summary is required"),
  text: z.string().min(1, "Text content is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  // section: z
  //   .enum(["artwork", "biography", "project", "collections"])
  //   .default("collections"),
});

// type for the create collection form
export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;

// shape and rules for the update collection form
export const updateCollectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(1, "Summary is required"),
  text: z.string().min(1, "Text content is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  artworksToAdd: z.array(z.string()).optional(),
  artworksToRemove: z.array(z.string()).optional(),
});

export type UpdateCollectionFormValues = z.infer<typeof updateCollectionSchema>;

//! OLD TYPES BELOW:
//* TRYING WITH FULL USER TYPE
// export interface FrontendCollectionFull extends BaseFrontendCollection {
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   artworks: FrontendArtworkFull[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface FrontendCollectionUnpopulated {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project";
//   artworks: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

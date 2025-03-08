import { CollectionDB } from "../models";

import { ArtworkLean } from "./artworkTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

export interface CollectionFields {
  // artworks: string[];
}

export type CollectionLean = LeanDocument<CollectionDB> & CollectionFields;
export type CollectionRaw = TransformedDocument<CollectionLean>;
export type CollectionExtended = Merge<CollectionRaw, CollectionFields>;
export type CollectionSanitized = Omit<
  CollectionExtended,
  "_id" | "createdAt" | "updatedAt"
>;

export type CollectionTransformations = {
  DB: CollectionDB;
  Lean: CollectionLean;
  Raw: CollectionRaw;
  Extended: CollectionExtended;
  Sanitized: CollectionSanitized;
  Frontend: CollectionTransformations["Sanitized"];
};

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}

// export type CollectionSanitizedPopulated = Omit<
//   CollectionLeanPopulated,
//   "artworks"
// > & {
//   artworks: ArtworkSanitized[];
// };

// export type CollectionFrontend = CollectionSanitized;

// export type CollectionFrontendPopulated = Omit<
//   CollectionSanitizedPopulated,
//   "artworks"
// > & {
//   artworks: ArtworkFrontend[];
// };

// interface BaseFrontendCollection {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   imageUrl: string;
//   slug: string;
//   section: "artwork" | "biography" | "project" | "collections";
//   createdAt: Date;
//   updatedAt: Date;
// }

// type PopulatedField<T> = string | T | Partial<T>;

// export interface FrontendCollection extends BaseFrontendCollection {
//   artworks: PopulatedField<FrontendArtwork>[];
// }

// export interface FrontendCollectionWithArtworks extends BaseFrontendCollection {
//   artworks: FrontendArtworkUnpopulated[];
// }

// export interface FrontendCollectionUnpopulated extends BaseFrontendCollection {
//   artworks: string[];
// }

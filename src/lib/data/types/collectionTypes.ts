import { CollectionDB } from "../models";

import { ArtworkLean } from "./artworkTypes";
import { CollectionPopulatedFrontend } from "./populatedTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  TransformConfig,
  DocumentTransformations,
} from "./utilTypes";

export type CollectionLean = LeanDocument<CollectionDB>;
export type CollectionRaw = TransformedDocument<CollectionLean>;
export type CollectionExtended = Merge<CollectionRaw, CollectionFields>;
export type CollectionSanitized = Omit<
  CollectionExtended,
  "_id" | "createdAt" | "updatedAt"
>;

export interface CollectionFields {
  // artworks: string[];
  firstArtwork: string;
}

export type CollectionTransformations = {
  DB: CollectionDB;
  Lean: LeanDocument<CollectionTransformations["DB"]>;
  Raw: TransformedDocument<CollectionTransformations["Lean"]>;
  Extended: Merge<CollectionTransformations["Raw"], CollectionFields>;
  Sanitized: Omit<
    CollectionTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: CollectionTransformations["Sanitized"];
};

// export type CollectionTransformations = {
//   DB: CollectionDB;
//   Lean: CollectionLean;
//   Raw: CollectionRaw;
//   Extended: CollectionExtended;
//   Sanitized: CollectionSanitized;
//   Frontend: CollectionTransformations["Sanitized"];
// };

export type Collection = CollectionTransformations["Frontend"];
export type CollectionPopulated = CollectionPopulatedFrontend;

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

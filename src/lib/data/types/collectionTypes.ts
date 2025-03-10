import { CollectionDB } from "../models";
import { CollectionPopulatedFrontend } from "./populatedTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

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

export type Collection = CollectionTransformations["Frontend"];
export type CollectionPopulated = CollectionPopulatedFrontend;

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}

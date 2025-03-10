import { CollectionDB } from "../models";
import { CollectionPopulatedFrontend } from "./populatedTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

export type CollectionLean = LeanDocument<CollectionDB>;
export type CollectionRaw = TransformedDocument<CollectionLean>;
export type CollectionExtended = Merge<CollectionRaw, PublicCollectionFields>;
export type CollectionSanitized = Omit<
  CollectionExtended,
  "_id" | "createdAt" | "updatedAt"
>;

export interface PublicCollectionFields {
  firstArtwork: string;
}

export type PublicCollectionTransformations = {
  DB: CollectionDB;
  Lean: LeanDocument<PublicCollectionTransformations["DB"]>;
  Raw: TransformedDocument<PublicCollectionTransformations["Lean"]>;
  Extended: Merge<
    PublicCollectionTransformations["Raw"],
    PublicCollectionFields
  >;
  Sanitized: Omit<
    PublicCollectionTransformations["Extended"],
    "_id" | "createdAt" | "updatedAt"
  >;
  Frontend: PublicCollectionTransformations["Sanitized"];
};

export type PublicCollection = PublicCollectionTransformations["Frontend"];
export type PublicCollectionPopulated = CollectionPopulatedFrontend;

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}

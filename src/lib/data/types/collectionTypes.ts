import { CollectionDB } from "../models";
import { PublicArtworkTransformations } from "./artworkTypes";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";
import {
  ExtendedPublicCollectionFields,
  SensitivePublicCollectionFields,
} from "@/lib/constants";

//! PUBLIC COLLECTION
export type PublicCollectionTransformations = {
  DB: CollectionDB;
  Lean: LeanDocument<PublicCollectionTransformations["DB"]>;
  Raw: TransformedDocument<PublicCollectionTransformations["Lean"]>;
  Extended: Merge<
    PublicCollectionTransformations["Raw"],
    ExtendedPublicCollectionFields
  >;
  Sanitized: Omit<
    PublicCollectionTransformations["Extended"],
    SensitivePublicCollectionFields
  >;
  Frontend: PublicCollectionTransformations["Sanitized"];
};

export type PublicCollection = PublicCollectionTransformations["Frontend"];

//! PUBLIC COLLECTION POPULATED
export type PublicCollectionTransformationsPopulated = {
  Lean: WithPopulatedFields<
    PublicCollectionTransformations["Lean"],
    {
      artworks: PublicArtworkTransformations["Lean"][];
    }
  >;
  Raw: WithPopulatedFields<
    PublicCollectionTransformations["Raw"],
    {
      artworks: PublicArtworkTransformations["Raw"][];
    }
  >;
  Extended: WithPopulatedFields<
    PublicCollectionTransformations["Extended"],
    {
      artworks: PublicArtworkTransformations["Extended"][];
    }
  >;
  Frontend: WithPopulatedFields<
    PublicCollectionTransformations["Frontend"],
    {
      artworks: PublicArtworkTransformations["Frontend"][];
    }
  >;
};

export type PublicCollectionPopulated =
  PublicCollectionTransformationsPopulated["Frontend"];

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}

// export type CollectionLean = LeanDocument<CollectionDB>;
// export type CollectionRaw = TransformedDocument<CollectionLean>;
// export type CollectionExtended = Merge<CollectionRaw, PublicCollectionFields>;
// export type CollectionSanitized = Omit<
//   CollectionExtended,
//   "_id" | "createdAt" | "updatedAt"
// >;

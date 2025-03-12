import { CollectionDB } from "../models";
import { ArtworkFrontend, ArtworkLean } from "./artworkTypes";
import { LeanDocument, WithPopulatedFields } from "./utilTypes";
import { transformCollection } from "@/lib/transforms/transformCollection";

export type CollectionLean = LeanDocument<CollectionDB>;
export type CollectionFrontend = ReturnType<
  typeof transformCollection.toFrontend
>;

export type CollectionLeanPopulated = WithPopulatedFields<
  CollectionLean,
  {
    artworks: ArtworkLean[];
  }
>;

export type CollectionFrontendPopulated = WithPopulatedFields<
  CollectionFrontend,
  {
    artworks: ArtworkFrontend[];
  }
>;

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
// //! PUBLIC COLLECTION
// export type PublicCollectionTransformations = {
//   DB: CollectionDB;
//   Lean: LeanDocument<PublicCollectionTransformations["DB"]>;
//   Raw: TransformedDocument<PublicCollectionTransformations["Lean"]>;
//   Extended: Merge<
//     PublicCollectionTransformations["Raw"],
//     ExtendedPublicCollectionFields
//   >;
//   Sanitized: Omit<
//     PublicCollectionTransformations["Extended"],
//     SensitivePublicCollectionFields
//   >;
//   Frontend: PublicCollectionTransformations["Sanitized"];
// };

// export type PublicCollection = PublicCollectionTransformations["Frontend"];

// //! PUBLIC COLLECTION POPULATED
// export type PublicCollectionTransformationsPopulated = {
//   Lean: WithPopulatedFields<
//     PublicCollectionTransformations["Lean"],
//     {
//       artworks: PublicArtworkTransformations["Lean"][];
//     }
//   >;
//   Raw: WithPopulatedFields<
//     PublicCollectionTransformations["Raw"],
//     {
//       artworks: PublicArtworkTransformations["Raw"][];
//     }
//   >;
//   Extended: WithPopulatedFields<
//     PublicCollectionTransformations["Extended"],
//     {
//       artworks: PublicArtworkTransformations["Extended"][];
//     }
//   >;
//   Frontend: WithPopulatedFields<
//     PublicCollectionTransformations["Frontend"],
//     {
//       artworks: PublicArtworkTransformations["Frontend"][];
//     }
//   >;
// };

// export type PublicCollectionPopulated =
//   PublicCollectionTransformationsPopulated["Frontend"];

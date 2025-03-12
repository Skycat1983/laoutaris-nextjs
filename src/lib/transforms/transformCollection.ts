import {
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  ExtendedPublicCollectionFields,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
  SensitivePublicCollectionFields,
} from "../constants";
import { CollectionFrontend, CollectionLeanPopulated } from "../data/types";
import { createTransformer } from "./createTransformer";
import { CollectionDB, CollectionBase } from "../data/models";
import { transformArtwork } from "./transformArtwork";
import { extendCollectionFields } from "./transformHelpers";

export type TransformedCollection = ReturnType<
  typeof transformCollection.toFrontend
>;

export const transformCollection = createTransformer<
  CollectionDB,
  CollectionBase,
  ExtendedPublicCollectionFields,
  SensitivePublicCollectionFields
>(
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
  (doc) => ({
    ...extendCollectionFields(doc),
  })
);

export const transformCollectionPopulated = (
  doc: CollectionLeanPopulated,
  userId?: string | null
): CollectionFrontend => {
  const collectionPublic = transformCollection.toFrontend(doc, userId);
  const { artworks, ...baseDoc } = doc;
  const transformedArtworks = artworks.map((artwork) =>
    transformArtwork.toFrontend(artwork, userId)
  );

  const populatedCollection = {
    ...collectionPublic,
    artworks: transformedArtworks,
  } satisfies CollectionFrontend;

  return populatedCollection;
};

//export const transformCollectionPopulated = (
//   doc: PublicCollectionTransformationsPopulated["Lean"],
//   userId?: string | null
// ) => {
//   const collectionPublic = transformCollection.toFrontend(doc, userId);
//   const { artworks, ...baseDoc } = doc;
//   const transformedArtworks = artworks.map((artwork) =>
//     transformArtwork.toFrontend(artwork, userId)
//   );

//   const populatedCollection = {
//     ...collectionPublic,
//     artworks: transformedArtworks,
//   } satisfies PublicCollectionTransformationsPopulated["Frontend"];

//   return populatedCollection;
// };

// export const transformCollection = {
//   toRaw: (
//     doc: PublicCollectionTransformations["Lean"]
//   ): PublicCollectionTransformations["Raw"] => {
//     return transformMongooseDoc<PublicCollectionTransformations["Raw"]>(doc);
//   },

//   toExtended: (
//     doc: PublicCollectionTransformations["Raw"]
//   ): PublicCollectionTransformations["Extended"] => {
//     return transformUtils.extend(doc, EXTENDED_PUBLIC_COLLECTION_FIELDS);
//   },

//   toSanitized: (
//     doc: PublicCollectionTransformations["Extended"]
//   ): PublicCollectionTransformations["Sanitized"] => {
//     return transformUtils.removeSensitive(
//       doc,
//       SENSITIVE_PUBLIC_COLLECTION_FIELDS
//     );
//   },

//   toFrontend: (
//     doc: PublicCollectionTransformations["Sanitized"]
//   ): PublicCollectionTransformations["Frontend"] => {
//     return transformUtils.removeSensitive(
//       doc,
//       SENSITIVE_PUBLIC_COLLECTION_FIELDS
//     );
//   },
// };

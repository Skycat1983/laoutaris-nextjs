import {
  COLLECTION_FIELD_EXTENDER,
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
  ExtendedPublicCollectionFields,
  SensitivePublicCollectionFields,
} from "@/lib/constants";
import {
  CollectionFrontendPopulated,
  CollectionLeanPopulated,
} from "@/lib/data/types";
import { CollectionDB, CollectionBase } from "@/lib/data/models";
import { createTransformer, transformArtwork } from "@/lib/transforms";

export const transformCollection = createTransformer<
  CollectionDB,
  CollectionBase,
  ExtendedPublicCollectionFields,
  SensitivePublicCollectionFields
>(
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
  COLLECTION_FIELD_EXTENDER
);

export const transformCollectionPopulated = (
  doc: CollectionLeanPopulated,
  userId?: string | null
): CollectionFrontendPopulated => {
  const collectionPublic = transformCollection.toFrontend(doc, userId);
  const { artworks, ...baseDoc } = doc;
  const transformedArtworks = artworks.map((artwork) =>
    transformArtwork.toFrontend(artwork, userId)
  );

  const populatedCollection = {
    ...collectionPublic,
    artworks: transformedArtworks,
  } satisfies CollectionFrontendPopulated;

  return populatedCollection;
};

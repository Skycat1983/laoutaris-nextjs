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
  CollectionSelectFieldsLean,
} from "@/lib/data/types";
import { CollectionDB, CollectionBase } from "@/lib/data/models";
import { createTransformer, transformArtwork } from "@/lib/transforms";
import {
  EXTENDED_COLLECTION_NAV_FIELDS,
  ExtendedCollectionNavFields,
} from "../../constants/navConstants";

//! COLLECTION PUBLIC TRANSFORMER
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

//! COLLECTION POPULATED TRANSFORMER
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

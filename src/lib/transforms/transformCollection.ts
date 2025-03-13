import {
  COLLECTION_FIELD_EXTENDER,
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  ExtendedPublicCollectionFields,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
  SensitivePublicCollectionFields,
} from "../constants";
import {
  CollectionFrontendPopulated,
  CollectionLeanPopulated,
  Prettify,
} from "../data/types";
import { createTransformer } from "./createTransformer";
import { CollectionDB, CollectionBase } from "../data/models";
import { transformArtwork } from "./transformArtwork";

export type TransformedCollection = ReturnType<
  typeof transformCollection.toFrontend
>;

type RawReturn = Prettify<ReturnType<typeof transformCollection.toRaw>>;
type ExtendedReturn = Prettify<
  ReturnType<typeof transformCollection.toExtended>
>;
type SanitizedReturn = Prettify<
  ReturnType<typeof transformCollection.toSanitized>
>;
type FrontendReturn = Prettify<
  ReturnType<typeof transformCollection.toFrontend>
>;

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

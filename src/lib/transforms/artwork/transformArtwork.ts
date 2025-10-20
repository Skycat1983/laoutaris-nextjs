import {
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  ExtendedPublicArtworkFields,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  SensitivePublicArtworkFields,
  ARTWORK_FIELD_EXTENDER,
} from "../../constants";
import { createTransformer } from "../createTransformer";
import { ArtworkBase, ArtworkDB } from "../../data/models";
import {
  ArtworkLeanPopulated,
  ArtworkFrontendPopulated,
} from "../../data/types";
import { transformCollection } from "..";

export type TransformedArtwork = ReturnType<typeof transformArtwork.toFrontend>;

export const transformArtwork = createTransformer<
  ArtworkDB,
  ArtworkBase,
  ExtendedPublicArtworkFields,
  SensitivePublicArtworkFields
>(
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  ARTWORK_FIELD_EXTENDER
);

export const transformArtworkPopulated = (
  doc: ArtworkLeanPopulated,
  userId?: string | null
): ArtworkFrontendPopulated => {
  const artworkPublic = transformArtwork.toFrontend(doc, userId);
  const { collections, ...baseDoc } = doc;
  const transformedCollections = collections.map((collection) =>
    transformCollection.toFrontend(collection, userId)
  );

  const populatedArtwork = {
    ...artworkPublic,
    collections: transformedCollections,
  } satisfies ArtworkFrontendPopulated;

  return populatedArtwork;
};

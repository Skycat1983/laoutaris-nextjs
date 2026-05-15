import {
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  ExtendedPublicArtworkFields,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  SensitivePublicArtworkFields,
  ARTWORK_FIELD_EXTENDER,
} from "../../constants";
import { createTransformer } from "../createTransformer";
import type { ArtworkBase, ArtworkDB } from "../../data/models";
import type {
  ArtworkLeanPopulated,
  ArtworkFrontendPopulated,
  CloudinaryImageFrontend,
  CloudinaryImageSanitizable,
  LeanDocument,
  Prettify,
  TransformedDocument,
} from "../../data/types";
import { transformCollection } from "..";
import { transformImage } from "./transformImage";

type ArtworkPublicBase = Omit<
  TransformedDocument<LeanDocument<ArtworkDB>> & ExtendedPublicArtworkFields,
  SensitivePublicArtworkFields
>;

type ArtworkFrontendSanitized = Prettify<
  Omit<ArtworkPublicBase, "image"> & {
    image: CloudinaryImageFrontend;
  }
>;

export type TransformedArtwork = ReturnType<typeof transformArtwork.toFrontend>;

const baseArtworkTransformer = createTransformer<
  ArtworkDB,
  ArtworkBase,
  ExtendedPublicArtworkFields,
  SensitivePublicArtworkFields
>(
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  ARTWORK_FIELD_EXTENDER
);

export const transformArtwork = {
  ...baseArtworkTransformer,
  toFrontend: (
    doc: LeanDocument<ArtworkDB> | ArtworkLeanPopulated,
    userId?: string | null
  ): ArtworkFrontendSanitized => {
    const artworkPublic = baseArtworkTransformer.toFrontend(
      doc as LeanDocument<ArtworkDB>,
      userId
    ) as ArtworkPublicBase;

    return {
      ...artworkPublic,
      image: transformImage(artworkPublic.image as CloudinaryImageSanitizable),
    };
  },
};

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

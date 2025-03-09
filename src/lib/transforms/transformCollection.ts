import { CollectionTransformations } from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";

export const transformCollection = (
  collection: CollectionTransformations["Lean"]
): CollectionTransformations["Frontend"] => {
  const transformedDoc: CollectionTransformations["Raw"] =
    transformMongooseDoc<CollectionTransformations["Raw"]>(collection);

  const extendedDoc: CollectionTransformations["Extended"] = {
    ...transformedDoc,
    firstArtwork: transformedDoc.artworks[0].toString(),
  };

  const { createdAt, updatedAt, _id, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc: CollectionTransformations["Sanitized"] = {
    ...sanitizedFields,
  } satisfies CollectionTransformations["Sanitized"];

  return sanitizedDoc;
};

export const transformCollection2 = (
  collection: CollectionTransformations["Lean"]
): CollectionTransformations["Frontend"] => {
  const transformedDoc =
    transformMongooseDoc<CollectionTransformations["Raw"]>(collection);

  // Use config for extensions
  const extendedDoc = {
    ...transformedDoc,
    ...CollectionConfig.extend,
    firstArtwork: transformedDoc.artworks[0].toString(),
  };

  // Use config for sanitization
  const sanitizedDoc = Object.fromEntries(
    Object.entries(extendedDoc).filter(
      ([key]) => !CollectionConfig.sanitize.includes(key as any)
    )
  ) as CollectionTransformations["Sanitized"];

  return sanitizedDoc;
};

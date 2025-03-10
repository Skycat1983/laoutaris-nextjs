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

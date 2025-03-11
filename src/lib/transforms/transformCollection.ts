import {
  EXTENDED_PUBLIC_COLLECTION_FIELDS,
  SENSITIVE_PUBLIC_COLLECTION_FIELDS,
} from "../constants";
import { PublicCollectionTransformations } from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformUtils } from "./transformUtils";

export const transformCollection = {
  toRaw: (
    doc: PublicCollectionTransformations["Lean"]
  ): PublicCollectionTransformations["Raw"] => {
    return transformMongooseDoc<PublicCollectionTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicCollectionTransformations["Raw"]
  ): PublicCollectionTransformations["Extended"] => {
    return transformUtils.extend(doc, EXTENDED_PUBLIC_COLLECTION_FIELDS);
  },

  toSanitized: (
    doc: PublicCollectionTransformations["Extended"]
  ): PublicCollectionTransformations["Sanitized"] => {
    return transformUtils.removeSensitive(
      doc,
      SENSITIVE_PUBLIC_COLLECTION_FIELDS
    );
  },

  toFrontend: (
    doc: PublicCollectionTransformations["Sanitized"]
  ): PublicCollectionTransformations["Frontend"] => {
    return transformUtils.removeSensitive(
      doc,
      SENSITIVE_PUBLIC_COLLECTION_FIELDS
    );
  },
};

// export const transformCollection = (
//   collection: CollectionTransformations["Lean"]
// ): CollectionTransformations["Frontend"] => {
//   const transformedDoc: CollectionTransformations["Raw"] =
//     transformMongooseDoc<CollectionTransformations["Raw"]>(collection);

//   const extendedDoc: CollectionTransformations["Extended"] = {
//     ...transformedDoc,
//     firstArtwork: transformedDoc.artworks[0].toString(),
//   };

//   const { createdAt, updatedAt, _id, ...sanitizedFields } = extendedDoc;
//   const sanitizedDoc: CollectionTransformations["Sanitized"] = {
//     ...sanitizedFields,
//   } satisfies CollectionTransformations["Sanitized"];

//   return sanitizedDoc;
// };

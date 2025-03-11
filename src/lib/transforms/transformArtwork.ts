import { transformUtils } from "./transformUtils";
import {
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
} from "../constants";
import { PublicArtworkTransformations } from "../data/types";
import { transformImage } from "./transformImage";

export const transformArtwork = {
  toRaw: (
    doc: PublicArtworkTransformations["Lean"]
  ): PublicArtworkTransformations["Raw"] => {
    return transformUtils.toRaw<PublicArtworkTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicArtworkTransformations["Raw"]
  ): PublicArtworkTransformations["Extended"] => {
    return transformUtils.extend(doc, EXTENDED_PUBLIC_ARTWORK_FIELDS);
  },

  toSanitized: (
    doc: PublicArtworkTransformations["Extended"]
  ): PublicArtworkTransformations["Sanitized"] => {
    const { image, ...sanitizedFields } = doc;
    const sanitizedImage = transformImage(image);
    return transformUtils.merge(sanitizedFields, {
      image: sanitizedImage,
    }) satisfies PublicArtworkTransformations["Sanitized"];
  },

  toFrontend: (
    doc: PublicArtworkTransformations["Lean"]
  ): PublicArtworkTransformations["Frontend"] => {
    return transformArtwork.toSanitized(
      transformArtwork.toExtended(transformArtwork.toRaw(doc))
    ) satisfies PublicArtworkTransformations["Frontend"];
  },
};

// toFrontend: (
//   doc: PublicArtworkTransformations["Sanitized"]
// ): PublicArtworkTransformations["Frontend"] => {
//   return doc satisfies PublicArtworkTransformations["Frontend"];
// },

// export function transformArtwork(
//   document: ArtworkTransformations["Lean"],
//   userId: string | null
// ): ArtworkTransformations["Frontend"] {
//   // Convert ObjectIds to strings and strip Mongoose properties
//   const transformedDoc: ArtworkTransformations["Raw"] =
//     transformMongooseDoc<ArtworkTransformations["Raw"]>(document);

//   // 2. Add extensions
//   const isFavourited = isUserInArray(document.favourited, userId);
//   const isWatchlisted = isUserInArray(document.watcherlist, userId);
//   const extendedDoc: ArtworkExtended = {
//     ...transformedDoc,
//     favouriteCount: document.favourited.length,
//     watchlistCount: document.watcherlist.length,
//     isFavourited,
//     isWatchlisted,
//   };

//   // 3. Remove sensitive fields
//   const { favourited, watcherlist, image, ...sanitizedFields } = extendedDoc;
//   const sanitizedImage = transformImage(image);
//   const sanitizedDoc = {
//     ...sanitizedFields,
//     image: sanitizedImage,
//   } satisfies ArtworkTransformations["Sanitized"];

//   return sanitizedDoc; // Frontend is same as sanitized for artworks
// }

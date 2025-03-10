import {
  AdminArtworkTransformations,
  ArtworkTransformations,
} from "../data/types";
import { transformImage } from "./transformImage";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { ArtworkExtended } from "../data/types/artworkTypes";
import { isUserInArray } from "../utils/isUserInArray";

export function transformArtwork(
  document: ArtworkTransformations["Lean"],
  userId: string | null
): ArtworkTransformations["Frontend"] {
  // Convert ObjectIds to strings and strip Mongoose properties
  const transformedDoc: ArtworkTransformations["Raw"] =
    transformMongooseDoc<ArtworkTransformations["Raw"]>(document);

  // 2. Add extensions
  const isFavourited = isUserInArray(document.favourited, userId);
  const isWatchlisted = isUserInArray(document.watcherlist, userId);
  const extendedDoc: ArtworkExtended = {
    ...transformedDoc,
    favouriteCount: document.favourited.length,
    watchlistCount: document.watcherlist.length,
    isFavourited,
    isWatchlisted,
  };

  // 3. Remove sensitive fields
  const { favourited, watcherlist, image, ...sanitizedFields } = extendedDoc;
  const sanitizedImage = transformImage(image);
  const sanitizedDoc = {
    ...sanitizedFields,
    image: sanitizedImage,
  } satisfies ArtworkTransformations["Sanitized"];

  return sanitizedDoc; // Frontend is same as sanitized for artworks
}

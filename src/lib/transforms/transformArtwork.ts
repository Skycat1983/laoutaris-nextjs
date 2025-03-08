import { ArtworkDB } from "../data/models";
import { ArtworkTransformations } from "../data/types/transformationTypes";
import { transformImage } from "./transformImage";
import { transformMongooseDoc } from "./transformMongooseDoc";

export function transformArtwork(
  document: ArtworkDB
): ArtworkTransformations["Frontend"] {
  // 1. To Lean
  const transformedDoc =
    transformMongooseDoc<ArtworkTransformations["Raw"]>(document);

  // 2. Add extensions with explicit type assertion
  const extendedDoc = {
    ...transformedDoc,
    favouriteCount: 0,
    watchlistCount: 0,
    isFavourited: false,
    isWatchlisted: false,
  } satisfies ArtworkTransformations["Extended"];

  // 3. Remove sensitive fields
  const { favourited, watcherlist, image, ...sanitizedFields } = extendedDoc;
  const sanitizedImage = transformImage(image);
  const sanitizedDoc = {
    ...sanitizedFields,
    image: sanitizedImage,
  } satisfies ArtworkTransformations["Sanitized"];

  return sanitizedDoc; // Frontend is same as sanitized for artworks
}

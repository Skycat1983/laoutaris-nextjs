import { ArtworkDB } from "../data/models";
import { ArtworkTransformations } from "../data/types/transformationTypes";
import { transformMongooseDoc } from "./mongooseTransforms";

export function transformArtwork(
  document: ArtworkDB
): ArtworkTransformations["Frontend"] {
  // 1. To Lean
  const leanDoc =
    transformMongooseDoc<ArtworkTransformations["Lean"]>(document);

  // 2. Add extensions with explicit type assertion
  const extendedDoc = {
    ...leanDoc,
    favouriteCount: 0,
    watchlistCount: 0,
    isFavourited: false,
    isWatchlisted: false,
  } satisfies ArtworkTransformations["Extended"];

  // 3. Remove sensitive fields
  const { favourited, watcherlist, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc =
    sanitizedFields satisfies ArtworkTransformations["Sanitized"];

  return sanitizedDoc; // Frontend is same as sanitized for artworks
}

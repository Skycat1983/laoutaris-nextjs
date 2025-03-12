import {
  ExtendedPublicArtworkFields,
  ExtendedPublicCollectionFields,
} from "../constants";
import { ArtworkDB, CollectionDB } from "../data/models";
import { isUserInArray } from "../utils/isUserInArray";

export const extendArtworkFields = (
  artwork: ArtworkDB,
  userId?: string | null
) => {
  return {
    favouriteCount: artwork.favourited.length,
    watchlistCount: artwork.watcherlist.length,
    isFavourited: isUserInArray(artwork.favourited, userId),
    isWatchlisted: isUserInArray(artwork.watcherlist, userId),
  } satisfies Partial<ExtendedPublicArtworkFields>;
};

export const extendCollectionFields = (
  doc: CollectionDB,
  userId?: string | null
) => {
  return {
    artworkCount: doc.artworks.length,
    firstArtworkId: doc.artworks[0]?.toString(),
  } satisfies Partial<ExtendedPublicCollectionFields>;
};

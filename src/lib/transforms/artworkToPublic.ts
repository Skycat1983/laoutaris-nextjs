import { FrontendArtworkUnpopulated } from "../types/artworkTypes";

export type PublicArtwork = Omit<
  FrontendArtworkUnpopulated,
  "watcherlist" | "favourited"
> & {
  favouritedCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};

export const artworkToPublic = (
  artwork: FrontendArtworkUnpopulated,
  userId?: string | null
): PublicArtwork => {
  const isFavourited = userId ? artwork.favourited.includes(userId) : false;
  const isWatchlisted = userId ? artwork.watcherlist.includes(userId) : false;

  return {
    _id: artwork._id,
    image: artwork.image,
    title: artwork.title,
    decade: artwork.decade,
    artstyle: artwork.artstyle,
    medium: artwork.medium,
    surface: artwork.surface,
    featured: artwork.featured,
    createdAt: artwork.createdAt,
    updatedAt: artwork.updatedAt,
    collections: artwork.collections,
    favouritedCount: artwork.favourited.length,
    watchlistCount: artwork.watcherlist.length,
    isFavourited,
    isWatchlisted,
  };
};

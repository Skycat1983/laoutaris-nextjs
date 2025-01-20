import { FrontendArtworkUnpopulated } from "../../../types/artworkTypes";

export type SanitizedArtwork = Omit<
  FrontendArtworkUnpopulated,
  "watcherlist" | "favourited"
> & {
  favouritedCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};

export const artworkToView = (
  artwork: FrontendArtworkUnpopulated,
  currentUserId?: string
): SanitizedArtwork => {
  const isFavourited = currentUserId
    ? artwork.favourited.includes(currentUserId)
    : false;

  const isWatchlisted = currentUserId
    ? artwork.watcherlist.includes(currentUserId)
    : false;

  return {
    _id: artwork._id,
    image: artwork.image,
    title: artwork.title,
    decade: artwork.decade,
    artstyle: artwork.artstyle,
    medium: artwork.medium,
    surface: artwork.surface,
    featured: artwork.featured,
    favouritedCount: artwork.favourited.length,
    watchlistCount: artwork.watcherlist.length,
    isFavourited,
    isWatchlisted,
  };
};

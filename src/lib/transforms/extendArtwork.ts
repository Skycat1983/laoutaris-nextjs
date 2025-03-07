import { ArtworkExtended } from "../data/types";
import { ArtworkLean } from "../data/types";

export function extendArtwork(artwork: ArtworkLean): ArtworkExtended {
  return {
    ...artwork,
    favouriteCount: artwork.favourited.length,
    watchlistCount: artwork.watcherlist.length,
    isFavourited: artwork.favourited.includes(artwork._id),
    isWatchlisted: artwork.watcherlist.includes(artwork._id),
  };
}

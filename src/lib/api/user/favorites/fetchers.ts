import type { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import type { PublicArtwork } from "../../../../../unused/artworkToPublic";
import type { Fetcher } from "../../core/createFetcher";

export const createFavoritesFetchers = (fetcher: Fetcher) => ({
  // Get user favorites
  getFavourites: async () =>
    fetcher<{ favourites: ArtworkNavFields[] }>(`/api/v2/user/favourite`),

  // Get specific favorite artwork
  getFavouriteArtwork: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<PublicArtwork>(`/api/v2/user/favourite/${encodedArtworkId}`);
  },

  // Add artwork to favorites (assuming this endpoint exists or will be created)
  addToFavourites: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/user/favourite/${encodedArtworkId}`,
      {
        method: "POST",
      }
    );
  },

  // Remove artwork from favorites (assuming this endpoint exists or will be created)
  removeFromFavourites: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/user/favourite/${encodedArtworkId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type FavoritesFetchers = ReturnType<typeof createFavoritesFetchers>;

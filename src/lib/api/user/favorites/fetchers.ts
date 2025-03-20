import type { Fetcher } from "../../core/createFetcher";
import { ArtworkFrontend, ListResult, Prettify } from "@/lib/data/types";
import { SingleResult } from "@/lib/data/types";

type AddRemoveResult = {
  success: boolean;
  message: string;
};

export type ApiFavoritesListResult = ListResult<ArtworkFrontend>;
export type ApiFavoritesItemResult = SingleResult<ArtworkFrontend>;
export type ApiAddRemoveResult = SingleResult<AddRemoveResult>;

export const createFavoritesFetchers = (fetcher: Fetcher) => ({
  // Get user favorites
  getList: async () =>
    fetcher<ApiFavoritesListResult>(`/api/v2/user/favourite`, {
      method: "GET",
      cache: "no-store",
    }),

  // Get specific favorite artwork
  getOne: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiFavoritesItemResult>(
      `/api/v2/user/favourite/${encodedArtworkId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
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

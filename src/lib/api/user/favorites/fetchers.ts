import type { Fetcher } from "../../core/createFetcher";
import type {
  ArtworkFrontend,
  ListResult,
  SingleResult,
} from "@/lib/data/types";

export type ApiFavoritesListResult = ListResult<ArtworkFrontend>;
export type ApiFavoritesItemResult = SingleResult<ArtworkFrontend>;

export const createFavoritesFetchers = (fetcher: Fetcher) => ({
  // Get user favorites
  getList: async () =>
    fetcher<ApiFavoritesListResult>(`/api/v2/user/favourite`, {
      method: "GET",
      // cache: "no-store",
    }),

  // Get specific favorite artwork
  getOne: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiFavoritesItemResult>(
      `/api/v2/user/favourite/${encodedArtworkId}`,
      {
        method: "GET",
        // cache: "no-store",
      }
    );
  },
});

export type FavoritesFetchers = ReturnType<typeof createFavoritesFetchers>;

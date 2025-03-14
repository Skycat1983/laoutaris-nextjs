import type { Fetcher } from "../../core/createFetcher";
import type {
  ListResult,
  SingleResult,
  ArtworkFrontend,
} from "@/lib/data/types";

type AddRemoveResult = {
  success: boolean;
  message: string;
};

export type ApiWatchlistListResult = ListResult<ArtworkFrontend>;
export type ApiWatchlistItemResult = SingleResult<ArtworkFrontend>;
export type ApiAddRemoveResult = SingleResult<AddRemoveResult>;

export const createWatchlistFetchers = (fetcher: Fetcher) => ({
  // Get user watchlist
  getList: async () =>
    fetcher<ApiWatchlistListResult>(`/api/v2/user/watchlist`),

  // Get specific watchlist artwork
  getOne: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiWatchlistItemResult>(
      `/api/v2/user/watchlist/${encodedArtworkId}`
    );
  },

  // Add artwork to watchlist (assuming this endpoint exists or will be created)
  addToWatchlist: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiAddRemoveResult>(
      `/api/v2/user/watchlist/${encodedArtworkId}`,
      {
        method: "POST",
      }
    );
  },

  // Remove artwork from watchlist (assuming this endpoint exists or will be created)
  removeFromWatchlist: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<ApiAddRemoveResult>(
      `/api/v2/user/watchlist/${encodedArtworkId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type WatchlistFetchers = ReturnType<typeof createWatchlistFetchers>;

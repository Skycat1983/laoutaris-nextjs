import type { FrontendUserWithWatchlist } from "@/lib/data/types/userTypes";
import type { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import type { Fetcher } from "../../core/createFetcher";

export const createWatchlistFetchers = (fetcher: Fetcher) => ({
  // Get user watchlist
  getWatchlist: async () =>
    fetcher<FrontendUserWithWatchlist>(`/api/v2/user/watchlist`),

  // Get specific watchlist artwork
  getWatchlistArtwork: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<PublicArtwork>(`/api/v2/user/watchlist/${encodedArtworkId}`);
  },

  // Add artwork to watchlist (assuming this endpoint exists or will be created)
  addToWatchlist: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/user/watchlist/${encodedArtworkId}`,
      {
        method: "POST",
      }
    );
  },

  // Remove artwork from watchlist (assuming this endpoint exists or will be created)
  removeFromWatchlist: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/user/watchlist/${encodedArtworkId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type WatchlistFetchers = ReturnType<typeof createWatchlistFetchers>;

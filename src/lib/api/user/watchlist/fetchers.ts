import type { Fetcher } from "../../core/createFetcher";
import type {
  ListResult,
  SingleResult,
  ArtworkFrontend,
} from "@/lib/data/types";

export type ApiWatchlistListResult = ListResult<ArtworkFrontend>;
export type ApiWatchlistItemResult = SingleResult<ArtworkFrontend>;

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
});

export type WatchlistFetchers = ReturnType<typeof createWatchlistFetchers>;

import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { serverApi } from "@/lib/api/serverApi";
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/data/types";
import { ApiWatchlistListResult } from "@/lib/api/user/watchlist/fetchers";

type LoaderResult = ApiWatchlistListResult | ApiErrorResponse;

export async function WatchlistPaginationLoader() {
  const result: LoaderResult = await serverApi.user.watchlist.getList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user watchlist");
  }

  const { data } = result as ApiWatchlistListResult;

  // const { data } = result as ApiSuccessResponse<{
  //   watchlist: ArtworkNavFields[];
  // }>;

  const buildFavouritesLink = (artwork: ArtworkNavFields) =>
    buildUrl(["account", "watchlist", artwork._id]);

  return (
    <ScrollableArtworkPagination
      items={data.watchlist.map((artwork) => ({
        ...artwork,
        link: buildFavouritesLink(artwork),
      }))}
      heading="Your Watchlist"
    />
  );
}

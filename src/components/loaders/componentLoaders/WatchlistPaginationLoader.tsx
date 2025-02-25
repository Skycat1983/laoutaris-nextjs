import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";

export async function WatchlistPaginationLoader() {
  const result = await serverPublicApi.user.fetchUserWatchlist();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user watchlist");
  }

  const { data } = result as ApiSuccessResponse<{
    watchlist: ArtworkNavFields[];
  }>;

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

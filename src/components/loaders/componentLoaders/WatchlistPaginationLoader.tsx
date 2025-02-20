import { serverApi } from "@/lib/api/server";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";

export async function WatchlistPaginationLoader() {
  const result = await serverApi.user.fetchUserWatchlist();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user watchlist");
  }

  const { data } = result as ApiSuccessResponse<{
    watchlist: ArtworkNavFields[];
  }>;

  const buildFavouritesLink = (artwork: ArtworkNavFields) =>
    buildUrl(["account", "watchlist", artwork._id]);

  return (
    <ArtworkPagination
      items={data.watchlist}
      heading="Your Watchlist"
      link_to={buildFavouritesLink}
    />
  );
}

import { buildUrl } from "@/lib/utils/urlUtils";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { serverApi } from "@/lib/api/serverApi";
import { ApiFavoritesListResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkFrontend, Prettify } from "@/lib/data/types";

export async function WatchlistPaginationLoader() {
  const result = await serverApi.user.watchlist.getList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch watchlist");
  }

  const { data } = result as Prettify<ApiFavoritesListResult>;

  const buildWatchlistLink = (artwork: ArtworkFrontend) =>
    buildUrl(["account", "watchlist", artwork._id]);

  return (
    <>
      <ScrollableArtworkPagination
        items={data.map((artwork) => ({
          ...artwork,
          link: buildWatchlistLink(artwork),
        }))}
        heading="Your Watchlist"
      />
    </>
  );
}

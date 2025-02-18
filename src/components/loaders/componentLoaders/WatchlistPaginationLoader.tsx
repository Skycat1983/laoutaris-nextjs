import { fetchUserWatchlist } from "@/lib/api/public/userApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";

export async function WatchlistPaginationLoader() {
  const result = await fetchUserWatchlist();

  if (!result.success) {
    return <div>Error fetching user favourites</div>;
  }

  const { data } = result;

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

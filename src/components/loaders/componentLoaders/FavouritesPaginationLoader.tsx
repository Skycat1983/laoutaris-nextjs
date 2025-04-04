import { buildUrl } from "@/lib/utils/urlUtils";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { serverApi } from "@/lib/api/serverApi";
import { ApiFavoritesListResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkFrontend, Prettify } from "@/lib/data/types";

export async function FavouritesPaginationLoader() {
  const result = await serverApi.user.favourites.getList();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch favourites");
  }

  const { data } = result as Prettify<ApiFavoritesListResult>;

  const buildFavouritesLink = (artwork: ArtworkFrontend) =>
    buildUrl(["account", "favourites", artwork._id]);

  return (
    <>
      <ScrollableArtworkPagination
        items={data.map((artwork) => ({
          ...artwork,
          link: buildFavouritesLink(artwork),
        }))}
        heading="Your Favourites"
      />
    </>
  );
}

import { serverApi } from "@/lib/api/server";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";

export async function FavouritesPaginationLoader() {
  const result = await serverApi.user.fetchUserFavourites();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch favourites");
  }

  const { data } = result as ApiSuccessResponse<{
    favourites: ArtworkNavFields[];
  }>;

  const buildFavouritesLink = (artwork: ArtworkNavFields) =>
    buildUrl(["account", "favourites", artwork._id]);

  return (
    <ArtworkPagination
      items={data.favourites}
      heading="Your Favourites"
      link_to={buildFavouritesLink}
    />
  );
}

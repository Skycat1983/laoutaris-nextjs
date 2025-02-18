import { fetchUserFavourites } from "@/lib/api/public/userApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";

export async function FavouritesPaginationLoader() {
  const result = await fetchUserFavourites();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch favourites");
  }

  const {
    data: { favourites },
  } = result;

  // console.log("data in UserFavouritesPaginationLoader", favourites);

  const buildFavouritesLink = (artwork: ArtworkNavFields) =>
    buildUrl(["account", "favourites", artwork._id]);

  return (
    <ArtworkPagination
      items={favourites}
      heading="Your Favourites"
      link_to={buildFavouritesLink}
    />
  );
}

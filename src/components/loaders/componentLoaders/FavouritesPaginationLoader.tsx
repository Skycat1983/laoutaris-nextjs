import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { buildUrl } from "@/lib/utils/buildUrl";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { ArtworkPagination } from "@/components/modules/pagination/CollectionViewPagination";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";

export async function FavouritesPaginationLoader() {
  const result: ApiResponse<{
    favourites: ArtworkNavFields[];
  }> = await serverPublicApi.user.fetchUserFavourites();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch favourites");
  }

  const { data } = result as ApiSuccessResponse<{
    favourites: ArtworkNavFields[];
  }>;

  const buildFavouritesLink = (artwork: ArtworkNavFields) =>
    buildUrl(["account", "favourites", artwork._id]);

  return (
    // <ArtworkPagination
    //   items={data.favourites}
    //   heading="Your Favourites"
    //   link_to={buildFavouritesLink}
    // />

    <ScrollableArtworkPagination
      items={data.favourites.map((artwork) => ({
        ...artwork,
        link: buildFavouritesLink(artwork),
      }))}
      heading="Your Favourites"
    />
  );
}

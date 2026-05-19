import { buildUrl } from "@/lib/utils/urlUtils";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { getOwnFavouriteArtworkList } from "@/lib/data/services/getOwnSavedArtwork";
import type { ArtworkFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function FavouritesPaginationLoader() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let result: Awaited<ReturnType<typeof getOwnFavouriteArtworkList>>;

  try {
    result = await getOwnFavouriteArtworkList(userId);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    throw new Error("Failed to fetch user favourites");
  }

  if (!result) {
    throw new Error("User not found");
  }

  const buildFavouritesLink = (artwork: ArtworkFrontend) =>
    buildUrl(["account", "favourites", artwork._id]);

  return (
    <>
      <ScrollableArtworkPagination
        items={result.artworks.map((artwork) => ({
          ...artwork,
          link: buildFavouritesLink(artwork),
        }))}
        heading="Your Favourites"
      />
    </>
  );
}

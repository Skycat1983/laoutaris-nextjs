import { buildUrl } from "@/lib/utils/urlUtils";
import { ScrollableArtworkPagination } from "@/components/modules/pagination/ScrollableArtworkPagination";
import { getOwnWatchlistArtworkList } from "@/lib/data/services/getOwnSavedArtwork";
import type { ArtworkFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function WatchlistPaginationLoader() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let result: Awaited<ReturnType<typeof getOwnWatchlistArtworkList>>;

  try {
    result = await getOwnWatchlistArtworkList(userId);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    throw new Error("Failed to fetch user watchlist");
  }

  if (!result) {
    throw new Error("User not found");
  }

  const buildWatchlistLink = (artwork: ArtworkFrontend) =>
    buildUrl(["account", "watchlist", artwork._id]);

  return (
    <>
      <ScrollableArtworkPagination
        items={result.artworks.map((artwork) => ({
          ...artwork,
          link: buildWatchlistLink(artwork),
        }))}
        heading="Your Watchlist"
      />
    </>
  );
}

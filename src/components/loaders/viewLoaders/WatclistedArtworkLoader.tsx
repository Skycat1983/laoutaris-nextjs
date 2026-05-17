import { ArtworkView } from "@/components/views/ArtworkView";
import { getOwnWatchlistArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function WatchlistedArtworkLoader({
  artworkId,
}: {
  artworkId: string;
}) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let result: Awaited<ReturnType<typeof getOwnWatchlistArtwork>>;

  try {
    result = await getOwnWatchlistArtwork(userId, artworkId);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    throw new Error("Failed to fetch watchlist artwork");
  }

  if (result.status === "artwork-not-found") {
    throw new Error("Artwork not found");
  }

  if (result.status === "not-in-watchlist") {
    throw new Error("Artwork not in watchlist");
  }

  return (
    <>
      <ArtworkView {...result.artwork} />
      {/* <ArtInfoTabs {...artworkData} /> */}
    </>
  );
}

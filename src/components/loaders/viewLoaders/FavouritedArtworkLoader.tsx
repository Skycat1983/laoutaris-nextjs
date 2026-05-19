import { ArtworkView } from "@/components/views/ArtworkView";
import { getOwnFavouriteArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

const logger = createServerLogger({
  component: "FavouritedArtworkLoader",
  operation: "account.favourite_artwork.loader",
  surface: "server_loader",
});

type FavouritedArtworkLoaderStatusCategory =
  | "missing_session"
  | "artwork_not_found"
  | "not_in_favourites"
  | "unexpected_error";

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Account favourite artwork loader failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

export const FavouritedArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  let statusCategory: FavouritedArtworkLoaderStatusCategory =
    "unexpected_error";

  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      statusCategory = "missing_session";
      throw new Error("Unauthorized");
    }

    const result = await getOwnFavouriteArtwork(userId, artworkId);

    if (result.status === "artwork-not-found") {
      statusCategory = "artwork_not_found";
      throw new Error("Artwork not found");
    }

    if (result.status === "not-in-favourites") {
      statusCategory = "not_in_favourites";
      throw new Error("Artwork not in favourites");
    }

    return (
      <>
        <ArtworkView {...result.artwork} />
      </>
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.account.favourite_artwork.failed", {
      statusCategory,
      hasArtworkId: Boolean(artworkId),
      error: getErrorForLog(error),
    });
    return <div>Error fetching artwork</div>;
  }
};

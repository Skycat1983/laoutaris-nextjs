import { ArtworkView } from "@/components/views/ArtworkView";
import { getOwnFavouriteArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export const FavouritedArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await getOwnFavouriteArtwork(userId, artworkId);

    if (result.status === "artwork-not-found") {
      throw new Error("Artwork not found");
    }

    if (result.status === "not-in-favourites") {
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
    console.error("Error fetching artwork:", error);
    return <div>Error fetching artwork</div>;
  }
};

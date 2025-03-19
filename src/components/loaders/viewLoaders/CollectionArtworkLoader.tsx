import { ArtworkView } from "@/components/views";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { CollectionFrontendPopulated } from "@/lib/data/types/collectionTypes";
import { isNextError } from "@/lib/helpers/isNextError";

export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  try {
    const result =
      await serverApi.public.collection.singleCollectionSingleArtwork(
        slug,
        artworkId
      );

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch collection artwork");
    }

    const { data: collection } =
      result as ApiSuccessResponse<CollectionFrontendPopulated>;

    const { artworks } = collection;

    return (
      <>
        <ArtworkView {...artworks[0]} />
      </>
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Collection artwork loading failed:", error);
    return null;
  }
}

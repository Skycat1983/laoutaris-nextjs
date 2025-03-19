import { ArtworkView } from "@/components/views";
import { delay } from "@/lib/utils/debug";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { CollectionFrontendPopulated } from "@/lib/data/types/collectionTypes";

export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  // await delay(1000);
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
}

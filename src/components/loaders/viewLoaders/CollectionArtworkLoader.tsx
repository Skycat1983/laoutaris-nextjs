import { ArtworkView } from "@/components/views";
import { PublicArtwork } from "../../../../unused/artworkToPublic";
import { delay } from "@/lib/utils/debug";
import { serverApi } from "@/lib/api/serverApi";
import { ApiResponse, ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { CollectionFrontendPopulated } from "@/lib/data/types/collectionTypes";
export async function CollectionArtworkLoader({
  slug,
  artworkId,
}: {
  slug: string;
  artworkId: string;
}) {
  await delay(1000);
  const result = await serverApi.public.collection.singlePopulated(
    slug,
    artworkId
  );

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collection artwork");
  }

  // const publicArtwork: PublicArtwork = artworkToPublic(result.data.artworks[0]);

  const { data: collection } =
    result as ApiSuccessResponse<CollectionFrontendPopulated>;

  const { artworks } = collection;

  return (
    <>
      <ArtworkView {...artworks[0]} />
    </>
  );
}

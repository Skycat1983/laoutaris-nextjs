import { ArtworkView } from "@/components/views";
import { PublicArtwork } from "../../../../unused/artworkToPublic";
import { delay } from "@/lib/utils/debug";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse } from "@/lib/data/types";

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

  const { data: artwork } = result as ApiSuccessResponse<PublicArtwork>;

  return (
    <>
      <ArtworkView {...artwork} />
    </>
  );
}

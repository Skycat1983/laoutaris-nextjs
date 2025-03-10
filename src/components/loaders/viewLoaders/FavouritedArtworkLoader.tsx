import { ArtworkView } from "@/components/views/ArtworkView";
import { clientApi } from "@/lib/api/clientApi";
import { serverApi } from "@/lib/api/serverApi";
import { PublicArtwork } from "../../../../unused/artworkToPublic";
import { ApiSuccessResponse } from "@/lib/data/types";
import { ApiResponse } from "@/lib/data/types";

export const FavouritedArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  const result: ApiResponse<PublicArtwork> =
    await serverApi.user.favourites.getFavouriteArtwork(artworkId);
  if (!result.success) {
    throw new Error(result.error);
  }
  const { data } = result as ApiSuccessResponse<PublicArtwork>;

  return (
    <>
      <ArtworkView {...data} />
    </>
  );
};

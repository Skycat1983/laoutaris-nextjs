import { ArtworkView } from "@/components/views/ArtworkView";
import { serverApi } from "@/lib/api/serverApi";
import { ApiSuccessResponse, ArtworkFrontend } from "@/lib/data/types";
import { ApiResponse } from "@/lib/data/types";

export const FavouritedArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  const result: ApiResponse<ArtworkFrontend> =
    await serverApi.user.favourites.getOne(artworkId);
  if (!result.success) {
    throw new Error(result.error);
  }
  const { data } = result as ApiSuccessResponse<ArtworkFrontend>;

  return (
    <>
      <ArtworkView {...data} />
    </>
  );
};

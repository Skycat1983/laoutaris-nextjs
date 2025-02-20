import ArtworkView from "@/components/views/ArtworkView";
import { fetchUserFavouriteArtwork } from "../../../../phase_out/userApi";
import { PublicArtwork } from "@/lib/transforms/artworkToPublic";

export const FavouritedArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  const result: ApiResponse<PublicArtwork> = await fetchUserFavouriteArtwork(
    artworkId
  );
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

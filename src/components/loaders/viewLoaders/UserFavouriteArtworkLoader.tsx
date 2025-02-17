import { fetchUserFavouriteArtwork } from "@/lib/api/public/userApi";

export const UserFavouriteArtworkLoader = async ({
  artworkId,
}: {
  artworkId: string;
}) => {
  // const artwork = await fetchUserFavouriteArtwork(artworkId);

  // console.log("artwork", artwork);
  return <div>UserFavouritesLoader</div>;
};

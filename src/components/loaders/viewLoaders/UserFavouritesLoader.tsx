import { fetchUserFavourites } from "@/lib/api/public/userApi";

export const UserFavouritesLoader = async () => {
  const favourites = await fetchUserFavourites();
  if (!favourites.success) {
    throw new Error(favourites.error);
  }
  return <div>UserFavouritesLoader</div>;
};

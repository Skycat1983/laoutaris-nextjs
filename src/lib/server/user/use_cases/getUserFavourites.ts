import { fetchUserFavourites } from "../data-fetching/fetchUserFavourites";
import { getUserIdFromSession } from "../session/getUserIdFromSession";

export const getUserFavourites = async () => {
  const user_id = await getUserIdFromSession();
  //   const fetcher = fetchUserWatchlists;
  const identifierKey = "_id";
  const identifierValue = user_id as string;
  const userFields = ["watchlist"];

  return await fetchUserFavourites(identifierKey, identifierValue, userFields);
};

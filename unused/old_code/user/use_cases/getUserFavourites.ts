import { fetchUserFavourites } from "../data-fetching/fetchUserFavourites";
import { getUserIdFromSession } from "../../../../src/lib/session/getUserIdFromSession";

export const getUserFavourites = async () => {
  const user_id = await getUserIdFromSession();
  const identifierKey = "_id";
  const identifierValue = user_id as string;
  const userFields = ["watchlist"];

  return await fetchUserFavourites(identifierKey, identifierValue, userFields);
};

import { fetchUserFavourites } from "../data-fetching/fetchUserFavourites";
import {
  UserFavouriteToPaginationBridge,
  userFavouriteToPaginationLink,
} from "../resolvers/userFavouriteToPaginationLink";
import { getUserIdFromSession } from "../../../../src/lib/session/getUserIdFromSession";
export const getUserFavouritesPaginationData = async () => {
  const user_id = await getUserIdFromSession();
  if (!user_id) {
    throw new Error("User ID not found in session");
  }

  const identifierKey = "_id";
  const identifierValue = user_id;
  const userFields = ["favourites"];
  const artworkFields = ["image", "_id"];

  const result = await fetchUserFavourites<UserFavouriteToPaginationBridge>(
    identifierKey,
    identifierValue,
    userFields,
    artworkFields
  );

  if (!result.success) {
    throw new Error("User not found");
  }

  const { favourites } = result.data;

  if (!favourites || favourites.length === 0) {
    throw new Error("User has no favourite artworks.");
  }

  return userFavouriteToPaginationLink({ favourites });
};

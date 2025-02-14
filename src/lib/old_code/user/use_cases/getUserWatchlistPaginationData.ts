import { fetchUserWatchlists } from "../data-fetching/fetchUserWatchlists";
import {
  UserWatchlistToPaginationBridge,
  userWatchlistToPaginationLink,
} from "../resolvers/userWatchlistToPaginationLink";
import { getUserIdFromSession } from "../session/getUserIdFromSession";

export const getUserWatchlistPaginationData = async () => {
  const user_id = await getUserIdFromSession();
  if (!user_id) {
    throw new Error("User ID not found in session");
  }

  const identifierKey = "_id";
  const identifierValue = user_id;
  const userFields = ["watchlist"];
  const artworkFields = ["image", "_id"];

  const result = await fetchUserWatchlists<UserWatchlistToPaginationBridge>(
    identifierKey,
    identifierValue,
    userFields,
    artworkFields
  );

  if (!result.success) {
    throw new Error("User not found");
  }

  const { watchlist } = result.data;

  if (!watchlist || watchlist.length === 0) {
    throw new Error("User has no watchlist artworks.");
  }

  return userWatchlistToPaginationLink({ watchlist });
};

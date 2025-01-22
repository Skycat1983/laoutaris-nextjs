import { fetchUser } from "../data-fetching/fetchUser";
import {
  FrontendUserWatchlist,
  userWatchlistToDefaultRedirect,
} from "../resolvers/userWatchlistToDefaultRedirect";
import { getUserIdFromSession } from "../session/getUserIdFromSession";

export const getUserWatchlistArtworkDefaultPath = async () => {
  const userId = await getUserIdFromSession();
  if (!userId) {
    throw new Error("Failed to get required userID from session");
  }

  const identifierKey = "_id";
  const identifierValue = userId;
  const fields = ["watchlist"];

  const result = await fetchUser(identifierKey, identifierValue, fields);
  if (!result.success) {
    throw new Error("Failed to fetch user watchlist");
  }

  const userWatchlist = result.data as FrontendUserWatchlist;
  return userWatchlistToDefaultRedirect(userWatchlist);
};

// const resolver = userWatchlistToDefaultRedirect;

// const fetcher = fetchUser;

// const result = fetchAndResolveObj<
//   FrontendUserWatchlist,
//   DefaultUserWatchlistRedirectPath
// >(fetcher, identifierKey, identifierValue, fields, resolver);

// return await result();

import { fetchUserWatchlists } from "../data-fetching/fetchUserWatchlists";
import { getUserIdFromSession } from "../session/getUserIdFromSession";

export const getUserWatchlists = async () => {
  const user_id = await getUserIdFromSession();
  //   const fetcher = fetchUserWatchlists;
  const identifierKey = "_id";
  const identifierValue = user_id as string;
  const userFields = ["watchlist"];
  const artworkFields = ["title", "artist", "image"];

  return await fetchUserWatchlists(identifierKey, identifierValue, userFields);

  //   return fetchAndResolveObj(fetcher, identifierKey, identifierValue, userFields);
  //   const resolver =
};

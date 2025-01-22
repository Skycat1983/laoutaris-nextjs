import { PotentialUrl } from "@/lib/types/commonTypes";
import { fetchUser } from "../data-fetching/fetchUser";
import {
  FrontendUserWatchlist,
  userWatchlistToDefaultRedirect,
} from "../resolvers/userWatchlistToDefaultRedirect";
import { getUserIdFromSession } from "../session/getUserIdFromSession";

// TODO: this + getUserFavouriteArtworkDefaultPath can be refectored to single func

export const getUserWatchlistArtworkDefaultPath =
  async (): Promise<PotentialUrl> => {
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

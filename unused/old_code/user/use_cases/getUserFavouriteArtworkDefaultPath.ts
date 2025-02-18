import { fetchUser } from "../data-fetching/fetchUser";
import { getUserIdFromSession } from "../../../../src/lib/session/getUserIdFromSession";
import {
  FrontendUserFavourite,
  userFavouritesToDefaultRedirect,
} from "../resolvers/userFavouritesToDefaultRedirect";
import { PotentialUrl } from "@/lib/data/types/commonTypes";

// TODO: this + getUserWatchlistArtworkDefaultPath can be refectored to single func

export const getUserFavouriteArtworkDefaultPath =
  async (): Promise<PotentialUrl> => {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Failed to get required userID from session");
    }
    const identifierKey = "_id";
    const identifierValue = userId;
    const fields = ["favourites"];

    const result = await fetchUser(identifierKey, identifierValue, fields);

    if (!result.success) {
      throw new Error("Failed to fetch user favourites");
    }

    const userFavourite = result.data as FrontendUserFavourite;

    return userFavouritesToDefaultRedirect(userFavourite);
  };

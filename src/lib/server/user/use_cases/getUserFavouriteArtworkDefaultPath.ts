import { fetchUser } from "../data-fetching/fetchUser";
import { fetchAndResolveObj } from "@/utils/fetchAndResolveObj";
import { getUserIdFromSession } from "../session/getUserIdFromSession";
import {
  FrontendUserFavourite,
  userFavouritesToDefaultRedirect,
} from "../resolvers/userFavouritesToDefaultRedirect";
import { PotentialUrl } from "@/lib/types/commonTypes";

export const getUserFavouriteArtworkDefaultPath = async () => {
  const userId = await getUserIdFromSession();
  if (!userId) {
    throw new Error("Failed to get required userID from session");
  }

  const fetcher = fetchUser;
  const identifierKey = "_id";
  const identifierValue = userId;
  const fields = ["favourites"];
  const resolver = userFavouritesToDefaultRedirect;

  const result = fetchAndResolveObj<FrontendUserFavourite, PotentialUrl>(
    fetcher,
    identifierKey,
    identifierValue,
    fields,
    resolver
  );

  return await result();
};

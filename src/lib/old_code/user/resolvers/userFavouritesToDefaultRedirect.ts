import { PotentialUrl } from "@/lib/data/types/commonTypes";
import { FrontendUserUnpopulated } from "@/lib/data/types/userTypes";
import { buildUrl } from "@/lib/utils/buildUrl";

export type FrontendUserFavourite = Pick<FrontendUserUnpopulated, "favourites">;

export const userFavouritesToDefaultRedirect = (
  user: FrontendUserFavourite
): PotentialUrl => {
  if (user.favourites.length === 0) {
    return null;
  }
  return buildUrl(["account", "favourites", user.favourites[0]]);
};

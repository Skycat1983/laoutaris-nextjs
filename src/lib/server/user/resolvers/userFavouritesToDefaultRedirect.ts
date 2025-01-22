import { PotentialUrl } from "@/lib/types/commonTypes";
import { FrontendUserUnpopulated } from "@/lib/types/userTypes";
import { buildUrl } from "@/utils/buildUrl";

export type FrontendUserFavourite = Pick<FrontendUserUnpopulated, "favourites">;

export const userFavouritesToDefaultRedirect = (
  user: FrontendUserFavourite
): PotentialUrl => {
  if (user.favourites.length === 0) {
    return null;
  }
  return buildUrl(["account", "favourites", user.favourites[0]]);
};

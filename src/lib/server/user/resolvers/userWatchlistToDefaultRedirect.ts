import { PotentialUrl } from "@/lib/types/commonTypes";
import { FrontendUserUnpopulated } from "@/lib/types/userTypes";
import { buildUrl } from "@/utils/buildUrl";

export type FrontendUserWatchlist = Pick<FrontendUserUnpopulated, "watchlist">;

export interface DefaultUserWatchlistRedirectPath {
  defaultPath: string;
}

export const userWatchlistToDefaultRedirect = (
  user: FrontendUserWatchlist
): PotentialUrl => {
  if (user.watchlist.length === 0) {
    return null;
  }
  return buildUrl(["account", "watchlist", user.watchlist[0]]);
};

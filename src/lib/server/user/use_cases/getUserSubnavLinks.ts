import { buildUserSubnavLinks } from "../resolvers/userDataToSubnavLinks";
import { getUserFavouriteArtworkDefaultPath } from "./getUserFavouriteArtworkDefaultPath";
import { getUserWatchlistArtworkDefaultPath } from "./getUserWatchlistArtworkDefaultPath";

export const getUserSubnavLinks = async () => {
  const favourite = getUserFavouriteArtworkDefaultPath();
  const watchlist = getUserWatchlistArtworkDefaultPath();
  const [defaultFavourite, defaultWatchlist] = await Promise.all([
    favourite,
    watchlist,
  ]);
  //! this object is added in the build function
  //   const dashboard = {
  //     title: "Dashboard",
  //     slug: "dashboard",
  //     link_to: "/account/dashboard",
  //   };

  return buildUserSubnavLinks(defaultFavourite, defaultWatchlist);
};

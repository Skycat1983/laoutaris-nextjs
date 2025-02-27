import { headers } from "next/headers";
import { createFetcher } from "../core/createFetcher";
import { createProfileFetchers } from "./profile/fetchers";
import { createWatchlistFetchers } from "./watchlist/fetchers";
import { createFavoritesFetchers } from "./favorites/fetchers";
import { createCommentsFetchers } from "./comments/fetchers";
import { createUserNavigationFetchers } from "./navigation/fetchers";

const serverUserFetcher = createFetcher({
  getUrl: (path) => {
    const baseUrl = process.env.BASEURL || "http://localhost:3000";
    return new URL(path, baseUrl).toString();
  },
  getHeaders: () => headers(),
});

export const serverUserApi = {
  profile: createProfileFetchers(serverUserFetcher),
  watchlist: createWatchlistFetchers(serverUserFetcher),
  favourites: createFavoritesFetchers(serverUserFetcher),
  comments: createCommentsFetchers(serverUserFetcher),
  navigation: createUserNavigationFetchers(serverUserFetcher),
};

"use client";
import { createFetcher } from "../core/createFetcher";
import { createProfileFetchers } from "./profile/fetchers";
import { createWatchlistFetchers } from "./watchlist/fetchers";
import { createFavoritesFetchers } from "./favorites/fetchers";
import { createCommentsFetchers } from "./comments/fetchers";
import { createUserNavigationFetchers } from "./navigation/fetchers";

const clientUserFetcher = createFetcher({
  getUrl: (path) => path,
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
});

export const clientUserApi = {
  profile: createProfileFetchers(clientUserFetcher),
  watchlist: createWatchlistFetchers(clientUserFetcher),
  favourites: createFavoritesFetchers(clientUserFetcher),
  comments: createCommentsFetchers(clientUserFetcher),
  navigation: createUserNavigationFetchers(clientUserFetcher),
};

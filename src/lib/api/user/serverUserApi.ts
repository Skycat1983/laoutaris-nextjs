import { headers } from "next/headers";
import { createFetcher } from "../core/createFetcher";
import { createProfileFetchers } from "./profile/fetchers";
import { createWatchlistFetchers } from "./watchlist/fetchers";
import { createFavoritesFetchers } from "./favorites/fetchers";
import { createCommentsFetchers } from "./comments/fetchers";
import { createUserNavigationFetchers } from "./navigation/fetchers";

const serverUserFetcher = createFetcher({
  getUrl: (path) => {
    const baseUrl =
      process.env.VERCEL_ENV === "production"
        ? `https://laoutaris-nextjs.vercel.app`
        : process.env.VERCEL_ENV === "preview"
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:3000`;

    try {
      const newUrl = new URL(path, baseUrl);
      return newUrl.toString();
    } catch (error) {
      console.error("6. URL Construction Error:", error);
      throw error;
    }
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

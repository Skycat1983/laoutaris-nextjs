import { headers } from "next/headers";
import { createFetcher } from "../core/createFetcher";
import { createProfileFetchers } from "./profile/fetchers";
import { createWatchlistFetchers } from "./watchlist/fetchers";
import { createFavoritesFetchers } from "./favorites/fetchers";
import { createCommentsFetchers } from "./comments/fetchers";
import { createUserNavigationFetchers } from "./navigation/fetchers";

const serverUserFetcher = createFetcher({
  // getUrl: (path) => {
  //   const baseUrl =
  //     process.env.NODE_ENV === "development"
  //       ? "http://localhost:3000"
  //       : `https://${process.env.VERCEL_URL}`;
  //   return new URL(path, baseUrl).toString();
  // },
  getUrl: (path) => {
    console.log("=== URL Construction Debug ===");
    console.log("1. Incoming path:", path);
    console.log("2. NODE_ENV:", process.env.NODE_ENV);
    console.log("3. VERCEL_URL:", process.env.VERCEL_URL);
    console.log("4. VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("NEXT_PUBLIC_VERCEL_ENV:", process.env.NEXT_PUBLIC_VERCEL_ENV);
    console.log("NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);

    const baseUrl =
      process.env.VERCEL_ENV === "production"
        ? `https://laoutaris-nextjs.vercel.app`
        : process.env.VERCEL_ENV === "preview"
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:3000`;

    console.log("4. Constructed baseUrl:", baseUrl);

    try {
      const newUrl = new URL(path, baseUrl);
      console.log("5. Final URL:", newUrl.toString());
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

// const serverUserFetcher = createFetcher({
//   getUrl: (path) => {
//     const baseUrl = process.env.BASEURL || "http://localhost:3000";
//     return new URL(path, baseUrl).toString();
//   },
//   getHeaders: () => {
//     // Explicitly handle dynamic header usage
//     try {
//       return headers();
//     } catch (error) {
//       if (isNextError(error)) {
//         throw error;
//       }
//       return {};
//     }
//   },
// });

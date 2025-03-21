import { headers } from "next/headers";
import { createFetcher } from "@/lib/api/core/createFetcher";
import { createArticleFetchers } from "@/lib/api/public/article/fetchers";
import { createCollectionFetchers } from "@/lib/api/public/collection/fetchers";
import { createNavigationFetchers } from "@/lib/api/public/navigation/fetchers";
import { createBlogFetchers } from "@/lib/api/public/blog/fetchers";
import { createArtworkFetchers } from "./artwork/fetchers";
import { createSearchFetchers } from "./search/fetchers";
import { createEnquiryFetchers } from "./enquiry/fetchers";

const serverFetcher = createFetcher({
  // getUrl: (path) => {
  //   console.log("Original path:", path);

  //   const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  //   console.log("Normalized path:", normalizedPath);

  //   return normalizedPath; // Just return the path for server-side requests
  // },
  getUrl: (path) => {
    console.log("=== URL Construction Debug ===");
    console.log("1. Incoming path:", path);
    console.log("2. NODE_ENV:", process.env.NODE_ENV);
    console.log("3. VERCEL_URL:", process.env.VERCEL_URL);
    console.log("NEXT_PUBLIC_VERCEL_ENV:", process.env.NEXT_PUBLIC_VERCEL_ENV);
    console.log("NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);

    // changed to use NEXT_PUBLIC_VERCEL_URL instead of VERCEL_URL
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

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

export const serverPublicApi = {
  article: createArticleFetchers(serverFetcher),
  blog: createBlogFetchers(serverFetcher),
  collection: createCollectionFetchers(serverFetcher),
  navigation: createNavigationFetchers(serverFetcher),
  artwork: createArtworkFetchers(serverFetcher),
  search: createSearchFetchers(serverFetcher),
  enquiry: createEnquiryFetchers(serverFetcher),
};

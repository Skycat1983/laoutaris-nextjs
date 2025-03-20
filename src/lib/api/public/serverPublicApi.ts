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
  getUrl: (path) => {
    console.log("Incoming path:", path);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${process.env.VERCEL_URL}`;

    console.log("Base URL:", baseUrl);
    const newUrl = new URL(path, baseUrl);
    console.log("newUrl", newUrl);
    console.log("Final URL:", newUrl.toString());
    return newUrl.toString();
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

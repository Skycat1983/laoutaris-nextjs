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
    const baseUrl = process.env.BASEURL || "http://localhost:3000";
    return new URL(path, baseUrl).toString();
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

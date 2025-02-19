"use client";
import { createFetcher } from "@/lib/api/core/createFetcher";
import { createArticleFetchers } from "@/lib/api/public/article/fetchers";
import { createBlogFetchers } from "@/lib/api/public/blog/fetchers";
import { createCollectionFetchers } from "@/lib/api/public/collection/fetchers";
import { createNavigationFetchers } from "@/lib/api/public/navigation/fetchers";

const clientFetcher = createFetcher({
  getUrl: (path) => path,
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
});

export const clientApi = {
  article: createArticleFetchers(clientFetcher),
  blog: createBlogFetchers(clientFetcher),
  collection: createCollectionFetchers(clientFetcher),
  navigation: createNavigationFetchers(clientFetcher),
};

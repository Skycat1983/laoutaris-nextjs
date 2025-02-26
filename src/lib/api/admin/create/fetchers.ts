import type { FrontendArticle } from "@/lib/data/types/articleTypes";
import type { FrontendCollection } from "@/lib/data/types/collectionTypes";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { Fetcher } from "../../core/createFetcher";
import {
  CreateArticleFormValues,
  CreateArtworkFormValues,
  CreateBlogFormValues,
} from "@/lib/data/schemas";
import { CreateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";

export const createPostFetchers = (fetcher: Fetcher) => ({
  // Post new article
  article: async (data: CreateArticleFormValues) =>
    fetcher<FrontendArticle>("/api/v2/admin/article/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new collection
  collection: async (data: CreateCollectionFormValues) =>
    fetcher<FrontendCollection>("/api/v2/admin/collection/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new artwork
  artwork: async (data: CreateArtworkFormValues) =>
    fetcher<FrontendArtwork>("/api/v2/admin/artwork/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new blog
  blog: async (data: CreateBlogFormValues) =>
    fetcher<FrontendBlogEntry>("/api/v2/admin/blog/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
});

export type PostFetchers = ReturnType<typeof createPostFetchers>;

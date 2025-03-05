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
import { SingleResult } from "@/lib/data/types/apiTypes";

export type CreateArticleResult = SingleResult<FrontendArticle>;
export type CreateCollectionResult = SingleResult<FrontendCollection>;
export type CreateArtworkResult = SingleResult<FrontendArtwork>;
export type CreateBlogResult = SingleResult<FrontendBlogEntry>;

export const createPostFetchers = (fetcher: Fetcher) => ({
  // Post new article
  article: async (data: CreateArticleFormValues) =>
    fetcher<CreateArticleResult>("/api/v2/admin/article/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new collection
  collection: async (data: CreateCollectionFormValues) =>
    fetcher<CreateCollectionResult>("/api/v2/admin/collection/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new artwork
  artwork: async (data: CreateArtworkFormValues) =>
    fetcher<CreateArtworkResult>("/api/v2/admin/artwork/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new blog
  blog: async (data: CreateBlogFormValues) =>
    fetcher<CreateBlogResult>("/api/v2/admin/blog/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
});

export type PostFetchers = ReturnType<typeof createPostFetchers>;

import { Fetcher } from "../../core/createFetcher";
import {
  CreateArticleFormValues,
  CreateArtworkFormValues,
  CreateBlogFormValues,
} from "@/lib/data/schemas";
import { CreateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";
import { SingleResult } from "@/lib/data/types/apiTypes";
import {
  AdminArticle,
  AdminCollection,
  AdminArtwork,
  AdminBlog,
} from "@/lib/data/types/adminTypes";
export type CreateArticleResult = SingleResult<AdminArticle>;
export type CreateCollectionResult = SingleResult<AdminCollection>;
export type CreateArtworkResult = SingleResult<AdminArtwork>;
export type CreateBlogResult = SingleResult<AdminBlog>;

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

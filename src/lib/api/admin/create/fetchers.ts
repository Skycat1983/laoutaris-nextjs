import type { Fetcher } from "../../core/createFetcher";
import {
  CreateArticleFormValues,
  CreateArtworkFormValues,
  CreateBlogFormValues,
} from "@/lib/data/schemas";
import { CreateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";
import type { SingleResult } from "@/lib/data/types/apiTypes";
import type {
  AdminArticle,
  AdminCollection,
  AdminArtwork,
  AdminBlog,
} from "@/lib/data/types/adminTypes";
import { adminCreatePath } from "./paths";
export type CreateArticleResult = SingleResult<AdminArticle>;
export type CreateCollectionResult = SingleResult<AdminCollection>;
export type CreateArtworkResult = SingleResult<AdminArtwork>;
export type CreateBlogResult = SingleResult<AdminBlog>;

export const createPostFetchers = (fetcher: Fetcher) => ({
  // Post new article
  article: async (data: CreateArticleFormValues) =>
    fetcher<CreateArticleResult>(adminCreatePath("article"), {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new collection
  collection: async (data: CreateCollectionFormValues) =>
    fetcher<CreateCollectionResult>(adminCreatePath("collection"), {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new artwork
  artwork: async (data: CreateArtworkFormValues) =>
    fetcher<CreateArtworkResult>(adminCreatePath("artwork"), {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new blog
  blog: async (data: CreateBlogFormValues) =>
    fetcher<CreateBlogResult>(adminCreatePath("blog"), {
      method: "POST",
      body: JSON.stringify(data),
    }),
});

export type PostFetchers = ReturnType<typeof createPostFetchers>;

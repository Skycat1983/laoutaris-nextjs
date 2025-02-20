import type {
  CreateArticleFormValues,
  FrontendArticle,
} from "@/lib/data/types/articleTypes";
import type {
  CreateCollectionFormValues,
  FrontendCollection,
} from "@/lib/data/types/collectionTypes";
import type {
  CreateArtworkFormValues,
  FrontendArtwork,
} from "@/lib/data/types/artworkTypes";
import type {
  CreateBlogFormValues,
  FrontendBlogEntry,
} from "@/lib/data/types/blogTypes";
import { Fetcher } from "../../core/createFetcher";

export const createPostFetchers = (fetcher: Fetcher) => ({
  // Post new article
  postArticle: async (data: CreateArticleFormValues) =>
    fetcher<FrontendArticle>("/api/v2/admin/article/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new collection
  postCollection: async (data: CreateCollectionFormValues) =>
    fetcher<FrontendCollection>("/api/v2/admin/collection/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new artwork
  postArtwork: async (data: CreateArtworkFormValues) =>
    fetcher<FrontendArtwork>("/api/v2/admin/artwork/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Post new blog
  postBlog: async (data: CreateBlogFormValues) =>
    fetcher<FrontendBlogEntry>("/api/v2/admin/blog/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
});

export type PostFetchers = ReturnType<typeof createPostFetchers>;

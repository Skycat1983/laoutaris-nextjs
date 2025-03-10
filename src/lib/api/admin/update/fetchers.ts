import type { Fetcher } from "../../core/createFetcher";
import {
  UpdateArticleFormValues,
  UpdateArtworkFormValues,
  UpdateBlogFormValues,
} from "@/lib/data/schemas";
import { UpdateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";
import {
  AdminArticle,
  AdminCollection,
  AdminArtwork,
  AdminBlog,
} from "@/lib/data/types/adminTypes";
import { SingleResult } from "@/lib/data/types/apiTypes";

export type UpdateArticleResult = SingleResult<AdminArticle>;
export type UpdateCollectionResult = SingleResult<AdminCollection>;
export type UpdateArtworkResult = SingleResult<AdminArtwork>;
export type UpdateBlogResult = SingleResult<AdminBlog>;

export const createUpdateFetchers = (fetcher: Fetcher) => ({
  // Patch article
  patchArticle: async (articleId: string, data: UpdateArticleFormValues) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<UpdateArticleResult>(
      `/api/v2/admin/article/update/${encodedId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch collection
  patchCollection: async (
    collectionId: string,
    data: UpdateCollectionFormValues
  ) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<UpdateCollectionResult>(
      `/api/v2/admin/collection/update/${encodedId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch artwork
  patchArtwork: async (artworkId: string, data: UpdateArtworkFormValues) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<UpdateArtworkResult>(
      `/api/v2/admin/artwork/update/${encodedId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Patch blog
  patchBlog: async (blogId: string, data: UpdateBlogFormValues) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<UpdateBlogResult>(`/api/v2/admin/blog/update/${encodedId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
});

export type UpdateFetchers = ReturnType<typeof createUpdateFetchers>;

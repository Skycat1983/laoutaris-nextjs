import type { Fetcher } from "../../core/createFetcher";
import {
  UpdateArticleFormValues,
  UpdateArtworkFormValues,
  UpdateBlogFormValues,
} from "@/lib/data/schemas";
import { UpdateCollectionFormValues } from "@/lib/data/schemas/collectionSchema";

interface UpdateResponse {
  success: boolean;
  message: string;
}

export const createUpdateFetchers = (fetcher: Fetcher) => ({
  // Patch article
  patchArticle: async (articleId: string, data: UpdateArticleFormValues) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<UpdateResponse>(
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
    return fetcher<UpdateResponse>(
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
    return fetcher<UpdateResponse>(
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
    return fetcher<UpdateResponse>(`/api/v2/admin/blog/update/${encodedId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
});

export type UpdateFetchers = ReturnType<typeof createUpdateFetchers>;

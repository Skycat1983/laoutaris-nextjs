import type { Fetcher } from "../../core/createFetcher";

// Response types
interface DeleteArtworkResponse {
  success: boolean;
  message: string;
  articleId?: string; // for the conflict case
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const createDeleteFetchers = (fetcher: Fetcher) => ({
  // Delete artwork
  deleteArtwork: async (artworkId: string) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<DeleteArtworkResponse>(
      `/api/v2/admin/artwork/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Delete article
  deleteArticle: async (articleId: string) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<DeleteResponse>(
      `/api/v2/admin/article/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Delete blog
  deleteBlog: async (blogId: string) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<DeleteResponse>(`/api/v2/admin/blog/delete/${encodedId}`, {
      method: "DELETE",
    });
  },

  // Delete collection
  deleteCollection: async (collectionId: string) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<DeleteResponse>(
      `/api/v2/admin/collection/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type DeleteFetchers = ReturnType<typeof createDeleteFetchers>;

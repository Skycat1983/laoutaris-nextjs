import type { Fetcher } from "../../core/createFetcher";

// ArticleId is returned to identify the conflict case
export interface DeleteArtworkResponse extends ApiSuccessResponse<null> {
  articleId?: string; //? because deleteing an artwork can cause problems if it's referenced in an article
}

// 'null' because we don't expect any data (T) to be returned from the delete operation
export type DeleteResponse = ApiResponse<null>;

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

import type { Fetcher } from "../../core/createFetcher";

// ArticleId is returned to identify the conflict case
export interface DeleteArtworkResponse extends ApiSuccessResponse<null> {
  articleId?: string; //? because deleteing an artwork can cause problems if it's referenced in an article
}

// 'null' because we don't expect any data (T) to be returned from the delete operation
export type DeleteResponse = ApiResponse<null>;

export const createDeleteFetchers = (fetcher: Fetcher) => ({
  // Delete artwork
  artwork: async (artworkId: string) => {
    const encodedId = encodeURIComponent(artworkId);
    return fetcher<DeleteArtworkResponse>(
      `/api/v2/admin/artwork/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Delete article
  article: async (articleId: string) => {
    const encodedId = encodeURIComponent(articleId);
    return fetcher<DeleteResponse>(
      `/api/v2/admin/article/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Delete blog
  blog: async (blogId: string) => {
    const encodedId = encodeURIComponent(blogId);
    return fetcher<DeleteResponse>(`/api/v2/admin/blog/delete/${encodedId}`, {
      method: "DELETE",
    });
  },

  // Delete collection
  collection: async (collectionId: string) => {
    const encodedId = encodeURIComponent(collectionId);
    return fetcher<DeleteResponse>(
      `/api/v2/admin/collection/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  //! not implemented yet
  // Delete user
  user: async (userId: string) => {
    const encodedId = encodeURIComponent(userId);
    return fetcher<DeleteResponse>(`/api/v2/admin/user/delete/${encodedId}`, {
      method: "DELETE",
    });
  },

  //! not implemented yet
  // Delete comment
  comment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<DeleteResponse>(
      `/api/v2/admin/comment/delete/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type DeleteFetchers = ReturnType<typeof createDeleteFetchers>;

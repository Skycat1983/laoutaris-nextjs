import type { ApiSuccessResponse } from "@/lib/data/types";
import type { Fetcher } from "../../core/createFetcher";
import type { AdminDeletePreview } from "./previewTypes";

// This is what the fetcher expects
export type DeleteDocumentResult = ApiSuccessResponse<null>;
export type DeletePreviewResult = ApiSuccessResponse<AdminDeletePreview>;

const deletePath = (resource: string, id: string) =>
  `/api/v2/admin/${resource}/delete/${encodeURIComponent(id)}`;

const deletePreviewPath = (resource: string, id: string) =>
  `${deletePath(resource, id)}/preview`;

export const createDeleteFetchers = (fetcher: Fetcher) => ({
  // Delete artwork
  artwork: async (artworkId: string) => {
    return fetcher<DeleteDocumentResult>(deletePath("artwork", artworkId), {
      method: "DELETE",
    });
  },

  // Delete article
  article: async (articleId: string) => {
    return fetcher<DeleteDocumentResult>(deletePath("article", articleId), {
      method: "DELETE",
    });
  },

  // Delete blog
  blog: async (blogId: string) => {
    return fetcher<DeleteDocumentResult>(deletePath("blog", blogId), {
      method: "DELETE",
    });
  },

  // Delete collection
  collection: async (collectionId: string) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("collection", collectionId),
      {
        method: "DELETE",
      }
    );
  },

  // Delete user
  user: async (userId: string) => {
    return fetcher<DeleteDocumentResult>(deletePath("user", userId), {
      method: "DELETE",
    });
  },

  // Delete comment
  comment: async (commentId: string) => {
    return fetcher<DeleteDocumentResult>(deletePath("comment", commentId), {
      method: "DELETE",
    });
  },

  preview: {
    article: async (articleId: string) =>
      fetcher<DeletePreviewResult>(deletePreviewPath("article", articleId)),
    artwork: async (artworkId: string) =>
      fetcher<DeletePreviewResult>(deletePreviewPath("artwork", artworkId)),
    blog: async (blogId: string) =>
      fetcher<DeletePreviewResult>(deletePreviewPath("blog", blogId)),
    collection: async (collectionId: string) =>
      fetcher<DeletePreviewResult>(
        deletePreviewPath("collection", collectionId)
      ),
    comment: async (commentId: string) =>
      fetcher<DeletePreviewResult>(deletePreviewPath("comment", commentId)),
    user: async (userId: string) =>
      fetcher<DeletePreviewResult>(deletePreviewPath("user", userId)),
  },
});

export type DeleteFetchers = ReturnType<typeof createDeleteFetchers>;

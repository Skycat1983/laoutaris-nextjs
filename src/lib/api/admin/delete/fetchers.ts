import type { ApiSuccessResponse } from "@/lib/data/types";
import type { Fetcher } from "../../core/createFetcher";
import type { AdminDeletePreview } from "./previewTypes";
import type { AdminDeleteEvidence } from "./evidenceTypes";

// This is what the fetcher expects
export type DeleteDocumentResult = ApiSuccessResponse<null>;
export type DeletePreviewResult = ApiSuccessResponse<AdminDeletePreview>;

const deletePath = (resource: string, id: string) =>
  `/api/v2/admin/${resource}/delete/${encodeURIComponent(id)}`;

const deletePreviewPath = (resource: string, id: string) =>
  `${deletePath(resource, id)}/preview`;

const deleteOptions = (evidence: AdminDeleteEvidence): RequestInit => ({
  method: "DELETE",
  body: JSON.stringify(evidence),
});

export const createDeleteFetchers = (fetcher: Fetcher) => ({
  // Delete artwork
  artwork: async (artworkId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("artwork", artworkId),
      deleteOptions(evidence)
    );
  },

  // Delete article
  article: async (articleId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("article", articleId),
      deleteOptions(evidence)
    );
  },

  // Delete blog
  blog: async (blogId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("blog", blogId),
      deleteOptions(evidence)
    );
  },

  // Delete collection
  collection: async (collectionId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("collection", collectionId),
      deleteOptions(evidence)
    );
  },

  // Delete user
  user: async (userId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("user", userId),
      deleteOptions(evidence)
    );
  },

  // Delete comment
  comment: async (commentId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      deletePath("comment", commentId),
      deleteOptions(evidence)
    );
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

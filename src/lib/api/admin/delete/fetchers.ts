import type { ApiSuccessResponse } from "@/lib/data/types";
import type { Fetcher } from "../../core/createFetcher";
import type { AdminDeletePreview } from "./previewTypes";
import type { AdminDeleteEvidence } from "./evidenceTypes";
import { adminDeletePath, adminDeletePreviewPath } from "./paths";

// This is what the fetcher expects
export type DeleteDocumentResult = ApiSuccessResponse<null>;
export type DeletePreviewResult = ApiSuccessResponse<AdminDeletePreview>;

const deleteOptions = (evidence: AdminDeleteEvidence): RequestInit => ({
  method: "DELETE",
  body: JSON.stringify(evidence),
});

export const createDeleteFetchers = (fetcher: Fetcher) => ({
  // Delete artwork
  artwork: async (artworkId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("artwork", artworkId),
      deleteOptions(evidence)
    );
  },

  // Delete article
  article: async (articleId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("article", articleId),
      deleteOptions(evidence)
    );
  },

  // Delete blog
  blog: async (blogId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("blog", blogId),
      deleteOptions(evidence)
    );
  },

  // Delete collection
  collection: async (collectionId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("collection", collectionId),
      deleteOptions(evidence)
    );
  },

  // Delete user
  user: async (userId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("user", userId),
      deleteOptions(evidence)
    );
  },

  // Delete comment
  comment: async (commentId: string, evidence: AdminDeleteEvidence) => {
    return fetcher<DeleteDocumentResult>(
      adminDeletePath("comment", commentId),
      deleteOptions(evidence)
    );
  },

  preview: {
    article: async (articleId: string) =>
      fetcher<DeletePreviewResult>(
        adminDeletePreviewPath("article", articleId)
      ),
    artwork: async (artworkId: string) =>
      fetcher<DeletePreviewResult>(
        adminDeletePreviewPath("artwork", artworkId)
      ),
    blog: async (blogId: string) =>
      fetcher<DeletePreviewResult>(adminDeletePreviewPath("blog", blogId)),
    collection: async (collectionId: string) =>
      fetcher<DeletePreviewResult>(
        adminDeletePreviewPath("collection", collectionId)
      ),
    comment: async (commentId: string) =>
      fetcher<DeletePreviewResult>(
        adminDeletePreviewPath("comment", commentId)
      ),
    user: async (userId: string) =>
      fetcher<DeletePreviewResult>(adminDeletePreviewPath("user", userId)),
  },
});

export type DeleteFetchers = ReturnType<typeof createDeleteFetchers>;

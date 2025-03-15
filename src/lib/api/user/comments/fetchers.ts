import type { CreateCommentFormValues } from "@/lib/data/schemas/commentSchema";
import type { Fetcher } from "../../core/createFetcher";
import { ListResult, SingleResult } from "@/lib/data/types";
import { CommentFrontendPopulated } from "@/lib/data/types";

export type ApiUserCommentsGetResult = ListResult<CommentFrontendPopulated>;
export type ApiUserCommentCreateResult = SingleResult<CommentFrontendPopulated>;
export type ApiUserCommentUpdateResult = SingleResult<CommentFrontendPopulated>;
export type ApiUserCommentDeleteResult = SingleResult<{
  success: true;
  message: string;
}>;

export const createCommentsFetchers = (fetcher: Fetcher) => ({
  // Get user comments
  getUserComments: async () =>
    fetcher<ApiUserCommentsGetResult>(`/api/v2/user/comment`),

  // Create comment
  createComment: async (comment: CreateCommentFormValues) => {
    return fetcher<ApiUserCommentCreateResult>(`/api/v2/user/comment`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },

  // Update comment
  updateComment: async (commentId: string, text: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<ApiUserCommentUpdateResult>(
      `/api/v2/user/comment/${encodedId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ text }),
      }
    );
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<ApiUserCommentDeleteResult>(
      `/api/v2/user/comment/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type CommentsFetchers = ReturnType<typeof createCommentsFetchers>;

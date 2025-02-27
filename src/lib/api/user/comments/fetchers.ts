import type { FrontendComment } from "@/lib/data/types/commentTypes";
import type { FrontendUserWithComments } from "@/lib/data/types/userTypes";
import type { CreateCommentFormValues } from "@/lib/data/schemas/commentSchema";
import type { Fetcher } from "../../core/createFetcher";

export const createCommentsFetchers = (fetcher: Fetcher) => ({
  // Get user comments
  getUserComments: async () =>
    fetcher<FrontendUserWithComments>(`/api/v2/user/comment`),

  // Create comment
  createComment: async (comment: CreateCommentFormValues) => {
    return fetcher<FrontendComment>(`/api/v2/user/comment`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },

  // Update comment
  updateComment: async (commentId: string, text: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<FrontendComment>(`/api/v2/user/comment/${encodedId}`, {
      method: "PATCH",
      body: JSON.stringify({ text }),
    });
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/user/comment/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },
});

export type CommentsFetchers = ReturnType<typeof createCommentsFetchers>;

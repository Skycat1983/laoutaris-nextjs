import type { FrontendComment } from "@/lib/data/types/commentTypes";
import type { Fetcher } from "../../src/lib/api/core/createFetcher";
import type { CreateCommentFormValues } from "@/lib/data/schemas/commentSchema";

const createCommentFetchers = (fetcher: Fetcher) => ({
  // Create comment
  createComment: async (comment: CreateCommentFormValues) => {
    return fetcher<FrontendComment>(`/api/v2/comment`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },

  updateComment: async (commentId: string, text: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<FrontendComment>(`/api/v2/comment/${encodedId}`, {
      method: "PATCH",
      body: JSON.stringify({ text }),
    });
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const encodedId = encodeURIComponent(commentId);
    return fetcher<{ success: boolean; message: string }>(
      `/api/v2/comment/${encodedId}`,
      {
        method: "DELETE",
      }
    );
  },

  //! unused, for now...
  // getContentComments: async (contentType: string, contentId: string) => {
  //   return fetcher<FrontendComment[]>(
  //     `/api/v2/${contentType}/${contentId}/comments`
  //   );
  // },
});

export type CommentFetchers = ReturnType<typeof createCommentFetchers>;

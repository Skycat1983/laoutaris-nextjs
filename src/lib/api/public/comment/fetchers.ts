import type { FrontendComment } from "@/lib/data/types/commentTypes";
import type { Fetcher } from "../../core/createFetcher";

export const createCommentFetchers = (fetcher: Fetcher) => ({
  // Create comment
  createComment: async (blogSlug: string, text: string) => {
    const encodedSlug = encodeURIComponent(blogSlug);
    return fetcher<FrontendComment>(`/api/v2/blog/${encodedSlug}/comment`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  // Update comment
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
});

export type CommentFetchers = ReturnType<typeof createCommentFetchers>;

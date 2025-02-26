import type { FrontendComment } from "@/lib/data/types/commentTypes";
import type { Fetcher } from "../../core/createFetcher";
import type { CreateCommentFormValues } from "@/lib/data/schemas/commentSchema";

export const createCommentFetchers = (fetcher: Fetcher) => ({
  // Create comment
  createComment: async (comment: CreateCommentFormValues) => {
    return fetcher<FrontendComment>(`/api/v2/comment`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
  },
  // ! Old version for route: /api/v2/blog/[slug]/comments
  // createComment: async (blogSlug: string, text: string) => {
  //   const encodedSlug = encodeURIComponent(blogSlug);
  //   return fetcher<FrontendComment>(`/api/v2/blog/${encodedSlug}/comment`, {
  //     method: "POST",
  //     body: JSON.stringify({ text }),
  //   });
  // },

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

  // Post comment
  // postComment: async (blogSlug: string, comment: CreateCommentFormValues) =>
  //   fetcher<FrontendComment>(`/api/v2/blog/${blogSlug}/comments`, {
  //     method: "POST",
  //     body: JSON.stringify(comment),
  //   }),
});

export type CommentFetchers = ReturnType<typeof createCommentFetchers>;

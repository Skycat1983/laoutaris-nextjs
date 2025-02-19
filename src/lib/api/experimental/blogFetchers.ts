import { FrontendBlogEntryWithCommentAuthor } from "@/lib/data/types/blogTypes";

export type BlogWithCommentAuthorFetcher = (
  slug: string
) => Promise<ApiResponse<FrontendBlogEntryWithCommentAuthor>>;

export const createBlogWithCommentAuthorFetch = (
  getUrl: (slug: string) => string,
  getHeaders: () => HeadersInit
) => {
  return async (slug: string) => {
    try {
      const response = await fetch(getUrl(slug), {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Failed to fetch blog with comments",
        } satisfies ApiErrorResponse;
      }

      return result satisfies ApiSuccessResponse<FrontendBlogEntryWithCommentAuthor>;
    } catch (error) {
      console.error("Error fetching blog with comments:", error);
      return {
        success: false,
        error: "Failed to fetch blog with comments",
      } satisfies ApiErrorResponse;
    }
  };
};

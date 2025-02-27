import {
  FrontendBlogEntry,
  FrontendBlogEntryWithCommentAuthor,
} from "@/lib/data/types/blogTypes";
import { Fetcher } from "../../core/createFetcher";

interface FetchBlogsParams {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

// Add this type for paginated responses
type PaginatedBlogResponse = {
  success: true;
  data: FrontendBlogEntry[];
  metadata: PaginationMetadata; // Note: not optional here
};

export const createBlogFetchers = (fetcher: Fetcher) => ({
  // get one blog by slug
  fetchBlog: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<FrontendBlogEntry>(`/api/v2/public/blog/${encodedSlug}`);
  },

  // get multiple blogs by params
  fetchBlogs: async ({
    sortby,
    fields,
    limit = 10,
    page = 1,
  }: FetchBlogsParams = {}) => {
    const params = new URLSearchParams();
    if (sortby) params.append("sortby", sortby);
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<PaginatedBlogResponse["data"]>(
      `/api/v2/public/blog?${params.toString()}`
    );
  },

  // get one blog by slug. populate blog comments. populate comment author
  fetchBlogCommentsAuthor: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<FrontendBlogEntryWithCommentAuthor>(
      `/api/v2/public/blog/${encodedSlug}/comments/author`
    );
  },
});

// Type for our blog fetchers object
export type BlogFetchers = ReturnType<typeof createBlogFetchers>;

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
  fetchBlog: async (slug: string) =>
    fetcher<FrontendBlogEntry>(`/api/v2/blog/${slug}`),

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

    return fetcher<PaginatedBlogResponse["data"]>(`/api/v2/blog?${params}`);
  },

  // get one blog by slug. populate blog comments. populate comment author
  fetchBlogCommentsAuthor: async (slug: string) =>
    // Uses the generic fetcher with the specific blog type
    fetcher<FrontendBlogEntryWithCommentAuthor>(
      `/api/v2/blog/${slug}/comments/author`
    ),
});

// Type for our blog fetchers object
export type BlogFetchers = ReturnType<typeof createBlogFetchers>;

// ! admin only
// createBlog: async (data: CreateBlogFormValues) =>
//   fetcher<FrontendBlogEntry>("/api/v2/blog/create", {
//     method: "POST",
//     body: JSON.stringify(data),
//   }),

// updateBlog: async (slug: string, data: UpdateBlogFormValues) =>
//   fetcher<FrontendBlogEntry>(`/api/v2/blog/${slug}`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   }),

// deleteBlog: async (slug: string) =>
//   fetcher<void>(`/api/v2/blog/${slug}`, {
//     method: "DELETE",
//   }),

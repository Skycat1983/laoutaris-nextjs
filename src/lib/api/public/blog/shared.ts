import { Fetcher } from "../../core/types";
import {
  CreateBlogFormValues,
  FrontendBlogEntry,
  FrontendBlogEntryWithCommentAuthor,
  UpdateBlogFormValues,
} from "@/lib/data/types/blogTypes";
import { Section } from "@/lib/data/types/articleTypes";

interface FetchBlogsParams {
  section?: Section;
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

// Creates an object of blog-specific fetch functions
// Each function uses the generic fetcher but with blog-specific types

export const createBlogFetchers = (fetcher: Fetcher) => ({
  fetchBlog: async (slug: string) =>
    fetcher<FrontendBlogEntry>(`/api/v2/blog/${slug}`),

  fetchBlogs: async ({
    section,
    fields,
    limit = 10,
    page = 1,
  }: FetchBlogsParams = {}) => {
    const params = new URLSearchParams();
    if (section) params.append("section", section);
    if (fields) params.append("fields", fields.join(","));
    if (limit) params.append("limit", limit.toString());
    if (page) params.append("page", page.toString());

    return fetcher<FrontendBlogEntry[]>(`/api/v2/blog?${params}`);
  },
  // Fetch blog with comment author
  fetchBlogCommentsAuthor: async (slug: string) =>
    // Uses the generic fetcher with the specific blog type
    fetcher<FrontendBlogEntryWithCommentAuthor>(
      `/api/v2/blog/${slug}/comments/author`
    ),

  // ! admin only
  createBlog: async (data: CreateBlogFormValues) =>
    fetcher<FrontendBlogEntry>("/api/v2/blog/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBlog: async (slug: string, data: UpdateBlogFormValues) =>
    fetcher<FrontendBlogEntry>(`/api/v2/blog/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteBlog: async (slug: string) =>
    fetcher<void>(`/api/v2/blog/${slug}`, {
      method: "DELETE",
    }),
});

// Type for our blog fetchers object
export type BlogFetchers = ReturnType<typeof createBlogFetchers>;

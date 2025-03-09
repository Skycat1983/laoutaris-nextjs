import { BlogEntryPopulatedFrontend } from "@/lib/data/types/populatedTypes";
import { Fetcher } from "../../core/createFetcher";
import { ListResult, SingleResult } from "@/lib/data/types";

interface FetchBlogsParams {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  fields?: readonly string[];
  limit?: number;
  page?: number;
}

export type ApiBlogResult = SingleResult<BlogEntryPopulatedFrontend>;
export type ApiBlogListResult = ListResult<BlogEntryPopulatedFrontend>;
export type ApiBlogPopulatedResult = SingleResult<BlogEntryPopulatedFrontend>;

export const createBlogFetchers = (fetcher: Fetcher) => ({
  // get one blog by slug
  single: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiBlogResult>(`/api/v2/public/blog/${encodedSlug}`);
  },

  // get multiple blogs by params
  multiple: async ({
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

    return fetcher<ApiBlogListResult>(
      `/api/v2/public/blog?${params.toString()}`
    );
  },

  // get one blog by slug. populate blog comments. populate comment author
  singlePopulated: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    return fetcher<ApiBlogPopulatedResult>(
      `/api/v2/public/blog/${encodedSlug}/comments/author`
    );
  },
});

// Type for our blog fetchers object
export type BlogFetchers = ReturnType<typeof createBlogFetchers>;
// // Add this type for paginated responses
// type PaginatedBlogResponse = {
//   success: true;
//   data: FrontendBlogEntry[];
//   metadata: PaginationMetadata; // Note: not optional here
// };

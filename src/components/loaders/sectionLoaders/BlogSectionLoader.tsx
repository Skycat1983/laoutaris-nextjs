"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { BlogSection } from "@/components/sections/BlogSection";

// 1. Config Constants
const BLOG_FETCH_CONFIG = {
  sortby: "latest" as const,
  limit: 4,
  fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

// 2. Type Definitions
export type BlogCardData = Pick<
  FrontendBlogEntry,
  (typeof BLOG_FETCH_CONFIG.fields)[number]
>;

// 3. Loader Function
export async function BlogSectionLoader() {
  try {
    // Fetch data using API layer
    const response: ApiResponse<FrontendBlogEntry[]> =
      await serverPublicApi.blog.fetchBlogs({
        sortby: BLOG_FETCH_CONFIG.sortby,
        limit: BLOG_FETCH_CONFIG.limit,
        fields: BLOG_FETCH_CONFIG.fields,
      });

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch blogs");
    }

    const { data: blogs } = response as ApiSuccessResponse<FrontendBlogEntry[]>;

    // Transform data using transform layer
    const blogCards = blogs.map((blog) =>
      transformToPick(blog, BLOG_FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <BlogSection blogs={blogCards} />;
  } catch (error) {
    console.error("Blog section loading failed:", error);
    return null;
  }
}

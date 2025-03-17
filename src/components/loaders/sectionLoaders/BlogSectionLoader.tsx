"use server";

import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { BlogSection } from "@/components/sections/BlogSection";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { isNextError } from "@/lib/helpers/isNextError";
const BLOG_FETCH_CONFIG = {
  sortby: "latest" as const,
  limit: 4,
  // fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

export async function BlogSectionLoader() {
  try {
    const result = await serverPublicApi.blog.multiple({
      sortby: BLOG_FETCH_CONFIG.sortby,
      limit: BLOG_FETCH_CONFIG.limit,
      // fields: BLOG_FETCH_CONFIG.fields,
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch blogs");
    }

    const { data: blogs } = result as ApiSuccessResponse<BlogEntryFrontend[]>;

    // Return component with transformed data
    return <BlogSection blogs={blogs} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Blog section loading failed:", error);
    return null;
  }
}

// const blogCards = blogs.map((blog) =>
//   transformToPick(blog, BLOG_FETCH_CONFIG.fields)
// );

// export type BlogCardData = Pick<
//   FrontendBlogEntry,
//   (typeof BLOG_FETCH_CONFIG.fields)[number]
// >;

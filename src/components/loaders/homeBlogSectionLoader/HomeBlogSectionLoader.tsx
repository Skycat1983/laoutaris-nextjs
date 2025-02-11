"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import HomeBlogSection from "../../contentSections/HomeBlogSection";
import { fetchBlogEntries } from "@/lib/api/blogApi";

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
export async function HomeBlogSectionLoader() {
  console.log("HomeBlogSectionLoader");
  try {
    // Fetch data using API layer
    const response = await fetchBlogEntries({
      sortby: BLOG_FETCH_CONFIG.sortby,
      limit: BLOG_FETCH_CONFIG.limit,
      fields: BLOG_FETCH_CONFIG.fields,
    });

    // console.log("response in loader", response);

    const blogs = response.data;

    // Transform data using transform layer
    const blogCards = blogs.map((blog) =>
      transformToPick(blog, BLOG_FETCH_CONFIG.fields)
    );

    // console.log("blogCards", blogCards);

    // Return component with transformed data
    return <HomeBlogSection blogs={blogCards} />;
  } catch (error) {
    console.error("Blog section loading failed:", error);
    return null;
  }
}

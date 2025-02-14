"use server";

import { fetchBlogEntries } from "@/lib/api/blogApi";
import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";
import BlogListView from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/paginationTransforms";

// Config Constants
const BLOG_ENTRIES_CONFIG = {
  fields: [
    "title",
    "subtitle",
    "slug",
    "imageUrl",
    "summary",
    "displayDate",
    "tags",
  ] as const,
  limit: 6,
} as const;

// Type Definitions
export type BlogEntryData = Pick<
  FrontendBlogEntry,
  (typeof BLOG_ENTRIES_CONFIG.fields)[number]
>;

interface BlogEntriesLoaderProps {
  sortby: "latest" | "oldest" | "popular" | "featured";
  page: number;
}

// Loader Function
export async function BlogListLoader({ sortby, page }: BlogEntriesLoaderProps) {
  try {
    // Fetch data using API layer
    const { data: blogs, metadata } = await fetchBlogEntries({
      sortby,
      page,
      limit: BLOG_ENTRIES_CONFIG.limit,
      fields: BLOG_ENTRIES_CONFIG.fields,
    });

    // Transform blog entries with explicit typing
    const transformedBlogs: BlogEntryData[] = blogs.map((blog) =>
      transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
    );

    // Transform pagination data
    const { prev, next } = transformToPaginationLinks(
      metadata.page,
      metadata.limit,
      metadata.total,
      `/blog/${sortby}`
    );

    // Return component with transformed data
    return (
      <BlogListView blogEntries={transformedBlogs} next={next} prev={prev} />
    );
  } catch (error) {
    console.error("Blog entries loading failed:", error);
    return null;
  }
}

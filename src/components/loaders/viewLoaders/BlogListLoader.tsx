"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import BlogListView from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/paginationTransforms";
import { blogServer } from "@/lib/api/public/blog/server";

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
    const result = (await blogServer.fetchBlogs({
      sortby,
      page,
      limit: BLOG_ENTRIES_CONFIG.limit,
      fields: BLOG_ENTRIES_CONFIG.fields,
    })) as ApiResponse<FrontendBlogEntry[]>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch blog entries");
    }

    const { data: blogs, metadata } = result as PaginatedResponse<
      FrontendBlogEntry[]
    >;

    // Transform blogs with explicit typing
    const transformedBlogs: BlogEntryData[] = blogs.map((blog) =>
      transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
    );

    const currentUrl = `/blog?sortby=${sortby}&page=${page}`;
    const { prev, next } = transformToPaginationLinks(
      metadata.page,
      metadata.limit,
      metadata.total,
      currentUrl
    );

    return (
      <BlogListView blogEntries={transformedBlogs} next={next} prev={prev} />
    );
  } catch (error) {
    throw error;
  }
}

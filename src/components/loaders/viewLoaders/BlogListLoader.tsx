"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { BlogListView } from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/paginationTransforms";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";

// Config Constants
const BLOG_ENTRIES_CONFIG = {
  fields: [
    "title",
    "subtitle",
    "slug",
    "imageUrl",
    "summary",
    "displayDate",
    // "tags",
  ] as const,
  limit: 10,
} as const;

// Type Definitions
export type BlogEntryData = Pick<
  FrontendBlogEntry,
  (typeof BLOG_ENTRIES_CONFIG.fields)[number]
>;

interface BlogEntriesLoaderProps {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  page: number;
}

export interface SortedBlogData {
  featured?: BlogEntryData[];
  latest?: BlogEntryData[];
  popular?: BlogEntryData[];
  single?: {
    type: "latest" | "oldest" | "popular" | "featured";
    data: BlogEntryData[];
  };
  metadata: PaginationMetadata;
}

// Loader Function
export async function BlogListLoader({ sortby, page }: BlogEntriesLoaderProps) {
  try {
    let blogData: SortedBlogData;

    if (sortby) {
      // Single sort type fetch
      const result = await serverPublicApi.blog.fetchBlogs({
        sortby,
        page,
        limit: BLOG_ENTRIES_CONFIG.limit,
        fields: BLOG_ENTRIES_CONFIG.fields,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch blog entries");
      }

      const {
        data: blogs,
        metadata = {
          page: 1,
          limit: BLOG_ENTRIES_CONFIG.limit,
          total: blogs.length,
          totalPages: 1,
        },
      } = result as PaginatedResponse<FrontendBlogEntry[]>;

      blogData = {
        single: {
          type: sortby,
          data: blogs.map((blog) =>
            transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
          ),
        },
        metadata,
      };
    } else {
      // Multiple sort types fetch
      const [featuredResult, latestResult, popularResult] = await Promise.all([
        serverPublicApi.blog.fetchBlogs({
          sortby: "featured",
          page: 1,
          limit: 4,
          fields: BLOG_ENTRIES_CONFIG.fields,
        }),
        serverPublicApi.blog.fetchBlogs({
          sortby: "latest",
          page: 1,
          limit: 6,
          fields: BLOG_ENTRIES_CONFIG.fields,
        }),
        serverPublicApi.blog.fetchBlogs({
          sortby: "popular",
          page: 1,
          limit: 6,
          fields: BLOG_ENTRIES_CONFIG.fields,
        }),
      ]);

      if (
        !featuredResult.success ||
        !latestResult.success ||
        !popularResult.success
      ) {
        throw new Error("Failed to fetch one or more blog sets");
      }

      // Ensure we have valid metadata
      const defaultMetadata: PaginationMetadata = {
        page: 1,
        limit: BLOG_ENTRIES_CONFIG.limit,
        total: latestResult.data.length,
        totalPages: 1,
      };

      blogData = {
        featured: featuredResult.data.map((blog) =>
          transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
        ),
        latest: latestResult.data.map((blog) =>
          transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
        ),
        popular: popularResult.data.map((blog) =>
          transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
        ),
        metadata: latestResult.metadata ?? defaultMetadata,
      };
    }

    const currentUrl = sortby
      ? `/blog?sortby=${sortby}&page=${page}`
      : `/blog?page=${page}`;
    const { prev, next } = transformToPaginationLinks(
      blogData.metadata.page,
      blogData.metadata.limit,
      blogData.metadata.total,
      currentUrl
    );

    return <BlogListView blogData={blogData} next={next} prev={prev} />;
  } catch (error) {
    throw error;
  }
}

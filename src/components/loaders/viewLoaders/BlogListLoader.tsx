"use server";

import { BlogListView } from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/utils/paginationTransforms";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { serverApi } from "@/lib/api/serverApi";
import { PaginationMetadata } from "@/lib/data/types/apiTypes";
import { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { ApiBlogListResult } from "@/lib/api/public/blog/fetchers";
// Config Constants
const BLOG_ENTRIES_CONFIG = {
  limit: 10,
} as const;

interface BlogEntriesLoaderProps {
  sortby?: "latest" | "oldest" | "popular" | "featured";
  page: number;
}

export interface SortedBlogData {
  featured?: BlogEntryFrontend[];
  latest?: BlogEntryFrontend[];
  popular?: BlogEntryFrontend[];
  single?: {
    type: "latest" | "oldest" | "popular" | "featured";
    data: BlogEntryFrontend[];
  };
  metadata: PaginationMetadata;
}

export async function BlogListLoader({ sortby, page }: BlogEntriesLoaderProps) {
  try {
    let blogData: SortedBlogData;

    if (sortby) {
      // Single sort type fetch
      const result = await serverApi.public.blog.multiple({
        sortby,
        page,
        limit: BLOG_ENTRIES_CONFIG.limit,
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
      } = result as ApiBlogListResult;

      blogData = {
        single: {
          type: sortby,
          data: blogs,
        },
        metadata,
      };
    } else {
      // Multiple sort types fetch
      const [featuredResult, latestResult, popularResult] = await Promise.all([
        serverPublicApi.blog.multiple({
          sortby: "featured",
          page: 1,
          limit: 5,
        }),
        serverPublicApi.blog.multiple({
          sortby: "latest",
          page: 1,
          limit: 6,
        }),
        serverPublicApi.blog.multiple({
          sortby: "popular",
          page: 1,
          limit: 8,
        }),
      ]);

      if (
        !featuredResult.success ||
        !latestResult.success ||
        !popularResult.success
      ) {
        throw new Error("Failed to fetch one or more blog sets");
      }

      blogData = {
        featured: featuredResult.data,
        latest: latestResult.data,
        popular: popularResult.data,
        metadata: {
          page: 1,
          limit: BLOG_ENTRIES_CONFIG.limit,
          total:
            featuredResult.data.length +
            latestResult.data.length +
            popularResult.data.length,
          totalPages: 1,
        },
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

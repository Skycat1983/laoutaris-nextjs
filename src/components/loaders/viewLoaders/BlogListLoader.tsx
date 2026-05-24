import { BlogListView } from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/utils/paginationTransforms";
import type { PaginationMetadata } from "@/lib/data/types/apiTypes";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import {
  getBlogList,
  type BlogListSortBy,
} from "@/lib/data/services/getBlogList";
import {
  getCachedDefaultFeaturedBlogList,
  getCachedDefaultLatestBlogList,
  getCachedDefaultPopularBlogList,
  getCachedSortedFirstPageBlogList,
} from "@/lib/data/services/getCachedBlogListData";
// Config Constants
const BLOG_ENTRIES_CONFIG = {
  limit: 10,
} as const;

interface BlogEntriesLoaderProps {
  sortby?: BlogListSortBy;
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
  metadata: Required<PaginationMetadata>;
}

export async function BlogListLoader({ sortby, page }: BlogEntriesLoaderProps) {
  try {
    let blogData: SortedBlogData;

    if (sortby) {
      const result =
        page === 1
          ? await getCachedSortedFirstPageBlogList(sortby)
          : await getBlogList({
              sortby,
              page,
              limit: BLOG_ENTRIES_CONFIG.limit,
            });

      const {
        data: blogs,
        metadata = {
          page: 1,
          limit: BLOG_ENTRIES_CONFIG.limit,
          total: blogs.length,
          totalPages: 1,
        },
      } = result;

      blogData = {
        single: {
          type: sortby,
          data: blogs,
        },
        metadata,
      };
    } else {
      const [featuredResult, latestResult, popularResult] = await Promise.all([
        getCachedDefaultFeaturedBlogList(),
        getCachedDefaultLatestBlogList(),
        getCachedDefaultPopularBlogList(),
      ]);

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

    return (
      <BlogListView
        blogData={blogData}
        activeSortBy={sortby}
        next={next}
        prev={prev}
      />
    );
  } catch (error) {
    throw error;
  }
}

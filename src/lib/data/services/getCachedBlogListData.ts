import "server-only";

import { unstable_cache } from "next/cache";
import {
  getBlogList,
  type BlogListServiceResult,
  type BlogListSortBy,
} from "@/lib/data/services/getBlogList";

export const BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS = 10 * 60;
const SORTED_BLOG_LIST_CACHE_LIMIT = 10;
type BoundedSortedBlogListSortBy = Exclude<BlogListSortBy, "popular">;
type BoundedSortedBlogListPage = 2 | 3 | 4 | 5;

const createCachedSortedPageBlogList = (
  sortby: BoundedSortedBlogListSortBy,
  page: BoundedSortedBlogListPage,
  cacheKey: string
) =>
  unstable_cache(
    async () =>
      getBlogList({
        sortby,
        page,
        limit: SORTED_BLOG_LIST_CACHE_LIMIT,
      }),
    [cacheKey],
    { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
  );

export const getCachedDefaultFeaturedBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "featured",
      page: 1,
      limit: 5,
    }),
  ["public-blog-default-list-featured"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedDefaultLatestBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "latest",
      page: 1,
      limit: 6,
    }),
  ["public-blog-default-list-latest"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedDefaultPopularBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "popular",
      page: 1,
      limit: 8,
    }),
  ["public-blog-default-list-popular"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedSortedLatestFirstPageBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "latest",
      page: 1,
      limit: 10,
    }),
  ["public-blog-sorted-first-page-latest"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedSortedOldestFirstPageBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "oldest",
      page: 1,
      limit: 10,
    }),
  ["public-blog-sorted-first-page-oldest"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedSortedFeaturedFirstPageBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "featured",
      page: 1,
      limit: 10,
    }),
  ["public-blog-sorted-first-page-featured"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedSortedPopularFirstPageBlogList = unstable_cache(
  async () =>
    getBlogList({
      sortby: "popular",
      page: 1,
      limit: 10,
    }),
  ["public-blog-sorted-first-page-popular"],
  { revalidate: BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS }
);

export const getCachedSortedLatestPage2BlogList = createCachedSortedPageBlogList(
  "latest",
  2,
  "public-blog-sorted-page-latest-2-limit-10"
);

export const getCachedSortedLatestPage3BlogList = createCachedSortedPageBlogList(
  "latest",
  3,
  "public-blog-sorted-page-latest-3-limit-10"
);

export const getCachedSortedLatestPage4BlogList = createCachedSortedPageBlogList(
  "latest",
  4,
  "public-blog-sorted-page-latest-4-limit-10"
);

export const getCachedSortedLatestPage5BlogList = createCachedSortedPageBlogList(
  "latest",
  5,
  "public-blog-sorted-page-latest-5-limit-10"
);

export const getCachedSortedOldestPage2BlogList = createCachedSortedPageBlogList(
  "oldest",
  2,
  "public-blog-sorted-page-oldest-2-limit-10"
);

export const getCachedSortedOldestPage3BlogList = createCachedSortedPageBlogList(
  "oldest",
  3,
  "public-blog-sorted-page-oldest-3-limit-10"
);

export const getCachedSortedOldestPage4BlogList = createCachedSortedPageBlogList(
  "oldest",
  4,
  "public-blog-sorted-page-oldest-4-limit-10"
);

export const getCachedSortedOldestPage5BlogList = createCachedSortedPageBlogList(
  "oldest",
  5,
  "public-blog-sorted-page-oldest-5-limit-10"
);

export const getCachedSortedFeaturedPage2BlogList =
  createCachedSortedPageBlogList(
    "featured",
    2,
    "public-blog-sorted-page-featured-2-limit-10"
  );

export const getCachedSortedFeaturedPage3BlogList =
  createCachedSortedPageBlogList(
    "featured",
    3,
    "public-blog-sorted-page-featured-3-limit-10"
  );

export const getCachedSortedFeaturedPage4BlogList =
  createCachedSortedPageBlogList(
    "featured",
    4,
    "public-blog-sorted-page-featured-4-limit-10"
  );

export const getCachedSortedFeaturedPage5BlogList =
  createCachedSortedPageBlogList(
    "featured",
    5,
    "public-blog-sorted-page-featured-5-limit-10"
  );

export const getCachedSortedFirstPageBlogList = (sortby: BlogListSortBy) => {
  switch (sortby) {
    case "latest":
      return getCachedSortedLatestFirstPageBlogList();
    case "oldest":
      return getCachedSortedOldestFirstPageBlogList();
    case "featured":
      return getCachedSortedFeaturedFirstPageBlogList();
    case "popular":
      return getCachedSortedPopularFirstPageBlogList();
  }
};

const getCachedBoundedLatestPageBlogList = (page: number) => {
  switch (page) {
    case 2:
      return getCachedSortedLatestPage2BlogList();
    case 3:
      return getCachedSortedLatestPage3BlogList();
    case 4:
      return getCachedSortedLatestPage4BlogList();
    case 5:
      return getCachedSortedLatestPage5BlogList();
    default:
      return undefined;
  }
};

const getCachedBoundedOldestPageBlogList = (page: number) => {
  switch (page) {
    case 2:
      return getCachedSortedOldestPage2BlogList();
    case 3:
      return getCachedSortedOldestPage3BlogList();
    case 4:
      return getCachedSortedOldestPage4BlogList();
    case 5:
      return getCachedSortedOldestPage5BlogList();
    default:
      return undefined;
  }
};

const getCachedBoundedFeaturedPageBlogList = (page: number) => {
  switch (page) {
    case 2:
      return getCachedSortedFeaturedPage2BlogList();
    case 3:
      return getCachedSortedFeaturedPage3BlogList();
    case 4:
      return getCachedSortedFeaturedPage4BlogList();
    case 5:
      return getCachedSortedFeaturedPage5BlogList();
    default:
      return undefined;
  }
};

export const getCachedBoundedSortedPageBlogList = (
  sortby: BlogListSortBy,
  page: number
): Promise<BlogListServiceResult> | undefined => {
  switch (sortby) {
    case "latest":
      return getCachedBoundedLatestPageBlogList(page);
    case "oldest":
      return getCachedBoundedOldestPageBlogList(page);
    case "featured":
      return getCachedBoundedFeaturedPageBlogList(page);
    case "popular":
      return undefined;
  }
};

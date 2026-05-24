import "server-only";

import { unstable_cache } from "next/cache";
import {
  getBlogList,
  type BlogListSortBy,
} from "@/lib/data/services/getBlogList";

export const BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS = 10 * 60;

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

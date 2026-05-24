jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS,
  getCachedBoundedSortedPageBlogList,
  getCachedDefaultFeaturedBlogList,
  getCachedDefaultLatestBlogList,
  getCachedDefaultPopularBlogList,
  getCachedSortedFeaturedFirstPageBlogList,
  getCachedSortedFeaturedPage2BlogList,
  getCachedSortedFeaturedPage3BlogList,
  getCachedSortedFeaturedPage4BlogList,
  getCachedSortedFeaturedPage5BlogList,
  getCachedSortedFirstPageBlogList,
  getCachedSortedLatestFirstPageBlogList,
  getCachedSortedLatestPage2BlogList,
  getCachedSortedLatestPage3BlogList,
  getCachedSortedLatestPage4BlogList,
  getCachedSortedLatestPage5BlogList,
  getCachedSortedOldestFirstPageBlogList,
  getCachedSortedOldestPage2BlogList,
  getCachedSortedOldestPage3BlogList,
  getCachedSortedOldestPage4BlogList,
  getCachedSortedOldestPage5BlogList,
  getCachedSortedPopularFirstPageBlogList,
} from "@/lib/data/services/getCachedBlogListData";
import { getBlogList } from "@/lib/data/services/getBlogList";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithComments", () => ({
  getBlogBySlugWithComments: jest.fn(),
}));

const mockGetBlogList = getBlogList as jest.MockedFunction<typeof getBlogList>;
const mockGetBlogBySlugWithComments =
  getBlogBySlugWithComments as jest.MockedFunction<
    typeof getBlogBySlugWithComments
  >;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

const expectedCacheKeys = [
  "public-blog-default-list-featured",
  "public-blog-default-list-latest",
  "public-blog-default-list-popular",
  "public-blog-sorted-first-page-latest",
  "public-blog-sorted-first-page-oldest",
  "public-blog-sorted-first-page-featured",
  "public-blog-sorted-first-page-popular",
  "public-blog-sorted-page-latest-2-limit-10",
  "public-blog-sorted-page-latest-3-limit-10",
  "public-blog-sorted-page-latest-4-limit-10",
  "public-blog-sorted-page-latest-5-limit-10",
  "public-blog-sorted-page-oldest-2-limit-10",
  "public-blog-sorted-page-oldest-3-limit-10",
  "public-blog-sorted-page-oldest-4-limit-10",
  "public-blog-sorted-page-oldest-5-limit-10",
  "public-blog-sorted-page-featured-2-limit-10",
  "public-blog-sorted-page-featured-3-limit-10",
  "public-blog-sorted-page-featured-4-limit-10",
  "public-blog-sorted-page-featured-5-limit-10",
] as const;

const boundedSortedPageWrappers = [
  ["latest", 2, getCachedSortedLatestPage2BlogList],
  ["latest", 3, getCachedSortedLatestPage3BlogList],
  ["latest", 4, getCachedSortedLatestPage4BlogList],
  ["latest", 5, getCachedSortedLatestPage5BlogList],
  ["oldest", 2, getCachedSortedOldestPage2BlogList],
  ["oldest", 3, getCachedSortedOldestPage3BlogList],
  ["oldest", 4, getCachedSortedOldestPage4BlogList],
  ["oldest", 5, getCachedSortedOldestPage5BlogList],
  ["featured", 2, getCachedSortedFeaturedPage2BlogList],
  ["featured", 3, getCachedSortedFeaturedPage3BlogList],
  ["featured", 4, getCachedSortedFeaturedPage4BlogList],
  ["featured", 5, getCachedSortedFeaturedPage5BlogList],
] as const;

describe("cached blog list data services", () => {
  beforeEach(() => {
    mockGetBlogList.mockClear();
    mockGetBlogBySlugWithComments.mockClear();
  });

  it("wraps accepted blog list reads with fixed keys and a 10-minute stale window", () => {
    expect(BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(expectedCacheKeys.length);
    expect(
      mockUnstableCache.mock.calls.map(([, keyParts, options]) => ({
        keyParts,
        options,
      }))
    ).toEqual(
      expectedCacheKeys.map((cacheKey) => ({
        keyParts: [cacheKey],
        options: { revalidate: 600 },
      }))
    );
  });

  it("delegates the featured default group to the fixed featured list read", async () => {
    const result = {
      success: true,
      data: [{ slug: "featured", title: "Featured" }],
      metadata: { page: 1, limit: 5, total: 1, totalPages: 1 },
    };
    mockGetBlogList.mockResolvedValue(result as never);

    await expect(getCachedDefaultFeaturedBlogList()).resolves.toBe(result);

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "featured",
      page: 1,
      limit: 5,
    });
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
  });

  it("delegates the latest default group to the fixed latest list read", async () => {
    const result = {
      success: true,
      data: [{ slug: "latest", title: "Latest" }],
      metadata: { page: 1, limit: 6, total: 1, totalPages: 1 },
    };
    mockGetBlogList.mockResolvedValue(result as never);

    await expect(getCachedDefaultLatestBlogList()).resolves.toBe(result);

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
      page: 1,
      limit: 6,
    });
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
  });

  it("delegates the popular default group to the fixed popular list read", async () => {
    const result = {
      success: true,
      data: [{ slug: "popular", title: "Popular" }],
      metadata: { page: 1, limit: 8, total: 1, totalPages: 1 },
    };
    mockGetBlogList.mockResolvedValue(result as never);

    await expect(getCachedDefaultPopularBlogList()).resolves.toBe(result);

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "popular",
      page: 1,
      limit: 8,
    });
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
  });

  it.each([
    ["latest", getCachedSortedLatestFirstPageBlogList],
    ["oldest", getCachedSortedOldestFirstPageBlogList],
    ["featured", getCachedSortedFeaturedFirstPageBlogList],
    ["popular", getCachedSortedPopularFirstPageBlogList],
  ] as const)(
    "delegates the sorted %s first page to the fixed limit-10 list read",
    async (sortby, getCachedList) => {
      const result = {
        success: true,
        data: [{ slug: sortby, title: sortby }],
        metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockGetBlogList.mockResolvedValue(result as never);

      await expect(getCachedList()).resolves.toBe(result);

      expect(mockGetBlogList).toHaveBeenCalledWith({
        sortby,
        page: 1,
        limit: 10,
      });
      expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["latest", getCachedSortedLatestFirstPageBlogList],
    ["oldest", getCachedSortedOldestFirstPageBlogList],
    ["featured", getCachedSortedFeaturedFirstPageBlogList],
    ["popular", getCachedSortedPopularFirstPageBlogList],
  ] as const)(
    "dispatches %s sorted first-page reads through the fixed cached wrapper",
    async (sortby, expectedWrapper) => {
      const result = {
        success: true,
        data: [{ slug: sortby, title: sortby }],
        metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockGetBlogList.mockResolvedValue(result as never);

      await expect(getCachedSortedFirstPageBlogList(sortby)).resolves.toBe(
        result
      );

      await expect(expectedWrapper()).resolves.toBe(result);
      expect(mockGetBlogList).toHaveBeenCalledWith({
        sortby,
        page: 1,
        limit: 10,
      });
    }
  );

  it.each(boundedSortedPageWrappers)(
    "delegates sorted %s page %s to the fixed bounded limit-10 list read",
    async (sortby, page, getCachedList) => {
      const result = {
        success: true,
        data: [{ slug: `${sortby}-${page}`, title: `${sortby}-${page}` }],
        metadata: { page, limit: 10, total: 50, totalPages: 5 },
      };
      mockGetBlogList.mockResolvedValue(result as never);

      await expect(getCachedList()).resolves.toBe(result);

      expect(mockGetBlogList).toHaveBeenCalledWith({
        sortby,
        page,
        limit: 10,
      });
      expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
    }
  );

  it.each(boundedSortedPageWrappers)(
    "dispatches sorted %s page %s reads through the bounded cached dispatcher",
    async (sortby, page) => {
      const result = {
        success: true,
        data: [{ slug: `${sortby}-${page}`, title: `${sortby}-${page}` }],
        metadata: { page, limit: 10, total: 50, totalPages: 5 },
      };
      mockGetBlogList.mockResolvedValue(result as never);

      await expect(
        getCachedBoundedSortedPageBlogList(sortby, page)
      ).resolves.toBe(result);

      expect(mockGetBlogList).toHaveBeenCalledWith({
        sortby,
        page,
        limit: 10,
      });
    }
  );

  it("does not dispatch popular page 2 or page 6 through bounded cached wrappers", () => {
    expect(getCachedBoundedSortedPageBlogList("popular", 2)).toBeUndefined();
    expect(getCachedBoundedSortedPageBlogList("latest", 6)).toBeUndefined();
    expect(getCachedBoundedSortedPageBlogList("oldest", 1)).toBeUndefined();
    expect(getCachedBoundedSortedPageBlogList("featured", 1000)).toBeUndefined();
    expect(mockGetBlogList).not.toHaveBeenCalled();
  });
});

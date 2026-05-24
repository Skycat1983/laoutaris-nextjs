jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS,
  getCachedDefaultFeaturedBlogList,
  getCachedDefaultLatestBlogList,
  getCachedDefaultPopularBlogList,
  getCachedSortedFeaturedFirstPageBlogList,
  getCachedSortedFirstPageBlogList,
  getCachedSortedLatestFirstPageBlogList,
  getCachedSortedOldestFirstPageBlogList,
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

describe("cached blog list data services", () => {
  beforeEach(() => {
    mockGetBlogList.mockClear();
    mockGetBlogBySlugWithComments.mockClear();
  });

  it("wraps accepted blog list reads with fixed keys and a 10-minute stale window", () => {
    expect(BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(7);
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      ["public-blog-default-list-featured"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      ["public-blog-default-list-latest"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      3,
      expect.any(Function),
      ["public-blog-default-list-popular"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      4,
      expect.any(Function),
      ["public-blog-sorted-first-page-latest"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      5,
      expect.any(Function),
      ["public-blog-sorted-first-page-oldest"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      6,
      expect.any(Function),
      ["public-blog-sorted-first-page-featured"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      7,
      expect.any(Function),
      ["public-blog-sorted-first-page-popular"],
      { revalidate: 600 }
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
});

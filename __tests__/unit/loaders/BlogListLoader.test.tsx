import type { ReactElement } from "react";
import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { BlogListView } from "@/components/views/BlogListView";
import {
  getCachedDefaultFeaturedBlogList,
  getCachedDefaultLatestBlogList,
  getCachedDefaultPopularBlogList,
  getCachedBoundedSortedPageBlogList,
  getCachedSortedFirstPageBlogList,
} from "@/lib/data/services/getCachedBlogListData";
import { getBlogList } from "@/lib/data/services/getBlogList";

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
}));

jest.mock("@/lib/data/services/getCachedBlogListData", () => ({
  getCachedDefaultFeaturedBlogList: jest.fn(),
  getCachedDefaultLatestBlogList: jest.fn(),
  getCachedDefaultPopularBlogList: jest.fn(),
  getCachedBoundedSortedPageBlogList: jest.fn(),
  getCachedSortedFirstPageBlogList: jest.fn(),
}));

jest.mock("@/components/views/BlogListView", () => ({
  BlogListView: jest.fn(() => null),
}));

const mockGetBlogList = getBlogList as jest.MockedFunction<typeof getBlogList>;
const mockGetCachedDefaultFeaturedBlogList =
  getCachedDefaultFeaturedBlogList as jest.MockedFunction<
    typeof getCachedDefaultFeaturedBlogList
  >;
const mockGetCachedDefaultLatestBlogList =
  getCachedDefaultLatestBlogList as jest.MockedFunction<
    typeof getCachedDefaultLatestBlogList
  >;
const mockGetCachedDefaultPopularBlogList =
  getCachedDefaultPopularBlogList as jest.MockedFunction<
    typeof getCachedDefaultPopularBlogList
  >;
const mockGetCachedBoundedSortedPageBlogList =
  getCachedBoundedSortedPageBlogList as jest.MockedFunction<
    typeof getCachedBoundedSortedPageBlogList
  >;
const mockGetCachedSortedFirstPageBlogList =
  getCachedSortedFirstPageBlogList as jest.MockedFunction<
    typeof getCachedSortedFirstPageBlogList
  >;

const createBlog = (slug: string) =>
  ({
    slug,
    title: slug,
    linkTo: `/blog/${slug}`,
  }) as never;

describe("BlogListLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a sorted first page from the fixed cached server service without same-app fetches", async () => {
    const blogs = [createBlog("one"), createBlog("two")];
    mockGetCachedSortedFirstPageBlogList.mockResolvedValue({
      success: true,
      data: blogs,
      metadata: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });

    const element = (await BlogListLoader({
      sortby: "popular",
      page: 1,
    })) as ReactElement<{
      blogData: unknown;
      activeSortBy?: string;
      prev: string | null;
      next: string | null;
    }>;

    expect(mockGetCachedSortedFirstPageBlogList).toHaveBeenCalledWith(
      "popular"
    );
    expect(mockGetCachedBoundedSortedPageBlogList).not.toHaveBeenCalled();
    expect(mockGetBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultFeaturedBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultLatestBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultPopularBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogListView);
    expect(element.props).toEqual({
      blogData: {
        single: {
          type: "popular",
          data: blogs,
        },
        metadata: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      },
      activeSortBy: "popular",
      prev: null,
      next: "/blog?sortby=popular&page=2",
    });
  });

  it.each([
    ["latest", 2, "/blog?sortby=latest&page=1", "/blog?sortby=latest&page=3"],
    ["oldest", 3, "/blog?sortby=oldest&page=2", "/blog?sortby=oldest&page=4"],
    ["featured", 5, "/blog?sortby=featured&page=4", null],
  ] as const)(
    "renders bounded %s page %s from the fixed cached server service",
    async (sortby, page, prev, next) => {
      const blogs = [createBlog("one"), createBlog("two")];
      mockGetCachedBoundedSortedPageBlogList.mockResolvedValue({
        success: true,
        data: blogs,
        metadata: {
          page,
          limit: 10,
          total: 50,
          totalPages: 5,
        },
      });

      const element = (await BlogListLoader({
        sortby,
        page,
      })) as ReactElement<{
        blogData: unknown;
        activeSortBy?: string;
        prev: string | null;
        next: string | null;
      }>;

      expect(mockGetCachedBoundedSortedPageBlogList).toHaveBeenCalledWith(
        sortby,
        page
      );
      expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
      expect(mockGetBlogList).not.toHaveBeenCalled();
      expect(mockGetCachedDefaultFeaturedBlogList).not.toHaveBeenCalled();
      expect(mockGetCachedDefaultLatestBlogList).not.toHaveBeenCalled();
      expect(mockGetCachedDefaultPopularBlogList).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(element.type).toBe(BlogListView);
      expect(element.props).toEqual({
        blogData: {
          single: {
            type: sortby,
            data: blogs,
          },
          metadata: {
            page,
            limit: 10,
            total: 50,
            totalPages: 5,
          },
        },
        activeSortBy: sortby,
        prev,
        next,
      });
    }
  );

  it("keeps popular page 2 on the direct server service without same-app fetches", async () => {
    const blogs = [createBlog("one"), createBlog("two")];
    mockGetCachedBoundedSortedPageBlogList.mockReturnValue(undefined);
    mockGetBlogList.mockResolvedValue({
      success: true,
      data: blogs,
      metadata: {
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });

    const element = (await BlogListLoader({
      sortby: "popular",
      page: 2,
    })) as ReactElement<{
      blogData: unknown;
      activeSortBy?: string;
      prev: string | null;
      next: string | null;
    }>;

    expect(mockGetCachedBoundedSortedPageBlogList).toHaveBeenCalledWith(
      "popular",
      2
    );
    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "popular",
      page: 2,
      limit: 10,
    });
    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogListView);
    expect(element.props).toEqual({
      blogData: {
        single: {
          type: "popular",
          data: blogs,
        },
        metadata: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      },
      activeSortBy: "popular",
      prev: "/blog?sortby=popular&page=1",
      next: "/blog?sortby=popular&page=3",
    });
  });

  it("keeps sorted page 6 on the direct server service without same-app fetches", async () => {
    const blogs = [createBlog("one"), createBlog("two")];
    mockGetCachedBoundedSortedPageBlogList.mockReturnValue(undefined);
    mockGetBlogList.mockResolvedValue({
      success: true,
      data: blogs,
      metadata: {
        page: 6,
        limit: 10,
        total: 65,
        totalPages: 7,
      },
    });

    const element = (await BlogListLoader({
      sortby: "latest",
      page: 6,
    })) as ReactElement<{
      blogData: unknown;
      activeSortBy?: string;
      prev: string | null;
      next: string | null;
    }>;

    expect(mockGetCachedBoundedSortedPageBlogList).toHaveBeenCalledWith(
      "latest",
      6
    );
    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
      page: 6,
      limit: 10,
    });
    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogListView);
    expect(element.props).toEqual({
      blogData: {
        single: {
          type: "latest",
          data: blogs,
        },
        metadata: {
          page: 6,
          limit: 10,
          total: 65,
          totalPages: 7,
        },
      },
      activeSortBy: "latest",
      prev: "/blog?sortby=latest&page=5",
      next: "/blog?sortby=latest&page=7",
    });
  });

  it("renders grouped featured, latest, and popular lists from the server service", async () => {
    const featured = [createBlog("featured")];
    const latest = [createBlog("latest-one"), createBlog("latest-two")];
    const popular = [
      createBlog("popular-one"),
      createBlog("popular-two"),
      createBlog("popular-three"),
    ];
    mockGetCachedDefaultFeaturedBlogList.mockResolvedValue({
      success: true,
      data: featured,
      metadata: { page: 1, limit: 5, total: 1, totalPages: 1 },
    });
    mockGetCachedDefaultLatestBlogList.mockResolvedValue({
      success: true,
      data: latest,
      metadata: { page: 1, limit: 6, total: 2, totalPages: 1 },
    });
    mockGetCachedDefaultPopularBlogList.mockResolvedValue({
      success: true,
      data: popular,
      metadata: { page: 1, limit: 8, total: 3, totalPages: 1 },
    });

    const element = (await BlogListLoader({ page: 1 })) as ReactElement<{
      blogData: unknown;
      activeSortBy?: string;
      prev: string | null;
      next: string | null;
    }>;

    expect(mockGetCachedDefaultFeaturedBlogList).toHaveBeenCalledWith();
    expect(mockGetCachedDefaultLatestBlogList).toHaveBeenCalledWith();
    expect(mockGetCachedDefaultPopularBlogList).toHaveBeenCalledWith();
    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedBoundedSortedPageBlogList).not.toHaveBeenCalled();
    expect(mockGetBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogListView);
    expect(element.props).toEqual({
      blogData: {
        featured,
        latest,
        popular,
        metadata: {
          page: 1,
          limit: 10,
          total: 6,
          totalPages: 1,
        },
      },
      activeSortBy: undefined,
      prev: null,
      next: null,
    });
  });

  it("preserves service errors while keeping same-app fetches out of the loader", async () => {
    const error = new Error("private list failure");
    mockGetCachedBoundedSortedPageBlogList.mockRejectedValue(error);

    await expect(
      BlogListLoader({ sortby: "featured", page: 2 })
    ).rejects.toThrow(error);

    expect(mockGetCachedBoundedSortedPageBlogList).toHaveBeenCalledWith(
      "featured",
      2
    );
    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(mockGetBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BlogListView).not.toHaveBeenCalled();
  });
});

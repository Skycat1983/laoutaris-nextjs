import type { ReactElement } from "react";
import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { BlogListView } from "@/components/views/BlogListView";
import {
  getCachedDefaultFeaturedBlogList,
  getCachedDefaultLatestBlogList,
  getCachedDefaultPopularBlogList,
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

  it("renders later sorted pages from the direct server service without same-app fetches", async () => {
    const blogs = [createBlog("one"), createBlog("two")];
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
      sortby: "latest",
      page: 2,
    })) as ReactElement<{
      blogData: unknown;
      activeSortBy?: string;
      prev: string | null;
      next: string | null;
    }>;

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
      page: 2,
      limit: 10,
    });
    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultFeaturedBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultLatestBlogList).not.toHaveBeenCalled();
    expect(mockGetCachedDefaultPopularBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogListView);
    expect(element.props).toEqual({
      blogData: {
        single: {
          type: "latest",
          data: blogs,
        },
        metadata: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      },
      activeSortBy: "latest",
      prev: "/blog?sortby=latest&page=1",
      next: "/blog?sortby=latest&page=3",
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
    mockGetBlogList.mockRejectedValue(error);

    await expect(
      BlogListLoader({ sortby: "featured", page: 2 })
    ).rejects.toThrow(error);

    expect(mockGetCachedSortedFirstPageBlogList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BlogListView).not.toHaveBeenCalled();
  });
});

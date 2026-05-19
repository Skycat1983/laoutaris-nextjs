import type { ReactElement } from "react";
import { BlogListLoader } from "@/components/loaders/viewLoaders/BlogListLoader";
import { BlogListView } from "@/components/views/BlogListView";
import { getBlogList } from "@/lib/data/services/getBlogList";

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
}));

jest.mock("@/components/views/BlogListView", () => ({
  BlogListView: jest.fn(() => null),
}));

const mockGetBlogList = getBlogList as jest.MockedFunction<typeof getBlogList>;

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

  it("renders a single sorted list from the server service without same-app fetches", async () => {
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
    mockGetBlogList
      .mockResolvedValueOnce({
        success: true,
        data: featured,
        metadata: { page: 1, limit: 5, total: 1, totalPages: 1 },
      })
      .mockResolvedValueOnce({
        success: true,
        data: latest,
        metadata: { page: 1, limit: 6, total: 2, totalPages: 1 },
      })
      .mockResolvedValueOnce({
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

    expect(mockGetBlogList).toHaveBeenNthCalledWith(1, {
      sortby: "featured",
      page: 1,
      limit: 5,
    });
    expect(mockGetBlogList).toHaveBeenNthCalledWith(2, {
      sortby: "latest",
      page: 1,
      limit: 6,
    });
    expect(mockGetBlogList).toHaveBeenNthCalledWith(3, {
      sortby: "popular",
      page: 1,
      limit: 8,
    });
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
      BlogListLoader({ sortby: "featured", page: 1 })
    ).rejects.toThrow(error);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(BlogListView).not.toHaveBeenCalled();
  });
});

jest.mock("server-only", () => ({}), { virtual: true });

import { BlogModel } from "@/lib/data/models/blogModel";
import {
  getBlogList,
  isBlogListSortBy,
  type BlogListSortBy,
} from "@/lib/data/services/getBlogList";
import dbConnect from "@/lib/db/mongodb";
import { transformBlog } from "@/lib/transforms/blog/transformBlog";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/blogModel", () => ({
  BlogModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/blog/transformBlog", () => ({
  transformBlog: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockBlogFind = BlogModel.find as jest.Mock;
const mockBlogCountDocuments = BlogModel.countDocuments as jest.Mock;
const mockTransformBlogToFrontend = transformBlog.toFrontend as jest.Mock;

const createBlogListQuery = (result: unknown) => {
  const query = {
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.sort.mockReturnValue(query);
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

const createRejectedBlogListQuery = (error: unknown) => {
  const query = {
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.sort.mockReturnValue(query);
  query.skip.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  return query;
};

describe("getBlogList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockBlogCountDocuments.mockResolvedValue(12);
    mockTransformBlogToFrontend.mockImplementation((blog) => ({
      slug: blog.slug,
      title: blog.title,
      linkTo: `/blog/${blog.slug}`,
    }));
  });

  it.each<
    [
      BlogListSortBy,
      { filter: Record<string, unknown>; sort: Record<string, 1 | -1> },
    ]
  >([
    ["latest", { filter: {}, sort: { displayDate: -1 } }],
    ["oldest", { filter: {}, sort: { displayDate: 1 } }],
    ["popular", { filter: {}, sort: { comments: -1 } }],
    ["featured", { filter: { featured: true }, sort: { displayDate: -1 } }],
  ])(
    "uses MongoDB ownership, %s sorting/filtering, pagination, transforms, and metadata",
    async (sortby, expected) => {
      const rawBlogs = [
        { slug: `${sortby}-one`, title: "One" },
        { slug: `${sortby}-two`, title: "Two" },
      ];
      const query = createBlogListQuery(rawBlogs);
      mockBlogFind.mockReturnValue(query);

      await expect(
        getBlogList({ sortby, page: 2, limit: 5 })
      ).resolves.toEqual({
        success: true,
        data: [
          {
            slug: `${sortby}-one`,
            title: "One",
            linkTo: `/blog/${sortby}-one`,
          },
          {
            slug: `${sortby}-two`,
            title: "Two",
            linkTo: `/blog/${sortby}-two`,
          },
        ],
        metadata: {
          page: 2,
          limit: 5,
          total: 12,
          totalPages: 3,
        },
      });

      expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
        mockBlogFind.mock.invocationCallOrder[0]
      );
      expect(mockBlogFind).toHaveBeenCalledWith(expected.filter);
      expect(mockBlogCountDocuments).toHaveBeenCalledWith(expected.filter);
      expect(query.sort).toHaveBeenCalledWith(expected.sort);
      expect(query.skip).toHaveBeenCalledWith(5);
      expect(query.limit).toHaveBeenCalledWith(5);
      expect(mockTransformBlogToFrontend).toHaveBeenNthCalledWith(
        1,
        rawBlogs[0]
      );
      expect(mockTransformBlogToFrontend).toHaveBeenNthCalledWith(
        2,
        rawBlogs[1]
      );
    }
  );

  it("defaults to the existing latest page and limit behavior", async () => {
    const query = createBlogListQuery([]);
    mockBlogFind.mockReturnValue(query);
    mockBlogCountDocuments.mockResolvedValue(0);

    await expect(getBlogList()).resolves.toEqual({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });

    expect(mockBlogFind).toHaveBeenCalledWith({});
    expect(query.sort).toHaveBeenCalledWith({ displayDate: -1 });
    expect(query.skip).toHaveBeenCalledWith(0);
    expect(query.limit).toHaveBeenCalledWith(10);
  });

  it("rejects when blog list persistence fails", async () => {
    const error = new Error("private blog list");
    mockBlogFind.mockReturnValue(createRejectedBlogListQuery(error));

    await expect(getBlogList()).rejects.toThrow(error);

    expect(mockTransformBlogToFrontend).not.toHaveBeenCalled();
  });

  it("identifies supported public blog list sort values", () => {
    expect(isBlogListSortBy("latest")).toBe(true);
    expect(isBlogListSortBy("oldest")).toBe(true);
    expect(isBlogListSortBy("popular")).toBe(true);
    expect(isBlogListSortBy("featured")).toBe(true);
    expect(isBlogListSortBy("pinned")).toBe(false);
  });
});

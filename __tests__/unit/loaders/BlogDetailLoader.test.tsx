import type { ReactElement } from "react";
import { BlogDetailLoader } from "@/components/loaders/viewLoaders/BlogDetailLoader";
import { BlogDetail } from "@/components/views/BlogDetail";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";

jest.mock("@/lib/data/services/getBlogBySlugWithAuthor", () => ({
  getBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithComments", () => ({
  getBlogBySlugWithComments: jest.fn(),
}));

jest.mock("@/components/views/BlogDetail", () => ({
  BlogDetail: jest.fn(() => null),
}));

const mockGetBlogBySlugWithAuthor =
  getBlogBySlugWithAuthor as jest.MockedFunction<
    typeof getBlogBySlugWithAuthor
  >;
const mockGetBlogBySlugWithComments =
  getBlogBySlugWithComments as jest.MockedFunction<
    typeof getBlogBySlugWithComments
  >;

const blogWithAuthor = {
  slug: "gallery-news",
  title: "Gallery News",
} as never;

const blogWithComments = {
  slug: "gallery-news",
  title: "Gallery News",
  comments: [{ text: "A comment", author: { name: "Reader" } }],
} as never;

describe("BlogDetailLoader", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBlogBySlugWithAuthor.mockResolvedValue(blogWithAuthor);
    mockGetBlogBySlugWithComments.mockResolvedValue(blogWithComments);
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("renders the non-comments blog detail from the server service without same-app fetches or result logs", async () => {
    const element = (await BlogDetailLoader({
      slug: "gallery-news",
    })) as ReactElement<{
      blog: typeof blogWithAuthor;
      showComments: false;
    }>;

    expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogDetail);
    expect(element.props).toEqual({
      blog: blogWithAuthor,
      showComments: false,
    });
  });

  it("renders the comments blog detail from the comments service without same-app fetches or result logs", async () => {
    const element = (await BlogDetailLoader({
      slug: "gallery-news",
      showComments: true,
    })) as ReactElement<{
      blog: typeof blogWithComments;
      showComments: true;
    }>;

    expect(mockGetBlogBySlugWithComments).toHaveBeenCalledWith("gallery-news");
    expect(mockGetBlogBySlugWithAuthor).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogDetail);
    expect(element.props).toEqual({
      blog: blogWithComments,
      showComments: true,
    });
  });

  it("throws the existing not-found error when the selected service returns null", async () => {
    mockGetBlogBySlugWithAuthor.mockResolvedValue(null);

    await expect(BlogDetailLoader({ slug: "missing-blog" })).rejects.toThrow(
      "Blog entry not found"
    );

    expect(BlogDetail).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("preserves service errors while keeping same-app fetches out of the loader", async () => {
    const error = new Error("private blog failure");
    mockGetBlogBySlugWithComments.mockRejectedValue(error);

    await expect(
      BlogDetailLoader({ slug: "gallery-news", showComments: true })
    ).rejects.toThrow(error);

    expect(BlogDetail).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

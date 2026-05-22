import fs from "fs";
import path from "path";
import type { ReactElement } from "react";
import { BlogDetailLoader } from "@/components/loaders/viewLoaders/BlogDetailLoader";
import { BlogDetail } from "@/components/views/BlogDetail";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

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
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

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

    expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
    expect(mockGetBlogBySlugWithComments).toHaveBeenCalledWith("gallery-news");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogDetail);
    expect(element.props).toEqual({
      blog: blogWithComments,
      showComments: true,
    });
  });

  it("calls notFound when the primary blog detail service returns null", async () => {
    mockGetBlogBySlugWithAuthor.mockResolvedValue(null);

    await expect(
      BlogDetailLoader({ slug: "missing-blog" })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
    expect(BlogDetail).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("preserves primary service errors while keeping same-app fetches out of the loader", async () => {
    const error = new Error("private blog failure");
    mockGetBlogBySlugWithAuthor.mockRejectedValue(error);

    await expect(
      BlogDetailLoader({ slug: "gallery-news", showComments: true })
    ).rejects.toThrow(error);

    expect(BlogDetail).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.blog_detail.failed",
        component: "BlogDetailLoader",
        operation: "public.blog.detail_loader",
        slug: "gallery-news",
        showComments: true,
        error: {
          name: "Error",
          message: "private blog failure",
        },
      })
    );
  });

  it("renders the found blog without comments when comment loading fails", async () => {
    mockGetBlogBySlugWithComments.mockRejectedValue(
      new Error("private comments failure")
    );

    const element = (await BlogDetailLoader({
      slug: "gallery-news",
      showComments: true,
    })) as ReactElement<{
      blog: typeof blogWithAuthor;
      showComments: false;
    }>;

    expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
    expect(mockGetBlogBySlugWithComments).toHaveBeenCalledWith("gallery-news");
    expect(element.type).toBe(BlogDetail);
    expect(element.props).toEqual({
      blog: blogWithAuthor,
      showComments: false,
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.blog_detail.comments.failed",
        component: "BlogDetailLoader",
        operation: "public.blog.detail_loader",
        slug: "gallery-news",
        error: {
          name: "Error",
          message: "private comments failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/viewLoaders/BlogDetailLoader.tsx"
      ),
      "utf8"
    );

    const retiredPublicApiName = ["server", "PublicApi"].join("");

    expect(source).not.toMatch(
      new RegExp(`${retiredPublicApiName}|serverApi|fetch\\(`)
    );
  });
});

import type { ReactElement } from "react";
import { BlogSectionLoader } from "@/components/loaders/sectionLoaders/BlogSectionLoader";
import { BlogSection } from "@/components/sections/BlogSection";
import { getBlogList } from "@/lib/data/services/getBlogList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
}));

jest.mock("@/components/sections/BlogSection", () => ({
  BlogSection: jest.fn(() => null),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetBlogList = getBlogList as jest.MockedFunction<typeof getBlogList>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const createBlog = (slug: string) =>
  ({
    slug,
    title: slug,
    linkTo: `/blog/${slug}`,
  }) as never;

describe("BlogSectionLoader", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsNextError.mockReturnValue(false);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the latest four blogs through the server service without same-app fetches", async () => {
    const blogs = [
      createBlog("one"),
      createBlog("two"),
      createBlog("three"),
      createBlog("four"),
    ];
    mockGetBlogList.mockResolvedValue({
      success: true,
      data: blogs,
      metadata: {
        page: 1,
        limit: 4,
        total: 4,
        totalPages: 1,
      },
    });

    const element = (await BlogSectionLoader()) as ReactElement<{
      blogs: typeof blogs;
    }>;

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
      limit: 4,
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(BlogSection);
    expect(element.props).toEqual({ blogs });
  });

  it("returns null for non-Next loading failures", async () => {
    const error = new Error("private section failure");
    mockGetBlogList.mockRejectedValue(error);

    await expect(BlogSectionLoader()).resolves.toBeNull();

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.blog_section.failed",
        component: "BlogSectionLoader",
        operation: "public.blog_section.loader",
        error: {
          name: "Error",
          message: "private section failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
    expect(BlogSection).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetBlogList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(BlogSectionLoader()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

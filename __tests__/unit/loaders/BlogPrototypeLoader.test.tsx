import { getBlogPrototypeEntries } from "@/components/prototypes/home/BlogPrototypeLoader";
import { getBlogList } from "@/lib/data/services/getBlogList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
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
    subtitle: `${slug} subtitle`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
  }) as never;

describe("getBlogPrototypeEntries", () => {
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

  it("loads the latest prototype lead story and teaser cards through the blog service", async () => {
    const blogs = [
      createBlog("lead"),
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
        limit: 5,
        total: 5,
        totalPages: 1,
      },
    });

    await expect(getBlogPrototypeEntries()).resolves.toBe(blogs);

    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
      limit: 5,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty list for non-Next prototype loading failures", async () => {
    const error = new Error("private prototype blog failure");
    mockGetBlogList.mockRejectedValue(error);

    await expect(getBlogPrototypeEntries()).resolves.toEqual([]);

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.prototype.home.blog.failed",
        component: "BlogPrototypeLoader",
        operation: "prototype.home.blog.loader",
        error: {
          name: "Error",
          message: "private prototype blog failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetBlogList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(getBlogPrototypeEntries()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

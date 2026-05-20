import { getBiographyPrototypeArticles } from "@/components/prototypes/home/BiographyPrototypeLoader";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/data/services/getArticleList", () => ({
  getArticleList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const mockGetArticleList = getArticleList as jest.MockedFunction<
  typeof getArticleList
>;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;

const createArticle = (slug: string) =>
  ({
    slug,
    title: slug,
    subtitle: `${slug} subtitle`,
    imageUrl: `https://res.cloudinary.com/dzncmfirr/image/upload/${slug}.jpg`,
  }) as never;

describe("getBiographyPrototypeArticles", () => {
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

  it("loads biography article data through the server article service", async () => {
    const articles = [createArticle("early-years"), createArticle("later-years")];
    mockGetArticleList.mockResolvedValue({
      success: true,
      data: articles,
      metadata: {
        page: 1,
        limit: 5,
        total: 2,
        totalPages: 1,
      },
    });

    await expect(getBiographyPrototypeArticles()).resolves.toBe(articles);

    expect(mockGetArticleList).toHaveBeenCalledWith({
      section: "biography",
      fields: "title subtitle imageUrl slug",
      limit: 5,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty list when no biography articles exist", async () => {
    mockGetArticleList.mockResolvedValue(null);

    await expect(getBiographyPrototypeArticles()).resolves.toEqual([]);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty list for non-Next loading failures", async () => {
    const error = new Error("private biography failure");
    mockGetArticleList.mockRejectedValue(error);

    await expect(getBiographyPrototypeArticles()).resolves.toEqual([]);

    expect(mockIsNextError).toHaveBeenCalledWith(error);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.prototype.home.biography.failed",
        component: "BiographyPrototypeLoader",
        operation: "prototype.home.biography.loader",
        error: {
          name: "Error",
          message: "private biography failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rethrows Next control-flow errors", async () => {
    const error = new Error("NEXT_REDIRECT");
    mockGetArticleList.mockRejectedValue(error);
    mockIsNextError.mockReturnValue(true);

    await expect(getBiographyPrototypeArticles()).rejects.toThrow(error);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

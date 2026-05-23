import BiographyPage from "@/app/biography/page";
import { getCachedBiographyNavigationList } from "@/lib/data/services/getCachedBiographyArticleData";
import type {
  ArticleNavDataFrontend,
  ListResult,
} from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  BIOGRAPHY_CACHE_REVALIDATE_SECONDS: 600,
  getCachedBiographyNavigationList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetCachedBiographyNavigationList =
  getCachedBiographyNavigationList as jest.MockedFunction<
    typeof getCachedBiographyNavigationList
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;

const createArticleNavItem = (
  slug: string,
  title: string
): ArticleNavDataFrontend => ({
  _id: `article-${slug}`,
  title,
  slug,
});

const createArticleNavResult = (
  data: ArticleNavDataFrontend[]
): ListResult<ArticleNavDataFrontend> => ({
  success: true,
  data,
  metadata: {
    page: 1,
    limit: data.length,
    total: data.length,
    totalPages: data.length ? 1 : 0,
  },
});

describe("/biography page", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockIsNextError.mockReturnValue(false);
    mockGetCachedBiographyNavigationList.mockResolvedValue(
      createArticleNavResult([
        createArticleNavItem("early-life", "Early Life"),
        createArticleNavItem("studio-years", "Studio Years"),
      ])
    );
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("redirects to the first biography article through the cached server data service", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);

    await expect(BiographyPage()).rejects.toThrow(redirectError);

    expect(mockGetCachedBiographyNavigationList).toHaveBeenCalledWith();
    expect(mockRedirect).toHaveBeenCalledWith("/biography/early-life");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("throws the existing no-results error when no biography articles exist", async () => {
    mockGetCachedBiographyNavigationList.mockResolvedValue(null);

    await expect(BiographyPage()).rejects.toThrow(
      "No biography articles found"
    );

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.biography_redirect.failed",
        route: "/biography",
        operation: "public.biography.default_redirect",
        error: {
          name: "Error",
          message: "No biography articles found",
        },
      })
    );
  });

  it("logs a structured error when navigation loading fails", async () => {
    const error = new Error("navigation failed");
    mockGetCachedBiographyNavigationList.mockRejectedValue(error);

    await expect(BiographyPage()).rejects.toThrow(error);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "page.public.biography_redirect.failed",
        error: {
          name: "Error",
          message: "navigation failed",
        },
      })
    );
  });
});

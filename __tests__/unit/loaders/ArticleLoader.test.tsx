import fs from "fs";
import path from "path";
import type { ReactElement } from "react";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import { ArticleView } from "@/components/views/ArticleView";
import {
  getCachedBiographyArticleBySlug,
  getCachedBiographyNavigationList,
} from "@/lib/data/services/getCachedBiographyArticleData";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import type {
  ArticleNavDataFrontend,
  ListResult,
} from "@/lib/data/types";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  getCachedBiographyArticleBySlug: jest.fn(),
  getCachedBiographyNavigationList: jest.fn(),
}));

jest.mock("@/lib/data/services/getArticleBySlugPopulated", () => ({
  getArticleBySlugPopulated: jest.fn(),
}));

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

jest.mock("@/components/views/ArticleView", () => ({
  ArticleView: jest.fn(() => null),
}));

const mockGetArticleBySlugPopulated =
  getArticleBySlugPopulated as jest.MockedFunction<
    typeof getArticleBySlugPopulated
  >;
const mockGetCachedBiographyArticleBySlug =
  getCachedBiographyArticleBySlug as jest.MockedFunction<
    typeof getCachedBiographyArticleBySlug
  >;
const mockGetCachedBiographyNavigationList =
  getCachedBiographyNavigationList as jest.MockedFunction<
    typeof getCachedBiographyNavigationList
  >;
const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

const article = {
  _id: "article-1",
  title: "Current Article",
  slug: "current",
} as never;

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

describe("ArticleLoader", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArticleBySlugPopulated.mockResolvedValue(article);
    mockGetCachedBiographyArticleBySlug.mockResolvedValue(article);
    mockGetArticleNavigationList.mockResolvedValue(
      createArticleNavResult([
        createArticleNavItem("previous", "Previous"),
        createArticleNavItem("current", "Current"),
        createArticleNavItem("next", "Next"),
      ])
    );
    mockGetCachedBiographyNavigationList.mockResolvedValue(
      createArticleNavResult([
        createArticleNavItem("previous", "Previous"),
        createArticleNavItem("current", "Current"),
        createArticleNavItem("next", "Next"),
      ])
    );
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("builds biography previous and next links from cached server services without same-app navigation fetches", async () => {
    const form = <form aria-label="Contact form" />;
    const element = (await ArticleLoader({
      slug: "current",
      section: "biography",
      form,
    })) as ReactElement<{
      article: typeof article;
      navigation: {
        prev: string | null;
        next: string | null;
      };
      form: typeof form;
    }>;

    expect(mockGetCachedBiographyArticleBySlug).toHaveBeenCalledWith("current");
    expect(mockGetCachedBiographyNavigationList).toHaveBeenCalledWith();
    expect(mockGetArticleBySlugPopulated).not.toHaveBeenCalled();
    expect(mockGetArticleNavigationList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(ArticleView);
    expect(element.props).toEqual({
      article,
      navigation: {
        prev: "/biography/previous",
        next: "/biography/next",
      },
      form,
    });
  });

  it("preserves null previous and next links at navigation boundaries", async () => {
    mockGetArticleNavigationList.mockResolvedValue(
      createArticleNavResult([createArticleNavItem("only", "Only Article")])
    );

    const element = (await ArticleLoader({
      slug: "only",
      section: "project",
    })) as ReactElement<{
      navigation: {
        prev: string | null;
        next: string | null;
      };
    }>;

    expect(element.props.navigation).toEqual({
      prev: null,
      next: null,
    });
    expect(mockGetArticleBySlugPopulated).toHaveBeenCalledWith("only");
    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("project");
    expect(mockGetCachedBiographyArticleBySlug).not.toHaveBeenCalled();
    expect(mockGetCachedBiographyNavigationList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders a found article with empty navigation when navigation has no articles", async () => {
    mockGetCachedBiographyNavigationList.mockResolvedValue(null);

    const element = (await ArticleLoader({
      slug: "current",
      section: "biography",
    })) as ReactElement<{
      navigation: {
        prev: string | null;
        next: string | null;
      };
    }>;

    expect(element.props.navigation).toEqual({
      prev: null,
      next: null,
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.article_navigation.failed",
        component: "ArticleLoader",
        operation: "public.article.loader",
        slug: "current",
        section: "biography",
        reason: "No articles found",
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls notFound when the detail service returns null", async () => {
    mockGetCachedBiographyArticleBySlug.mockResolvedValue(null);

    await expect(
      ArticleLoader({ slug: "missing", section: "biography" })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetCachedBiographyNavigationList).not.toHaveBeenCalled();
    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts article detail service errors to the existing message", async () => {
    mockGetCachedBiographyArticleBySlug.mockRejectedValue(
      new Error("private article failure")
    );

    await expect(
      ArticleLoader({ slug: "current", section: "biography" })
    ).rejects.toThrow("Failed to fetch article");

    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.article_detail.failed",
        component: "ArticleLoader",
        operation: "public.article.loader",
        slug: "current",
        section: "biography",
        error: {
          name: "Error",
          message: "private article failure",
        },
      })
    );
    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("renders a found article with empty navigation when navigation loading fails", async () => {
    mockGetCachedBiographyNavigationList.mockRejectedValue(
      new Error("private navigation failure")
    );

    const element = (await ArticleLoader({
      slug: "current",
      section: "biography",
    })) as ReactElement<{
      navigation: {
        prev: string | null;
        next: string | null;
      };
    }>;

    expect(mockGetCachedBiographyArticleBySlug).toHaveBeenCalledWith("current");
    expect(element.props.navigation).toEqual({
      prev: null,
      next: null,
    });
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.article_navigation.failed",
        component: "ArticleLoader",
        operation: "public.article.loader",
        slug: "current",
        section: "biography",
        error: {
          name: "Error",
          message: "private navigation failure",
        },
      })
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies", () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/viewLoaders/ArticleLoader.tsx"
      ),
      "utf8"
    );

    const retiredPublicApiName = ["server", "PublicApi"].join("");

    expect(source).not.toMatch(
      new RegExp(`${retiredPublicApiName}|serverApi|fetch\\(`)
    );
  });
});

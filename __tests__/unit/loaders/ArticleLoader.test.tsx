import type { ReactElement } from "react";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import { ArticleView } from "@/components/views/ArticleView";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";

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
const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;

const article = {
  _id: "article-1",
  title: "Current Article",
  slug: "current",
} as never;

describe("ArticleLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArticleBySlugPopulated.mockResolvedValue(article);
    mockGetArticleNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Previous",
          slug: "previous",
          linkTo: "/previous",
        },
        {
          title: "Current",
          slug: "current",
          linkTo: "/current",
        },
        {
          title: "Next",
          slug: "next",
          linkTo: "/next",
        },
      ],
      metadata: {
        page: 1,
        limit: 3,
        total: 3,
        totalPages: 1,
      },
    });
  });

  it("builds previous and next links from the server navigation service without same-app navigation fetches", async () => {
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

    expect(mockGetArticleBySlugPopulated).toHaveBeenCalledWith("current");
    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
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
    mockGetArticleNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Only Article",
          slug: "only",
          linkTo: "/only",
        },
      ],
      metadata: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    });

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
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing no-results error when navigation has no articles", async () => {
    mockGetArticleNavigationList.mockResolvedValue(null);

    await expect(
      ArticleLoader({ slug: "current", section: "biography" })
    ).rejects.toThrow("No articles found");

    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the existing article not-found error when the detail service returns null", async () => {
    mockGetArticleBySlugPopulated.mockResolvedValue(null);

    await expect(
      ArticleLoader({ slug: "missing", section: "biography" })
    ).rejects.toThrow("Article not found");

    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts article detail service errors to the existing message", async () => {
    mockGetArticleBySlugPopulated.mockRejectedValue(
      new Error("private article failure")
    );

    await expect(
      ArticleLoader({ slug: "current", section: "biography" })
    ).rejects.toThrow("Failed to fetch article");

    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("continues fetching article detail while converting navigation service errors to the existing message", async () => {
    mockGetArticleNavigationList.mockRejectedValue(
      new Error("private navigation failure")
    );

    await expect(
      ArticleLoader({ slug: "current", section: "biography" })
    ).rejects.toThrow("Failed to fetch article navigation");

    expect(mockGetArticleBySlugPopulated).toHaveBeenCalledWith("current");
    expect(ArticleView).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

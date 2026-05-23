import type { ReactElement } from "react";
import { BiographySubnavLoader } from "@/components/loaders/componentLoaders/BiographySubnavLoader";
import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { getCachedBiographyNavigationList } from "@/lib/data/services/getCachedBiographyArticleData";
import type {
  ArticleNavDataFrontend,
  ListResult,
} from "@/lib/data/types";

jest.mock("@/lib/data/services/getCachedBiographyArticleData", () => ({
  getCachedBiographyNavigationList: jest.fn(),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  Subnav: jest.fn(() => null),
}));

const mockGetCachedBiographyNavigationList =
  getCachedBiographyNavigationList as jest.MockedFunction<
    typeof getCachedBiographyNavigationList
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

describe("BiographySubnavLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCachedBiographyNavigationList.mockResolvedValue(
      createArticleNavResult([
        createArticleNavItem("early-life", "Early Life"),
        createArticleNavItem("studio-years", "Studio Years"),
      ])
    );
  });

  it("loads biography links through the cached server data service without same-app fetches", async () => {
    const element = (await BiographySubnavLoader()) as ReactElement<{
      links: Array<{
        label: string;
        slug: string;
        link_to: string;
        disabled: false;
      }>;
    }>;

    expect(mockGetCachedBiographyNavigationList).toHaveBeenCalledWith();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(Subnav);
    expect(element.props.links).toEqual([
      {
        label: "Early Life",
        slug: "early-life",
        link_to: "/biography/early-life",
        disabled: false,
      },
      {
        label: "Studio Years",
        slug: "studio-years",
        link_to: "/biography/studio-years",
        disabled: false,
      },
    ]);
  });

  it("throws the existing no-results error when the service returns null", async () => {
    mockGetCachedBiographyNavigationList.mockResolvedValue(null);

    await expect(BiographySubnavLoader()).rejects.toThrow("No articles found");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });
});

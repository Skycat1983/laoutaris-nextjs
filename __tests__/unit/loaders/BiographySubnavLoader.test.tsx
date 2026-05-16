import type { ReactElement } from "react";
import { BiographySubnavLoader } from "@/components/loaders/componentLoaders/BiographySubnavLoader";
import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

jest.mock("@/components/modules/navigation/subnav/Subnav", () => ({
  Subnav: jest.fn(() => null),
}));

const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;

describe("BiographySubnavLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArticleNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Early Life",
          slug: "early-life",
          linkTo: "/early-life",
        },
        {
          title: "Studio Years",
          slug: "studio-years",
          linkTo: "/studio",
        },
      ],
      metadata: {
        page: 1,
        limit: 2,
        total: 2,
        totalPages: 1,
      },
    });
  });

  it("loads biography links through the server data service without same-app fetches", async () => {
    const element = (await BiographySubnavLoader()) as ReactElement<{
      links: Array<{
        label: string;
        slug: string;
        link_to: string;
        disabled: false;
      }>;
    }>;

    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
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
    mockGetArticleNavigationList.mockResolvedValue(null);

    await expect(BiographySubnavLoader()).rejects.toThrow("No articles found");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(Subnav).not.toHaveBeenCalled();
  });
});

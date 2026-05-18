import type { ReactElement } from "react";
import { MainNavLoader } from "@/components/loaders/componentLoaders/MainNavLoader";
import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

jest.mock("@/components/modules/navigation/mainNav/MainNav", () => ({
  MainNav: jest.fn(() => null),
}));

const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;
const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;

describe("MainNavLoader", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockGetArticleNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Early Life",
          slug: "early-life",
          linkTo: "/early-life",
        },
      ],
      metadata: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    });
    mockGetCollectionNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Paintings",
          slug: "paintings",
          firstArtworkId: "artwork-1",
          hasArtwork: true,
        },
      ],
      metadata: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("loads main navigation links through server data services without same-app fetches", async () => {
    const element = (await MainNavLoader()) as ReactElement<{
      navLinks: Array<{
        label: string;
        path: string;
      }>;
    }>;

    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
    expect(mockGetCollectionNavigationList).toHaveBeenCalledWith();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(MainNav);
    expect(element.props.navLinks).toEqual([
      { label: "Artwork", path: "/artwork" },
      { label: "Biography", path: "/biography/early-life" },
      {
        label: "Collections",
        path: "/collections/paintings/artwork-1",
      },
      { label: "Blog", path: "/blog" },
      { label: "Project", path: "/project/about" },
      { label: "Shop", path: "/shop" },
    ]);
  });

  it("preserves the collection path fallback when the first collection has no artwork", async () => {
    mockGetCollectionNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Drawings",
          slug: "drawings",
          firstArtworkId: null,
          hasArtwork: false,
        },
      ],
      metadata: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    });

    const element = (await MainNavLoader()) as ReactElement<{
      navLinks: Array<{
        label: string;
        path: string;
      }>;
    }>;

    expect(element.props.navLinks[2]).toEqual({
      label: "Collections",
      path: "/collections/drawings",
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("logs a structured error when article navigation is empty", async () => {
    mockGetArticleNavigationList.mockResolvedValue(null);

    await expect(MainNavLoader()).resolves.toBeUndefined();

    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        event: "loader.public.main_nav.failed",
        component: "MainNavLoader",
        operation: "public.main_nav.loader",
        error: {
          name: "Error",
          message: "No articles found",
        },
      })
    );
    expect(MainNav).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

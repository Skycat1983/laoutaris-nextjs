import type { ReactElement } from "react";
import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { getCachedDefaultArtworkListPage } from "@/lib/data/services/getCachedArtworkListData";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

jest.mock("@/lib/data/services/getCachedArtworkListData", () => ({
  getCachedDefaultArtworkListPage: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkList", () => ({
  getArtworkList: jest.fn(),
}));

jest.mock("@/components/artwork/ArtworkGallery", () => ({
  ArtworkGallery: jest.fn(() => null),
}));

const mockGetArtworkList = getArtworkList as jest.MockedFunction<
  typeof getArtworkList
>;
const mockGetCachedDefaultArtworkListPage =
  getCachedDefaultArtworkListPage as jest.MockedFunction<
    typeof getCachedDefaultArtworkListPage
  >;

const artwork = {
  _id: "artwork-1",
  title: "Artwork 1",
} as never;

describe("ArtworkListLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const listResult = {
      success: true,
      data: [artwork],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    } as never;

    mockGetArtworkList.mockResolvedValue(listResult);
    mockGetCachedDefaultArtworkListPage.mockResolvedValue(listResult);
  });

  it("loads initial artworks through the server data service without same-app fetches", async () => {
    const initialSort = {
      by: "colorProximity" as const,
      color: "#111111",
    };
    const initialFilters = {
      decade: ["1970s" as const],
      filterMode: "ALL" as const,
      page: 1,
    };

    const element = (await ArtworkListLoader({
      initialSort,
      initialFilters,
    })) as ReactElement<{
      startingArtworks: typeof artwork[];
      paginationMetadata: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      sortDefaults: typeof initialSort;
      filterDefaults: typeof initialFilters;
    }>;

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      ...initialFilters,
      filterMode: "ALL",
      sortBy: "colorProximity",
      sortColor: "#111111",
    });
    expect(mockGetCachedDefaultArtworkListPage).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(ArtworkGallery);
    expect(element.props).toEqual({
      startingArtworks: [artwork],
      paginationMetadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
      sortDefaults: initialSort,
      filterDefaults: initialFilters,
    });
  });

  it("uses the cached wrapper when the loader receives no filters", async () => {
    await ArtworkListLoader({});

    expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledTimes(1);
    expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledWith(1);
    expect(mockGetArtworkList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("uses the cached page 1 wrapper for the exact default artwork browse shape", async () => {
    await ArtworkListLoader({
      initialSort: {
        by: "mostRecent",
        color: undefined,
      },
      initialFilters: {
        decade: [],
        artstyle: [],
        medium: [],
        surface: [],
        filterMode: "ALL",
        page: 1,
        limit: 10,
      },
    });

    expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledTimes(1);
    expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledWith(1);
    expect(mockGetArtworkList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    2,
    3,
    4,
    5,
  ])(
    "uses the bounded cached wrapper for exact default artwork browse page %s",
    async (page) => {
      await ArtworkListLoader({
        initialSort: {
          by: "mostRecent",
          color: undefined,
        },
        initialFilters: {
          decade: [],
          artstyle: [],
          medium: [],
          surface: [],
          filterMode: "ALL",
          page,
          limit: 10,
        },
      });

      expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledTimes(1);
      expect(mockGetCachedDefaultArtworkListPage).toHaveBeenCalledWith(page);
      expect(mockGetArtworkList).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    }
  );

  it.each([
    [
      "page 6",
      {
        initialSort: { by: "mostRecent" as const },
        initialFilters: { filterMode: "ALL" as const, page: 6, limit: 10 },
      },
    ],
    [
      "non-default limit",
      {
        initialSort: { by: "mostRecent" as const },
        initialFilters: { filterMode: "ALL" as const, page: 1, limit: 20 },
      },
    ],
    [
      "mostPopular sorting",
      {
        initialSort: { by: "mostPopular" as const },
        initialFilters: { filterMode: "ALL" as const, page: 1, limit: 10 },
      },
    ],
    [
      "mostFeatured sorting",
      {
        initialSort: { by: "mostFeatured" as const },
        initialFilters: { filterMode: "ALL" as const, page: 1, limit: 10 },
      },
    ],
    [
      "color proximity sorting",
      {
        initialSort: { by: "colorProximity" as const, color: "#111111" },
        initialFilters: { filterMode: "ALL" as const, page: 1, limit: 10 },
      },
    ],
    [
      "unexpected sortColor",
      {
        initialSort: { by: "mostRecent" as const, color: "#111111" },
        initialFilters: { filterMode: "ALL" as const, page: 1, limit: 10 },
      },
    ],
    [
      "ANY filter mode",
      {
        initialSort: { by: "mostRecent" as const },
        initialFilters: { filterMode: "ANY" as const, page: 1, limit: 10 },
      },
    ],
    [
      "taxonomy filters",
      {
        initialSort: { by: "mostRecent" as const },
        initialFilters: {
          decade: ["1970s" as const],
          filterMode: "ALL" as const,
          page: 1,
          limit: 10,
        },
      },
    ],
  ])("keeps %s on the direct artwork list service", async (_label, props) => {
    await ArtworkListLoader(props);

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      ...props.initialFilters,
      filterMode: props.initialFilters.filterMode,
      sortBy: props.initialSort.by,
      sortColor: props.initialSort.color,
    });
    expect(mockGetCachedDefaultArtworkListPage).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

import type { ReactElement } from "react";
import { ArtworkListLoader } from "@/components/loaders/viewLoaders/ArtworkListLoader";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

jest.mock("@/lib/data/services/getArtworkList", () => ({
  getArtworkList: jest.fn(),
}));

jest.mock("@/components/artwork/ArtworkGallery", () => ({
  ArtworkGallery: jest.fn(() => null),
}));

const mockGetArtworkList = getArtworkList as jest.MockedFunction<
  typeof getArtworkList
>;

const artwork = {
  _id: "artwork-1",
  title: "Artwork 1",
} as never;

describe("ArtworkListLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArtworkList.mockResolvedValue({
      success: true,
      data: [artwork],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
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
      initialArtworks: typeof artwork[];
      initialSort: typeof initialSort;
      initialFilters: typeof initialFilters;
    }>;

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      ...initialFilters,
      filterMode: "ALL",
      sortBy: "colorProximity",
      sortColor: "#111111",
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(ArtworkGallery);
    expect(element.props).toEqual({
      initialArtworks: [artwork],
      initialSort,
      initialFilters,
    });
  });

  it("defaults filter mode when the loader receives no filters", async () => {
    await ArtworkListLoader({});

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      filterMode: "ALL",
      sortBy: undefined,
      sortColor: undefined,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

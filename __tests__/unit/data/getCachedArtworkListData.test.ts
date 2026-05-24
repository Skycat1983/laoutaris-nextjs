jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS,
  getCachedDefaultArtworkList,
  getCachedDefaultArtworkListPage,
  getCachedDefaultArtworkListPage2,
  getCachedDefaultArtworkListPage3,
  getCachedDefaultArtworkListPage4,
  getCachedDefaultArtworkListPage5,
} from "@/lib/data/services/getCachedArtworkListData";
import { getArtworkList } from "@/lib/data/services/getArtworkList";

jest.mock("@/lib/data/services/getArtworkList", () => ({
  getArtworkList: jest.fn(),
}));

const mockGetArtworkList = getArtworkList as jest.MockedFunction<
  typeof getArtworkList
>;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

describe("cached artwork list data services", () => {
  beforeEach(() => {
    mockGetArtworkList.mockClear();
  });

  it("wraps only the bounded default artwork list reads with fixed keys and a 10-minute stale window", () => {
    expect(ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(5);
    expect(mockUnstableCache.mock.calls.map(([, key]) => key)).toEqual([
      ["public-artwork-default-list-page-1-limit-10-most-recent"],
      ["public-artwork-default-list-page-2-limit-10-most-recent"],
      ["public-artwork-default-list-page-3-limit-10-most-recent"],
      ["public-artwork-default-list-page-4-limit-10-most-recent"],
      ["public-artwork-default-list-page-5-limit-10-most-recent"],
    ]);
    expect(mockUnstableCache.mock.calls.map(([, , options]) => options)).toEqual(
      Array.from({ length: 5 }, () => ({ revalidate: 600 }))
    );
  });

  it("delegates page 1 through the existing fixed default browse wrapper", async () => {
    const result = {
      success: true,
      data: [{ _id: "artwork-1", title: "Artwork 1" }],
      metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    mockGetArtworkList.mockResolvedValue(result as never);

    await expect(getCachedDefaultArtworkList()).resolves.toBe(result);

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      sortBy: "mostRecent",
      page: 1,
      limit: 10,
      filterMode: "ALL",
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
    });
  });

  it.each([
    [2, getCachedDefaultArtworkListPage2],
    [3, getCachedDefaultArtworkListPage3],
    [4, getCachedDefaultArtworkListPage4],
    [5, getCachedDefaultArtworkListPage5],
  ])(
    "delegates fixed default browse page %s to the direct artwork list service",
    async (page, cachedWrapper) => {
      const result = {
        success: true,
        data: [{ _id: `artwork-${page}`, title: `Artwork ${page}` }],
        metadata: { page, limit: 10, total: 50, totalPages: 5 },
      };
      mockGetArtworkList.mockResolvedValue(result as never);

      await expect(cachedWrapper()).resolves.toBe(result);

      expect(mockGetArtworkList).toHaveBeenCalledWith({
        sortBy: "mostRecent",
        page,
        limit: 10,
        filterMode: "ALL",
        decade: [],
        artstyle: [],
        medium: [],
        surface: [],
      });
    }
  );

  it("dispatches only the fixed default artwork pages 1-5", async () => {
    const result = {
      success: true,
      data: [],
      metadata: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
    mockGetArtworkList.mockResolvedValue(result as never);

    await expect(getCachedDefaultArtworkListPage(1)).resolves.toBe(result);
    await expect(getCachedDefaultArtworkListPage(2)).resolves.toBe(result);
    await expect(getCachedDefaultArtworkListPage(5)).resolves.toBe(result);

    expect(getCachedDefaultArtworkListPage(0)).toBeUndefined();
    expect(getCachedDefaultArtworkListPage(6)).toBeUndefined();
  });
});

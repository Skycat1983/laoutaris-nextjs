jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS,
  getCachedDefaultArtworkList,
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

  it("wraps the default artwork list read with a fixed key and 10-minute stale window", () => {
    expect(ARTWORK_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(1);
    expect(mockUnstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["public-artwork-default-list-page-1-limit-10-most-recent"],
      { revalidate: 600 }
    );
  });

  it("delegates only the fixed default browse shape to the direct artwork list service", async () => {
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
});

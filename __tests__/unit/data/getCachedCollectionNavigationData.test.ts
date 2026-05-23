jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS,
  getCachedCollectionNavigationList,
} from "@/lib/data/services/getCachedCollectionNavigationData";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

describe("cached collection navigation data services", () => {
  beforeEach(() => {
    mockGetCollectionNavigationList.mockClear();
  });

  it("wraps collection navigation reads with a 10-minute stale window", () => {
    expect(COLLECTION_NAVIGATION_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(1);
    expect(mockUnstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["public-collection-navigation"],
      { revalidate: 600 }
    );
  });

  it("delegates navigation reads to the direct collection navigation service", async () => {
    const result = {
      success: true,
      data: [{ slug: "paintings", title: "Paintings" }],
      metadata: { page: 1, limit: 1, total: 1, totalPages: 1 },
    };
    mockGetCollectionNavigationList.mockResolvedValue(result as never);

    await expect(getCachedCollectionNavigationList()).resolves.toBe(result);

    expect(mockGetCollectionNavigationList).toHaveBeenCalledWith();
  });
});

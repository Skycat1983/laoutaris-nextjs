jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  BIOGRAPHY_CACHE_REVALIDATE_SECONDS,
  getCachedBiographyArticleBySlug,
  getCachedBiographyNavigationList,
} from "@/lib/data/services/getCachedBiographyArticleData";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";

jest.mock("@/lib/data/services/getArticleBySlugPopulated", () => ({
  getArticleBySlugPopulated: jest.fn(),
}));

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

const mockGetArticleBySlugPopulated =
  getArticleBySlugPopulated as jest.MockedFunction<
    typeof getArticleBySlugPopulated
  >;
const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

describe("cached biography article data services", () => {
  beforeEach(() => {
    mockGetArticleBySlugPopulated.mockClear();
    mockGetArticleNavigationList.mockClear();
  });

  it("wraps biography article detail and navigation reads with a 10-minute stale window", () => {
    expect(BIOGRAPHY_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(2);
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      ["public-biography-article-detail"],
      { revalidate: 600 }
    );
    expect(mockUnstableCache).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      ["public-biography-article-navigation"],
      { revalidate: 600 }
    );
  });

  it("delegates article detail reads to the populated article service", async () => {
    const article = { slug: "studio-notes", title: "Studio Notes" };
    mockGetArticleBySlugPopulated.mockResolvedValue(article as never);

    await expect(
      getCachedBiographyArticleBySlug("studio-notes")
    ).resolves.toBe(article);

    expect(mockGetArticleBySlugPopulated).toHaveBeenCalledWith("studio-notes");
    expect(mockGetArticleNavigationList).not.toHaveBeenCalled();
  });

  it("delegates navigation reads to the biography article navigation service path", async () => {
    const result = {
      success: true,
      data: [{ slug: "studio-notes", title: "Studio Notes" }],
      metadata: { page: 1, limit: 1, total: 1, totalPages: 1 },
    };
    mockGetArticleNavigationList.mockResolvedValue(result as never);

    await expect(getCachedBiographyNavigationList()).resolves.toBe(result);

    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
    expect(mockGetArticleBySlugPopulated).not.toHaveBeenCalled();
  });
});

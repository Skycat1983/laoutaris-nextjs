jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((callback) => callback),
}));

import { unstable_cache } from "next/cache";
import {
  BLOG_PRIMARY_CACHE_REVALIDATE_SECONDS,
  getCachedBlogBySlugWithAuthor,
} from "@/lib/data/services/getCachedBlogPrimaryData";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";

jest.mock("@/lib/data/services/getBlogBySlugWithAuthor", () => ({
  getBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithComments", () => ({
  getBlogBySlugWithComments: jest.fn(),
}));

const mockGetBlogBySlugWithAuthor =
  getBlogBySlugWithAuthor as jest.MockedFunction<
    typeof getBlogBySlugWithAuthor
  >;
const mockGetBlogBySlugWithComments =
  getBlogBySlugWithComments as jest.MockedFunction<
    typeof getBlogBySlugWithComments
  >;
const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

describe("cached blog primary data services", () => {
  beforeEach(() => {
    mockGetBlogBySlugWithAuthor.mockClear();
    mockGetBlogBySlugWithComments.mockClear();
  });

  it("wraps primary blog detail reads with a 10-minute stale window", () => {
    expect(BLOG_PRIMARY_CACHE_REVALIDATE_SECONDS).toBe(600);
    expect(unstable_cache).toHaveBeenCalledTimes(1);
    expect(mockUnstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ["public-blog-primary-detail"],
      { revalidate: 600 }
    );
  });

  it("delegates primary blog detail reads to the author service without comments service reads", async () => {
    const blog = { slug: "gallery-news", title: "Gallery News" };
    mockGetBlogBySlugWithAuthor.mockResolvedValue(blog as never);

    await expect(
      getCachedBlogBySlugWithAuthor("gallery-news")
    ).resolves.toBe(blog);

    expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
    expect(mockGetBlogBySlugWithComments).not.toHaveBeenCalled();
  });
});

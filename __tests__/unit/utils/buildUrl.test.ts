import { buildUrl, type UrlParams } from "@/lib/utils/buildUrl";

type UrlTestCase = UrlParams & {
  expected: string;
  description?: string;
};

describe("buildUrl", () => {
  // Test cases with just path segments
  const pathTestCases: UrlTestCase[] = [
    {
      segments: ["api", "users"],
      expected: "/api/users",
      description: "basic API endpoint",
    },
    {
      segments: ["blog", "posts", "123"],
      expected: "/blog/posts/123",
      description: "nested resource path",
    },
    {
      segments: [],
      expected: "/",
      description: "root path",
    },
  ];

  // Test cases with query parameters
  const queryTestCases: UrlTestCase[] = [
    {
      segments: ["api", "search"],
      query: { q: "test", page: "1" },
      expected: "/api/search?q=test&page=1",
      description: "search with pagination",
    },
    {
      segments: ["products"],
      query: { category: "books", sort: "price" },
      expected: "/products?category=books&sort=price",
      description: "filtered products",
    },
  ];

  // Test path segments only
  test.each(pathTestCases)(
    "builds URL: $description",
    ({ segments, expected }) => {
      expect(buildUrl({ segments })).toBe(expected);
    }
  );

  // Test with query parameters
  test.each(queryTestCases)(
    "builds URL with query: $description",
    ({ segments, query, expected }) => {
      expect(buildUrl({ segments, query })).toBe(expected);
    }
  );
});

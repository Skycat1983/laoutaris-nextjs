import {
  buildUrl,
  buildArtworkSearchUrl,
  type UrlParams,
  type ArtworkSearchParams,
} from "@/lib/utils/urlUtils";

describe("buildUrl", () => {
  describe("array signature (backward compatibility)", () => {
    test.each([
      {
        segments: ["api", "users"],
        expected: "/api/users",
        description: "builds basic path with multiple segments",
      },
      {
        segments: ["products"],
        expected: "/products",
        description: "builds path with single segment",
      },
      {
        segments: [],
        expected: "/",
        description: "handles empty segments array",
      },
    ])("$description", ({ segments, expected }) => {
      expect(buildUrl(segments)).toBe(expected);
    });
  });

  describe("object signature", () => {
    type BuildUrlTestCase = UrlParams & {
      expected: string;
      description: string;
    };

    const testCases: BuildUrlTestCase[] = [
      {
        segments: ["api", "users"],
        expected: "/api/users",
        description: "builds basic path with multiple segments",
      },
      {
        segments: ["products"],
        expected: "/products",
        description: "builds path with single segment",
      },
      {
        segments: ["search"],
        query: { q: "test", page: "1" },
        expected: "/search?q=test&page=1",
        description: "builds path with query parameters",
      },
      {
        segments: ["api", "users", "123"],
        query: { include: "details" },
        expected: "/api/users/123?include=details",
        description: "builds path with segments and single query parameter",
      },
      {
        segments: [],
        expected: "/",
        description: "handles empty segments array",
      },
    ];

    test.each(testCases)("$description", ({ segments, query, expected }) => {
      expect(buildUrl({ segments, query })).toBe(expected);
    });
  });
});

describe("buildArtworkSearchUrl", () => {
  type ArtworkSearchTestCase = ArtworkSearchParams & {
    expected: string;
    description: string;
  };

  const testCases: ArtworkSearchTestCase[] = [
    {
      expected: "/artwork?",
      description: "builds base URL with no parameters",
    },
    {
      sortBy: "date",
      expected: "/artwork?sortBy=date",
      description: "builds URL with sort parameter",
    },
    {
      sortColor: "#FF0000",
      expected: "/artwork?sortColor=%23FF0000",
      description: "builds URL with color parameter",
    },
    {
      filterMode: "recent",
      expected: "/artwork?filterMode=recent",
      description: "builds URL with filter parameter",
    },
    {
      sortBy: "date",
      sortColor: "#FF0000",
      filterMode: "recent",
      expected: "/artwork?sortBy=date&sortColor=%23FF0000&filterMode=recent",
      description: "builds URL with all parameters",
    },
  ];

  test.each(testCases)("$description", (testCase) => {
    const { expected, description, ...params } = testCase;
    expect(buildArtworkSearchUrl(params)).toBe(expected);
  });

  test("omits undefined or null values", () => {
    const params: ArtworkSearchParams = {
      sortBy: undefined,
      sortColor: null as unknown as string,
      filterMode: "",
    };
    expect(buildArtworkSearchUrl(params)).toBe("/artwork?");
  });
});

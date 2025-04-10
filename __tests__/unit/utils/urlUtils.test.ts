import {
  buildUrl,
  buildArtworkSearchUrl,
  type BuildUrlParams,
  type ArtworkSearchParams,
} from "@/lib/utils/urlUtils";

describe("buildUrl", () => {
  type BuildUrlTestCase = {
    params: BuildUrlParams;
    expected: string;
    description: string;
  };

  const testCases: BuildUrlTestCase[] = [
    {
      params: [["api", "users"]],
      expected: "/api/users",
      description: "builds basic path with multiple segments",
    },
    {
      params: [["products"]],
      expected: "/products",
      description: "builds path with single segment",
    },
    {
      params: [["search"], { q: "test", page: "1" }],
      expected: "/search?q=test&page=1",
      description: "builds path with query parameters",
    },
    {
      params: [["api", "users", "123"], { include: "details" }],
      expected: "/api/users/123?include=details",
      description: "builds path with segments and single query parameter",
    },
    {
      params: [[]],
      expected: "/",
      description: "handles empty segments array",
    },
    {
      params: [["", "test", ""]],
      expected: "/test",
      description: "filters out empty string segments",
    },
    {
      params: [["api", "", "users"]],
      expected: "/api/users",
      description: "handles empty segments in middle of path",
    },
    {
      params: [["", "", ""]],
      expected: "/",
      description: "handles array of only empty segments",
    },
    {
      params: [["", "test", "", "path", ""]],
      expected: "/test/path",
      description: "handles multiple empty segments mixed with valid ones",
    },
  ];

  test.each(testCases)("$description", ({ params, expected }) => {
    expect(buildUrl(...params)).toBe(expected);
  });
});

describe("buildArtworkSearchUrl", () => {
  type ArtworkSearchTestCase = {
    params: ArtworkSearchParams;
    expected: string;
    description: string;
  };

  const testCases: ArtworkSearchTestCase[] = [
    {
      params: {},
      expected: "/artwork?",
      description: "builds base URL with no parameters",
    },
    {
      params: { sortBy: "date" },
      expected: "/artwork?sortBy=date",
      description: "builds URL with sort parameter",
    },
    {
      params: { sortColor: "#FF0000" },
      expected: "/artwork?sortColor=%23FF0000",
      description: "builds URL with color parameter",
    },
    {
      params: { filterMode: "recent" },
      expected: "/artwork?filterMode=recent",
      description: "builds URL with filter parameter",
    },
    {
      params: {
        sortBy: "date",
        sortColor: "#FF0000",
        filterMode: "recent",
      },
      expected: "/artwork?sortBy=date&sortColor=%23FF0000&filterMode=recent",
      description: "builds URL with all parameters",
    },
  ];

  test.each(testCases)("$description", ({ params, expected }) => {
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

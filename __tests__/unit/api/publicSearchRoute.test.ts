jest.mock("server-only", () => ({}), { virtual: true });

import { GET } from "@/app/api/v2/public/search/route";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/data/services/getPublicSearchResults", () => ({
  getPublicSearchResults: jest.fn(),
}));

const mockGetPublicSearchResults = getPublicSearchResults as jest.MockedFunction<
  typeof getPublicSearchResults
>;

const requestId = "req-public-search";

const createRequest = (url: string, suppliedRequestId: string | null = requestId) =>
  ({
    method: "GET",
    headers:
      suppliedRequestId === null
        ? new Headers()
        : new Headers({ "x-request-id": suppliedRequestId }),
    nextUrl: new URL(url),
    url,
  } as never);

const successResult = {
  success: true,
  data: {
    blogs: [
      {
        title: "Studio update",
        subtitle: "New works",
        summary: "A short blog summary",
        imageUrl: "/blog.jpg",
        slug: "studio-update",
        linkTo: "/blog/studio-update",
      },
    ],
  },
} as never;

describe("GET /api/v2/public/search", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPublicSearchResults.mockResolvedValue(successResult);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("parses valid params, honors type, and returns the service envelope", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/search?q=%20studio%20&type=blogs&page=2&limit=5"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetPublicSearchResults).toHaveBeenCalledWith({
      q: "studio",
      type: "blogs",
      page: 2,
      limit: 5,
    });
    expect(body).toBe(successResult);
  });

  it("returns 400 when q is missing and avoids database work", async () => {
    const response = await GET(
      createRequest("https://example.test/api/v2/public/search")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid search query",
      fieldErrors: {
        q: ["Search query is required"],
      },
      formErrors: [],
    });
    expect(mockGetPublicSearchResults).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported type values", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/search?q=studio&type=artwork"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid search query",
      fieldErrors: {
        type: ["Search type must be articles, blogs, or collections"],
      },
      formErrors: [],
    });
    expect(mockGetPublicSearchResults).not.toHaveBeenCalled();
  });

  it("returns 400 for out-of-bounds pagination", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/search?q=studio&page=0&limit=100"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid search query",
      fieldErrors: {
        page: ["Page must be at least 1"],
        limit: ["Limit must be 25 or less"],
      },
      formErrors: [],
    });
    expect(mockGetPublicSearchResults).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 when the service throws", async () => {
    mockGetPublicSearchResults.mockRejectedValue(
      new Error("private database detail")
    );

    const response = await GET(
      createRequest("https://example.test/api/v2/public/search?q=studio")
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      error: "Failed to perform search",
      requestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/public/search",
        method: "GET",
        errorLabel: "public_search_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private database detail");
  });

  it("generates a request ID for public-safe 500s when none is supplied", async () => {
    mockGetPublicSearchResults.mockRejectedValue(
      new Error("private generated id detail")
    );

    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/search?q=studio",
        null
      )
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Failed to perform search",
      requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
    });
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(body.requestId);
  });
});

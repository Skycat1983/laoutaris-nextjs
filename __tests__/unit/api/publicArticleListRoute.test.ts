jest.mock("server-only", () => ({}), { virtual: true });

import fs from "fs";
import path from "path";
import { GET as GET_ARTICLE_LIST } from "@/app/api/v2/public/article/route";
import { getArticleList } from "@/lib/data/services/getArticleList";
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

jest.mock("@/lib/data/services/getArticleList", () => ({
  getArticleList: jest.fn(),
}));

const mockGetArticleList = getArticleList as jest.MockedFunction<
  typeof getArticleList
>;

const requestId = "req-article-list";

const createRequest = (url: string) =>
  ({
    method: "GET",
    headers: new Headers({ "x-request-id": requestId }),
    nextUrl: new URL(url),
    url,
  }) as never;

describe("GET /api/v2/public/article", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("returns the existing success envelope and metadata from the article list service", async () => {
    const articles = [
      { slug: "early-life", title: "Early Life" },
      { slug: "studio-years", title: "Studio Years" },
    ];
    mockGetArticleList.mockResolvedValue({
      success: true,
      data: articles,
      metadata: {
        page: 3,
        limit: 4,
        total: 10,
        totalPages: 3,
      },
    } as never);

    const response = await GET_ARTICLE_LIST(
      createRequest(
        "https://example.com/api/v2/public/article?section=biography&fields=title,subtitle,slug,imageUrl&page=3&limit=4"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetArticleList).toHaveBeenCalledWith({
      section: "biography",
      fields: "title subtitle slug imageUrl",
      page: 3,
      limit: 4,
    });
    expect(body).toEqual({
      success: true,
      data: articles,
      metadata: {
        page: 3,
        limit: 4,
        total: 10,
        totalPages: 3,
      },
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("preserves default list params when query values are omitted", async () => {
    mockGetArticleList.mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    } as never);

    const response = await GET_ARTICLE_LIST(
      createRequest("https://example.com/api/v2/public/article")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetArticleList).toHaveBeenCalledWith({
      section: null,
      fields: "",
      page: 1,
      limit: 10,
    });
    expect(body.metadata).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it("preserves the no-results response body", async () => {
    mockGetArticleList.mockResolvedValue(null);

    const response = await GET_ARTICLE_LIST(
      createRequest(
        "https://example.com/api/v2/public/article?section=biography"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: false,
      error: "No articles found",
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("returns the existing public-safe 500 body when the service fails", async () => {
    mockGetArticleList.mockRejectedValue(new Error("private article list"));

    const response = await GET_ARTICLE_LIST(
      createRequest(
        "https://example.com/api/v2/public/article?section=biography"
      )
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(200);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      error: "Failed to fetch article entries",
      statusCode: 500,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/public/article",
        method: "GET",
        errorLabel: "article_list_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private article list");
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("does not contain touched direct debug logging", () => {
    const routeSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/app/api/v2/public/article/route.ts"
      ),
      "utf8"
    );

    expect(routeSource).not.toContain("console.log");
    expect(routeSource).not.toContain("console.error");
    expect(routeSource).not.toContain("Error stack:");
  });
});

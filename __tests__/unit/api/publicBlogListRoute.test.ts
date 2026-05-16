import { GET as GET_BLOG_LIST } from "@/app/api/v2/public/blog/route";
import { getBlogList } from "@/lib/data/services/getBlogList";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/data/services/getBlogList", () => ({
  getBlogList: jest.fn(),
  isBlogListSortBy: jest.fn((sortby: string) =>
    ["latest", "oldest", "popular", "featured"].includes(sortby)
  ),
}));

const mockGetBlogList = getBlogList as jest.MockedFunction<typeof getBlogList>;

const createRequest = (url: string) => ({ url }) as never;

describe("GET /api/v2/public/blog", () => {
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

  it("returns the existing success envelope and metadata from the blog list service", async () => {
    const blogs = [
      { slug: "gallery-news", title: "Gallery News" },
      { slug: "studio-notes", title: "Studio Notes" },
    ];
    mockGetBlogList.mockResolvedValue({
      success: true,
      data: blogs,
      metadata: {
        page: 3,
        limit: 4,
        total: 10,
        totalPages: 3,
      },
    } as never);

    const response = await GET_BLOG_LIST(
      createRequest("https://example.com/api/v2/public/blog?sortby=popular&page=3&limit=4")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "popular",
      page: 3,
      limit: 4,
    });
    expect(body).toEqual({
      success: true,
      data: blogs,
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
    mockGetBlogList.mockResolvedValue({
      success: true,
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    } as never);

    const response = await GET_BLOG_LIST(
      createRequest("https://example.com/api/v2/public/blog")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetBlogList).toHaveBeenCalledWith({
      sortby: "latest",
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

  it("preserves the invalid sortby error body without calling the service", async () => {
    const response = await GET_BLOG_LIST(
      createRequest("https://example.com/api/v2/public/blog?sortby=pinned")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetBlogList).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: false,
      error: "Invalid sortby parameter",
      statusCode: 400,
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("returns the existing public-safe 500 body when the service fails", async () => {
    mockGetBlogList.mockRejectedValue(new Error("private blog list"));

    const response = await GET_BLOG_LIST(
      createRequest("https://example.com/api/v2/public/blog?sortby=featured")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: false,
      error: "Failed to fetch blog entries",
      statusCode: 500,
    });
    expect(JSON.stringify(body)).not.toContain("private blog list");
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

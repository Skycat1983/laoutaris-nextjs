jest.mock("server-only", () => ({}), { virtual: true });

import { GET as GET_ARTICLE_DETAIL } from "@/app/api/v2/public/article/[slug]/route";
import { GET as GET_BLOG_DETAIL } from "@/app/api/v2/public/blog/[slug]/route";
import { GET as GET_BLOG_WITH_COMMENTS } from "@/app/api/v2/public/blog/[slug]/comments/route";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/data/services/getArticleBySlugPopulated", () => ({
  getArticleBySlugPopulated: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithAuthor", () => ({
  getBlogBySlugWithAuthor: jest.fn(),
}));

jest.mock("@/lib/data/services/getBlogBySlugWithComments", () => ({
  getBlogBySlugWithComments: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;
const mockGetArticleBySlugPopulated =
  getArticleBySlugPopulated as jest.MockedFunction<
    typeof getArticleBySlugPopulated
  >;
const mockGetBlogBySlugWithAuthor =
  getBlogBySlugWithAuthor as jest.MockedFunction<
    typeof getBlogBySlugWithAuthor
  >;
const mockGetBlogBySlugWithComments =
  getBlogBySlugWithComments as jest.MockedFunction<
    typeof getBlogBySlugWithComments
  >;

const propagatedRequestId = "req-content-detail";

const createRequest = (url: string, requestId?: string) =>
  ({
    method: "GET",
    headers: new Headers(
      requestId === undefined ? {} : { "x-request-id": requestId }
    ),
    nextUrl: new URL(url),
    url,
  }) as never;

const request = createRequest("https://example.test/api/v2/public/content");

const createParams = (slug: string) => ({
  params: { slug },
});

describe("public content detail routes", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue("user-123");
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("GET /api/v2/public/article/[slug]", () => {
    it("returns a success envelope for an existing article", async () => {
      const frontendArticle = {
        slug: "studio-notes",
        title: "Studio Notes",
        linkTo: "/article/studio-notes",
      };
      mockGetArticleBySlugPopulated.mockResolvedValue(frontendArticle as never);

      const response = await GET_ARTICLE_DETAIL(
        request,
        createParams("studio-notes")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
      expect(mockGetUserIdFromSession.mock.invocationCallOrder[0]).toBeLessThan(
        mockGetArticleBySlugPopulated.mock.invocationCallOrder[0]
      );
      expect(mockGetArticleBySlugPopulated).toHaveBeenCalledWith(
        "studio-notes"
      );
      expect(body).toEqual({
        success: true,
        data: frontendArticle,
      });
    });

    it("returns 404 when the article does not exist", async () => {
      mockGetArticleBySlugPopulated.mockResolvedValue(null);

      const response = await GET_ARTICLE_DETAIL(
        request,
        createParams("missing-article")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Article not found",
        error: "Article not found",
      });
    });

    it("returns a public-safe 500 when article lookup fails", async () => {
      mockGetArticleBySlugPopulated.mockRejectedValue(
        new Error("private article detail")
      );

      const response = await GET_ARTICLE_DETAIL(
        request,
        createParams("studio-notes")
      );
      const body = await response.json();
      const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch article",
        error: "Failed to fetch article",
        requestId: generatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: generatedRequestId,
          route: "/api/v2/public/article/[slug]",
          method: "GET",
          errorLabel: "article_detail_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private article detail");
    });
  });

  describe("GET /api/v2/public/blog/[slug]", () => {
    it("returns a success envelope for an existing blog entry", async () => {
      const frontendBlog = {
        slug: "gallery-news",
        title: "Gallery News",
        linkTo: "/blog/gallery-news",
      };
      mockGetBlogBySlugWithAuthor.mockResolvedValue(frontendBlog as never);

      const response = await GET_BLOG_DETAIL(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetBlogBySlugWithAuthor).toHaveBeenCalledWith("gallery-news");
      expect(body).toEqual({
        success: true,
        data: frontendBlog,
      });
    });

    it("returns 404 when the blog entry does not exist", async () => {
      mockGetBlogBySlugWithAuthor.mockResolvedValue(null);

      const response = await GET_BLOG_DETAIL(
        request,
        createParams("missing-blog")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Blog entry not found",
        error: "Blog entry not found",
      });
    });

    it("returns a public-safe 500 when blog lookup fails", async () => {
      mockGetBlogBySlugWithAuthor.mockRejectedValue(
        new Error("private blog detail")
      );

      const response = await GET_BLOG_DETAIL(
        createRequest(
          "https://example.test/api/v2/public/blog/gallery-news",
          propagatedRequestId
        ),
        createParams("gallery-news")
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(propagatedRequestId);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch blog entry",
        error: "Failed to fetch blog entry",
        requestId: propagatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: propagatedRequestId,
          route: "/api/v2/public/blog/[slug]",
          method: "GET",
          errorLabel: "blog_detail_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private blog detail");
    });
  });

  describe("GET /api/v2/public/blog/[slug]/comments", () => {
    it("returns a success envelope for an existing populated blog entry", async () => {
      const frontendBlog = {
        slug: "gallery-news",
        title: "Gallery News",
        comments: [{ text: "A comment", author: { name: "Reader" } }],
      };
      mockGetBlogBySlugWithComments.mockResolvedValue(frontendBlog as never);

      const response = await GET_BLOG_WITH_COMMENTS(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetBlogBySlugWithComments).toHaveBeenCalledWith(
        "gallery-news"
      );
      expect(body).toEqual({
        success: true,
        data: frontendBlog,
      });
    });

    it("returns 404 when the populated blog entry does not exist", async () => {
      mockGetBlogBySlugWithComments.mockResolvedValue(null);

      const response = await GET_BLOG_WITH_COMMENTS(
        request,
        createParams("missing-blog")
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({
        success: false,
        message: "Blog entry not found",
        error: "Blog entry not found",
      });
    });

    it("returns a public-safe 500 when populated blog lookup fails", async () => {
      mockGetBlogBySlugWithComments.mockRejectedValue(
        new Error("private comment detail")
      );

      const response = await GET_BLOG_WITH_COMMENTS(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();
      const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch blog entry with comments",
        error: "Failed to fetch blog entry with comments",
        requestId: generatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: generatedRequestId,
          route: "/api/v2/public/blog/[slug]/comments",
          method: "GET",
          errorLabel: "blog_comments_detail_read_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private comment detail");
    });
  });
});

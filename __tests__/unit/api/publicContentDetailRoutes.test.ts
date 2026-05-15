import { GET as GET_ARTICLE_DETAIL } from "@/app/api/v2/public/article/[slug]/route";
import { GET as GET_BLOG_DETAIL } from "@/app/api/v2/public/blog/[slug]/route";
import { GET as GET_BLOG_WITH_COMMENTS } from "@/app/api/v2/public/blog/[slug]/comments/route";
import { ArticleModel, BlogModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformArticlePopulated } from "@/lib/transforms/article/transformArticle";
import {
  transformBlogPopulatedWithCommentsPopulated,
  transformBlogWithAuthor,
} from "@/lib/transforms/blog/transformBlog";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  ArticleModel: {
    findOne: jest.fn(),
  },
  BlogModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/transforms/article/transformArticle", () => ({
  transformArticlePopulated: jest.fn(),
}));

jest.mock("@/lib/transforms/blog/transformBlog", () => ({
  transformBlogPopulatedWithCommentsPopulated: jest.fn(),
  transformBlogWithAuthor: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;
const mockArticleFindOne = ArticleModel.findOne as jest.Mock;
const mockBlogFindOne = BlogModel.findOne as jest.Mock;
const mockTransformArticlePopulated =
  transformArticlePopulated as jest.MockedFunction<
    typeof transformArticlePopulated
  >;
const mockTransformBlogWithAuthor =
  transformBlogWithAuthor as jest.MockedFunction<typeof transformBlogWithAuthor>;
const mockTransformBlogPopulatedWithCommentsPopulated =
  transformBlogPopulatedWithCommentsPopulated as jest.MockedFunction<
    typeof transformBlogPopulatedWithCommentsPopulated
  >;

const request = {} as never;

const createParams = (slug: string) => ({
  params: { slug },
});

const createPopulatedLeanQuery = (result: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedPopulatedLeanQuery = (error: unknown) => {
  const query = {
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.populate.mockReturnValue(query);
  return query;
};

describe("public content detail routes", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
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
      const rawArticle = { slug: "studio-notes", title: "Studio Notes" };
      const frontendArticle = {
        slug: "studio-notes",
        title: "Studio Notes",
        linkTo: "/article/studio-notes",
      };
      const query = createPopulatedLeanQuery(rawArticle);
      mockArticleFindOne.mockReturnValue(query);
      mockTransformArticlePopulated.mockReturnValue(frontendArticle as never);

      const response = await GET_ARTICLE_DETAIL(
        request,
        createParams("studio-notes")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockArticleFindOne).toHaveBeenCalledWith({
        slug: "studio-notes",
      });
      expect(query.populate).toHaveBeenCalledWith("author artwork");
      expect(mockTransformArticlePopulated).toHaveBeenCalledWith(rawArticle);
      expect(body).toEqual({
        success: true,
        data: frontendArticle,
      });
    });

    it("returns 404 when the article does not exist", async () => {
      mockArticleFindOne.mockReturnValue(createPopulatedLeanQuery(null));

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
      expect(mockTransformArticlePopulated).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when article lookup fails", async () => {
      mockArticleFindOne.mockReturnValue(
        createRejectedPopulatedLeanQuery(new Error("private article detail"))
      );

      const response = await GET_ARTICLE_DETAIL(
        request,
        createParams("studio-notes")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch article",
        error: "Failed to fetch article",
      });
      expect(JSON.stringify(body)).not.toContain("private article detail");
    });
  });

  describe("GET /api/v2/public/blog/[slug]", () => {
    it("returns a success envelope for an existing blog entry", async () => {
      const rawBlog = { slug: "gallery-news", title: "Gallery News" };
      const frontendBlog = {
        slug: "gallery-news",
        title: "Gallery News",
        linkTo: "/blog/gallery-news",
      };
      const query = createPopulatedLeanQuery(rawBlog);
      mockBlogFindOne.mockReturnValue(query);
      mockTransformBlogWithAuthor.mockReturnValue(frontendBlog as never);

      const response = await GET_BLOG_DETAIL(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockBlogFindOne).toHaveBeenCalledWith({ slug: "gallery-news" });
      expect(query.populate).toHaveBeenNthCalledWith(1, "comments");
      expect(query.populate).toHaveBeenNthCalledWith(2, "author");
      expect(mockTransformBlogWithAuthor).toHaveBeenCalledWith(rawBlog);
      expect(body).toEqual({
        success: true,
        data: frontendBlog,
      });
    });

    it("returns 404 when the blog entry does not exist", async () => {
      mockBlogFindOne.mockReturnValue(createPopulatedLeanQuery(null));

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
      expect(mockTransformBlogWithAuthor).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when blog lookup fails", async () => {
      mockBlogFindOne.mockReturnValue(
        createRejectedPopulatedLeanQuery(new Error("private blog detail"))
      );

      const response = await GET_BLOG_DETAIL(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch blog entry",
        error: "Failed to fetch blog entry",
      });
      expect(JSON.stringify(body)).not.toContain("private blog detail");
    });
  });

  describe("GET /api/v2/public/blog/[slug]/comments", () => {
    it("returns a success envelope for an existing populated blog entry", async () => {
      const rawBlog = {
        slug: "gallery-news",
        title: "Gallery News",
        comments: [{ text: "A comment" }],
      };
      const frontendBlog = {
        slug: "gallery-news",
        title: "Gallery News",
        comments: [{ text: "A comment", author: { name: "Reader" } }],
      };
      const query = createPopulatedLeanQuery(rawBlog);
      mockBlogFindOne.mockReturnValue(query);
      mockTransformBlogPopulatedWithCommentsPopulated.mockReturnValue(
        frontendBlog as never
      );

      const response = await GET_BLOG_WITH_COMMENTS(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockBlogFindOne).toHaveBeenCalledWith({ slug: "gallery-news" });
      expect(query.populate).toHaveBeenCalledWith({
        path: "comments",
        populate: {
          path: "author",
        },
      });
      expect(mockTransformBlogPopulatedWithCommentsPopulated).toHaveBeenCalledWith(
        rawBlog
      );
      expect(body).toEqual({
        success: true,
        data: frontendBlog,
      });
    });

    it("returns 404 when the populated blog entry does not exist", async () => {
      mockBlogFindOne.mockReturnValue(createPopulatedLeanQuery(null));

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
      expect(
        mockTransformBlogPopulatedWithCommentsPopulated
      ).not.toHaveBeenCalled();
    });

    it("returns a public-safe 500 when populated blog lookup fails", async () => {
      mockBlogFindOne.mockReturnValue(
        createRejectedPopulatedLeanQuery(new Error("private comment detail"))
      );

      const response = await GET_BLOG_WITH_COMMENTS(
        request,
        createParams("gallery-news")
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to fetch blog entry with comments",
        error: "Failed to fetch blog entry with comments",
      });
      expect(JSON.stringify(body)).not.toContain("private comment detail");
    });
  });
});

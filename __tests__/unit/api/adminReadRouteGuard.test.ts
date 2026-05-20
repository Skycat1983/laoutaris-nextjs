jest.mock("server-only", () => ({}), { virtual: true });

import { GET as GET_ARTICLE_LIST } from "@/app/api/v2/admin/article/read/route";
import { GET as GET_ARTICLE_DETAIL } from "@/app/api/v2/admin/article/read/[id]/route";
import { GET as GET_ARTWORK_LIST } from "@/app/api/v2/admin/artwork/read/route";
import { GET as GET_ARTWORK_DETAIL } from "@/app/api/v2/admin/artwork/read/[id]/route";
import { GET as GET_BLOG_LIST } from "@/app/api/v2/admin/blog/read/route";
import { GET as GET_BLOG_DETAIL } from "@/app/api/v2/admin/blog/read/[id]/route";
import { GET as GET_COLLECTION_LIST } from "@/app/api/v2/admin/collection/read/route";
import { GET as GET_COLLECTION_DETAIL } from "@/app/api/v2/admin/collection/read/[id]/route";
import { GET as GET_COMMENT_LIST } from "@/app/api/v2/admin/comment/read/route";
import { GET as GET_USER_LIST } from "@/app/api/v2/admin/user/read/route";
import dbConnect from "@/lib/db/mongodb";
import {
  ArticleModel,
  ArtworkModel,
  BlogModel,
  CollectionModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import {
  transformArticlePopulated,
  transformArtwork,
  transformBlogPopulated,
  transformCollectionPopulated,
  transformCommentPopulated,
  transformUser,
} from "@/lib/transforms";
import { getServerSession } from "next-auth";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  ArticleModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
  ArtworkModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
  BlogModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
  CollectionModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
  CommentModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
  UserModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformArticlePopulated: jest.fn(),
  transformArtwork: {
    toFrontend: jest.fn(),
  },
  transformBlogPopulated: jest.fn(),
  transformCollectionPopulated: jest.fn(),
  transformCommentPopulated: jest.fn(),
  transformUser: {
    toFrontend: jest.fn(),
  },
}));

const adminUserId = "507f1f77bcf86cd799439011";
const regularUserId = "507f1f77bcf86cd799439012";
const articleId = "507f1f77bcf86cd799439013";
const artworkId = "507f1f77bcf86cd799439014";
const blogId = "507f1f77bcf86cd799439015";
const collectionId = "507f1f77bcf86cd799439016";
const overlongBlogSearch = "s".repeat(81);

type Handler = (request: never, context?: never) => Promise<{
  status: number;
  json: () => Promise<unknown>;
}>;

type ReadRouteCase = {
  label: string;
  handler: Handler;
  request: unknown;
  context?: unknown;
  expectNoTargetRead: () => void;
};

const createRequest = (
  url = "http://localhost/api/v2/admin/read?page=1&limit=10"
) => {
  const nextUrl = new URL(url);
  return {
    method: "GET",
    headers: new Headers(),
    url: nextUrl.toString(),
    nextUrl,
  };
};

const createRouteContext = (id: string) => ({
  params: {
    id,
  },
});

const createListQuery = (result: unknown) => {
  const query = {
    limit: jest.fn(),
    skip: jest.fn(),
    sort: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.limit.mockReturnValue(query);
  query.skip.mockReturnValue(query);
  query.sort.mockReturnValue(query);
  query.populate.mockReturnValue(query);
  return query;
};

type ListQuery = ReturnType<typeof createListQuery>;

const createPopulatedLeanQuery = (result: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
});

const createRejectedPopulatedLeanQuery = (error: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockRejectedValue(error),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockArticleCountDocuments = ArticleModel.countDocuments as jest.Mock;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockArticleFindById = ArticleModel.findById as jest.Mock;
const mockArtworkFind = ArtworkModel.find as jest.Mock;
const mockArtworkFindById = ArtworkModel.findById as jest.Mock;
const mockArtworkCountDocuments = ArtworkModel.countDocuments as jest.Mock;
const mockBlogCountDocuments = BlogModel.countDocuments as jest.Mock;
const mockBlogFind = BlogModel.find as jest.Mock;
const mockBlogFindById = BlogModel.findById as jest.Mock;
const mockCollectionCountDocuments =
  CollectionModel.countDocuments as jest.Mock;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionFindById = CollectionModel.findById as jest.Mock;
const mockCommentCountDocuments = CommentModel.countDocuments as jest.Mock;
const mockCommentFind = CommentModel.find as jest.Mock;
const mockUserCountDocuments = UserModel.countDocuments as jest.Mock;
const mockUserFind = UserModel.find as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockTransformArticlePopulated =
  transformArticlePopulated as jest.MockedFunction<
    typeof transformArticlePopulated
  >;
const mockTransformArtworkToFrontend = transformArtwork.toFrontend as jest.Mock;
const mockTransformBlogPopulated =
  transformBlogPopulated as jest.MockedFunction<typeof transformBlogPopulated>;
const mockTransformCollectionPopulated =
  transformCollectionPopulated as jest.MockedFunction<
    typeof transformCollectionPopulated
  >;
const mockTransformCommentPopulated =
  transformCommentPopulated as jest.MockedFunction<
    typeof transformCommentPopulated
  >;
const mockTransformUserToFrontend = transformUser.toFrontend as jest.Mock;

const setSession = (user: { id?: string; role?: string } | null) => {
  mockGetServerSession.mockResolvedValue(
    user
      ? {
          user: {
            name: "Test User",
            email: "test@example.com",
            ...user,
          },
          expires: "2099-01-01T00:00:00.000Z",
        }
      : null
  );
};

const setAdminSession = () => {
  setSession({ id: adminUserId, role: "admin" });
};

const setNonAdminSession = () => {
  setSession({ id: regularUserId, role: "user" });
};

const expectNoAnyModelRead = () => {
  expect(mockArticleCountDocuments).not.toHaveBeenCalled();
  expect(mockArticleFind).not.toHaveBeenCalled();
  expect(mockArticleFindById).not.toHaveBeenCalled();
  expect(mockArtworkCountDocuments).not.toHaveBeenCalled();
  expect(mockArtworkFind).not.toHaveBeenCalled();
  expect(mockArtworkFindById).not.toHaveBeenCalled();
  expect(mockBlogCountDocuments).not.toHaveBeenCalled();
  expect(mockBlogFind).not.toHaveBeenCalled();
  expect(mockBlogFindById).not.toHaveBeenCalled();
  expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
  expect(mockCollectionFind).not.toHaveBeenCalled();
  expect(mockCollectionFindById).not.toHaveBeenCalled();
  expect(mockCommentCountDocuments).not.toHaveBeenCalled();
  expect(mockCommentFind).not.toHaveBeenCalled();
  expect(mockUserCountDocuments).not.toHaveBeenCalled();
  expect(mockUserFind).not.toHaveBeenCalled();
  expect(mockUserFindById).not.toHaveBeenCalled();
};

const readRouteCases: ReadRouteCase[] = [
  {
    label: "article list",
    handler: GET_ARTICLE_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/article/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockArticleCountDocuments).not.toHaveBeenCalled();
      expect(mockArticleFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "article detail",
    handler: GET_ARTICLE_DETAIL as Handler,
    request: createRequest(),
    context: createRouteContext(articleId),
    expectNoTargetRead: () => {
      expect(mockArticleFindById).not.toHaveBeenCalled();
    },
  },
  {
    label: "artwork list",
    handler: GET_ARTWORK_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/artwork/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockArtworkCountDocuments).not.toHaveBeenCalled();
      expect(mockArtworkFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "artwork detail",
    handler: GET_ARTWORK_DETAIL as Handler,
    request: createRequest(),
    context: createRouteContext(artworkId),
    expectNoTargetRead: () => {
      expect(mockArtworkFindById).not.toHaveBeenCalled();
    },
  },
  {
    label: "blog list",
    handler: GET_BLOG_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/blog/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockBlogCountDocuments).not.toHaveBeenCalled();
      expect(mockBlogFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "blog detail",
    handler: GET_BLOG_DETAIL as Handler,
    request: createRequest(),
    context: createRouteContext(blogId),
    expectNoTargetRead: () => {
      expect(mockBlogFindById).not.toHaveBeenCalled();
    },
  },
  {
    label: "collection list",
    handler: GET_COLLECTION_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/collection/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
      expect(mockCollectionFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "collection detail",
    handler: GET_COLLECTION_DETAIL as Handler,
    request: createRequest(),
    context: createRouteContext(collectionId),
    expectNoTargetRead: () => {
      expect(mockCollectionFindById).not.toHaveBeenCalled();
    },
  },
  {
    label: "comment list",
    handler: GET_COMMENT_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/comment/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockCommentCountDocuments).not.toHaveBeenCalled();
      expect(mockCommentFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "user list",
    handler: GET_USER_LIST as Handler,
    request: createRequest(
      "http://localhost/api/v2/admin/user/read?page=1&limit=10"
    ),
    expectNoTargetRead: () => {
      expect(mockUserCountDocuments).not.toHaveBeenCalled();
      expect(mockUserFind).not.toHaveBeenCalled();
    },
  },
];

const invalidDetailCases: Array<
  [string, Handler, string, string, () => void]
> = [
  [
    "article",
    GET_ARTICLE_DETAIL as Handler,
    "Invalid article input",
    "Invalid article ID",
    () => expect(mockArticleFindById).not.toHaveBeenCalled(),
  ],
  [
    "artwork",
    GET_ARTWORK_DETAIL as Handler,
    "Invalid artwork input",
    "Invalid artwork ID",
    () => expect(mockArtworkFindById).not.toHaveBeenCalled(),
  ],
  [
    "blog",
    GET_BLOG_DETAIL as Handler,
    "Invalid blog input",
    "Invalid blog ID",
    () => expect(mockBlogFindById).not.toHaveBeenCalled(),
  ],
  [
    "collection",
    GET_COLLECTION_DETAIL as Handler,
    "Invalid collection input",
    "Invalid collection ID",
    () => expect(mockCollectionFindById).not.toHaveBeenCalled(),
  ],
];

const invalidListQueryCases: Array<{
  label: string;
  handler: Handler;
  requestUrl: string;
  expectedError: string;
  expectedFieldErrors: Record<string, string[]>;
  expectNoTargetRead: () => void;
}> = [
  {
    label: "article list with a zero page",
    handler: GET_ARTICLE_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/article/read?page=0&limit=10",
    expectedError: "Invalid article input",
    expectedFieldErrors: {
      page: ["Page must be at least 1"],
    },
    expectNoTargetRead: () => {
      expect(mockArticleCountDocuments).not.toHaveBeenCalled();
      expect(mockArticleFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "article list with a non-numeric limit",
    handler: GET_ARTICLE_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/article/read?page=1&limit=abc",
    expectedError: "Invalid article input",
    expectedFieldErrors: {
      limit: ["Limit must be a positive integer"],
    },
    expectNoTargetRead: () => {
      expect(mockArticleCountDocuments).not.toHaveBeenCalled();
      expect(mockArticleFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "artwork list with an oversized limit",
    handler: GET_ARTWORK_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/artwork/read?page=1&limit=101",
    expectedError: "Invalid artwork input",
    expectedFieldErrors: {
      limit: ["Limit must be 100 or less"],
    },
    expectNoTargetRead: () => {
      expect(mockArtworkCountDocuments).not.toHaveBeenCalled();
      expect(mockArtworkFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "blog list with a negative page",
    handler: GET_BLOG_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/blog/read?page=-1&limit=10",
    expectedError: "Invalid blog input",
    expectedFieldErrors: {
      page: ["Page must be a positive integer"],
    },
    expectNoTargetRead: () => {
      expect(mockBlogCountDocuments).not.toHaveBeenCalled();
      expect(mockBlogFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "blog list with an oversized search",
    handler: GET_BLOG_LIST as Handler,
    requestUrl: `http://localhost/api/v2/admin/blog/read?page=1&limit=10&search=${overlongBlogSearch}`,
    expectedError: "Invalid blog input",
    expectedFieldErrors: {
      search: ["Search must be 80 characters or fewer"],
    },
    expectNoTargetRead: () => {
      expect(mockBlogCountDocuments).not.toHaveBeenCalled();
      expect(mockBlogFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "collection list with a zero limit",
    handler: GET_COLLECTION_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/collection/read?page=1&limit=0",
    expectedError: "Invalid collection input",
    expectedFieldErrors: {
      limit: ["Limit must be at least 1"],
    },
    expectNoTargetRead: () => {
      expect(mockCollectionCountDocuments).not.toHaveBeenCalled();
      expect(mockCollectionFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "comment list with a decimal page",
    handler: GET_COMMENT_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/comment/read?page=1.5&limit=10",
    expectedError: "Invalid comment input",
    expectedFieldErrors: {
      page: ["Page must be a positive integer"],
    },
    expectNoTargetRead: () => {
      expect(mockCommentCountDocuments).not.toHaveBeenCalled();
      expect(mockCommentFind).not.toHaveBeenCalled();
    },
  },
  {
    label: "user list with an oversized page",
    handler: GET_USER_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/user/read?page=1001&limit=10",
    expectedError: "Invalid user input",
    expectedFieldErrors: {
      page: ["Page must be 1000 or less"],
    },
    expectNoTargetRead: () => {
      expect(mockUserCountDocuments).not.toHaveBeenCalled();
      expect(mockUserFind).not.toHaveBeenCalled();
    },
  },
];

const defaultPaginationCases: Array<{
  label: string;
  handler: Handler;
  requestUrl: string;
  total: number;
  expectedLimit: number;
  setup: () => {
    query: ListQuery;
    frontendData: unknown;
    expectModelCalls: () => void;
  };
}> = [
  {
    label: "article",
    handler: GET_ARTICLE_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/article/read",
    total: 12,
    expectedLimit: 10,
    setup: () => {
      const rawArticle = {
        _id: articleId,
        title: "Archive note",
      };
      const frontendArticle = {
        _id: articleId,
        title: "Archive note",
      };
      const query = createListQuery([rawArticle]);
      mockArticleFind.mockReturnValue(query);
      mockArticleCountDocuments.mockResolvedValue(12);
      mockTransformArticlePopulated.mockReturnValue(frontendArticle as never);

      return {
        query,
        frontendData: frontendArticle,
        expectModelCalls: () => {
          expect(mockArticleFind).toHaveBeenCalledWith();
          expect(mockArticleCountDocuments).toHaveBeenCalledWith();
          expect(mockTransformArticlePopulated).toHaveBeenCalledWith(rawArticle);
        },
      };
    },
  },
  {
    label: "artwork",
    handler: GET_ARTWORK_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/artwork/read",
    total: 120,
    expectedLimit: 100,
    setup: () => {
      const rawArtwork = {
        _id: artworkId,
        title: "Blue Figure",
      };
      const frontendArtwork = {
        _id: artworkId,
        title: "Blue Figure",
      };
      const query = createListQuery([rawArtwork]);
      mockArtworkFind.mockReturnValue(query);
      mockArtworkCountDocuments.mockResolvedValue(120);
      mockTransformArtworkToFrontend.mockReturnValue(frontendArtwork);

      return {
        query,
        frontendData: frontendArtwork,
        expectModelCalls: () => {
          expect(mockArtworkFind).toHaveBeenCalledWith({});
          expect(mockArtworkCountDocuments).toHaveBeenCalledWith({});
          expect(mockTransformArtworkToFrontend).toHaveBeenCalledWith(rawArtwork);
        },
      };
    },
  },
  {
    label: "blog",
    handler: GET_BLOG_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/blog/read",
    total: 21,
    expectedLimit: 10,
    setup: () => {
      const rawBlog = {
        _id: blogId,
        title: "Studio Journal",
      };
      const frontendBlog = {
        _id: blogId,
        title: "Studio Journal",
      };
      const query = createListQuery([rawBlog]);
      mockBlogFind.mockReturnValue(query);
      mockBlogCountDocuments.mockResolvedValue(21);
      mockTransformBlogPopulated.mockReturnValue(frontendBlog as never);

      return {
        query,
        frontendData: frontendBlog,
        expectModelCalls: () => {
          expect(mockBlogFind).toHaveBeenCalledWith();
          expect(mockBlogCountDocuments).toHaveBeenCalledWith();
          expect(mockTransformBlogPopulated).toHaveBeenCalledWith(rawBlog);
        },
      };
    },
  },
  {
    label: "collection",
    handler: GET_COLLECTION_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/collection/read",
    total: 15,
    expectedLimit: 10,
    setup: () => {
      const rawCollection = {
        _id: collectionId,
        title: "Archive Set",
      };
      const frontendCollection = {
        _id: collectionId,
        title: "Archive Set",
      };
      const query = createListQuery([rawCollection]);
      mockCollectionFind.mockReturnValue(query);
      mockCollectionCountDocuments.mockResolvedValue(15);
      mockTransformCollectionPopulated.mockReturnValue(
        frontendCollection as never
      );

      return {
        query,
        frontendData: frontendCollection,
        expectModelCalls: () => {
          expect(mockCollectionFind).toHaveBeenCalledWith();
          expect(mockCollectionCountDocuments).toHaveBeenCalledWith();
          expect(mockTransformCollectionPopulated).toHaveBeenCalledWith(
            rawCollection
          );
        },
      };
    },
  },
  {
    label: "comment",
    handler: GET_COMMENT_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/comment/read",
    total: 18,
    expectedLimit: 10,
    setup: () => {
      const rawComment = {
        _id: "507f1f77bcf86cd799439017",
        text: "Useful note",
      };
      const frontendComment = {
        _id: "507f1f77bcf86cd799439017",
        text: "Useful note",
      };
      const query = createListQuery([rawComment]);
      mockCommentFind.mockReturnValue(query);
      mockCommentCountDocuments.mockResolvedValue(18);
      mockTransformCommentPopulated.mockReturnValue(frontendComment as never);

      return {
        query,
        frontendData: frontendComment,
        expectModelCalls: () => {
          expect(mockCommentFind).toHaveBeenCalledWith();
          expect(mockCommentCountDocuments).toHaveBeenCalledWith();
          expect(mockTransformCommentPopulated).toHaveBeenCalledWith(rawComment);
        },
      };
    },
  },
  {
    label: "user",
    handler: GET_USER_LIST as Handler,
    requestUrl: "http://localhost/api/v2/admin/user/read",
    total: 14,
    expectedLimit: 10,
    setup: () => {
      const rawUser = {
        _id: regularUserId,
        username: "viewer",
      };
      const frontendUser = {
        _id: regularUserId,
        username: "viewer",
      };
      const query = createListQuery([rawUser]);
      mockUserFind.mockReturnValue(query);
      mockUserCountDocuments.mockResolvedValue(14);
      mockTransformUserToFrontend.mockReturnValue(frontendUser);

      return {
        query,
        frontendData: frontendUser,
        expectModelCalls: () => {
          expect(mockUserFind).toHaveBeenCalledWith();
          expect(mockUserCountDocuments).toHaveBeenCalledWith();
          expect(mockTransformUserToFrontend).toHaveBeenCalledWith(rawUser);
        },
      };
    },
  },
];

describe("admin read route shared guard migration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockUserFindById.mockResolvedValue({ role: "admin" });
    mockTransformArticlePopulated.mockReturnValue({
      _id: articleId,
      title: "Archive note",
    } as never);
    mockTransformArtworkToFrontend.mockReturnValue({
      _id: artworkId,
      title: "Blue Figure",
    });
    mockTransformBlogPopulated.mockReturnValue({
      _id: blogId,
      title: "Studio Journal",
    } as never);
    mockTransformCollectionPopulated.mockReturnValue({
      _id: collectionId,
      title: "Archive Set",
    } as never);
    mockTransformCommentPopulated.mockReturnValue({
      _id: "507f1f77bcf86cd799439017",
      text: "Useful note",
    } as never);
    mockTransformUserToFrontend.mockReturnValue({
      _id: regularUserId,
      username: "viewer",
    });
  });

  it.each(readRouteCases)(
    "returns 401 for unauthenticated $label callers before route-local reads",
    async ({ handler, request, context }) => {
      setSession(null);

      const response = await handler(request as never, context as never);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expectNoAnyModelRead();
    }
  );

  it.each(readRouteCases)(
    "returns 403 for non-admin $label callers before route-local reads",
    async ({ handler, request, context }) => {
      setNonAdminSession();

      const response = await handler(request as never, context as never);
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({
        success: false,
        message: "Forbidden",
        error: "Forbidden",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expectNoAnyModelRead();
    }
  );

  it.each(invalidDetailCases)(
    "returns 400 for invalid %s detail IDs before target reads",
    async (_label, handler, error, idError, expectNoTargetRead) => {
      const response = await handler(
        createRequest() as never,
        createRouteContext("not-a-valid-id") as never
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        success: false,
        error,
        fieldErrors: {
          id: [idError],
        },
        formErrors: [],
      });
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expectNoTargetRead();
    }
  );

  it.each(invalidListQueryCases)(
    "returns 400 for invalid $label before target reads",
    async ({
      handler,
      requestUrl,
      expectedError,
      expectedFieldErrors,
      expectNoTargetRead,
    }) => {
      const response = await handler(createRequest(requestUrl) as never);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        success: false,
        error: expectedError,
        fieldErrors: expectedFieldErrors,
        formErrors: [],
      });
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expectNoTargetRead();
    }
  );

  it.each(defaultPaginationCases)(
    "uses default pagination metadata for $label list reads",
    async ({
      handler,
      requestUrl,
      total,
      expectedLimit,
      setup,
    }) => {
      const { query, frontendData, expectModelCalls } = setup();

      const response = await handler(createRequest(requestUrl) as never);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(query.limit).toHaveBeenCalledWith(expectedLimit);
      expect(query.skip).toHaveBeenCalledWith(0);
      expect(query.lean).toHaveBeenCalledTimes(1);
      expectModelCalls();
      expect(body).toEqual({
        success: true,
        data: [frontendData],
        metadata: {
          page: 1,
          limit: expectedLimit,
          total,
          totalPages: Math.ceil(total / expectedLimit),
        },
      });
    }
  );

  it("returns article list metadata with transformed data", async () => {
    const rawArticle = {
      _id: articleId,
      title: "Archive note",
    };
    const frontendArticle = {
      _id: articleId,
      title: "Archive note",
    };
    const query = createListQuery([rawArticle]);
    mockArticleFind.mockReturnValue(query);
    mockArticleCountDocuments.mockResolvedValue(12);
    mockTransformArticlePopulated.mockReturnValue(frontendArticle as never);

    const response = await GET_ARTICLE_LIST(
      createRequest(
        "http://localhost/api/v2/admin/article/read?page=2&limit=5"
      ) as never
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFind).toHaveBeenCalledTimes(1);
    expect(query.limit).toHaveBeenCalledWith(5);
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(query.populate).toHaveBeenCalledWith("artwork");
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockArticleCountDocuments).toHaveBeenCalledTimes(1);
    expect(mockTransformArticlePopulated).toHaveBeenCalledWith(rawArticle);
    expect(body).toEqual({
      success: true,
      data: [frontendArticle],
      metadata: {
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      },
    });
  });

  it.each<
    [string, string, Record<string, unknown>, number, string]
  >([
    [
      "featured",
      "false",
      { featured: false },
      7,
      "Filtered Blog",
    ],
    [
      "year",
      "2025",
      {
        displayDate: {
          $gte: new Date(Date.UTC(2025, 0, 1)),
          $lt: new Date(Date.UTC(2026, 0, 1)),
        },
      },
      11,
      "Year Filtered Blog",
    ],
  ])(
    "applies blog %s filters before counting and pagination",
    async (filterKey, filterValue, expectedQuery, total, title) => {
      const rawBlog = {
        _id: blogId,
        title,
      };
      const frontendBlog = {
        _id: blogId,
        title,
      };
      const query = createListQuery([rawBlog]);
      mockBlogFind.mockReturnValue(query);
      mockBlogCountDocuments.mockResolvedValue(total);
      mockTransformBlogPopulated.mockReturnValue(frontendBlog as never);

      const response = await GET_BLOG_LIST(
        createRequest(
          `http://localhost/api/v2/admin/blog/read?page=2&limit=3&filterKey=${filterKey}&filterValue=${filterValue}`
        ) as never
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockBlogFind).toHaveBeenCalledWith(expectedQuery);
      expect(mockBlogCountDocuments).toHaveBeenCalledWith(expectedQuery);
      expect(query.sort).toHaveBeenCalledWith({ displayDate: -1 });
      expect(query.skip).toHaveBeenCalledWith(3);
      expect(query.limit).toHaveBeenCalledWith(3);
      expect(mockTransformBlogPopulated).toHaveBeenCalledWith(rawBlog);
      expect(body).toEqual({
        success: true,
        data: [frontendBlog],
        metadata: {
          page: 2,
          limit: 3,
          total,
          totalPages: Math.ceil(total / 3),
        },
      });
    }
  );

  it("applies trimmed blog search before counting and pagination", async () => {
    const rawBlog = {
      _id: blogId,
      title: "Studio Notes",
    };
    const frontendBlog = {
      _id: blogId,
      title: "Studio Notes",
    };
    const expectedQuery = {
      $or: [
        { title: { $regex: "Studio\\+Notes", $options: "i" } },
        { slug: { $regex: "Studio\\+Notes", $options: "i" } },
      ],
    };
    const query = createListQuery([rawBlog]);
    mockBlogFind.mockReturnValue(query);
    mockBlogCountDocuments.mockResolvedValue(9);
    mockTransformBlogPopulated.mockReturnValue(frontendBlog as never);

    const response = await GET_BLOG_LIST(
      createRequest(
        "http://localhost/api/v2/admin/blog/read?page=2&limit=4&search=%20Studio%2BNotes%20"
      ) as never
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockBlogFind).toHaveBeenCalledWith(expectedQuery);
    expect(mockBlogCountDocuments).toHaveBeenCalledWith(expectedQuery);
    expect(query.sort).toHaveBeenCalledWith({ displayDate: -1 });
    expect(query.skip).toHaveBeenCalledWith(4);
    expect(query.limit).toHaveBeenCalledWith(4);
    expect(mockTransformBlogPopulated).toHaveBeenCalledWith(rawBlog);
    expect(body).toEqual({
      success: true,
      data: [frontendBlog],
      metadata: {
        page: 2,
        limit: 4,
        total: 9,
        totalPages: 3,
      },
    });
  });

  it("keeps blog search scoped to public title and slug fields when filters are active", async () => {
    const rawBlog = {
      _id: blogId,
      title: "Filtered Studio Notes",
    };
    const frontendBlog = {
      _id: blogId,
      title: "Filtered Studio Notes",
    };
    const expectedQuery = {
      featured: true,
      $or: [
        { title: { $regex: "studio", $options: "i" } },
        { slug: { $regex: "studio", $options: "i" } },
      ],
    };
    const query = createListQuery([rawBlog]);
    mockBlogFind.mockReturnValue(query);
    mockBlogCountDocuments.mockResolvedValue(1);
    mockTransformBlogPopulated.mockReturnValue(frontendBlog as never);

    const response = await GET_BLOG_LIST(
      createRequest(
        "http://localhost/api/v2/admin/blog/read?page=1&limit=10&search=studio&filterKey=featured&filterValue=true"
      ) as never
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockBlogFind).toHaveBeenCalledWith(expectedQuery);
    expect(mockBlogCountDocuments).toHaveBeenCalledWith(expectedQuery);
    expect(body).toEqual({
      success: true,
      data: [frontendBlog],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it("preserves empty-list 404 semantics", async () => {
    mockArtworkFind.mockReturnValue(createListQuery([]));
    mockArtworkCountDocuments.mockResolvedValue(0);

    const response = await GET_ARTWORK_LIST(
      createRequest(
        "http://localhost/api/v2/admin/artwork/read?page=1&limit=10"
      ) as never
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      message: "No artworks found",
      error: "No artworks found",
    });
    expect(mockTransformArtworkToFrontend).not.toHaveBeenCalled();
  });

  it("preserves detail not-found semantics", async () => {
    mockCollectionFindById.mockReturnValue(createPopulatedLeanQuery(null));

    const response = await GET_COLLECTION_DETAIL(
      createRequest() as never,
      createRouteContext(collectionId) as never
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      message: "Collection not found",
      error: "Collection not found",
    });
    expect(mockTransformCollectionPopulated).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 when a target detail read fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockBlogFindById.mockReturnValue(
      createRejectedPopulatedLeanQuery(new Error("private database detail"))
    );

    try {
      const response = await GET_BLOG_DETAIL(
        createRequest() as never,
        createRouteContext(blogId) as never
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to read blog",
        error: "Failed to read blog",
        requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
      });
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

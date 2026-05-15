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
        error: "Failed to read blog",
      });
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

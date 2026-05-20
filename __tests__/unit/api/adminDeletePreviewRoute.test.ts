jest.mock("server-only", () => ({}), { virtual: true });

import { getServerSession } from "next-auth";
import { GET as GET_ARTICLE_PREVIEW } from "@/app/api/v2/admin/article/delete/[id]/preview/route";
import { GET as GET_ARTWORK_PREVIEW } from "@/app/api/v2/admin/artwork/delete/[id]/preview/route";
import { GET as GET_BLOG_PREVIEW } from "@/app/api/v2/admin/blog/delete/[id]/preview/route";
import { GET as GET_COLLECTION_PREVIEW } from "@/app/api/v2/admin/collection/delete/[id]/preview/route";
import { GET as GET_COMMENT_PREVIEW } from "@/app/api/v2/admin/comment/delete/[id]/preview/route";
import { GET as GET_USER_PREVIEW } from "@/app/api/v2/admin/user/delete/[id]/preview/route";
import dbConnect from "@/lib/db/mongodb";
import {
  ArticleModel,
  ArtworkModel,
  BlogModel,
  CollectionModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/preview";

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
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
  ArtworkModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    updateMany: jest.fn(),
  },
  BlogModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateMany: jest.fn(),
  },
  CollectionModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    updateMany: jest.fn(),
  },
  CommentModel: {
    deleteMany: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
  UserModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateMany: jest.fn(),
  },
}));

type MockResponse = {
  status: number;
  headers: Headers;
  json: () => Promise<unknown>;
};

type PreviewHandler = (
  request: never,
  context: { params: { id: string } }
) => Promise<MockResponse>;

type PreviewRouteCase = {
  label: string;
  handler: PreviewHandler;
  validId: string;
  invalidError: string;
  invalidIdError: string;
};

type PreviewSuccessBody = {
  success: true;
  message: string;
  data: AdminDeletePreview;
};

const adminUserId = "507f1f77bcf86cd799439011";
const regularUserId = "507f1f77bcf86cd799439012";
const secondUserId = "507f1f77bcf86cd79943901a";
const articleId = "507f1f77bcf86cd799439013";
const artworkId = "507f1f77bcf86cd799439014";
const blogId = "507f1f77bcf86cd799439015";
const collectionId = "507f1f77bcf86cd799439016";
const commentId = "507f1f77bcf86cd799439017";
const secondCommentId = "507f1f77bcf86cd799439018";
const deletedUserId = "507f1f77bcf86cd799439019";
const favouriteArtworkId = "507f1f77bcf86cd799439020";
const secondCollectionId = "507f1f77bcf86cd799439021";

const createRequest = () => ({
  method: "GET",
  headers: new Headers({ "x-request-id": "req-admin-delete-preview" }),
  url: "http://localhost/api/v2/admin/delete/example/preview",
});

const createRouteContext = (id: string) => ({
  params: {
    id,
  },
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetServerSession = getServerSession as jest.Mock;
const mockArticleFind = ArticleModel.find as jest.Mock;
const mockArticleFindById = ArticleModel.findById as jest.Mock;
const mockArticleFindByIdAndDelete =
  ArticleModel.findByIdAndDelete as jest.Mock;
const mockArticleFindOne = ArticleModel.findOne as jest.Mock;
const mockArtworkFindById = ArtworkModel.findById as jest.Mock;
const mockArtworkFindByIdAndDelete =
  ArtworkModel.findByIdAndDelete as jest.Mock;
const mockArtworkUpdateMany = ArtworkModel.updateMany as jest.Mock;
const mockBlogFindById = BlogModel.findById as jest.Mock;
const mockBlogFindByIdAndDelete = BlogModel.findByIdAndDelete as jest.Mock;
const mockBlogFindByIdAndUpdate = BlogModel.findByIdAndUpdate as jest.Mock;
const mockBlogUpdateMany = BlogModel.updateMany as jest.Mock;
const mockCollectionFind = CollectionModel.find as jest.Mock;
const mockCollectionFindById = CollectionModel.findById as jest.Mock;
const mockCollectionFindByIdAndDelete =
  CollectionModel.findByIdAndDelete as jest.Mock;
const mockCollectionUpdateMany = CollectionModel.updateMany as jest.Mock;
const mockCommentDeleteMany = CommentModel.deleteMany as jest.Mock;
const mockCommentFind = CommentModel.find as jest.Mock;
const mockCommentFindById = CommentModel.findById as jest.Mock;
const mockCommentFindByIdAndDelete =
  CommentModel.findByIdAndDelete as jest.Mock;
const mockUserCountDocuments = UserModel.countDocuments as jest.Mock;
const mockUserFind = UserModel.find as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockUserFindByIdAndDelete = UserModel.findByIdAndDelete as jest.Mock;
const mockUserFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;
const mockUserUpdateMany = UserModel.updateMany as jest.Mock;

const previewRouteCases: PreviewRouteCase[] = [
  {
    label: "article",
    handler: GET_ARTICLE_PREVIEW as PreviewHandler,
    validId: articleId,
    invalidError: "Invalid article input",
    invalidIdError: "Invalid article ID",
  },
  {
    label: "artwork",
    handler: GET_ARTWORK_PREVIEW as PreviewHandler,
    validId: artworkId,
    invalidError: "Invalid artwork input",
    invalidIdError: "Invalid artwork ID",
  },
  {
    label: "blog",
    handler: GET_BLOG_PREVIEW as PreviewHandler,
    validId: blogId,
    invalidError: "Invalid blog input",
    invalidIdError: "Invalid blog ID",
  },
  {
    label: "collection",
    handler: GET_COLLECTION_PREVIEW as PreviewHandler,
    validId: collectionId,
    invalidError: "Invalid collection input",
    invalidIdError: "Invalid collection ID",
  },
  {
    label: "comment",
    handler: GET_COMMENT_PREVIEW as PreviewHandler,
    validId: commentId,
    invalidError: "Invalid comment input",
    invalidIdError: "Invalid comment ID",
  },
  {
    label: "user",
    handler: GET_USER_PREVIEW as PreviewHandler,
    validId: deletedUserId,
    invalidError: "Invalid user input",
    invalidIdError: "Invalid user ID",
  },
];

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

const expectNoPreviewReadWork = () => {
  expect(mockArticleFind).not.toHaveBeenCalled();
  expect(mockArticleFindById).not.toHaveBeenCalled();
  expect(mockArticleFindOne).not.toHaveBeenCalled();
  expect(mockArtworkFindById).not.toHaveBeenCalled();
  expect(mockBlogFindById).not.toHaveBeenCalled();
  expect(mockCollectionFind).not.toHaveBeenCalled();
  expect(mockCollectionFindById).not.toHaveBeenCalled();
  expect(mockCommentFind).not.toHaveBeenCalled();
  expect(mockCommentFindById).not.toHaveBeenCalled();
  expect(mockUserCountDocuments).not.toHaveBeenCalled();
  expect(mockUserFind).not.toHaveBeenCalled();
};

const expectNoMutationWork = () => {
  expect(mockArticleFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockArtworkFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockArtworkUpdateMany).not.toHaveBeenCalled();
  expect(mockBlogFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockBlogUpdateMany).not.toHaveBeenCalled();
  expect(mockCollectionFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockCollectionUpdateMany).not.toHaveBeenCalled();
  expect(mockCommentDeleteMany).not.toHaveBeenCalled();
  expect(mockCommentFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockUserFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockUserUpdateMany).not.toHaveBeenCalled();
};

const getSuccessPreview = async (
  response: MockResponse
): Promise<AdminDeletePreview> => {
  const body = (await response.json()) as PreviewSuccessBody;

  expect(body.success).toBe(true);
  expect(body.message).toBe("Delete preview generated successfully");

  return body.data;
};

describe("admin delete cascade preview routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    setAdminSession();

    mockUserFindById.mockImplementation((id: string) =>
      Promise.resolve(
        id === adminUserId
          ? {
              _id: adminUserId,
              username: "Admin User",
              role: "admin",
              comments: [],
              watchlist: [],
              favourites: [],
            }
          : {
              _id: id,
              username: "Target User",
              role: "user",
              comments: [],
              watchlist: [],
              favourites: [],
            }
      )
    );
    mockUserCountDocuments.mockResolvedValue(2);
    mockUserFind.mockResolvedValue([]);

    mockArticleFindById.mockResolvedValue({
      _id: articleId,
      title: "Archive Article",
      slug: "archive-article",
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/article-cover.jpg",
    });
    mockArticleFind.mockResolvedValue([]);

    mockArtworkFindById.mockResolvedValue({
      _id: artworkId,
      title: "Study in Blue",
      image: {
        public_id: "artwork/study-in-blue",
        secure_url:
          "https://res.cloudinary.com/demo/image/upload/v1/study-in-blue.jpg",
        bytes: 1234,
        format: "jpg",
      },
    });

    mockBlogFindById.mockResolvedValue({
      _id: blogId,
      title: "Studio Notes",
      slug: "studio-notes",
      comments: [],
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/blog-cover.jpg",
    });

    mockCollectionFindById.mockResolvedValue({
      _id: collectionId,
      title: "Early Work",
      slug: "early-work",
      artworks: [],
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/collection-cover.jpg",
    });
    mockCollectionFind.mockResolvedValue([]);

    mockCommentFindById.mockResolvedValue({
      _id: commentId,
      author: regularUserId,
      blog: blogId,
    });
    mockCommentFind.mockResolvedValue([]);
  });

  it.each(previewRouteCases)(
    "returns 401 for unauthenticated $label previews before DB or model work",
    async ({ handler, validId }) => {
      setSession(null);

      const response = await handler(
        createRequest() as never,
        createRouteContext(validId)
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expect(mockUserFindById).not.toHaveBeenCalled();
      expectNoPreviewReadWork();
      expectNoMutationWork();
    }
  );

  it.each(previewRouteCases)(
    "returns 403 for non-admin $label previews before DB or model work",
    async ({ handler, validId }) => {
      setNonAdminSession();

      const response = await handler(
        createRequest() as never,
        createRouteContext(validId)
      );
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({
        success: false,
        message: "Forbidden",
        error: "Forbidden",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expect(mockUserFindById).not.toHaveBeenCalled();
      expectNoPreviewReadWork();
      expectNoMutationWork();
    }
  );

  it.each(previewRouteCases)(
    "returns 400 for invalid $label IDs before preview model work",
    async ({ handler, invalidError, invalidIdError }) => {
      const response = await handler(
        createRequest() as never,
        createRouteContext("not-a-valid-object-id")
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        success: false,
        error: invalidError,
        fieldErrors: {
          id: [invalidIdError],
        },
        formErrors: [],
      });
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expectNoPreviewReadWork();
      expectNoMutationWork();
    }
  );

  it("previews article deletion with target identity and preserved Cloudinary assets", async () => {
    const response = await GET_ARTICLE_PREVIEW(createRequest() as never, {
      params: { id: articleId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockArticleFindById).toHaveBeenCalledWith(articleId);
    expect(preview).toEqual(
      expect.objectContaining({
        resource: "article",
        target: {
          resource: "article",
          id: articleId,
          label: "Archive Article",
          metadata: { slug: "archive-article" },
        },
        blocked: false,
        blockingConditions: [],
      })
    );
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "article",
        count: 1,
      }),
    ]);
    expect(preview.preserved).toEqual([
      expect.objectContaining({
        action: "preserve",
        resource: "cloudinaryAsset",
        count: 1,
      }),
    ]);
    expect(preview.productionEvidenceReminders.map((item) => item.code)).toEqual(
      ["mongodb_backup", "owner_review", "redacted_audit_event"]
    );
    expectNoMutationWork();
  });

  it("previews artwork deletion with collection detaches, preserved user references, and preserved image asset", async () => {
    mockCollectionFind.mockResolvedValue([
      { _id: collectionId, title: "Early Work", slug: "early-work" },
      { _id: secondCollectionId, title: "Late Work", slug: "late-work" },
    ]);
    mockUserFind.mockResolvedValue([
      { _id: regularUserId, username: "Viewer One", role: "user" },
      { _id: secondUserId, username: "Viewer Two", role: "user" },
    ]);

    const response = await GET_ARTWORK_PREVIEW(createRequest() as never, {
      params: { id: artworkId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockArtworkFindById).toHaveBeenCalledWith(artworkId);
    expect(mockArticleFind).toHaveBeenCalledWith({ artwork: artworkId });
    expect(mockCollectionFind).toHaveBeenCalledWith({ artworks: artworkId });
    expect(mockUserFind).toHaveBeenCalledWith({
      $or: [{ watchlist: artworkId }, { favourites: artworkId }],
    });
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "artwork",
        count: 1,
      }),
    ]);
    expect(preview.wouldDetachOrUpdate).toEqual([
      expect.objectContaining({
        action: "detach",
        resource: "collection",
        count: 2,
      }),
    ]);
    expect(preview.preserved).toEqual([
      expect.objectContaining({
        action: "preserve",
        resource: "cloudinaryAsset",
        count: 1,
      }),
      expect.objectContaining({
        action: "preserve",
        resource: "user",
        count: 2,
      }),
    ]);
    expectNoMutationWork();
  });

  it("reports artwork delete blockers without mutating records", async () => {
    mockArticleFind.mockResolvedValue([
      { _id: articleId, title: "Artwork Article", slug: "artwork-article" },
    ]);

    const response = await GET_ARTWORK_PREVIEW(createRequest() as never, {
      params: { id: artworkId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(preview.blocked).toBe(true);
    expect(preview.blockingConditions).toEqual([
      {
        code: "artwork_referenced_by_article",
        message:
          "Artwork deletion is blocked because one or more articles reference this artwork.",
        severity: "blocking",
        records: [
          {
            resource: "article",
            id: articleId,
            label: "Artwork Article",
            metadata: {
              relation: "artwork",
              slug: "artwork-article",
            },
          },
        ],
      },
    ]);
    expectNoMutationWork();
  });

  it("previews blog deletion with associated comment deletes and user comment-reference updates", async () => {
    mockBlogFindById.mockResolvedValue({
      _id: blogId,
      title: "Studio Notes",
      slug: "studio-notes",
      comments: [commentId, secondCommentId],
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/blog-cover.jpg",
    });
    mockCommentFind.mockResolvedValue([
      { _id: commentId, author: regularUserId, blog: blogId },
      { _id: secondCommentId, author: secondUserId, blog: blogId },
    ]);

    const response = await GET_BLOG_PREVIEW(createRequest() as never, {
      params: { id: blogId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockCommentFind).toHaveBeenCalledWith({
      _id: { $in: [commentId, secondCommentId] },
    });
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "blog",
        count: 1,
      }),
      expect.objectContaining({
        action: "delete",
        resource: "comment",
        count: 2,
      }),
    ]);
    expect(preview.wouldDetachOrUpdate).toEqual([
      expect.objectContaining({
        action: "update",
        resource: "user",
        count: 2,
      }),
    ]);
    expect(preview.preserved).toEqual([
      expect.objectContaining({
        action: "preserve",
        resource: "cloudinaryAsset",
        count: 1,
      }),
    ]);
    expectNoMutationWork();
  });

  it("previews collection deletion while preserving artwork records and image assets", async () => {
    mockCollectionFindById.mockResolvedValue({
      _id: collectionId,
      title: "Early Work",
      slug: "early-work",
      artworks: [artworkId, favouriteArtworkId],
      imageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/collection-cover.jpg",
    });

    const response = await GET_COLLECTION_PREVIEW(createRequest() as never, {
      params: { id: collectionId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockCollectionFindById).toHaveBeenCalledWith(collectionId);
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "collection",
        count: 1,
      }),
    ]);
    expect(preview.wouldDetachOrUpdate).toEqual([]);
    expect(preview.preserved).toEqual([
      expect.objectContaining({
        action: "preserve",
        resource: "artwork",
        count: 2,
      }),
      expect.objectContaining({
        action: "preserve",
        resource: "cloudinaryAsset",
        count: 1,
      }),
    ]);
    expectNoMutationWork();
  });

  it("previews comment deletion with user and blog reference updates", async () => {
    const response = await GET_COMMENT_PREVIEW(createRequest() as never, {
      params: { id: commentId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockCommentFindById).toHaveBeenCalledWith(commentId);
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "comment",
        count: 1,
      }),
    ]);
    expect(preview.wouldDetachOrUpdate).toEqual([
      expect.objectContaining({
        action: "update",
        resource: "user",
        count: 1,
      }),
      expect.objectContaining({
        action: "update",
        resource: "blog",
        count: 1,
      }),
    ]);
    expectNoMutationWork();
  });

  it("previews user deletion with comment deletes, blog reference updates, artwork reference updates, and no mutation", async () => {
    mockUserFindById.mockImplementation((id: string) => {
      if (id === adminUserId) {
        return Promise.resolve({
          _id: adminUserId,
          username: "Admin User",
          role: "admin",
          comments: [],
          watchlist: [],
          favourites: [],
        });
      }

      return Promise.resolve({
        _id: deletedUserId,
        username: "Deleted User",
        role: "user",
        comments: [commentId, secondCommentId],
        watchlist: [artworkId],
        favourites: [favouriteArtworkId],
      });
    });
    mockCommentFind.mockResolvedValue([
      { _id: commentId, blog: blogId },
      { _id: secondCommentId, blog: blogId },
    ]);

    const response = await GET_USER_PREVIEW(createRequest() as never, {
      params: { id: deletedUserId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockUserFindById).toHaveBeenCalledWith(deletedUserId);
    expect(mockCommentFind).toHaveBeenCalledWith({
      _id: { $in: [commentId, secondCommentId] },
    });
    expect(preview.wouldDelete).toEqual([
      expect.objectContaining({
        action: "delete",
        resource: "user",
        count: 1,
      }),
      expect.objectContaining({
        action: "delete",
        resource: "comment",
        count: 2,
      }),
    ]);
    expect(preview.wouldDetachOrUpdate).toEqual([
      expect.objectContaining({
        action: "update",
        resource: "blog",
        count: 1,
      }),
      expect.objectContaining({
        action: "update",
        resource: "artwork",
        count: 1,
      }),
      expect.objectContaining({
        action: "update",
        resource: "artwork",
        count: 1,
      }),
    ]);
    expectNoMutationWork();
  });

  it("reports current-admin and last-admin delete blockers", async () => {
    mockUserCountDocuments.mockResolvedValue(1);

    const response = await GET_USER_PREVIEW(createRequest() as never, {
      params: { id: adminUserId },
    });
    const preview = await getSuccessPreview(response);

    expect(response.status).toBe(200);
    expect(mockUserCountDocuments).toHaveBeenCalledWith({ role: "admin" });
    expect(preview.blocked).toBe(true);
    expect(preview.blockingConditions.map((blocker) => blocker.code)).toEqual([
      "current_admin_account",
      "last_admin_account",
    ]);
    expectNoMutationWork();
  });
});

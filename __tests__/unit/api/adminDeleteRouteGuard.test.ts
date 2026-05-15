import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { DELETE as DELETE_ARTICLE } from "@/app/api/v2/admin/article/delete/[id]/route";
import { DELETE as DELETE_ARTWORK } from "@/app/api/v2/admin/artwork/delete/[id]/route";
import { DELETE as DELETE_BLOG } from "@/app/api/v2/admin/blog/delete/[id]/route";
import { DELETE as DELETE_COLLECTION } from "@/app/api/v2/admin/collection/delete/[id]/route";
import { DELETE as DELETE_COMMENT } from "@/app/api/v2/admin/comment/delete/[id]/route";
import { DELETE as DELETE_USER } from "@/app/api/v2/admin/user/delete/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import {
  ArticleModel,
  ArtworkModel,
  BlogModel,
  CollectionModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";

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

jest.mock("mongoose", () => {
  const startSession = jest.fn();
  return {
    __esModule: true,
    default: {
      startSession,
    },
    startSession,
  };
});

jest.mock("@/lib/data/models", () => ({
  ArticleModel: {
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
  ArtworkModel: {
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
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateMany: jest.fn(),
  },
}));

type MockResponse = {
  status: number;
  json: () => Promise<unknown>;
};

type DeleteHandler = (
  request: never,
  context: { params: { id: string } }
) => Promise<MockResponse>;

type DeleteRouteCase = {
  label: string;
  handler: DeleteHandler;
  validId: string;
  invalidError: string;
  invalidIdError: string;
};

const adminUserId = "507f1f77bcf86cd799439011";
const regularUserId = "507f1f77bcf86cd799439012";
const articleId = "507f1f77bcf86cd799439013";
const artworkId = "507f1f77bcf86cd799439014";
const blogId = "507f1f77bcf86cd799439015";
const collectionId = "507f1f77bcf86cd799439016";
const commentId = "507f1f77bcf86cd799439017";
const deletedUserId = "507f1f77bcf86cd799439018";
const favouriteArtworkId = "507f1f77bcf86cd799439019";

const createRequest = () => ({});

const createRouteContext = (id: string) => ({
  params: {
    id,
  },
});

const createMongoSession = () => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  abortTransaction: jest.fn().mockResolvedValue(undefined),
  endSession: jest.fn(),
});

const createSessionQuery = (result: unknown) => ({
  session: jest.fn().mockResolvedValue(result),
});

const createRejectedSessionQuery = (error: unknown) => ({
  session: jest.fn().mockRejectedValue(error),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetServerSession = getServerSession as jest.Mock;
const mockStartSession = mongoose.startSession as jest.Mock;
const mockArticleFindByIdAndDelete =
  ArticleModel.findByIdAndDelete as jest.Mock;
const mockArticleFindOne = ArticleModel.findOne as jest.Mock;
const mockArtworkFindByIdAndDelete =
  ArtworkModel.findByIdAndDelete as jest.Mock;
const mockArtworkUpdateMany = ArtworkModel.updateMany as jest.Mock;
const mockBlogFindById = BlogModel.findById as jest.Mock;
const mockBlogFindByIdAndDelete = BlogModel.findByIdAndDelete as jest.Mock;
const mockBlogFindByIdAndUpdate = BlogModel.findByIdAndUpdate as jest.Mock;
const mockBlogUpdateMany = BlogModel.updateMany as jest.Mock;
const mockCollectionFindByIdAndDelete =
  CollectionModel.findByIdAndDelete as jest.Mock;
const mockCollectionUpdateMany = CollectionModel.updateMany as jest.Mock;
const mockCommentDeleteMany = CommentModel.deleteMany as jest.Mock;
const mockCommentFind = CommentModel.find as jest.Mock;
const mockCommentFindById = CommentModel.findById as jest.Mock;
const mockCommentFindByIdAndDelete =
  CommentModel.findByIdAndDelete as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockUserFindByIdAndDelete = UserModel.findByIdAndDelete as jest.Mock;
const mockUserFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;
const mockUserUpdateMany = UserModel.updateMany as jest.Mock;

const deleteRouteCases: DeleteRouteCase[] = [
  {
    label: "article",
    handler: DELETE_ARTICLE as DeleteHandler,
    validId: articleId,
    invalidError: "Invalid article input",
    invalidIdError: "Invalid article ID",
  },
  {
    label: "artwork",
    handler: DELETE_ARTWORK as DeleteHandler,
    validId: artworkId,
    invalidError: "Invalid artwork input",
    invalidIdError: "Invalid artwork ID",
  },
  {
    label: "blog",
    handler: DELETE_BLOG as DeleteHandler,
    validId: blogId,
    invalidError: "Invalid blog input",
    invalidIdError: "Invalid blog ID",
  },
  {
    label: "collection",
    handler: DELETE_COLLECTION as DeleteHandler,
    validId: collectionId,
    invalidError: "Invalid collection input",
    invalidIdError: "Invalid collection ID",
  },
  {
    label: "comment",
    handler: DELETE_COMMENT as DeleteHandler,
    validId: commentId,
    invalidError: "Invalid comment input",
    invalidIdError: "Invalid comment ID",
  },
  {
    label: "user",
    handler: DELETE_USER as DeleteHandler,
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

const expectNoDestructiveModelWork = () => {
  expect(mockArticleFindOne).not.toHaveBeenCalled();
  expect(mockArticleFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockArtworkFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockArtworkUpdateMany).not.toHaveBeenCalled();
  expect(mockBlogFindById).not.toHaveBeenCalled();
  expect(mockBlogFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockBlogUpdateMany).not.toHaveBeenCalled();
  expect(mockCollectionFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockCollectionUpdateMany).not.toHaveBeenCalled();
  expect(mockCommentDeleteMany).not.toHaveBeenCalled();
  expect(mockCommentFind).not.toHaveBeenCalled();
  expect(mockCommentFindById).not.toHaveBeenCalled();
  expect(mockCommentFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockUserFindByIdAndDelete).not.toHaveBeenCalled();
  expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
  expect(mockUserUpdateMany).not.toHaveBeenCalled();
};

describe("admin delete route shared guard migration", () => {
  let mongoSession: ReturnType<typeof createMongoSession>;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mongoSession = createMongoSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockStartSession.mockResolvedValue(mongoSession);
    setAdminSession();
    mockUserFindById.mockResolvedValue({ role: "admin" });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it.each(deleteRouteCases)(
    "returns 401 for unauthenticated $label deletes before DB or model work",
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
      expect(mockStartSession).not.toHaveBeenCalled();
      expectNoDestructiveModelWork();
    }
  );

  it.each(deleteRouteCases)(
    "returns 403 for non-admin $label deletes before DB or model work",
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
      expect(mockStartSession).not.toHaveBeenCalled();
      expectNoDestructiveModelWork();
    }
  );

  it.each(deleteRouteCases)(
    "returns 400 for invalid $label IDs before route-local destructive work",
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
      expect(mockStartSession).not.toHaveBeenCalled();
      expectNoDestructiveModelWork();
    }
  );

  it("deletes an article with the existing success envelope", async () => {
    mockArticleFindByIdAndDelete.mockResolvedValue({ _id: articleId });

    const response = await DELETE_ARTICLE(createRequest() as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockArticleFindByIdAndDelete).toHaveBeenCalledWith(articleId);
    expect(body).toEqual({
      success: true,
      data: null,
      message: "Article deleted successfully",
    });
  });

  it("preserves collection not-found behavior", async () => {
    mockCollectionFindByIdAndDelete.mockResolvedValue(null);

    const response = await DELETE_COLLECTION(createRequest() as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      error: "Collection not found",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockCollectionFindByIdAndDelete).toHaveBeenCalledWith(collectionId);
  });

  it("blocks artwork deletion when an article references it", async () => {
    mockArticleFindOne.mockResolvedValue({ _id: articleId });

    const response = await DELETE_ARTWORK(createRequest() as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({
      success: false,
      message: `Cannot delete artwork: It is currently used in a article with id ${articleId}`,
      error: "Cannot delete artwork: It is currently used in a article",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockStartSession).toHaveBeenCalledTimes(1);
    expect(mongoSession.startTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.commitTransaction).not.toHaveBeenCalled();
    expect(mongoSession.endSession).toHaveBeenCalledTimes(1);
    expect(mockArtworkFindByIdAndDelete).not.toHaveBeenCalled();
    expect(mockCollectionUpdateMany).not.toHaveBeenCalled();
  });

  it("deletes artwork and removes it from collections", async () => {
    mockArticleFindOne.mockResolvedValue(null);
    mockArtworkFindByIdAndDelete.mockReturnValue(
      createSessionQuery({ _id: artworkId })
    );
    mockCollectionUpdateMany.mockReturnValue(
      createSessionQuery({ modifiedCount: 2 })
    );

    const response = await DELETE_ARTWORK(createRequest() as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockArticleFindOne).toHaveBeenCalledWith({ artwork: artworkId });
    expect(mockArtworkFindByIdAndDelete).toHaveBeenCalledWith(artworkId);
    expect(mockCollectionUpdateMany).toHaveBeenCalledWith(
      { artworks: artworkId },
      { $pull: { artworks: artworkId } }
    );
    expect(mongoSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).not.toHaveBeenCalled();
    expect(mongoSession.endSession).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      success: true,
      message: "Artwork deleted and removed from collections successfully",
      data: null,
    });
  });

  it("deletes a blog and cascades associated comments from users", async () => {
    const blog = { _id: blogId, comments: [commentId] };
    mockBlogFindById.mockReturnValue(createSessionQuery(blog));
    mockCommentFind.mockReturnValue(
      createSessionQuery([{ _id: commentId, author: regularUserId }])
    );
    mockUserUpdateMany.mockResolvedValue({ modifiedCount: 1 });
    mockCommentDeleteMany.mockReturnValue(
      createSessionQuery({ deletedCount: 1 })
    );
    mockBlogFindByIdAndDelete.mockReturnValue(
      createSessionQuery({ _id: blogId })
    );

    const response = await DELETE_BLOG(createRequest() as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockCommentFind).toHaveBeenCalledWith({
      _id: { $in: [commentId] },
    });
    expect(mockUserUpdateMany).toHaveBeenCalledWith(
      { _id: { $in: [regularUserId] } },
      { $pull: { comments: { $in: [commentId] } } },
      { session: mongoSession }
    );
    expect(mockCommentDeleteMany).toHaveBeenCalledWith({
      _id: { $in: [commentId] },
    });
    expect(mockBlogFindByIdAndDelete).toHaveBeenCalledWith(blogId);
    expect(mongoSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: true,
      data: null,
      message: "Blog and associated comments deleted successfully",
    });
  });

  it("deletes a comment and removes it from the related user and blog", async () => {
    const comment = {
      _id: commentId,
      author: regularUserId,
      blog: blogId,
    };
    mockCommentFindById.mockReturnValue(createSessionQuery(comment));
    mockUserFindByIdAndUpdate.mockResolvedValue({ _id: regularUserId });
    mockBlogFindByIdAndUpdate.mockResolvedValue({ _id: blogId });
    mockCommentFindByIdAndDelete.mockReturnValue(
      createSessionQuery({ _id: commentId })
    );

    const response = await DELETE_COMMENT(createRequest() as never, {
      params: { id: commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockCommentFindById).toHaveBeenCalledWith(commentId);
    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      regularUserId,
      { $pull: { comments: commentId } },
      { session: mongoSession }
    );
    expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
      blogId,
      { $pull: { comments: commentId } },
      { session: mongoSession }
    );
    expect(mockCommentFindByIdAndDelete).toHaveBeenCalledWith(commentId);
    expect(mongoSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: true,
      data: null,
      message: "Comment deleted successfully",
    });
  });

  it("deletes a user and cascades comments plus saved-item references", async () => {
    const deletedUser = {
      _id: deletedUserId,
      comments: [commentId],
      watchlist: [artworkId],
      favourites: [favouriteArtworkId],
    };
    mockUserFindById.mockImplementation((id: string) => {
      if (id === adminUserId) {
        return Promise.resolve({ role: "admin" });
      }

      return createSessionQuery(deletedUser);
    });
    mockCommentFind.mockReturnValue(
      createSessionQuery([{ _id: commentId, blog: blogId }])
    );
    mockBlogUpdateMany.mockResolvedValue({ modifiedCount: 1 });
    mockCommentDeleteMany.mockReturnValue(
      createSessionQuery({ deletedCount: 1 })
    );
    mockArtworkUpdateMany.mockResolvedValue({ modifiedCount: 1 });
    mockUserFindByIdAndDelete.mockReturnValue(
      createSessionQuery({ _id: deletedUserId })
    );

    const response = await DELETE_USER(createRequest() as never, {
      params: { id: deletedUserId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockUserFindById).toHaveBeenCalledWith(deletedUserId);
    expect(mockCommentFind).toHaveBeenCalledWith({
      _id: { $in: [commentId] },
    });
    expect(mockBlogUpdateMany).toHaveBeenCalledWith(
      { _id: { $in: [blogId] } },
      { $pull: { comments: { $in: [commentId] } } },
      { session: mongoSession }
    );
    expect(mockCommentDeleteMany).toHaveBeenCalledWith({
      _id: { $in: [commentId] },
    });
    expect(mockArtworkUpdateMany).toHaveBeenNthCalledWith(
      1,
      { _id: { $in: [artworkId] } },
      { $pull: { watcherlist: deletedUserId } },
      { session: mongoSession }
    );
    expect(mockArtworkUpdateMany).toHaveBeenNthCalledWith(
      2,
      { _id: { $in: [favouriteArtworkId] } },
      { $pull: { favourited: deletedUserId } },
      { session: mongoSession }
    );
    expect(mockUserFindByIdAndDelete).toHaveBeenCalledWith(deletedUserId);
    expect(mongoSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: true,
      data: null,
      message: "User and associated data deleted successfully",
    });
  });

  it("aborts a transaction and returns a public-safe 500 on cascade failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockBlogFindById.mockReturnValue(
      createSessionQuery({ _id: blogId, comments: [commentId] })
    );
    mockCommentFind.mockReturnValue(
      createSessionQuery([{ _id: commentId, author: regularUserId }])
    );
    mockUserUpdateMany.mockRejectedValue(new Error("private database detail"));

    try {
      const response = await DELETE_BLOG(createRequest() as never, {
        params: { id: blogId },
      });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        error: "Failed to delete blog and associated data",
      });
      expect(JSON.stringify(body)).not.toContain("private database detail");
      expect(mongoSession.abortTransaction).toHaveBeenCalledTimes(1);
      expect(mongoSession.commitTransaction).not.toHaveBeenCalled();
      expect(mongoSession.endSession).toHaveBeenCalledTimes(1);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it("returns a public-safe 500 when non-transactional delete work fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArticleFindByIdAndDelete.mockRejectedValue(
      new Error("private article detail")
    );

    try {
      const response = await DELETE_ARTICLE(createRequest() as never, {
        params: { id: articleId },
      });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        error: "Failed to delete article",
      });
      expect(JSON.stringify(body)).not.toContain("private article detail");
      expect(mockStartSession).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

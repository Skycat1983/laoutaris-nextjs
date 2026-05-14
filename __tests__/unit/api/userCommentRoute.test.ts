import mongoose from "mongoose";
import { POST } from "@/app/api/v2/user/comment/route";
import { PATCH } from "@/app/api/v2/user/comment/[commentId]/route";
import dbConnect from "@/lib/db/mongodb";
import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformCommentPopulated } from "@/lib/transforms";

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

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
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
    isValidObjectId: jest.fn((value: string) =>
      /^[0-9a-fA-F]{24}$/.test(value)
    ),
  };
});

jest.mock("@/lib/data/models", () => ({
  BlogModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  CommentModel: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    startSession: jest.fn(),
  },
  UserModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCommentPopulated: jest.fn(),
}));

type MockRequest = {
  json: jest.Mock;
};

const userId = "507f1f77bcf86cd799439011";
const otherUserId = "507f1f77bcf86cd799439012";
const blogId = "507f1f77bcf86cd799439013";
const commentId = "507f1f77bcf86cd799439014";
const blogSlug = "studio-notes";

const createRequest = (body: unknown): MockRequest => ({
  json: jest.fn().mockResolvedValue(body),
});

const createInvalidJsonRequest = (): MockRequest => ({
  json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
});

const createMongoSession = () => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  abortTransaction: jest.fn().mockResolvedValue(undefined),
  endSession: jest.fn(),
});

const createSessionLeanQuery = (result: unknown) => ({
  session: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
});

const createPopulateQuery = (result: unknown) => ({
  populate: jest.fn().mockResolvedValue(result),
});

const createPopulatedLeanQuery = (result: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
});

const populatedComment = {
  _id: commentId,
  text: "Trimmed comment",
  author: {
    _id: userId,
    username: "ada",
  },
  blog: {
    _id: blogId,
    slug: blogSlug,
    title: "Studio Notes",
    comments: [commentId],
  },
  displayDate: new Date("2026-05-14T12:00:00.000Z"),
};

const frontendComment = {
  _id: commentId,
  text: "Trimmed comment",
  author: {
    _id: userId,
    username: "ada",
  },
  blog: {
    _id: blogId,
    slug: blogSlug,
    title: "Studio Notes",
  },
  displayDate: new Date("2026-05-14T12:00:00.000Z"),
  isOwner: true,
};

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetUserIdFromSession =
  getUserIdFromSession as jest.MockedFunction<typeof getUserIdFromSession>;
const mockBlogFindOne = BlogModel.findOne as jest.Mock;
const mockBlogFindByIdAndUpdate = BlogModel.findByIdAndUpdate as jest.Mock;
const mockCommentCreate = CommentModel.create as jest.Mock;
const mockCommentFindById = CommentModel.findById as jest.Mock;
const mockCommentFindByIdAndUpdate =
  CommentModel.findByIdAndUpdate as jest.Mock;
const mockUserFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;
const mockTransformCommentPopulated =
  transformCommentPopulated as jest.MockedFunction<
    typeof transformCommentPopulated
  >;
const mockStartSession = mongoose.startSession as jest.Mock;

describe("POST /api/v2/user/comment", () => {
  let mongoSession: ReturnType<typeof createMongoSession>;

  beforeEach(() => {
    jest.clearAllMocks();
    mongoSession = createMongoSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockStartSession.mockResolvedValue(mongoSession as never);
    mockBlogFindOne.mockResolvedValue({ _id: blogId });
    mockCommentCreate.mockResolvedValue([{ _id: commentId }]);
    mockCommentFindById.mockReturnValue(
      createSessionLeanQuery(populatedComment)
    );
    mockBlogFindByIdAndUpdate.mockResolvedValue({ _id: blogId });
    mockUserFindByIdAndUpdate.mockResolvedValue({ _id: userId });
    mockTransformCommentPopulated.mockReturnValue(frontendComment as never);
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);
    const request = createRequest({
      text: "Valid comment",
      blogSlug,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      error: "Authentication required",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCommentCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not start persistence work", async () => {
    const request = createInvalidJsonRequest();

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid comment input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(request.json).toHaveBeenCalledTimes(1);
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockStartSession).not.toHaveBeenCalled();
  });

  it("returns 400 for blank comment text and does not write to MongoDB", async () => {
    const request = createRequest({
      text: "   ",
      blogSlug,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid comment input",
      fieldErrors: {
        text: ["Comment cannot be empty"],
      },
      formErrors: [],
    });
    expect(request.json).toHaveBeenCalledTimes(1);
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCommentCreate).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown blog slug", async () => {
    mockBlogFindOne.mockResolvedValue(null);
    const request = createRequest({
      text: "  Valid comment  ",
      blogSlug: `  ${blogSlug}  `,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      error: "Blog not found",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockBlogFindOne).toHaveBeenCalledWith({ slug: blogSlug });
    expect(mockStartSession).not.toHaveBeenCalled();
    expect(mockCommentCreate).not.toHaveBeenCalled();
  });

  it("creates a trimmed comment and returns a transformed frontend DTO", async () => {
    const request = createRequest({
      text: "  Trimmed comment  ",
      blogSlug: `  ${blogSlug}  `,
      role: "admin",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(request.json).toHaveBeenCalledTimes(1);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mongoSession.startTransaction).toHaveBeenCalledTimes(1);
    expect(mockCommentCreate).toHaveBeenCalledWith(
      [
        {
          text: "Trimmed comment",
          author: userId,
          blog: blogId,
          displayDate: expect.any(Date),
        },
      ],
      { session: mongoSession }
    );
    expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
      blogId,
      { $push: { comments: commentId } },
      { session: mongoSession }
    );
    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $push: { comments: commentId } },
      { session: mongoSession }
    );
    expect(mockTransformCommentPopulated).toHaveBeenCalledWith(
      populatedComment,
      userId
    );
    expect(mongoSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mongoSession.abortTransaction).not.toHaveBeenCalled();
    expect(mongoSession.endSession).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      success: true,
      data: frontendComment,
    });
  });

  it("aborts the transaction and returns 500 when a linked update fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockUserFindByIdAndUpdate.mockRejectedValue(new Error("private DB detail"));
    const request = createRequest({
      text: "Valid comment",
      blogSlug,
    });

    try {
      const response = await POST(request as never);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        error: "Failed to create comment",
      });
      expect(mongoSession.abortTransaction).toHaveBeenCalledTimes(1);
      expect(mongoSession.commitTransaction).not.toHaveBeenCalled();
      expect(mongoSession.endSession).toHaveBeenCalledTimes(1);
      expect(mockTransformCommentPopulated).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error creating comment:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("PATCH /api/v2/user/comment/[commentId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockCommentFindById.mockReturnValue(
      createPopulateQuery({
        _id: commentId,
        author: {
          _id: {
            toString: () => userId,
          },
        },
      })
    );
    mockCommentFindByIdAndUpdate.mockReturnValue(
      createPopulatedLeanQuery(populatedComment)
    );
    mockTransformCommentPopulated.mockReturnValue(frontendComment as never);
  });

  it("returns 401 for unauthenticated callers", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);
    const request = createRequest({ text: "Updated comment" });

    const response = await PATCH(request as never, {
      params: { commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      error: "Unauthorized",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid comment ID before reading the body", async () => {
    const request = createRequest({ text: "Updated comment" });

    const response = await PATCH(request as never, {
      params: { commentId: "not-an-object-id" },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid comment input",
      fieldErrors: {
        commentId: ["Invalid comment ID"],
      },
      formErrors: [],
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const request = createInvalidJsonRequest();

    const response = await PATCH(request as never, {
      params: { commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid comment input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(request.json).toHaveBeenCalledTimes(1);
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it.each([
    ["blank", "   ", "Comment cannot be empty"],
    [
      "overlong",
      "x".repeat(1001),
      "Comment must be less than 1000 characters",
    ],
  ])("returns 400 for %s comment text", async (_label, text, message) => {
    const request = createRequest({ text });

    const response = await PATCH(request as never, {
      params: { commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid comment input",
      fieldErrors: {
        text: [message],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCommentFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 403 when the authenticated user does not own the comment", async () => {
    mockCommentFindById.mockReturnValue(
      createPopulateQuery({
        _id: commentId,
        author: {
          _id: {
            toString: () => otherUserId,
          },
        },
      })
    );
    const request = createRequest({ text: "Updated comment" });

    const response = await PATCH(request as never, {
      params: { commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      error: "Not authorized to edit this comment",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockCommentFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("updates with trimmed text and returns a transformed frontend DTO", async () => {
    const request = createRequest({ text: "  Trimmed comment  " });

    const response = await PATCH(request as never, {
      params: { commentId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockCommentFindByIdAndUpdate).toHaveBeenCalledWith(
      commentId,
      { $set: { text: "Trimmed comment" } },
      { new: true, runValidators: true }
    );
    expect(mockTransformCommentPopulated).toHaveBeenCalledWith(
      populatedComment,
      userId
    );
    expect(body).toEqual({
      success: true,
      data: frontendComment,
    });
  });
});

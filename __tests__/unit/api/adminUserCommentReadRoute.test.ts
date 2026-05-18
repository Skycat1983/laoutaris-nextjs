import { GET as GET_COMMENT } from "@/app/api/v2/admin/comment/read/[id]/route";
import { GET as GET_USER } from "@/app/api/v2/admin/user/read/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { CommentModel, UserModel } from "@/lib/data/models";
import { transformCommentPopulated, transformUser } from "@/lib/transforms";
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
  CommentModel: {
    findById: jest.fn(),
  },
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCommentPopulated: jest.fn(),
  transformUser: {
    toFrontend: jest.fn(),
  },
}));

const adminUserId = "507f1f77bcf86cd799439011";
const regularUserId = "507f1f77bcf86cd799439012";
const targetUserId = "507f1f77bcf86cd799439013";
const commentId = "507f1f77bcf86cd799439014";
const blogId = "507f1f77bcf86cd799439015";

const rawUser = {
  _id: targetUserId,
  username: "archive-admin",
  email: "private@example.com",
  role: "user",
  password: "secret",
};

const frontendUser = {
  _id: targetUserId,
  username: "archive-admin",
  role: "user",
  isOwner: false,
};

const rawComment = {
  _id: commentId,
  text: "Useful archive note",
  author: {
    _id: regularUserId,
    username: "commenter",
  },
  blog: {
    _id: blogId,
    slug: "studio-notes",
    title: "Studio Notes",
  },
};

const frontendComment = {
  _id: commentId,
  text: "Useful archive note",
  author: {
    _id: regularUserId,
    username: "commenter",
    isOwner: false,
  },
  blog: {
    _id: blogId,
    slug: "studio-notes",
    title: "Studio Notes",
  },
  isOwner: false,
};

const createRouteContext = (id: string) => ({
  params: {
    id,
  },
});

const createLeanQuery = (result: unknown) => ({
  lean: jest.fn().mockResolvedValue(result),
});

const createRejectedLeanQuery = (error: unknown) => ({
  lean: jest.fn().mockRejectedValue(error),
});

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
const mockCommentFindById = CommentModel.findById as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
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

describe("admin user/comment detail read routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockTransformUserToFrontend.mockReturnValue(frontendUser);
    mockTransformCommentPopulated.mockReturnValue(frontendComment as never);
  });

  it.each([
    ["user", GET_USER, targetUserId],
    ["comment", GET_COMMENT, commentId],
  ])(
    "returns 401 for unauthenticated %s detail callers before target reads",
    async (_label, handler, id) => {
      setSession(null);

      const response = await handler({} as never, createRouteContext(id));
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expect(mockUserFindById).not.toHaveBeenCalled();
      expect(mockCommentFindById).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["user", GET_USER, targetUserId],
    ["comment", GET_COMMENT, commentId],
  ])(
    "returns 403 for non-admin %s detail callers before target reads",
    async (_label, handler, id) => {
      setNonAdminSession();

      const response = await handler({} as never, createRouteContext(id));
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({
        success: false,
        message: "Forbidden",
        error: "Forbidden",
      });
      expect(mockDbConnect).not.toHaveBeenCalled();
      expect(mockUserFindById).not.toHaveBeenCalled();
      expect(mockCommentFindById).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["user", GET_USER, "Invalid user input", "Invalid user ID"],
    ["comment", GET_COMMENT, "Invalid comment input", "Invalid comment ID"],
  ])(
    "returns 400 for invalid %s detail IDs before target reads",
    async (_label, handler, error, idError) => {
      mockUserFindById.mockResolvedValue({ role: "admin" });

      const response = await handler(
        {} as never,
        createRouteContext("not-a-valid-id")
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
      expect(mockUserFindById).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockCommentFindById).not.toHaveBeenCalled();
    }
  );

  it("returns a transformed user detail result", async () => {
    const targetQuery = createLeanQuery(rawUser);
    mockUserFindById
      .mockResolvedValueOnce({ role: "admin" })
      .mockReturnValueOnce(targetQuery);

    const response = await GET_USER(
      {} as never,
      createRouteContext(targetUserId)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenNthCalledWith(1, adminUserId);
    expect(mockUserFindById).toHaveBeenNthCalledWith(2, targetUserId);
    expect(targetQuery.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformUserToFrontend).toHaveBeenCalledWith(rawUser);
    expect(body).toEqual({
      success: true,
      data: frontendUser,
    });
  });

  it("returns 404 when the requested user does not exist", async () => {
    mockUserFindById
      .mockResolvedValueOnce({ role: "admin" })
      .mockReturnValueOnce(createLeanQuery(null));

    const response = await GET_USER(
      {} as never,
      createRouteContext(targetUserId)
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      message: "User not found",
      error: "User not found",
    });
    expect(mockTransformUserToFrontend).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 when the user target read fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockUserFindById
      .mockResolvedValueOnce({ role: "admin" })
      .mockReturnValueOnce(
        createRejectedLeanQuery(new Error("private database detail"))
      );

    try {
      const response = await GET_USER(
        {} as never,
        createRouteContext(targetUserId)
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to read user",
        error: "Failed to read user",
        requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
      });
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it("returns a transformed populated comment detail result", async () => {
    mockUserFindById.mockResolvedValue({ role: "admin" });
    const targetQuery = createPopulatedLeanQuery(rawComment);
    mockCommentFindById.mockReturnValue(targetQuery);

    const response = await GET_COMMENT(
      {} as never,
      createRouteContext(commentId)
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockCommentFindById).toHaveBeenCalledWith(commentId);
    expect(targetQuery.populate).toHaveBeenCalledWith("author blog");
    expect(targetQuery.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformCommentPopulated).toHaveBeenCalledWith(rawComment);
    expect(body).toEqual({
      success: true,
      data: frontendComment,
    });
  });

  it("returns 404 when the requested comment does not exist", async () => {
    mockUserFindById.mockResolvedValue({ role: "admin" });
    mockCommentFindById.mockReturnValue(createPopulatedLeanQuery(null));

    const response = await GET_COMMENT(
      {} as never,
      createRouteContext(commentId)
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      success: false,
      message: "Comment not found",
      error: "Comment not found",
    });
    expect(mockTransformCommentPopulated).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 when the comment target read fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockUserFindById.mockResolvedValue({ role: "admin" });
    mockCommentFindById.mockReturnValue(
      createRejectedPopulatedLeanQuery(new Error("private database detail"))
    );

    try {
      const response = await GET_COMMENT(
        {} as never,
        createRouteContext(commentId)
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        message: "Failed to read comment",
        error: "Failed to read comment",
        requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
      });
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

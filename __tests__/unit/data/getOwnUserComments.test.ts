jest.mock("server-only", () => ({}), { virtual: true });

import { UserModel } from "@/lib/data/models/userModel";
import { getOwnUserComments } from "@/lib/data/services/getOwnUserComments";
import dbConnect from "@/lib/db/mongodb";
import { transformCommentPopulated } from "@/lib/transforms";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/userModel", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms", () => ({
  transformCommentPopulated: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockTransformCommentPopulated =
  transformCommentPopulated as jest.MockedFunction<
    typeof transformCommentPopulated
  >;

const userId = "507f1f77bcf86cd799439011";

const createCommentsQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedCommentsQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.populate.mockReturnValue(query);
  return query;
};

describe("getOwnUserComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("loads current-user comments with DB ownership, population, transforms, and list metadata", async () => {
    const comments = [
      { _id: "comment-1", text: "One" },
      { _id: "comment-2", text: "Two" },
    ];
    const frontendComments = [
      { _id: "comment-1", text: "One", isOwner: true },
      { _id: "comment-2", text: "Two", isOwner: true },
    ];
    const query = createCommentsQuery({ _id: userId, comments });
    mockUserFindById.mockReturnValue(query);
    mockTransformCommentPopulated
      .mockReturnValueOnce(frontendComments[0] as never)
      .mockReturnValueOnce(frontendComments[1] as never);

    await expect(getOwnUserComments(userId)).resolves.toEqual({
      comments: frontendComments,
      metadata: {
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockUserFindById.mock.invocationCallOrder[0]
    );
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(query.select).toHaveBeenCalledWith("comments");
    expect(query.populate).toHaveBeenCalledWith({
      path: "comments",
      populate: [
        {
          path: "blog",
          model: "Blog",
        },
        {
          path: "author",
          model: "User",
        },
      ],
    });
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformCommentPopulated).toHaveBeenNthCalledWith(
      1,
      comments[0],
      userId
    );
    expect(mockTransformCommentPopulated).toHaveBeenNthCalledWith(
      2,
      comments[1],
      userId
    );
  });

  it("returns empty list metadata for users with no comments", async () => {
    mockUserFindById.mockReturnValue(
      createCommentsQuery({ _id: userId, comments: [] })
    );

    await expect(getOwnUserComments(userId)).resolves.toEqual({
      comments: [],
      metadata: {
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 1,
      },
    });

    expect(mockTransformCommentPopulated).not.toHaveBeenCalled();
  });

  it("returns null when the current user no longer exists", async () => {
    mockUserFindById.mockReturnValue(createCommentsQuery(null));

    await expect(getOwnUserComments(userId)).resolves.toBeNull();

    expect(mockTransformCommentPopulated).not.toHaveBeenCalled();
  });

  it("rejects when comment persistence fails", async () => {
    const error = new Error("private comment failure");
    mockUserFindById.mockReturnValue(createRejectedCommentsQuery(error));

    await expect(getOwnUserComments(userId)).rejects.toThrow(error);

    expect(mockTransformCommentPopulated).not.toHaveBeenCalled();
  });
});

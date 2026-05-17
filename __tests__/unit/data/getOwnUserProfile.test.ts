jest.mock("server-only", () => ({}), { virtual: true });

import { UserModel } from "@/lib/data/models/userModel";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
import dbConnect from "@/lib/db/mongodb";
import { transformOwnUser } from "@/lib/transforms";

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
  transformOwnUser: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockTransformOwnUserToFrontend = transformOwnUser.toFrontend as jest.Mock;

const userId = "507f1f77bcf86cd799439011";

const createProfileQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  return query;
};

const createRejectedProfileQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  return query;
};

describe("getOwnUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, excludes password, and returns the own-user frontend DTO", async () => {
    const leanUser = {
      _id: userId,
      username: "joseph",
      email: "joseph@example.com",
      role: "user",
      favourites: ["art-1"],
      watchlist: ["art-2"],
      comments: ["comment-1"],
    };
    const profile = {
      ...leanUser,
      favouritedCount: 1,
      watchlistCount: 1,
      commentCount: 1,
    };
    const query = createProfileQuery(leanUser);
    mockUserFindById.mockReturnValue(query);
    mockTransformOwnUserToFrontend.mockReturnValue(profile);

    await expect(getOwnUserProfile(userId)).resolves.toEqual(profile);

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockUserFindById.mock.invocationCallOrder[0]
    );
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(query.select).toHaveBeenCalledWith("-password");
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformOwnUserToFrontend).toHaveBeenCalledWith(
      leanUser,
      userId
    );
  });

  it("returns null when the current user no longer exists", async () => {
    mockUserFindById.mockReturnValue(createProfileQuery(null));

    await expect(getOwnUserProfile(userId)).resolves.toBeNull();

    expect(mockTransformOwnUserToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when profile persistence fails", async () => {
    const error = new Error("private profile failure");
    mockUserFindById.mockReturnValue(createRejectedProfileQuery(error));

    await expect(getOwnUserProfile(userId)).rejects.toThrow(error);

    expect(mockTransformOwnUserToFrontend).not.toHaveBeenCalled();
  });
});

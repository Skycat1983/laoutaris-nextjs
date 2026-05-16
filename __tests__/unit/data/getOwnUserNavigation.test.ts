jest.mock("server-only", () => ({}), { virtual: true });

import { UserModel } from "@/lib/data/models/userModel";
import { getOwnUserNavigation } from "@/lib/data/services/getOwnUserNavigation";
import dbConnect from "@/lib/db/mongodb";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/userModel", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformAccountNav: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockTransformAccountNavToFrontend =
  transformAccountNav.toFrontend as jest.Mock;

const userId = "507f1f77bcf86cd799439011";

const createUserNavigationQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  return query;
};

const createRejectedUserNavigationQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  return query;
};

describe("getOwnUserNavigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("uses MongoDB ownership, user selection, and account navigation transform", async () => {
    const leanUserData = {
      favourites: ["favourite-1"],
      watchlist: ["watchlist-1"],
      comments: ["comment-1"],
    };
    const navData = {
      favourites: ["favourite-1"],
      watchlist: ["watchlist-1"],
      comments: ["comment-1"],
      firstFavouriteId: "favourite-1",
      firstWatchlistId: "watchlist-1",
      firstCommentId: "comment-1",
      hasFavourites: true,
      hasWatchlist: true,
      hasComments: true,
    };
    const query = createUserNavigationQuery(leanUserData);
    mockUserFindById.mockReturnValue(query);
    mockTransformAccountNavToFrontend.mockReturnValue(navData);

    await expect(getOwnUserNavigation(userId)).resolves.toEqual(navData);

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockUserFindById.mock.invocationCallOrder[0]
    );
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(query.select).toHaveBeenCalledWith("favourites watchlist comments");
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformAccountNavToFrontend).toHaveBeenCalledWith(
      leanUserData
    );
  });

  it("returns null when the current user no longer exists", async () => {
    mockUserFindById.mockReturnValue(createUserNavigationQuery(null));

    await expect(getOwnUserNavigation(userId)).resolves.toBeNull();

    expect(mockTransformAccountNavToFrontend).not.toHaveBeenCalled();
  });

  it("rejects when account navigation persistence fails", async () => {
    const error = new Error("private user navigation failure");
    mockUserFindById.mockReturnValue(createRejectedUserNavigationQuery(error));

    await expect(getOwnUserNavigation(userId)).rejects.toThrow(error);

    expect(mockTransformAccountNavToFrontend).not.toHaveBeenCalled();
  });
});

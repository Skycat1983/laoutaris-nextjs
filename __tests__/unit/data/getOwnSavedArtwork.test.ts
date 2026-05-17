jest.mock("server-only", () => ({}), { virtual: true });

import {
  getOwnFavouriteArtwork,
  getOwnFavouriteArtworkList,
  getOwnWatchlistArtwork,
  getOwnWatchlistArtworkList,
} from "@/lib/data/services/getOwnSavedArtwork";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { UserModel } from "@/lib/data/models/userModel";
import dbConnect from "@/lib/db/mongodb";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/userModel", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/artwork/transformArtwork", () => ({
  transformArtwork: {
    toFrontend: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockArtworkFindById = ArtworkModel.findById as jest.Mock;
const mockTransformArtwork = transformArtwork.toFrontend as jest.Mock;

const userId = "507f1f77bcf86cd799439011";
const artworkId = "64f1f77bcf86cd799439022";

const createSavedListQuery = (result: unknown) => {
  const query = {
    select: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockResolvedValue(result),
  };
  query.select.mockReturnValue(query);
  query.populate.mockReturnValue(query);
  return query;
};

const createRejectedSavedListQuery = (error: unknown) => {
  const query = {
    select: jest.fn(),
    populate: jest.fn(),
    lean: jest.fn().mockRejectedValue(error),
  };
  query.select.mockReturnValue(query);
  query.populate.mockReturnValue(query);
  return query;
};

const createArtworkQuery = (result: unknown) => {
  const query = {
    lean: jest.fn().mockResolvedValue(result),
  };
  mockArtworkFindById.mockReturnValue(query);
  return query;
};

describe("getOwnSavedArtwork services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("loads current-user favourites with DB ownership, populated user data, transform, and list metadata", async () => {
    const favourites = [
      { _id: "art-1", title: "One" },
      { _id: "art-2", title: "Two" },
    ];
    const transformed = [
      { _id: "art-1", title: "One" },
      { _id: "art-2", title: "Two" },
    ];
    const query = createSavedListQuery({ _id: userId, favourites });
    mockUserFindById.mockReturnValue(query);
    mockTransformArtwork
      .mockReturnValueOnce(transformed[0])
      .mockReturnValueOnce(transformed[1]);

    await expect(getOwnFavouriteArtworkList(userId)).resolves.toEqual({
      artworks: transformed,
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
    expect(query.select).toHaveBeenCalledWith("favourites");
    expect(query.populate).toHaveBeenCalledWith("favourites");
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenNthCalledWith(1, favourites[0]);
    expect(mockTransformArtwork).toHaveBeenNthCalledWith(2, favourites[1]);
  });

  it("loads current-user watchlist with the existing single-page metadata contract", async () => {
    const watchlist = [{ _id: "art-3", title: "Three" }];
    const transformed = [{ _id: "art-3", title: "Three" }];
    const query = createSavedListQuery({ _id: userId, watchlist });
    mockUserFindById.mockReturnValue(query);
    mockTransformArtwork.mockReturnValueOnce(transformed[0]);

    await expect(getOwnWatchlistArtworkList(userId)).resolves.toEqual({
      artworks: transformed,
      metadata: {
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      },
    });

    expect(query.select).toHaveBeenCalledWith("watchlist");
    expect(query.populate).toHaveBeenCalledWith("watchlist");
    expect(mockTransformArtwork).toHaveBeenCalledWith(watchlist[0]);
  });

  it("returns null when the current user no longer exists", async () => {
    mockUserFindById.mockReturnValue(createSavedListQuery(null));

    await expect(getOwnFavouriteArtworkList(userId)).resolves.toBeNull();

    expect(mockTransformArtwork).not.toHaveBeenCalled();
  });

  it("rejects when saved-artwork list persistence fails", async () => {
    const error = new Error("private saved list failure");
    mockUserFindById.mockReturnValue(createRejectedSavedListQuery(error));

    await expect(getOwnWatchlistArtworkList(userId)).rejects.toThrow(error);

    expect(mockTransformArtwork).not.toHaveBeenCalled();
  });

  it("loads one favourited artwork with user-aware transform state", async () => {
    const artwork = { _id: artworkId, title: "Favourite" };
    const frontendArtwork = {
      _id: artworkId,
      title: "Favourite",
      isFavourited: true,
    };
    const query = createArtworkQuery(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    await expect(getOwnFavouriteArtwork(userId, artworkId)).resolves.toEqual({
      status: "found",
      artwork: frontendArtwork,
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockArtworkFindById.mock.invocationCallOrder[0]
    );
    expect(mockArtworkFindById).toHaveBeenCalledWith(artworkId);
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
  });

  it("loads one watchlisted artwork with user-aware transform state", async () => {
    const artwork = { _id: artworkId, title: "Watchlist" };
    const frontendArtwork = {
      _id: artworkId,
      title: "Watchlist",
      isWatchlisted: true,
    };
    createArtworkQuery(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    await expect(getOwnWatchlistArtwork(userId, artworkId)).resolves.toEqual({
      status: "found",
      artwork: frontendArtwork,
    });

    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
  });

  it("returns artwork-not-found when the saved artwork target is missing", async () => {
    createArtworkQuery(null);

    await expect(getOwnFavouriteArtwork(userId, artworkId)).resolves.toEqual({
      status: "artwork-not-found",
    });

    expect(mockTransformArtwork).not.toHaveBeenCalled();
  });

  it("returns not-in-favourites after transforming a non-favourited artwork", async () => {
    const artwork = { _id: artworkId, title: "Favourite" };
    createArtworkQuery(artwork);
    mockTransformArtwork.mockReturnValue({
      _id: artworkId,
      title: "Favourite",
      isFavourited: false,
    });

    await expect(getOwnFavouriteArtwork(userId, artworkId)).resolves.toEqual({
      status: "not-in-favourites",
    });
  });

  it("returns not-in-watchlist after transforming a non-watchlisted artwork", async () => {
    const artwork = { _id: artworkId, title: "Watchlist" };
    createArtworkQuery(artwork);
    mockTransformArtwork.mockReturnValue({
      _id: artworkId,
      title: "Watchlist",
      isWatchlisted: false,
    });

    await expect(getOwnWatchlistArtwork(userId, artworkId)).resolves.toEqual({
      status: "not-in-watchlist",
    });
  });
});

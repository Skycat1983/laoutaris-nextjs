import { GET as getUserFavourite } from "@/app/api/v2/user/favourite/route";
import { GET as getUserFavouriteItem } from "@/app/api/v2/user/favourite/[artworkId]/route";
import { GET as getUserNavigation } from "@/app/api/v2/user/navigation/route";
import { GET as getUserWatchlist } from "@/app/api/v2/user/watchlist/route";
import { GET as getUserWatchlistItem } from "@/app/api/v2/user/watchlist/[artworkId]/route";
import dbConnect from "@/lib/db/mongodb";
import { ArtworkModel, UserModel } from "@/lib/data/models";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";
import { getServerSession } from "next-auth";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
  ArtworkModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/artwork/transformArtwork", () => ({
  transformArtwork: {
    toFrontend: jest.fn(),
  },
}));

jest.mock("@/lib/transforms/navigation/transformNavData", () => ({
  transformAccountNav: {
    toFrontend: jest.fn(),
  },
}));

type JsonResponse = {
  status: number;
  json: () => Promise<unknown>;
};

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockArtworkFindById = ArtworkModel.findById as jest.Mock;
const mockTransformArtwork = transformArtwork.toFrontend as jest.Mock;
const mockTransformAccountNav = transformAccountNav.toFrontend as jest.Mock;

const userId = "507f1f77bcf86cd799439011";
const artworkId = "64f1f77bcf86cd799439022";
const unauthorizedBody = {
  success: false,
  message: "Unauthorized",
  error: "Unauthorized",
};
const errorBody = (message: string) => ({
  success: false,
  message,
  error: message,
});
let consoleErrorSpy: jest.SpyInstance;

const setAuthenticatedSession = () => {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: userId,
      name: "Joseph",
      email: "joseph@example.com",
      role: "user",
    },
    expires: "2099-01-01T00:00:00.000Z",
  });
};

const expectUnauthorized = async (response: JsonResponse) => {
  expect(response.status).toBe(401);
  await expect(response.json()).resolves.toEqual(unauthorizedBody);
  expect(mockDbConnect).not.toHaveBeenCalled();
  expect(mockUserFindById).not.toHaveBeenCalled();
  expect(mockArtworkFindById).not.toHaveBeenCalled();
  expect(mockTransformAccountNav).not.toHaveBeenCalled();
  expect(mockTransformArtwork).not.toHaveBeenCalled();
};

const expectErrorResponse = async (
  response: JsonResponse,
  status: number,
  message: string
) => {
  expect(response.status).toBe(status);
  await expect(response.json()).resolves.toEqual(errorBody(message));
};

const mockSelectLeanUser = (user: unknown) => {
  const lean = jest.fn().mockResolvedValue(user);
  const select = jest.fn().mockReturnValue({ lean });
  mockUserFindById.mockReturnValue({ select });
  return { select, lean };
};

const mockSelectPopulateLeanUser = (user: unknown) => {
  const lean = jest.fn().mockResolvedValue(user);
  const populate = jest.fn().mockReturnValue({ lean });
  const select = jest.fn().mockReturnValue({ populate });
  mockUserFindById.mockReturnValue({ select });
  return { select, populate, lean };
};

const mockArtworkLean = (artwork: unknown) => {
  const lean = jest.fn().mockResolvedValue(artwork);
  mockArtworkFindById.mockReturnValue({ lean });
  return { lean };
};

describe("user saved route guards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetServerSession.mockResolvedValue(null);
    mockDbConnect.mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it.each([
    ["navigation", () => getUserNavigation({} as never)],
    ["favourites list", () => getUserFavourite({} as never)],
    [
      "favourite detail",
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
    ],
    ["watchlist list", () => getUserWatchlist({} as never)],
    [
      "watchlist detail",
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
    ],
  ])("returns a real JSON 401 before DB/model work for %s", async (_, call) => {
    const response = (await call()) as JsonResponse;

    await expectUnauthorized(response);
  });

  it.each([
    [
      "navigation",
      () => mockSelectLeanUser(null),
      () => getUserNavigation({} as never),
    ],
    [
      "favourites list",
      () => mockSelectPopulateLeanUser(null),
      () => getUserFavourite({} as never),
    ],
    [
      "watchlist list",
      () => mockSelectPopulateLeanUser(null),
      () => getUserWatchlist({} as never),
    ],
  ])(
    "returns a real JSON 404 when the current user is missing for %s",
    async (_, setupMissingUser, call) => {
      setAuthenticatedSession();
      setupMissingUser();

      const response = (await call()) as JsonResponse;

      await expectErrorResponse(response, 404, "User not found");
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockUserFindById).toHaveBeenCalledWith(userId);
      expect(mockTransformAccountNav).not.toHaveBeenCalled();
      expect(mockTransformArtwork).not.toHaveBeenCalled();
    }
  );

  it.each([
    [
      "navigation",
      () => getUserNavigation({} as never),
      "Failed to fetch user navigation",
    ],
    [
      "favourites list",
      () => getUserFavourite({} as never),
      "Failed to fetch user favourites",
    ],
    [
      "watchlist list",
      () => getUserWatchlist({} as never),
      "Failed to fetch user watchlist",
    ],
  ])(
    "returns a public-safe 500 when %s loading fails",
    async (_, call, message) => {
      setAuthenticatedSession();
      mockDbConnect.mockRejectedValue(new Error("database unavailable"));

      const response = (await call()) as JsonResponse;

      await expectErrorResponse(response, 500, message);
      expect(mockUserFindById).not.toHaveBeenCalled();
      expect(mockArtworkFindById).not.toHaveBeenCalled();
    }
  );

  it("loads account navigation for authenticated callers", async () => {
    setAuthenticatedSession();
    const leanUserData = {
      favourites: ["art-1"],
      watchlist: ["art-2"],
      comments: ["comment-1"],
    };
    const navData = {
      favouritedCount: 1,
      watchlistCount: 1,
      commentCount: 1,
    };
    const { select, lean } = mockSelectLeanUser(leanUserData);
    mockTransformAccountNav.mockReturnValue(navData);

    const response = (await getUserNavigation({} as never)) as JsonResponse;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(select).toHaveBeenCalledWith("favourites watchlist comments");
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformAccountNav).toHaveBeenCalledWith(leanUserData);
    expect(body).toEqual({
      success: true,
      data: navData,
    });
  });

  it("loads favourites for authenticated callers", async () => {
    setAuthenticatedSession();
    const favourites = [
      { _id: "art-1", title: "One" },
      { _id: "art-2", title: "Two" },
    ];
    const transformedFavourites = [
      { id: "art-1", title: "One" },
      { id: "art-2", title: "Two" },
    ];
    const { select, populate, lean } = mockSelectPopulateLeanUser({
      _id: userId,
      favourites,
    });
    mockTransformArtwork
      .mockReturnValueOnce(transformedFavourites[0])
      .mockReturnValueOnce(transformedFavourites[1]);

    const response = (await getUserFavourite({} as never)) as JsonResponse;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(select).toHaveBeenCalledWith("favourites");
    expect(populate).toHaveBeenCalledWith("favourites");
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenNthCalledWith(1, favourites[0]);
    expect(mockTransformArtwork).toHaveBeenNthCalledWith(2, favourites[1]);
    expect(body).toEqual({
      success: true,
      data: transformedFavourites,
      metadata: {
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      },
    });
  });

  it("loads watchlist artwork for authenticated callers", async () => {
    setAuthenticatedSession();
    const watchlist = [{ _id: "art-3", title: "Three" }];
    const transformedWatchlist = [{ id: "art-3", title: "Three" }];
    const { select, populate, lean } = mockSelectPopulateLeanUser({
      _id: userId,
      watchlist,
    });
    mockTransformArtwork.mockReturnValueOnce(transformedWatchlist[0]);

    const response = (await getUserWatchlist({} as never)) as JsonResponse;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(userId);
    expect(select).toHaveBeenCalledWith("watchlist");
    expect(populate).toHaveBeenCalledWith("watchlist");
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenCalledWith(watchlist[0]);
    expect(body).toEqual({
      success: true,
      data: transformedWatchlist,
      metadata: {
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      },
    });
  });

  it("loads a favourite detail for authenticated callers", async () => {
    setAuthenticatedSession();
    const artwork = { _id: artworkId, title: "Detail" };
    const frontendArtwork = {
      id: artworkId,
      title: "Detail",
      isFavourited: true,
    };
    const { lean } = mockArtworkLean(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    const response = (await getUserFavouriteItem({} as never, {
      params: { artworkId },
    })) as JsonResponse;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockArtworkFindById).toHaveBeenCalledWith(artworkId);
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
    expect(body).toEqual({
      success: true,
      data: frontendArtwork,
    });
  });

  it("loads a watchlist detail for authenticated callers", async () => {
    setAuthenticatedSession();
    const artwork = { _id: artworkId, title: "Watch Detail" };
    const frontendArtwork = {
      id: artworkId,
      title: "Watch Detail",
      isWatchlisted: true,
    };
    const { lean } = mockArtworkLean(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    const response = (await getUserWatchlistItem({} as never, {
      params: { artworkId },
    })) as JsonResponse;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockArtworkFindById).toHaveBeenCalledWith(artworkId);
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
    expect(body).toEqual({
      success: true,
      data: frontendArtwork,
    });
  });

  it.each([
    [
      "favourite detail",
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
    ],
    [
      "watchlist detail",
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
    ],
  ])("returns a real JSON 404 when artwork is missing for %s", async (_, call) => {
    setAuthenticatedSession();
    const { lean } = mockArtworkLean(null);

    const response = (await call()) as JsonResponse;

    await expectErrorResponse(response, 404, "Artwork not found");
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockArtworkFindById).toHaveBeenCalledWith(artworkId);
    expect(lean).toHaveBeenCalledTimes(1);
    expect(mockTransformArtwork).not.toHaveBeenCalled();
  });

  it("returns a real JSON 404 when artwork is not in favourites", async () => {
    setAuthenticatedSession();
    const artwork = { _id: artworkId, title: "Detail" };
    const frontendArtwork = {
      id: artworkId,
      title: "Detail",
      isFavourited: false,
    };
    mockArtworkLean(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    const response = (await getUserFavouriteItem({} as never, {
      params: { artworkId },
    })) as JsonResponse;

    await expectErrorResponse(response, 404, "Artwork not in favourites");
    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
  });

  it("returns a real JSON 404 when artwork is not in watchlist", async () => {
    setAuthenticatedSession();
    const artwork = { _id: artworkId, title: "Watch Detail" };
    const frontendArtwork = {
      id: artworkId,
      title: "Watch Detail",
      isWatchlisted: false,
    };
    mockArtworkLean(artwork);
    mockTransformArtwork.mockReturnValue(frontendArtwork);

    const response = (await getUserWatchlistItem({} as never, {
      params: { artworkId },
    })) as JsonResponse;

    await expectErrorResponse(response, 404, "Artwork not in watchlist");
    expect(mockTransformArtwork).toHaveBeenCalledWith(artwork, userId);
  });

  it.each([
    [
      "favourite detail",
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
      "Failed to fetch favourite artwork",
    ],
    [
      "watchlist detail",
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
      "Failed to fetch watchlist artwork",
    ],
  ])(
    "returns a public-safe 500 when %s loading fails",
    async (_, call, message) => {
      setAuthenticatedSession();
      mockDbConnect.mockRejectedValue(new Error("database unavailable"));

      const response = (await call()) as JsonResponse;

      await expectErrorResponse(response, 500, message);
      expect(mockArtworkFindById).not.toHaveBeenCalled();
      expect(mockTransformArtwork).not.toHaveBeenCalled();
    }
  );
});

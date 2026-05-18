import { GET as getUserFavourite } from "@/app/api/v2/user/favourite/route";
import { GET as getUserFavouriteItem } from "@/app/api/v2/user/favourite/[artworkId]/route";
import { GET as getUserNavigation } from "@/app/api/v2/user/navigation/route";
import { GET as getUserWatchlist } from "@/app/api/v2/user/watchlist/route";
import { GET as getUserWatchlistItem } from "@/app/api/v2/user/watchlist/[artworkId]/route";
import {
  getOwnFavouriteArtwork,
  getOwnFavouriteArtworkList,
  getOwnWatchlistArtwork,
  getOwnWatchlistArtworkList,
} from "@/lib/data/services/getOwnSavedArtwork";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { getOwnUserNavigation } from "@/lib/data/services/getOwnUserNavigation";
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

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/data/services/getOwnUserNavigation", () => ({
  getOwnUserNavigation: jest.fn(),
}));

jest.mock("@/lib/data/services/getOwnSavedArtwork", () => ({
  getOwnFavouriteArtworkList: jest.fn(),
  getOwnFavouriteArtwork: jest.fn(),
  getOwnWatchlistArtworkList: jest.fn(),
  getOwnWatchlistArtwork: jest.fn(),
}));

type JsonResponse = {
  status: number;
  headers: Headers;
  json: () => Promise<unknown>;
};

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockGetOwnUserNavigation = getOwnUserNavigation as jest.MockedFunction<
  typeof getOwnUserNavigation
>;
const mockGetOwnFavouriteArtworkList =
  getOwnFavouriteArtworkList as jest.MockedFunction<
    typeof getOwnFavouriteArtworkList
  >;
const mockGetOwnFavouriteArtwork =
  getOwnFavouriteArtwork as jest.MockedFunction<typeof getOwnFavouriteArtwork>;
const mockGetOwnWatchlistArtworkList =
  getOwnWatchlistArtworkList as jest.MockedFunction<
    typeof getOwnWatchlistArtworkList
  >;
const mockGetOwnWatchlistArtwork =
  getOwnWatchlistArtwork as jest.MockedFunction<typeof getOwnWatchlistArtwork>;

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
const requestId = "req-user-saved-1234";

const createRequest = (suppliedRequestId?: string) => ({
  method: "GET",
  headers:
    suppliedRequestId === undefined
      ? new Headers()
      : new Headers({ "x-request-id": suppliedRequestId }),
  nextUrl: new URL("http://localhost/api/v2/user/saved"),
  url: "http://localhost/api/v2/user/saved",
});

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
  expect(mockGetOwnUserNavigation).not.toHaveBeenCalled();
  expect(mockGetOwnFavouriteArtworkList).not.toHaveBeenCalled();
  expect(mockGetOwnFavouriteArtwork).not.toHaveBeenCalled();
  expect(mockGetOwnWatchlistArtworkList).not.toHaveBeenCalled();
  expect(mockGetOwnWatchlistArtwork).not.toHaveBeenCalled();
};

const expectErrorResponse = async (
  response: JsonResponse,
  status: number,
  message: string
) => {
  expect(response.status).toBe(status);
  await expect(response.json()).resolves.toEqual(errorBody(message));
};

describe("user saved route adapters", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetServerSession.mockResolvedValue(null);
    mockGetOwnUserNavigation.mockResolvedValue({
      favourites: ["art-1"],
      watchlist: ["art-2"],
      comments: ["comment-1"],
      firstFavouriteId: "art-1",
      firstWatchlistId: "art-2",
      firstCommentId: "comment-1",
      hasFavourites: true,
      hasWatchlist: true,
      hasComments: true,
    } as never);
    mockGetOwnFavouriteArtworkList.mockResolvedValue({
      artworks: [],
      metadata: { total: 0, page: 1, limit: 0, totalPages: 1 },
    });
    mockGetOwnWatchlistArtworkList.mockResolvedValue({
      artworks: [],
      metadata: { total: 0, page: 1, limit: 0, totalPages: 1 },
    });
    mockGetOwnFavouriteArtwork.mockResolvedValue({
      status: "found",
      artwork: { _id: artworkId, title: "Favourite" } as never,
    });
    mockGetOwnWatchlistArtwork.mockResolvedValue({
      status: "found",
      artwork: { _id: artworkId, title: "Watchlist" } as never,
    });
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
  ])(
    "returns a real JSON 401 before service work for %s",
    async (_, call) => {
      const response = (await call()) as JsonResponse;

      await expectUnauthorized(response);
    }
  );

  it("loads account navigation for authenticated callers", async () => {
    setAuthenticatedSession();
    const navData = {
      favourites: ["art-1"],
      watchlist: ["art-2"],
      comments: ["comment-1"],
      firstFavouriteId: "art-1",
      firstWatchlistId: "art-2",
      firstCommentId: "comment-1",
      hasFavourites: true,
      hasWatchlist: true,
      hasComments: true,
    } as never;
    mockGetOwnUserNavigation.mockResolvedValue(navData);

    const response = (await getUserNavigation({} as never)) as JsonResponse;

    expect(response.status).toBe(200);
    expect(mockGetOwnUserNavigation).toHaveBeenCalledWith(userId);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: navData,
    });
  });

  it.each([
    [
      "favourites list",
      mockGetOwnFavouriteArtworkList,
      () => getUserFavourite({} as never),
      "getOwnFavouriteArtworkList",
    ],
    [
      "watchlist list",
      mockGetOwnWatchlistArtworkList,
      () => getUserWatchlist({} as never),
      "getOwnWatchlistArtworkList",
    ],
  ])(
    "loads %s through the saved-artwork service",
    async (_, service, call) => {
      setAuthenticatedSession();
      const artworks = [
        { _id: "art-1", title: "One" },
        { _id: "art-2", title: "Two" },
      ] as never;
      const metadata = {
        total: 2,
        page: 1,
        limit: 2,
        totalPages: 1,
      };
      service.mockResolvedValue({
        artworks,
        metadata,
      });

      const response = (await call()) as JsonResponse;

      expect(response.status).toBe(200);
      expect(service).toHaveBeenCalledWith(userId);
      await expect(response.json()).resolves.toEqual({
        success: true,
        data: artworks,
        metadata,
      });
    }
  );

  it.each([
    [
      "favourite detail",
      mockGetOwnFavouriteArtwork,
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
    ],
    [
      "watchlist detail",
      mockGetOwnWatchlistArtwork,
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
    ],
  ])("loads %s through the saved-artwork service", async (_, service, call) => {
    setAuthenticatedSession();
    const artwork = { _id: artworkId, title: "Detail" } as never;
    service.mockResolvedValue({ status: "found", artwork });

    const response = (await call()) as JsonResponse;

    expect(response.status).toBe(200);
    expect(service).toHaveBeenCalledWith(userId, artworkId);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: artwork,
    });
  });

  it.each([
    [
      "navigation",
      mockGetOwnUserNavigation,
      () => getUserNavigation({} as never),
      "User not found",
    ],
    [
      "favourites list",
      mockGetOwnFavouriteArtworkList,
      () => getUserFavourite({} as never),
      "User not found",
    ],
    [
      "watchlist list",
      mockGetOwnWatchlistArtworkList,
      () => getUserWatchlist({} as never),
      "User not found",
    ],
  ])(
    "returns a real JSON 404 when the current user is missing for %s",
    async (_, service, call, message) => {
      setAuthenticatedSession();
      service.mockResolvedValue(null);

      const response = (await call()) as JsonResponse;

      await expectErrorResponse(response, 404, message);
    }
  );

  it.each([
    [
      "favourite detail",
      mockGetOwnFavouriteArtwork,
      { status: "artwork-not-found" },
      "Artwork not found",
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
    ],
    [
      "watchlist detail",
      mockGetOwnWatchlistArtwork,
      { status: "artwork-not-found" },
      "Artwork not found",
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
    ],
    [
      "favourite detail",
      mockGetOwnFavouriteArtwork,
      { status: "not-in-favourites" },
      "Artwork not in favourites",
      () =>
        getUserFavouriteItem({} as never, {
          params: { artworkId },
        }),
    ],
    [
      "watchlist detail",
      mockGetOwnWatchlistArtwork,
      { status: "not-in-watchlist" },
      "Artwork not in watchlist",
      () =>
        getUserWatchlistItem({} as never, {
          params: { artworkId },
        }),
    ],
  ])(
    "returns a real JSON 404 for %s service status %j",
    async (_, service, result, message, call) => {
      setAuthenticatedSession();
      service.mockResolvedValue(result as never);

      const response = (await call()) as JsonResponse;

      await expectErrorResponse(response, 404, message);
    }
  );

  it.each([
    [
      "favourites list",
      mockGetOwnFavouriteArtworkList,
      () => getUserFavourite(createRequest(requestId) as never),
      "Failed to fetch user favourites",
      "/api/v2/user/favourite",
      "user_favourite_list_failed",
      requestId,
    ],
    [
      "watchlist list",
      mockGetOwnWatchlistArtworkList,
      () => getUserWatchlist(createRequest() as never),
      "Failed to fetch user watchlist",
      "/api/v2/user/watchlist",
      "user_watchlist_list_failed",
      expect.stringMatching(/^[0-9a-f-]{36}$/),
    ],
    [
      "favourite detail",
      mockGetOwnFavouriteArtwork,
      () =>
        getUserFavouriteItem(createRequest() as never, {
          params: { artworkId },
        }),
      "Failed to fetch favourite artwork",
      "/api/v2/user/favourite/[artworkId]",
      "user_favourite_detail_failed",
      expect.stringMatching(/^[0-9a-f-]{36}$/),
    ],
    [
      "watchlist detail",
      mockGetOwnWatchlistArtwork,
      () =>
        getUserWatchlistItem(createRequest(requestId) as never, {
          params: { artworkId },
        }),
      "Failed to fetch watchlist artwork",
      "/api/v2/user/watchlist/[artworkId]",
      "user_watchlist_detail_failed",
      requestId,
    ],
  ])(
    "returns a public-safe 500 with request context when %s service work fails",
    async (
      _,
      service,
      call,
      message,
      route,
      errorLabel,
      expectedRequestId
    ) => {
      setAuthenticatedSession();
      service.mockRejectedValue(new Error("private saved artwork failure"));

      const response = (await call()) as JsonResponse;
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(body).toEqual({
        ...errorBody(message),
        requestId: expectedRequestId,
      });
      expect(response.headers.get(REQUEST_ID_HEADER)).toEqual(
        expectedRequestId
      );
      expect(logPayload).toEqual(
        expect.objectContaining({
          requestId: expectedRequestId,
          route,
          method: "GET",
          errorLabel,
        })
      );
      expect(JSON.stringify(body)).not.toContain("private saved artwork failure");
    }
  );
});

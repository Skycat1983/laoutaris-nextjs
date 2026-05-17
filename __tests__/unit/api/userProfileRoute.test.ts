import { GET } from "@/app/api/v2/user/profile/route";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
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

jest.mock("@/lib/data/services/getOwnUserProfile", () => ({
  getOwnUserProfile: jest.fn(),
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockGetOwnUserProfile = getOwnUserProfile as jest.MockedFunction<
  typeof getOwnUserProfile
>;

const userId = "507f1f77bcf86cd799439011";
const profile = {
  _id: userId,
  username: "joseph",
  email: "joseph@example.com",
  role: "user",
  favourites: [],
  watchlist: [],
  comments: [],
  favouritedCount: 0,
  watchlistCount: 0,
  commentCount: 0,
};
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

describe("GET /api/v2/user/profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetOwnUserProfile.mockResolvedValue(profile as never);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns a real JSON 401 for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(mockGetOwnUserProfile).not.toHaveBeenCalled();
  });

  it("loads the current user's profile service DTO for authenticated callers", async () => {
    setAuthenticatedSession();

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetOwnUserProfile).toHaveBeenCalledWith(userId);
    expect(body).toEqual({
      success: true,
      data: profile,
    });
  });

  it("returns a real JSON 404 when the current user no longer exists", async () => {
    setAuthenticatedSession();
    mockGetOwnUserProfile.mockResolvedValue(null);

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockGetOwnUserProfile).toHaveBeenCalledWith(userId);
    expect(body).toEqual({
      success: false,
      message: "User not found",
      error: "User not found",
    });
  });

  it("returns a public-safe 500 when profile loading fails", async () => {
    setAuthenticatedSession();
    mockGetOwnUserProfile.mockRejectedValue(new Error("database unavailable"));

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(mockGetOwnUserProfile).toHaveBeenCalledWith(userId);
    expect(body).toEqual({
      success: false,
      message: "Failed to fetch user profile",
      error: "Failed to fetch user profile",
    });
  });
});

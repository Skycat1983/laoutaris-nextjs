import { GET } from "@/app/api/v2/user/profile/route";
import dbConnect from "@/lib/db/mongodb";
import { UserModel } from "@/lib/data/models";
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
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindById = UserModel.findById as jest.Mock;

const userId = "507f1f77bcf86cd799439011";
const profile = {
  _id: userId,
  username: "joseph",
  email: "joseph@example.com",
  role: "user",
};

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
    mockDbConnect.mockResolvedValue(undefined);
    mockFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(profile),
    });
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
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("loads the current user's raw profile document for authenticated callers", async () => {
    setAuthenticatedSession();
    const select = jest.fn().mockResolvedValue(profile);
    mockFindById.mockReturnValue({ select });

    const response = await GET({} as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(userId);
    expect(select).toHaveBeenCalledWith("-password");
    expect(body).toEqual({
      success: true,
      data: profile,
    });
  });
});

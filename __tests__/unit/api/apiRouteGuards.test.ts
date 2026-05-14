import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { requireApiUser } from "@/lib/api/requireApiUser";
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

const adminUserId = "admin-user-id";
const regularUserId = "regular-user-id";

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

describe("requireApiUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue({ role: "admin" });
  });

  it("returns a JSON 401 when the caller is unauthenticated", async () => {
    setSession(null);

    const result = await requireApiUser();

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected user guard failure");

    expect(result.response.status).toBe(401);
    await expect(result.response.json()).resolves.toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns the stable session user ID for authenticated callers", async () => {
    setSession({ id: regularUserId, role: "user" });

    await expect(requireApiUser()).resolves.toEqual({
      ok: true,
      userId: regularUserId,
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });
});

describe("requireApiAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue({ role: "admin" });
  });

  it("returns a JSON 401 when the caller is unauthenticated", async () => {
    setSession(null);

    const result = await requireApiAdmin();

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected admin guard failure");

    expect(result.response.status).toBe(401);
    await expect(result.response.json()).resolves.toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns a JSON 403 when the session role is not admin", async () => {
    setSession({ id: regularUserId, role: "user" });

    const result = await requireApiAdmin();

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected admin guard failure");

    expect(result.response.status).toBe(403);
    await expect(result.response.json()).resolves.toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns a JSON 403 when the persisted role is not admin", async () => {
    setSession({ id: adminUserId, role: "admin" });
    mockFindById.mockResolvedValue({ role: "user" });

    const result = await requireApiAdmin();

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected admin guard failure");

    expect(result.response.status).toBe(403);
    await expect(result.response.json()).resolves.toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(adminUserId);
  });

  it("returns a public-safe JSON 500 when persisted admin verification fails", async () => {
    setSession({ id: adminUserId, role: "admin" });
    mockDbConnect.mockRejectedValue(new Error("private database detail"));

    const result = await requireApiAdmin();

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected admin guard failure");

    expect(result.response.status).toBe(500);
    await expect(result.response.json()).resolves.toEqual({
      success: false,
      message: "Unable to verify admin access",
      error: "Unable to verify admin access",
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns the stable session user ID when the session and persisted roles are admin", async () => {
    setSession({ id: adminUserId, role: "admin" });

    await expect(requireApiAdmin()).resolves.toEqual({
      ok: true,
      userId: adminUserId,
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(adminUserId);
  });
});

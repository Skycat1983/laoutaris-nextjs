import { POST } from "@/app/api/v2/admin/sign-cloudinary-params/route";
import dbConnect from "@/lib/db/mongodb";
import { UserModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

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

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    utils: {
      api_sign_request: jest.fn(),
    },
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindById = UserModel.findById as jest.Mock;
const mockSignRequest = cloudinary.utils.api_sign_request as jest.Mock;

const createRequest = (body: unknown) =>
  ({
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Request);

const createInvalidJsonRequest = () =>
  ({
    json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
  } as unknown as Request);

const setAdminSession = () => {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: "admin-user-id",
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
    },
    expires: "2099-01-01T00:00:00.000Z",
  });
  mockDbConnect.mockResolvedValue(undefined);
  mockFindById.mockResolvedValue({ role: "admin" });
};

describe("POST /api/v2/admin/sign-cloudinary-params", () => {
  const originalCloudinarySecret = process.env.CLOUDINARY_API_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLOUDINARY_API_SECRET = "test-cloudinary-secret";
    mockSignRequest.mockReturnValue("signed-cloudinary-params");
  });

  afterEach(() => {
    process.env.CLOUDINARY_API_SECRET = originalCloudinarySecret;
  });

  it("returns 401 JSON for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await POST(createRequest({ paramsToSign: {} }));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it("returns 403 JSON for authenticated non-admin callers", async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: "regular-user-id",
        name: "Member",
        email: "member@example.com",
        role: "user",
      },
      expires: "2099-01-01T00:00:00.000Z",
    });

    const response = await POST(createRequest({ paramsToSign: {} }));
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid JSON", createInvalidJsonRequest()],
    ["array body", createRequest([])],
    ["primitive body", createRequest("params")],
    ["missing paramsToSign", createRequest({})],
    ["null paramsToSign", createRequest({ paramsToSign: null })],
    ["array paramsToSign", createRequest({ paramsToSign: [] })],
    ["primitive paramsToSign", createRequest({ paramsToSign: "timestamp" })],
  ])("returns 400 for %s without signing", async (_label, request) => {
    setAdminSession();

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/JSON object|paramsToSign/);
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it("returns a public-safe configuration error when the API secret is missing", async () => {
    setAdminSession();
    delete process.env.CLOUDINARY_API_SECRET;

    const response = await POST(
      createRequest({ paramsToSign: { timestamp: 12345 } })
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Cloudinary signing is not configured",
    });
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it("signs validated params for admins and preserves the top-level signature", async () => {
    setAdminSession();

    const paramsToSign = {
      timestamp: 12345,
      folder: "laoutaris_art",
    };

    const response = await POST(createRequest({ paramsToSign }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith("admin-user-id");
    expect(mockSignRequest).toHaveBeenCalledWith(
      paramsToSign,
      "test-cloudinary-secret"
    );
    expect(body).toEqual({
      success: true,
      signature: "signed-cloudinary-params",
      data: {
        signature: "signed-cloudinary-params",
      },
    });
  });
});

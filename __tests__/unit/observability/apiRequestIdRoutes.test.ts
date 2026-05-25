jest.mock("server-only", () => ({}), { virtual: true });

import fs from "fs";
import path from "path";
import { GET as GET_ADMIN_COLLECTION_READ } from "@/app/api/v2/admin/collection/read/route";
import { GET as GET_ADMIN_COLLECTION_DETAIL } from "@/app/api/v2/admin/collection/read/[id]/route";
import { GET as GET_PUBLIC_COLLECTION_NAVIGATION } from "@/app/api/v2/public/navigation/collections/route";
import { GET as GET_USER_PROFILE } from "@/app/api/v2/user/profile/route";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
import dbConnect from "@/lib/db/mongodb";
import { CollectionModel, UserModel } from "@/lib/data/models";
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

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  CollectionModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/data/services/getCollectionNavigationList", () => ({
  getCollectionNavigationList: jest.fn(),
}));

jest.mock("@/lib/data/services/getOwnUserProfile", () => ({
  getOwnUserProfile: jest.fn(),
}));

jest.mock("@/lib/transforms", () => ({
  transformCollectionPopulated: jest.fn(),
}));

const mockGetCollectionNavigationList =
  getCollectionNavigationList as jest.MockedFunction<
    typeof getCollectionNavigationList
  >;
const mockGetOwnUserProfile = getOwnUserProfile as jest.MockedFunction<
  typeof getOwnUserProfile
>;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCollectionCountDocuments =
  CollectionModel.countDocuments as jest.Mock;
const mockCollectionFindById = CollectionModel.findById as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;

const requestId = "req-1234567890";
const userId = "507f1f77bcf86cd799439011";
const collectionId = "507f1f77bcf86cd799439016";

const createRequest = (
  url = "http://localhost/api/v2/example",
  method = "GET",
  suppliedRequestId: string | null = requestId
) => ({
  method,
  headers: new Headers(
    suppliedRequestId === null ? {} : { "x-request-id": suppliedRequestId }
  ),
  nextUrl: new URL(url),
  url,
});

const createRouteContext = (id: string) => ({
  params: {
    id,
  },
});

const apiV2RouteRoot = path.join(process.cwd(), "src/app/api/v2");
const routeHandlerFilePattern = /[/\\]route\.(ts|tsx|js|jsx)$/;
const disallowedRouteConsolePattern = /console\.(error|warn)\s*\(/g;

const collectApiV2RouteHandlerFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectApiV2RouteHandlerFiles(entryPath);
    }

    return routeHandlerFilePattern.test(entryPath) ? [entryPath] : [];
  });
};

const createRejectedPopulatedLeanQuery = (error: unknown) => ({
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockRejectedValue(error),
});

const setAuthenticatedSession = (role: "user" | "admin" = "user") => {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: userId,
      name: "Joseph",
      email: "joseph@example.com",
      role,
    },
    expires: "2099-01-01T00:00:00.000Z",
  });
};

describe("API request IDs on migrated route failures", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockDbConnect.mockResolvedValue(undefined);
    mockUserFindById.mockResolvedValue({ role: "admin" });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("adds request IDs to a representative public route 500", async () => {
    mockGetCollectionNavigationList.mockRejectedValue(
      new Error("private public failure")
    );

    const response = await GET_PUBLIC_COLLECTION_NAVIGATION(
      createRequest(
        "http://localhost/api/v2/public/navigation/collections"
      ) as never
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      message: "Failed to fetch collection navigation",
      error: "Failed to fetch collection navigation",
      requestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/public/navigation/collections",
        method: "GET",
        errorLabel: "collection_navigation_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private public failure");
  });

  it("adds request IDs to a representative protected user route 500", async () => {
    setAuthenticatedSession();
    mockGetOwnUserProfile.mockRejectedValue(
      new Error("private user failure")
    );

    const response = await GET_USER_PROFILE(
      createRequest("http://localhost/api/v2/user/profile") as never
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      message: "Failed to fetch user profile",
      error: "Failed to fetch user profile",
      requestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/user/profile",
        method: "GET",
        errorLabel: "user_profile_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private user failure");
  });

  it("adds request IDs to a representative admin route 500", async () => {
    setAuthenticatedSession("admin");
    mockCollectionCountDocuments.mockRejectedValue(
      new Error("private admin failure")
    );

    const response = await GET_ADMIN_COLLECTION_READ(
      createRequest(
        "http://localhost/api/v2/admin/collection/read?page=1&limit=10"
      ) as never
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      message: "Failed to fetch collections",
      error: "Failed to fetch collections",
      requestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/admin/collection/read",
        method: "GET",
        operation: "admin.collection.read.list",
        errorLabel: "admin_collection_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private admin failure");
  });

  it("adds generated request IDs to a representative admin detail route 500", async () => {
    setAuthenticatedSession("admin");
    mockCollectionFindById.mockReturnValue(
      createRejectedPopulatedLeanQuery(
        new Error("private admin detail failure")
      )
    );

    const response = await GET_ADMIN_COLLECTION_DETAIL(
      createRequest(
        "http://localhost/api/v2/admin/collection/read/507f1f77bcf86cd799439016",
        "GET",
        null
      ) as never,
      createRouteContext(collectionId)
    );
    const body = await response.json();
    const generatedRequestId = body.requestId;
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(generatedRequestId).toEqual(
      expect.stringMatching(/^[0-9a-f-]{36}$/)
    );
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(generatedRequestId);
    expect(body).toEqual({
      success: false,
      message: "Failed to read collection",
      error: "Failed to read collection",
      requestId: generatedRequestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId: generatedRequestId,
        route: "/api/v2/admin/collection/read/[id]",
        method: "GET",
        operation: "admin.collection.read.detail",
        errorLabel: "admin_collection_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private admin detail failure");
  });

  it("keeps API v2 route handlers free of direct route-level console.error and console.warn calls", () => {
    const routeFiles = collectApiV2RouteHandlerFiles(apiV2RouteRoot);
    const offenders = routeFiles.flatMap((routeFile) => {
      const routeSource = fs.readFileSync(routeFile, "utf8");
      const matches = routeSource.match(disallowedRouteConsolePattern) ?? [];
      const relativeRouteFile = path.relative(process.cwd(), routeFile);

      return matches.map((match) => `${relativeRouteFile}: ${match}`);
    });

    expect(routeFiles.length).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});

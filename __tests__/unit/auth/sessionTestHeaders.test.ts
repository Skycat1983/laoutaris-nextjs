import { readFileSync } from "fs";
import path from "path";
import { authOptions } from "@/lib/config/authOptions";
import { UserModel } from "@/lib/data/models";
import {
  getUserFromSession,
  getUserIdFromSession,
  isUserAdmin,
} from "@/lib/session/getUserFromSession";
import { getServerSession } from "next-auth";

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockFindById = UserModel.findById as jest.Mock;
const mockSelect = jest.fn();
const mockLean = jest.fn();
const mockExec = jest.fn();

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const setNodeEnv = (value: NodeJS.ProcessEnv["NODE_ENV"]) => {
  Object.defineProperty(process.env, "NODE_ENV", {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
};

const requestWithHeaders = (headers: Record<string, string>) =>
  ({
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  }) as Request;

describe("getUserFromSession development test headers", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    setNodeEnv("development");
    mockFindById.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ lean: mockLean });
    mockLean.mockReturnValue({ exec: mockExec });
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    setNodeEnv(originalNodeEnv);
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("resolves a persisted test user without direct console.log output", async () => {
    mockExec.mockResolvedValue({
      _id: "test-user-id",
      role: "admin",
      username: "local-admin",
      __v: 0,
    });

    await expect(
      getUserFromSession(requestWithHeaders({ "X-Test-User-Id": "test-user-id" }))
    ).resolves.toEqual({
      id: "test-user-id",
      role: "admin",
      username: "local-admin",
    });

    expect(mockFindById).toHaveBeenCalledWith("test-user-id");
    expect(mockSelect).toHaveBeenCalledWith("role username");
    expect(mockLean).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockGetServerSession).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("falls back to a user role when the test user lookup returns no user", async () => {
    mockExec.mockResolvedValue(null);

    await expect(
      getUserFromSession(
        requestWithHeaders({ "X-Test-User-Id": "missing-user-id" })
      )
    ).resolves.toEqual({
      id: "missing-user-id",
      role: "user",
    });

    expect(mockGetServerSession).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("logs a redacted structured lookup failure while falling back to a user role", async () => {
    const lookupError = new Error("lookup failed");
    mockExec.mockRejectedValue(lookupError);

    await expect(
      getUserFromSession(
        requestWithHeaders({ "X-Test-User-Id": "failing-user-id" })
      )
    ).resolves.toEqual({
      id: "failing-user-id",
      role: "user",
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(consoleErrorSpy.mock.calls[0][0])).toEqual(
      expect.objectContaining({
        level: "error",
        event: "session.test_header_user.lookup_failed",
        operation: "session.test_header_user_lookup",
        surface: "session_helper",
        statusCategory: "development_test_user_lookup_failed",
        testHeaderType: "user",
        error: {
          name: "Error",
          message: "Development test user lookup error",
        },
      })
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "failing-user-id"
    );
    expect(JSON.stringify(consoleErrorSpy.mock.calls)).not.toContain(
      "lookup failed"
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(mockGetServerSession).not.toHaveBeenCalled();
  });

  it("resolves a test admin header without direct console.log output", async () => {
    await expect(
      getUserFromSession(
        requestWithHeaders({ "X-Test-Admin-Id": "test-admin-id" })
      )
    ).resolves.toEqual({
      id: "test-admin-id",
      role: "admin",
    });

    expect(mockFindById).not.toHaveBeenCalled();
    expect(mockGetServerSession).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("uses NextAuth session lookup when no development test header is active", async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: "session-user-id",
        role: "user",
        name: "session-name",
        email: "session@example.com",
      },
      expires: "2099-01-01T00:00:00.000Z",
    });

    await expect(getUserFromSession(requestWithHeaders({}))).resolves.toEqual({
      id: "session-user-id",
      role: "user",
      username: "session-name",
    });

    expect(mockGetServerSession).toHaveBeenCalledWith(authOptions);
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("preserves helper behavior through getUserFromSession delegation", async () => {
    await expect(
      getUserIdFromSession(
        requestWithHeaders({ "X-Test-Admin-Id": "delegated-admin-id" })
      )
    ).resolves.toBe("delegated-admin-id");

    await expect(
      isUserAdmin(
        requestWithHeaders({ "X-Test-Admin-Id": "delegated-admin-id" })
      )
    ).resolves.toBe(true);

    expect(mockGetServerSession).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

describe("session source hygiene", () => {
  it("keeps getUserFromSession free of direct console debugging", () => {
    const source = readRepoFile("src/lib/session/getUserFromSession.ts");

    expect(source).not.toMatch(/console\.log\s*\(/);
    expect(source).not.toMatch(/console\.(error|warn)\s*\(/);
  });
});

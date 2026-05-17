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
    process.env.NODE_ENV = "development";
    mockFindById.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ lean: mockLean });
    mockLean.mockReturnValue({ exec: mockExec });
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
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

  it("keeps the lookup failure console.error while falling back to a user role", async () => {
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

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching test user:",
      lookupError
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
  it("keeps getUserFromSession free of direct console.log debugging", () => {
    const source = readRepoFile("src/lib/session/getUserFromSession.ts");

    expect(source).not.toMatch(/console\.log\s*\(/);
  });
});

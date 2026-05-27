import { config, middleware } from "@/middleware";
import {
  authProtectedRoutes,
  protectedMiddlewareMatchers,
} from "@/lib/routes/authProtectedRoutes";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      type: "json",
      status: init?.status ?? 200,
      json: async () => body,
    })),
    next: jest.fn(() => ({
      type: "next",
      status: 200,
    })),
    redirect: jest.fn((url: URL) => ({
      type: "redirect",
      status: 307,
      url: url.toString(),
    })),
  },
}));

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockNext = NextResponse.next as jest.Mock;
const mockRedirect = NextResponse.redirect as jest.Mock;

const createRequest = (path: string): NextRequest =>
  ({
    nextUrl: {
      pathname: path,
    },
    url: `https://example.com${path}`,
  } as unknown as NextRequest);

const matchesConfiguredMiddleware = (path: string): boolean => {
  return config.matcher.some((matcher) => {
    const suffix = "/:path*";
    const basePath = matcher.endsWith(suffix)
      ? matcher.slice(0, -suffix.length)
      : matcher;

    return path === basePath || path.startsWith(`${basePath}/`);
  });
};

describe("middleware", () => {
  const originalSecret = process.env.NEXTAUTH_SECRET;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_SECRET = "test-nextauth-secret";
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
    process.env.NEXTAUTH_SECRET = originalSecret;
  });

  it("returns JSON 401 for unauthenticated protected API requests", async () => {
    const request = createRequest("/api/v2/user/navigation");
    mockGetToken.mockResolvedValue(null);

    const response = await middleware(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockGetToken).toHaveBeenCalledWith({
      req: request,
      secret: "test-nextauth-secret",
    });
  });

  it("redirects unauthenticated protected frontend requests to the app sign-in page", async () => {
    const request = createRequest(authProtectedRoutes.accountSettings);
    mockGetToken.mockResolvedValue(null);

    const response = await middleware(request);

    expect(response).toEqual({
      type: "redirect",
      status: 307,
      url: `https://example.com${authProtectedRoutes.signIn}`,
    });
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL(`https://example.com${authProtectedRoutes.signIn}`)
    );
  });

  it("returns JSON 403 for authenticated non-admin admin API requests", async () => {
    mockGetToken.mockResolvedValue({ id: "regular-user-id", role: "user" });

    const response = await middleware(
      createRequest("/api/v2/admin/article/read")
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects authenticated non-admin admin frontend requests to the home page", async () => {
    mockGetToken.mockResolvedValue({ id: "regular-user-id", role: "user" });

    const response = await middleware(createRequest("/admin/users"));

    expect(response).toEqual({
      type: "redirect",
      status: 307,
      url: `https://example.com${authProtectedRoutes.home}`,
    });
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL(`https://example.com${authProtectedRoutes.home}`)
    );
  });

  it("bypasses NextAuth API routes", async () => {
    const response = await middleware(
      createRequest(`${authProtectedRoutes.nextAuthApi}/signin`)
    );

    expect(response).toEqual({
      type: "next",
      status: 200,
    });
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockGetToken).not.toHaveBeenCalled();
  });

  it.each(["/artwork", "/api/v2/public/artwork"])(
    "allows public route %s through without parsing auth tokens",
    async (path) => {
      const response = await middleware(createRequest(path));

      expect(response).toEqual({
        type: "next",
        status: 200,
      });
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockGetToken).not.toHaveBeenCalled();
    }
  );

  it("matches only protected frontend and API prefixes", () => {
    expect(config.matcher).toEqual(protectedMiddlewareMatchers);

    [
      authProtectedRoutes.account,
      authProtectedRoutes.accountSettings,
      authProtectedRoutes.admin,
      "/admin/dashboard",
      "/api/v2/admin/article/read",
      "/api/v2/user/navigation",
    ].forEach((path) => {
      expect(matchesConfiguredMiddleware(path)).toBe(true);
    });

    [
      authProtectedRoutes.home,
      "/artwork",
      "/blog/post-1",
      `${authProtectedRoutes.nextAuthApi}/signin`,
      "/api/v2/public/artwork",
      "/api/v2/public/search",
      "/accounting",
      "/administrator",
      "/api/v2/administer",
      "/api/v2/userland",
    ].forEach((path) => {
      expect(matchesConfiguredMiddleware(path)).toBe(false);
    });
  });

  it("allows authenticated protected requests through", async () => {
    mockGetToken.mockResolvedValue({ id: "admin-user-id", role: "admin" });

    const response = await middleware(
      createRequest("/api/v2/admin/article/read")
    );

    expect(response).toEqual({
      type: "next",
      status: 200,
    });
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});

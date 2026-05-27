import {
  PROTECTED_API_ROUTES,
  PROTECTED_FRONTEND_ROUTES,
  PUBLIC_ROUTES,
} from "@/lib/constants/routeConstants";
import {
  authProtectedRoutes,
  protectedMiddlewareMatchers,
  protectedRouteRoots,
} from "@/lib/routes/authProtectedRoutes";
import {
  isApiRoute,
  isProtectedRoute,
  isAdminRoute,
} from "@/lib/utils/routeUtils";

type RouteTestCase = {
  path: string;
  expected: boolean;
  description: string;
};

describe("routeUtils", () => {
  const retiredProtectedRoute = ["", "protected"].join("/");

  it("exports the stable auth/protected route constants surface", () => {
    expect(authProtectedRoutes).toEqual({
      home: "/",
      signIn: "/sign-in",
      account: "/account",
      accountSettings: "/account/settings",
      admin: "/admin",
      adminDashboardArticles: "/admin/dashboard/articles",
      api: "/api",
      nextAuthApi: "/api/auth",
      adminApi: "/api/v2/admin",
      userApi: "/api/v2/user",
    });

    expect(protectedRouteRoots).toEqual([
      "/account",
      "/admin",
      "/api/v2/admin",
      "/api/v2/user",
    ]);
    expect(protectedMiddlewareMatchers).toEqual([
      "/account/:path*",
      "/admin/:path*",
      "/api/v2/admin/:path*",
      "/api/v2/user/:path*",
    ]);
    expect(protectedMiddlewareMatchers).toEqual(
      protectedRouteRoots.map((route) => `${route}/:path*`)
    );
  });

  describe("isApiRoute", () => {
    const apiRouteTests: RouteTestCase[] = [
      {
        path: authProtectedRoutes.api,
        expected: true,
        description: "matches the API root route",
      },
      {
        path: `${PROTECTED_API_ROUTES.USER_API}/navigation`,
        expected: true,
        description: "matches nested protected user API routes",
      },
      {
        path: `${authProtectedRoutes.nextAuthApi}/signin`,
        expected: true,
        description: "matches NextAuth API routes",
      },
      {
        path: PROTECTED_FRONTEND_ROUTES.ACCOUNT,
        expected: false,
        description: "does not match protected frontend routes",
      },
      {
        path: "/apiculture",
        expected: false,
        description: "does not match API-like frontend paths",
      },
    ];

    test.each(apiRouteTests)("$description", ({ path, expected }) => {
      expect(isApiRoute(path)).toBe(expected);
    });
  });

  describe("isProtectedRoute", () => {
    const protectedRouteTests: RouteTestCase[] = [
      // Frontend routes
      {
        path: PROTECTED_FRONTEND_ROUTES.ACCOUNT,
        expected: true,
        description: "matches exact account route",
      },
      {
        path: authProtectedRoutes.accountSettings,
        expected: true,
        description: "matches nested account route",
      },
      {
        path: `${PROTECTED_FRONTEND_ROUTES.ACCOUNT}/`,
        expected: true,
        description: "matches account route with trailing slash",
      },
      {
        path: PROTECTED_FRONTEND_ROUTES.ADMIN,
        expected: true,
        description: "matches exact admin route",
      },
      // API routes
      {
        path: PROTECTED_API_ROUTES.ADMIN_API,
        expected: true,
        description: "matches exact admin API route",
      },
      {
        path: `${PROTECTED_API_ROUTES.USER_API}/profile`,
        expected: true,
        description: "matches nested user API route",
      },
      {
        path: `${PROTECTED_API_ROUTES.USER_API}/`,
        expected: true,
        description: "matches user API route with trailing slash",
      },
      // Public routes
      {
        path: PUBLIC_ROUTES.HOME,
        expected: false,
        description: "does not match public home route",
      },
      {
        path: `${PUBLIC_ROUTES.BLOG}/post-1`,
        expected: false,
        description: "does not match nested public route",
      },
      {
        path: retiredProtectedRoute,
        expected: false,
        description: "does not retain retired protected test route",
      },
      {
        path: `${authProtectedRoutes.nextAuthApi}/signin`,
        expected: false,
        description: "does not treat NextAuth routes as protected routes",
      },
      {
        path: "/api/v2/administer",
        expected: false,
        description: "does not match admin API-like routes",
      },
      {
        path: "/accounting",
        expected: false,
        description: "does not match account-like frontend routes",
      },
      {
        path: "/administrator",
        expected: false,
        description: "does not match admin-like frontend routes",
      },
      {
        path: "/api/v2/userland",
        expected: false,
        description: "does not match user API-like routes",
      },
    ];

    test.each(protectedRouteTests)("$description", ({ path, expected }) => {
      expect(isProtectedRoute(path)).toBe(expected);
    });
  });

  describe("isAdminRoute", () => {
    const adminRouteTests: RouteTestCase[] = [
      // Valid admin routes
      {
        path: PROTECTED_FRONTEND_ROUTES.ADMIN,
        expected: true,
        description: "matches exact admin frontend route",
      },
      {
        path: `${PROTECTED_FRONTEND_ROUTES.ADMIN}/`,
        expected: true,
        description: "matches admin frontend route with trailing slash",
      },
      {
        path: `${PROTECTED_FRONTEND_ROUTES.ADMIN}/users`,
        expected: true,
        description: "matches nested admin frontend route",
      },
      {
        path: PROTECTED_API_ROUTES.ADMIN_API,
        expected: true,
        description: "matches exact admin API route",
      },
      {
        path: `${PROTECTED_API_ROUTES.ADMIN_API}/users`,
        expected: true,
        description: "matches nested admin API route",
      },
      // Invalid admin-like routes
      {
        path: "/admin-fake",
        expected: false,
        description: "does not match admin-like frontend route",
      },
      {
        path: "/api/v2/admin-fake",
        expected: false,
        description: "does not match admin-like API route",
      },
      {
        path: "/administrator",
        expected: false,
        description: "does not match route containing admin",
      },
      // Non-admin routes
      {
        path: PROTECTED_FRONTEND_ROUTES.ACCOUNT,
        expected: false,
        description: "does not match non-admin protected route",
      },
      {
        path: PUBLIC_ROUTES.HOME,
        expected: false,
        description: "does not match public route",
      },
    ];

    test.each(adminRouteTests)("$description", ({ path, expected }) => {
      expect(isAdminRoute(path)).toBe(expected);
    });
  });
});

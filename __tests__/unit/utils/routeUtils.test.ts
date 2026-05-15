import {
  PROTECTED_API_ROUTES,
  PROTECTED_FRONTEND_ROUTES,
  PUBLIC_ROUTES,
} from "@/lib/constants/routeConstants";
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

  describe("isApiRoute", () => {
    const apiRouteTests: RouteTestCase[] = [
      {
        path: "/api",
        expected: true,
        description: "matches the API root route",
      },
      {
        path: `${PROTECTED_API_ROUTES.USER_API}/navigation`,
        expected: true,
        description: "matches nested protected user API routes",
      },
      {
        path: `${PROTECTED_API_ROUTES.AUTH_API}/signin`,
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
        path: `${PROTECTED_FRONTEND_ROUTES.ACCOUNT}/settings`,
        expected: true,
        description: "matches nested account route",
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

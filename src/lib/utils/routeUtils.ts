import {
  PROTECTED_API_ROUTES,
  PROTECTED_FRONTEND_ROUTES,
} from "@/lib/constants/routeConstants";

// Helper function to check if a path starts with any of the protected routes
export const isProtectedRoute = (path: string): boolean => {
  return (
    // Check frontend routes
    Object.values(PROTECTED_FRONTEND_ROUTES).some((route) =>
      path.startsWith(route)
    ) ||
    // Check API routes
    Object.values(PROTECTED_API_ROUTES).some((route) => path.startsWith(route))
  );
};

// Helper function to check if a path is an admin route
export const isAdminRoute = (path: string): boolean => {
  // Helper to check if a path is exactly equal to a base path or is a nested route
  const isExactOrNestedRoute = (basePath: string): boolean => {
    return (
      path === basePath || // Exact match
      path === `${basePath}/` || // Match with trailing slash
      path.startsWith(basePath + "/")
    ); // Nested route
  };

  return (
    isExactOrNestedRoute(PROTECTED_FRONTEND_ROUTES.ADMIN) ||
    isExactOrNestedRoute(PROTECTED_API_ROUTES.ADMIN_API)
  );
};

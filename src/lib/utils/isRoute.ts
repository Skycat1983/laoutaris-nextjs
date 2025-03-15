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
  return (
    path.startsWith(PROTECTED_FRONTEND_ROUTES.ADMIN) ||
    path.startsWith(PROTECTED_API_ROUTES.ADMIN_API)
  );
};

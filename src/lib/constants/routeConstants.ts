import { authProtectedRoutes } from "@/lib/routes/authProtectedRoutes";

export {
  adminRouteRoots,
  authProtectedRoutes,
  protectedApiRouteRoots,
  protectedFrontendRouteRoots,
  protectedMiddlewareMatchers,
  protectedRouteRoots,
} from "@/lib/routes/authProtectedRoutes";

// Frontend protected routes
export const PROTECTED_FRONTEND_ROUTES = {
  ACCOUNT: authProtectedRoutes.account,
  ADMIN: authProtectedRoutes.admin,
} as const;

// API routes that need protection
export const PROTECTED_API_ROUTES = {
  // Admin API routes
  ADMIN_API: authProtectedRoutes.adminApi,

  // User-level protected API routes
  USER_API: authProtectedRoutes.userApi,

  // Auth related routes
  AUTH_API: authProtectedRoutes.nextAuthApi,
} as const;

// Public routes (no protection needed)
export const PUBLIC_ROUTES = {
  HOME: authProtectedRoutes.home,
  BLOG: "/blog",
  COLLECTIONS: "/collections",
  PROJECT: "/project",
  BIOGRAPHY: "/biography",
  SHOP: "/shop",
} as const;

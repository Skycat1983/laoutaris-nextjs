// Frontend protected routes
export const PROTECTED_FRONTEND_ROUTES = {
  ACCOUNT: "/account",
  ADMIN: "/admin",
  PROTECTED: "/protected",
} as const;

// API routes that need protection
export const PROTECTED_API_ROUTES = {
  // Admin API routes
  ADMIN_API: "/api/v2/admin",

  // User-level protected API routes
  USER_API: "/api/v2/user",

  // Auth related routes
  AUTH_API: "/api/auth",
} as const;

// Public routes (no protection needed)
export const PUBLIC_ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  COLLECTIONS: "/collections",
  PROJECT: "/project",
  BIOGRAPHY: "/biography",
  SHOP: "/shop",
} as const;

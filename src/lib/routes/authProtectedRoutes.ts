export const authProtectedRoutes = {
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
} as const;

export const protectedFrontendRouteRoots = [
  authProtectedRoutes.account,
  authProtectedRoutes.admin,
] as const;

export const protectedApiRouteRoots = [
  authProtectedRoutes.adminApi,
  authProtectedRoutes.userApi,
] as const;

export const protectedRouteRoots = [
  ...protectedFrontendRouteRoots,
  ...protectedApiRouteRoots,
] as const;

export const adminRouteRoots = [
  authProtectedRoutes.admin,
  authProtectedRoutes.adminApi,
] as const;

export type ProtectedRouteRoot = (typeof protectedRouteRoots)[number];
export type ProtectedMiddlewareMatcher = `${ProtectedRouteRoot}/:path*`;

const toProtectedMiddlewareMatcher = (
  route: ProtectedRouteRoot
): ProtectedMiddlewareMatcher => `${route}/:path*`;

export const protectedMiddlewareMatchers = protectedRouteRoots.map(
  toProtectedMiddlewareMatcher
);

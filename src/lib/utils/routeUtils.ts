import {
  adminRouteRoots,
  authProtectedRoutes,
  protectedRouteRoots,
} from "@/lib/routes/authProtectedRoutes";

const isExactOrNestedRoute = (path: string, basePath: string): boolean => {
  return (
    path === basePath ||
    path === `${basePath}/` ||
    path.startsWith(`${basePath}/`)
  );
};

export const isApiRoute = (path: string): boolean => {
  return (
    path === authProtectedRoutes.api ||
    path.startsWith(`${authProtectedRoutes.api}/`)
  );
};

export const isProtectedRoute = (path: string): boolean => {
  return protectedRouteRoots.some((route) => isExactOrNestedRoute(path, route));
};

export const isAdminRoute = (path: string): boolean => {
  return adminRouteRoots.some((route) => isExactOrNestedRoute(path, route));
};

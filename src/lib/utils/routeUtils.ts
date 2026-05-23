import {
  PROTECTED_API_ROUTES,
  PROTECTED_FRONTEND_ROUTES,
} from "@/lib/constants/routeConstants";

const isExactOrNestedRoute = (path: string, basePath: string): boolean => {
  return (
    path === basePath ||
    path === `${basePath}/` ||
    path.startsWith(`${basePath}/`)
  );
};

const PROTECTED_ROUTE_PREFIXES = [
  PROTECTED_FRONTEND_ROUTES.ACCOUNT,
  PROTECTED_FRONTEND_ROUTES.ADMIN,
  PROTECTED_API_ROUTES.ADMIN_API,
  PROTECTED_API_ROUTES.USER_API,
];

export const isApiRoute = (path: string): boolean => {
  return path === "/api" || path.startsWith("/api/");
};

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTE_PREFIXES.some((route) =>
    isExactOrNestedRoute(path, route)
  );
};

export const isAdminRoute = (path: string): boolean => {
  return (
    isExactOrNestedRoute(path, PROTECTED_FRONTEND_ROUTES.ADMIN) ||
    isExactOrNestedRoute(path, PROTECTED_API_ROUTES.ADMIN_API)
  );
};

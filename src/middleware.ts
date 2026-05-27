import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiAuthError } from "@/lib/api/apiAuthError";
import {
  isApiRoute,
  isProtectedRoute,
  isAdminRoute,
} from "@/lib/utils/routeUtils";
import {
  authProtectedRoutes,
  protectedMiddlewareMatchers,
} from "@/lib/routes/authProtectedRoutes";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith(authProtectedRoutes.nextAuthApi)) {
    return NextResponse.next();
  }

  if (!isProtectedRoute(path)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isApiRoute(path)) {
      return apiAuthError("Unauthorized", 401);
    }

    return NextResponse.redirect(
      new URL(authProtectedRoutes.signIn, request.url)
    );
  }

  if (isAdminRoute(path)) {
    const role = token?.role;

    if (role !== "admin") {
      if (isApiRoute(path)) {
        return apiAuthError("Forbidden", 403);
      }
      return NextResponse.redirect(
        new URL(authProtectedRoutes.home, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedMiddlewareMatchers,
};

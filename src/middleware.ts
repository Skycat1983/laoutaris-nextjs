import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiAuthError } from "@/lib/api/apiAuthError";
import {
  isApiRoute,
  isProtectedRoute,
  isAdminRoute,
} from "@/lib/utils/routeUtils";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/auth")) {
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

    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  if (isAdminRoute(path)) {
    const role = token?.role;

    if (role !== "admin") {
      if (isApiRoute(path)) {
        return apiAuthError("Forbidden", 403);
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (auth endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

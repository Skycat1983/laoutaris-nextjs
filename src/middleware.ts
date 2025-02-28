import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isProtectedRoute, isAdminRoute } from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware - Path:", path);

  // Don't run middleware on auth-related paths
  if (path.startsWith("/api/auth")) {
    console.log("Skipping middleware for auth route");
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Path being checked:", path);

  if (isProtectedRoute(path)) {
    console.log("Route requires protection");

    if (!token) {
      console.log("No token found, redirecting to signin");
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    if (isAdminRoute(path)) {
      const role = token?.role;
      console.log("Admin route check - User role:", role);

      if (role !== "admin") {
        if (path.startsWith("/api")) {
          return NextResponse.json(
            { success: false, error: "Forbidden" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
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

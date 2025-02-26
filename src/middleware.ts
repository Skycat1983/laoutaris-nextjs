import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isProtectedRoute, isAdminRoute } from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware - Path:", path);

  // Log the raw cookie
  // console.log("Middleware - Cookie header:", request.headers.get("cookie"));

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log("Middleware - Decoded token:", token);

  const role = token?.role;
  console.log("user role in middleware", role);

  // Check if the route needs protection
  if (isProtectedRoute(path)) {
    console.log("isProtectedRoute", isProtectedRoute(path));

    // Check authentication
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    // Check admin routes
    if (isAdminRoute(path)) {
      console.log("isAdminRoute", isAdminRoute(path));
      if (role !== "admin") {
        // Redirect API requests with 403, frontend requests to home
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

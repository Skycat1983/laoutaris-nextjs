import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/api/v2/admin/:path*"],
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token directly - no database calls
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = token?.role === "admin";

  // For test headers in development
  let testUserId = null;
  let testIsAdmin = false;

  if (process.env.NODE_ENV === "development") {
    testUserId =
      req.headers.get("X-Test-User-Id") || req.headers.get("X-Test-Admin-Id");
    testIsAdmin = !!req.headers.get("X-Test-Admin-Id");
  }

  // User is authenticated if they have a token OR test headers
  const isAuthenticated = !!token || !!testUserId;
  // User is admin if token says so OR test admin header
  const userIsAdmin = isAdmin || testIsAdmin;

  // Handle account routes
  if (pathname.startsWith("/account")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  // Handle admin frontend routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    if (!userIsAdmin) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
    return NextResponse.next();
  }

  // Handle admin API routes
  if (pathname.startsWith("/api/v2/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!userIsAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Add headers for downstream use
    const requestWithUserInfo = new NextRequest(req);
    if (token) {
      console.log("Token found");
    }
    if (testUserId) {
      console.log("Test user ID found", testUserId);
    }
    if (userIsAdmin) {
      console.log("User is admin");
    }
    const userId = token?.sub || testUserId;
    const role = userIsAdmin ? "admin" : "user";

    if (userId) {
      requestWithUserInfo.headers.set("X-User-ID", userId);
      requestWithUserInfo.headers.set("X-User-Role", role);
    }

    return NextResponse.next({
      request: requestWithUserInfo,
    });
  }

  return NextResponse.next();
}

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/api/v2/admin/:path*"],
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token directly - no database calls
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log("token", token);
  const isAdmin = token?.role === "admin";

  // For test headers in development
  let testUserId = null;
  let testIsAdmin = false;
  let testAdminId = null;

  if (process.env.NODE_ENV === "development") {
    testUserId = req.headers.get("X-Test-User-Id");
    testAdminId = req.headers.get("X-Test-Admin-Id");
    testIsAdmin = !!testAdminId;
  }

  // User is authenticated if they have a token OR test headers
  const isAuthenticated = !!token || !!testUserId || !!testAdminId;
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

    // Create a new request with all the original headers
    const requestWithUserInfo = new NextRequest(req);

    // IMPORTANT: Preserve the original test headers
    if (testUserId) {
      requestWithUserInfo.headers.set("X-Test-User-Id", testUserId);
    }
    if (testAdminId) {
      requestWithUserInfo.headers.set("X-Test-Admin-Id", testAdminId);
    }

    // Add our processed user info
    const userId = token?.sub || testUserId || testAdminId;
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

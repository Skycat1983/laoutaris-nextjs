import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isProtectedRoute, isAdminRoute } from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware - Path:", path);

  // console.log("Middleware - Cookie header:", request.headers.get("cookie"));

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role;
  console.log("user role in middleware", role);

  if (isProtectedRoute(path)) {
    console.log("isProtectedRoute", isProtectedRoute(path));

    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    if (isAdminRoute(path)) {
      console.log("isAdminRoute", isAdminRoute(path));
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

import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

//* for client side

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = token?.role === "admin";

  //! Visitor trying to access FRONTEND route for authenticated users
  if (pathname.startsWith("/account")) {
    console.log("Middleware: Accessing /account FRONTEND route");
    if (!token) {
      console.log(
        "Middleware: No token found, redirecting to /api/auth/signin"
      );
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    console.log("Middleware: access permitted to /account");
    return NextResponse.next();
  }

  //! Visitor trying to access FRONTEND route for ADMIN users
  if (pathname.startsWith("/admin")) {
    console.log("Middleware: Accessing /admin FRONTEND route");
    if (!token) {
      ("Middleware: No token found, redirecting to /api/auth/signin");
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    console.log("Middleware: Token found", token);
    if (!isAdmin) {
      console.log(
        "Middleware: User is not admin, redirecting to user account page"
      );
      return NextResponse.redirect(new URL("/account", req.url));
    }
    console.log("Middleware: access permitted to /admin");
    return NextResponse.next();
  }

  //! Visitor trying to access API route for ADMIN users
  if (pathname.startsWith("/api/admin")) {
    console.log("Middleware: Accessing /api/admin API route");
    console.log("Middleware: Pathname", pathname);
    console.log("Middleware: Token", token);
    if (!token) {
      console.log("Middleware: No token found, redirecting to homepage");
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
    if (!isAdmin) {
      console.log("Middleware: User is not admin, redirecting to home page");
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("Middleware: access permitted to /api/admin route");
    return NextResponse.next();
  }

  // all other cases
  return NextResponse.next();
};

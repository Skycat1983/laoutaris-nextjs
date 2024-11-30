import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export const middleware = async (req: NextRequest) => {
  // Retrieve the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // console.log("token in middleware", token);

  // If no token exists, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // If token exists, allow the request to proceed
  return NextResponse.next();
};

export const config = {
  matcher: ["/account/:path*"],
};

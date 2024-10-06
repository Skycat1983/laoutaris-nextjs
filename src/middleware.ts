import { type NextRequest } from "next/server";
import { refreshSession } from "./lib/server/user/session/session";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const middleware = async (req: NextRequest) => {
  const session = await getServerSession();
  console.log("session in middleware", session);
  // return await refreshSession(req);
  return NextResponse.redirect(new URL("/api/auth/signin", req.url));
};

export const config = {
  // matcher: ["/artwork", "/biography", "/project", "/blog"],
  matcher: ["/account"],
};

// export async function middleware(request: NextRequest) {
//   // await dbConnect();

//   const { pathname } = request.nextUrl;
//   console.log("pathname in middleware :>> ", pathname);
//   const sectionContent = await getSectionContent("biography");
//   console.log("sectionContent :>> ", sectionContent);

//   return NextResponse.json({ message: "Hello, World!" });
// }

// export function middleware(req: NextRequest, event: NextFetchEvent) {
//   const { pathname } = req.nextUrl;

//   console.log("pathname in middleware :>> ", pathname);

//   const sectionContent = getSectionContent(pathname);

//   const subheadings = event.waitUntil(sectionContent);
//   console.log("subheadings :>> ", subheadings);

//   return NextResponse.next();
// }

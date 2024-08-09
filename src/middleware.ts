import { getSectionContent } from "@/utils/server/getSectionContent";
import { NextResponse, type NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";
import dbConnect from "./utils/mongodb";

export async function middleware(request: NextRequest) {
  // await dbConnect();

  const { pathname } = request.nextUrl;
  console.log("pathname in middleware :>> ", pathname);
  const sectionContent = await getSectionContent("biography");
  console.log("sectionContent :>> ", sectionContent);

  return NextResponse.json({ message: "Hello, World!" });
}

export const config = {
  // matcher: ["/artwork", "/biography", "/project", "/blog"],
  matcher: ["/nonexistent"],
};

// export function middleware(req: NextRequest, event: NextFetchEvent) {
//   const { pathname } = req.nextUrl;

//   console.log("pathname in middleware :>> ", pathname);

//   const sectionContent = getSectionContent(pathname);

//   const subheadings = event.waitUntil(sectionContent);
//   console.log("subheadings :>> ", subheadings);

//   return NextResponse.next();
// }

import { type NextRequest } from "next/server";
import { refreshSession } from "./lib/server/user/session/session";

export const middleware = async (req: NextRequest) => {
  return await refreshSession(req);
};

// export async function middleware(request: NextRequest) {
//   // await dbConnect();

//   const { pathname } = request.nextUrl;
//   console.log("pathname in middleware :>> ", pathname);
//   const sectionContent = await getSectionContent("biography");
//   console.log("sectionContent :>> ", sectionContent);

//   return NextResponse.json({ message: "Hello, World!" });
// }

// export const config = {
//   // matcher: ["/artwork", "/biography", "/project", "/blog"],
//   matcher: ["/nonexistent"],
// };

// export function middleware(req: NextRequest, event: NextFetchEvent) {
//   const { pathname } = req.nextUrl;

//   console.log("pathname in middleware :>> ", pathname);

//   const sectionContent = getSectionContent(pathname);

//   const subheadings = event.waitUntil(sectionContent);
//   console.log("subheadings :>> ", subheadings);

//   return NextResponse.next();
// }

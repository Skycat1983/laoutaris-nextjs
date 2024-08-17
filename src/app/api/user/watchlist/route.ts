import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "../../auth/[...nextauth]/route";
import { IUser, UserModel } from "@/lib/server/models";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username not provided" },
      { status: 400 }
    );
  }

  const user = (await UserModel.findOne({ username })
    .select("watchlist")
    .lean()) as IUser | null;

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const watchlist = user.watchlist || [];

  return NextResponse.json({ watchlist });
}

// ! V2
//! gettings the users watchlist
// export async function GET() {
//   const session = await getServerSession(authOptions);
//   const username = session?.user?.name;

//   if (!username) {
//     return NextResponse.json({ message: "User not found" });
//   }

//   //? returns the user and the watchlist
//   const user = (await UserModel.findOne({ username })
//     .select("watchlist")
//     .lean()) as IUser | null;

//   const watchlist = user?.watchlist;

//   console.log("watchlistobject :>> ", watchlist);
//   return NextResponse.json({ watchlist });
// }

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   const username = session?.user?.name;

//   if (!username) {
//     return NextResponse.json({ message: "User not found" });
//   }

//   //? returns the user and the watchlist
//   const user = (await UserModel.findOne({ username })
//     .select("watchlist")
//     .lean()) as IUser | null;

//   const watchlist = user?.watchlist;

//   console.log("watchlistobject :>> ", watchlist);
//   return NextResponse.json({ watchlist });
// }

// export const getCollection = async (slug: string) => {
//     console.log("getting article for", slug);
//     try {
//       const content = await CollectionModel.findOne({
//         slug: slug,
//       })
//         .populate("artworks")
//         .lean();
//       console.log("content in getCollection", content);

//       const data = JSON.parse(JSON.stringify(content));

//       if (data) {
//         return data as IFrontendCollection;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.log("error :>> ", error);
//       return null;
//     }
//   };

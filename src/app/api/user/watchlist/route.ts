import { NextRequest, NextResponse } from "next/server";

import { UserModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import dbConnect from "@/utils/mongodb";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    console.log("Database connected successfully.");

    const { searchParams } = new URL(req.url);
    const userKey = searchParams.get("userKey");
    const userValue = searchParams.get("userValue");
    const userFieldsParam = searchParams.get("userFields");
    const watchlistArtworkFieldsParam = searchParams.get(
      "watchlistArtworkFields"
    );

    // Validate presence of userKey and userValue
    if (!userKey || !userValue) {
      console.error("Missing userKey or userValue.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 400,
          message: "Missing userKey or userValue",
        },
        { status: 400 }
      );
    }

    // Process fields parameter for user
    const userFields = parseFields(userFieldsParam);

    // Process fields parameter for populated watchlist artworks
    const watchlistArtworkFields = parseFields(watchlistArtworkFieldsParam);

    // Construct the query object dynamically
    const query: Record<string, string> = {
      [userKey]: userValue,
    };

    // Build the Mongoose query to find one user and populate watchlist
    let mongooseQuery = UserModel.findOne(query)
      .lean()
      .populate({
        path: "watchlist",
        select: watchlistArtworkFields || "", // Select specified fields or all if not specified
      });

    if (userFields) {
      mongooseQuery = mongooseQuery.select(userFields);
    }

    // Execute the query
    const user = await mongooseQuery;

    if (!user) {
      console.error("No user found matching the criteria.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return NextResponse.json(
//       { message: "Username not provided" },
//       { status: 400 }
//     );
//   }

//   const user = (await UserModel.findOne({ username })
//     .select("watchlist")
//     .lean()) as IUser | null;

//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   const watchlist = user.watchlist || [];

//   return NextResponse.json({ watchlist });
// }

// export async function PATCH(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const username = session?.user?.name;

//   if (!username) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   const user = await UserModel.findOne({ username });

//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   let json;
//   try {
//     json = await req.json();
//   } catch (error) {
//     return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
//   }

//   const artworkId = json?.artworkId;

//   if (!artworkId) {
//     return NextResponse.json(
//       { message: "Artwork ID not provided" },
//       { status: 400 }
//     );
//   }

//   const watchlistIndex = user.watchlist.indexOf(artworkId);

//   if (watchlistIndex > -1) {
//     // If the artwork is already in the watchlist, remove it
//     user.watchlist.splice(watchlistIndex, 1);
//     await user.save();
//     return NextResponse.json({ message: "Artwork removed from watchlist" });
//   } else {
//     // If the artwork is not in the watchlist, add it
//     user.watchlist.push(artworkId);
//     await user.save();
//     return NextResponse.json({ message: "Artwork added to watchlist" });
//   }
// }
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

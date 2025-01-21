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

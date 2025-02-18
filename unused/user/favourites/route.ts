import { UserModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { parseFields } from "@/lib/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);

  try {
    await dbConnect();

    const userKey = searchParams.get("userKey");
    const userValue = searchParams.get("userValue");
    const userFieldsParam = searchParams.get("userFields");
    const favouritedArtworkFieldsParam = searchParams.get(
      "favouritedArtworkFields"
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

    // Process fields parameter for populated favourites artworks
    const favouritedArtworkFields = parseFields(favouritedArtworkFieldsParam);

    // Construct the query object dynamically
    const query: Record<string, string> = {
      [userKey]: userValue,
    };

    // Build the Mongoose query to find one user and populate favourites
    let mongooseQuery = UserModel.findOne(query)
      .lean()
      .populate({
        path: "favourites",
        select: favouritedArtworkFields || "", // Select specified fields or all if not specified
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
    console.error("Error fetching user favourites:", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

import dbConnect from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { parseFields } from "@/utils/parseFields";
import { CollectionModel } from "@/lib/server/models";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();
    console.log("Database connected successfully.");

    const { searchParams } = new URL(req.url);
    const collectionKey = searchParams.get("collectionKey");
    const collectionValue = searchParams.get("collectionValue");
    const fieldsParam = searchParams.get("collectionFields");
    const populateFieldsParam = searchParams.get("artworkFields");

    //! Log received query parameters
    // console.log("Received Query Parameters:");
    // console.log("collectionKey:", collectionKey);
    // console.log("collectionValue:", collectionValue);
    // console.log("fieldsParam:", fieldsParam);
    // console.log("populateFieldsParam:", populateFieldsParam);

    // Validate presence of collectionKey and collectionValue
    if (!collectionKey || !collectionValue) {
      console.error("Missing collectionKey or collectionValue.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 400,
          message: "Missing collectionKey or collectionValue",
        },
        { status: 400 }
      );
    }

    // Process fields parameter for collection
    const collectionFields = parseFields(fieldsParam);

    // Process fields parameter for populated artworks
    const artworkFields = parseFields(populateFieldsParam);

    // Construct the query object dynamically
    const query: Record<string, string> = {
      [collectionKey]: collectionValue,
    };

    // Build the Mongoose query to return an array of collections
    let mongooseQuery = CollectionModel.findOne(query)
      //   .sort({ updatedAt: 1 })
      .lean()
      .populate({
        path: "artworks",
        select: artworkFields || "", // Select specified fields or all if not specified
      });

    if (collectionFields) {
      mongooseQuery = mongooseQuery.select(collectionFields);
    }

    // Execute the query
    const collections = await mongooseQuery;

    if (!collections || collections.length === 0) {
      console.error("No collections found matching the criteria.");
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Collection not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching collection artworks:", error);
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

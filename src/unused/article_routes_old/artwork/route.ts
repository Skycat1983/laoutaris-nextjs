import dbConnect from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { parseFields } from "@/utils/parseFields";
import { ArticleModel } from "@/lib/server/models";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);

  try {
    await dbConnect();

    const articleKey = searchParams.get("articleKey");
    const articleValue = searchParams.get("articleValue");
    const fieldsParam = searchParams.get("articleFields");
    const populateFieldsParam = searchParams.get("artworkFields");

    // Validate presence of collectionKey and collectionValue
    if (!articleKey || !articleValue) {
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
    const articleFields = parseFields(populateFieldsParam);

    // Construct the query object dynamically
    const query: Record<string, string> = {
      [articleKey]: articleValue,
    };

    // Build the Mongoose query to return an array of collections
    let mongooseQuery = ArticleModel.findOne(query)
      //   .sort({ updatedAt: 1 })
      .lean()
      .populate({
        path: "artwork",
        select: articleFields || "", // Select specified fields or all if not specified
      });

    if (collectionFields) {
      mongooseQuery = mongooseQuery.select(collectionFields);
    }

    // Execute the query
    const article = await mongooseQuery;

    if (!article || article.length === 0) {
      console.error("No articles found matching the criteria.");
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
      data: article,
    });
  } catch (error) {
    console.error("Error fetching article artwork:", error);
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

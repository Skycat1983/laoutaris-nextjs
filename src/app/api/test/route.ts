import { ArticleModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Execute the query
    const collections = await ArticleModel.find().sort({ updatedAt: 1 }).lean();

    if (!collections.length) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Articles not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching artciles:", error);
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

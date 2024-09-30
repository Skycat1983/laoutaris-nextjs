import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const fieldsParam = searchParams.get("fields"); // e.g., "title,slug,subtitle,imageUrl"

  // Default fields if none are specified
  const defaultFields = "title slug";

  // Prepare fields for the .select() method
  const fields = fieldsParam ? fieldsParam.replace(/,/g, " ") : defaultFields;

  try {
    const articles = await ArticleModel.find({ section })
      .select(fields)
      .sort({ updatedAt: 1 })
      .lean();

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Articles not found",
        },
        { status: 404 }
      );
    }

    // Return the articles directly
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
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

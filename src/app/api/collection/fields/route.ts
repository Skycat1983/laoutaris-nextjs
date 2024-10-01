import { ArticleModel, CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const fieldsParam = searchParams.get("fields");

  const defaultFields = "title slug";

  const fields = fieldsParam ? fieldsParam.replace(/,/g, " ") : defaultFields;

  try {
    const articles = await CollectionModel.find({ section })
      .select(fields)
      .sort({ updatedAt: 1 })
      .lean();

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 404,
          message: "Collections not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
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

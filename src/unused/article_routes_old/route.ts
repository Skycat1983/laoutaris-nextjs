import { ArticleModel } from "@/lib/server/models";
import { parseFields } from "@/utils/parseFields";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);

  try {
    const identifierKey = searchParams.get("identifierKey");
    const identifierValue = searchParams.get("identifierValue");
    const fieldsParam = searchParams.get("fields");

    // Validate presence of identifierKey and identifierValue
    if (!identifierKey || !identifierValue) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 400,
          message: "Missing identifierKey or identifierValue",
        },
        { status: 400 }
      );
    }

    const fields = parseFields(fieldsParam);

    const query: Record<string, string> = {
      [identifierKey]: identifierValue,
    };

    let mongooseQuery = ArticleModel.find(query).sort({ updatedAt: 1 }).lean();

    if (fields) {
      mongooseQuery = mongooseQuery.select(fields);
    }

    const articles = await mongooseQuery;
    // console.log("articles in api/article route.ts", articles);

    if (!articles.length) {
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
      data: articles,
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

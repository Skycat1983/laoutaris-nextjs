import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import type { FrontendArticle } from "@/lib/data/types/articleTypes";

type ArticleApiResponse = ApiResponse<FrontendArticle[]>;

export const GET = async (
  req: NextRequest
): Promise<NextResponse<ArticleApiResponse>> => {
  try {
    const { searchParams } = new URL(req.url);

    // Build query object
    const query: any = {};
    if (searchParams.get("section")) {
      query.section = searchParams.get("section");
    }

    // Handle field selection
    const fields = searchParams.get("fields")?.split(",").join(" ") || "";

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const [articles, total] = await Promise.all([
      ArticleModel.find(query)
        .select(fields)
        .skip((page - 1) * limit)
        .limit(limit),
      ArticleModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies PaginatedResponse<FrontendArticle[]>);
  } catch (error) {
    console.error("Article fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        statusCode: 500,
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
};

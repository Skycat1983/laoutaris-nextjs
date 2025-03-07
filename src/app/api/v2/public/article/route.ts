import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import type { FrontendArticle } from "@/lib/data/types/articleTypes";
import {
  ApiErrorResponse,
  ApiResponse,
  PaginatedResponse,
  RouteResponse,
} from "@/lib/data/types/apiTypes";
import {
  ApiArticlePopulatedPublicResult,
  ApiArticlesPublicResult,
} from "@/lib/api/public/article/fetchers";

// type ArticleApiResponse = RouteResponse<FrontendArticle[]>;

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiArticlePopulatedPublicResult>> => {
  const { searchParams } = req.nextUrl;

  try {
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

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No articles found",
      } satisfies ApiErrorResponse);
    }
    return NextResponse.json({
      success: true,
      data: articles,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiArticlesPublicResult);
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

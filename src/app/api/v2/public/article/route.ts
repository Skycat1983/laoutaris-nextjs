import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ApiArticleListResult } from "@/lib/api/public/article/fetchers";
import { transformArticle } from "@/lib/transforms/article/transformArticle";
import { ArticleLean, ArticleFrontend } from "@/lib/data/types";

type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiArticleListResult>> => {
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
        .limit(limit)
        .lean<ArticleLean[]>(),
      ArticleModel.countDocuments(query),
    ]);

    if (articles.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No articles found",
      } satisfies ApiErrorResponse);
    }

    const transformedArticles: ArticleFrontend[] = articles.map((article) =>
      transformArticle.toFrontend(article, null)
    );
    return NextResponse.json({
      success: true,
      data: transformedArticles,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiArticleListResult);
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

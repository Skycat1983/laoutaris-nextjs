import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadArticleListResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import {
  AdminArticleTransformationsPopulated,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { transformAdminArticlePopulated } from "@/lib/transforms/transformAdmin";
import { transformArticlePopulated } from "@/lib/transforms";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArticleListResult>> {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");

  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }

  try {
    const [leanArticles, total] = await Promise.all([
      ArticleModel.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("artwork")
        .lean<AdminArticleTransformationsPopulated["Lean"][]>(),
      ArticleModel.countDocuments(),
    ]);

    if (leanArticles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No articles found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const articles: ArticleFrontendPopulated[] = leanArticles.map((article) =>
      transformArticlePopulated(article)
    );

    return NextResponse.json({
      success: true,
      data: articles,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadArticleListResult);
  } catch (error) {
    console.error("Error reading articles:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read articles",
      } satisfies ApiErrorResponse,
      {
        status: 500,
      }
    );
  }
}

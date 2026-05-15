import { ArticleModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadArticleListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  AdminArticleTransformationsPopulated,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { transformArticlePopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArticleListResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");

  try {
    await dbConnect();

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
      return apiErrorResponse({
        message: "No articles found",
        status: 404,
      });
    }

    const articles: ArticleFrontendPopulated[] = leanArticles.map((article) =>
      transformArticlePopulated(article)
    );

    return apiListResponse(articles, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error reading articles:", error);
    return apiErrorResponse({
      message: "Failed to read articles",
      status: 500,
    });
  }
}

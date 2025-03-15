import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ArticleModel } from "@/lib/data/models";
import { ReadArticleResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import {
  AdminArticleTransformationsPopulated,
  AdminArtworkTransformations,
  AdminUserTransformations,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { transformAdminArticlePopulated } from "@/lib/transforms/transformAdmin";
import { transformArticlePopulated } from "@/lib/transforms";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArticleResult>> {
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
  const { id } = params;

  try {
    const leanArticle = await ArticleModel.findById(id)
      .populate<{
        artwork: AdminArtworkTransformations["Lean"];
        author: AdminUserTransformations["Lean"];
      }>(["artwork", "author"])
      .lean<AdminArticleTransformationsPopulated["Lean"]>();

    if (!leanArticle) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found",
        } satisfies ApiErrorResponse,
        {
          status: 404,
        }
      );
    }

    const frontendArticle: ArticleFrontendPopulated =
      transformArticlePopulated(leanArticle);

    return NextResponse.json({
      success: true,
      data: frontendArticle,
    } satisfies ReadArticleResult);
  } catch (error) {
    console.error("Error reading article:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read article",
      } satisfies ApiErrorResponse,
      {
        status: 500,
      }
    );
  }
}

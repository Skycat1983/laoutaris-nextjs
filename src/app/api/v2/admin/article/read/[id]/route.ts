import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ArticleModel } from "@/lib/data/models";
import { ReadArticleResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import {
  AdminArticleTransformationsPopulated,
  AdminArtworkTransformations,
  AdminUserTransformations,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { transformArticlePopulated } from "@/lib/transforms";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArticleResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("article", "Invalid article ID");
  }

  try {
    await dbConnect();

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

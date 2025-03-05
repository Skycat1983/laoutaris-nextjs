import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";
import { ArticleModel } from "@/lib/data/models";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { ReadArticleResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";

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
    const rawArticle = await ArticleModel.findById(id)
      .populate(["artwork", "author"])
      .lean()
      .exec();

    if (!rawArticle) {
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

    const article =
      transformMongooseDoc<FrontendArticleWithArtworkAndAuthor>(rawArticle);

    return NextResponse.json({
      success: true,
      data: article,
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

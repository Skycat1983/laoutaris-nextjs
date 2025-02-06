import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import type {
  FrontendArticle,
  FrontendArticleWithArtwork,
} from "@/lib/types/articleTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

type ArticleWithArtworkResponse = ApiResponse<FrontendArticleWithArtwork>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ArticleWithArtworkResponse>> => {
  try {
    const mongoArticle = await ArticleModel.findOne({ slug: params.slug })
      .populate("artwork")
      .lean();

    if (!mongoArticle) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const article =
      transformMongooseDoc<FrontendArticleWithArtwork>(mongoArticle);

    return NextResponse.json({
      success: true,
      data: article,
    } satisfies ArticleWithArtworkResponse);
  } catch (error) {
    console.error("Error fetching article artwork:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article artwork",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

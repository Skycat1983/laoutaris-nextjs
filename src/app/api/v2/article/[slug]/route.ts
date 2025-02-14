import { ArticleModel } from "@/lib/data/models";
import { FrontendArticle } from "@/lib/data/types/articleTypes";
import { NextRequest, NextResponse } from "next/server";

type SingleArticleResponse = ApiResponse<FrontendArticle>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<SingleArticleResponse>> => {
  try {
    const article = await ArticleModel.findOne({ slug: params.slug });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found",
          statusCode: 404,
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    } satisfies ApiSuccessResponse<FrontendArticle>);
  } catch (error) {
    console.error("Article fetch error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

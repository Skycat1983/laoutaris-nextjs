import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import {
  ArticleExtendedPopulated,
  ArticleFrontendPopulated,
  ArticleLeanPopulated,
  ArticleSanitizedPopulated,
} from "@/lib/data/types";
import { ApiArticlePopulatedPublicResult } from "@/lib/api/public/article/fetchers";
import { sanitizeArticlePopulated } from "@/lib/transforms/sanitizeArticle";
import { extendArticlePopulated } from "@/lib/transforms/extendArticle";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedPublicResult>> => {
  try {
    // populate both artwork and author
    const mongoArticle = await ArticleModel.findOne({ slug: params.slug })
      .populate("artwork")
      .populate("author")
      .lean();

    if (!mongoArticle) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    // Step 1: Convert raw DB object into a proper TypeScript type
    const articleLean: ArticleLeanPopulated =
      transformMongooseDoc<ArticleLeanPopulated>(mongoArticle);

    // Step 2: Extend the entire article (author + artwork)
    const articleExtended: ArticleExtendedPopulated =
      extendArticlePopulated(articleLean);

    // Step 3: Sanitize the entire article (including extended artwork and author)
    const articleSanitized: ArticleSanitizedPopulated =
      sanitizeArticlePopulated(articleExtended);

    // Step 4: Final frontend version (optional, if needed)
    const articleFrontend: ArticleFrontendPopulated = articleSanitized;

    return NextResponse.json({
      success: true,
      data: articleFrontend,
    } satisfies ApiArticlePopulatedPublicResult);
  } catch (error) {
    console.error("Error fetching article artwork:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article artwork",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

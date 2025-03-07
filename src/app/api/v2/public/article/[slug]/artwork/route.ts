import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import {
  ArticleFrontendPopulated,
  ArticleLeanPopulated,
  ArticleSanitizedPopulated,
} from "@/lib/data/types";
import { ApiArticlePopulatedPublicResult } from "@/lib/api/public/article/fetchers";
import { sanitizeArticlePopulated } from "@/lib/transforms/sanitizeArticle";

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

    const leanArticle: ArticleLeanPopulated =
      transformMongooseDoc<ArticleLeanPopulated>(mongoArticle);

    const sanitizedArticle: ArticleSanitizedPopulated =
      sanitizeArticlePopulated(leanArticle);

    const frontendArticle: ArticleFrontendPopulated = {
      ...sanitizedArticle,
      artwork: {
        isFavourited: leanArticle.artwork.favourited.includes(
          leanArticle.author._id
        ),
        favouriteCount: leanArticle.artwork.favourited.length,
        isWatchlisted: leanArticle.artwork.watcherlist.includes(
          leanArticle.author._id
        ),
        watchlistCount: leanArticle.artwork.watcherlist.length,
      },
    };

    return NextResponse.json({
      success: true,
      data: frontendArticle,
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

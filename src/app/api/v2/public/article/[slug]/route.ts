import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ApiArticlePopulatedResult } from "@/lib/api/public/article/fetchers";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformArticlePopulated } from "@/lib/transforms/article/transformArticle";
import { UserLean } from "@/lib/data/types/userTypes";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import {
  ArticleLeanPopulated,
  ArticleFrontendPopulated,
} from "@/lib/data/types/articleTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import dbConnect from "@/lib/db/mongodb";
type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedResult>> => {
  const userId = await getUserIdFromSession();
  try {
    await dbConnect();

    // populate both artwork and author
    const articleDB = await ArticleModel.findOne({ slug: params.slug })
      .populate<{
        author: UserLean;
        artwork: ArtworkLean;
      }>("author artwork")
      .lean<ArticleLeanPopulated>();

    if (!articleDB) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const articlePublic: ArticleFrontendPopulated =
      transformArticlePopulated(articleDB);

    return NextResponse.json({
      success: true,
      data: articlePublic,
    } satisfies ApiArticlePopulatedResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching article artwork:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article artwork",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

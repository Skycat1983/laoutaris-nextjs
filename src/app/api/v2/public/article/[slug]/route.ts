import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import {
  PublicArtworkTransformations,
  PublicUserTransformations,
} from "@/lib/data/types";
// import { transformArticlePopulated } from "@/lib/transforms/transformArticle";
import { ApiArticlePopulatedResult } from "@/lib/api/public/article/fetchers";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { PublicArticleTransformationsPopulated } from "@/lib/data/types/articleTypes";
import { transformArticlePopulated } from "@/lib/transforms/transformArticle";
type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedResult>> => {
  const userId = await getUserIdFromSession();
  try {
    // populate both artwork and author
    const articleDB = await ArticleModel.findOne({ slug: params.slug })
      .populate<{
        author: PublicUserTransformations["Lean"];
        artwork: PublicArtworkTransformations["Lean"];
      }>("author artwork")
      .lean<PublicArticleTransformationsPopulated["Lean"]>();

    if (!articleDB) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const articlePublic: PublicArticleTransformationsPopulated["Frontend"] =
      transformArticlePopulated(articleDB);

    return NextResponse.json({
      success: true,
      data: articlePublic,
    } satisfies ApiArticlePopulatedResult);
  } catch (error) {
    console.error("Error fetching article artwork:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article artwork",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

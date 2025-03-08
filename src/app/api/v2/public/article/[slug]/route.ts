import { ArticleDB, ArticleModel, ArtworkDB, UserDB } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { LeanDocument } from "@/lib/data/types";
import { transformArticlePopulated } from "@/lib/transforms/transformArticle";
import { ArticlePopulatedPublic } from "@/lib/data/types/transformationTypes";
import { ApiSingleArticlePopulatedResult } from "@/lib/api/public/article/fetchers";

type RouteResponse<T> = NextResponse<T | ApiErrorResponse>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiSingleArticlePopulatedResult>> => {
  try {
    // populate both artwork and author
    const articleDB = await ArticleModel.findOne({ slug: params.slug })
      .populate<{
        author: LeanDocument<UserDB>;
        artwork: LeanDocument<ArtworkDB>;
      }>("author artwork")
      .lean<ArticleDB & { author: UserDB; artwork: ArtworkDB }>();

    if (!articleDB) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const articlePublic: ArticlePopulatedPublic =
      transformArticlePopulated(articleDB);

    return NextResponse.json({
      success: true,
      data: articlePublic,
    } satisfies ApiSingleArticlePopulatedResult);
  } catch (error) {
    console.error("Error fetching article artwork:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article artwork",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

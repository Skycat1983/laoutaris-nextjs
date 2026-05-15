import { ArticleModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
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

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedResult>> => {
  try {
    await getUserIdFromSession();
    await dbConnect();

    // populate both artwork and author
    const articleDB = await ArticleModel.findOne({ slug: params.slug })
      .populate<{
        author: UserLean;
        artwork: ArtworkLean;
      }>("author artwork")
      .lean<ArticleLeanPopulated>();

    if (!articleDB) {
      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

    const articlePublic: ArticleFrontendPopulated =
      transformArticlePopulated(articleDB);

    return apiSuccessResponse<ApiArticlePopulatedResult["data"]>(
      articlePublic
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching article artwork:", error);
    return apiErrorResponse({
      message: "Failed to fetch article",
      status: 500,
    });
  }
};

import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiArticlePopulatedResult } from "@/lib/api/public/article/fetchers";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { isNextError } from "@/lib/helpers/isNextError";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedResult>> => {
  try {
    await getUserIdFromSession();

    const articlePublic = await getArticleBySlugPopulated(params.slug);
    if (!articlePublic) {
      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

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

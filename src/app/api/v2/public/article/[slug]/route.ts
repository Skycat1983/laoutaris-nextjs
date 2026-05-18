import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiArticlePopulatedResult } from "@/lib/api/public/article/fetchers";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { isNextError } from "@/lib/helpers/isNextError";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiArticlePopulatedResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/article/[slug]"
  );
  const logger = createApiLogger(requestContext);

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

    logger.error("api.public.article_detail.failed", {
      error,
      errorLabel: "article_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

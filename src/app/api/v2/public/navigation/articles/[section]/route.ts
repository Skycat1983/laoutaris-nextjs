import type { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ArticleSection } from "@/lib/constants";
import type { RouteResponse } from "@/lib/data/types";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { NextRequest } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const dynamic = "force-dynamic";

export const GET = async (
  request: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/navigation/articles/[section]"
  );
  const logger = createApiLogger(requestContext);
  const { section } = params;

  try {
    const result = await getArticleNavigationList(section);

    if (!result) {
      return apiErrorResponse({
        message: "No articles found",
        status: 404,
      });
    }

    return apiListResponse(result.data, result.metadata);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.article_navigation.failed", {
      error,
      errorLabel: "article_navigation_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch article navigation",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

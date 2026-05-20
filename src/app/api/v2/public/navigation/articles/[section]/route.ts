import type { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { NextRequest, NextResponse } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import {
  parsePublicArticleNavigationParams,
  type PublicArticleNavigationParamsFieldErrors,
} from "@/lib/data/schemas/publicTaxonomySectionSchema";

export const dynamic = "force-dynamic";

type ArticleNavigationValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: PublicArticleNavigationParamsFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: PublicArticleNavigationParamsFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<ArticleNavigationValidationErrorResponse>(
    {
      success: false,
      error: "Invalid article navigation query",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export const GET = async (
  request: NextRequest,
  { params }: { params: { section: string } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/navigation/articles/[section]"
  );
  const logger = createApiLogger(requestContext);
  const parsedParams = parsePublicArticleNavigationParams(params);

  if (!parsedParams.success) {
    const { fieldErrors, formErrors } = parsedParams.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  const { section } = parsedParams.data;

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

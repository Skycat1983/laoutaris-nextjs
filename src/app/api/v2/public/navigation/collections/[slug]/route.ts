import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { ApiCollectionNavItemResult } from "@/lib/api/public/navigation/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionNavItemResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/navigation/collections/[slug]"
  );
  const logger = createApiLogger(requestContext);
  const { slug } = params;

  try {
    const collectionNavData = await getCollectionNavigationItem(slug);

    if (!collectionNavData) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionNavItemResult["data"]>(
      collectionNavData
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.collection_navigation_detail.failed", {
      error,
      errorLabel: "collection_navigation_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collection navigation",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

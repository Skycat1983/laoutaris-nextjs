import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ApiCollectionNavListResult } from "@/lib/api/public/navigation/fetchers";
import { RouteResponse } from "@/lib/data/types";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { NextRequest } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const dynamic = "force-dynamic";

export const GET = async (
  request: NextRequest
): Promise<RouteResponse<ApiCollectionNavListResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/navigation/collections"
  );
  const logger = createApiLogger(requestContext);

  try {
    const result = await getCollectionNavigationList();

    if (!result) {
      return apiErrorResponse({
        message: "No collections found",
        status: 404,
      });
    }

    return apiListResponse(result.data, result.metadata);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.collection_navigation.failed", {
      error,
      errorLabel: "collection_navigation_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collection navigation",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

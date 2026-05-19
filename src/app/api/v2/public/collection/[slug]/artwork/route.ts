import type { NextRequest } from "next/server";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/collection/[slug]/artwork"
  );
  const logger = createApiLogger(requestContext);

  try {
    const collection = await getCollectionWithArtworks(params.slug);

    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      collection
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.collection_artwork_list.failed", {
      error,
      errorLabel: "collection_artwork_list_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collection with artworks",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { ApiCollectionResult } from "@/lib/api/public/collection/fetchers";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/collection/[slug]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const collection = await CollectionModel.findOne({
      slug: params.slug,
    });

    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionResult["data"]>(
      collection as ApiCollectionResult["data"]
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.collection_detail.failed", {
      error,
      errorLabel: "collection_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

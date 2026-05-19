import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type {
  CollectionLeanPopulated,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { transformCollectionPopulated } from "@/lib/transforms";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/navigation/collections/[slug]/artworks"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const rawCollection: CollectionLeanPopulated =
      (await CollectionModel.findOne({
        slug: params.slug,
      })
        .populate<CollectionLeanPopulated>("artworks")
        .lean()) as CollectionLeanPopulated;

    if (!rawCollection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    const frontendCollection: CollectionFrontendPopulated =
      transformCollectionPopulated(rawCollection);

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      frontendCollection
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.collection_artworks_navigation.failed", {
      error,
      errorLabel: "collection_artworks_navigation_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collection artworks navigation",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

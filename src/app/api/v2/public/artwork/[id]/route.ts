import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { ApiArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ApiArtworkResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/artwork/[id]"
  );
  const logger = createApiLogger(requestContext);
  const { id } = params;

  try {
    const userId = await getUserIdFromSession();
    const artwork = await getArtworkById(id, userId);

    if (!artwork)
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });

    return apiSuccessResponse<ApiArtworkResult["data"]>(artwork);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.artwork_detail.failed", {
      error,
      errorLabel: "artwork_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch artwork",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

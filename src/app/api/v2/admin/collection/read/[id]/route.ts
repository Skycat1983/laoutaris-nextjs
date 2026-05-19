import { CollectionModel } from "@/lib/data/models";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadCollectionResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import type { AdminCollectionTransformationsPopulated, AdminArtworkTransformations, CollectionFrontendPopulated } from "@/lib/data/types";
import { transformCollectionPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadCollectionResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/read/[id]"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("collection", "Invalid collection ID");
  }

  try {
    await dbConnect();

    const leanCollection = await CollectionModel.findById(id)
      .populate<{
        artworks: AdminArtworkTransformations["Lean"][];
      }>("artworks")
      .lean<AdminCollectionTransformationsPopulated["Lean"]>();

    if (!leanCollection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    const collection: CollectionFrontendPopulated =
      transformCollectionPopulated(leanCollection);

    return apiSuccessResponse(collection);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.collection_read.failed", {
      operation: "admin.collection.read.detail",
      error,
      errorLabel: "admin_collection_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

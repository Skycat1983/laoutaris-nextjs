import { NextRequest } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("collection", "Invalid collection ID");
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/delete/[id]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const deletedCollection = await CollectionModel.findByIdAndDelete(id);

    if (!deletedCollection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse(null, {
      message: "Collection deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.collection_delete.failed", {
      operation: "admin.collection.delete",
      error,
      errorLabel: "admin_collection_delete_failed",
    });
    return apiErrorResponse({
      message: "Failed to delete collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

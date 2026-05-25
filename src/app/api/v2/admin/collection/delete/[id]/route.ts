import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { ArtworkModel, CollectionModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
  readAdminDeleteEvidenceRequest,
} from "@/lib/api/admin/delete/routeValidation";
import {
  createAdminDeleteAuditEvent,
  updateAdminDeleteAuditEventOutcome,
  type AdminDeleteAuditEventHandle,
} from "@/lib/api/admin/delete/audit";
import { getCollectionDeletePreview } from "@/lib/api/admin/delete/preview";
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

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "collection"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.collection.delete";
  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();

    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "collection",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getCollectionDeletePreview(id),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    session = await mongoose.startSession();
    session.startTransaction();

    const deletedCollection =
      await CollectionModel.findByIdAndDelete(id).session(session);

    if (!deletedCollection) {
      await session.abortTransaction();
      await updateAdminDeleteAuditEventOutcome({
        auditEvent,
        outcome: "not_found",
        responseStatus: 404,
        reason: "not_found",
        operation,
        logger,
      });

      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    await ArtworkModel.updateMany(
      { collections: id },
      { $pull: { collections: id } }
    ).session(session);

    await session.commitTransaction();
    await updateAdminDeleteAuditEventOutcome({
      auditEvent,
      outcome: "succeeded",
      responseStatus: 200,
      operation,
      logger,
    });

    return apiSuccessResponse(null, {
      message: "Collection deleted and removed from artwork successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    await session?.abortTransaction();
    logger.error("api.admin.collection_delete.failed", {
      operation,
      error,
      errorLabel: "admin_collection_delete_failed",
    });
    await updateAdminDeleteAuditEventOutcome({
      auditEvent,
      outcome: "failed",
      responseStatus: 500,
      reason: "handled_failure",
      operation,
      logger,
    });
    return apiErrorResponse({
      message: "Failed to delete collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    session?.endSession();
  }
}

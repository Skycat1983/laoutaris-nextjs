import { ArtworkModel, ArticleModel, CollectionModel } from "@/lib/data/models";
import mongoose from "mongoose";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
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
import { getArtworkDeletePreview } from "@/lib/api/admin/delete/preview";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("artwork", "Invalid artwork ID");
  }

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "artwork"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/artwork/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.artwork.delete";

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();
    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "artwork",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getArtworkDeletePreview(id),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    session = await mongoose.startSession();
    session.startTransaction();

    //  check if artwork is used in any articles
    const articleUsingArtwork = await ArticleModel.findOne({ artwork: id });
    if (articleUsingArtwork) {
      await session.abortTransaction();
      await updateAdminDeleteAuditEventOutcome({
        auditEvent,
        outcome: "blocked",
        responseStatus: 409,
        reason: "artwork_referenced_by_article",
        operation,
        logger,
      });
      return apiErrorResponse({
        message: `Cannot delete artwork: It is currently used in a article with id ${articleUsingArtwork._id}`,
        error: "Cannot delete artwork: It is currently used in a article",
        status: 409,
      });
    }

    // if no articles are using it, proceed with deletion and updating collections
    const [deletedArtwork] = await Promise.all([
      // Delete the artwork
      ArtworkModel.findByIdAndDelete(id).session(session),

      // Remove artwork from collections' artworks arrays
      CollectionModel.updateMany(
        { artworks: id },
        { $pull: { artworks: id } }
      ).session(session),
    ]);

    if (!deletedArtwork) {
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
        message: "Artwork not found",
        status: 404,
      });
    }

    await session.commitTransaction();
    await updateAdminDeleteAuditEventOutcome({
      auditEvent,
      outcome: "succeeded",
      responseStatus: 200,
      operation,
      logger,
    });
    return apiSuccessResponse(null, {
      message: "Artwork deleted and removed from collections successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    await session?.abortTransaction();
    logger.error("api.admin.artwork_delete.failed", {
      operation,
      error,
      errorLabel: "admin_artwork_delete_failed",
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
      message: "Failed to delete artwork",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    session?.endSession();
  }
}

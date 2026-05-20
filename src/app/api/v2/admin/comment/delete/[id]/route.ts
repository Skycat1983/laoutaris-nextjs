import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
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
import { getCommentDeletePreview } from "@/lib/api/admin/delete/preview";
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
    return adminDeleteInvalidIdResponse("comment", "Invalid comment ID");
  }

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "comment"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/comment/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.comment.delete";

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();
    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "comment",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getCommentDeletePreview(id),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    session = await mongoose.startSession();
    session.startTransaction();

    // Find the comment first to get user and blog IDs
    const comment = await CommentModel.findById(id).session(session);
    if (!comment) {
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
        message: "Comment not found",
        status: 404,
      });
    }

    // Remove comment ID from user's comments array
    await UserModel.findByIdAndUpdate(
      comment.author,
      { $pull: { comments: comment._id } },
      { session }
    );

    // Remove comment ID from blog's comments array
    await BlogModel.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: comment._id } },
      { session }
    );

    // Finally delete the comment
    await CommentModel.findByIdAndDelete(id).session(session);

    // If everything succeeded, commit the transaction
    await session.commitTransaction();
    await updateAdminDeleteAuditEventOutcome({
      auditEvent,
      outcome: "succeeded",
      responseStatus: 200,
      operation,
      logger,
    });

    return apiSuccessResponse(null, {
      message: "Comment deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    logger.error("api.admin.comment_delete.failed", {
      operation,
      error,
      errorLabel: "admin_comment_delete_failed",
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
      message: "Failed to delete comment",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}

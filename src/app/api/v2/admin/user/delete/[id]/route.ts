import {
  ArtworkModel,
  BlogModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
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
import { getUserDeletePreview } from "@/lib/api/admin/delete/preview";
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
    return adminDeleteInvalidIdResponse("user", "Invalid user ID");
  }

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "user"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/user/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.user.delete";

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();
    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "user",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getUserDeletePreview(id, admin.userId),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    if (id === admin.userId) {
      await updateAdminDeleteAuditEventOutcome({
        auditEvent,
        outcome: "blocked",
        responseStatus: 403,
        reason: "current_admin_account",
        operation,
        logger,
      });

      return apiErrorResponse({
        message: "Cannot delete the current admin account",
        status: 403,
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    // Find the user first
    const user = await UserModel.findById(id).session(session);
    if (!user) {
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
        message: "User not found",
        status: 404,
      });
    }

    if (user.role === "admin") {
      const adminCount = await UserModel.countDocuments({
        role: "admin",
      }).session(session);

      if (adminCount <= 1) {
        await session.abortTransaction();
        await updateAdminDeleteAuditEventOutcome({
          auditEvent,
          outcome: "blocked",
          responseStatus: 409,
          reason: "last_admin_account",
          operation,
          logger,
        });
        return apiErrorResponse({
          message: "Cannot delete the last remaining admin account",
          status: 409,
        });
      }
    }

    // 1. Handle user's comments
    if (user.comments.length > 0) {
      // Get all comments by this user
      const comments = await CommentModel.find({
        _id: { $in: user.comments },
      }).session(session);

      // Get unique blog IDs that have comments from this user
      const blogIds = Array.from(
        new Set(comments.map((comment) => comment.blog))
      );

      // Remove comment IDs from all affected blogs
      await BlogModel.updateMany(
        { _id: { $in: blogIds } },
        { $pull: { comments: { $in: user.comments } } },
        { session }
      );

      // Delete all comments by this user
      await CommentModel.deleteMany({
        _id: { $in: user.comments },
      }).session(session);
    }

    // 2. Handle user's watchlist
    if (user.watchlist.length > 0) {
      await ArtworkModel.updateMany(
        { _id: { $in: user.watchlist } },
        { $pull: { watcherlist: user._id } },
        { session }
      );
    }

    // 3. Handle user's favourites
    if (user.favourites.length > 0) {
      await ArtworkModel.updateMany(
        { _id: { $in: user.favourites } },
        { $pull: { favourited: user._id } },
        { session }
      );
    }

    // 4. Finally delete the user
    await UserModel.findByIdAndDelete(id).session(session);

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
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    logger.error("api.admin.user_delete.failed", {
      operation,
      error,
      errorLabel: "admin_user_delete_failed",
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
      message: "Failed to delete user and associated data",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}

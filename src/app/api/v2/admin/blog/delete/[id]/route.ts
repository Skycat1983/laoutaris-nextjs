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
import { getBlogDeletePreview } from "@/lib/api/admin/delete/preview";
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
    return adminDeleteInvalidIdResponse("blog", "Invalid blog ID");
  }

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "blog"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/blog/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.blog.delete";

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();
    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "blog",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getBlogDeletePreview(id),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    session = await mongoose.startSession();
    session.startTransaction();

    // Find the blog and its comments
    const blog = await BlogModel.findById(id).session(session);
    if (!blog) {
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
        message: "Blog not found",
        status: 404,
      });
    }

    // If blog has comments, handle the cleanup
    if (blog.comments.length > 0) {
      // Find all comments for this blog
      const comments = await CommentModel.find({
        _id: { $in: blog.comments },
      }).session(session);

      // Get unique user IDs who made comments
      const userIds = Array.from(
        new Set(comments.map((comment) => comment.author))
      );

      // Remove comment IDs from users' comments arrays
      await UserModel.updateMany(
        { _id: { $in: userIds } },
        { $pull: { comments: { $in: blog.comments } } },
        { session }
      );

      // Delete all comments
      await CommentModel.deleteMany({
        _id: { $in: blog.comments },
      }).session(session);
    }

    // Finally delete the blog
    await BlogModel.findByIdAndDelete(id).session(session);

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
      message: "Blog and associated comments deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    logger.error("api.admin.blog_delete.failed", {
      operation,
      error,
      errorLabel: "admin_blog_delete_failed",
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
      message: "Failed to delete blog and associated data",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}

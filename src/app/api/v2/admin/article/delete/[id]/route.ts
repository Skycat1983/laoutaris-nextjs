import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { ArticleModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { NextRequest } from "next/server";
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
import { getArticleDeletePreview } from "@/lib/api/admin/delete/preview";
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
    return adminDeleteInvalidIdResponse("article", "Invalid article ID");
  }

  const evidenceValidation = await readAdminDeleteEvidenceRequest(
    request,
    "article"
  );
  if (!evidenceValidation.ok) {
    return evidenceValidation.response;
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/delete/[id]"
  );
  const logger = createApiLogger(requestContext);
  const operation = "admin.article.delete";
  let auditEvent: AdminDeleteAuditEventHandle | null = null;

  try {
    await dbConnect();

    const auditResult = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "article",
      resourceId: id,
      evidence: evidenceValidation.evidence,
      operation,
      logger,
      getPreview: () => getArticleDeletePreview(id),
    });
    if (!auditResult.ok) {
      return auditResult.response;
    }
    auditEvent = auditResult.auditEvent;

    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      await updateAdminDeleteAuditEventOutcome({
        auditEvent,
        outcome: "not_found",
        responseStatus: 404,
        reason: "not_found",
        operation,
        logger,
      });

      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

    await updateAdminDeleteAuditEventOutcome({
      auditEvent,
      outcome: "succeeded",
      responseStatus: 200,
      operation,
      logger,
    });

    return apiSuccessResponse(null, {
      message: "Article deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_delete.failed", {
      operation,
      error,
      errorLabel: "admin_article_delete_failed",
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
      message: "Failed to delete article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

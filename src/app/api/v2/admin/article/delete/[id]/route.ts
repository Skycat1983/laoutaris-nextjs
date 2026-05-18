import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { ArticleModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
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
    return adminDeleteInvalidIdResponse("article", "Invalid article ID");
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/delete/[id]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

    return apiSuccessResponse(null, {
      message: "Article deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_delete.failed", {
      operation: "admin.article.delete",
      error,
      errorLabel: "admin_article_delete_failed",
    });
    return apiErrorResponse({
      message: "Failed to delete article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

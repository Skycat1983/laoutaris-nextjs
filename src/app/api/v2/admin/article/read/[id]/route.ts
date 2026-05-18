import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ArticleModel } from "@/lib/data/models";
import { ReadArticleResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import {
  AdminArticleTransformationsPopulated,
  AdminArtworkTransformations,
  AdminUserTransformations,
  ArticleFrontendPopulated,
} from "@/lib/data/types";
import { transformArticlePopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArticleResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/read/[id]"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("article", "Invalid article ID");
  }

  try {
    await dbConnect();

    const leanArticle = await ArticleModel.findById(id)
      .populate<{
        artwork: AdminArtworkTransformations["Lean"];
        author: AdminUserTransformations["Lean"];
      }>(["artwork", "author"])
      .lean<AdminArticleTransformationsPopulated["Lean"]>();

    if (!leanArticle) {
      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

    const frontendArticle: ArticleFrontendPopulated =
      transformArticlePopulated(leanArticle);

    return apiSuccessResponse(frontendArticle);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_read.failed", {
      operation: "admin.article.read.detail",
      error,
      errorLabel: "admin_article_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

import { NextRequest } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { CommentModel } from "@/lib/data/models";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadCommentResult } from "@/lib/api/admin/read/fetchers";
import type {
  CommentFrontendPopulated,
  CommentLeanPopulated,
} from "@/lib/data/types";
import { transformCommentPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadCommentResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/comment/read/[id]"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("comment", "Invalid comment ID");
  }

  try {
    await dbConnect();

    const leanComment = await CommentModel.findById(id)
      .populate("author blog")
      .lean<CommentLeanPopulated>();

    if (!leanComment) {
      return apiErrorResponse({
        message: "Comment not found",
        status: 404,
      });
    }

    const comment: CommentFrontendPopulated =
      transformCommentPopulated(leanComment);

    return apiSuccessResponse(comment);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.comment_read.failed", {
      operation: "admin.comment.read.detail",
      error,
      errorLabel: "admin_comment_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read comment",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

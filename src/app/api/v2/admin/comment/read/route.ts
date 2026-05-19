import { CommentModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadCommentListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type { CommentLeanPopulated } from "@/lib/data/types";
import { transformCommentPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadCommentListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/comment/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    await dbConnect();

    const total = await CommentModel.countDocuments();

    const rawComments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author")
      .lean<CommentLeanPopulated[]>();

    if (rawComments.length === 0) {
      return apiErrorResponse({
        message: "No comments found",
        status: 404,
      });
    }

    const comments = rawComments.map((comment) =>
      transformCommentPopulated(comment)
    );

    return apiListResponse(comments, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.comment_read.failed", {
      operation: "admin.comment.read.list",
      error,
      errorLabel: "admin_comment_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch comment(s)",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

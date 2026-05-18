import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import {
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryFrontend,
} from "@/lib/data/types";
import { transformBlogPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadBlogResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/blog/read/[id]"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("blog", "Invalid blog ID");
  }

  try {
    await dbConnect();

    const leanDocument = await BlogModel.findById(id)
      .populate<{
        author: AdminUserTransformations["Lean"];
        comments: AdminCommentTransformations["Lean"][];
      }>("author comments")
      .lean<AdminBlogTransformationsPopulated["Lean"]>();

    if (!leanDocument) {
      return apiErrorResponse({
        message: "Blog not found",
        status: 404,
      });
    }

    const blog: BlogEntryFrontend = transformBlogPopulated(leanDocument);

    return apiSuccessResponse(blog);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.blog_read.failed", {
      operation: "admin.blog.read.detail",
      error,
      errorLabel: "admin_blog_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read blog",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

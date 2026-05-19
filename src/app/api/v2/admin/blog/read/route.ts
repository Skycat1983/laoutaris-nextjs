import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadBlogListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type { AdminBlogTransformationsPopulated, AdminCommentTransformations, AdminUserTransformations, BlogEntryFrontend } from "@/lib/data/types";
import { transformBlogPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadBlogListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/blog/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    await dbConnect();

    const total = await BlogModel.countDocuments();

    const rawBlogs = await BlogModel.find()
      .sort({ displayDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        author: AdminUserTransformations["Lean"];
        comments: AdminCommentTransformations["Lean"][];
      }>("author comments")
      .lean<AdminBlogTransformationsPopulated["Lean"][]>();

    if (rawBlogs.length === 0) {
      return apiErrorResponse({
        message: "No blogs found",
        status: 404,
      });
    }

    const blogs: BlogEntryFrontend[] = rawBlogs.map((blog) =>
      transformBlogPopulated(blog)
    );

    return apiListResponse(blogs, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.blog_read.failed", {
      operation: "admin.blog.read.list",
      error,
      errorLabel: "admin_blog_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch blogs",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

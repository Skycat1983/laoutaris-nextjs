import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryFrontend,
} from "@/lib/data/types";
import { transformBlogPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadBlogListResult>> {
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

    console.error("[BLOG_READ]", error);
    return apiErrorResponse({
      message: "Failed to fetch blogs",
      status: 500,
    });
  }
}

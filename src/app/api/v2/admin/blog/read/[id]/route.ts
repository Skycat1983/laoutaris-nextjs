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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadBlogResult>> {
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

    console.error("Error reading blog:", error);
    return apiErrorResponse({
      message: "Failed to read blog",
      status: 500,
    });
  }
}

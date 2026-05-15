import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
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
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const blog: BlogEntryFrontend = transformBlogPopulated(leanDocument);

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies ReadBlogResult);
  } catch (error) {
    console.error("Error reading blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read blog",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

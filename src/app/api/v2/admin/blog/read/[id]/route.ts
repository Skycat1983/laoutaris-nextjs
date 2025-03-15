import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import {
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryFrontend,
} from "@/lib/data/types";
import { transformAdminBlogPopulated } from "@/lib/transforms/transformAdmin";
import { transformBlogPopulated } from "@/lib/transforms";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadBlogResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  const { id } = params;

  try {
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

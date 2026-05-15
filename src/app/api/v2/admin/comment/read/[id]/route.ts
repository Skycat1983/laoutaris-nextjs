import { NextRequest, NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { CommentModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadCommentResult } from "@/lib/api/admin/read/fetchers";
import type {
  CommentFrontendPopulated,
  CommentLeanPopulated,
} from "@/lib/data/types";
import { transformCommentPopulated } from "@/lib/transforms";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadCommentResult>> {
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
      return NextResponse.json(
        {
          success: false,
          error: "Comment not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const comment: CommentFrontendPopulated =
      transformCommentPopulated(leanComment);

    return NextResponse.json({
      success: true,
      data: comment,
    } satisfies ReadCommentResult);
  } catch (error) {
    console.error("Error reading comment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read comment",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

import { CommentModel } from "@/lib/data/models";
import {
  FrontendComment,
  FrontendCommentWithAuthor,
} from "@/lib/data/types/commentTypes";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { ReadCommentListResult } from "@/lib/api/admin/read/fetchers";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

export async function GET(
  request: NextRequest
): Promise<ApiResponse<ReadCommentListResult>> {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  try {
    const total = await CommentModel.countDocuments();

    const rawComments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author");

    if (rawComments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No comments found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const comments = rawComments.map((comment) =>
      transformMongooseDoc<FrontendCommentWithAuthor>(comment)
    );

    return NextResponse.json({
      success: true,
      data: comments,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadCommentListResult);
  } catch (error) {
    console.error("[COMMENT_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comment(s)" },
      { status: 500 }
    ) satisfies NextResponse<ApiErrorResponse>;
  }
}

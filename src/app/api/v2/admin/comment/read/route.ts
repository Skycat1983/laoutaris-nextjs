import { CommentModel } from "@/lib/data/models";
import { FrontendComment } from "@/lib/data/types/commentTypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    // If no ID, return paginated list
    if (id === "read") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const page = parseInt(searchParams.get("page") || "1");
      const skip = (page - 1) * limit;
      const total = await CommentModel.countDocuments();

      const comments = await CommentModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author");

      return NextResponse.json({
        success: true,
        data: comments,
        metadata: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }) satisfies NextResponse<ApiSuccessResponse<FrontendComment[]>>;
    }

    // If ID provided, return single item
    const comment = await CommentModel.findById(id).populate("author");

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      ) satisfies NextResponse<ApiErrorResponse>;
    }

    return NextResponse.json({
      success: true,
      data: comment,
    }) satisfies NextResponse<ApiSuccessResponse<FrontendComment>>;
  } catch (error) {
    console.error("[COMMENT_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comment(s)" },
      { status: 500 }
    ) satisfies NextResponse<ApiErrorResponse>;
  }
}

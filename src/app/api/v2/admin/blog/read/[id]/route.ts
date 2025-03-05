import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { ReadBlogResult } from "@/lib/api/admin/read/fetchers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ApiResponse<ReadBlogResult>> {
  const { id } = params;

  try {
    const rawBlog = await BlogModel.findById(id)
      .populate(["author", "comments"])
      .lean()
      .exec();

    if (!rawBlog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const blog = transformMongooseDoc<FrontendBlogEntry>(rawBlog);

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

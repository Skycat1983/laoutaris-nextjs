import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import dbConnect from "@/lib/db/mongodb";

type BlogWithPopulatedCommentsResponse = ApiResponse<FrontendBlogEntry>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<BlogWithPopulatedCommentsResponse>> => {
  await dbConnect();

  try {
    const { slug } = params;
    console.log("Fetching blog with populated comments and authors:", slug);

    const rawBlog = await BlogModel.findOne({ slug })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username role", // Only select needed fields
        },
      })
      .lean();

    if (!rawBlog) {
      return NextResponse.json({
        success: false,
        error: "Blog entry not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const blog = transformMongooseDoc<FrontendBlogEntry>(rawBlog);

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies ApiSuccessResponse<FrontendBlogEntry>);
  } catch (error) {
    console.error("Error fetching blog with comments and authors:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entry with comments",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

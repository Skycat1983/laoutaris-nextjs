import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import dbConnect from "@/lib/db/mongodb";

type BlogDetailResponse = ApiResponse<FrontendBlogEntry>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<BlogDetailResponse>> => {
  await dbConnect();

  try {
    const { slug } = params;
    console.log("slug", slug);

    const rawBlog = await BlogModel.findOne({ slug }).lean();

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
    console.error("Error fetching blog detail:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entry",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

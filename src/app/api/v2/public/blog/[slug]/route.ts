import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import {
  ApiErrorResponse,
  BlogEntryLeanWithAuthor,
  RouteResponse,
} from "@/lib/data/types";
import { ApiBlogWithAuthorResult } from "@/lib/api/public/blog/fetchers";
import {
  transformBlogPopulated,
  transformBlogWithAuthor,
} from "@/lib/transforms/blog/transformBlog";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogWithAuthorResult>> => {
  await dbConnect();

  try {
    const { slug } = params;
    console.log("slug", slug);

    const rawBlog = await BlogModel.findOne({ slug })
      .populate("comments")
      .populate("author")
      .lean<BlogEntryLeanWithAuthor>();

    if (!rawBlog) {
      return NextResponse.json({
        success: false,
        error: "Blog entry not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const blog = transformBlogWithAuthor(rawBlog);

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies ApiBlogWithAuthorResult);
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entry",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

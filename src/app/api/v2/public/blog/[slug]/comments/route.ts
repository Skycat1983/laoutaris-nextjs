import { BlogModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import {
  ApiErrorResponse,
  BlogEntryPopulatedCommentsPopulatedLean,
  BlogEntryPopulatedCommentsPopulatedFrontend,
  RouteResponse,
} from "@/lib/data/types";
import { ApiBlogPopulatedResult } from "@/lib/api/public/blog/fetchers";
import { transformBlogPopulatedWithCommentsPopulated } from "@/lib/transforms/transformBlog";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogPopulatedResult>> => {
  await dbConnect();

  try {
    const { slug } = params;
    console.log("Fetching blog with populated comments and authors:", slug);

    const rawBlog = await BlogModel.findOne({ slug })
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .lean<BlogEntryPopulatedCommentsPopulatedLean>();

    if (!rawBlog) {
      return NextResponse.json({
        success: false,
        error: "Blog entry not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const blog: BlogEntryPopulatedCommentsPopulatedFrontend =
      transformBlogPopulatedWithCommentsPopulated(rawBlog);

    return NextResponse.json({
      success: true,
      data: blog,
    } satisfies ApiBlogPopulatedResult);
  } catch (error) {
    console.error("Error fetching blog with comments and authors:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entry with comments",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

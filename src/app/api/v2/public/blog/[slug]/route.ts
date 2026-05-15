import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { BlogEntryLeanWithAuthor, RouteResponse } from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogWithAuthorResult } from "@/lib/api/public/blog/fetchers";
import { transformBlogWithAuthor } from "@/lib/transforms/blog/transformBlog";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogWithAuthorResult>> => {
  try {
    await dbConnect();

    const { slug } = params;

    const rawBlog = await BlogModel.findOne({ slug })
      .populate("comments")
      .populate("author")
      .lean<BlogEntryLeanWithAuthor>();

    if (!rawBlog) {
      return apiErrorResponse({
        message: "Blog entry not found",
        status: 404,
      });
    }

    const blog = transformBlogWithAuthor(rawBlog);

    return apiSuccessResponse<ApiBlogWithAuthorResult["data"]>(blog);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching blog detail:", error);
    return apiErrorResponse({
      message: "Failed to fetch blog entry",
      status: 500,
    });
  }
};

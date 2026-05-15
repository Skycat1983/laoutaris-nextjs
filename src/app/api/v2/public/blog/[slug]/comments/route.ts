import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import {
  BlogEntryPopulatedCommentsPopulatedLean,
  BlogEntryPopulatedCommentsPopulatedFrontend,
  RouteResponse,
  Prettify,
} from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogPopulatedResult } from "@/lib/api/public/blog/fetchers";
import { transformBlogPopulatedWithCommentsPopulated } from "@/lib/transforms/blog/transformBlog";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogPopulatedResult>> => {
  try {
    await dbConnect();

    const { slug } = params;

    const rawBlog = await BlogModel.findOne({ slug })
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .lean<BlogEntryPopulatedCommentsPopulatedLean>();

    if (!rawBlog) {
      return apiErrorResponse({
        message: "Blog entry not found",
        status: 404,
      });
    }

    const blog: Prettify<BlogEntryPopulatedCommentsPopulatedFrontend> =
      transformBlogPopulatedWithCommentsPopulated(rawBlog);

    return apiSuccessResponse<ApiBlogPopulatedResult["data"]>(blog);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching blog with comments and authors:", error);
    return apiErrorResponse({
      message: "Failed to fetch blog entry with comments",
      status: 500,
    });
  }
};

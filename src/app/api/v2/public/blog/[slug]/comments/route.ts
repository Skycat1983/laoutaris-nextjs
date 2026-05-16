import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogPopulatedResult } from "@/lib/api/public/blog/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogPopulatedResult>> => {
  try {
    const blog = await getBlogBySlugWithComments(params.slug);
    if (!blog) {
      return apiErrorResponse({
        message: "Blog entry not found",
        status: 404,
      });
    }

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

import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogWithAuthorResult } from "@/lib/api/public/blog/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogWithAuthorResult>> => {
  try {
    const blog = await getBlogBySlugWithAuthor(params.slug);
    if (!blog) {
      return apiErrorResponse({
        message: "Blog entry not found",
        status: 404,
      });
    }

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

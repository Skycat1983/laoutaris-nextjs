import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogPopulatedResult } from "@/lib/api/public/blog/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getBlogBySlugWithComments } from "@/lib/data/services/getBlogBySlugWithComments";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogPopulatedResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/blog/[slug]/comments"
  );
  const logger = createApiLogger(requestContext);

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

    logger.error("api.public.blog_comments_detail.failed", {
      error,
      errorLabel: "blog_comments_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch blog entry with comments",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

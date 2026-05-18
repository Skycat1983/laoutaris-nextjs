import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiBlogWithAuthorResult } from "@/lib/api/public/blog/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiBlogWithAuthorResult>> => {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/blog/[slug]"
  );
  const logger = createApiLogger(requestContext);

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

    logger.error("api.public.blog_detail.failed", {
      error,
      errorLabel: "blog_detail_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch blog entry",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};

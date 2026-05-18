import { NextRequest, NextResponse } from "next/server";
import { ApiBlogListResult } from "@/lib/api/public/blog/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import {
  getBlogList,
  isBlogListSortBy,
} from "@/lib/data/services/getBlogList";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiBlogListResult>> => {
  const requestContext = createRequestContext(req, "/api/v2/public/blog");
  const logger = createApiLogger(requestContext);
  const { searchParams } = new URL(req.url);
  try {
    const rawSortBy = searchParams.get("sortby") || "latest";
    if (!isBlogListSortBy(rawSortBy)) {
      return NextResponse.json({
        success: false,
        error: "Invalid sortby parameter",
        statusCode: 400,
      } satisfies ApiErrorResponse);
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getBlogList({
      sortby: rawSortBy,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    } satisfies ApiBlogListResult);
  } catch (error) {
    logger.error("api.public.blog_list.failed", {
      error,
      errorLabel: "blog_list_read_failed",
    });
    return NextResponse.json({
      success: false,
      error: "Failed to fetch blog entries",
      statusCode: 500,
    } satisfies ApiErrorResponse, {
      headers: requestContext.responseHeaders,
    });
  }
};

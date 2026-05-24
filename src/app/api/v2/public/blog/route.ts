import { NextRequest, NextResponse } from "next/server";
import { ApiBlogListResult } from "@/lib/api/public/blog/fetchers";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import {
  parseBlogApiListQuery,
  searchParamsToBlogListQueryInput,
} from "@/lib/data/schemas/blogListQuerySchema";
import { getBlogList } from "@/lib/data/services/getBlogList";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiBlogListResult>> => {
  const requestContext = createRequestContext(req, "/api/v2/public/blog");
  const logger = createApiLogger(requestContext);
  const { searchParams } = new URL(req.url);
  const parsedQuery = parseBlogApiListQuery(
    searchParamsToBlogListQueryInput(searchParams)
  );

  if (!parsedQuery.success) {
    return NextResponse.json({
      success: false,
      error: "Invalid sortby parameter",
      statusCode: 400,
    } satisfies ApiErrorResponse);
  }

  try {
    const result = await getBlogList(parsedQuery.data);

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

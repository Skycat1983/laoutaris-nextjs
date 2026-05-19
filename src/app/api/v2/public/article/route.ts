import { NextRequest, NextResponse } from "next/server";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { ApiArticleListResult } from "@/lib/api/public/article/fetchers";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiArticleListResult>> => {
  const requestContext = createRequestContext(req, "/api/v2/public/article");
  const logger = createApiLogger(requestContext);
  const { searchParams } = req.nextUrl;

  try {
    const section = searchParams.get("section");
    const fields = searchParams.get("fields")?.split(",").join(" ") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getArticleList({
      section,
      fields,
      page,
      limit,
    });

    if (!result) {
      return NextResponse.json({
        success: false,
        error: "No articles found",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    } satisfies ApiArticleListResult);
  } catch (error) {
    logger.error("api.public.article_list.failed", {
      error,
      errorLabel: "article_list_read_failed",
    });
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article entries",
      statusCode: 500,
    } satisfies ApiErrorResponse, {
      headers: requestContext.responseHeaders,
    });
  }
};

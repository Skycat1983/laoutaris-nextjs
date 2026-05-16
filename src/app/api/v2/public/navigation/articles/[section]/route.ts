import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ArticleSection } from "@/lib/constants";
import { RouteResponse } from "@/lib/data/types";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { NextRequest } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const { section } = params;

  try {
    const result = await getArticleNavigationList(section);

    if (!result) {
      return apiErrorResponse({
        message: "No articles found",
        status: 404,
      });
    }

    return apiListResponse(result.data, result.metadata);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching article navigation:", error);
    return apiErrorResponse({
      message: "Failed to fetch article navigation",
      status: 500,
    });
  }
};

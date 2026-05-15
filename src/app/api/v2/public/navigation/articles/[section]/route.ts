import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ArticleSection } from "@/lib/constants";
import { ArticleModel } from "@/lib/data/models";
import {
  ArticleSelectFieldsLean,
  ArticleNavDataFrontend,
  RouteResponse,
} from "@/lib/data/types";
import { NextRequest } from "next/server";
import { transformBiographyNav } from "@/lib/transforms/navigation/transformNavData";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const { section } = params;

  try {
    await dbConnect();
    const articleLean = await ArticleModel.find({ section: section })
      .select("title slug")
      .sort({ displayDate: -1 })
      .lean<ArticleSelectFieldsLean[]>();

    if (!articleLean.length) {
      return apiErrorResponse({
        message: "No articles found",
        status: 404,
      });
    }

    const navItems: ArticleNavDataFrontend[] = articleLean.map((article) =>
      transformBiographyNav.toFrontend(article)
    );

    return apiListResponse(navItems, {
      total: navItems.length,
      page: 1,
      limit: navItems.length,
      totalPages: 1,
    });
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

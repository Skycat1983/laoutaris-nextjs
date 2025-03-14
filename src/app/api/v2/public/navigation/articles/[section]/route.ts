import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ARTICLE_SECTION_OPTIONS, ArticleSection } from "@/lib/constants";
import { ArticleModel } from "@/lib/data/models";
import {
  ArticleSelectFieldsLean,
  BiographyNavDataFrontend,
  RouteResponse,
} from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";
import { transformBiographyNav } from "@/lib/transforms/transformNavData";

export const GET = async (
  req: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  try {
    const { section } = params;

    console.log("section", section);

    // Validate section
    if (!ARTICLE_SECTION_OPTIONS.includes(section as ArticleSection)) {
      return NextResponse.json({
        success: false,
        error: "Invalid section",
        statusCode: 400,
      } satisfies ApiErrorResponse);
    }

    const articleLean = await ArticleModel.find({ section: section })
      .select("title slug")
      .sort({ displayDate: -1 })
      .lean<ArticleSelectFieldsLean[]>();

    if (!articleLean.length) {
      return NextResponse.json({
        success: false,
        error: "No articles found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const navItems: BiographyNavDataFrontend[] = articleLean.map((article) =>
      transformBiographyNav.toFrontend(article)
    );

    return NextResponse.json({
      success: true,
      data: navItems,
      metadata: {
        total: navItems.length,
        page: 1,
        limit: navItems.length,
        totalPages: 1,
      },
    } satisfies ApiArticleNavListResult);
  } catch (error) {
    console.error("Error fetching article navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

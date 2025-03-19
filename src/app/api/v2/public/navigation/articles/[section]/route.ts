import { ApiArticleNavListResult } from "@/lib/api/public/navigation/fetchers";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ArticleSection } from "@/lib/constants";
import { ArticleModel } from "@/lib/data/models";
import {
  ArticleSelectFieldsLean,
  ArticleNavDataFrontend,
  RouteResponse,
} from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";
import { transformBiographyNav } from "@/lib/transforms/navigation/transformNavData";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

// navLinks.length > navLinkBorderColours.length. navLinks.length = 6, navLinkBorderColours.length = 5
//  GET / 200 in 18561ms

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const { section } = params;
  // Validate section
  // if (!ARTICLE_SECTION_OPTIONS.includes(section as ArticleSection)) {
  //   return NextResponse.json({
  //     success: false,
  //     error: "Invalid section",
  //     statusCode: 400,
  //   } satisfies ApiErrorResponse);
  // }

  try {
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

    const navItems: ArticleNavDataFrontend[] = articleLean.map((article) =>
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
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error("Error fetching article navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

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
import dbConnect from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params }: { params: { section: ArticleSection } }
): Promise<RouteResponse<ApiArticleNavListResult>> => {
  const { section } = params;
  // console.log("Article navigation request received");
  // console.log("section", section);

  try {
    await dbConnect();
    const articleLean = await ArticleModel.find({ section: section })
      .select("title slug")
      .sort({ displayDate: -1 })
      .lean<ArticleSelectFieldsLean[]>();

    // console.log("articleLean", articleLean);

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

    // console.log("navItems", navItems);

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
    // console.error("Error fetching article navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

// Types
interface ArticleNavItem {
  title: string;
  slug: string;
}

type ArticleNavResponse = ApiResponse<ArticleNavItem[]>;

// Validate sections
const VALID_SECTIONS = ["biography", "artwork", "project"] as const;
type ValidSection = (typeof VALID_SECTIONS)[number];

export const GET = async (
  req: NextRequest,
  { params }: { params: { section: string } }
): Promise<NextResponse<ArticleNavResponse>> => {
  try {
    const { section } = params;

    // Validate section
    if (!VALID_SECTIONS.includes(section as ValidSection)) {
      return NextResponse.json({
        success: false,
        error: "Invalid section",
        statusCode: 400,
      } satisfies ApiErrorResponse);
    }

    // Fetch only what we need
    const articles = await ArticleModel.find({ section })
      .select("title slug")
      .sort({ displayDate: -1 })
      .lean();

    if (!articles.length) {
      return NextResponse.json({
        success: false,
        error: "No articles found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    // Transform to nav items
    const navItems: ArticleNavItem[] = articles.map((article) => ({
      title: article.title,
      slug: article.slug,
    }));

    return NextResponse.json({
      success: true,
      data: navItems,
    } satisfies ApiSuccessResponse<ArticleNavItem[]>);
  } catch (error) {
    console.error("Error fetching article navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch article navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";

type BlogApiResponse = BlogListResponse;
type SortByType = "latest" | "oldest" | "popular" | "featured";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<BlogApiResponse>> => {
  try {
    const { searchParams } = new URL(req.url);

    // Build query object
    const query: any = {};
    const sortby = (searchParams.get("sortby") as SortByType) || "latest";
    const fields = searchParams.get("fields")?.split(",").join(" ") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Apply sorting
    switch (sortby) {
      case "latest":
        query.sort = { displayDate: -1 };
        break;
      case "oldest":
        query.sort = { displayDate: 1 };
        break;
      case "popular":
        query.sort = { comments: -1 };
        break;
      case "featured":
        query.featured = true;
        query.sort = { displayDate: -1 };
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid sortby parameter",
            statusCode: 400,
          },
          { status: 400 }
        );
    }

    const [blogs, total] = await Promise.all([
      BlogModel.find(query)
        .select(fields)
        .sort(query.sort)
        .skip((page - 1) * limit)
        .limit(limit),
      BlogModel.countDocuments(query),
    ]);

    const metadata: PaginationMetadata = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata,
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog entries",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
};

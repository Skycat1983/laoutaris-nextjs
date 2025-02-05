import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import type { FrontendBlogEntry } from "@/lib/types/blogTypes";

type BlogApiResponse = ApiResponse<FrontendBlogEntry[]>;
type SortByType = "latest" | "oldest" | "popular" | "featured";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<BlogApiResponse>> => {
  try {
    const { searchParams } = new URL(req.url);

    const sortby = (searchParams.get("sortby") as SortByType) || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    let query = BlogModel.find();

    //  sorting
    switch (sortby) {
      case "latest":
        query = query.sort({ displayDate: -1 });
        break;
      case "oldest":
        query = query.sort({ displayDate: 1 });
        break;
      case "popular":
        // $size was nmot working
        query = query.sort({ comments: -1 });
        break;
      case "featured":
        query = query.where({ featured: true }).sort({ displayDate: -1 });
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
      query.skip((page - 1) * limit).limit(limit),
      BlogModel.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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

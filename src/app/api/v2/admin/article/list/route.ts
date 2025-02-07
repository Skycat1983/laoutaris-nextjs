import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await ArticleModel.countDocuments();

    // Get paginated articles
    const articles = await ArticleModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(["artwork", "author"]);

    return NextResponse.json({
      success: true,
      data: articles,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ARTICLE_LIST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
      },
      { status: 500 }
    );
  }
}

// const session = await getServerSession(authOptions);
// if (!session?.user?.id) {
//   return NextResponse.json(
//     { success: false, message: "Unauthorized" },
//     { status: 401 }
//   );
// }

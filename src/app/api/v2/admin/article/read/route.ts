import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    // If no ID, return paginated list
    if (id === "read") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const page = parseInt(searchParams.get("page") || "1");
      const skip = (page - 1) * limit;
      const total = await ArticleModel.countDocuments();

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
    }

    // If ID provided, return single item
    const article = await ArticleModel.findById(id).populate([
      "artwork",
      "author",
    ]);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("[ARTICLE_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article(s)" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const _id = searchParams.get("_id");

//     if (!_id) {
//       return NextResponse.json(
//         { success: false, message: "Article ID is required" },
//         { status: 400 }
//       );
//     }

//     const article = await ArticleModel.findById(_id)
//       .populate("artwork")
//       .populate("author")
//       .lean()
//       .exec();

//     if (!article) {
//       return NextResponse.json(
//         { success: false, message: "Article not found" },
//         { status: 404 }
//       );
//     }

//     const transformedArticle = transformMongooseDoc(article);
//     console.log("API Response Structure:", {
//       success: true,
//       data: transformedArticle,
//     });

//     return NextResponse.json({
//       success: true,
//       data: transformedArticle,
//     });
//   } catch (error) {
//     console.error("Error reading article:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to read article" },
//       { status: 500 }
//     );
//   }
// }

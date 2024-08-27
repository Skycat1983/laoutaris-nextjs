import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { ArticleModel } from "@/lib/server/models";
import { transformToFrontendArticle } from "@/utils/transformData";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  console.log("slug in GET biography slug", slug);

  if (!slug) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 400,
        message: "Slug parameter is missing",
      },
      { status: 400 }
    );
  }

  try {
    const rawContent = await ArticleModel.findOne({ slug })
      .populate("author artwork")
      .lean();

    if (!rawContent) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    const transformedContent = transformToFrontendArticle(rawContent);

    return NextResponse.json<ApiSuccessResponse<IFrontendArticle>>({
      success: true,
      data: transformedContent,
    });
  } catch (error) {
    console.error("Error fetching article", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

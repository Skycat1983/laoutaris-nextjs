import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { CollectionModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

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
    const rawContent = (await CollectionModel.findOne({ slug })
      .populate("artworks")
      .lean()) as IFrontendCollection;

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

    return NextResponse.json<ApiSuccessResponse<IFrontendCollection>>({
      success: true,
      data: rawContent,
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

import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

function transformToCollectionLink(doc: any): SubnavLink {
  return {
    title: doc.title,
    slug: doc.slug,
  };
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  try {
    const rawBiographyLinks = await ArticleModel.find({ section })
      .select("title slug")
      .lean();

    if (!rawBiographyLinks || rawBiographyLinks.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Articles not found",
        },
        { status: 404 }
      );
    }

    // Transform the raw data to match CollectionLink[]
    const collectionLinks: SubnavLink[] = rawBiographyLinks.map(
      transformToCollectionLink
    );

    return NextResponse.json<ApiSuccessResponse<SubnavLink[]>>({
      success: true,
      data: collectionLinks,
    });
  } catch (error) {
    console.error("Error fetching collection links:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        errorCode: 500,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

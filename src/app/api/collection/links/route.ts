import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

function transformToCollectionLink(doc: any): SubnavLink {
  return {
    title: doc.title,
    slug: `${doc.slug}`,
    // defaultRedirect: doc.artworks[0],
    // text: doc.text,
  };
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  try {
    const rawCollectionLinks = await CollectionModel.find({ section })
      .select("title slug artworks text")
      .lean();

    if (!rawCollectionLinks || rawCollectionLinks.length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          errorCode: 404,
          message: "Collection not found",
        },
        { status: 404 }
      );
    }

    // Transform the raw data to match CollectionLink[]
    const collectionLinks: SubnavLink[] = rawCollectionLinks.map(
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

import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<SingleCollectionResponse>> => {
  try {
    const collection = await CollectionModel.findOne({
      slug: params.slug,
    });

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
};

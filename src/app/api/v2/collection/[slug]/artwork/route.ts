import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import type { FrontendCollection } from "@/lib/data/types/collectionTypes";

type SingleCollectionApiResponse = ApiResponse<FrontendCollection>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<SingleCollectionApiResponse>> => {
  try {
    const collection = await CollectionModel.findOne({
      slug: params.slug,
    }).populate("artworks");

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
        error: "Failed to fetch collection with artworks",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
};

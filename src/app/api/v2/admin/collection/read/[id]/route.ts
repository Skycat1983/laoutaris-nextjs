import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { ReadCollectionResult } from "@/lib/api/admin/read/fetchers";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { FrontendCollectionWithArtworks } from "@/lib/data/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<ApiResponse<ReadCollectionResult>> {
  try {
    const { id } = params;

    const rawCollection = await CollectionModel.findById(id)
      .populate("artworks")
      .lean()
      .exec();

    if (!rawCollection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const collection =
      transformMongooseDoc<FrontendCollectionWithArtworks>(rawCollection);

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies ReadCollectionResult);
  } catch (error) {
    console.error("Error reading collection:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read collection",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

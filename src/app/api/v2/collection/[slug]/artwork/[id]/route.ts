import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/server/models";
import { Types } from "mongoose";
import { FrontendCollectionWithArtworks } from "@/lib/types/collectionTypes";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
): Promise<NextResponse<ApiResponse<FrontendCollectionWithArtworks>>> {
  try {
    const { slug, id } = params;

    // find collection and populate only the matching artwork
    const collection = await CollectionModel.findOne({ slug }).populate({
      path: "artworks",
      match: { _id: new Types.ObjectId(id) },
      //! previously returned just the artwork
      //   select:
      //     "image title decade artstyle medium surface featured favourited watcherlist",
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found", statusCode: 404 },
        { status: 404 }
      );
    }

    // check if artwork exists in this collection
    if (!collection.artworks?.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Artwork not found in this collection",
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
    console.error("Error fetching collection artwork:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection artwork",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

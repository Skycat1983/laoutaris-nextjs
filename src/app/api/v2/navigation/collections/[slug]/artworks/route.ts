import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

import { CollectionArtworkNav } from "@/lib/types/navigationTypes";

// Define the shape we want using Pick

type CollectionArtworksNavResponse = ApiResponse<CollectionArtworkNav>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<CollectionArtworksNavResponse>> => {
  try {
    const { slug } = params;

    const rawCollection = await CollectionModel.findOne({
      section: "collections",
      slug,
    })
      .select("artworks")
      .populate({
        path: "artworks",
        select: "title image.secure_url image.pixelHeight image.pixelWidth",
      })
      .lean();

    if (!rawCollection) {
      return NextResponse.json({
        success: false,
        error: "Collection not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const collection =
      transformMongooseDoc<CollectionArtworkNav>(rawCollection);

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies ApiSuccessResponse<CollectionArtworkNav>);
  } catch (error) {
    console.error("Error fetching collection artworks navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection artworks navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

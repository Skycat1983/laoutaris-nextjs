import { CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

import {
  CollectionArtworkNavList,
  CollectionArtworksNavResponse,
} from "@/lib/data/types/navigationTypes";

// Define the shape we want using Pick
// ! did i break this?

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
      transformMongooseDoc<CollectionArtworkNavList>(rawCollection);

    // console.log("rawCollection", rawCollection);
    // console.log("collection in route", collection);

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies ApiSuccessResponse<CollectionArtworkNavList>);
  } catch (error) {
    console.error("Error fetching collection artworks navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection artworks navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

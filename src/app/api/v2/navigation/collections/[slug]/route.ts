import { CollectionModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import type {
  CollectionNavItem,
  CollectionNavItemResponse,
} from "@/lib/types/navigationTypes";
import type { Types } from "mongoose";

interface CollectionNavData {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  artworks: { _id: Types.ObjectId }[];
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<CollectionNavItemResponse>> => {
  try {
    const { slug } = params;

    const collection = await CollectionModel.findOne({
      section: "artwork",
      slug,
    })
      .select<CollectionNavData>("title slug artworks")
      .lean<CollectionNavData>(); // Add type to lean()

    if (!collection) {
      return NextResponse.json({
        success: false,
        error: "Collection not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const navItem = {
      title: collection.title,
      slug: collection.slug,
      artworkId: collection.artworks[0]._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: navItem,
    } satisfies ApiSuccessResponse<CollectionNavItem>);
  } catch (error) {
    console.error("Error fetching collection navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

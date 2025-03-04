import { CollectionModel } from "@/lib/data/models";
import {
  CollectionNavItem,
  CollectionNavListResponse,
} from "@/lib/data/types/navigationTypes";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<CollectionNavListResponse>> => {
  try {
    const collections = await CollectionModel.find({ section: "collections" })
      .select("title slug artworks")
      .sort({ updatedAt: 1 })
      .lean()
      .exec();

    if (!collections.length) {
      return NextResponse.json({
        success: false,
        error: "No collections found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    // filter out collections without artworks
    const collectionsWithArtworks = collections.filter(
      (collection) => collection.artworks.length > 0
    );

    // Transform to nav items
    const navItems: CollectionNavItem[] = collectionsWithArtworks.map(
      (collection) => ({
        title: collection.title,
        slug: collection.slug,
        artworkId: collection.artworks[0]._id.toString(),
      })
    );

    return NextResponse.json({
      success: true,
      data: navItems,
    } satisfies ApiSuccessResponse<CollectionNavItem[]>);
  } catch (error) {
    console.error("Error fetching collection navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};

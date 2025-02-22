import { NextRequest, NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await ArtworkModel.countDocuments();

    // Get paginated artworks
    const artworks = await ArtworkModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: artworks,
      pagination: {
        total,
        page,
        pageSize: limit,
        pageCount: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ARTWORK_LIST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}

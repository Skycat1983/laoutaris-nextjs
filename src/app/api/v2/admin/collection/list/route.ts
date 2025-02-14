import { CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await CollectionModel.countDocuments();

    // Get paginated collections
    const collections = await CollectionModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    //   .populate(["artworks", "curator"]);

    return NextResponse.json({
      success: true,
      data: collections,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[COLLECTION_LIST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collections",
      },
      { status: 500 }
    );
  }
}

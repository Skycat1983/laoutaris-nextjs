import { NextRequest, NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/server/models";

export async function GET(request: NextRequest) {
  try {
    const artworks = await ArtworkModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Failed to fetch artwork feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork feed" },
      { status: 500 }
    );
  }
}

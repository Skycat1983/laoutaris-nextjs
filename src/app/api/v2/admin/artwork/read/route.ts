import { ArtworkModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Add query parameters for filtering, pagination, etc.
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    const artworks = await ArtworkModel.find({
      // Add search conditions if needed
      ...(search ? { title: new RegExp(search, "i") } : {}),
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: artworks,
    });
  } catch (error) {
    console.error("Error reading artworks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read artworks" },
      { status: 500 }
    );
  }
}

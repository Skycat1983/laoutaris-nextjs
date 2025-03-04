import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const filterKey = searchParams.get("filterKey") as
      | "decade"
      | "artstyle"
      | "medium"
      | "surface"
      | null;
    const filterValue = searchParams.get("filterValue");

    // Build query object
    const query: Record<string, any> = {};

    if (filterKey && filterValue) {
      query[filterKey] = filterValue;
    }

    console.log("Query:", query); // Debug log

    const artworks = await ArtworkModel.find(query)
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

import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const filterKey = searchParams.get("filterKey");
    const filterValue = searchParams.get("filterValue");

    // Build query object
    const query: any = {};

    if (search) {
      query.title = new RegExp(search, "i");
    }

    if (filterKey && filterValue) {
      query[filterKey] = filterValue;
    }

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

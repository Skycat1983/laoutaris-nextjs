import { ArtworkModel } from "@/lib/data/models";
import { FrontendArtwork } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";

type ArtworkApiResponse = ApiResponse<FrontendArtwork[]>;

export async function GET(
  request: NextRequest
): Promise<NextResponse<ArtworkApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const filterMode = searchParams.get("filterMode") || "ALL";

    // Collect all filter conditions
    const conditions = [];
    if (searchParams.get("decade"))
      conditions.push({ decade: searchParams.get("decade") });
    if (searchParams.get("artstyle"))
      conditions.push({ artstyle: searchParams.get("artstyle") });
    if (searchParams.get("medium"))
      conditions.push({ medium: searchParams.get("medium") });
    if (searchParams.get("surface"))
      conditions.push({ surface: searchParams.get("surface") });

    // Build the query based on filter mode
    const query =
      conditions.length > 0
        ? filterMode === "ALL"
          ? { $and: conditions } // All conditions must match
          : { $or: conditions } // Any condition can match
        : {};

    // Handle field selection
    const fields = searchParams.get("fields")?.split(",").join(" ") || "";

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log("Query:", query); // Debug log

    const [artworks, total] = await Promise.all([
      ArtworkModel.find(query)
        .select(fields)
        .skip((page - 1) * limit)
        .limit(limit),
      ArtworkModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: artworks,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies PaginatedResponse<FrontendArtwork[]>);
  } catch (error) {
    console.error("Error in artwork route:", error); // Debug log
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

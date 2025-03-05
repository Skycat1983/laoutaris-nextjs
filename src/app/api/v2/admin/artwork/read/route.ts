import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { ReadListResponse } from "@/lib/api/admin/read/fetchers";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "100");
  const page = parseInt(searchParams.get("page") || "1");
  const filterKey = searchParams.get("filterKey") as
    | "decade"
    | "artstyle"
    | "medium"
    | "surface"
    | null;
  const filterValue = searchParams.get("filterValue");

  const query: Record<string, any> = {};

  if (filterKey && filterValue) {
    query[filterKey] = filterValue;
  }

  try {
    const [rawArtworks, total] = await Promise.all([
      ArtworkModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .lean(),
      ArtworkModel.countDocuments(query),
    ]);

    const artworks = rawArtworks.map((artwork) =>
      transformMongooseDoc<FrontendArtwork>(artwork)
    );

    return NextResponse.json({
      success: true,
      data: artworks,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ReadListResponse<FrontendArtwork>);
  } catch (error) {
    console.error("Error reading artworks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read artworks",
      } satisfies ApiErrorResponse,
      {
        status: 500,
      }
    );
  }
}

// const { searchParams } = new URL(request.nextUrl);
// const limit = parseInt(searchParams.get("limit") || "100");
// const page = parseInt(searchParams.get("page") || "1");
// const filterKey = searchParams.get("filterKey") as
//   | "decade"
//   | "artstyle"
//   | "medium"
//   | "surface"
//   | null;
// const filterValue = searchParams.get("filterValue");

// // Build query object
// const query: Record<string, any> = {};

// if (filterKey && filterValue) {
//   query[filterKey] = filterValue;
// }

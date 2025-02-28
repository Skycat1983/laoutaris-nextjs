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

    const conditions = [];

    // handle as arrays
    for (const key of ["decade", "artstyle", "medium", "surface"]) {
      const values = searchParams.getAll(key);
      if (values.length) {
        conditions.push({ [key]: { $in: values } });
      }
    }

    const query =
      conditions.length > 0
        ? filterMode === "ALL"
          ? { $and: conditions }
          : { $or: conditions }
        : {};

    const fields = searchParams.get("fields")?.split(",").join(" ") || "";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

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
    console.error("Error in artwork route:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

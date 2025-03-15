import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ReadArtworkListResult } from "@/lib/api/admin/read/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { isAdmin } from "@/lib/session/isAdmin";
import { AdminArtworkTransformations } from "@/lib/data/types";
import { transformAdminArtwork } from "@/lib/transforms/transformAdmin";
import { transformArtwork } from "@/lib/transforms";
import { ArtworkFrontend } from "@/lib/data/types";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArtworkListResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
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
        .lean<AdminArtworkTransformations["Lean"][]>(),
      ArtworkModel.countDocuments(query),
    ]);

    if (rawArtworks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No artworks found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const artworks: ArtworkFrontend[] = rawArtworks.map((artwork) =>
      transformArtwork.toFrontend(artwork)
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
    } satisfies ReadArtworkListResult);
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

import { ArtworkModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { ReadArtworkListResult } from "@/lib/api/admin/read/fetchers";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import { AdminArtworkTransformations } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms";
import { ArtworkFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArtworkListResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
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
    await dbConnect();

    const [rawArtworks, total] = await Promise.all([
      ArtworkModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .lean<AdminArtworkTransformations["Lean"][]>(),
      ArtworkModel.countDocuments(query),
    ]);

    if (rawArtworks.length === 0) {
      return apiErrorResponse({
        message: "No artworks found",
        status: 404,
      });
    }

    const artworks: ArtworkFrontend[] = rawArtworks.map((artwork) =>
      transformArtwork.toFrontend(artwork)
    );

    return apiListResponse(artworks, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error reading artworks:", error);
    return apiErrorResponse({
      message: "Failed to read artworks",
      status: 500,
    });
  }
}

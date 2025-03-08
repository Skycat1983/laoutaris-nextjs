import { ArtworkModel } from "@/lib/data/models";
import { ArtworkTransformations, ColorInfo } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";
import { findSimilarColors } from "@/lib/utils/colorUtils";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { transformArtwork } from "@/lib/transforms/transformArtwork";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  try {
    const { searchParams } = new URL(request.url);
    const filterMode = searchParams.get("filterMode") || "ALL";
    const sortBy = searchParams.get("sortBy") || "mostRecent";
    const targetColor = searchParams.get("sortColor");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log("route params:", { filterMode, sortBy, targetColor });

    const conditions = [];

    // handle regular filters
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

    // Get base query with filters - but don't paginate yet
    let artworksQuery = ArtworkModel.find(query);

    // Apply appropriate sorting based on sortBy parameter
    switch (sortBy) {
      case "mostRecent":
        artworksQuery = artworksQuery.sort({ createdAt: -1 });
        break;
      case "mostPopular":
        artworksQuery = artworksQuery.sort({ "favourited.length": -1 });
        break;
      case "mostFeatured":
        artworksQuery = artworksQuery.sort({ featured: -1, createdAt: -1 });
        break;
      // colorProximity case is handled separately below
    }

    // Get total count for pagination
    const total = await ArtworkModel.countDocuments(query);

    // Get all matching artworks (for color sorting) or paginated results (for other sorts)
    const allArtworks = await artworksQuery;

    let finalArtworks;

    // Handle color proximity sorting
    if (sortBy === "colorProximity" && targetColor) {
      const artworksWithSimilarity = allArtworks.map((artwork) => {
        const artworkColors = artwork.image.hexColors.map(
          (hc: ColorInfo) => hc.color
        );

        const similarColors = findSimilarColors(
          targetColor,
          artworkColors,
          100
        );
        const bestMatch = similarColors[0] || { similarity: 100 };

        return {
          artwork: {
            ...artwork.toObject(),
            image: {
              ...artwork.image,
              hexColors: [
                artwork.image.hexColors.find(
                  (hc: ColorInfo) => hc.color === bestMatch.color
                ),
              ],
              similarityScore: bestMatch.similarity,
            },
          },
          similarity: bestMatch.similarity,
        };
      });

      // Sort all artworks by color similarity
      const sortedArtworks = artworksWithSimilarity
        .sort((a, b) => a.similarity - b.similarity)
        .map((item) => item.artwork);

      // Then paginate the results
      finalArtworks = sortedArtworks.slice((page - 1) * limit, page * limit);
    } else {
      // For non-color sorting, paginate the already sorted results
      finalArtworks = allArtworks.slice((page - 1) * limit, page * limit);
    }

    const transformedArtworks: ArtworkTransformations["Frontend"][] =
      finalArtworks.map((artwork) => transformArtwork(artwork, null));

    return NextResponse.json({
      success: true,
      data: transformedArtworks,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiArtworkListResult);
  } catch (error) {
    console.error("Error in artwork route:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

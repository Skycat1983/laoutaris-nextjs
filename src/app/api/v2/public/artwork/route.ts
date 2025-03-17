import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { findSimilarColors } from "@/lib/utils/colorUtils";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { ColourInfo, ArtworkFrontend, ArtworkLean } from "@/lib/data/types";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformArtwork } from "@/lib/transforms";

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const userId = await getUserIdFromSession();
  const { searchParams } = request.nextUrl;
  const filterMode = searchParams.get("filterMode") || "ALL";
  const sortBy = searchParams.get("sortBy") || "mostRecent";
  const targetColor = searchParams.get("sortColor");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    console.log("route params:", {
      filterMode,
      sortBy,
      targetColor,
      page,
      limit,
    });

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
        artworksQuery = artworksQuery.sort({ "collections.length": -1 });
        break;
      // colorProximity case is handled separately below
    }

    // Get total count for pagination
    const total = await ArtworkModel.countDocuments(query);

    // console.log("total", total);

    // Get all matching artworks (for color sorting) or paginated results (for other sorts)
    const allArtworks = await artworksQuery.lean<ArtworkLean[]>();
    // console.log("allArtworks count:", allArtworks.length);

    let finalArtworks: ArtworkLean[];

    // Handle color proximity sorting
    if (sortBy === "colorProximity" && targetColor) {
      const artworksWithSimilarity = allArtworks.map((artwork) => {
        const artworkColors = artwork.image.hexColors.map(
          (hc: ColourInfo) => hc.color
        );

        const similarColors = findSimilarColors(
          targetColor,
          artworkColors,
          100
        );
        const bestMatch = similarColors[0] || { similarity: 100 };

        // Find the matching color info
        const matchingColorInfo = artwork.image.hexColors.find(
          (hc: ColourInfo) => hc.color === bestMatch.color
        );

        // Ensure we always have a valid ColourInfo
        const hexColors: ColourInfo[] = matchingColorInfo
          ? [matchingColorInfo]
          : artwork.image.hexColors;

        return {
          artwork: {
            ...artwork,
            image: {
              ...artwork.image,
              hexColors, // Now guaranteed to be ColourInfo[]
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

    // console.log("Starting artwork transformation");
    // console.log(
    //   "Sample artwork structure:",
    //   JSON.stringify(finalArtworks[0], null, 2)
    // );

    try {
      const transformedArtworks: ArtworkFrontend[] = finalArtworks.map(
        (artwork, index) => {
          // console.log(
          //   `Transforming artwork ${index + 1} of ${finalArtworks.length}`
          // );
          const transformed = transformArtwork.toFrontend(artwork, userId);
          // console.log(`Successfully transformed artwork ${index + 1}`);
          return transformed;
        }
      );

      // console.log("All artworks transformed successfully");
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
    } catch (transformError) {
      console.error("Error in artwork route:", transformError);
      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in artwork route:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

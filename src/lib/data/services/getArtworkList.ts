import "server-only";

import type { FilterQuery } from "mongoose";
import { ArtworkModel, type ArtworkDB } from "@/lib/data/models/artworkModel";
import type {
  ArtworkFrontend,
  ArtworkLean,
  ArtworkQueryParams,
  ColourInfo,
  ListResult,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { findSimilarColors } from "@/lib/utils/colourUtils";

const ARTWORK_FILTER_KEYS = [
  "decade",
  "artstyle",
  "medium",
  "surface",
] as const;

export type GetArtworkListParams = Partial<ArtworkQueryParams> & {
  userId?: string | null;
};

export type ArtworkListServiceResult = ListResult<ArtworkFrontend>;

const buildArtworkListQuery = (
  params: GetArtworkListParams
): FilterQuery<ArtworkDB> => {
  const conditions = ARTWORK_FILTER_KEYS.flatMap((key) => {
    const values = params[key];
    return values?.length ? [{ [key]: { $in: values } }] : [];
  });

  if (conditions.length === 0) {
    return {};
  }

  return params.filterMode === "ANY"
    ? { $or: conditions }
    : { $and: conditions };
};

const sortByColorProximity = (
  artworks: ArtworkLean[],
  targetColor: string
): ArtworkLean[] => {
  return artworks
    .map((artwork) => {
      const artworkColors = artwork.image.hexColors.map(
        (hexColor: ColourInfo) => hexColor.color
      );
      const bestMatch = findSimilarColors(targetColor, artworkColors, 100)[0];
      const matchingColorInfo = artwork.image.hexColors.find(
        (hexColor: ColourInfo) => hexColor.color === bestMatch?.color
      );

      return {
        artwork: {
          ...artwork,
          image: {
            ...artwork.image,
            hexColors: matchingColorInfo
              ? [matchingColorInfo]
              : artwork.image.hexColors,
            similarityScore: bestMatch?.similarity ?? 100,
          },
        },
        similarity: bestMatch?.similarity ?? 100,
      };
    })
    .sort((a, b) => a.similarity - b.similarity)
    .map((item) => item.artwork);
};

export const getArtworkList = async ({
  filterMode = "ALL",
  sortBy = "mostRecent",
  sortColor,
  page = 1,
  limit = 10,
  userId,
  ...filters
}: GetArtworkListParams = {}): Promise<ArtworkListServiceResult> => {
  await dbConnect();

  const query = buildArtworkListQuery({ ...filters, filterMode });
  let artworksQuery = ArtworkModel.find(query);

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
  }

  const total = await ArtworkModel.countDocuments(query);
  const allArtworks = await artworksQuery.lean<ArtworkLean[]>();
  const sortedArtworks =
    sortBy === "colorProximity" && sortColor
      ? sortByColorProximity(allArtworks, sortColor)
      : allArtworks;
  const paginatedArtworks = sortedArtworks.slice(
    (page - 1) * limit,
    page * limit
  );
  const transformedArtworks = paginatedArtworks.map((artwork) =>
    transformArtwork.toFrontend(artwork, userId)
  );

  return {
    success: true,
    data: transformedArtworks,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

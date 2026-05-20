import { ArtworkModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { ReadArtworkListResult } from "@/lib/api/admin/read/fetchers";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type { AdminArtworkTransformations } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms";
import type { ArtworkFrontend } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import { parseAdminReadListQuery } from "@/lib/api/admin/read/routeValidation";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";

type ArtworkReadQuery = Record<string, unknown>;
type ArtworkReadFilterKey = "decade" | "artstyle" | "medium" | "surface";

const ARTWORK_READ_SEARCH_MAX_LENGTH = 80;

const isArtworkReadFilterKey = (
  filterKey: string | null
): filterKey is ArtworkReadFilterKey =>
  filterKey === "decade" ||
  filterKey === "artstyle" ||
  filterKey === "medium" ||
  filterKey === "surface";

const filterOptionsByKey: Record<ArtworkReadFilterKey, readonly string[]> = {
  decade: DECADE_OPTIONS,
  artstyle: ARTSTYLE_OPTIONS,
  medium: MEDIUM_OPTIONS,
  surface: SURFACE_OPTIONS,
};

const escapeRegexValue = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildArtworkReadFilterQuery = (
  searchParams: URLSearchParams
): ArtworkReadQuery => {
  const filterKey = searchParams.get("filterKey");
  const filterValue = searchParams.get("filterValue");

  if (!isArtworkReadFilterKey(filterKey) || !filterValue) {
    return {};
  }

  if (!filterOptionsByKey[filterKey].includes(filterValue)) {
    return {};
  }

  return {
    [filterKey]: filterValue,
  };
};

const buildArtworkReadSearchQuery = (search?: string): ArtworkReadQuery => {
  if (!search) {
    return {};
  }

  return {
    title: {
      $regex: escapeRegexValue(search),
      $options: "i",
    },
  };
};

const buildArtworkReadQuery = (
  searchParams: URLSearchParams,
  search?: string
): ArtworkReadQuery => ({
  ...buildArtworkReadFilterQuery(searchParams),
  ...buildArtworkReadSearchQuery(search),
});

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArtworkListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/artwork/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { searchParams } = request.nextUrl;
  const parsedQuery = parseAdminReadListQuery(searchParams, "artwork", {
    defaultLimit: 100,
    search: {
      maxLength: ARTWORK_READ_SEARCH_MAX_LENGTH,
    },
  });

  if (!parsedQuery.ok) {
    return parsedQuery.response;
  }

  const { page, limit, search } = parsedQuery;
  const query = buildArtworkReadQuery(searchParams, search);

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

    logger.error("api.admin.artwork_read.failed", {
      operation: "admin.artwork.read.list",
      error,
      errorLabel: "admin_artwork_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read artworks",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { ReadCollectionListResult } from "@/lib/api/admin/read/fetchers";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type {
  AdminArtworkTransformations,
  AdminCollectionTransformationsPopulated,
} from "@/lib/data/types";
import { transformCollectionPopulated } from "@/lib/transforms";
import type { CollectionFrontendPopulated } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import { parseAdminReadListQuery } from "@/lib/api/admin/read/routeValidation";
// TODO: remove the 'return one item' logic

type CollectionReadQuery = Record<string, unknown>;

const COLLECTION_READ_SEARCH_MAX_LENGTH = 80;

const escapeRegexValue = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildCollectionReadSearchQuery = (
  search?: string
): CollectionReadQuery => {
  if (!search) {
    return {};
  }

  const regex = {
    $regex: escapeRegexValue(search),
    $options: "i",
  };

  return {
    $or: [{ title: regex }, { slug: regex }],
  };
};

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadCollectionListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedQuery = parseAdminReadListQuery(
    request.nextUrl.searchParams,
    "collection",
    {
      defaultLimit: 10,
      search: {
        maxLength: COLLECTION_READ_SEARCH_MAX_LENGTH,
      },
    }
  );

  if (!parsedQuery.ok) {
    return parsedQuery.response;
  }

  const { page, limit, search } = parsedQuery;
  const query = buildCollectionReadSearchQuery(search);
  const hasSearch = Object.keys(query).length > 0;
  const modelQuery = hasSearch ? query : undefined;
  const skip = (page - 1) * limit;

  try {
    await dbConnect();

    const total = modelQuery
      ? await CollectionModel.countDocuments(modelQuery)
      : await CollectionModel.countDocuments();

    const rawCollectionsQuery = modelQuery
      ? CollectionModel.find(modelQuery)
      : CollectionModel.find();

    const rawCollections = await rawCollectionsQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        artworks: AdminArtworkTransformations["Lean"][];
      }>("artworks")
      .lean<Array<AdminCollectionTransformationsPopulated["Lean"]>>();

    if (rawCollections.length === 0) {
      return apiErrorResponse({
        message: "No collections found",
        status: 404,
      });
    }

    const collections: CollectionFrontendPopulated[] = rawCollections.map(
      (collection) => transformCollectionPopulated(collection)
    );

    return apiListResponse(collections, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.collection_read.failed", {
      operation: "admin.collection.read.list",
      error,
      errorLabel: "admin_collection_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collections",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

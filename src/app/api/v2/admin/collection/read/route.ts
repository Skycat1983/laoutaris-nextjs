import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { ReadCollectionListResult } from "@/lib/api/admin/read/fetchers";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  AdminArtworkTransformations,
  AdminCollectionTransformationsPopulated,
} from "@/lib/data/types";
import { transformCollectionPopulated } from "@/lib/transforms";
import { CollectionFrontendPopulated } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
// TODO: remove the 'return one item' logic

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

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;

  try {
    await dbConnect();

    const total = await CollectionModel.countDocuments();

    const rawCollections = await CollectionModel.find()
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
      message: "Failed to fetch article(s)",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

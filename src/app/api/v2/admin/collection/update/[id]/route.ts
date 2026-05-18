import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateCollectionResult } from "@/lib/api/admin/update/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  updateCollectionRouteBodySchema,
  updateCollectionRouteParamsSchema,
  type UpdateCollectionRouteBody,
  type UpdateCollectionRouteParams,
} from "@/lib/data/schemas/collectionSchema";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type CollectionUpdateFieldErrors = Partial<
  Record<
    keyof (UpdateCollectionRouteBody & UpdateCollectionRouteParams),
    string[] | undefined
  >
>;

type CollectionValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: CollectionUpdateFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: CollectionUpdateFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<CollectionValidationErrorResponse>(
    {
      success: false,
      error: "Invalid collection input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const applyCollectionFields = (
  collection: {
    title?: string;
    subtitle?: string;
    summary?: string;
    text?: string;
    imageUrl?: string;
    section?: string;
    artworks: unknown[];
  },
  data: UpdateCollectionRouteBody
) => {
  const { artworksToAdd, artworksToRemove } = data;

  if (data.title !== undefined) collection.title = data.title;
  if (data.subtitle !== undefined) collection.subtitle = data.subtitle;
  if (data.summary !== undefined) collection.summary = data.summary;
  if (data.text !== undefined) collection.text = data.text;
  if (data.imageUrl !== undefined) collection.imageUrl = data.imageUrl;
  if (data.section !== undefined) collection.section = data.section;

  if (artworksToAdd?.length) {
    collection.artworks.push(...artworksToAdd);
  }

  if (artworksToRemove?.length) {
    const artworkIdsToRemove = new Set(artworksToRemove);
    collection.artworks = collection.artworks.filter(
      (artworkId) => !artworkIdsToRemove.has(String(artworkId))
    );
  }
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateCollectionResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedParams = updateCollectionRouteParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    const { fieldErrors, formErrors } = parsedParams.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationErrorResponse({}, ["Request body must be valid JSON."]);
  }

  const parsedBody = updateCollectionRouteBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/update/[id]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const collection = await CollectionModel.findById(parsedParams.data.id);
    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    applyCollectionFields(collection, parsedBody.data);
    await collection.save();

    return apiSuccessResponse(collection);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.collection_update.failed", {
      operation: "admin.collection.update",
      error,
      errorLabel: "admin_collection_update_failed",
    });
    return apiErrorResponse({
      message: "Failed to update collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

import { ArtworkModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateArtworkResult } from "@/lib/api/admin/update/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  updateArtworkRouteBodySchema,
  updateArtworkRouteParamsSchema,
  type UpdateArtworkRouteBody,
  type UpdateArtworkRouteParams,
} from "@/lib/data/schemas/artworkSchema";
import type { AdminArtwork } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type ArtworkUpdateFieldErrors = Partial<
  Record<
    keyof (UpdateArtworkRouteBody & UpdateArtworkRouteParams),
    string[] | undefined
  >
>;

type ArtworkValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ArtworkUpdateFieldErrors;
  formErrors: string[];
};

type ArtworkDocumentLike = {
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: ArtworkUpdateFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<ArtworkValidationErrorResponse>(
    {
      success: false,
      error: "Invalid artwork input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const normalizeArtworkResponse = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeArtworkResponse);
  }

  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object") {
    const maybeObjectId = value as { constructor?: { name?: string } };

    if (
      maybeObjectId.constructor?.name === "ObjectId" &&
      typeof value.toString === "function"
    ) {
      return value.toString();
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "__v")
        .map(([key, nestedValue]) => [
          key,
          normalizeArtworkResponse(nestedValue),
        ])
    );
  }

  return value;
};

const toArtworkResponse = (artwork: ArtworkDocumentLike): AdminArtwork => {
  const plainArtwork =
    typeof artwork.toObject === "function"
      ? artwork.toObject({ versionKey: false, flattenObjectIds: true })
      : artwork;

  return normalizeArtworkResponse(plainArtwork) as AdminArtwork;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateArtworkResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedParams = updateArtworkRouteParamsSchema.safeParse(params);

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

  const parsedBody = updateArtworkRouteBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/artwork/update/[id]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      parsedParams.data.id,
      { $set: parsedBody.data },
      { new: true }
    );

    if (!updatedArtwork) {
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });
    }

    return apiSuccessResponse(toArtworkResponse(updatedArtwork));
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.artwork_update.failed", {
      operation: "admin.artwork.update",
      error,
      errorLabel: "admin_artwork_update_failed",
    });
    return apiErrorResponse({
      message: "Failed to update artwork",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

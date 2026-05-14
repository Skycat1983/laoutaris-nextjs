import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateCollectionResult } from "@/lib/api/admin/update/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  updateCollectionRouteBodySchema,
  updateCollectionRouteParamsSchema,
  type UpdateCollectionRouteBody,
  type UpdateCollectionRouteParams,
} from "@/lib/data/schemas/collectionSchema";

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

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
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

  try {
    await dbConnect();

    const collection = await CollectionModel.findById(parsedParams.data.id);
    if (!collection) {
      return errorResponse("Collection not found", 404);
    }

    applyCollectionFields(collection, parsedBody.data);
    await collection.save();

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies UpdateCollectionResult);
  } catch (error) {
    console.error("Error updating collection:", error);
    return errorResponse("Failed to update collection", 500);
  }
}

import { ArtworkModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateArtworkResult } from "@/lib/api/admin/create/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  createArtworkRouteSchema,
  type CreateArtworkRouteInput,
} from "@/lib/data/schemas/artworkSchema";
import type { AdminArtwork } from "@/lib/data/types";

type ArtworkCreateFieldErrors = Partial<
  Record<keyof CreateArtworkRouteInput, string[] | undefined>
>;

type ArtworkValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ArtworkCreateFieldErrors;
  formErrors: string[];
};

type ArtworkDocumentLike = {
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: ArtworkCreateFieldErrors,
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

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
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

export async function POST(
  request: Request
): Promise<RouteResponse<CreateArtworkResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationErrorResponse({}, ["Request body must be valid JSON."]);
  }

  const parsedBody = createArtworkRouteSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { title, decade, artstyle, medium, surface, featured, image } =
      parsedBody.data;

    const artwork = await ArtworkModel.create({
      title,
      decade,
      artstyle,
      medium,
      surface,
      featured,
      image,
      author: admin.userId,
    });

    return NextResponse.json(
      {
        success: true,
        data: toArtworkResponse(artwork),
      } satisfies CreateArtworkResult,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating artwork:", error);
    return errorResponse("Failed to create artwork", 500);
  }
}

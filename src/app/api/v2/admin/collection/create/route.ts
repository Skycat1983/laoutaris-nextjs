import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateCollectionResult } from "@/lib/api/admin/create/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  createCollectionRouteSchema,
  type CreateCollectionRouteInput,
} from "@/lib/data/schemas/collectionSchema";

type CollectionCreateFieldErrors = Partial<
  Record<keyof CreateCollectionRouteInput, string[] | undefined>
>;

type CollectionValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: CollectionCreateFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: CollectionCreateFieldErrors,
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

export async function POST(
  request: Request
): Promise<RouteResponse<CreateCollectionResult>> {
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

  const parsedBody = createCollectionRouteSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { title, subtitle, summary, text, imageUrl, section } =
      parsedBody.data;
    const slug = slugify(title, { lower: true });

    const collection = await CollectionModel.create({
      title,
      subtitle,
      summary,
      text,
      imageUrl,
      section,
      slug,
      author: admin.userId,
    });

    return NextResponse.json(
      { success: true, data: collection } satisfies CreateCollectionResult,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return errorResponse("Failed to create collection", 500);
  }
}

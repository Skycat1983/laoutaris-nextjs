import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateCollectionResult } from "@/lib/api/admin/create/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  createCollectionRouteSchema,
  type CreateCollectionRouteInput,
} from "@/lib/data/schemas/collectionSchema";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

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

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/collection/create"
  );
  const logger = createApiLogger(requestContext);

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

    return apiSuccessResponse(collection, { status: 201 });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.collection_create.failed", {
      operation: "admin.collection.create",
      error,
      errorLabel: "admin_collection_create_failed",
    });
    return apiErrorResponse({
      message: "Failed to create collection",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

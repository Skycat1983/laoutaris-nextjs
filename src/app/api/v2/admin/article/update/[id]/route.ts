import { ArticleModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateArticleResult } from "@/lib/api/admin/update/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  updateArticleRouteBodySchema,
  updateArticleRouteParamsSchema,
  type UpdateArticleRouteBody,
  type UpdateArticleRouteParams,
} from "@/lib/data/schemas/articleSchema";
import type { AdminArticle } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type ArticleUpdateFieldErrors = Partial<
  Record<
    keyof (UpdateArticleRouteBody & UpdateArticleRouteParams),
    string[] | undefined
  >
>;

type ArticleValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ArticleUpdateFieldErrors;
  formErrors: string[];
};

type ArticleDocumentLike = {
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: ArticleUpdateFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<ArticleValidationErrorResponse>(
    {
      success: false,
      error: "Invalid article input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const normalizeArticleResponse = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeArticleResponse);
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
          normalizeArticleResponse(nestedValue),
        ])
    );
  }

  return value;
};

const toArticleResponse = (article: ArticleDocumentLike): AdminArticle => {
  const plainArticle =
    typeof article.toObject === "function"
      ? article.toObject({ versionKey: false, flattenObjectIds: true })
      : article;

  return normalizeArticleResponse(plainArticle) as AdminArticle;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateArticleResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedParams = updateArticleRouteParamsSchema.safeParse(params);

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

  const parsedBody = updateArticleRouteBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/update/[id]"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const updateData: UpdateArticleRouteBody & { slug?: string } = {
      ...parsedBody.data,
    };

    if (parsedBody.data.title !== undefined) {
      updateData.slug = slugify(parsedBody.data.title, { lower: true });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      parsedParams.data.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedArticle) {
      return apiErrorResponse({
        message: "Article not found",
        status: 404,
      });
    }

    return apiSuccessResponse(toArticleResponse(updatedArticle));
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_update.failed", {
      operation: "admin.article.update",
      error,
      errorLabel: "admin_article_update_failed",
    });
    return apiErrorResponse({
      message: "Failed to update article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

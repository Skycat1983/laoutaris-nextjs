import { ArticleModel, ArtworkModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import type { CreateArticleResult } from "@/lib/api/admin/create/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  createArticleRouteSchema,
  CreateArticleRouteInput,
} from "@/lib/data/schemas/articleSchema";
import type { AdminArticle } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type ArticleCreateFieldErrors = Partial<
  Record<keyof CreateArticleRouteInput, string[] | undefined>
>;

type ArticleValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ArticleCreateFieldErrors;
  formErrors: string[];
};

type ArticleDocumentLike = {
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: ArticleCreateFieldErrors,
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

const verifyArtworkExists = async (artworkId: string) => {
  const artworkExists = await ArtworkModel.exists({ _id: artworkId });

  return Boolean(artworkExists);
};

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

export async function POST(
  request: Request
): Promise<RouteResponse<CreateArticleResult>> {
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

  const parsedBody = createArticleRouteSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/create"
  );
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const {
      title,
      subtitle,
      summary,
      text,
      imageUrl,
      section,
      overlayColour,
      artwork,
    } = parsedBody.data;
    const slug = slugify(title, { lower: true });

    const artworkExists = await verifyArtworkExists(artwork);
    if (!artworkExists) {
      return validationErrorResponse({
        artwork: ["Artwork not found"],
      });
    }

    const article = await ArticleModel.create({
      title,
      subtitle,
      summary,
      text,
      imageUrl,
      section,
      overlayColour,
      artwork,
      slug,
      author: admin.userId,
    });

    return apiSuccessResponse(toArticleResponse(article), { status: 201 });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_create.failed", {
      operation: "admin.article.create",
      error,
      errorLabel: "admin_article_create_failed",
    });
    return apiErrorResponse({
      message: "Failed to create article",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

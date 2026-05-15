import { BlogModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import slugify from "slugify";
import { UpdateBlogResult } from "@/lib/api/admin/update/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  apiUpdateBlogSchema,
  updateBlogRouteParamsSchema,
  type UpdateBlogRouteBody,
  type UpdateBlogRouteParams,
} from "@/lib/data/schemas/blogSchema";
import type { AdminBlog } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";

type BlogUpdateFieldErrors = Partial<
  Record<keyof (UpdateBlogRouteBody & UpdateBlogRouteParams), string[]>
>;

type BlogValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: BlogUpdateFieldErrors;
  formErrors: string[];
};

type BlogDocumentLike = {
  title?: string;
  slug?: string;
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: BlogUpdateFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<BlogValidationErrorResponse>(
    {
      success: false,
      error: "Invalid blog input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const normalizeBlogResponse = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeBlogResponse);
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
        .map(([key, nestedValue]) => [key, normalizeBlogResponse(nestedValue)])
    );
  }

  return value;
};

const toBlogResponse = (blog: BlogDocumentLike): AdminBlog => {
  const plainBlog =
    typeof blog.toObject === "function"
      ? blog.toObject({ versionKey: false, flattenObjectIds: true })
      : blog;

  return normalizeBlogResponse(plainBlog) as AdminBlog;
};

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateBlogResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedParams = updateBlogRouteParamsSchema.safeParse(params);

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

  const parsedBody = apiUpdateBlogSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const existingBlog = (await BlogModel.findById(
      parsedParams.data.id
    )) as BlogDocumentLike | null;
    if (!existingBlog) {
      return apiErrorResponse({
        message: "Blog not found",
        status: 404,
      });
    }

    const updateData: UpdateBlogRouteBody & { slug?: string } = {
      ...parsedBody.data,
    };

    if (
      parsedBody.data.title !== undefined &&
      parsedBody.data.title !== existingBlog.title
    ) {
      const newSlug = slugify(parsedBody.data.title, { lower: true });
      const slugExists = await BlogModel.findOne({
        slug: newSlug,
        _id: { $ne: parsedParams.data.id },
      });

      if (slugExists) {
        return apiErrorResponse({
          message: `A blog with a similar title already exists. The slug "${newSlug}" is already taken.`,
          status: 409,
        });
      }

      updateData.slug = newSlug;
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      parsedParams.data.id,
      { $set: updateData },
      {
        new: true,
      }
    );

    if (!updatedBlog) {
      return apiErrorResponse({
        message: "Blog not found",
        status: 404,
      });
    }

    return apiSuccessResponse(toBlogResponse(updatedBlog));
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error updating blog:", error);
    return apiErrorResponse({
      message: "Failed to update blog",
      status: 500,
    });
  }
}

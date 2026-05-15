import { BlogModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { CreateBlogResult } from "@/lib/api/admin/create/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  createBlogRouteSchema,
  type CreateBlogRouteInput,
} from "@/lib/data/schemas/blogSchema";
import type { AdminBlog } from "@/lib/data/types";

type BlogCreateFieldErrors = Partial<
  Record<keyof CreateBlogRouteInput, string[] | undefined>
>;

type BlogValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: BlogCreateFieldErrors;
  formErrors: string[];
};

type BlogDocumentLike = {
  toObject?: (options?: {
    versionKey?: boolean;
    flattenObjectIds?: boolean;
  }) => unknown;
};

const validationErrorResponse = (
  fieldErrors: BlogCreateFieldErrors,
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

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
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

export async function POST(
  request: Request
): Promise<RouteResponse<CreateBlogResult>> {
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

  const parsedBody = createBlogRouteSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { title, subtitle, summary, text, imageUrl, displayDate, featured } =
      parsedBody.data;
    const slug = slugify(title, { lower: true });

    const blog = await BlogModel.create({
      title,
      subtitle,
      summary,
      text,
      imageUrl,
      displayDate,
      featured,
      slug,
      author: admin.userId,
    });

    return NextResponse.json(
      {
        success: true,
        data: toBlogResponse(blog),
      } satisfies CreateBlogResult,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return errorResponse("Failed to create blog", 500);
  }
}

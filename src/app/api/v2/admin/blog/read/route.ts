import { BlogModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadBlogListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type {
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryFrontend,
} from "@/lib/data/types";
import { transformBlogPopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import { parseAdminReadListQuery } from "@/lib/api/admin/read/routeValidation";

type BlogReadQuery = Record<string, unknown>;
type BlogReadFilterKey = "featured" | "year";

const BLOG_READ_SEARCH_MAX_LENGTH = 80;

const isBlogReadFilterKey = (
  filterKey: string | null
): filterKey is BlogReadFilterKey =>
  filterKey === "featured" || filterKey === "year";

const escapeRegexValue = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBlogReadFilterQuery = (
  searchParams: URLSearchParams
): BlogReadQuery => {
  const filterKey = searchParams.get("filterKey");
  const filterValue = searchParams.get("filterValue");

  if (!isBlogReadFilterKey(filterKey) || !filterValue) {
    return {};
  }

  if (filterKey === "featured") {
    if (filterValue !== "true" && filterValue !== "false") {
      return {};
    }

    return {
      featured: filterValue === "true",
    };
  }

  if (!/^\d{4}$/.test(filterValue)) {
    return {};
  }

  const year = Number(filterValue);

  return {
    displayDate: {
      $gte: new Date(Date.UTC(year, 0, 1)),
      $lt: new Date(Date.UTC(year + 1, 0, 1)),
    },
  };
};

const buildBlogReadSearchQuery = (search?: string): BlogReadQuery => {
  if (!search) {
    return {};
  }

  const regex = {
    $regex: escapeRegexValue(search),
    $options: "i",
  };

  return {
    $or: [{ title: regex }, { slug: regex }],
  };
};

const buildBlogReadQuery = (
  searchParams: URLSearchParams,
  search?: string
): BlogReadQuery => ({
  ...buildBlogReadFilterQuery(searchParams),
  ...buildBlogReadSearchQuery(search),
});

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadBlogListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/blog/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedQuery = parseAdminReadListQuery(
    request.nextUrl.searchParams,
    "blog",
    {
      defaultLimit: 10,
      search: {
        maxLength: BLOG_READ_SEARCH_MAX_LENGTH,
      },
    }
  );

  if (!parsedQuery.ok) {
    return parsedQuery.response;
  }

  const { page, limit, search } = parsedQuery;
  const query = buildBlogReadQuery(request.nextUrl.searchParams, search);
  const hasFilter = Object.keys(query).length > 0;
  const modelQuery = hasFilter ? query : undefined;
  const skip = (page - 1) * limit;
  try {
    await dbConnect();

    const total = modelQuery
      ? await BlogModel.countDocuments(modelQuery)
      : await BlogModel.countDocuments();

    const rawBlogsQuery = modelQuery
      ? BlogModel.find(modelQuery)
      : BlogModel.find();

    const rawBlogs = await rawBlogsQuery
      .sort({ displayDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        author: AdminUserTransformations["Lean"];
        comments: AdminCommentTransformations["Lean"][];
      }>("author comments")
      .lean<AdminBlogTransformationsPopulated["Lean"][]>();

    if (rawBlogs.length === 0) {
      return apiErrorResponse({
        message: "No blogs found",
        status: 404,
      });
    }

    const blogs: BlogEntryFrontend[] = rawBlogs.map((blog) =>
      transformBlogPopulated(blog)
    );

    return apiListResponse(blogs, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.blog_read.failed", {
      operation: "admin.blog.read.list",
      error,
      errorLabel: "admin_blog_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch blogs",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

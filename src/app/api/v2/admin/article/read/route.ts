import { ArticleModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadArticleListResult } from "@/lib/api/admin/read/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import type { AdminArticleTransformationsPopulated, ArticleFrontendPopulated } from "@/lib/data/types";
import { transformArticlePopulated } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import { parseAdminReadListQuery } from "@/lib/api/admin/read/routeValidation";
import {
  ARTICLE_OVERLAY_COLOUR_OPTIONS,
  ARTICLE_SECTION_OPTIONS,
} from "@/lib/constants/articleConstants";

type ArticleReadQuery = Record<string, unknown>;
type ArticleReadFilterKey = "section" | "overlayColour";

const ARTICLE_READ_SEARCH_MAX_LENGTH = 80;

const isArticleReadFilterKey = (
  filterKey: string | null
): filterKey is ArticleReadFilterKey =>
  filterKey === "section" || filterKey === "overlayColour";

const escapeRegexValue = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildArticleReadFilterQuery = (
  searchParams: URLSearchParams
): ArticleReadQuery => {
  const filterKey = searchParams.get("filterKey");
  const filterValue = searchParams.get("filterValue");

  if (!isArticleReadFilterKey(filterKey) || !filterValue) {
    return {};
  }

  if (
    filterKey === "section" &&
    (ARTICLE_SECTION_OPTIONS as readonly string[]).includes(filterValue)
  ) {
    return { section: filterValue };
  }

  if (
    filterKey === "overlayColour" &&
    (ARTICLE_OVERLAY_COLOUR_OPTIONS as readonly string[]).includes(filterValue)
  ) {
    return { overlayColour: filterValue };
  }

  return {};
};

const buildArticleReadSearchQuery = (search?: string): ArticleReadQuery => {
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

const buildArticleReadQuery = (
  searchParams: URLSearchParams,
  search?: string
): ArticleReadQuery => ({
  ...buildArticleReadFilterQuery(searchParams),
  ...buildArticleReadSearchQuery(search),
});

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ReadArticleListResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/article/read"
  );
  const logger = createApiLogger(requestContext);

  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const parsedQuery = parseAdminReadListQuery(
    request.nextUrl.searchParams,
    "article",
    {
      defaultLimit: 10,
      search: {
        maxLength: ARTICLE_READ_SEARCH_MAX_LENGTH,
      },
    }
  );

  if (!parsedQuery.ok) {
    return parsedQuery.response;
  }

  const { page, limit, search } = parsedQuery;
  const query = buildArticleReadQuery(request.nextUrl.searchParams, search);
  const hasQuery = Object.keys(query).length > 0;
  const modelQuery = hasQuery ? query : undefined;

  try {
    await dbConnect();

    const articlesQuery = modelQuery
      ? ArticleModel.find(modelQuery)
      : ArticleModel.find();
    const totalQuery = modelQuery
      ? ArticleModel.countDocuments(modelQuery)
      : ArticleModel.countDocuments();

    const [leanArticles, total] = await Promise.all([
      articlesQuery
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("artwork")
        .lean<AdminArticleTransformationsPopulated["Lean"][]>(),
      totalQuery,
    ]);

    if (leanArticles.length === 0) {
      return apiErrorResponse({
        message: "No articles found",
        status: 404,
      });
    }

    const articles: ArticleFrontendPopulated[] = leanArticles.map((article) =>
      transformArticlePopulated(article)
    );

    return apiListResponse(articles, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.admin.article_read.failed", {
      operation: "admin.article.read.list",
      error,
      errorLabel: "admin_article_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read articles",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}

import "server-only";

import type { FilterQuery } from "mongoose";
import type { ArticleSection } from "@/lib/constants";
import { ArticleModel, type ArticleDB } from "@/lib/data/models/articleModel";
import type { ArticleFrontend, ArticleLean, ListResult } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformArticle } from "@/lib/transforms/article/transformArticle";

export interface GetArticleListParams {
  section?: ArticleSection | string | null;
  fields?: string;
  page?: number;
  limit?: number;
}

export type ArticleListServiceResult = ListResult<ArticleFrontend> | null;

export const getArticleList = async ({
  section,
  fields = "",
  page = 1,
  limit = 10,
}: GetArticleListParams = {}): Promise<ArticleListServiceResult> => {
  await dbConnect();

  const query: FilterQuery<ArticleDB> = {};
  if (section) {
    query.section = section;
  }

  const [rawArticles, total] = await Promise.all([
    ArticleModel.find(query)
      .select(fields)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ArticleLean[]>(),
    ArticleModel.countDocuments(query),
  ]);

  if (rawArticles.length === 0) {
    return null;
  }

  const articles = rawArticles.map((article) =>
    transformArticle.toFrontend(article, null)
  );

  return {
    success: true,
    data: articles,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

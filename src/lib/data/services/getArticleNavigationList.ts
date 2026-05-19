import "server-only";

import type { ArticleSection } from "@/lib/constants";
import { ArticleModel } from "@/lib/data/models/articleModel";
import type { ArticleNavDataFrontend, ArticleSelectFieldsLean, ListResult } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformBiographyNav } from "@/lib/transforms/navigation/transformNavData";

export type ArticleNavigationListServiceResult =
  ListResult<ArticleNavDataFrontend> | null;

export const getArticleNavigationList = async (
  section: ArticleSection
): Promise<ArticleNavigationListServiceResult> => {
  await dbConnect();

  const articlesLean = await ArticleModel.find({ section })
    .select("title slug")
    .sort({ displayDate: -1 })
    .lean<ArticleSelectFieldsLean[]>();

  if (!articlesLean.length) {
    return null;
  }

  const articleNavData = articlesLean.map((article) =>
    transformBiographyNav.toFrontend(article)
  );

  return {
    success: true,
    data: articleNavData,
    metadata: {
      total: articleNavData.length,
      page: 1,
      limit: articleNavData.length,
      totalPages: 1,
    },
  };
};

import "server-only";

import { ArticleModel } from "@/lib/data/models/articleModel";
import type { ArtworkLean } from "@/lib/data/types/artworkTypes";
import type {
  ArticleFrontendPopulated,
  ArticleLeanPopulated,
} from "@/lib/data/types/articleTypes";
import type { UserLean } from "@/lib/data/types/userTypes";
import dbConnect from "@/lib/db/mongodb";
import { transformArticlePopulated } from "@/lib/transforms/article/transformArticle";

export const getArticleBySlugPopulated = async (
  slug: string
): Promise<ArticleFrontendPopulated | null> => {
  await dbConnect();

  const articleDB = await ArticleModel.findOne({ slug })
    .populate<{
      author: UserLean;
      artwork: ArtworkLean;
    }>("author artwork")
    .lean<ArticleLeanPopulated>();

  if (!articleDB) {
    return null;
  }

  return transformArticlePopulated(articleDB);
};

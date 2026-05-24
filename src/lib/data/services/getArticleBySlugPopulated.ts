import "server-only";

import { ArticleModel } from "@/lib/data/models/articleModel";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { UserModel } from "@/lib/data/models/userModel";
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
    .populate<{ author: UserLean }>({ path: "author", model: UserModel })
    .populate<{ artwork: ArtworkLean }>({
      path: "artwork",
      model: ArtworkModel,
    })
    .lean<ArticleLeanPopulated>();

  if (!articleDB) {
    return null;
  }

  return transformArticlePopulated(articleDB);
};

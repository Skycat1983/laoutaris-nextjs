import { calculateReadTime } from "../utils/calcReadTime";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformArtwork } from "./transformArtwork";
import { transformUser } from "./transformUser";
import {
  ArticleTransformations,
  ArtworkTransformations,
  PublicArticlePopulated,
  UserTransformations,
} from "../data/types";

export function transformArticle(
  document: ArticleTransformations["Lean"],
  userId?: string | null
): ArticleTransformations["Frontend"] {
  // 1. To Lean
  const transformedDoc =
    transformMongooseDoc<ArticleTransformations["Raw"]>(document);

  // 2. Add extensions
  const extendedDoc = {
    ...transformedDoc,
    readTime: calculateReadTime(transformedDoc.text),
  } satisfies ArticleTransformations["Extended"];

  // 3. Remove sensitive fields with type assertion
  const { _id, createdAt, updatedAt, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc =
    sanitizedFields satisfies ArticleTransformations["Sanitized"];

  return sanitizedDoc;
}

export function transformArticlePopulated(
  article: ArticleTransformations["Lean"] & {
    author: UserTransformations["Lean"];
    artwork: ArtworkTransformations["Lean"];
  },
  userId: string | null
): ArticleTransformations["Populated"] {
  const transformedArticle: ArticleTransformations["Frontend"] =
    transformArticle(article, userId);
  const transformedAuthor: UserTransformations["Frontend"] = transformUser(
    article.author,
    userId
  );
  const transformedArtwork: ArtworkTransformations["Frontend"] =
    transformArtwork(article.artwork, userId);

  return {
    ...transformedArticle,
    author: transformedAuthor,
    artwork: transformedArtwork,
  } satisfies ArticleTransformations["Populated"];
}

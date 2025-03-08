import { ArticleDB, ArtworkDB, UserDB } from "../data/models";
import {
  ArticlePopulatedFrontend,
  ArticleTransformations,
} from "../data/types/transformationTypes";
import { calculateReadTime } from "../utils/calcReadTime";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformArtwork } from "./transformArtwork";
import { transformUser } from "./transformUser";

export function transformArticle(
  document: ArticleDB
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
  article: ArticleDB & { author: UserDB; artwork: ArtworkDB }
): ArticlePopulatedFrontend {
  const transformedArticle = transformArticle(article);
  const transformedAuthor = transformUser(article.author);
  const transformedArtwork = transformArtwork(article.artwork);

  return {
    ...transformedArticle,
    author: transformedAuthor,
    artwork: transformedArtwork,
  } satisfies ArticlePopulatedFrontend;
}

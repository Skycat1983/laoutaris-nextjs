import { ArticleDB, ArtworkDB, UserDB } from "../data/models";
import {
  ArticlePopulatedPublic,
  ArticleTransformations,
} from "../data/types/transformationTypes";
import { calculateReadTime } from "../utils/calcReadTime";
import { transformMongooseDoc } from "./mongooseTransforms";
import { transformArtwork } from "./transformArtwork";
import { transformUser } from "./transformUser";

export function transformArticle(
  document: ArticleDB
): ArticleTransformations["Frontend"] {
  // 1. To Lean
  const leanDoc =
    transformMongooseDoc<ArticleTransformations["Lean"]>(document);

  // 2. Add extensions
  const extendedDoc = {
    ...leanDoc,
    readTime: calculateReadTime(leanDoc.text),
  } satisfies ArticleTransformations["Extended"];

  // 3. Remove sensitive fields with type assertion
  const { _id, createdAt, updatedAt, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc =
    sanitizedFields satisfies ArticleTransformations["Sanitized"];

  return sanitizedDoc;
}

export function transformArticlePopulated(
  article: ArticleDB & { author: UserDB; artwork: ArtworkDB }
): ArticlePopulatedPublic {
  const transformedArticle = transformArticle(article);
  const transformedAuthor = transformUser(article.author);
  const transformedArtwork = transformArtwork(article.artwork);

  return {
    ...transformedArticle,
    author: transformedAuthor,
    artwork: transformedArtwork,
  } satisfies ArticlePopulatedPublic;
}

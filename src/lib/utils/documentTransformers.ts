import { User } from "lucide-react";
import { ArticleDB, ArtworkDB, UserDB } from "../data/models";
import {
  ArticleTransformations,
  UserTransformations,
  ArtworkTransformations,
  ArticlePopulatedFrontend,
} from "../data/types/transformationTypes";
import { transformMongooseDoc } from "../transforms/transformMongooseDoc";

// Article transformations
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

// User transformations
export function transformUser(
  document: UserDB
): UserTransformations["Frontend"] {
  // 1. To Lean
  const leanDoc = transformMongooseDoc<UserTransformations["Lean"]>(document);

  // 2. Add extensions
  const extendedDoc: UserTransformations["Extended"] = {
    ...leanDoc,
    isOnline: false,
  };
  // 3. Remove sensitive fields
  const { password, email, ...sanitizedDoc } = extendedDoc;

  return sanitizedDoc; // Frontend is same as sanitized for users
}

// Artwork transformations
export function transformArtwork(
  document: ArtworkDB
): ArtworkTransformations["Frontend"] {
  // 1. To Lean
  const leanDoc =
    transformMongooseDoc<ArtworkTransformations["Lean"]>(document);

  // 2. Add extensions with explicit type assertion
  const extendedDoc = {
    ...leanDoc,
    favouriteCount: 0,
    watchlistCount: 0,
    isFavourited: false,
    isWatchlisted: false,
  } satisfies ArtworkTransformations["Extended"];

  // 3. Remove sensitive fields
  const { favourited, watcherlist, ...sanitizedDoc } = extendedDoc;

  return sanitizedDoc; // Frontend is same as sanitized for artworks
}

// Helper for populated articles
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

// Utility function
function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

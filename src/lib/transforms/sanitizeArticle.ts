import {
  ArticleLean,
  ArticleLeanPopulated,
  ArticleSanitized,
  ArticleSanitizedPopulated,
} from "../data/types";
import { sanitizeArtwork } from "./sanitizeArtwork";
import { sanitizeUser } from "./sanitizeUser";

export function sanitizeArticle(article: ArticleLean): ArticleSanitized {
  return {
    // _id: article._id,
    // author: article.author,
    // artwork: article.artwork,
    title: article.title,
    subtitle: article.subtitle,
    summary: article.summary,
    text: article.text,
    imageUrl: article.imageUrl,
    slug: article.slug,
    section: article.section,
    overlayColour: article.overlayColour,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

export function sanitizeArticlePopulated(
  article: ArticleLeanPopulated
): ArticleSanitizedPopulated {
  return {
    ...sanitizeArticle(article),
    author: sanitizeUser(article.author),
    artwork: sanitizeArtwork(article.artwork),
  };
}

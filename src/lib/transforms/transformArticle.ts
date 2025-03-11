import { transformUtils } from "./transformUtils";
import type {
  PublicArticleTransformations,
  PublicArticleTransformationsPopulated,
} from "../data/types/articleTypes";
import { transformUser } from "./transformUser";
import { transformArtwork } from "./transformArtwork";
import {
  PublicArtworkTransformations,
  PublicUserTransformations,
} from "../data/types";
import {
  EXTENDED_PUBLIC_ARTICLE_FIELDS,
  SENSITIVE_PUBLIC_ARTICLE_FIELDS,
} from "../constants";
import { calculateReadTime } from "../utils/calcReadTime";
import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export const transformArticle = {
  // Base transformations
  toRaw: (
    doc: PublicArticleTransformations["Lean"]
  ): PublicArticleTransformations["Raw"] => {
    return transformUtils.toRaw<PublicArticleTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicArticleTransformations["Raw"]
  ): PublicArticleTransformations["Extended"] => {
    const extended = {
      ...doc,
      ...EXTENDED_PUBLIC_ARTICLE_FIELDS,
      readTime: calculateReadTime(doc.text),
    };

    return extended satisfies PublicArticleTransformations["Extended"];
  },

  toFrontend: (
    doc: PublicArticleTransformations["Extended"]
  ): PublicArticleTransformations["Frontend"] => {
    return transformUtils.removeSensitive(
      doc,
      SENSITIVE_PUBLIC_ARTICLE_FIELDS
    ) satisfies PublicArticleTransformations["Frontend"];
  },

  // Populated transformations
  toPopulatedRaw: (
    doc: PublicArticleTransformationsPopulated["Lean"]
  ): PublicArticleTransformationsPopulated["Raw"] => {
    // transform the entire base document
    const transformedBase =
      transformUtils.toRaw<PublicArticleTransformations["Raw"]>(doc);

    // ...then transform the populated fields
    return {
      ...transformedBase, // This preserves ALL article fields
      author: transformUtils.toRaw<PublicUserTransformations["Raw"]>(
        doc.author
      ),
      artwork: transformUtils.toRaw<PublicArtworkTransformations["Raw"]>(
        doc.artwork
      ),
    };
  },

  toPopulatedExtended: (
    doc: PublicArticleTransformationsPopulated["Raw"]
  ): PublicArticleTransformationsPopulated["Extended"] => {
    // Separate populated fields from base document
    const { author, artwork, ...baseFields } = doc;

    // Transform base document
    const transformedBase = transformArticle.toExtended(doc);

    return transformUtils.merge(transformedBase, {
      author: transformUser(author),
      artwork: transformArtwork(artwork),
    }) satisfies PublicArticleTransformationsPopulated["Extended"];
  },

  toPopulatedFrontend: (
    doc: PublicArticleTransformationsPopulated["Extended"]
  ): PublicArticleTransformationsPopulated["Frontend"] => {
    // Transform the base document without populated fields
    const {
      author: extendedAuthor,
      artwork: extendedArtwork,
      ...baseDoc
    } = doc;
    const transformedBase = transformArticle.toFrontend(baseDoc);

    // Transform the populated fields separately
    return {
      ...transformedBase,
      author: transformUser(extendedAuthor),
      artwork: transformArtwork(extendedArtwork),
    } satisfies PublicArticleTransformationsPopulated["Frontend"];
  },

  // Convenience method
  rawToPopulatedFrontend: (
    doc: PublicArticleTransformations["Lean"] & {
      author: PublicUserTransformations["Lean"];
      artwork: PublicArtworkTransformations["Lean"];
    }
  ): PublicArticleTransformationsPopulated["Frontend"] => {
    return transformArticle.toPopulatedFrontend(
      transformArticle.toPopulatedExtended(transformArticle.toPopulatedRaw(doc))
    );
  },
};

// export function transformArticlePopulated(
//   article: PublicArticleTransformations["Lean"] & {
//     author: PublicUserTransformations["Lean"];
//     artwork: PublicArtworkTransformations["Lean"];
//   },
//   userId: string | null
// ): PublicArticleTransformationsPopulated["Frontend"] {
//   const transformedArticle: PublicArticleTransformations["Frontend"] =
//     transformArticle(article, userId);
//   const transformedAuthor: PublicUserTransformations["Frontend"] =
//     transformUser(article.author, userId);
//   const transformedArtwork: PublicArtworkTransformations["Frontend"] =
//     transformArtwork(article.artwork, userId);

//   return {
//     ...transformedArticle,
//     author: transformedAuthor,
//     artwork: transformedArtwork,
//   } satisfies PublicArticleTransformationsPopulated["Frontend"];
// }

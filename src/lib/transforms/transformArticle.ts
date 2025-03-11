import { transformUtils } from "./transformUtils";
import type { PublicArticleTransformationsPopulated } from "../data/types/articleTypes";
import { transformUser } from "./transformUser";
import { transformArtwork } from "./transformArtwork";
import {
  EXTENDED_PUBLIC_ARTICLE_FIELDS,
  ExtendedPublicArticleFields,
  SENSITIVE_PUBLIC_ARTICLE_FIELDS,
  SensitivePublicArticleFields,
} from "../constants";
import { calculateReadTime } from "../utils/calcReadTime";
import { PublicTransformationsGeneric } from "../data/types";
import { ArticleDB } from "../data/models";

type PublicArticleTransformations = PublicTransformationsGeneric<
  Partial<ArticleDB>,
  ExtendedPublicArticleFields,
  SensitivePublicArticleFields
>;

export const transformArticle = {
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

  toSanitized: (
    doc: PublicArticleTransformations["Extended"]
  ): PublicArticleTransformations["Sanitized"] => {
    return transformUtils.removeSensitive(
      doc,
      SENSITIVE_PUBLIC_ARTICLE_FIELDS
    ) satisfies PublicArticleTransformations["Sanitized"];
  },

  toFrontend: (
    doc: PublicArticleTransformations["Lean"]
  ): PublicArticleTransformations["Frontend"] => {
    return transformArticle.toSanitized(
      transformArticle.toExtended(transformArticle.toRaw(doc))
    ) satisfies PublicArticleTransformations["Frontend"];
  },

  toPopulated: (
    doc: PublicArticleTransformationsPopulated["Lean"]
  ): PublicArticleTransformationsPopulated["Frontend"] => {
    const { author, artwork, ...baseDoc } = doc;
    const transformedBase = transformArticle.toFrontend(baseDoc);
    const transformedAuthor = transformUser.toFrontend(author);
    const transformedArtwork = transformArtwork.toFrontend(artwork);

    return {
      ...transformedBase,
      author: transformedAuthor,
      artwork: transformedArtwork,
    } satisfies PublicArticleTransformationsPopulated["Frontend"];
  },

  // type PublicArticlePopulated = PublicTransformationsGeneric<
  //   Partial<PublicArticleTransformationsPopulated["Lean"]>,
  //   ExtendedPublicArticleFields,
  //   SensitivePublicArticleFields
  // >;

  // type PublicArticleTransformationsPopulated = PublicTransformationsGeneric<
  //   Partial<ArticleDB>,
  //   ExtendedPublicArticleFields,
  //   SensitivePublicArticleFields,
  //   {
  //     author: PublicTransformationsGeneric<
  //       UserDB,
  //       ExtendedUserFields,
  //       SensitivePublicUserFields
  //     >;
  //     artwork: PublicTransformationsGeneric<
  //       ArtworkDB,
  //       ExtendedPublicArtworkFields,
  //       SensitivePublicArtworkFields
  //     >;
  //   }
  // >;

  // // First define a generic populated version
  // export type PublicTransformationsPopulatedGeneric<
  //   TDocument,
  //   TExtended extends Record<string, any>,
  //   TSensitive extends string,
  //   TPopulated extends Record<string, PublicTransformationsGeneric<any, any, any>>
  // > = {
  //   Lean: WithPopulatedFields<
  //     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Lean"],
  //     { [K in keyof TPopulated]: TPopulated[K]["Lean"] }
  //   >;
  //   Raw: WithPopulatedFields<
  //     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Raw"],
  //     { [K in keyof TPopulated]: TPopulated[K]["Raw"] }
  //   >;
  //   Extended: WithPopulatedFields<
  //     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Extended"],
  //     { [K in keyof TPopulated]: TPopulated[K]["Extended"] }
  //   >;
  //   Frontend: WithPopulatedFields<
  //     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Frontend"],
  //     { [K in keyof TPopulated]: TPopulated[K]["Frontend"] }
  //   >;
  // };

  // // Then use it for Article
  // type PublicArticleTransformationsPopulated =
  //   PublicTransformationsPopulatedGeneric<
  //     ArticleDB,
  //     ExtendedPublicArticleFields,
  //     SensitivePublicArticleFields,
  //     {
  //       author: PublicTransformationsGeneric<
  //         UserDB,
  //         ExtendedUserFields,
  //         SensitivePublicUserFields
  //       >;
  //       artwork: PublicTransformationsGeneric<
  //         ArtworkDB,
  //         ExtendedPublicArtworkFields,
  //         SensitivePublicArtworkFields
  //       >;
  //     }
  //   >;

  // toPopulatedRaw: (
  //   doc: PublicArticleTransformationsPopulated["Lean"]
  // ): PublicArticleTransformationsPopulated["Raw"] => {
  //   // transform the entire base document
  //   const transformedBase =
  //     transformUtils.toRaw<PublicArticleTransformations["Raw"]>(doc);

  //   // ...then transform the populated fields
  //   return {
  //     ...transformedBase, // This preserves ALL article fields
  //     author: transformUtils.toRaw<PublicUserTransformations["Raw"]>(
  //       doc.author
  //     ),
  //     artwork: transformUtils.toRaw<PublicArtworkTransformations["Raw"]>(
  //       doc.artwork
  //     ),
  //   };
  // },

  // toPopulatedExtended: (
  //   doc: PublicArticleTransformationsPopulated["Raw"]
  // ): PublicArticleTransformationsPopulated["Extended"] => {
  //   // Separate populated fields from base document
  //   const { author, artwork, ...baseFields } = doc;

  //   // Transform base document
  //   const transformedBase = transformArticle.toExtended(doc);

  //   return transformUtils.merge(transformedBase, {
  //     author: transformUser.toExtended(author),
  //     artwork: transformArtwork.toExtended(artwork),
  //   }) satisfies PublicArticleTransformationsPopulated["Extended"];
  // },

  // toPopulatedFrontend: (
  //   doc: PublicArticleTransformationsPopulated["Extended"]
  // ): PublicArticleTransformationsPopulated["Frontend"] => {
  //   // Transform the base document without populated fields
  //   const {
  //     author: extendedAuthor,
  //     artwork: extendedArtwork,
  //     ...baseDoc
  //   } = doc;
  //   const transformedBase = transformArticle.toFrontend(baseDoc);

  //   // Transform the populated fields separately
  //   return {
  //     ...transformedBase,
  //     author: transformUser(extendedAuthor),
  //     artwork: transformArtwork(extendedArtwork),
  //   } satisfies PublicArticleTransformationsPopulated["Frontend"];
  // },
};

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

// Populated transformations
// toPopulatedRaw: (
//   doc: PublicArticleTransformationsPopulated["Lean"]
// ): PublicArticleTransformationsPopulated["Raw"] => {
//   // transform the entire base document
//   const transformedBase =
//     transformUtils.toRaw<PublicArticleTransformations["Raw"]>(doc);

//   // ...then transform the populated fields
//   return {
//     ...transformedBase, // This preserves ALL article fields
//     author: transformUtils.toRaw<PublicUserTransformations["Raw"]>(
//       doc.author
//     ),
//     artwork: transformUtils.toRaw<PublicArtworkTransformations["Raw"]>(
//       doc.artwork
//     ),
//   };
// },

// toPopulatedExtended: (
//   doc: PublicArticleTransformationsPopulated["Raw"]
// ): PublicArticleTransformationsPopulated["Extended"] => {
//   // Separate populated fields from base document
//   const { author, artwork, ...baseFields } = doc;

//   // Transform base document
//   const transformedBase = transformArticle.toExtended(baseFields);

//   return transformUtils.merge(transformedBase, {
//     author: transformUser(author),
//     artwork: transformArtwork(artwork),
//   }) satisfies PublicArticleTransformationsPopulated["Extended"];
// },

// toPopulatedFrontend: (
//   doc: PublicArticleTransformationsPopulated["Extended"]
// ): PublicArticleTransformationsPopulated["Frontend"] => {
//   // Transform the base document without populated fields
//   const {
//     author: extendedAuthor,
//     artwork: extendedArtwork,
//     ...baseDoc
//   } = doc;
//   const transformedBase = transformArticle.toFrontend(baseDoc);

//   // Transform the populated fields separately
//   return {
//     ...transformedBase,
//     author: transformUser(extendedAuthor),
//     artwork: transformArtwork(extendedArtwork),
//   } satisfies PublicArticleTransformationsPopulated["Frontend"];
// },

// // Convenience method
// rawToPopulatedFrontend: (
//   doc: PublicArticleTransformations["Lean"] & {
//     author: PublicUserTransformations["Lean"];
//     artwork: PublicArtworkTransformations["Lean"];
//   }
// ): PublicArticleTransformationsPopulated["Frontend"] => {
//   return transformArticle.toPopulatedFrontend(
//     transformArticle.toPopulatedExtended(transformArticle.toPopulatedRaw(doc))
//   );
// },
// export const transformArticlePopulated = (
//   article: PublicArticleTransformationsPopulated["Lean"],
//   userId: string | null
// ): PublicArticleTransformationsPopulated["Frontend"] => {
//   return transformArticle.toPopulatedFrontend(
//     transformArticle.toPopulatedExtended(
//       transformArticle.toPopulatedRaw(article)
//     )
//   );
// };

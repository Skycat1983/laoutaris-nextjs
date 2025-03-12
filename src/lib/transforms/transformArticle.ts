import {
  EXTENDED_PUBLIC_ARTICLE_FIELDS,
  ExtendedPublicArticleFields,
  SENSITIVE_PUBLIC_ARTICLE_FIELDS,
  SensitivePublicArticleFields,
  ARTICLE_FIELD_EXTENDER,
} from "../constants";
import { ArticleBase, ArticleDB } from "../data/models";
import { createTransformer } from "./createTransformer";
import { transformUser } from "./transformUser";
import { transformArtwork } from "./transformArtwork";
import { ArticleLeanPopulated, ArticleFrontendPopulated } from "../data/types";
export type TransformedArticle = ReturnType<typeof transformArticle.toFrontend>;

export const transformArticle = createTransformer<
  ArticleDB,
  ArticleBase,
  ExtendedPublicArticleFields,
  SensitivePublicArticleFields
>(
  EXTENDED_PUBLIC_ARTICLE_FIELDS,
  SENSITIVE_PUBLIC_ARTICLE_FIELDS,
  ARTICLE_FIELD_EXTENDER
);

export const transformArticlePopulated = (
  doc: ArticleLeanPopulated,
  userId?: string | null
) => {
  const articlePublic = transformArticle.toFrontend(doc, userId);

  const { author, artwork, ...baseDoc } = doc;
  const transformedAuthor = transformUser.toFrontend(author);
  const transformedArtwork = transformArtwork.toFrontend(artwork, userId);

  const populatedArticle = {
    ...articlePublic,
    author: transformedAuthor,
    artwork: transformedArtwork,
  } satisfies ArticleFrontendPopulated;

  return populatedArticle;
};

// ! DO NOT DELETE. THIS IS THE OLD WAY OF DOING THINGS.... THAT WORKS. IMPORTANT FALLBACK

// type ToRaw = Prettify<ReturnType<typeof transformArticle.toRaw>>;
// type ToExtended = Prettify<ReturnType<typeof transformArticle.toExtended>>;
// type ToSanitized = Prettify<ReturnType<typeof transformArticle.toSanitized>>;
// type ToFrontend = Prettify<ReturnType<typeof transformArticle.toFrontend>>;

// import { transformUtils } from "./transformUtils";
// import { transformUser } from "./transformUser";
// import { transformArtwork } from "./transformArtwork";
// import { UserDB } from "../data/models";
// import { ArtworkDB } from "../data/models";
// import { Schema, Types } from "mongoose";
// import {
//   FrontendArticlePopulated,
//   LeanArticlePopulated,
//   LeanDocument,
//   Merge,
//   TransformedDocument,
// } from "../data/types";

// export type PublicTransformationsGeneric<
//   TDocument,
//   TExtended extends Record<string, any>,
//   TSensitive extends string
// > = {
//   DB: TDocument;
//   Lean: LeanDocument<
//     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["DB"]
//   >;
//   Raw: TransformedDocument<
//     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Lean"]
//   >;
//   Extended: Merge<
//     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Raw"],
//     TExtended
//   >;
//   Sanitized: Omit<
//     PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Extended"],
//     TSensitive
//   >;
//   Frontend: PublicTransformationsGeneric<
//     TDocument,
//     TExtended,
//     TSensitive
//   >["Sanitized"];
// };

// type PublicArticleTransformations = PublicTransformationsGeneric<
//   ArticleDB,
//   ExtendedPublicArticleFields,
//   SensitivePublicArticleFields
// >;

// type WithoutPopulated<T, K extends keyof T> = Omit<T, K>;

// type ArticleBase = WithoutPopulated<ArticleDB, "author" | "artwork">;

// type PublicArticleTransformationsPopulated = PublicTransformationsGeneric<
//   ArticleBase,
//   ExtendedPublicArticleFields,
//   SensitivePublicArticleFields
// >;

// export const transformArticle = {
//   toRaw: (
//     doc: PublicArticleTransformations["Lean"]
//   ): PublicArticleTransformations["Raw"] => {
//     return transformUtils.toRaw<PublicArticleTransformations["Raw"]>(doc);
//   },

//   toExtended: (
//     doc: PublicArticleTransformations["Raw"]
//   ): PublicArticleTransformations["Extended"] => {
//     const extended = {
//       ...doc,
//       ...EXTENDED_PUBLIC_ARTICLE_FIELDS,
//       readTime: calculateReadTime(doc.text),
//     };

//     return extended satisfies PublicArticleTransformations["Extended"];
//   },

//   toSanitized: (
//     doc: PublicArticleTransformations["Extended"]
//   ): PublicArticleTransformations["Sanitized"] => {
//     return transformUtils.removeSensitive(
//       doc,
//       SENSITIVE_PUBLIC_ARTICLE_FIELDS
//     ) satisfies PublicArticleTransformations["Sanitized"];
//   },

//   toFrontend: (
//     doc: PublicArticleTransformations["Lean"]
//   ): PublicArticleTransformations["Frontend"] => {
//     return transformArticle.toSanitized(
//       transformArticle.toExtended(transformArticle.toRaw(doc))
//     ) satisfies PublicArticleTransformations["Frontend"];
//   },
// };

// const transformArticlePopulated = {
//   toRaw: (
//     doc: PublicArticleTransformationsPopulated["Lean"]
//   ): PublicArticleTransformationsPopulated["Raw"] => {
//     return transformUtils.toRaw<PublicArticleTransformationsPopulated["Raw"]>(
//       doc
//     );
//   },

//   toExtended: (
//     doc: PublicArticleTransformationsPopulated["Raw"]
//   ): PublicArticleTransformationsPopulated["Extended"] => {
//     const extended = {
//       ...doc,
//       ...EXTENDED_PUBLIC_ARTICLE_FIELDS,
//       readTime: calculateReadTime(doc.text),
//     };

//     return extended satisfies PublicArticleTransformationsPopulated["Extended"];
//   },

//   toSanitized: (
//     doc: PublicArticleTransformationsPopulated["Extended"]
//   ): PublicArticleTransformationsPopulated["Sanitized"] => {
//     return transformUtils.removeSensitive(
//       doc,
//       SENSITIVE_PUBLIC_ARTICLE_FIELDS
//     ) satisfies PublicArticleTransformationsPopulated["Sanitized"];
//   },

//   toFrontend: (
//     doc: PublicArticleTransformationsPopulated["Lean"]
//   ): PublicArticleTransformationsPopulated["Frontend"] => {
//     return transformArticlePopulated.toSanitized(
//       transformArticlePopulated.toExtended(transformArticlePopulated.toRaw(doc))
//     ) satisfies PublicArticleTransformationsPopulated["Frontend"];
//   },
// };

// export const transformPopulatedArticle = (
//   doc: LeanArticlePopulated
// ): FrontendArticlePopulated => {
//   const { author, artwork, ...baseDoc } = doc;

//   const transformedAuthor = transformUser.toFrontend(author);
//   const transformedArtwork = transformArtwork.toFrontend(artwork);
//   const transformedBase = transformArticlePopulated.toFrontend(baseDoc);

//   const transformed = {
//     author: transformedAuthor,
//     artwork: transformedArtwork,
//     ...transformedBase,
//   };

//   return transformed satisfies FrontendArticlePopulated;
// };

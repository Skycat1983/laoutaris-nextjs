import {
  EXTENDED_PUBLIC_ARTICLE_FIELDS,
  ExtendedPublicArticleFields,
  SENSITIVE_PUBLIC_ARTICLE_FIELDS,
  SensitivePublicArticleFields,
  ARTICLE_FIELD_EXTENDER,
} from "../../constants";
import { ArticleBase, ArticleDB } from "../../data/models";
import { createTransformer } from "../createTransformer";
import { transformUser } from "../user/transformUser";
import { transformArtwork } from "../artwork/transformArtwork";
import {
  ArticleLeanPopulated,
  ArticleFrontendPopulated,
} from "../../data/types";
export type TransformedArticle = ReturnType<typeof transformArticle.toFrontend>;

export const transformArticle = createTransformer<
  ArticleBase,
  ArticleDB,
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

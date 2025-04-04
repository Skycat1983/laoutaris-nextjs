import {
  EXTENDED_PUBLIC_BLOG_FIELDS,
  SENSITIVE_PUBLIC_BLOG_FIELDS,
  SensitivePublicBlogFields,
  ExtendedPublicBlogFields,
  BLOG_FIELD_EXTENDER,
} from "../../constants";

import { BlogEntryBase, BlogEntryDB } from "../../data/models";
import {
  BlogEntryFrontendPopulated,
  BlogEntryLeanPopulated,
  CommentLeanPopulated,
  BlogEntryPopulatedCommentsPopulatedLean,
  BlogEntryPopulatedCommentsPopulatedFrontend,
  BlogEntryLeanWithAuthor,
  BlogEntryFrontendWithAuthor,
} from "../../data/types";
import { createTransformer } from "../createTransformer";
import {
  transformComment,
  transformCommentPopulated,
} from "../comment/transformComment";
import { transformUser } from "../user/transformUser";

export const transformBlog = createTransformer<
  BlogEntryDB,
  BlogEntryBase,
  ExtendedPublicBlogFields,
  SensitivePublicBlogFields
>(
  EXTENDED_PUBLIC_BLOG_FIELDS,
  SENSITIVE_PUBLIC_BLOG_FIELDS,
  BLOG_FIELD_EXTENDER
);

export const transformBlogWithAuthor = (
  doc: BlogEntryLeanWithAuthor,
  userId?: string | null
) => {
  const blogPublic = transformBlog.toFrontend(doc, userId);
  const { author, ...baseDoc } = doc;
  const transformedAuthor = transformUser.toFrontend(author);
  const blogWithAuthor = {
    ...blogPublic,
    author: transformedAuthor,
  };
  return blogWithAuthor as BlogEntryFrontendWithAuthor;
};

export const transformBlogPopulated = (
  doc: BlogEntryLeanPopulated,
  userId?: string | null
) => {
  const blogPublic = transformBlog.toFrontend(doc, userId);
  const { author, comments, ...baseDoc } = doc;
  const transformedAuthor = transformUser.toFrontend(author);
  const transformedComments = comments.map((comment) =>
    transformComment.toFrontend(comment)
  );
  const populatedBlog = {
    ...blogPublic,
    author: transformedAuthor,
    comments: transformedComments,
  };
  return populatedBlog as BlogEntryFrontendPopulated;
};

export const transformBlogPopulatedWithCommentsPopulated = (
  doc: BlogEntryPopulatedCommentsPopulatedLean,
  userId?: string | null
): BlogEntryPopulatedCommentsPopulatedFrontend => {
  const blogPublic = transformBlog.toFrontend(doc, userId);
  const { author, comments, ...baseDoc } = doc;
  const transformedAuthor = transformUser.toFrontend(author);
  const transformedComments = comments.map((comment: CommentLeanPopulated) =>
    transformCommentPopulated(comment, userId)
  );
  const populatedBlog = {
    ...blogPublic,
    author: transformedAuthor,
    comments: transformedComments,
  } satisfies BlogEntryPopulatedCommentsPopulatedFrontend;
  return populatedBlog;
};

import {
  EXTENDED_PUBLIC_COMMENT_FIELDS,
  ExtendedPublicCommentFields,
  SENSITIVE_PUBLIC_COMMENT_FIELDS,
  SensitivePublicCommentFields,
} from "../../constants";
import { COMMENT_FIELD_EXTENDER } from "../../constants";
import { createTransformer } from "../createTransformer";
import {
  CommentLeanPopulated,
  CommentFrontendPopulated,
} from "../../data/types";
import { transformBlog } from "../blog/transformBlog";
import { transformUser } from "../user/transformUser";
import { CommentDB, CommentBase } from "../../data/models";

export const transformComment = createTransformer<
  CommentDB,
  CommentBase,
  ExtendedPublicCommentFields,
  SensitivePublicCommentFields
>(
  EXTENDED_PUBLIC_COMMENT_FIELDS,
  SENSITIVE_PUBLIC_COMMENT_FIELDS,
  COMMENT_FIELD_EXTENDER
);

export const transformCommentPopulated = (
  doc: CommentLeanPopulated,
  userId?: string | null
): CommentFrontendPopulated => {
  const comment = transformComment.toFrontend(doc, userId);
  const { author, blog, ...rest } = doc;
  return {
    ...comment,
    author: transformUser.toFrontend(author),
    blog: transformBlog.toFrontend(blog),
  } satisfies CommentFrontendPopulated;
};

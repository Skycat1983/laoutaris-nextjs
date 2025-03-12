import {
  EXTENDED_PUBLIC_COMMENT_FIELDS,
  SENSITIVE_PUBLIC_COMMENT_FIELDS,
} from "../constants";
import { COMMENT_FIELD_EXTENDER } from "../constants";
import { createTransformer } from "./createTransformer";
import { CommentLeanPopulated, CommentFrontendPopulated } from "../data/types";
import { transformBlog } from "./transformBlog";
import { transformUser } from "./transformUser";

export const transformComment = createTransformer(
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

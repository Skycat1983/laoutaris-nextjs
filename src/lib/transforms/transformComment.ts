import {
  EXTENDED_PUBLIC_COMMENT_FIELDS,
  SENSITIVE_PUBLIC_COMMENT_FIELDS,
} from "../constants";
import { PublicCommentTransformations } from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformUtils } from "./transformUtils";

export const transformComment = {
  toRaw: (
    doc: PublicCommentTransformations["Lean"]
  ): PublicCommentTransformations["Raw"] => {
    return transformMongooseDoc<PublicCommentTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicCommentTransformations["Raw"]
  ): PublicCommentTransformations["Extended"] => {
    return transformUtils.extend(doc, EXTENDED_PUBLIC_COMMENT_FIELDS);
  },

  toSanitized: (
    doc: PublicCommentTransformations["Extended"]
  ): PublicCommentTransformations["Sanitized"] => {
    return transformUtils.removeSensitive(doc, SENSITIVE_PUBLIC_COMMENT_FIELDS);
  },

  toFrontend: (
    doc: PublicCommentTransformations["Lean"]
  ): PublicCommentTransformations["Frontend"] => {
    return transformComment.toSanitized(
      transformComment.toExtended(transformComment.toRaw(doc))
    );
  },
};

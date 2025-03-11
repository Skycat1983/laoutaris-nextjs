import {
  EXTENDED_PUBLIC_BLOG_FIELDS,
  SENSITIVE_PUBLIC_BLOG_FIELDS,
  SensitivePublicBlogFields,
  ExtendedPublicBlogFields,
} from "../constants";
import {
  PublicBlogEntryTransformationsPopulated,
  PublicTransformationsGeneric,
} from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformUtils } from "./transformUtils";
import { transformUser } from "./transformUser";
import { transformComment } from "./transformComment";
import { BlogEntryDB } from "../data/models";

type PublicBlogEntryTransformations = PublicTransformationsGeneric<
  Partial<BlogEntryDB>,
  ExtendedPublicBlogFields,
  SensitivePublicBlogFields
>;

export const transformBlog = {
  toRaw: (
    doc: PublicBlogEntryTransformations["Lean"]
  ): PublicBlogEntryTransformations["Raw"] => {
    return transformMongooseDoc<PublicBlogEntryTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicBlogEntryTransformations["Raw"]
  ): PublicBlogEntryTransformations["Extended"] => {
    return transformUtils.extend(doc, EXTENDED_PUBLIC_BLOG_FIELDS);
  },

  toSanitized: (
    doc: PublicBlogEntryTransformations["Extended"]
  ): PublicBlogEntryTransformations["Sanitized"] => {
    return transformUtils.removeSensitive(doc, SENSITIVE_PUBLIC_BLOG_FIELDS);
  },

  toFrontend: (
    doc: PublicBlogEntryTransformations["Lean"]
  ): PublicBlogEntryTransformations["Frontend"] => {
    return transformBlog.toSanitized(
      transformBlog.toExtended(transformBlog.toRaw(doc))
    ) satisfies PublicBlogEntryTransformations["Frontend"];
  },

  toPopulated: (
    doc: PublicBlogEntryTransformationsPopulated["Lean"]
  ): PublicBlogEntryTransformationsPopulated["Frontend"] => {
    const { author, comments, ...baseDoc } = doc;
    const transformedBase = transformBlog.toFrontend(baseDoc);
    const transformedAuthor = transformUser.toFrontend(author);
    const transformedComments = comments.map((comment) =>
      transformComment.toFrontend(comment)
    );
    return {
      ...transformedBase,
      author: transformedAuthor,
      comments: transformedComments,
    } satisfies PublicBlogEntryTransformationsPopulated["Frontend"];
  },
};

// export function transformBlog(
//   document: BlogEntryTransformations["Lean"]
// ): BlogEntryTransformations["Frontend"] {
//   const transformedDoc: BlogEntryTransformations["Raw"] =
//     transformMongooseDoc<BlogEntryTransformations["Raw"]>(document);

//   return transformedDoc;
// }

// export function transformBlogPopulated(
//   document: BlogEntryTransformations["Lean"] & {
//     author: UserTransformations["Lean"];
//     comments: CommentTransformations["Lean"][];
//   }
// ): AdminBlogTransformations["Populated"] {
//   const { author, comments, ...rest } = document;

//   // Transform the base document
//   const transformedBlog: AdminBlogTransformations["Raw"] =
//     transformMongooseDoc<AdminBlogTransformations["Raw"]>(rest);

//   // Transform the author
//   const transformedAuthor: AdminUserTransformations["Raw"] =
//     transformMongooseDoc<AdminUserTransformations["Raw"]>(author);

//   // Transform the comments array
//   const transformedComments: AdminCommentTransformations["Raw"][] =
//     comments.map((comment) =>
//       transformMongooseDoc<AdminCommentTransformations["Raw"]>(comment)
//     );

//   return {
//     ...transformedBlog,
//     author: transformedAuthor,
//     comments: transformedComments,
//   } satisfies AdminBlogTransformations["Populated"];
// }

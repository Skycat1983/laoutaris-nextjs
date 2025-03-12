import {
  EXTENDED_PUBLIC_BLOG_FIELDS,
  SENSITIVE_PUBLIC_BLOG_FIELDS,
  SensitivePublicBlogFields,
  ExtendedPublicBlogFields,
} from "../constants";
import {
  AdminBlogTransformations,
  AdminBlogTransformationsPopulated,
  AdminCommentTransformations,
  AdminUserTransformations,
  // PublicBlogEntryTransformationsPopulated,
  PublicCommentTransformations,
  PublicTransformationsGeneric,
  PublicUserTransformations,
  WithPopulatedFields,
} from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformUtils } from "./transformUtils";
import { transformUser } from "./transformUser";
import { transformComment } from "./transformComment";
import { BlogEntryDB, CommentDB, UserDB } from "../data/models";
import { calculateReadTime } from "../utils/calcReadTime";

type PublicBlogEntryTransformations = PublicTransformationsGeneric<
  // Partial<BlogEntryDB>,
  BlogEntryDB,
  ExtendedPublicBlogFields,
  SensitivePublicBlogFields
>;

// type PublicBlogEntryTransformationsPopulated = PublicTransformationsGeneric<
//   WithPopulatedFields<
//     BlogEntryDB,
//     {
//       author: PublicUserTransformations["Lean"];
//       comments: PublicCommentTransformations["Lean"][];
//     }
//   >,
//   ExtendedPublicBlogFields,
//   SensitivePublicBlogFields
// >;

// export const transformBlog = {
//   toRaw: (
//     doc: PublicBlogEntryTransformations["Lean"]
//   ): PublicBlogEntryTransformations["Raw"] => {
//     return transformMongooseDoc<PublicBlogEntryTransformations["Raw"]>(doc);
//   },

//   toExtended: (
//     doc: PublicBlogEntryTransformations["Raw"]
//   ): PublicBlogEntryTransformations["Extended"] => {
//     return transformUtils.extend(doc, EXTENDED_PUBLIC_BLOG_FIELDS);
//   },

//   toSanitized: (
//     doc: PublicBlogEntryTransformations["Extended"]
//   ): PublicBlogEntryTransformations["Sanitized"] => {
//     return transformUtils.removeSensitive(doc, SENSITIVE_PUBLIC_BLOG_FIELDS);
//   },

//   toFrontend: (
//     doc: PublicBlogEntryTransformations["Lean"]
//   ): PublicBlogEntryTransformations["Frontend"] => {
//     return transformBlog.toSanitized(
//       transformBlog.toExtended(transformBlog.toRaw(doc))
//     ) satisfies PublicBlogEntryTransformations["Frontend"];
//   },

//   toPopulated: (
//     doc: PublicBlogEntryTransformationsPopulated["Lean"]
//   ): PublicBlogEntryTransformationsPopulated["Frontend"] => {
//     const { author, comments, ...baseDoc } = doc;
//     const transformedAuthor = transformUser.toFrontend(author);
//     const transformedComments = comments.map((comment) =>
//       transformComment.toFrontend(comment)
//     );

//     const transformedBase = transformBlog.toRaw(baseDoc);
//     const sanitizedBase = transformUtils.removeSensitive(
//       {
//         ...baseDoc,
//         ...EXTENDED_PUBLIC_BLOG_FIELDS,
//         readTime: calculateReadTime(baseDoc.text),
//       },
//       SENSITIVE_PUBLIC_BLOG_FIELDS
//     );

//     return {
//       ...sanitizedBase,
//       author: transformedAuthor,
//       comments: transformedComments,
//     } satisfies PublicBlogEntryTransformationsPopulated["Frontend"];
//   },
// };

// export function transformBlogPopulated(
//   document: AdminBlogTransformationsPopulated["Lean"]
// ): AdminBlogTransformationsPopulated["Frontend"] {
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
//   } satisfies AdminBlogTransformationsPopulated["Frontend"];
// }

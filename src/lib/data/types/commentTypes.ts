// import { FrontendBlogEntryUnpopulated } from "./blogTypes";
import { transformComment } from "@/lib/transforms/transformComment";
import { CommentDB } from "../models";
import { BlogEntryLean } from "./blogTypes";
import { UserLean } from "./userTypes";
import { LeanDocument, WithPopulatedFields } from "./utilTypes";

export type CommentLean = LeanDocument<CommentDB>;
export type CommentFrontend = ReturnType<typeof transformComment.toFrontend>;

export type CommentLeanPopulated = WithPopulatedFields<
  CommentLean,
  {
    author: UserLean;
    blog: BlogEntryLean;
  }
>;
// export type PublicCommentLean = LeanDocument<CommentDB>;
// export type PublicCommentRaw = TransformedDocument<PublicCommentLean>;
// export type PublicCommentExtended = Merge<
//   PublicCommentRaw,
//   PublicCommentExtensionFields
// >;
// export type PublicCommentSanitized = Omit<
//   PublicCommentExtended,
//   "_id" | "email"
// >;

// //! doc-specific transformation definitions
// export type PublicCommentTransformations = {
//   DB: CommentDB;
//   Lean: LeanDocument<PublicCommentTransformations["DB"]>;
//   Raw: TransformedDocument<PublicCommentTransformations["Lean"]>;
//   Extended: Merge<
//     PublicCommentTransformations["Raw"],
//     PublicCommentExtensionFields
//   >;
//   Sanitized: Omit<PublicCommentTransformations["Extended"], "_id" | "email">;
//   Frontend: PublicCommentTransformations["Sanitized"];
// };

// export type PublicCommentTransformationsPopulated = {
//   Lean: WithPopulatedFields<
//     PublicCommentTransformations["Lean"],
//     {
//       author: PublicUserTransformations["Lean"];
//       blog: PublicBlogEntryTransformations["Lean"];
//     }
//   >;
//   Raw: WithPopulatedFields<
//     PublicCommentTransformations["Raw"],
//     {
//       author: PublicUserTransformations["Raw"];
//       blog: PublicBlogEntryTransformations["Raw"];
//     }
//   >;
//   Frontend: WithPopulatedFields<
//     PublicCommentTransformations["Frontend"],
//     {
//       author: PublicUserTransformations["Frontend"];
//       blog: PublicBlogEntryTransformations["Frontend"];
//     }
//   >;
// };

// //! Frontend-specific types (safe)
// export type PublicComment = PublicCommentTransformations["Frontend"];
// export type PublicCommentPopulated =
//   PublicCommentTransformationsPopulated["Frontend"];

// export type CommentLean = MongoDocumentLean<CommentDB> & {
//   author: string;
//   blog: string;
// };

// export type CommentExtensionFields = {};

// export type CommentExtended = CommentLean & CommentExtensionFields;

// export type CommentSanitized = Omit<CommentExtended, "author" | "blog"> & {
//   author: UserSanitized;
//   blog: BlogEntrySanitized;
// };

// export type CommentFrontend = CommentSanitized;

// //! Populated Types

// export type CommentLeanPopulated = CommentLean & {
//   author: UserLean;
//   blog: BlogEntryLean;
// };

// export type CommentExtendedPopulated = CommentLeanPopulated & {
//   author: UserExtended;
//   blog: BlogEntryExtended;
// } & CommentExtensionFields;

// export type CommentSanitizedPopulated = Omit<
//   CommentLeanPopulated,
//   "author" | "blog"
// > & {
//   author: UserSanitized;
//   blog: BlogEntrySanitized;
// };

// export type CommentFrontendPopulated = Omit<
//   CommentSanitizedPopulated,
//   "author" | "blog"
// > & {
//   author: UserFrontend;
//   blog: BlogEntryFrontend;
// };

// export type CommentPublic = CommentSanitizedPopulated;

// export interface BaseFrontendComment {
//   _id: string;
//   text: string;
//   displayDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // type CommentAuthorType = FrontendUser | string;
// type PopulatedField<T> = string | T | Partial<T>;

// // Base comment type with flexible population
// export interface FrontendComment extends BaseFrontendComment {
//   author: PopulatedField<FrontendUser>;
//   blog: PopulatedField<FrontendBlogEntry>;
// }

// // Specific comment types for different use cases
// export interface FrontendCommentUnpopulated extends BaseFrontendComment {
//   author: string;
//   blog: string;
// }

// export interface FrontendCommentWithAuthor extends BaseFrontendComment {
//   author: FrontendUser;
//   blog: string;
// }

// type BlogNavFields = Pick<
//   FrontendBlogEntry,
//   "slug" | "title" | "imageUrl" | "subtitle"
// >;

// export interface FrontendCommentWithBlogNav extends BaseFrontendComment {
//   author: string;
//   blog: BlogNavFields;
// }

// // Full blog population
// export interface FrontendCommentWithBlogPost extends BaseFrontendComment {
//   author: string;
//   blog: FrontendBlogEntry;
// }

// type FrontendComment = PopulatedComment | UnpopulatedComment;

// Usage:
// const isOwner = comment.populated
//   ? session?.user?.id === comment.author._id
//   : session?.user?.id === comment.author;

// export type FrontendComment =
//   | FrontendCommentUnpopulated
//   | FrontendCommentWithAuthor;

// export interface FrontendCommentUnpopulated extends BaseFrontendComment {
//   author: string;
//   blogPost: string;
// }

// export interface FrontendCommentWithAuthor extends BaseFrontendComment {
//   author: FrontendUser;
//   blogPost: string;
// }

// export interface FrontendCommentWithBlogPost extends BaseFrontendComment {
//   author: string;
//   blogPost: FrontendBlogEntryUnpopulated;
// }

// export interface FrontendCommentWithAuthorAndBlogPost
//   extends BaseFrontendComment {
//   author: FrontendUser;
//   blogPost: FrontendBlogEntryUnpopulated;
// }

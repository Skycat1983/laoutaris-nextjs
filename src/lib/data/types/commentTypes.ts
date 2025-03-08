// import { FrontendBlogEntryUnpopulated } from "./blogTypes";
import { CommentDB } from "../models";
import { LeanDocument, TransformedDocument, Merge } from "./utilTypes";

interface CommentExtensionFields {
  // readTime?: number;
}

export type CommentLean = LeanDocument<CommentDB>;
export type CommentRaw = TransformedDocument<CommentLean>;
export type CommentExtended = Merge<CommentRaw, CommentExtensionFields>;
export type CommentSanitized = Omit<CommentExtended, "_id" | "email">;

//! doc-specific transformation definitions
export type CommentTransformations = {
  DB: CommentDB;
  Lean: CommentLean;
  Raw: CommentRaw;
  Extended: CommentExtended;
  Sanitized: CommentSanitized;
  Frontend: CommentSanitized;
};

//! Frontend-specific types (safe)
export type Comment = CommentTransformations["Frontend"];

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

import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";
import { BlogEntryDB } from "../models";
import { BlogEntryPopulatedFrontend } from "./populatedTypes";

export type BlogEntryLean = LeanDocument<BlogEntryDB>;
export type BlogEntryRaw = TransformedDocument<BlogEntryLean>;
export type BlogEntryExtended = Merge<BlogEntryRaw, { readTime?: number }>;
export type BlogEntrySanitized = Omit<
  BlogEntryExtended,
  "_id" | "createdAt" | "updatedAt"
>;

//! doc-specific transformation definitions
export type BlogEntryTransformations = {
  DB: BlogEntryDB;
  Lean: BlogEntryLean;
  Raw: BlogEntryRaw;
  Extended: BlogEntryExtended;
  Sanitized: BlogEntrySanitized;
  Frontend: BlogEntrySanitized;
};

//! Frontend-specific types (safe)
export type BlogEntry = BlogEntryTransformations["Frontend"];
export type BlogEntryPopulated = BlogEntryPopulatedFrontend;

export interface BlogFilterParams {
  key: "featured" | "pinned" | "tags" | null;
  value: string | null;
}

// export type BlogEntryFrontend = BlogEntrySanitized;
// export type BlogEntryFrontendPopulated = Omit<
//   BlogEntrySanitizedPopulated,
//   "author" | "comments"
// > & {
//   author: UserFrontend;
//   comments: CommentFrontend[];
// };

// export type BlogEntryPublic = BlogEntryLeanPopulated;

// export interface BaseBlogEntry {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   // tags: string[];
// }

// export interface FrontendBlogEntry extends BaseBlogEntry {
//   author: PopulatedField<FrontendUser>;
//   comments: PopulatedField<FrontendComment>[];
// }

// export interface FrontendBlogEntryUnpopulated extends BaseBlogEntry {
//   author: string;
//   comments: string[];
// }

// export interface FrontendBlogEntryWithAuthor extends FrontendBlogEntry {
//   author: FrontendUserUnpopulated;
//   comments: string[];
// }

// export interface FrontendBlogEntryWithComments extends FrontendBlogEntry {
//   author: string;
//   comments: FrontendCommentUnpopulated[];
// }

// export interface FrontendBlogEntryWithCommentAuthor extends BaseBlogEntry {
//   author: string;
//   comments: FrontendCommentWithAuthor[];
// }

// the BlogEntry as it is retrieved from the DB, using 'populate()' to add the author and comments
// export type BlogEntryLeanPopulated = BlogEntryLean & {
//   author: UserLean;
//   comments: CommentLean[];
// };

// // the populated BlogEntry as it is retrieved from the DB, with sensitive data removed from the author and comments
// export type BlogEntrySanitizedPopulated = Omit<
//   BlogEntryLeanPopulated,
//   "author" | "comments"
// > & {
//   author: UserSanitized;
//   comments: CommentSanitized[];
// };

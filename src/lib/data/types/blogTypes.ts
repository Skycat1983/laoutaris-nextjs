import { LeanDocument, Prettify, WithPopulatedFields } from "./utilTypes";
import { BlogEntryDB } from "../models";
import { UserFrontend, UserLean } from "./userTypes";
import {
  CommentFrontend,
  CommentFrontendPopulated,
  CommentLean,
  CommentLeanPopulated,
} from "./commentTypes";
import { transformBlog } from "@/lib/transforms/blog/transformBlog";
import { transformBlogPopulated } from "@/lib/transforms/blog/transformBlog";
export type BlogEntryLean = LeanDocument<BlogEntryDB>;
export type BlogEntryFrontend = ReturnType<typeof transformBlog.toFrontend>;

export type BlogEntryLeanPopulated = Prettify<
  WithPopulatedFields<
    BlogEntryLean,
    {
      author: UserLean;
      comments: CommentLean[];
    }
  >
>;

// export type BlogEntryFrontendReturn = Prettify<
//   ReturnType<typeof transformBlogPopulated>
// >;

export type BlogEntryFrontendPopulated = Prettify<
  WithPopulatedFields<
    BlogEntryFrontend,
    {
      author: UserFrontend;
      comments: CommentFrontend[];
    }
  >
>;

export type BlogEntryPopulatedCommentsPopulatedLean = WithPopulatedFields<
  BlogEntryLeanPopulated,
  {
    comments: CommentLeanPopulated[];
  }
>;

export type BlogEntryPopulatedCommentsPopulatedFrontend = WithPopulatedFields<
  BlogEntryFrontendPopulated,
  {
    comments: CommentFrontendPopulated[];
  }
>;

export type BlogEntry = Prettify<BlogEntryPopulatedCommentsPopulatedFrontend>;

// //! PUBLIC BLOG ENTRY
// export type PublicBlogEntryTransformations = {
//   DB: BlogEntryDB;
//   Lean: LeanDocument<PublicBlogEntryTransformations["DB"]>;
//   Raw: TransformedDocument<PublicBlogEntryTransformations["Lean"]>;
//   Extended: Merge<
//     PublicBlogEntryTransformations["Raw"],
//     ExtendedPublicBlogFields
//   >;
//   Sanitized: Omit<
//     PublicBlogEntryTransformations["Extended"],
//     SensitivePublicBlogFields
//   >;
//   Frontend: PublicBlogEntryTransformations["Sanitized"];
// };

// export type PublicBlogEntry = PublicBlogEntryTransformations["Frontend"];

// // ! PUBLIC BLOG ENTRY POPULATED
// export type PublicBlogEntryTransformationsPopulated = {
//   Lean: WithPopulatedFields<
//     PublicBlogEntryTransformations["Lean"],
//     {
//       author: PublicUserTransformations["Lean"];
//       comments: PublicCommentTransformations["Lean"][];
//     }
//   >;
//   Raw: WithPopulatedFields<
//     PublicBlogEntryTransformations["Raw"],
//     {
//       author: PublicUserTransformations["Raw"];
//       comments: PublicCommentTransformations["Raw"][];
//     }
//   >;
//   Extended: WithPopulatedFields<
//     PublicBlogEntryTransformations["Extended"],
//     {
//       author: PublicUserTransformations["Extended"];
//       comments: PublicCommentTransformations["Extended"][];
//     }
//   >;
//   Frontend: WithPopulatedFields<
//     PublicBlogEntryTransformations["Frontend"],
//     {
//       author: PublicUserTransformations["Frontend"];
//       comments: PublicCommentTransformations["Frontend"][];
//     }
//   >;
// };

// export type PublicBlogEntryPopulated =
//   PublicBlogEntryTransformationsPopulated["Frontend"];

//! PUBLIC BLOG ENTRY FILTER PARAMS
export interface BlogFilterParams {
  key: "featured" | "pinned" | "tags" | null;
  value: string | null;
}

//! Frontend-specific types (safe)
// export type PublicBlogEntryLean = LeanDocument<BlogEntryDB>;
// export type PublicBlogEntryRaw = TransformedDocument<PublicBlogEntryLean>;
// export type PublicBlogEntryExtended = Merge<
//   PublicBlogEntryRaw,
//   ExtendedPublicBlogFields
// >;
// export type PublicBlogEntrySanitized = Omit<
//   PublicBlogEntryExtended,
//   SensitivePublicBlogFields
// >;

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

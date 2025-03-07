import {
  CommentFrontend,
  FrontendComment,
  FrontendCommentUnpopulated,
  FrontendCommentWithAuthor,
} from "./commentTypes";
import {
  FrontendUser,
  FrontendUserUnpopulated,
  UserFrontend,
  UserLean,
  UserSanitized,
} from "./userTypes";
import { z } from "zod";
import { MongoDocumentLean } from "./utilTypes";
import { BlogEntryDB } from "../models";
import { CommentLean, CommentSanitized } from "./commentTypes";

// the BlogEntry as it is retrieved from the DB, using 'lean()' to strip out the Mongoose metadata
export type BlogEntryLean = MongoDocumentLean<BlogEntryDB> & {
  author: string;
  comments: string[];
};

// the BlogEntry as it is retrieved from the DB, using 'populate()' to add the author and comments
export type BlogEntryLeanPopulated = BlogEntryLean & {
  author: UserLean;
  comments: CommentLean[];
};

// the unpopulated BlogEntry as it is retrieved from the DB, with sensitive data removed
export type BlogEntrySanitized = Omit<
  BlogEntryLean,
  "createdAt" | "updatedAt" | "author" | "comments"
>;

// the populated BlogEntry as it is retrieved from the DB, with sensitive data removed from the author and comments
export type BlogEntrySanitizedPopulated = Omit<
  BlogEntryLeanPopulated,
  "author" | "comments"
> & {
  author: UserSanitized;
  comments: CommentSanitized[];
};

export type BlogEntryFrontend = BlogEntrySanitized;

export type BlogEntryFrontendPopulated = Omit<
  BlogEntryLeanPopulated,
  "author" | "comments"
> & {
  author: UserFrontend;
  comments: CommentFrontend[];
};

export type BlogEntryPublic = BlogEntryLeanPopulated;

export interface BaseBlogEntry {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  // tags: string[];
}

export interface FrontendBlogEntry extends BaseBlogEntry {
  author: PopulatedField<FrontendUser>;
  comments: PopulatedField<FrontendComment>[];
}

export interface FrontendBlogEntryUnpopulated extends BaseBlogEntry {
  author: string;
  comments: string[];
}

export interface FrontendBlogEntryWithAuthor extends FrontendBlogEntry {
  author: FrontendUserUnpopulated;
  comments: string[];
}

export interface FrontendBlogEntryWithComments extends FrontendBlogEntry {
  author: string;
  comments: FrontendCommentUnpopulated[];
}

export interface FrontendBlogEntryWithCommentAuthor extends BaseBlogEntry {
  author: string;
  comments: FrontendCommentWithAuthor[];
}

export interface BlogFilterParams {
  key: "featured" | "pinned" | "tags" | null;
  value: string | null;
}

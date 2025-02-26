import {
  FrontendComment,
  FrontendCommentUnpopulated,
  FrontendCommentWithAuthor,
} from "./commentTypes";
import { FrontendUser, FrontendUserUnpopulated } from "./userTypes";
import { z } from "zod";

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

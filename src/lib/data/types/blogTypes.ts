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
  tags: string[];
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

// export interface FrontendBlogEntryFull {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: FrontendUserFull;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   // comments:
//   tags: string[];
// }

// export interface FrontendBlogEntryWithAuthor {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: FrontendUserFull;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   tags: string[];
// }

// export interface FrontendBlogEntryWithComments {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: FrontendUserFull;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   comments: FrontendCommentUnpopulated[];
//   tags: string[];
// }

// export interface FrontendBlogEntryUnpopulated {
//   _id: string;
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   tags: string[];
// }

// export interface FrontendBlogEntry {
//   title: string;
//   subtitle: string;
//   summary: string;
//   text: string;
//   author: string;
//   imageUrl: string;
//   slug: string;
//   displayDate: Date;
//   featured: boolean;
//   tags: string[];
// }

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Blog text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  displayDate: z.date(),
  featured: z.boolean(),
  tags: z.array(z.string()),
});

export type UpdateBlogFormValues = z.infer<typeof updateBlogSchema>;

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  text: z.string().min(50, "Blog text must be at least 50 characters"),
  imageUrl: z.string().url("Invalid URL"),
  displayDate: z.date(),
  featured: z.boolean().default(false),
  // tags: z.array(z.string()),
});

export type CreateBlogFormValues = z.infer<typeof createBlogSchema>;

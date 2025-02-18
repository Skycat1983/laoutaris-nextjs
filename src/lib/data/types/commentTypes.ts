// import { FrontendBlogEntryUnpopulated } from "./blogTypes";
import { FrontendBlogEntry } from "./blogTypes";
import { FrontendUser } from "./userTypes";

interface BaseFrontendComment {
  _id: string;
  text: string;
  displayDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// type CommentAuthorType = FrontendUser | string;
type PopulatedField<T> = string | T | Partial<T>;

// Base comment type with flexible population
export interface FrontendComment extends BaseFrontendComment {
  author: PopulatedField<FrontendUser>;
  blog: PopulatedField<FrontendBlogEntry>;
}

// Specific comment types for different use cases
export interface FrontendCommentUnpopulated extends BaseFrontendComment {
  author: string;
  blog: string;
}

export interface FrontendCommentWithAuthor extends BaseFrontendComment {
  author: FrontendUser;
  blog: string;
}

type BlogNavFields = Pick<FrontendBlogEntry, "slug" | "title">;

export interface FrontendCommentWithBlogNav extends BaseFrontendComment {
  author: string;
  blog: BlogNavFields;
}

// Full blog population
export interface FrontendCommentWithBlogPost extends BaseFrontendComment {
  author: string;
  blog: FrontendBlogEntry;
}

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

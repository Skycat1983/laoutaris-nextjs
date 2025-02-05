import { FrontendBlogEntryUnpopulated } from "./blogTypes";
import { FrontendUser } from "./userTypes";

interface BaseFrontendComment {
  _id: string;
  text: string;
  displayDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// type CommentAuthorType = FrontendUser | string;
type PopulatedField<T> = string | T;

export interface FrontendComment extends BaseFrontendComment {
  author: PopulatedField<FrontendUser>;
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

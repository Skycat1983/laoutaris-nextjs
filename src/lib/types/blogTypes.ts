import { FrontendComment } from "./commentTypes";
import { FrontendUser } from "./userTypes";

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

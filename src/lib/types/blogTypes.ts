import { FrontendUserFull } from "./userTypes";

export interface FrontendBlogEntryFull {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  // comments:
  tags: string[];
}

export interface FrontendBlogEntryWithAuthor {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: FrontendUserFull;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  tags: string[];
}

export interface FrontendBlogEntryUnpopulated {
  _id: string;
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  displayDate: Date;
  featured: boolean;
  tags: string[];
}

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

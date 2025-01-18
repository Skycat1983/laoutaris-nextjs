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
  tags: string[];
}

export interface FrontendBlogEntryMinimal {
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

// export interface IFrontendBlogEntry {
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

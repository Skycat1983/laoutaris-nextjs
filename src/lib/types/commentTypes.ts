import { FrontendUserUnpopulated } from "./userTypes";

export interface FrontendCommentUnpopulated {
  _id: string;
  text: string;
  author: string;
  blogPost: string;
  displayDate: Date;
}

export interface FrontendCommentWithAuthor {
  _id: string;
  text: string;
  author: FrontendUserUnpopulated;
  blogPost: string;
  displayDate: Date;
}

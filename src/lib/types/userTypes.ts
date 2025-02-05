import { FrontendArtwork } from "./artworkTypes";
import { FrontendComment } from "./commentTypes";

export interface BaseFrontendUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Each field can be either unpopulated or populated
type PopulatedField<T> = string | T;

// Define the user interface with populatable fields
export interface FrontendUser extends BaseFrontendUser {
  comments: PopulatedField<FrontendComment>[];
  watchlist: PopulatedField<FrontendArtwork>[];
  favourites: PopulatedField<FrontendArtwork>[];
}
// export type FrontendUser = BaseFrontendUser & UserCommentsType;

// export interface FrontendUserComments extends BaseFrontendUser {
//   comments: UserCommentType[];
// }

// export interface FrontendUserUnpopulated extends BaseFrontendUser {
//   _id: string;
//   email: string;
//   username: string;
//   role: "user" | "admin";
//   comments: string[] | [];

//   watchlist: string[] | [];
//   favourites: string[] | [];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export type FrontendUser =
//   | FrontendUserFull
//   | FrontendUserWithWatcherlist
//   | FrontendUserWithFavourites
//   FrontendUserWithComments | FrontendUserUnpopulated;

// export interface FrontendUserFull {
//   _id: string;
//   email: string;

//   username: string;
//   role: "user" | "admin";
//   comments: FrontendComment[];
//   watchlist: FrontendArtworkFull[] | [];
//   favourites: FrontendArtworkFull[] | [];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface FrontendUserWithWatcherlist {
//   _id: string;
//   email: string;

//   username: string;
//   role: "user" | "admin";
//   comments: string[] | [];
//   watchlist: FrontendArtworkFull[] | [];
//   favourites: string[] | [];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface FrontendUserWithFavourites {
//   _id: string;
//   email: string;

//   username: string;
//   role: "user" | "admin";
//   comments: string[] | [];

//   watchlist: string[] | [];
//   favourites: FrontendArtworkFull[] | [];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface FrontendUserUnpopulated extends BaseFrontendUser {
//   _id: string;
//   email: string;
//   username: string;
//   role: "user" | "admin";
//   comments: string[] | [];

//   watchlist: string[] | [];
//   favourites: string[] | [];
//   createdAt: Date;
//   updatedAt: Date;
// }

import { UserDB } from "../models";
import { Merge, TransformedDocument } from "./utilTypes";

export type UserTransformations = {
  DB: UserDB;
  Raw: TransformedDocument<UserDB>;
  Extended: Merge<TransformedDocument<UserDB>, { isOnline?: boolean }>;
  Sanitized: Omit<UserTransformations["Extended"], "password" | "email">;
  Frontend: UserTransformations["Sanitized"];
};

//! Frontend-specific types (safe)
export type User = UserTransformations["Frontend"];

// export type UserExtensionFields = {};

// export type UserExtended = UserLean & UserExtensionFields;

// export type UserSanitized = Omit<
//   UserExtended,
//   "_id" | "password" | "email" | "comments" | "watchlist" | "favourites"
// >;

// //! Populated Types

// export type UserLeanPopulated = UserLean & {
//   comments: CommentLean[];
//   watchlist: ArtworkLean[];
//   favourites: ArtworkLean[];
// };

// export type UserExtendedPopulated = Omit<
//   UserLeanPopulated,
//   "comments" | "watchlist" | "favourites"
// > & {
//   comments: CommentExtended[];
//   watchlist: ArtworkExtended[];
//   favourites: ArtworkExtended[];
// } & UserExtensionFields;

// export type UserSanitizedPopulated = Omit<
//   UserExtendedPopulated,
//   "comments" | "watchlist" | "favourites"
// > & {
//   comments: CommentSanitized[];
//   watchlist: ArtworkSanitized[];
//   favourites: ArtworkSanitized[];
// };

// export type UserFrontend = UserSanitized;

// export type UserFrontendPopulated = Omit<
//   UserSanitizedPopulated,
//   "comments" | "watchlist" | "favourites"
// > & {
//   comments: CommentFrontend[];
//   watchlist: ArtworkFrontend[];
//   favourites: ArtworkFrontend[];
// };

// export type SerializableUser = Omit<
//   UserDB,
//   "comments" | "watchlist" | "favourites"
// > & {
//   _id: string;
//   comments: string[];
//   watchlist: string[];
//   favourites: string[];
// };

// export interface BaseFrontendUser {
//   _id: string;
//   email: string;
//   username: string;
//   role: "user" | "admin";
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Each field can be either unpopulated or populated
// type PopulatedField<T> = string | T | Partial<T>;

// // Base user type with flexible population
// export interface FrontendUser extends BaseFrontendUser {
//   comments: PopulatedField<FrontendComment>[];
//   watchlist: PopulatedField<FrontendArtwork>[];
//   favourites: PopulatedField<FrontendArtwork>[];
// }

// // Specific user type for the comments view
// export interface FrontendUserWithComments extends BaseFrontendUser {
//   comments: FrontendCommentWithBlogNav[]; // Using the nav-specific comment type
//   watchlist: string[];
//   favourites: string[];
// }

// export interface FrontendUserWithWatchlist extends FrontendUser {
//   comments: string[];
//   watchlist: FrontendArtwork[];
//   favourites: string[];
// }

// export interface FrontendUserWithFavourites extends FrontendUser {
//   comments: string[];
//   watchlist: string[];
//   favourites: FrontendArtwork[];
// }

// export interface FrontendUserUnpopulated extends BaseFrontendUser {
//   comments: string[];
//   watchlist: string[];
//   favourites: string[];
// }

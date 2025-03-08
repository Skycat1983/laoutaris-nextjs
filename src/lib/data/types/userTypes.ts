import { UserDB } from "../models";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

// Individual types for direct use
export type UserLean = LeanDocument<UserDB>;
export type UserRaw = TransformedDocument<UserLean>;
export type UserExtended = Merge<UserRaw, { isOnline?: boolean }>;
export type UserSanitized = Omit<UserExtended, "password" | "email">;

// Transformation object for pipeline operations
export type UserTransformations = {
  DB: UserDB;
  Lean: UserLean;
  Raw: UserRaw;
  Extended: UserExtended;
  Sanitized: UserSanitized;
  Frontend: UserSanitized;
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

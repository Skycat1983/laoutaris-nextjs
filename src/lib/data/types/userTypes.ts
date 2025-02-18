import { DBUser } from "../models";
import { FrontendArtwork } from "./artworkTypes";
import { FrontendBlogEntry } from "./blogTypes";
import { FrontendComment, FrontendCommentWithBlogNav } from "./commentTypes";

export type SerializableUser = Omit<
  DBUser,
  "comments" | "watchlist" | "favourites"
> & {
  _id: string;
  comments: string[];
  watchlist: string[];
  favourites: string[];
};

export interface BaseFrontendUser {
  _id: string;
  email: string;
  username: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Each field can be either unpopulated or populated
type PopulatedField<T> = string | T | Partial<T>;

// Base user type with flexible population
export interface FrontendUser extends BaseFrontendUser {
  comments: PopulatedField<FrontendComment>[];
  watchlist: PopulatedField<FrontendArtwork>[];
  favourites: PopulatedField<FrontendArtwork>[];
}

// Specific user type for the comments view
export interface FrontendUserWithComments extends BaseFrontendUser {
  comments: FrontendCommentWithBlogNav[]; // Using the nav-specific comment type
  watchlist: string[];
  favourites: string[];
}

export interface FrontendUserWithWatchlist extends FrontendUser {
  comments: string[];
  watchlist: FrontendArtwork[];
  favourites: string[];
}

export interface FrontendUserWithFavourites extends FrontendUser {
  comments: string[];
  watchlist: string[];
  favourites: FrontendArtwork[];
}

export interface FrontendUserUnpopulated extends BaseFrontendUser {
  comments: string[];
  watchlist: string[];
  favourites: string[];
}
